const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
require('@electron/remote/main').initialize();
const url = require('url');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');

const log = require('electron-log');





let mainWindow;
const userDataPath = app.getPath('userData');
const shortcutFile = path.join(userDataPath, 'shortcuts.json');

log.transports.file.level = 'info';
autoUpdater.logger = log;

function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'Japa Count App',
    icon: path.join(__dirname, 'icon', 'japa.ico'),
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  require('@electron/remote/main').enable(mainWindow.webContents);

  const startUrl = url.format({
    pathname: path.join(__dirname, 'japa-app/build', 'index.html'),
    protocol: 'file:',
    slashes: true,
  });

  mainWindow.loadURL(startUrl);

  // mainWindow.loadURL('http://localhost:3000');
  // mainWindow.webContents.openDevTools();

  // ✅ Handle deep link on app launch (cold start)
  const deepLinkArg = process.argv.find((arg) => arg.startsWith('japa://'));
  if (deepLinkArg) {
    console.log('📩 Deep link on cold start:', deepLinkArg); 
    mainWindow.webContents.once('did-finish-load', () => {
      mainWindow.webContents.send('deep-link', deepLinkArg);
    });
  }

  // ✅ Handle deep link when app is already running (warm start)
  app.on('open-url', (event, url) => {
    event.preventDefault();
    if (mainWindow) {
      mainWindow.webContents.send('deep-link', url);
    }
  });

  // ✅ Auto update check
  autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update-available');
  });

  autoUpdater.on('download-progress', (progress) => {
    mainWindow.webContents.send('download-progress', progress);
  });

  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update-downloaded');
  });

  mainWindow.webContents.once('did-finish-load', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}
// ✅ Validate shortcut object structure
function isValidShortcutSet(shortcuts) {
  return (
    shortcuts &&
    typeof shortcuts.increment === 'string' &&
    typeof shortcuts.decrement === 'string' &&
    typeof shortcuts.reset === 'string'
  );
}
// ✅ Register keyboard shortcuts
function registerUserShortcuts(shortcuts) {
  try {
    if (!isValidShortcutSet(shortcuts)) {
      throw new Error('Shortcut keys are missing or invalid');
    }

    globalShortcut.unregisterAll();

    globalShortcut.register(shortcuts.increment, () => {
      mainWindow.webContents.send('increment');
    });

    globalShortcut.register(shortcuts.decrement, () => {
      mainWindow.webContents.send('decrement');
    });

    globalShortcut.register(shortcuts.reset, () => {
      mainWindow.webContents.send('reset');
    });
  } catch (error) {
    console.error('Failed to register shortcuts:', error);
  }
}

app.whenReady().then(() => {
  createWindow();

  // ✅ Setup shortcut handling ===================================
  let savedShortcuts = {
    increment: 'F7',
    decrement: 'F8',
    reset: 'F9',
  };

  // Try loading saved global shortcut config
  if (fs.existsSync(shortcutFile)) {
    try {
      const data = fs.readFileSync(shortcutFile);
      const parsed = JSON.parse(data);
      if (isValidShortcutSet(parsed)) {
        savedShortcuts = parsed;
      } else {
        throw new Error('Invalid shortcut structure');
      }
    } catch (err) {
      console.warn('Invalid shortcuts file, using defaults.');
    }
  }

  registerUserShortcuts(savedShortcuts);

  ipcMain.on('set-user-email', (event, email) => {
    const userFile = path.join(userDataPath, `shortcuts_${email}.json`);

    if (fs.existsSync(userFile)) {
      try {
        const shortcuts = JSON.parse(fs.readFileSync(userFile));
        if (isValidShortcutSet(shortcuts)) {
          registerUserShortcuts(shortcuts);
        } else {
          throw new Error('Invalid user shortcut file structure');
        }
      } catch (err) {
        console.warn('Failed to load user shortcut file, using defaults.');
        registerUserShortcuts({
          increment: 'F7',
          decrement: 'F8',
          reset: 'F9',
        });
      }
    } else {
      registerUserShortcuts({
        increment: 'F7',
        decrement: 'F8',
        reset: 'F9',
      });
    }
  });

  // ✅ Handle shortcut update from UI
  ipcMain.on('update-shortcuts', (event, { email, shortcuts }) => {
    const userFile = path.join(userDataPath, `japa_shortcuts_${email}.json`);
    fs.writeFileSync(userFile, JSON.stringify(shortcuts));
    registerUserShortcuts(shortcuts);
  });

  ipcMain.handle('get-user-shortcuts', (event, email) => {
    const userFile = path.join(
      app.getPath('userData'),
      `japa_shortcuts_${email}.json`
    );

    try {
      if (fs.existsSync(userFile)) {
        const raw = fs.readFileSync(userFile, 'utf-8');
        const data = JSON.parse(raw);

        if (data.increment && data.decrement && data.reset) {
          return data;
        }
      }
    } catch (err) {
      console.error('Error reading shortcuts for:', email, err);
    }

    console.warn('Invalid shortcuts file, using defaults.');
    return {
      increment: 'F7',
      decrement: 'F8',
      reset: 'F9',
    };
  });

  // ✅ Auto-update triggers
  ipcMain.handle('get-app-version', () => app.getVersion());
  ipcMain.on('install-update', () => autoUpdater.quitAndInstall());

  // ✅ Register protocol (first time only)
  if (!app.isDefaultProtocolClient('japa')) {
    app.setAsDefaultProtocolClient('japa');
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // drkr nei
  // Automatically check for updates app ===================================
  // autoUpdater.on('update-available', () => {
  //   mainWindow.webContents.send('update-available');
  // });

  // autoUpdater.on('download-progress', (progress) => {
  //   mainWindow.webContents.send('download-progress', progress);
  // });

  // autoUpdater.on('update-downloaded', () => {
  //   mainWindow.webContents.send('update-downloaded');
  // });

  // Start checking
  // autoUpdater.checkForUpdates();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
