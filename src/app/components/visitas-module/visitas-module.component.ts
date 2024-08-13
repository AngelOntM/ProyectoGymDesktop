import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  dateForm!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  visitas: visit[] = [];

  constructor(private http: HttpClient, private userService: UserService, private fb: FormBuilder) {
    this.dataSource = new MatTableDataSource<visit>([]);
  }

  ngOnInit() {
    this.currentUser = this.userService.getLoggedInUser();
    this.createForm();
    //this.getVisits();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  createForm() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.dateForm = this.fb.group({
      firstDate: [startOfMonth, [Validators.required, this.dateRangeValidator.bind(this)]],
      endDate: [endOfMonth, [Validators.required, this.dateRangeValidator.bind(this)]]
    });
  }

  dateRangeValidator(control: any) {
    const startDate = this.dateForm?.get('firstDate')?.value;
    const endDate = this.dateForm?.get('endDate')?.value;
    return startDate && endDate && endDate < startDate ? { dateRange: true } : null;
  }

  getVisits() {
    if (this.dateForm.invalid) {
      return;
    }

    const { firstDate, endDate } = this.dateForm.value;

    this.http.get<any>(`${this.apiURL}/visits`, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      },
      params: {
        start_date: firstDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      }
    }).subscribe({
      next: (response) => {
        this.visitas = response;
        this.visitas.forEach(element => {
          if(element.user === null){
            element.user = {name:"N/A"}
          }          
        });
        this.visitas.sort((a, b) => {
          const dateA = new Date(a.visit_date + 'T' + a.check_in_time);
          const dateB = new Date(b.visit_date + 'T' + b.check_in_time);
          return dateB.getTime() - dateA.getTime();
        });
        this.dataSource.data = this.visitas;
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar la lista de visitas', 'error');
      }
    });
  }

}
