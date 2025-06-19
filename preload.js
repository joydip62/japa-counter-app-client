const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // app download and update install
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

  // shortcut key
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),
  onIncrement: (callback) => ipcRenderer.on('increment', callback),
  onDecrement: (callback) => ipcRenderer.on('decrement', callback),
  onReset: (callback) => ipcRenderer.on('reset', callback),
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners('increment');
    ipcRenderer.removeAllListeners('decrement');
    ipcRenderer.removeAllListeners('reset');
  },
  receive: (channel, func) => {
    const validChannels = [
      'increment',
      'decrement',
      'reset',
      'update-available',
      'update-downloaded',
      'download-progress',
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_, ...args) => func(...args));
    }
  },
  send: (channel, data) => {
    if (
      ['update-shortcuts', 'set-user-email', 'install-update'].includes(channel)
    ) {
      ipcRenderer.send(channel, data);
    }
  },
});
