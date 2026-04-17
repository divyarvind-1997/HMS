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

interface Doctor {
  doctorId: number;
  doctorName: string;
  specialization: string;
}
interface Patient{
  patientId: number;
  patientName:string;
}
interface Slot {
  slotId: number;
  startTime: string;
  endTime: string;
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
  styleUrl: './book-appointment.css' // ✅ CORRECT
})
export class BookAppointmentComponent implements OnInit {
  form!: FormGroup;

specializations: string[] = [];

doctors: any[] = [];

selectedSpecialization = '';
selectedDoctorId: number | null = null;

  filteredDoctors: Doctor[] = [];
  availableSlots: Slot[] = [];
filteredPatients: Patient[]=[];
  loadingSlots = false;

  minDateStr = ''; // for <input type="date" min="...">

  constructor(private fb: FormBuilder, private api: AppointmentService,private router:Router) {}

  ngOnInit(): void {

  this.loadSpecializations();
  this.loadPatients();

    this.minDateStr = this.formatDateToYYYYMMDD(new Date());

    this.form = this.fb.group(
      {
        specialization: ['', [Validators.required]],
        doctorId: [null, [Validators.required]],
        patientId: [null, [Validators.required]],
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

    this.form.get('doctorId')!.valueChanges.subscribe(() => this.refreshSlots());
    this.form.get('appointmentDate')!.valueChanges.subscribe(() => this.refreshSlots());
  }

loadPatients()
{
  this.api
    .getPatients()
    .subscribe(res => {
      this.filteredPatients = res;
    });
}
onSpecializationChange(spec: string) {
  this.selectedDoctorId = null;
  if (!spec) return;
  this.api
    .getDoctorsBySpecialization(spec)
    .subscribe(res => {
      this.filteredDoctors = res;
    });
}

loadSpecializations() {
  this.api.getSpecializations()
    .subscribe(res => {
      this.specializations = res;
    });
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

  formatTime(time: string): string {
  if (!time) return '';

  const [hours, minutes] = time.split(':').map(Number);

  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

  refreshSlots(): void {
    const doctorId = this.form.get('doctorId')!.value;
    const date = this.form.get('appointmentDate')!.value;

    this.availableSlots = [];
    this.form.patchValue({ slot: '' });

    if (!doctorId && !date) return;
this.loadSlots();
  }

private loadSlots(): void {
    const doctorId = this.form.value.doctorId;
    const date = this.form.value.appointmentDate;
    this.availableSlots = [];
    this.form.patchValue({ slot: '' });

    if (!doctorId || !date || this.form.errors?.['dateInPast']) return;
    
const dateObj: Date = this.form.value.appointmentDate;
const year = dateObj.getFullYear();
const month = String(dateObj.getMonth() + 1).padStart(2, '0');
const day = String(dateObj.getDate()).padStart(2, '0');

const formattedDate = `${year}-${month}-${day}`; // ✅ yyyy-MM-dd

const payload = {
  doctorId: this.form.value.doctorId,
  appointmentDate: formattedDate   // ✅ STRING, NOT Date
};
    this.api.getAvailableTimeSlots(payload).subscribe({
      next: (res) => { 
        if(res.length > 0)
        {this.availableSlots = res; this.loadingSlots = false;}
        else{ alert("Doctor is not available on the selected dates")}
         },
      error: () => { this.availableSlots = []; this.loadingSlots = false; }
    });
  }


  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dateObj: Date = this.form.value.appointmentDate;
const year = dateObj.getFullYear();
const month = String(dateObj.getMonth() + 1).padStart(2, '0');
const day = String(dateObj.getDate()).padStart(2, '0');

const formattedDate = `${year}-${month}-${day}`; // ✅ yyyy-MM-dd

    const payload = {

      specialization: this.form.value.specialization,
      doctorId: this.form.value.doctorId,
      patientId: this.form.value.patientId,
      slotId: this.form.value.slot,
      appointmentDate: formattedDate, // YYYY-MM-DD
      startDate: this.availableSlots.find(x=>x.slotId=this.form.value.slot)?.startTime, // "10:30"
      endDate:this.availableSlots.find(x=>x.slotId=this.form.value.slot)?.endTime, // "10:30"
      Reason: this.form.value.reason.trim()
    };

    console.log(payload);

 this.api.CreateAppointment(payload).subscribe({
      next: (res) => {
         this.router.navigate(['/appointments']);
      },
      error: (err) => {
          err?.error?.message || 'Failed to book appointment';
      }
    });

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
