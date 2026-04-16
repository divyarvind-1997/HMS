import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { AppointmentService } from '../services/appointment.service';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})

export class Admin {
doctorCount: number=0;
patientCount: number=0;
appointmentCount: number=0;


   constructor(public authService: AuthService,public api: AppointmentService,private cdr: ChangeDetectorRef) 
    
    { }

   ngOnInit(): void {
    this.api.getDashboardCounts().subscribe({
      next: (res: any) => {
        console.log('dashboard res =>', res);
 
        this.doctorCount = res?.doctorCount ?? res?.DoctorCount ?? 0;
        this.patientCount = res?.patientCount ?? res?.PatientCount ?? 0;
        this.appointmentCount = res?.appointmentCount ?? res?.AppointmentCount ?? 0;
 
        // Force UI refresh in case CD is not triggering
        this.cdr.detectChanges();
      },
      error: (err) => console.error('dashboard error =>', err),
    });
  }
}
 
