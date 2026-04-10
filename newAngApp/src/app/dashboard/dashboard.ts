import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  constructor(private authSer: AuthService, private router: Router) { }
  ngOnInit(): void {
    if (!this.authSer.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

}
