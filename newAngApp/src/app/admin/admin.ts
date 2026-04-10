import { Component } from '@angular/core';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
   constructor(public authService: AuthService) { }
}
