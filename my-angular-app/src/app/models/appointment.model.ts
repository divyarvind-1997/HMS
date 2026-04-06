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
  mobile: string;
  email: string;
  doctorId: number;
  specialization: string;
  appointmentDate: string; // YYYY-MM-DD
  slot: string;            // "10:30"
  reason: string;
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

export interface Appointment {
  id: string;
  doctorId: number;
  patientName: string;
  appointmentDate: string;
  slot: string;
  status: AppointmentStatus;
}

export interface SlotAvailability {
  doctorId: number;
  date: string;     // YYYY-MM-DD
  slots: string[];  // ["10:00","10:30"...]
}
export type TimeHHmm = string; // "09:30"
export type ISODate = string;  // "2026-04-03"

export interface BreakPeriod {
  start: TimeHHmm;
  end: TimeHHmm;
}

export interface DaySchedule {
  day: number;           // 0=Sun ... 6=Sat
  enabled: boolean;
  startTime: TimeHHmm;
  endTime: TimeHHmm;
  slotMinutes: number;   // e.g., 15
  breaks: BreakPeriod[];
  location?: string;
  maxPatientsPerSlot?: number;
}

export interface ExceptionSchedule {
  date: ISODate;
  unavailable: boolean;
  startTime?: TimeHHmm;
  endTime?: TimeHHmm;
  slotMinutes?: number;
  breaks?: BreakPeriod[];
  note?: string;
}

export interface DoctorSchedule {
  doctorId: string;
  timezone: string; // "Asia/Kolkata"
  weekly: DaySchedule[];
  exceptions: ExceptionSchedule[];
  updatedAt?: string;
}

export const DAYS: { key: number; label: string }[] = [
  { key: 0, label: 'Sunday' },
  { key: 1, label: 'Monday' },
  { key: 2, label: 'Tuesday' },
  { key: 3, label: 'Wednesday' },
  { key: 4, label: 'Thursday' },
  { key: 5, label: 'Friday' },
  { key: 6, label: 'Saturday' },
];
export type SlotStatus = 'AVAILABLE' | 'LEAVE' | 'BOOKED';

export interface SlotCell {
  startIso: string; // ISO UTC
  endIso: string;   // ISO UTC
  status: SlotStatus;
  appointmentId?: number;
}

export interface DayColumn {
  dateIso: string;  // YYYY-MM-DD
  label: string;    // Mon 06 Apr
  slots: SlotCell[];
}

export interface AppointmentLite {
  id: number;
  doctorId: number;
  startDateTime: string; // ISO
  endDateTime: string;   // ISO
  status: 'BOOKED' | 'CANCELLED' | 'RESCHEDULED';
}

export interface LeaveBlock {
  dateIso: string;     // YYYY-MM-DD
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
  reason?: string;
}
``