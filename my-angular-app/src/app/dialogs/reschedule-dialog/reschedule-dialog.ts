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
  availableSlots: string[] = [];
  form!: FormGroup;
  minDateStr = ''; // for <input type="date" min="...">

  constructor(
    private dialogRef: MatDialogRef<RescheduleDialogComponent>,private fb: FormBuilder,private router:Router,
    @Inject(MAT_DIALOG_DATA) public data: { appointmentId: string }
  ) {}
ngOnInit(): void {
    this.minDateStr = this.formatDateToYYYYMMDD(new Date());
    this.availableSlots= ['10:00', '10:30', '11:00', '16:00'];

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
  }
  close() {
    this.dialogRef.close();
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
      appointmentDate: this.form.value.appointmentDate, // YYYY-MM-DD
      slot: this.form.value.slot, // "10:30"
      reason: this.form.value.reason.trim()
    };

  this.router.navigate(['/appointments']);
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