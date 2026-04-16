import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from '../../Models/Patient';


@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private baseUrl = 'http://localhost:5075/api/Patients';
  constructor(private http: HttpClient) { }

  // Get all patients with optional search
  getPatients(search?: string): Observable<Patient[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Patient[]>(this.baseUrl, { params });
  }
  // Get patient by ID
  getPatient(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/${id}`);
  }

  // Create new patient
  createPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.baseUrl, patient);
  }

  // Update patient
  updatePatient(id: number, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.baseUrl}/${id}`, patient);
  }

  // Delete patient (soft delete)
  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
