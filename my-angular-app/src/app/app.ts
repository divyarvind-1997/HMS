import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { AppointmentList } from './appointment-list/appointment-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
