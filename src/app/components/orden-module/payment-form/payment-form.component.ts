import { HttpClient } from '@angular/common/http';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/user.service';
import { environment } from 'src/enviroment/enviroment';
import Swal from 'sweetalert2';

interface payment {
  id: number
  method_name: string;
  payment_method_id: number;
  amount: number;
}

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent {
  payForm: FormGroup;
  dataSource: MatTableDataSource<payment>;
  myColumns: string[] = ['method_name','amount', 'actions'];
  currentUser: any;
  pickedPay: number = -1;
  pickedName: string = "";
  Amount: number = -1;
  pickedAmount: boolean = false;
  totalPay: number = 0;
  private apiURL = environment.apiURL;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<PaymentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, private userService: UserService
  ) {
    this.dataSource = new MatTableDataSource<payment>([]);
    this.payForm = this.fb.group({
      payment_method_id: [''],
      amount: ['', [Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    });
  }

  ngOnInit(){
    this.currentUser = this.userService.getLoggedInUser();
  }

  onSubmit(): void {
    if (this.payForm.valid) {
      const formData = { ...this.payForm.value };
      this.dialogRef.close(formData);
      this.addPay(this.dataSource.data)
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  paymethod(event: MatSelectChange){
    this.pickedPay = event.value;
    this.pickedName = event.source.triggerValue;
  }

  onAmountChange(event: any) {
    const inputValue = event.target.value;
    if (inputValue.length > 1 && inputValue.startsWith('0')) {
      const newValue = inputValue.replace(/^0+/, '');
      this.payForm.controls['amount'].setValue(newValue, { emitEvent: false });
    }
    if (inputValue === "" || inputValue === "0") {
      this.Amount = -1
      this.pickedAmount = false;
    } else {
      this.pickedAmount = true;
      this.Amount = this.payForm.controls['amount'].value
    }
  }

  addPayment(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.dataSource.data.some(p => p.payment_method_id === this.pickedPay)) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: '¡Este método de pago ya existe en la lista!',
      });
      return;
    }
    const newPayment: payment = {
      id: this.pickedPay,
      method_name: this.pickedName,
      payment_method_id: this.pickedPay,
      amount: this.Amount
    };
    this.addToDataSource(newPayment);
  }
  
  addToDataSource(pay: payment) {
    const newData = [...this.dataSource.data, pay];
    this.dataSource.data = newData;
    this.payForm.reset()
    this.totalPay = 0;
    this.pickedPay = -1;
    this.pickedAmount = false;
    this.dataSource.data.forEach(data => {
      this.totalPay = this.totalPay + data.amount;
    });
  }

  deletePay(pay: payment) {
    Swal.fire({
      title: '¿Está seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataSource.data = this.dataSource.data.filter(item => item.id !== pay.id);
        this.totalPay = 0;
        this.dataSource.data.forEach(data => {
          this.totalPay = this.totalPay + data.amount;
        });
      }
    });
  }

  addPay(pay: payment[]) {
    Swal.fire({
      title: 'Realizando pago...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.http.post<any>(`${this.apiURL}/orders/${this.data.id}/payments`, { payments: pay }, {
      headers: {
        Authorization: `Bearer ${this.currentUser.token}`
      }
    }).subscribe({
      next: (response) => {
        Swal.fire('Pago realizado', 'El pago se ha realizado con éxito', 'success');
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo realizar el pago', 'error');
      }
    })
  }
  
}
