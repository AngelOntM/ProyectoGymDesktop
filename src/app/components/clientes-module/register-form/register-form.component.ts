import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit, OnDestroy {
  addUserForm: FormGroup;
  capturedPhoto: File | null = null;
  capturedPhotoUrl: string | null = null;
  defaultImg = "assets/img/noImage.jpg"
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef;
  video!: HTMLVideoElement;
  isCameraReady: boolean = false;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<RegisterFormComponent>) {
    this.addUserForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{1,10}$')]],
      address: ['', [Validators.required, Validators.maxLength(60)]],
      date_of_birth: [''],
    });
  }

  ngOnInit(): void {
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
    if (this.addUserForm.valid && this.capturedPhoto) {
      const dateOfBirthControl = this.addUserForm.get('date_of_birth');
      if (dateOfBirthControl) {
        const dateOfBirthValue = dateOfBirthControl.value;
        const formattedDate = formatDate(dateOfBirthValue, 'yyyy-MM-dd', 'en-US');
        const formData = new FormData();
        formData.append('name', this.addUserForm.value.name);
        formData.append('email', this.addUserForm.value.email);
        formData.append('phone_number', this.addUserForm.value.phone_number);
        formData.append('address', this.addUserForm.value.address);
        formData.append('date_of_birth', formattedDate);
        formData.append('face_image', this.capturedPhoto);
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
