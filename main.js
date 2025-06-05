const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");

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

  mainWindow.loadURL("https://japa-counter-app-client.onrender.com/");

  // mainWindow.loadFile(path.join(__dirname, "build", "index.html"));
  // mainWindow.webContents.openDevTools(); // <== This helps debug any error
}

app.whenReady().then(() => {
  createWindow();

  globalShortcut.register("CommandOrControl+R", () => {
    console.log("Refresh disabled");
  });

  // ✅ Register global shortcuts **AFTER** the window is created
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
