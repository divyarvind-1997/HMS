import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {  AppointmentService } from '../services/appointment.service';
import {Appointment} from '../models/appointment.model';
import { MatDialog } from '@angular/material/dialog';
import {RescheduleDialogComponent} from '../dialogs/reschedule-dialog/reschedule-dialog';
import {CancelDialogComponent} from '../dialogs/cancel-dialog/cancel-dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule, RouterModule,MatIconButton,MatIconModule,MatTableModule,MatCardModule,MatTooltipModule],
  templateUrl: './appointment-list.html'
})
export class AppointmentList implements OnInit {
  appointments: Appointment[] = [];
  loading = false;

  displayedColumns: string[] = ['patient', 'date', 'status', 'actions'];

  // Example: show doctor’s appointments (replace doctorId from login/session)
  doctorId = 1;

  constructor(private api: AppointmentService,private dialog:MatDialog) {}

  ngOnInit(): void {
    
this.appointments = [
    {
      id: 'A1001',
      doctorId:1,
      patientName: 'Divya',
      appointmentDate: '2026-04-01',
      slot: '10:00 AM',
      status: 'BOOKED'
    },
    {
      id: 'A1002',
      doctorId:2,
      patientName: 'Anand',
      appointmentDate: '2026-04-02',
      slot: '11:30 AM',
      status: 'RESCHEDULED'
    },
    {
      id: 'A1003',
      doctorId:3,
      patientName: 'Nidhi',
      appointmentDate: '2026-04-03',
      slot: '03:00 PM',
      status: 'CANCELLED'
    }
  ];

    this.load();
    console.log(this.loading);
    console.log(this.appointments.length);
  }

  
openReschedule(id: string) {
    const ref = this.dialog.open(RescheduleDialogComponent, {
      width: '400px',
      height:'400px',
      data: { appointmentId: id }
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        console.log('Reschedule data:', result);
        // reschedule API 
      }
    });
  }

  openCancel(id: string) {
    const ref = this.dialog.open(CancelDialogComponent, {
      width: '400px',
      data: { appointmentId: id }
    });

    ref.afterClosed().subscribe(reason => {
      if (reason) {
        console.log('Cancel reason:', reason);
        //  cancel API 
      }
    });
  }


  load(): void {
    // this.loading = true;
    // this.api.getAppointments({ doctorId: this.doctorId }).subscribe({
    //   next: res => { this.appointments = res; this.loading = false; },
    //   error: _ => { this.appointments = []; this.loading = false; }
    // });
  }
}
