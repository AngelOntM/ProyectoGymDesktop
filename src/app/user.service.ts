// user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loggedInUser: any;

  constructor() {}

  setLoggedInUser(user: any): void {
    this.loggedInUser = user;
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  getLoggedInUser(): any {
    if (this.loggedInUser) {
      return this.loggedInUser;
    } else {
      const storedUser = sessionStorage.getItem('currentUser');
      if (storedUser) {
        this.loggedInUser = JSON.parse(storedUser);
        return this.loggedInUser;
      }
    }
    return null;
  }

  logout(): void {
    this.loggedInUser = null;
    sessionStorage.removeItem('currentUser');
  }
}
