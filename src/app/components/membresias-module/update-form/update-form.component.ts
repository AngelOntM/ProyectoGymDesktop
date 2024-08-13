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
  imageFile: File | null = null;
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
      active: this.data.active === true ? true : false,
      description: this.data.description,
    });
  }

  onSubmit(): void {
    if (this.updateMbmForm.valid) {
      const formData = new FormData()
      formData.append('product_name', this.updateMbmForm.get('product_name')!.value);
      formData.append('description', this.updateMbmForm.get('description')!.value || '');
      formData.append('price', this.updateMbmForm.get('price')!.value);
      formData.append('size', this.updateMbmForm.get('size')!.value);
      formData.append('discount', this.updateMbmForm.get('discount')!.value);
      formData.append('duration_days', this.updateMbmForm.get('duration_days')!.value);
      formData.append('active', this.updateMbmForm.get('active')!.value ? "1" : "0");
      formData.append('category', this.updateMbmForm.get('category')!.value);
      if(this.imageFile){
        formData.append('product_image_path', this.imageFile);
      }
      this.dialogRef.close(formData);
    }
  }

  onFileSelected(event: any): void {
    this.imageFile = null
    const file: File = event.target.files[0];
    if (file) {
      this.imageFile = file;
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
