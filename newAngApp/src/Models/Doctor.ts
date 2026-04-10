export interface Doctor {
 doctorId?: number;
  fullName: string;
  specialization: string;
  phone: string;
  email?: string;
  licenseNumber?: string;
  department?: string;
  isActive?: boolean;
  createdAt?: string;
}