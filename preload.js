const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 🔁 Send data to main
  send: (channel, data) => {
    const validChannels = [
      'update-shortcuts',
      'set-user-email',
      'install-update',
      'force-logout-focus',
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  // 📥 Receive data from main
  receive: (channel, func) => {
    const validChannels = [
      'increment',
      'decrement',
      'reset',
      'update-available',
      'update-downloaded',
      'download-progress',
      'deep-link',
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_, ...args) => func(...args));
    }
  },

  // 🔁 Listen for deep link only (alias method)
  onDeepLink: (callback) => {
    ipcRenderer.on('deep-link', (event, url) => {
      callback(url);
    });
  },
  // onDeepLink: (callback) =>
  //   ipcRenderer.on('open-deep-link', (_, url) => callback(url)),

  // 📦 Auto update controls
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  installUpdate: () => ipcRenderer.send('install-update'),

  onUpdateDownloaded: (callback) =>
    ipcRenderer.on('update-downloaded', callback),

  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),

  onDownloadProgress: (callback) =>
    ipcRenderer.on('download-progress', (_, progress) => callback(progress)),

  removeAllUpdateListeners: () => {
    ipcRenderer.removeAllListeners('update-downloaded');
    ipcRenderer.removeAllListeners('update-available');
    ipcRenderer.removeAllListeners('download-progress');
  },

  // 🔁 Shortcut hotkey listeners
  onIncrement: (callback) => ipcRenderer.on('increment', callback),
  onDecrement: (callback) => ipcRenderer.on('decrement', callback),
  onReset: (callback) => ipcRenderer.on('reset', callback),

  removeAllListeners: () => {
    ipcRenderer.removeAllListeners('increment');
    ipcRenderer.removeAllListeners('decrement');
    ipcRenderer.removeAllListeners('reset');
  },

  // 🌐 Generic invoke handler (e.g., get-user-shortcuts)
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),

  // drkr nei
  // send: (channel, data) => {
  //   if (
  //     ['update-shortcuts', 'set-user-email', 'install-update'].includes(channel)
  //   ) {
  //     ipcRenderer.send(channel, data);
  //   }
  // },
});
