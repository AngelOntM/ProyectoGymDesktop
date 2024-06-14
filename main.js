const {app, BrowserWindow} = require('electron');  
const url = require('url');
const path = require('path');   
	
function onReady () {     
	win = new BrowserWindow({width: 900, height: 6700})    
	win.loadURL(url.format({      
		pathname: path.join(
			__dirname,
			'dist/Gymbros-Desktop-App/index.html'),       
		protocol: 'file:',      
		slashes: true     
	}))   
} 

app.on('ready', onReady);

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
