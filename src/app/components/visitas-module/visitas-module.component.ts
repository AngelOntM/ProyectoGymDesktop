import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/user.service';
import { environment } from 'src/enviroment/enviroment';
import Swal from 'sweetalert2';

interface visit {
  user_id: number;
  visit_date: string;
  check_in_time: string;
  user: {
    name: string;
  }
}

@Component({
  selector: 'app-visitas-module',
  templateUrl: './visitas-module.component.html',
  styleUrls: ['./visitas-module.component.css']
})
export class VisitasModuleComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<visit>;
  myColumns: string[] = ['user_id', 'user', 'visit_date', 'check_in_time'];
  currentUser: any;
  private apiURL = environment.apiURL;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  visitas: visit[] = [];

  constructor(private http: HttpClient, private userService: UserService) {
    this.dataSource = new MatTableDataSource<visit>([]);
  }

  ngOnInit() {
    this.currentUser = this.userService.getLoggedInUser();
    this.getVisits();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getVisits() {
    this.http.get<any>(`${this.apiURL}/visits`, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        this.visitas = response;
        this.dataSource.data = this.visitas;
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar la lista de visitas', 'error');
      }
    });
  }

}
