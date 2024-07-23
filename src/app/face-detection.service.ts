import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';
import { environment } from 'src/enviroment/enviroment';
import Swal from 'sweetalert2';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class FaceDetectionService {
  private videoInput!: HTMLVideoElement;
  private faceDetectionInterval: any;
  private continuousFaceTime: number = 0;
  private detectionThreshold: number = 5;
  private apiURL = environment.apiURL;
  private currentUser: any;
  private isExecuting: boolean = false;

  constructor(private http: HttpClient, private userService: UserService) {
    this.currentUser = userService.getLoggedInUser();
  }

  async initialize() {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('assets/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('assets/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('assets/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('assets/models')
    ]);
    this.startVideo();
  }

  private startVideo() {
    const videoElement = document.createElement('video');
    videoElement.width = 440;
    videoElement.height = 280;
    videoElement.style.display = 'none';
    document.body.appendChild(videoElement);

    this.videoInput = videoElement;

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        this.videoInput.srcObject = stream;
        this.videoInput.play();
        this.videoInput.addEventListener('play', () => {
          const canvasElement = document.createElement('canvas');
          canvasElement.width = this.videoInput.width;
          canvasElement.height = this.videoInput.height;
          canvasElement.style.display = 'none';
          document.body.appendChild(canvasElement);

          const displaySize = { width: this.videoInput.width, height: this.videoInput.height };
          faceapi.matchDimensions(canvasElement, displaySize);

          this.faceDetectionInterval = setInterval(async () => {
            if (!this.isExecuting) {
              const detections = await faceapi.detectSingleFace(this.videoInput, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();

              const ctx = canvasElement.getContext('2d');
              ctx?.clearRect(0, 0, canvasElement.width, canvasElement.height);

              if (detections) {
                faceapi.draw.drawDetections(canvasElement, faceapi.resizeResults(detections, displaySize));
                this.continuousFaceTime += 0.1;
                if (this.continuousFaceTime >= this.detectionThreshold) {
                  this.continuousFaceTime = 0;
                  this.isExecuting = true;
                  await this.executeMethod(detections);
                  this.isExecuting = false;
                  this.stopDetection();
                  await this.sleep(8000);
                  this.startVideo();
                }
              } else {
                this.continuousFaceTime = 0;
              }
            }
          }, 100);
        });
      })
      .catch(err => console.error('Error al acceder a la cámara:', err));
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async executeMethod(detections: any) {
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = detections.detection.box.width;
    faceCanvas.height = detections.detection.box.height;
    const faceCtx = faceCanvas.getContext('2d')!;
    faceCtx.drawImage(
      this.videoInput,
      detections.detection.box.x,
      detections.detection.box.y,
      detections.detection.box.width,
      detections.detection.box.height,
      0,
      0,
      detections.detection.box.width,
      detections.detection.box.height
    );

    const blob = await new Promise<Blob | null>(resolve => faceCanvas.toBlob(resolve, 'image/jpg'));

    if (blob) {
      const formData = new FormData();
      formData.append('face_image', blob, 'face.jpg');
      this.http.post<any>(`${this.apiURL}/visits/process-image`, formData, {
        headers: {
          Authorization: `Bearer ${this.currentUser.token}`
        }
      }).subscribe({
        next: (response) => {
          console.log("visita");
        },
        error: (err) => {
          console.log("error en visita");
        }
      });
    }
  }

  stopDetection() {
    if (this.videoInput && this.videoInput.srcObject) {
      const stream = this.videoInput.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }

    clearInterval(this.faceDetectionInterval);
    document.body.removeChild(this.videoInput);
  }
}
