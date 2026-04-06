import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../services/patient.service';
import { Appointment, Patient } from '../../models/models';

@Component({
  selector: 'app-appointment',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './appointment.html',
  styleUrl: './appointment.css',
})
export class AppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  patients: Patient[] = [];
  showForm = false;
  isEditing = false;
  selectedAppointment: Appointment | null = null;
  appointmentForm: FormGroup;
  loading = false;

  // Filter options
  filterDoctorId: number | null = null;
  filterDate: string = '';
  
  // Status options
  statusOptions = ['Booked', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'];

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private fb: FormBuilder
  ) {
    this.appointmentForm = this.fb.group({
      PatientId: ['', [Validators.required]],
      DoctorId: ['', [Validators.required]],
      StartDateTime: ['', [Validators.required]],
      EndDateTime: ['', [Validators.required]],
      Status: ['Booked', [Validators.required]],
      Reason: [''],
      Notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadAppointments();
    this.loadPatients();
  }

  loadAppointments(): void {
    this.loading = true;
    this.appointmentService.getAppointments(this.filterDoctorId || undefined, this.filterDate || undefined).subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.filteredAppointments = appointments;
        // Map patient names for display
        this.mapPatientNames();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.loading = false;
      }
    });
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients.filter(p => p.isActive === true);
      },
      error: (error) => console.error('Error loading patients:', error)
    });
  }

  mapPatientNames(): void {
    this.filteredAppointments.forEach(appointment => {
      const patient = this.patients.find(p => p.patientId === appointment.PatientId);
      appointment.PatientName = patient?.fullName || 'Unknown Patient';
    });
  }

  applyFilters(): void {
    this.loadAppointments();
  }

  clearFilters(): void {
    this.filterDoctorId = null;
    this.filterDate = '';
    this.loadAppointments();
  }

  showAddForm(): void {
    this.showForm = true;
    this.isEditing = false;
    this.selectedAppointment = null;
    this.appointmentForm.reset();
    this.appointmentForm.patchValue({ Status: 'Booked' });
  }

  editAppointment(appointment: Appointment): void {
    this.showForm = true;
    this.isEditing = true;
    this.selectedAppointment = appointment;
    
    // Format datetime for input fields
    const startDate = new Date(appointment.StartDateTime);
    const endDate = new Date(appointment.EndDateTime);
    
    this.appointmentForm.patchValue({
      PatientId: appointment.PatientId,
      DoctorId: appointment.DoctorId,
      StartDateTime: this.formatDateTimeForInput(startDate),
      EndDateTime: this.formatDateTimeForInput(endDate),
      Status: appointment.Status,
      Reason: appointment.Reason,
      Notes: appointment.Notes
    });
  }

  saveAppointment(): void {
    if (this.appointmentForm.valid) {
      const appointmentData = this.appointmentForm.value;
      
      if (!this.isEditing) {
        appointmentData.CreatedBy = 'Admin'; // You can get this from auth service
        this.appointmentService.createAppointment(appointmentData).subscribe({
          next: () => {
            this.loadAppointments();
            this.cancelForm();
          },
          error: (error) => console.error('Error creating appointment:', error)
        });
      }
    }
  }

  rescheduleAppointment(appointment: Appointment, newStart: string, newEnd: string): void {
    this.appointmentService.rescheduleAppointment(appointment.AppointmentId!, newStart, newEnd).subscribe({
      next: () => {
        this.loadAppointments();
      },
      error: (error) => console.error('Error rescheduling appointment:', error)
    });
  }

  cancelAppointment(appointment: Appointment): void {
    if (confirm(`Are you sure you want to cancel this appointment?`)) {
      this.appointmentService.cancelAppointment(appointment.AppointmentId!).subscribe({
        next: () => {
          this.loadAppointments();
        },
        error: (error) => console.error('Error cancelling appointment:', error)
      });
    }
  }

  updateStatus(appointment: Appointment, newStatus: string): void {
    this.appointmentService.updateAppointmentStatus(appointment.AppointmentId!, newStatus).subscribe({
      next: () => {
        this.loadAppointments();
      },
      error: (error) => console.error('Error updating status:', error)
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.selectedAppointment = null;
    this.appointmentForm.reset();
  }

  private formatDateTimeForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  calculateDuration(start: string, end: string): number {
    const startTime = new Date(start);
    const endTime = new Date(end);
    return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)); // Duration in minutes
  }

  // Auto-calculate end time based on start time and 30-minute duration
  onStartTimeChange(): void {
    const startDateTime = this.appointmentForm.get('StartDateTime')?.value;
    if (startDateTime) {
      const startTime = new Date(startDateTime);
      const endTime = new Date(startTime.getTime() + 30 * 60000); // Add 30 minutes
      this.appointmentForm.patchValue({
        EndDateTime: this.formatDateTimeForInput(endTime)
      });
    }
  }
}
