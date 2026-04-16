import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef ,MatDialogModule} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl:'./cancel-dialog.html'
})
export class CancelDialogComponent {
  reason = '';

  constructor(
    private dialogRef: MatDialogRef<CancelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { appointmentId: string }
  ) {}

  close() {
    this.dialogRef.close();
  }

   cancelAppointment() {
    this.dialogRef.close(this.reason);
  }
}