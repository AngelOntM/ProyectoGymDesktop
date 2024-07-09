import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    if (this.userService.getLoggedInUser()) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}