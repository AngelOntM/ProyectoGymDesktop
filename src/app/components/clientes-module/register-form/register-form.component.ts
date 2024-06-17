import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common'

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent {
  addUserForm: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<RegisterFormComponent>) {
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      address: ['', Validators.required],
      date_of_birth: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.addUserForm.valid) {
      const dateOfBirthControl = this.addUserForm.get('date_of_birth');
      if (dateOfBirthControl) {
        const dateOfBirthValue = dateOfBirthControl.value;
        const formattedDate = formatDate(dateOfBirthValue, 'yyyy-MM-dd', 'en-US');
        const formData = { ...this.addUserForm.value, date_of_birth: formattedDate };
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
