import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-form',
  templateUrl: './update-form.component.html',
  styleUrls: ['./update-form.component.css']
})
export class ProductsUpdateFormComponent {
  updatePdctForm: FormGroup;
  product_name: any;
  description: any;
  price: any;
  stock: any;
  discount: any;
  active: any;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ProductsUpdateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updatePdctForm = this.fb.group({
      product_name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(200)]],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      stock: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      discount: ['', [Validators.required, Validators.pattern(/^\d{1,3}$/)]],
      active: ['', Validators.required],
      category: [1, Validators.required],
      product_image_path: [null],
    });
  }

  ngOnInit(){
    this.updatePdctForm.patchValue({
      product_name: this.data.product_name,
      description: this.data.description,
      price: this.data.price,
      stock: this.data.stock,
      discount: this.data.discount,
      active: this.data.active === 1 ? true : false,
    });
  }

  onSubmit(): void {
    if (this.updatePdctForm.valid) {
      const formData = { ...this.updatePdctForm.value };
      this.dialogRef.close(formData);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
