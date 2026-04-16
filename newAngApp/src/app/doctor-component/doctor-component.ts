import { Component, OnInit } from '@angular/core';
import { Doctor } from '../../Models/Doctor';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DoctorService } from '../services/doctor-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-component',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './doctor-component.html',
  styleUrl: './doctor-component.css',
})
export class DoctorComponent implements OnInit {
  
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  selectedDoctor: Doctor | null = null;
  showForm = false;
  isEditing = false;
  searchTerm = '';
  doctorForm: FormGroup;
  loading = false;
  role:string| null='';

  constructor(
    private doctorService: DoctorService,
    private router:Router,
    private fb: FormBuilder
  ) {
    this.doctorForm = this.fb.group({
      fullName: ['', [Validators.required]],
      specialization: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: [''],
      licenseNumber: [''],
      department: ['']
    });
  }

 ngOnInit(): void {
      this.role = localStorage.getItem("role");

    if (localStorage.getItem('token') == null) {
      this.router.navigate(['/login']);
    }
    this.loadDoctors();
  }
  
  loadDoctors(): void {
    this.loading = true;
    this.doctorService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        this.filteredDoctors = doctors;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.loading = false;
      }
    });
  }

  searchDoctors(): void {
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      this.filteredDoctors = this.doctors.filter(doctor =>
        doctor.fullName.toLowerCase().includes(searchLower) ||
        doctor.specialization.toLowerCase().includes(searchLower) ||
        doctor.phone.includes(searchLower) ||
        (doctor.department && doctor.department.toLowerCase().includes(searchLower))
      );
    } else {
      this.filteredDoctors = this.doctors;
    }
  }

  showAddForm(): void {
    this.showForm = true;
    this.isEditing = false;
    this.selectedDoctor = null;
    this.doctorForm.reset();
  }

  editDoctor(doctor: Doctor): void {
    this.showForm = true;
    this.isEditing = true;
    this.selectedDoctor = doctor;
    this.doctorForm.patchValue({
      fullName: doctor.fullName,
      specialization: doctor.specialization,
      phone: doctor.phone,
      email: doctor.email,
      licenseNumber: doctor.licenseNumber,
      department: doctor.department
    });
  }

  saveDoctor(): void {
    if (this.doctorForm.valid) {
      const doctorData = this.doctorForm.value;

      if (this.isEditing && this.selectedDoctor) {
        this.doctorService.updateDoctor(this.selectedDoctor.doctorId!, doctorData).subscribe({
          next: () => {
            this.loadDoctors();
            this.cancelForm();
          },
          error: (error) => console.error('Error updating doctor:', error)
        });
      } else {
        this.doctorService.createDoctor(doctorData).subscribe({
          next: () => {
            this.loadDoctors();
            this.cancelForm();
          },
          error: (error) => console.error('Error creating doctor:', error)
        });
      }
    }
  }

  deleteDoctor(doctor: Doctor): void {
    if (confirm(`Are you sure you want to delete doctor: ${doctor.fullName}?`)) {
      this.doctorService.deleteDoctor(doctor.doctorId!).subscribe({
        next: () => {
          this.loadDoctors();
        },
        error: (error) => console.error('Error deleting doctor:', error)
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.isEditing = false;
    this.selectedDoctor = null;
    this.doctorForm.reset();
  }

}
