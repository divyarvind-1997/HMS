import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor{
   constructor(private router: Router) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      debugger
    const token = localStorage.getItem('token');
    if (token) {
      debugger
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    // return next.handle(req);
    return next.handle(req).pipe(
      
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // 🔴 Unauthorized or Forbidden
          console.warn('Unauthorized request, redirecting to login...');
          localStorage.removeItem('token'); // clear invalid token
          this.router.navigate(['/error']);    // redirect to login page
        }
        return throwError(() => error);
      })
    );
  
   
  }
}