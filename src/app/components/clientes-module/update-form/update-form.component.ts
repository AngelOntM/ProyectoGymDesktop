import { formatDate } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-form',
  templateUrl: './update-form.component.html',
  styleUrls: ['./update-form.component.css']
})
export class UpdateFormComponent {
  updateUserForm: FormGroup;
  name: any;
  email:any;
  phone: any;
  address: any;
  date: any;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<UpdateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{1,10}$')]],
      address: ['', [Validators.required, Validators.maxLength(60)]],
      date_of_birth: [''],
    });    
  }

  ngOnInit(){
    this.updateUserForm.patchValue({
      name: this.data.name,
      email: this.data.email,
      phone_number: this.data.phone_number,
      address: this.data.address,
      date_of_birth: this.data.date_of_birth,
    });
  }

  onSubmit(): void {
    if (this.updateUserForm.valid) {
      const dateOfBirthControl = this.updateUserForm.get('date_of_birth');
      if (dateOfBirthControl) {
        const dateOfBirthValue = dateOfBirthControl.value;
        const formattedDate = formatDate(dateOfBirthValue, 'yyyy-MM-dd', 'en-US');
        const formData = { ...this.updateUserForm.value, date_of_birth: formattedDate };
        this.dialogRef.close(formData);
      } else {
        console.error('El control date_of_birth no está disponible en el formulario.');
      }
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
