import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/user.service';
import { environment } from 'src/enviroment/enviroment';
import Swal from 'sweetalert2';
import { MembresiaRegisterFormComponent } from './register-form/register-form.component';
import { MembresiaUpdateFormComponent } from './update-form/update-form.component';

interface Membership {
  id: number;
  membership_type: string;
  price: number;
  duration_days: number;
  size: number;
  active: number;
  benefits: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-membresias-module',
  templateUrl: './membresias-module.component.html',
  styleUrls: ['./membresias-module.component.css']
})
export class MembresiasModuleComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Membership>;
  myColumns: string[] = ['membership_type', 'price', 'duration_days', 'size', 'actions'];
  currentUser: any;
  private apiURL = environment.apiURL;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  membership: Membership[] = [];

  constructor(private http: HttpClient, private userService: UserService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Membership>([]);
  }

  ngOnInit() {
    this.currentUser = this.userService.getLoggedInUser();
    this.getMbm();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getMbm() {
    this.http.get<any>(`${this.apiURL}/membresias/all`, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        this.membership = response;
        this.dataSource.data = this.membership;
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar la lista de membresias', 'error');
      }
    });
  }

  openAddMbmDialog() {
    const dialogRef = this.dialog.open(MembresiaRegisterFormComponent, {
      width: '400px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addUser(result);
      }
    });
  }
  
  addUser(membresia: Membership) {
    Swal.fire({
      title: 'Registrando membresía...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.http.post<any>(`${this.apiURL}/membresias`, membresia, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        Swal.fire('Membresía registrada', 'La membresía ha sido registrada con éxito', 'success');
        this.getMbm();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo registrar la membresía', 'error');
      }
    }).add(() => {
      Swal.close();
    });
  }

  editMbm(mbm: Membership) {
    const dialogRef = this.dialog.open(MembresiaUpdateFormComponent, {
      width: '400px',
      data: mbm
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateMbm(result, mbm.id);
      }
    });
  }

  updateMbm(mbm: Membership, id: any) {
    Swal.fire({
      title: 'Actualizando membresía...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.http.put<any>(`${this.apiURL}/membresias/`+ id, mbm,{
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        Swal.fire('Membresía actualizada', 'La membresía ha sido actualizada con éxito', 'success');
        this.getMbm();
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo actualizar la membresía', 'error');
      }
    }).add(() => {
      Swal.close();
    });
  }

  deleteMbm(mbm: Membership){
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¡No podrás revertir esto!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete<any>(`${this.apiURL}/membresias/${mbm.id}`, {
          headers: {
            Authorization: `Bearer ${this.currentUser.token}`
          }
        }).subscribe({
          next: (response) => {
            Swal.fire('¡Eliminado!', response.message, 'success');
            this.getMbm();
          },
          error: (err) => {
            Swal.fire('Error', err.error.message || 'Ha ocurrido un error', 'error');
          }
        });
      }
    });
  }

}
