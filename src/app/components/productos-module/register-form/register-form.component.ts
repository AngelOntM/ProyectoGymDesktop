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
  imageFile: File | null = null;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ProductsRegisterFormComponent>) {
    this.addPdctForm = this.fb.group({
      product_name: ['', [Validators.required, Validators.maxLength(30)]],
      description: ['', [Validators.maxLength(200)]],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      stock: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      discount: ['', [Validators.required, Validators.pattern(/^\d{1,3}$/)]],
      active: ['', Validators.required],
      category: [1, Validators.required],
      product_image_path: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.addPdctForm.valid && this.imageFile) {
      const formData = new FormData()
      formData.append('product_name', this.addPdctForm.get('product_name')!.value);
      formData.append('description', this.addPdctForm.get('description')!.value || '');
      formData.append('price', this.addPdctForm.get('price')!.value);
      formData.append('stock', this.addPdctForm.get('stock')!.value);
      formData.append('discount', this.addPdctForm.get('discount')!.value);
      formData.append('active', this.addPdctForm.get('active')!.value ? "1" : "0");
      formData.append('category', this.addPdctForm.get('category')!.value);
      formData.append('product_image_path', this.imageFile);
      this.dialogRef.close(formData);
    }
  } 

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.imageFile = file;
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
