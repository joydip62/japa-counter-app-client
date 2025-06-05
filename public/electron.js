const { app, BrowserWindow, globalShortcut } = require("electron");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL("http://localhost:3000"); // or loadFile if using build

  // Register global shortcuts
  globalShortcut.register("Control+I", () => {
    mainWindow.webContents.send("increment");
  });

  globalShortcut.register("Control+D", () => {
    mainWindow.webContents.send("decrement");
  });

  globalShortcut.register("Control+R", () => {
    mainWindow.webContents.send("reset");
  });
}

app.whenReady().then(createWindow);

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
