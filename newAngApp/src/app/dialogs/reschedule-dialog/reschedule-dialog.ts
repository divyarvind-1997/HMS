import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors
} from '@angular/forms';import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';

import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
  NativeDateAdapter
} from '@angular/material/core';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentList } from '../../appointment-list/appointment-list';

interface Slot {
  slotId: number;
  startTime: string;
  endTime: string;
}
@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    CommonModule, ReactiveFormsModule,
  MatDatepickerModule,
  ],
  
 providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS }
  ],

  templateUrl:'./reschedule-dialog.html'
})
export class RescheduleDialogComponent {
  availableSlots: Slot[] = [];

  form!: FormGroup;
  minDateStr = ''; // for <input type="date" min="...">

  constructor(
    private dialogRef: MatDialogRef<RescheduleDialogComponent>,private fb: FormBuilder,private router:Router,private api:AppointmentService,
    @Inject(MAT_DIALOG_DATA) 
    public data: { appointmentId: number; doctorId: number }
  ) {}
ngOnInit(): void {
    this.minDateStr = this.formatDateToYYYYMMDD(new Date());

    this.form = this.fb.group(
      {
        appointmentDate: ['', [Validators.required]],
        slot: ['', [Validators.required]],
      },
      {
        validators: [
          this.dateNotInPastValidator('appointmentDate'),
        ]
      }
    );
        this.form.get('appointmentDate')!.valueChanges.subscribe(() => this.loadSlots());

  }
  close() {
    this.dialogRef.close();
  }

  loadSlots()
  {
    const date = this.form.get('appointmentDate')?.value;
  if (!date) return;
    const dateObj: Date = this.form.get('appointmentDate')?.value;
const year = dateObj.getFullYear();
const month = String(dateObj.getMonth() + 1).padStart(2, '0');
const day = String(dateObj.getDate()).padStart(2, '0');

const formattedDate = `${year}-${month}-${day}`; // ✅ yyyy-MM-dd


const payload = {
  doctorId: this.data.doctorId,
  appointmentDate: formattedDate   // ✅ STRING, NOT Date
};
    this.api.getAvailableTimeSlots(payload).subscribe({
      next: (res) => { 
        if(res.length > 0)
        {this.availableSlots = res; }
        else{ alert("Doctor is not available on the selected dates")}
         },
      error: () => { this.availableSlots = [];  }
    });
  }
  formatTime(time: string): string {
  if (!time) return '';

  const [hours, minutes] = time.split(':').map(Number);

  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

  confirm() {
    this.dialogRef.close({
      // newDate: this.newDate,
      // reason: this.reason
    });
  }
   onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = {
      appointmentId: this.data.appointmentId,
      appointmentDate: this.form.value.appointmentDate, // YYYY-MM-DD
            slotId: this.form.value.slot,
      startTime: this.availableSlots.find(x=>x.slotId=this.form.value.slot)?.startTime, // "10:30"
      endTime: this.availableSlots.find(x=>x.slotId=this.form.value.slot)?.endTime, // "10:30"
    };

        this.dialogRef.close(payload);

   }
    private dateNotInPastValidator(dateControlName: string) {
    return (group: AbstractControl): ValidationErrors | null => {
      const ctrl = group.get(dateControlName);
      if (!ctrl || !ctrl.value) return null;

      // ctrl.value from <input type="date"> is 'YYYY-MM-DD'
      const selected = new Date(ctrl.value + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return selected < today ? { dateInPast: true } : null;
    };
  }
   private formatDateToYYYYMMDD(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}