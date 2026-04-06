import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentService } from '../services/appointment.service';  
import { AppointmentLite, DayColumn, LeaveBlock, SlotCell } from '../models/appointment.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-weekly-slot-matrix',
  templateUrl: './weekly-slot-matrix.component.html',
  styleUrls: ['./weekly-slot-matrix.component.scss']
})
export class WeeklySlotMatrixComponent implements OnInit {
  @Input() doctorId!: number;

  form = this.fb.group({
    anyDateInWeek: [new Date(), Validators.required],
    slotMinutes: [15, [Validators.required, Validators.min(5)]],
    dayStart: ['09:00', Validators.required],
    dayEnd: ['17:00', Validators.required]
  });

  weekStart!: Date;              // Monday
  timeLabels: string[] = [];     // row labels
  columns: DayColumn[] = [];     // 7 days with slots
  loading = false;

  constructor(
    private fb: FormBuilder,
    private api: AppointmentService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.buildWeek();
  }

  buildWeek(): void {
    const d = this.form.value.anyDateInWeek!;
    this.weekStart = this.getMonday(d);

    this.loading = true;

    const weekStartIso = this.toDateIso(this.weekStart);
    const weekEnd = new Date(this.weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const fromIso = weekStartIso + 'T00:00:00.000Z';
    const toIso = this.toDateIso(weekEnd) + 'T00:00:00.000Z';

    forkJoin({
      appts: this.api.getAppointmentsForRange(this.doctorId, fromIso, toIso),
      leave: this.api.getLeaveBlocksForWeek(this.doctorId, weekStartIso)
    }).subscribe({
      next: ({ appts, leave }) => {
        this.generateMatrix(appts, leave);
        this.loading = false;
      },
      error: () => {
        // still show grid even if backend not ready
        this.generateMatrix([], []);
        this.loading = false;
        this.snack.open('Loaded grid (no backend data)', 'Close', { duration: 2000 });
      }
    });
  }

  private generateMatrix(appts: AppointmentLite[], leaveBlocks: LeaveBlock[]): void {
    const slotMinutes = this.form.value.slotMinutes!;
    const dayStart = this.form.value.dayStart!;
    const dayEnd = this.form.value.dayEnd!;

    this.timeLabels = this.buildTimeLabels(dayStart, dayEnd, slotMinutes);

    const days: DayColumn[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.weekStart);
      date.setDate(date.getDate() + i);
      const dateIso = this.toDateIso(date);

      const slots = this.buildDaySlots(dateIso, dayStart, dayEnd, slotMinutes);

      // Apply LEAVE blocks
      this.applyLeave(slots, dateIso, leaveBlocks);

      // Apply BOOKED from appointments (read-only)
      this.applyBooked(slots, dateIso, appts);

      days.push({
        dateIso,
        label: this.formatDayLabel(date),
        slots
      });
    }

    this.columns = days;
  }

  onSlotClick(cell: SlotCell): void {
    if (cell.status === 'BOOKED') return; // locked
    cell.status = (cell.status === 'AVAILABLE') ? 'LEAVE' : 'AVAILABLE';
  }

  save(): void {
    const weekStartIso = this.toDateIso(this.weekStart);
    const blocks = this.extractLeaveBlocksFromGrid();
    this.api.saveLeaveBlocksForWeek(this.doctorId, weekStartIso, blocks).subscribe({
      next: () => this.snack.open('Availability saved', 'Close', { duration: 1800 }),
      error: () => this.snack.open('Save failed', 'Close', { duration: 2500 })
    });
  }

  // ---------- helpers ----------

  private buildDaySlots(dateIso: string, startHM: string, endHM: string, slotMinutes: number): SlotCell[] {
    const start = this.buildUtcDate(dateIso, startHM).getTime();
    const end = this.buildUtcDate(dateIso, endHM).getTime();
    const step = slotMinutes * 60 * 1000;

    const slots: SlotCell[] = [];
    for (let t = start; t + step <= end; t += step) {
      slots.push({
        startIso: new Date(t).toISOString(),
        endIso: new Date(t + step).toISOString(),
        status: 'AVAILABLE'
      });
    }
    return slots;
  }

  private applyLeave(slots: SlotCell[], dateIso: string, leaveBlocks: LeaveBlock[]) {
    const blocks = leaveBlocks.filter(b => b.dateIso === dateIso);
    for (const b of blocks) {
      const bStart = this.buildUtcDate(dateIso, b.startTime).getTime();
      const bEnd = this.buildUtcDate(dateIso, b.endTime).getTime();
      for (const s of slots) {
        const sStart = new Date(s.startIso).getTime();
        const sEnd = new Date(s.endIso).getTime();
        if (sStart < bEnd && bStart < sEnd) {
          s.status = 'LEAVE';
        }
      }
    }
  }

  private applyBooked(slots: SlotCell[], dateIso: string, appts: AppointmentLite[]) {
    const booked = appts.filter(a => a.status === 'BOOKED' && a.startDateTime.slice(0, 10) === dateIso);
    for (const a of booked) {
      const aStart = new Date(a.startDateTime).getTime();
      const aEnd = new Date(a.endDateTime).getTime();
      for (const s of slots) {
        const sStart = new Date(s.startIso).getTime();
        const sEnd = new Date(s.endIso).getTime();
        if (sStart < aEnd && aStart < sEnd) {
          s.status = 'BOOKED';
          s.appointmentId = a.id;
        }
      }
    }
  }

  // Convert LEAVE cells into compact blocks for backend
  private extractLeaveBlocksFromGrid(): LeaveBlock[] {
    const blocks: LeaveBlock[] = [];

    for (const day of this.columns) {
      const leaveSlots = day.slots.filter(s => s.status === 'LEAVE');

      // merge consecutive leave slots
      let i = 0;
      while (i < leaveSlots.length) {
        const start = leaveSlots[i];
        let end = start;
        i++;

        while (i < leaveSlots.length) {
          const prevEnd = new Date(end.endIso).getTime();
          const nextStart = new Date(leaveSlots[i].startIso).getTime();
          if (prevEnd === nextStart) {
            end = leaveSlots[i];
            i++;
          } else break;
        }

        blocks.push({
          dateIso: day.dateIso,
          startTime: this.toTimeHM(start.startIso),
          endTime: this.toTimeHM(end.endIso)
        });
      }
    }

    return blocks;
  }

  chipClass(status: SlotCell['status']): string {
    return status.toLowerCase(); // available / leave / booked
  }

  private buildTimeLabels(startHM: string, endHM: string, slotMinutes: number): string[] {
    const labels: string[] = [];
    const baseDate = '2000-01-01';
    let t = this.buildUtcDate(baseDate, startHM).getTime();
    const end = this.buildUtcDate(baseDate, endHM).getTime();
    const step = slotMinutes * 60 * 1000;

    while (t + step <= end) {
      labels.push(this.toTimeHM(new Date(t).toISOString()));
      t += step;
    }
    return labels;
  }

  private getMonday(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay(); // 0..6
    const diff = (day === 0 ? -6 : 1 - day); // Monday start
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private toDateIso(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  private buildUtcDate(dateIso: string, hm: string): Date {
    const [y, m, d] = dateIso.split('-').map(Number);
    const [hh, mm] = hm.split(':').map(Number);
    return new Date(Date.UTC(y, m - 1, d, hh, mm, 0));
  }

  private toTimeHM(iso: string): string {
    const dt = new Date(iso);
    const hh = String(dt.getUTCHours()).padStart(2, '0');
    const mm = String(dt.getUTCMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  private formatDayLabel(d: Date): string {
    return d.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' });
  }
}