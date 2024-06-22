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
  membership_type: any;
  price:any;
  duration_days: any;
  size: any;
  active: any;
  benefits: any;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<MembresiaUpdateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateMbmForm = this.fb.group({
      membership_type: ['', [Validators.required, Validators.maxLength(255)]],
      price: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d{1,2})?$/)]],
      duration_days: ['', [Validators.required, Validators.pattern(/^-?\d+$/)]],
      size: ['', [Validators.required, Validators.pattern(/^-?\d+$/)]],
      active: ['', Validators.required],
      benefits: ['', [Validators.maxLength(200)]],
    });
  }

  ngOnInit(){
    this.updateMbmForm.patchValue({
      membership_type: this.data.membership_type,
      price: this.data.price,
      duration_days: this.data.duration_days,
      size: this.data.size,
      active: this.data.active === 1 ? true : false,
      benefits: this.data.benefits,
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
