import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { environment } from 'src/enviroment/enviroment';
import Swal from 'sweetalert2';
import { PaymentFormComponent } from './payment-form/payment-form.component';

interface Orden {
  id: number;
  user_id: string;
  order_date: string;
  total_amount: string;
  estado: string;
}

@Component({
  selector: 'app-orden-module',
  templateUrl: './orden-module.component.html',
  styleUrls: ['./orden-module.component.css']
})
export class OrdenModuleComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Orden>;
  myColumns: string[] = ['id', 'user_id', 'order_date', 'total_amount', 'estado', 'actions'];
  currentUser: any;
  private apiURL = environment.apiURL;
  dateForm!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ordenes: Orden[] = [];

  constructor(private http: HttpClient, private userService: UserService, public dialog: MatDialog,
    private router: Router, private fb: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource<Orden>([]);
  }

  ngOnInit() {
    this.currentUser = this.userService.getLoggedInUser();
    this.createForm();
    this.getOrd();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.applySorting()
  }

  applySorting() {
    if (this.dataSource && this.dataSource.sort) {
      this.dataSource.sort.sort({ id: 'id', start: 'desc', disableClear: true });
    }
  }

  createForm() {
    const today = new Date();
    this.dateForm = this.fb.group({
      firstDate: [today, [Validators.required, this.dateRangeValidator.bind(this)]],
      endDate: [today, [Validators.required, this.dateRangeValidator.bind(this)]]
    });
  }

  dateRangeValidator(control: any) {
    const startDate = this.dateForm?.get('firstDate')?.value;
    const endDate = this.dateForm?.get('endDate')?.value;
    return startDate && endDate && endDate < startDate ? { dateRange: true } : null;
  }

  getOrd() {
    if (this.dateForm.invalid) {
      return;
    }

    const { firstDate, endDate } = this.dateForm.value;

    this.http.get<any>(`${this.apiURL}/orders`, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      },
      params: {
        start_date: firstDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      }
    }).subscribe({
      next: (response) => {
        this.ordenes = response;
        this.ordenes.forEach(element => {
          if(element.user_id === null){
            element.user_id = "N/A";
          }          
        });
        this.dataSource.data = this.ordenes;
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo cargar la lista de ordenes', 'error');
      }
    });
  }

  editOrd(ord: Orden){
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres cancelar esta orden?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelOrd(ord.id)
      }
    });
  }

  cancelOrd(ord: any){
    this.http.delete<any>(`${this.apiURL}/orders/${ord}`, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: () => {
        Swal.fire('¡Cancelado!', 'La orden ha sido cancelada','success');
        this.getOrd();
      },
      error: (err) => {
        Swal.fire('Error', err.error.message || 'Ha ocurrido un error', 'error');
      }
    });
  }

  details(ord: any){
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres ir a los detalles de esta orden?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, entrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/home/ordenesDetalle', ord.id]);
      }
    });
  }

  payOrder(ord: any) {
    const dialogRef = this.dialog.open(PaymentFormComponent, {
      width: '800px',
      data: ord,
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getOrd()
      } else {
        Swal.fire({
          title: 'Pago cancelado',
          text: '¡Recuerda pagar tu orden!.',
          icon: 'warning',
        });
      }
    });
  }

}
