import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { environment } from 'src/enviroment/enviroment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  private apiURL = environment.apiURL;

  constructor(
    private router: Router,
    private http: HttpClient,
    private session: UserService
  ) {}

  loginUser(): void {
    if (this.email == "" || this.password == "") {
      Swal.fire({
        icon: 'error',
        title: 'Error de formulario',
        text: 'Debes rellenar todos los campos!',
      });
      return;
    }

    if (this.password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Error de formulario',
        text: 'La contraseña debe tener al menos 6 caracteres.',
      });
      return;
    }

    const credentials = { email: this.email, password: this.password };
    Swal.fire({
      title: 'Iniciando sesión...',
      text: 'Por favor, espere.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.http.post<any>(`${this.apiURL}/login/employee`, credentials).subscribe({
      next: (response) => {
        const user = {
          rol: response.user.rol.rol_name,
          name: response.user.name,
          token: response.token,
        };
        this.session.setLoggedInUser(user);

        Swal.fire({
          icon: 'success',
          title: '¡Inicio de sesión exitoso!',
          text: `Bienvenido ${response.user.name}`,
          timer: 2500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigateByUrl('/home');
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error de inicio de sesión',
          text: 'Correo electrónico o contraseña incorrectos',
        });
      }
    });
  }
}
