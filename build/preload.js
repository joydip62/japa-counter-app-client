const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    on: (channel, callback) => ipcRenderer.on(channel, callback),
  },
});
