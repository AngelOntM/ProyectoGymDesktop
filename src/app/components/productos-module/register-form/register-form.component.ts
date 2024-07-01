import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class ProductsRegisterFormComponent {
  addPdctForm: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ProductsRegisterFormComponent>) {
    this.addPdctForm = this.fb.group({
      product_name: ['', [Validators.required, Validators.maxLength(30)]],
      description: ['', [Validators.maxLength(200)]],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      stock: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      discount: ['', [Validators.required, Validators.pattern(/^\d{1,3}$/)]],
      active: ['', Validators.required],
      category: [1, Validators.required],
      product_image_path: [null],
    });
  }

  onSubmit(): void {
    if (this.addPdctForm.valid) {
      const formData = { ...this.addPdctForm.value };
      this.dialogRef.close(formData);
    }
  }  

  onClose(): void {
    this.dialogRef.close();
  }

}
