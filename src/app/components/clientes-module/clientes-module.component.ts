import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, of } from 'rxjs';

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
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
  myColumns: string[] = ['user_id', 'first_name', 'last_name', 'email', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  users: User[] = [
    { user_id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', password: '', phone_number: '1234567890', address: '123 Main St', date_of_birth: '1990-01-01', rol_id: 1, created_at: '2023-01-01T00:00:00', updated_at: '2023-01-01T00:00:00' },
    { user_id: 2, first_name: 'Jane', last_name: 'Doe', email: 'jane.doe@example.com', password: '', phone_number: '1234567890', address: '123 Main St', date_of_birth: '1990-01-01', rol_id: 1, created_at: '2023-01-01T00:00:00', updated_at: '2023-01-01T00:00:00' }
  ];

  constructor() {
    this.dataSource = new MatTableDataSource<User>([]);
  }

  ngOnInit() {
    this.getUsers().subscribe(users => {
      this.dataSource.data = users;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getUsers(): Observable<User[]> {
    // Simulación de llamada a API
    return of(this.users);
  }

  editUser(user: User) {
    console.log('Edit:', user);
    // Aquí iría la lógica para editar un usuario
  }

  deleteUser(user: User) {
    this.users = this.users.filter(u => u.user_id !== user.user_id);
    this.dataSource.data = this.users;
  }

  addUser(user: User) {
    this.users.push(user);
    this.dataSource.data = this.users;
  }

  updateUser(updatedUser: User) {
    const index = this.users.findIndex(user => user.user_id === updatedUser.user_id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      this.dataSource.data = this.users;
    }
  }
}
