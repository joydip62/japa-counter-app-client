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

const currentUserFile = path.join(userDataPath, 'current_user_email.json');

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

// ✅ Setup shortcut handling ===================================
// let savedShortcuts = {
//   increment: 'F7',
//   decrement: 'F8',
//   reset: 'F9',
// };

let defaultShortcuts = {
  increment: 'F7',
  decrement: 'F8',
  reset: 'F9',
};
 
// ✅ Validate shortcut object structure
// function isValidShortcutSet(shortcuts) {
//   return (
//     shortcuts &&
//     typeof shortcuts.increment === 'string' &&
//     typeof shortcuts.decrement === 'string' &&
//     typeof shortcuts.reset === 'string'
//   );
// }
function isValidShortcutSet(obj) {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.increment === 'string' &&
    typeof obj.decrement === 'string' &&
    typeof obj.reset === 'string'
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

  // Try loading saved global shortcut config
  // if (fs.existsSync(shortcutFile)) {
  //   try {
  //     const data = fs.readFileSync(shortcutFile);
  //     const parsed = JSON.parse(data);
  //     if (isValidShortcutSet(parsed)) {
  //       savedShortcuts = parsed;
  //     } else {
  //       throw new Error('Invalid shortcut structure');
  //     }
  //   } catch (err) {
  //     console.warn('Invalid shortcuts file, using defaults.');
  //   }
  // }

  // ipcMain.on('set-user-email', (event, email) => {
  //   // const userFile = path.join(userDataPath, `shortcuts_${email}.json`);
  //   const userFile = path.join(userDataPath, `japa_shortcuts_${email}.json`);

  //   fs.writeFileSync(currentUserFile, JSON.stringify(email));

  //   if (fs.existsSync(userFile)) {
  //     try {
  //       const shortcuts = JSON.parse(fs.readFileSync(userFile));
  //       if (isValidShortcutSet(shortcuts)) {
  //         registerUserShortcuts(shortcuts);
  //       } else {
  //         throw new Error('Invalid user shortcut file structure');
  //       }
  //     } catch (err) {
  //       console.warn('Failed to load user shortcut file, using defaults.');
  //       registerUserShortcuts({
  //         increment: 'F7',
  //         decrement: 'F8',
  //         reset: 'F9',
  //       });
  //     }
  //   } else {
  //     registerUserShortcuts({
  //       increment: 'F7',
  //       decrement: 'F8',
  //       reset: 'F9',
  //     });
  //   }
  // });

  // // ✅ Handle shortcut update from UI
  // ipcMain.on('update-shortcuts', (event, { email, shortcuts }) => {
  //   const userFile = path.join(userDataPath, `japa_shortcuts_${email}.json`);
  //   fs.writeFileSync(userFile, JSON.stringify(shortcuts));
  //   fs.writeFileSync(currentUserFile, JSON.stringify(email));
  //   registerUserShortcuts(shortcuts);
  // });

  // ipcMain.handle('get-user-shortcuts', (event, email) => {
  //   // const userFile = path.join(app.getPath('userData'),`japa_shortcuts_${email}.json`);
  //   const userFile = path.join(userDataPath, `japa_shortcuts_${email}.json`);

  //   try {
  //     if (fs.existsSync(userFile)) {
  //       const raw = fs.readFileSync(userFile, 'utf-8');
  //       const data = JSON.parse(raw);

  //       if (data.increment && data.decrement && data.reset) {
  //         return data;
  //       }
  //     }
  //   } catch (err) {
  //     console.error('Error reading shortcuts for:', email, err);
  //   }

  //   console.warn('Invalid shortcuts file, using defaults.');
  //   return {
  //     increment: 'F7',
  //     decrement: 'F8',
  //     reset: 'F9',
  //   };
  // });

  // ipcMain.handle('register-shortcuts-after-login', async (event, email) => {
  //   const userFile = path.join(userDataPath, `japa_shortcuts_${email}.json`);
  //   let shortcuts = {
  //     increment: 'F7',
  //     decrement: 'F8',
  //     reset: 'F9',
  //   };

  //   if (fs.existsSync(userFile)) {
  //     const data = fs.readFileSync(userFile);
  //     shortcuts = JSON.parse(data);
  //   }

  //   // First, unregister old
  //   globalShortcut.unregisterAll();

  //   // Register updated
  //   globalShortcut.register(shortcuts.increment, () => {
  //     event.sender.send('shortcut-pressed', 'increment');
  //   });
  //   globalShortcut.register(shortcuts.decrement, () => {
  //     event.sender.send('shortcut-pressed', 'decrement');
  //   });
  //   globalShortcut.register(shortcuts.reset, () => {
  //     event.sender.send('shortcut-pressed', 'reset');
  //   });

  //   return true;
  // });

  // ✅ Setup shortcut handling ==================================

  // Load last active user's shortcut
  if (fs.existsSync(currentUserFile)) {
    try {
      const currentEmail = JSON.parse(fs.readFileSync(currentUserFile));
      const userFile = path.join(
        userDataPath,
        `japa_shortcuts_${currentEmail}.json`
      );
      if (fs.existsSync(userFile)) {
        const data = JSON.parse(fs.readFileSync(userFile));
        if (isValidShortcutSet(data)) {
          defaultShortcuts = data;
        } else {
          console.warn('User shortcut file exists but is invalid. Using fallback defaults.');
        }
      } else {
        console.log('No shortcut file found for user. Using fallback defaults.');
      }
    } catch (err) {
      console.error('Error reading user shortcut file:', err);
    }
  }

  registerUserShortcuts(defaultShortcuts);

  
  // After login, set email + apply shortcuts
  ipcMain.on('set-user-email', (event, email) => {
    const userFile = path.join(userDataPath, `japa_shortcuts_${email}.json`);
    fs.writeFileSync(currentUserFile, JSON.stringify(email));

    let shortcutsToApply = defaultShortcuts;

    if (fs.existsSync(userFile)) {
      try {
        const userShortcuts = JSON.parse(fs.readFileSync(userFile));
        if (isValidShortcutSet(userShortcuts)) {
          shortcutsToApply = userShortcuts;
        }
      } catch (err) {
        console.warn('Error loading user shortcut file. Using defaults.');
      }
    }

    registerUserShortcuts(shortcutsToApply);
    event.sender.send('shortcuts-registered', shortcutsToApply); // Optional feedback to renderer
  });

  // Save + apply new shortcuts from frontend
  ipcMain.on('update-shortcuts', (event, { email, shortcuts }) => {
  const userFile = path.join(userDataPath, `japa_shortcuts_${email}.json`);
  fs.writeFileSync(userFile, JSON.stringify(shortcuts)); // Save shortcuts to file
  fs.writeFileSync(currentUserFile, JSON.stringify(email)); // Save current user email
  registerUserShortcuts(shortcuts); // Register the new shortcuts
  event.sender.send('shortcuts-registered', shortcuts); // Optional feedback to renderer
});


  // Used by renderer to get current user shortcut config
  ipcMain.handle('get-user-shortcuts', (event, email) => {
    const userFile = path.join(userDataPath, `japa_shortcuts_${email}.json`);

    if (fs.existsSync(userFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(userFile, 'utf-8'));
        if (isValidShortcutSet(data)) {
          return data;
        }
      } catch (err) {
        console.warn('Error parsing user shortcut file.');
      }
    }

    return defaultShortcuts;
  });

  // Optional helper: called after login (can be used from renderer)
  ipcMain.handle('register-shortcuts-after-login', async (event, email) => {
    const userFile = path.join(userDataPath, `japa_shortcuts_${email}.json`);
    let shortcuts = defaultShortcuts;

    if (fs.existsSync(userFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(userFile));
        if (isValidShortcutSet(data)) {
          shortcuts = data;
        }
      } catch {
        console.warn('Failed to parse shortcut file, using default.');
      }
    }

    registerUserShortcuts(shortcuts);
    return true;
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
});

ipcMain.on('force-logout-focus', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.show(); 
    mainWindow.focus();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
