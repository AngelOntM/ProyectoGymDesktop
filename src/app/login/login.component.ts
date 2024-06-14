import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router) {}
  password: any;
  id_user: any;
  loginUser(): void {

    this.router.navigateByUrl('/home');
  }
}
