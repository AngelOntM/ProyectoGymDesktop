import { formatDate } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-form',
  templateUrl: './update-form.component.html',
  styleUrls: ['./update-form.component.css']
})
export class EmployeeUpdateFormComponent {
  updateUserForm: FormGroup;
  name: any;
  email:any;
  phone: any;
  address: any;
  date: any;
  capturedPhoto: File | null = null;
  capturedPhotoUrl: string | null = null;
  defaultImg = "assets/img/noImage.jpg"
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef;
  video!: HTMLVideoElement;
  isCameraReady: boolean = false;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<EmployeeUpdateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{1,10}$')]],
      address: ['', [Validators.required, Validators.maxLength(60)]],
      date_of_birth: ['', Validators.required],
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
    this.startCamera();
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      this.video = this.videoElement.nativeElement;
      this.video.srcObject = stream;
      this.video.play();
      this.isCameraReady = true
    }).catch((err) => {
      Swal.fire('Error', 'No se pudo acceder a la camara', 'error')
      this.isCameraReady = false
    });
  }

  stopCamera() {
    if (this.video && this.video.srcObject) {
      const stream = this.video.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  }

  dataURLToFile(dataURL: string, filename: string): File {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  capturePhoto() {
    const canvas = document.createElement('canvas');
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(this.video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL('image/png');
      this.capturedPhoto = this.dataURLToFile(dataURL, 'captured-photo.png');
      this.capturedPhotoUrl = URL.createObjectURL(this.capturedPhoto);
    }
  }

  onSubmit(): void {
    if (this.updateUserForm.valid) {
      const dateOfBirthControl = this.updateUserForm.get('date_of_birth');
      if (dateOfBirthControl) {
        const dateOfBirthValue = dateOfBirthControl.value;
        const formattedDate = formatDate(dateOfBirthValue, 'yyyy-MM-dd', 'en-US');
        const formData = new FormData();
        formData.append('name', this.updateUserForm.value.name);
        formData.append('email', this.updateUserForm.value.email);
        formData.append('phone_number', this.updateUserForm.value.phone_number);
        formData.append('address', this.updateUserForm.value.address);
        formData.append('date_of_birth', formattedDate);
        if(this.capturedPhoto){
          formData.append('face_image', this.capturedPhoto);
        }
        this.dialogRef.close(formData);
      } else {
        Swal.fire('Formato de fecha', 'El formato de fecha es incorrecto', 'warning')
      }
    }else{
      Swal.fire('Formulario Incompleto', 'Debes rellenar los campos', 'warning')
    }
  }

  deletePhoto(){
    this.capturedPhoto = null
    this.capturedPhotoUrl = ""
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
