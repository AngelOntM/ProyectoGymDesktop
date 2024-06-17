import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/user.service';
import { environment } from 'src/enviroment/enviroment';

interface User {
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
  selector: 'app-clientes-module',
  templateUrl: './clientes-module.component.html',
  styleUrls: ['./clientes-module.component.css']
})
export class ClientesModuleComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<User>;
  myColumns: string[] = ['id', 'name', 'phone_number', 'email', 'actions'];
  currentUser: any;
  private apiURL = environment.apiURL;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  users: User[] = [];

  constructor(private http: HttpClient, private userService: UserService) {
    this.dataSource = new MatTableDataSource<User>([]);
  }

  ngOnInit() {
    this.currentUser = this.userService.getLoggedInUser();
    this.getClientes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getClientes(){
    this.http.get<any>(`${this.apiURL}/users/clientes`, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        this.users = response.clientes
        this.dataSource.data = this.users;
      },
      error: (err) => {
      }
    });
  }

  editUser(user: User) {
    console.log('Edit:', user);
  }

  deleteUser(user: User) {
    this.users = this.users.filter(u => u.id !== user.id);
    this.dataSource.data = this.users;
  }

  addUser(user: User) {
    this.users.push(user);
    this.dataSource.data = this.users;
  }

  updateUser(updatedUser: User) {
    const index = this.users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      this.dataSource.data = this.users;
    }
  }
}
