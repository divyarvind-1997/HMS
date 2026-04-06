import { Routes } from '@angular/router';
import {BookAppointmentComponent} from '../app/book-appointment/book-appointment';
import {AppointmentList} from '../app/appointment-list/appointment-list';
export const routes: Routes = [

  { path: '', redirectTo: 'appointments', pathMatch: 'full' },

  { path: 'appointments', component: AppointmentList },
  { path: 'appointments/book', component: BookAppointmentComponent },
];
