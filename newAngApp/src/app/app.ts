import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  role:string| null ='';
  constructor(public authService: AuthService, private router: Router) { }
  
   ngOnInit(): void {
    this.role = localStorage.getItem("role");
  }
  
  logout() {
      localStorage.clear();
      this.router.navigate(['/login']);
  }
}
