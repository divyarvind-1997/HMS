export interface Patient {
  patientId?: number;
  mrn: string;
  fullName: string;
  dob: string;
  gender: string;
  phone: string;
  email?: string;
  address?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface Appointment {
  AppointmentId?: number;
  PatientId: number;
  DoctorId: number;
  StartDateTime: string;
  EndDateTime: string;
  Status: string;
  Reason?: string;
  Notes?: string;
  CreatedBy?: string;
  CreatedAt?: string;
  PatientName?: string; // For display purposes
}