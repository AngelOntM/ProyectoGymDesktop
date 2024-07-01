import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-form',
  templateUrl: './update-form.component.html',
  styleUrls: ['./update-form.component.css']
})
export class MembresiaUpdateFormComponent {
  updateMbmForm: FormGroup;
  product_name: any;
  price:any;
  description: any;
  discount: any;
  duration_days: any;
  size: any;
  active: any;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<MembresiaUpdateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateMbmForm = this.fb.group({
      product_name: ['', [Validators.required, Validators.maxLength(30)]],
      price: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d{1,2})?$/)]],
      description: ['',[Validators.required, Validators.maxLength(200)]],
      discount: ['', [Validators.required, Validators.pattern(/^\d{1,3}$/)]],
      duration_days: ['', [Validators.required, Validators.pattern(/^-?\d+$/)]],
      size: ['', [Validators.required, Validators.pattern(/^-?\d+$/)]],
      active: ['', Validators.required],
      category: [2, Validators.required],
      product_image_path: [null],
    });
  }

  ngOnInit(){
    this.updateMbmForm.patchValue({
      product_name: this.data.product_name,
      discount: this.data.discount,
      price: this.data.price,
      duration_days: this.data.duration_days,
      size: this.data.size,
      active: this.data.active === 1 ? true : false,
      description: this.data.description,
    });
  }

  onSubmit(): void {
    if (this.updateMbmForm.valid) {
      const formData = { ...this.updateMbmForm.value };
      this.dialogRef.close(formData);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
