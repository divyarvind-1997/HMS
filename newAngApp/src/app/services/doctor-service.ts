import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctor } from '../../Models/Doctor';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {

   private baseUrl = 'http://localhost:5075/api/Doctors';
 constructor(private http: HttpClient) { }

  // Get all doctors
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.baseUrl);
  }

  // Get doctor by ID
  getDoctor(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.baseUrl}/${id}`);
  }

  // Create new doctor
  createDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.baseUrl, doctor);
  }

  // Update doctor
  updateDoctor(id: number, doctor: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.baseUrl}/${id}`, doctor);
  }

  // Delete doctor (soft delete)
  deleteDoctor(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
