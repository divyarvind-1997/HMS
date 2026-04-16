import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SignupService } from '../services/signup-service';
 
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  signupForm!: FormGroup;
  roles: string[] = ['Admin', 'Patient', 'Doctor'];
 
  constructor(
    private userSignup: SignupService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }
 
 register() {
  if (this.signupForm.invalid) return;

  const payload = this.signupForm.value;

  this.userSignup.registerUser(payload)
    .subscribe({
      next: (response: any) => {
        const succ = JSON.parse(response);
        if (succ.success) {
          alert(succ.message); // "Registered successfully."
          this.router.navigate(['/login']);
        } 
        // else {
        //   // In case backend sends success=false
        //   alert(response.message);
        //   console.warn('⚠️ Warning:', response);
        // }
      },
      error: (error) => {

        const err = JSON.parse(error.error);
        // console.error('❌ Error:', error);
        // // If backend sends BadRequest with JSON, Angular will still put it in error.error
         alert(err.message);
         //this.router.navigate(['/login']);
      }
    });

//   this.userSignup.registerUser(payload).subscribe({
//   next: (res: string) => {
//     debugger
//     alert(res || 'User registered successfully');
//     this.router.navigate(['/login']);
//   },
//   error: (err) => {
//     debugger
//     console.error(err);
//     alert('Error registering user');
//   }
// });
}
  
}

 