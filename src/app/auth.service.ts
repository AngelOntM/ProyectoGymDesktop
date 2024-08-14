// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from './user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FaceDetectionService } from './face-detection.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements HttpInterceptor {

  constructor(private userService: UserService, private router: Router, private faceDetectionService: FaceDetectionService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error.error.message === 'Unauthenticated.') {
          // Llamar al logout del UserService
          this.faceDetectionService.stopDetection();
          this.userService.logout();
          this.router.navigateByUrl('');
          setTimeout(() => {
            Swal.close();
          }, 5000);          
        }
        return throwError(() => error);
      })
    );
  }
}
