const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");
const isDev = !app.isPackaged;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // if (isDev) {
  //   mainWindow.loadURL("http://localhost:3000");
  //   mainWindow.webContents.openDevTools();
  // } else {
  //   mainWindow.loadFile(path.join(__dirname, "build", "index.html"));
  //   // Uncomment this line to debug the packaged app
  //   mainWindow.webContents.openDevTools();
  // }
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.once("ready-to-show", () => mainWindow.show());
  } else {
    mainWindow.loadFile(path.join(__dirname, "build", "index.html"));
    mainWindow.once("ready-to-show", () => mainWindow.show());
  }
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register("F7", () => {
    if (mainWindow) {
      mainWindow.webContents.send("increment");
    }
  });

  globalShortcut.register("F8", () => {
    if (mainWindow) {
      mainWindow.webContents.send("decrement");
    }
  });

  globalShortcut.register("F9", () => {
    if (mainWindow) {
      mainWindow.webContents.send("reset");
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
