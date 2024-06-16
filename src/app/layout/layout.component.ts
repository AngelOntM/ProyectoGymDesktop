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

}
