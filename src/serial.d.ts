// src/serial.d.ts
interface Window {
    serial: {
      openPort: (path: string) => void;
      sendCommand: (command: string) => void;
      closePort: () => void;
    };
  }
  