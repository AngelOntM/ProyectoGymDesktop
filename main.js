const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const SerialPort = require('serialport').SerialPort;

let port;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    }
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/Gymbros-Desktop-App/index.html'),
    protocol: 'file:',
    slashes: true
  }));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('serial-open', (event, path) => {
  port = new SerialPort({ path, baudRate: 9600 });

  port.on('open', () => {
    console.log('Port opened:', path);
  });

  port.on('error', (err) => {
    console.error('Error opening port:', err.message);
  });
});

ipcMain.on('serial-send', (event, command) => {
  if (port && port.isOpen) {
    port.write(command + '\n', (err) => {
      if (err) {
        return console.error('Error on write:', err.message);
      }
      console.log('Message written:', command);
    });
  }
});

ipcMain.on('serial-close', () => {
  if (port) {
    port.close((err) => {
      if (err) {
        return console.error('Error closing port:', err.message);
      }
      console.log('Port closed');
    });
  }
});

// const { app, BrowserWindow } = require('electron');
// const url = require('url');
// const path = require('path');

// function onReady() {
//     // Crear la ventana en pantalla completa
//     win = new BrowserWindow({
//         fullscreen: true,
//         webPreferences: {
//             nodeIntegration: true,
//             contextIsolation: false
//         }
//     });

//     // Cargar la URL de la aplicación Angular
//     win.loadURL(url.format({
//         pathname: path.join(__dirname, 'dist/Gymbros-Desktop-App/index.html'),
//         protocol: 'file:',
//         slashes: true
//     }));

//     // Eventualmente, eliminar la barra de menú (opcional)
//     win.setMenuBarVisibility(false);
// }

// app.on('ready', onReady);
