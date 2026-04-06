import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../services/appointment.service';  
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatNativeDateModule } from '@angular/material/core';

type VisitType = 'IN_PERSON' | 'TELE';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  supportsTele: boolean;
}

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDividerModule

  ],
  templateUrl: './book-appointment.html',
})
export class BookAppointmentComponent implements OnInit {
  form!: FormGroup;

  // Example drop-down data (replace with API later)
  specializations = ['General Medicine', 'Dermatology', 'Cardiology', 'Pediatrics'];

  doctors: Doctor[] = [
    { id: 1, name: 'Dr. Meera', specialization: 'Dermatology', supportsTele: true },
    { id: 2, name: 'Dr. Anand', specialization: 'Cardiology', supportsTele: false },
    { id: 3, name: 'Dr. Riya', specialization: 'General Medicine', supportsTele: true },
  ];

  filteredDoctors: Doctor[] = [];
  availableSlots: string[] = [];

 slots: string[] = [];
  loadingSlots = false;

  minDateStr = ''; // for <input type="date" min="...">

  constructor(private fb: FormBuilder, private api: AppointmentService,private router:Router) {}

  ngOnInit(): void {
    this.minDateStr = this.formatDateToYYYYMMDD(new Date());

    this.form = this.fb.group(
      {
        patientName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
        mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]], // India 10-digit
        email: ['', [Validators.required, Validators.email]],
        gender: ['F', [Validators.required]],
        dob: [''], 
        specialization: ['', [Validators.required]],
        doctorId: [null, [Validators.required]],
        appointmentDate: ['', [Validators.required]],
        slot: ['', [Validators.required]],
        reason: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]]
      },
      {
        validators: [
          this.dateNotInPastValidator('appointmentDate'),
        ]
      }
    );

    // React to specialization change
    this.form.get('specialization')!.valueChanges.subscribe(spec => {
      this.filteredDoctors = this.doctors.filter(d => d.specialization === spec);
      this.form.patchValue({ doctorId: null, slot: '' });
      this.availableSlots = [];
    });

    // React to doctor or date change → recompute slots (mock)
    this.form.get('doctorId')!.valueChanges.subscribe(() => this.refreshSlots());
    this.form.get('appointmentDate')!.valueChanges.subscribe(() => this.refreshSlots());
  }

  // ---------- Validators ----------
  // 1) Appointment date cannot be in the past
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

  get f() {
    return this.form.controls;
  }

  // mock slot logic (replace with API: GET /doctors/{id}/slots?date=YYYY-MM-DD)
  refreshSlots(): void {
    debugger;
    const doctorId = this.form.get('doctorId')!.value;
    const date = this.form.get('appointmentDate')!.value;

    this.availableSlots = [];
    this.form.patchValue({ slot: '' });

    if (!doctorId || !date) return;

    // Example: slots differ by doctor
    if (Number(doctorId) === 1) this.availableSlots = ['10:00', '10:30', '11:00', '16:00'];
    if (Number(doctorId) === 2) this.availableSlots = ['09:00', '09:30', '15:00'];
    if (Number(doctorId) === 3) this.availableSlots = ['11:00', '11:30', '12:00', '17:00'];
  }

private loadSlots(): void {
    const doctorId = this.form.value.doctorId;
    const date = this.form.value.appointmentDate;

    this.slots = [];
    this.form.patchValue({ slot: '' });

    if (!doctorId || !date || this.form.errors?.['dateInPast']) return;

    this.loadingSlots = true;

    // Real API call:
    this.api.getDoctorSlots(doctorId, date).subscribe({
      next: (res) => { this.slots = res.slots; this.loadingSlots = false; },
      error: () => { this.slots = []; this.loadingSlots = false; }
    });

    // If you don't have backend yet, temporarily mock:
    // setTimeout(() => { this.slots = ['10:00','10:30','11:00','16:00']; this.loadingSlots = false; }, 300);
  }


  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      patientName: this.form.value.patientName.trim(),
      mobile: this.form.value.mobile,
      email: this.form.value.email,
      gender: this.form.value.gender,
      dob: this.form.value.dob || null,

      specialization: this.form.value.specialization,
      doctorId: this.form.value.doctorId,

      appointmentDate: this.form.value.appointmentDate, // YYYY-MM-DD
      slot: this.form.value.slot, // "10:30"
      reason: this.form.value.reason.trim()
    };

    // console.log('BOOK APPOINTMENT payload:', payload);

  this.router.navigate(['/appointments']);
    // TODO: call API here
    // this.appointmentService.book(payload).subscribe(...)
    
// this.api.bookAppointment(payload).subscribe({
//       next: (appt) => alert(`Booked successfully. AppointmentId: ${appt.id}`),
//       error: () => alert('Booking failed. Please try another slot.')
//     });

  }
  onClickBack()
  {
  this.router.navigate(['/appointments']);
  }

  private formatDateToYYYYMMDD(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
