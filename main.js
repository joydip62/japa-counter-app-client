const { app, BrowserWindow, globalShortcut } = require('electron');
const url = require('url');
const path = require('path');

let mainWindow;

function createWindow() {
     mainWindow = new BrowserWindow({
       title: 'Japa Count App',
       icon: path.join(__dirname, './japa-app/build/icon.ico'),
       width: 800,
       height: 600,
       icon: 'japa.ico',
       webPreferences: {
         preload: path.join(__dirname, 'preload.js'),
         contextIsolation: true,
         nodeIntegration: false,
       },
     });
    
    // mainWindow.webContents.openDevTools();
  
    const startUrl = url.format({
        pathname: path.join(__dirname, './japa-app/build/index.html'),
        protocol: 'file',
    })

  mainWindow.loadURL(startUrl);

  // mainWindow.loadURL('http://localhost:3000');
  

}

// app.whenReady().then(createWindow);

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register('F7', () => {
    if (mainWindow) {
      mainWindow.webContents.send('increment');
    }
  });

  globalShortcut.register('F8', () => {
    if (mainWindow) {
      mainWindow.webContents.send('decrement');
    }
  });

  globalShortcut.register('F9', () => {
    if (mainWindow) {
      mainWindow.webContents.send('reset');
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});