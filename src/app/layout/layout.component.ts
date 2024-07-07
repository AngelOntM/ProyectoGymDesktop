import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/enviroment/enviroment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isScreenSmall: boolean = false;
  currentUser: any;
  private apiURL = environment.apiURL;

  constructor(private breakpointObserver: BreakpointObserver, private router: Router,
    private userService: UserService, private http: HttpClient, private session: UserService
  ) {}

  ngOnInit() {
    this.currentUser = this.userService.getLoggedInUser();
  }

  ngAfterViewInit() {
    this.breakpointObserver.observe(['(max-width: 800px)'])
      .subscribe(result => {
        this.isScreenSmall = result.matches;
        if (this.isScreenSmall) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
  }

  toggleMenu() {
    this.sidenav.toggle();
  }

  logOut(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Hacer la solicitud para cerrar sesión usando el token
        this.http.post<any>(`${this.apiURL}/logout`, null, {
          headers: {
            Authorization: `Bearer ${this.currentUser.token}`
          }
        }).subscribe({
          next: (response) => {
            Swal.fire({
              title: 'Sesión cerrada',
              text: 'Tu sesión ha sido cerrada correctamente.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500 // Tiempo en milisegundos (1.5 segundos)
            }).then(() => {
              this.userService.logout();
              this.router.navigateByUrl('');
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al cerrar sesión',
              text: 'Hubo un problema al intentar cerrar sesión. Por favor, inténtalo de nuevo.',
            }).then(() => {
              this.userService.logout();
              this.router.navigateByUrl('');
            });
          }
        });
      }
    });
  }
  
  canjear() {
    Swal.fire({
      title: 'Canjear Código',
      html:
        '<input id="swal-input1" class="swal2-input" type="number" placeholder="ID Usuario">' +
        '<input id="swal-input2" class="swal2-input" maxlength="10" placeholder="Código">',
      focusConfirm: false,
      preConfirm: () => {
        const userId = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const code = (document.getElementById('swal-input2') as HTMLInputElement).value;
        if (!userId || !code || code.length !== 10) {
          Swal.showValidationMessage('Por favor, ingresa un ID de usuario y un Code válido de 10 caracteres');
        }
        return { userId: Number(userId), code: code };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.makeRedeem(result.value.userId, result.value.code);
      }
    });
  }

  makeRedeem(id: number, code: string) {
    const payload = { user_id:id, code:code }
    this.http.post<any>(`${this.apiURL}/membership/redeem/user`, payload, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'El código ha sido canjeado correctamente.', 'success');
      },
      error: (err) => {
        Swal.fire('Error', 'Hubo un problema al canjear el código.', 'error');
      }
    });
  }

}
