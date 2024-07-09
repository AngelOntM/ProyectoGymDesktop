import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const expectedRoles = route.data['roles'];
    const user = this.userService.getLoggedInUser();

    if (user && expectedRoles.includes(user.rol)) {
      return true;
    } else {
      this.router.navigate(['home']);
      return false;
    }
  }
}