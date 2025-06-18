const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  installUpdate: () => ipcRenderer.send('install-update'),
  onUpdateDownloaded: (callback) =>
    ipcRenderer.on('update-downloaded', callback),
  removeUpdateDownloadedListener: () =>
    ipcRenderer.removeAllListeners('update-downloaded'),
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
