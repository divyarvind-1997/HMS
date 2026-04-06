import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Appointment,
  BookAppointmentRequest,
  CancelAppointmentRequest,
  RescheduleAppointmentRequest,
  SlotAvailability
} from './../models/appointment.model';


@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly baseUrl = 'https://localhost:5001/api'; // change to your backend

  constructor(private http: HttpClient) {}

  // --- Booking ---
  bookAppointment(payload: BookAppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}/appointments`, payload);
  }

  // --- Reschedule ---
  rescheduleAppointment(payload: RescheduleAppointmentRequest): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseUrl}/appointments/${payload.appointmentId}/reschedule`, payload);
  }

  // --- Cancel ---
  cancelAppointment(payload: CancelAppointmentRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/appointments/${payload.appointmentId}/cancel`, payload);
  }

  // --- Lookups (optional) ---
  getAppointmentById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.baseUrl}/appointments/${id}`);
  }

  getDoctorSlots(doctorId: number, date: string): Observable<SlotAvailability> {
    const params = new HttpParams().set('date', date);
    return this.http.get<SlotAvailability>(`${this.baseUrl}/doctors/${doctorId}/slots`, { params });
  }
}
``