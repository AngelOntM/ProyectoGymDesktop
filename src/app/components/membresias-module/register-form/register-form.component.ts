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

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<MembresiaRegisterFormComponent>) {
    this.addMbmForm = this.fb.group({
      membership_type: ['', [Validators.required, Validators.maxLength(255)]],
      price: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d{1,2})?$/)]],
      duration_days: ['', [Validators.required, Validators.pattern(/^-?\d+$/)]],
      size: ['', [Validators.required, Validators.pattern(/^-?\d+$/)]],
      active: ['', Validators.required],
      benefits: ['', [Validators.maxLength(200)]],
    });
  }

  onSubmit(): void {
    if (this.addMbmForm.valid) {
      const formData = { ...this.addMbmForm.value };
      this.dialogRef.close(formData);
    }
  }  

  onClose(): void {
    this.dialogRef.close();
  }
}
