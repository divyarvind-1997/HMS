import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Appointment,
  BookAppointmentRequest,
  CancelAppointmentRequest,
  RescheduleAppointmentRequest,
  SlotAvailability
} from './../../Models/appointment';
import { AppointmentList } from '../appointment-list/appointment-list';


@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly baseUrl = 'http://localhost:5075/api/Appointment'; // change to your backend

  constructor(private http: HttpClient) {}

  CreateAppointment(payload: any): Observable<any> {
    return this.http.post<Appointment>(`${this.baseUrl}/create`, payload);
  }

  getAppointmentById(): Observable<AppointmentList[]> {
  return this.http.get<AppointmentList[]>(`${this.baseUrl}/appointments`);
}

getAvailableTimeSlots(payload: any) {
  return this.http.post<[]>(
          `${this.baseUrl}/timeslots`,payload
  );
}
 getDoctorsBySpecialization(specialization: string) {
    return this.http.get<any[]>(
      `${this.baseUrl}/doctors/${encodeURIComponent(specialization)}`
    );
  }


 getSpecializations() {
    return this.http.get<string[]>(`${this.baseUrl}/specializations`);
}

 getPatients() {
    return this.http.get<any[]>(`${this.baseUrl}/patient`);
}

  // --- Reschedule ---
 rescheduleAppointment(payload:any) {
  return this.http.post<[]>(
    `${this.baseUrl}/reschedule`,payload
  );
}
  // --- Cancel ---
  cancelAppointment(appointmentId:string,reason:string) {
    return this.http.put(`${this.baseUrl}/cancelappointment/${appointmentId}/${reason}}`,'');
  }
  saveDoctorAvailability(payload: any) {
  return this.http.post(
              `${this.baseUrl}/save-availability`,payload
  );
}

getDashboardCounts() {
  return this.http.get<any>(`${this.baseUrl}/counts`);
}

}
