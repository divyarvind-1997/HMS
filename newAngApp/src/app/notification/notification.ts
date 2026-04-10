import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification implements OnInit {
  constructor(private authSer: AuthService, private router: Router) { }
  ngOnInit(): void {
    if (!this.authSer.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

}
