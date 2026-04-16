export type AppointmentStatus = 'BOOKED' | 'RESCHEDULED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

export interface Appointment {
  id: string;
  doctorId: number;
  doctorName?: string;
  patientName: string;
  appointmentDate: string; // YYYY-MM-DD
  slot: string;            // "10:30"
  status: AppointmentStatus;
}
export interface BookAppointmentRequest {
  patientId?: string;
  patientName: string;
  doctorId: number;
  specialization: string;
  appointmentDate: string; // YYYY-MM-DD
  slot: string;            // "10:30"
  reason: string;
  appointmentStatus:string;
}

export interface RescheduleAppointmentRequest {
  appointmentId: string;
  newDate: string;  // YYYY-MM-DD
  newSlot: string;  // "11:00"
  reason: string;
}

export interface CancelAppointmentRequest {
  appointmentId: string;
  reason: string;
  cancelledBy: 'PATIENT' | 'ADMIN';
}

export interface AppointmentList {
  appointmentId: number;
  slotId: number;
  doctorId: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  patientName: string;
  doctorName: string;
  specialization: string;
  status: string;
}

export interface SlotAvailability {
  doctorId: number;
  date: string;     // YYYY-MM-DD
  slots: string[];  // ["10:00","10:30"...]
}
