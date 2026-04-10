import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Users } from '../../Models/Users';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private apiUrl = 'http://localhost:5075/api/User/Register';

  constructor(private http: HttpClient) {}

  //  registerUser(user: Users): Observable<Users> {
    
  //   return this.http.post<Users>(`${this.apiUrl}`, user);
  // }

  registerUser(payload: any) {
    return this.http.post(this.apiUrl, payload, {
      responseType: 'text'   // ✅ FIX: backend returns plain string
    });
  }
}
