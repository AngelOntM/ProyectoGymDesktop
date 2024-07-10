import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { environment } from 'src/enviroment/enviroment';
import Swal from 'sweetalert2';
import { EmployeeUpdateFormComponent } from '../empleados-module/update-form/update-form.component';
import { MatDialog } from '@angular/material/dialog';

interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  date_of_birth: string;
  rol_id: number;
  face_image_path: string | null;
  two_factor_code: string | null;
  two_factor_expires_at: string | null;
  created_at: string | null;
  updated_at: string;
}

@Component({
  selector: 'app-perfil-module',
  templateUrl: './perfil-module.component.html',
  styleUrls: ['./perfil-module.component.css']
})
export class PerfilModuleComponent implements OnInit {
  user!: User;
  currentUser: any;
  apiURL = environment.apiURL;

  constructor(private http: HttpClient, private userService: UserService, private dialog: MatDialog) {}

  ngOnInit() {
    this.currentUser = this.userService.getLoggedInUser();
    this.getUser();
  }

  getUser() {
    Swal.fire({
      title: 'Cargando perfil...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.http.get<any>(`${this.apiURL}/user`, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        this.user = response;
        Swal.close()
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar el perfil', 'error');
      }
    });
  }

  changePassword(){
    Swal.fire({
      title: 'Cambiar contraseña',
      html:
      '<style>' +
        'input[type=number]::-webkit-outer-spin-button, ' +
        'input[type=number]::-webkit-inner-spin-button { ' +
          '-webkit-appearance: none; ' +
          'margin: 0; ' +
        '}' +
        'input[type=number] { ' +
          '-moz-appearance: textfield; ' +
        '}' +
      '</style>' +
      '<input id="swal-input1" type="password" class="swal2-input" minlength="6" placeholder="Contraseña actual">' +
      '<input id="swal-input2" type="password" class="swal2-input" minlength="6" placeholder="Nueva contraseña">' +
      '<input id="swal-input3" type="password" class="swal2-input" minlength="6" placeholder="Confirma la contraseña">',
      focusConfirm: false,
      preConfirm: () => {
        const currentPass = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const newPass = (document.getElementById('swal-input2') as HTMLInputElement).value;
        const confirm = (document.getElementById('swal-input3') as HTMLInputElement).value;
        if (!currentPass || !newPass || newPass.length < 6 || currentPass.length < 6 || confirm.length < 6) {
          Swal.showValidationMessage('Por favor, ingresa contraseñas validas');
        }
        return { pass: currentPass, newPass: newPass, confirm:confirm };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.updatePassword(result.value.pass, result.value.newPass, result.value.confirm);
      }
    });
  }



  updateInfo(user: any) {
    const dialogRef = this.dialog.open(EmployeeUpdateFormComponent, {
      width: '800px',
      data: user
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateUser(result, user.id);
      }
    });
  }

  updatePassword(pass: any, newpass: any, confirm: any) {
    Swal.fire({
      title: 'Actualizando contraseña...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    const payload = {current_password:pass, new_password:newpass, new_password_confirmation:confirm}
    this.http.post<any>(`${this.apiURL}/change-password`, payload, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        this.getUser()
        Swal.fire('Éxito', 'Contraseña cambiada con éxito', 'success');
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cambiar la contraseña', 'error');
      }
    });
  }

  updateUser(user: any, id: any) {
    Swal.fire({
      title: 'Actualizando empleado...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.http.put<any>(`${this.apiURL}/users/admin/`+ id, user,{
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        this.currentUser.name = response.user.name;
        Swal.fire('Empleado actualizado', 'El empleado ha sido actualizado con éxito', 'success');
        this.getUser();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo actualizar el empleado', 'error');
      }
    })
  }

}
