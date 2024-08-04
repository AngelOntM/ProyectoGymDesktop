// src/app/led-control.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArduinoService {
  private portPath = 'COM3'; // Puerto de tu Arduino en Windows

  constructor() {
    // Abrir puerto al iniciar el servicio
    window.serial.openPort(this.portPath);
  }

  turnOnLed() {
    window.serial.sendCommand('1');
  }

  turnOffLed() {
    window.serial.sendCommand('0');
  }

  closePort() {
    window.serial.closePort();
  }
}