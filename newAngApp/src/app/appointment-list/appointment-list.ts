import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {  AppointmentService } from '../services/appointment.service';
import {Appointment} from '../../Models/appointment';
import { MatDialog } from '@angular/material/dialog';
import {RescheduleDialogComponent} from '../dialogs/reschedule-dialog/reschedule-dialog';
import {CancelDialogComponent} from '../dialogs/cancel-dialog/cancel-dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule, RouterModule,MatIconButton,MatIconModule,MatTableModule,MatCardModule,MatTooltipModule],
  templateUrl: './appointment-list.html'
})
export class AppointmentList implements OnInit {


appointmentList: AppointmentList[]= [];

dataSource = new MatTableDataSource<AppointmentList>();
  role:string| null='';


isLoading = true;

  displayedColumns: string[] = ['patient', 'doctor','date', 'slot','status', 'actions'];

  username!: string | null
  constructor(private api: AppointmentService,private dialog:MatDialog,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    
    this.role = localStorage.getItem('role');
    this.username = localStorage.getItem('username');

    this.loadAppointments();
  }

  formatTime(time: string): string {
  if (!time) return '';

  const [hours, minutes] = time.split(':').map(Number);

  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;

  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}
  
openReschedule(appointmentId:string,doctorId:string) {
    const ref = this.dialog.open(RescheduleDialogComponent, {
      width: '400px',
      height:'400px',
      data: { appointmentId: appointmentId,doctorId:doctorId }
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
this.api
  .rescheduleAppointment(result)
  .subscribe(() => {
    alert("Appointment rescheduled successfully")
    this.loadAppointments();
  });     

}
    });
  }

  openCancel(id: string) {
    const appointmentId = id;
    const ref = this.dialog.open(CancelDialogComponent, {
      width: '400px',
      data: { appointmentId: id }
    });

    ref.afterClosed().subscribe(reason => {
      if (reason) {
this.api.cancelAppointment(id,reason)
  .subscribe(() => {
        alert('Appointment cancelled successfully');
    this.loadAppointments(); // refresh list
  });

      }
    });
  }

  getStatusClass(status: string): string {
  switch (status) {
    case 'BOOKED':
      return 'status-booked';
    case 'CANCELLED':
      return 'status-cancelled';
    case 'RESCHEDULED':
      return 'status-rescheduled';
    default:
      return '';
  }
}

  loadAppointments(): void {
    
        this.isLoading = true;

    this.api
      .getAppointmentById()
      
.subscribe(res => {
    setTimeout(() => {
      this.appointmentList = res;
      
      this.dataSource.data = res; // ✅ triggers table refresh

        this.isLoading = false;

      
    this.cdr.detectChanges();

    });
  });
  }
}
