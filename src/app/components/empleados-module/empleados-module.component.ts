import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/user.service';
import { environment } from 'src/enviroment/enviroment';
import { MatDialog } from '@angular/material/dialog';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  date_of_birth: string;
  rol_id: number;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-empleados-module',
  templateUrl: './empleados-module.component.html',
  styleUrls: ['./empleados-module.component.css']
})
export class EmpleadosModuleComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Employee>;
  myColumns: string[] = ['id', 'name', 'phone_number', 'email','actions'];
  currentUser: any;
  private apiURL = environment.apiURL;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  employees: Employee[] = [];

  constructor(private http: HttpClient, private userService: UserService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Employee>([]);
  }

  ngOnInit() {
    this.currentUser = this.userService.getLoggedInUser();
    this.getEmpleados();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getEmpleados() {
    this.http.get<any>(`${this.apiURL}/users/empleados`, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        this.employees = response.empleados;
        this.dataSource.data = this.employees;
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar la lista de empleados', 'error');
      }
    });
  }

  deleteUser(employee: Employee){

  }

  openAddUserDialog(){

  }

  editUser(employee: Employee){

  }

}
