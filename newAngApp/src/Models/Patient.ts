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