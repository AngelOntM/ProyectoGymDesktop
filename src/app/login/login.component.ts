import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router, private session: UserService) {}
  email: any;
  password: any;
  id_user: any;
  loginUser(): void {

    const user = {
      rol: "ADMIN",
      name: "EJEMPLO",
    };
    this.session.setLoggedInUser(user);

    this.router.navigateByUrl('/home');
  }
}
