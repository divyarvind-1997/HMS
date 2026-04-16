import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule,Validators,AbstractControl,
  ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { AppointmentService } from '../services/appointment.service';
import { MatSelectModule } from '@angular/material/select';

interface Doctor {
  doctorId: number;
  doctorName: string;
  specialization: string;
}
@Component({
  selector: 'app-doctor-availability',
  imports: [CommonModule,
MatFormFieldModule,
MatInputModule,
MatDatepickerModule,
MatNativeDateModule,
MatButtonModule,
ReactiveFormsModule,
MatChipsModule,
MatDividerModule,
MatCardModule,MatButtonToggleModule,MatOptionModule,MatSelectModule
  ],
  templateUrl: './doctor-availability.html',
  styleUrl: './doctor-availability.css',
  standalone:true
})

export class DoctorAvailability implements OnInit {

  dateForm!: FormGroup;
  minDateStr = ''; // for <input type="date" min="...">
// doctorId:number = 1;
selectedDate!: Date;
  slots: any[] = [];
  filteredDoctors: Doctor[] = [];

  constructor(
    private fb: FormBuilder,
    private api: AppointmentService,private router:Router
  ) {}

  ngOnInit(): void {
        this.minDateStr = this.formatDateToYYYYMMDD(new Date());
    this.dateForm = this.fb.group({
      availabledate: ['', Validators.required],
      doctorId: [null, Validators.required],
    },
  {
        validators: [
          this.dateNotInPastValidator('availabledate'),
        ]
      }
  );

    this.loadAllDoctors();

  }
  loadAllDoctors()
  {
 this.api
    .getDoctorsBySpecialization("All")
    .subscribe(res => {
      this.filteredDoctors = res;
    });
  }
get f() {
    return this.dateForm.controls;
  }
  saveAvailability(): void {
    if (this.dateForm.invalid) {
      this.dateForm.markAllAsTouched();
      return;
    }

    const dateObj: Date = this.dateForm.value.availabledate;

const year = dateObj.getFullYear();
const month = String(dateObj.getMonth() + 1).padStart(2, '0');
const day = String(dateObj.getDate()).padStart(2, '0');

const formattedDate = `${year}-${month}-${day}`; // ✅ yyyy-MM-dd

    const payload = {
  doctorId: this.dateForm.value.doctorId,
  slotDate: formattedDate, // yyyy-MM-dd
  slots:this.slots.filter(s => s.isAvailable === true)
};

this.api.saveDoctorAvailability(payload)
  .subscribe(() => {
    alert('Doctor availability saved successfully');
        this.dateForm.reset();
  });
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
  
loadSlots() {
   if (this.dateForm.invalid) {
      this.dateForm.markAllAsTouched();
      return;
    }
    this.selectedDate = this.dateForm.value.availabledate!;
    this.generateSlots();
  }

onSlotSelectionChange(slot: any, selected: boolean) {
    slot.isAvailable = selected;  // ✅ sync UI selection to your model
  }

  trackBySlot(_: number, slot: any) {
    return slot.id ?? `${slot.startTime}-${slot.endTime}`;
  }
selectAll() {
  this.slots.forEach(s => s.isAvailable = true);
}

clearAll() {
  this.slots.forEach(s => s.isAvailable = false);
}

  // ✅ predefined slots (fastest)
  generateSlots() {
   this.slots = [
  { startTime: '09:00:00', endTime: '09:30:00', display: '09:00 AM - 09:30 AM', isAvailable: false },
  { startTime: '09:30:00', endTime: '10:00:00', display: '09:30 AM - 10:00 AM', isAvailable: false },
  { startTime: '10:00:00', endTime: '10:30:00', display: '10:00 AM - 10:30 AM', isAvailable: false },
  { startTime: '10:30:00', endTime: '11:00:00', display: '10:30 AM - 11:00 AM', isAvailable: false },
  { startTime: '11:30:00', endTime: '12:00:00', display: '11:30 AM - 12:00 PM', isAvailable: false },
  { startTime: '12:30:00', endTime: '13:00:00', display: '12:30 PM - 01:00 PM', isAvailable: false },
  { startTime: '15:30:00', endTime: '16:00:00', display: '03:30 PM - 04:00 PM', isAvailable: false },
  { startTime: '16:30:00', endTime: '17:00:00', display: '04:30 PM - 05:00 PM', isAvailable: false },
  { startTime: '17:30:00', endTime: '18:00:00', display: '05:30 PM - 06:00 PM', isAvailable: false },
  { startTime: '18:30:00', endTime: '19:00:00', display: '06:30 PM - 07:00 PM', isAvailable: false }
];

  }

  toggle(slot: any) {
    slot.isAvailable = !slot.isAvailable;
  }
 onClickBack()
  {
  this.router.navigate(['/appointments']);
  }
}

