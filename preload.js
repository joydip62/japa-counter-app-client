const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onIncrement: (callback) => {
    // console.log("Registered onIncrement");
    ipcRenderer.on("increment", callback);
  },
  onDecrement: (callback) => {
    // console.log("Registered onDecrement");
    ipcRenderer.on("decrement", callback);
  },
  onReset: (callback) => {
    // console.log("Registered onReset");
    ipcRenderer.on("reset", callback);
  },
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners("increment");
    ipcRenderer.removeAllListeners("decrement");
    ipcRenderer.removeAllListeners("reset");
  },
});
