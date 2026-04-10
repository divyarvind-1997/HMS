import { Component,NgModule, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup,FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,FormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit{
  username:string="";
  password:string="";

  constructor( public authService: AuthService, private router: Router) {
  
  }
  ngOnInit(): void {
    localStorage.clear();
  }

   onSubmit(){
    if (this.username !=null) {
       this.authService.login(this.username,this.password).subscribe({
        next: (res: any) => {
         debugger
        //  const token = localStorage.getItem('token');
        //  const headers = new HttpHeaders().set('Authorization', 'Bearer ${token}');
          // Navigate based on role
          // if (res.role === 'admin') {
          //   this.router.navigate(['/admin']);
          // }else if (res.role === 'user') {
          //   this.router.navigate(['/user']);
          // }
          this.router.navigate(['/home']);
        },
        error: () => alert('Login failed')
      });
    }
   }

}
