import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import Swal from 'sweetalert2';
import { environment } from 'src/enviroment/enviroment';

interface OrdenDetalle {
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

interface PaymentDetail {
    payment_method: {
        id: number;
        method_name: string;
    };
    amount: number;
    payment_date: string;
}

@Component({
    selector: 'app-detalle',
    templateUrl: './detalle.component.html',
    styleUrls: ['./detalle.component.css']
})

export class DetalleComponent implements OnInit {
    dataSource: MatTableDataSource<OrdenDetalle>;
    paydataSource: MatTableDataSource<PaymentDetail>;
    myColumns: string[] = ['product_name', 'quantity', 'unit_price', 'total_price'];
    paymentColumns: string[] = ['method_name', 'amount', 'payment_date'];
    currentUser: any;
    private apiURL = environment.apiURL;
    id: any;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    ordenDetail: OrdenDetalle[] = [];
    paymentDetails: PaymentDetail[] = [];

    constructor(private http: HttpClient, private userService: UserService,
                private router: Router, private route: ActivatedRoute) {
        this.dataSource = new MatTableDataSource<OrdenDetalle>([]);
        this.paydataSource = new MatTableDataSource<PaymentDetail>(this.paymentDetails);
    }

    ngOnInit() {
        this.currentUser = this.userService.getLoggedInUser();
        this.id = this.route.snapshot.paramMap.get('id');
        this.getOrdDetail();
        this.getOrdPayments();
    }

    getOrdDetail() {
        this.http.get<any>(`${this.apiURL}/orders/${this.id}`, {
            headers: {
                Authorization: `Bearer ${this.currentUser.token}`
            }
        }).subscribe({
            next: (response) => {
                this.ordenDetail = response.order_details;
                this.dataSource.data = this.ordenDetail;
            },
            error: (err) => {
                Swal.fire('Error', 'No se pudo cargar el detalle de la orden', 'error');
            }
        });
    }

    getOrdPayments() {
      this.http.get<any>(`${this.apiURL}/orders/${this.id}/payments`, {
          headers: {
              Authorization: `Bearer ${this.currentUser.token}`
          }
      }).subscribe({
          next: (response) => {
              this.paymentDetails = response;
              this.paydataSource.data = this.paymentDetails;
          },
          error: (err) => {
              Swal.fire('Error', 'No se pudo cargar el detalle de pago de la orden', 'error');
          }
      });
  }

    backToOrd() {
        this.router.navigate(['/home/ordenes']);
    }
}
