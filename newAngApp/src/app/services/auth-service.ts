import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5075/api/User/login';
  private currentUserSubject = new BehaviorSubject<any>(null);

   constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.currentUserSubject.next(this.decodeToken(token));
    }
  }
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, { username, password })
      .pipe(map(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('role', response.role);
        localStorage.setItem('username', response.username);
        this.currentUserSubject.next(this.decodeToken(response.token));
        return response;
      }));
  }
   logout(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    this.http.post(`${this.apiUrl}/logout`, refreshToken).subscribe();
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken');
    this.currentUserSubject.next(null);
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<any>(`${this.apiUrl}/refresh`, refreshToken)
      .pipe(map(response => {
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(this.decodeToken(response.token));
        return response;
      }));
  }

  getRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decoded = this.decodeToken(token);
    return decoded['role'] || null;
  }

  getUsername() {
    return localStorage.getItem('username');
  }

  isLoggedIn() {
    
    return !!localStorage.getItem('token');
  }
  
  decodeToken(token: string): any {
   try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
}
