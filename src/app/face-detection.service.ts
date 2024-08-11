import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';
import { environment } from 'src/enviroment/enviroment';
import Swal from 'sweetalert2';
import { UserService } from './user.service';
import { ArduinoService } from './arduino.service';

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

  constructor(private http: HttpClient, private userService: UserService,
    private arduinoService: ArduinoService
  ) {
    //this.currentUser = userService.getLoggedInUser();
  }

  async initialize() {
    this.currentUser = this.userService.getLoggedInUser();
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
                this.arduinoService.sendCommand("3");
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
                this.arduinoService.sendCommand("4");
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
          this.showFloatingCard("Visita exitosa, puede pasar", "green");
          this.arduinoService.sendCommand("4");
          this.arduinoService.sendCommand("57");
          setTimeout(() => {
            this.arduinoService.sendCommand("68");
          }, 5000);
        },
        error: (err) => {
          const errorMessage = err?.error?.message || 'Error al registrar la visita';
          this.showFloatingCard(`Error: ${errorMessage}`, 'red');
          this.arduinoService.sendCommand("4");
          this.arduinoService.sendCommand("1")
          setTimeout(() => {
            this.arduinoService.sendCommand("2");
          }, 5000);
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

  showFloatingCard(message: string, borderColor: string) {
    const card = document.createElement('div');
    card.textContent = message;
    card.style.position = 'fixed';
    card.style.bottom = '20px';
    card.style.right = '20px';
    card.style.backgroundColor = '#fff';
    card.style.border = `2px solid ${borderColor}`;
    card.style.borderRadius = '8px';
    card.style.padding = '10px';
    card.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    card.style.zIndex = '1000';
    card.style.transition = 'opacity 0.5s';

    document.body.appendChild(card);

    setTimeout(() => {
      card.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(card);
      }, 500); // Espera 0.5 segundos más para que desaparezca
    }, 5000); // Desaparece después de 5 segundos
  }

}
