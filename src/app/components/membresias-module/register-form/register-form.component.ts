import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class MembresiaRegisterFormComponent {
  addMbmForm: FormGroup;
  imageFile: File | null = null;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<MembresiaRegisterFormComponent>) {
    this.addMbmForm = this.fb.group({
      product_name: ['', [Validators.required, Validators.maxLength(30)]],
      price: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d{1,2})?$/)]],
      description: ['',[Validators.required, Validators.maxLength(200)]],
      discount: ['', [Validators.required, Validators.pattern(/^\d{1,3}$/)]],
      duration_days: ['', [Validators.required, Validators.pattern(/^-?\d+$/)]],
      size: ['', [Validators.required, Validators.pattern(/^-?\d+$/)]],
      active: ['', Validators.required],
      category: [2, Validators.required],
      product_image_path: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.addMbmForm.valid && this.imageFile) {
      const formData = new FormData()
      formData.append('product_name', this.addMbmForm.get('product_name')!.value);
      formData.append('description', this.addMbmForm.get('description')!.value || '');
      formData.append('price', this.addMbmForm.get('price')!.value);
      formData.append('size', this.addMbmForm.get('size')!.value);
      formData.append('discount', this.addMbmForm.get('discount')!.value);
      formData.append('duration_days', this.addMbmForm.get('duration_days')!.value);
      formData.append('active', this.addMbmForm.get('active')!.value ? "1" : "0");
      formData.append('category', this.addMbmForm.get('category')!.value);
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
