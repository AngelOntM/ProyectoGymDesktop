import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserService } from 'src/app/user.service';
import { environment } from 'src/enviroment/enviroment';
import Swal from 'sweetalert2';
import { PaymentFormComponent } from '../payment-form/payment-form.component';

interface Pdct {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  total_price: number;
  category_id: number;
}

interface Cli {
  id: number;
  user_id: number;
  name: string;
}

interface ApiResponse {
  clientes: Cli[];
}

@Component({
  selector: 'app-add-orden',
  templateUrl: './add-orden.component.html',
  styleUrls: ['./add-orden.component.css']
})
export class AddOrdenComponent {
  dataSource: MatTableDataSource<Pdct>;
  myColumns: string[] = ['product_name', 'quantity', 'price', 'total_price', 'actions'];
  status = false;
  myControl = new FormControl();
  myClientControl = new FormControl();
  filteredOptions: Observable<Pdct[]>;
  filteredClientOptions: Observable<Cli[]>;
  currentUser: any;
  selectedArticulo: string | null = null;
  pickedUser: number = -1;

  options: Pdct[] = []
  optionCli: Cli[] = []

  private apiURL = environment.apiURL;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private http: HttpClient, private userService: UserService,
    public dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Pdct>([]);
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.product_name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
      this.filteredClientOptions = this.myClientControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filterCli(name) : this.optionCli.slice())
      );
  }

  ngOnInit() {
    this.currentUser = this.userService.getLoggedInUser();
    this.dataSource.data = [];
  }

  private _filter(name: string): Pdct[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.product_name.toLowerCase().includes(filterValue));
  }

  private _filterCli(name: string): Cli[] {
    const filterValue = name.toLowerCase();
    return this.optionCli.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  pressed(){
    this.pickedUser = -1;
  }

  cambio(select: MatSelect) {
    this.status = false;
    this.pickedUser = -1;
    this.myControl.setValue('');
    this.myClientControl.setValue('');
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espere',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.selectedArticulo = select.value;
    if (select.value == "pdct") {
      this.getPdct().subscribe({
        next: (response) => {
          this.dataSource.data = [];
          this.options = response;
          this.status = true;
          Swal.close();  // Cerrar el Swal de carga cuando termine de cargar
        },
        error: () => {
          Swal.fire('Error', 'No se pudo cargar la lista de productos', 'error');
          this.status = false;
        }
      });
    } else if (select.value == "mbm") {
      this.getMbm().subscribe({
        next: (response) => {
          this.dataSource.data = [];
          this.options = response;
          this.getCli().subscribe({
            next: (response) => {
              this.optionCli = response.clientes;
              this.status = true;
              Swal.close();
            },
            error: () => {
              Swal.fire('Error', 'No se pudo cargar la lista de clientes', 'error');
              this.status = false;
            }
          });
        },
        error: () => {
          Swal.fire('Error', 'No se pudo cargar la lista de membresías', 'error');
          this.status = false;
        }
      });
    }
  }

  articulo(event: any) {
    const selectedProductName = event.option.viewValue;
    const selectedProduct = this.options.find(opt => opt.product_name === selectedProductName);
    if (selectedProduct) {
      const exists = this.dataSource.data.some(item => item.id === selectedProduct.id);
      if (!exists) {
        if (selectedProduct.category_id === 2) {
          const existsCategory2 = this.dataSource.data.some(item => item.category_id === 2);
          if (existsCategory2) {
            Swal.fire({
              title: 'No puedes hacer eso',
              text: `¡No puedes comprar mas de dos membresias a la vez!`,
              icon: 'error',
              showCancelButton: false,
              confirmButtonText: 'Ok',
            });
          } else {
            selectedProduct.product_id = selectedProduct.id;
            selectedProduct.quantity = 1;
            selectedProduct.total_price = selectedProduct.price * 1;
            this.addToDataSource(selectedProduct);
            this.myControl.setValue('');
          }
        } else {
          Swal.fire({
            title: 'Ingrese la cantidad',
            input: 'number',
            inputAttributes: {
              min: '1',
              step: '1'
            },
            showCancelButton: true,
            confirmButtonText: 'Agregar',
            cancelButtonText: 'Cancelar',
            preConfirm: (quantity) => {
              if (!quantity || quantity <= 0) {
                Swal.showValidationMessage('Debe ingresar una cantidad válida');
              }
              return quantity;
            }
          }).then((result) => {
            if (result.isConfirmed) {
              const quantity = parseInt(result.value, 10);
              selectedProduct.product_id = selectedProduct.id;
              selectedProduct.quantity = quantity;
              selectedProduct.total_price = selectedProduct.price * quantity;
              this.addToDataSource(selectedProduct);
              this.myControl.setValue('');
            }
          });
        }
      } else {
        this.myControl.setValue('');
        Swal.fire({
          title: 'No puedes hacer eso',
          text: `¡El producto ya está en la orden!`,
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        });
      }
    }
  }

  cliente(event: any) {
    const selectedClientName = event.option.viewValue;
    const selectedClient = this.optionCli.find(opt => opt.name === selectedClientName);
    if (selectedClient) {
      selectedClient.user_id = selectedClient.id;
      this.pickedUser = selectedClient.user_id;
    }
  }
  
  addToDataSource(product: Pdct) {
    const newData = [...this.dataSource.data, product];
    this.dataSource.data = newData;
  }

  getPdct(): Observable<Pdct[]> {
    return this.http.get<Pdct[]>(`${this.apiURL}/productos`);
  }

  getMbm(): Observable<Pdct[]> {
    return this.http.get<Pdct[]>(`${this.apiURL}/membresias`);
  }

  getCli(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiURL}/users/clientes`,{
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    });
  }

  editPdct(product: Pdct) {
    Swal.fire({
      title: 'Editar cantidad',
      input: 'number',
      inputAttributes: {
        min: '1',
        step: '1'
      },
      inputValue: product.quantity,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: (quantity) => {
        if (!quantity || quantity <= 0) {
          Swal.showValidationMessage('Debe ingresar una cantidad válida');
        }
        return quantity;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const quantity = parseInt(result.value, 10);
        product.quantity = quantity;
        product.total_price = product.price * quantity;
        this.updateDataSource(product);
      }
    });
  }
  
  updateDataSource(updatedProduct: Pdct) {
    const index = this.dataSource.data.findIndex(item => item.id === updatedProduct.id);
    if (index !== -1) {
      this.dataSource.data[index] = updatedProduct;
      this.dataSource.data = [...this.dataSource.data];
    }
  }
  
  deletePdct(product: Pdct) {
    Swal.fire({
      title: '¿Está seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataSource.data = this.dataSource.data.filter(item => item.id !== product.id);
      }
    });
  }

  comprar(){
    if(this.dataSource.data[0].category_id === 2){
      this.makeOrderMbm(this.dataSource.data[0], this.pickedUser)
    }else if(this.dataSource.data[0].category_id === 1){
      this.makeOrderPdct(this.dataSource.data)
    }
  }

  makeOrderPdct(data: any){
    Swal.fire({
      title: 'Realizando orden...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.http.post<any>(`${this.apiURL}/orders/products`, {orderDetails: data, user_id: null}, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Orden en proceso',
          text: 'Selecciona un método de pago',
          icon: 'info',
          timer: 1500,
          showConfirmButton: false
        });
        // this.finishedOrder()
        this.payOrder(response)
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo realizar la orden', 'error');
      }
    })
  }


  makeOrderMbm(data: any, user: number){
    Swal.fire({
      title: 'Realizando orden...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.http.post<any>(`${this.apiURL}/orders/memberships`, {product_id: data.product_id, user_id: user}, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        this.pickedUser = -1;
        Swal.fire({
          title: 'Orden en proceso',
          text: 'Selecciona un método de pago',
          icon: 'info',
          timer: 1500,
          showConfirmButton: false
        });
        this.payOrder(response)
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo realizar la orden', 'error');
      }
    })
  }

  payOrder(ord: any) {
    const dialogRef = this.dialog.open(PaymentFormComponent, {
      width: '800px',
      data: ord,
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.finishedOrder();
      } else {
        Swal.fire({
          title: 'Pago cancelado',
          text: '¡Recuerda pagar tu orden!.',
          icon: 'warning',
        });
        this.finishedOrder();
      }
    });
  }
  

  finishedOrder(){
    this.dataSource.data = []
    this.pickedUser = -1;
    this.myControl.setValue('');
    this.myClientControl.setValue('');
  }

}
