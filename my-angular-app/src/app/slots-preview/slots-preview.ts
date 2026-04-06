import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule,FormsModule } from '@angular/forms';
import {DAYS} from '../models/appointment.model';

import { generateSlots } from '../time.util';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-slots-preview',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatChipsModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatInputModule
  ],
  templateUrl: './slots-preview.html',
  styleUrl: './slots-preview.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlotsPreviewComponent {
  @Input({ required: true }) weekly!: FormArray<FormGroup>;
  @Input({ required: true }) exceptions!: FormArray<FormGroup>;

  selectedDate: Date | null = new Date();

  get previewSlots(): { start: string; end: string }[] {
    if (!this.selectedDate) return [];
    const iso = this.toISODate(this.selectedDate);

    // Check exception first
    const ex = this.exceptions.controls.find(c => this.toISODate(c.get('date')?.value) === iso);
    if (ex) {
      if (ex.get('unavailable')?.value) return [];
      const start = ex.get('startTime')?.value;
      const end = ex.get('endTime')?.value;
      const slot = Number(ex.get('slotMinutes')?.value);
      if (!start || !end || !slot) return [];
      return generateSlots(start, end, slot, []);
    }

    // fallback weekly
    const dow = this.selectedDate.getDay(); // 0..6
    const dg = this.weekly.controls.find(c => c.get('day')?.value === dow);
    if (!dg || dg.get('enabled')?.value !== true) return [];

    const start = dg.get('startTime')?.value;
    const end = dg.get('endTime')?.value;
    const slot = Number(dg.get('slotMinutes')?.value);
    const breaks = (dg.get('breaks')?.value ?? []) as { start: string; end: string }[];
    if (!start || !end || !slot) return [];
    return generateSlots(start, end, slot, breaks);
  }

  private toISODate(d: any): string {
    if (!d) return '';
    const dt = (d instanceof Date) ? d : new Date(d);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  dayLabel(): string {
    if (!this.selectedDate) return '';
    return DAYS[this.selectedDate.getDay()].label;
  }
}

