import { Routes } from '@angular/router';
import { PatientComponent } from './component/patient/patient';
import { AppointmentComponent } from './component/appointment/appointment';

export const routes: Routes = [
  { path: '', redirectTo: '/patient', pathMatch: 'full' },
  { path: 'patient', component: PatientComponent },
  { path: 'appointment', component: AppointmentComponent }
];
