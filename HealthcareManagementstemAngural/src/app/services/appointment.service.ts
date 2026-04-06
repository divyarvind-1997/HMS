import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private baseUrl = 'http://localhost:3000/api/appointments';

  constructor(private http: HttpClient) { }

  // Get appointments with optional filters
  getAppointments(doctorId?: number, date?: string): Observable<Appointment[]> {
    let params = new HttpParams();
    if (doctorId) {
      params = params.set('doctorId', doctorId.toString());
    }
    if (date) {
      params = params.set('date', date);
    }
    return this.http.get<Appointment[]>(this.baseUrl, { params });
  }

  // Create new appointment
  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.baseUrl, appointment);
  }

  // Reschedule appointment
  rescheduleAppointment(id: number, startDateTime: string, endDateTime: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/reschedule`, {
      StartDateTime: startDateTime,
      EndDateTime: endDateTime
    });
  }

  // Cancel appointment
  cancelAppointment(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/cancel`, {});
  }

  // Update appointment status
  updateAppointmentStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/status`, { Status: status });
  }
}