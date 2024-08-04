const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('serial', {
  openPort: (path) => ipcRenderer.send('serial-open', path),
  sendCommand: (command) => ipcRenderer.send('serial-send', command),
  closePort: () => ipcRenderer.send('serial-close')
});
