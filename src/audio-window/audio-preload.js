const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("audioHost", {
  onPlay(callback) {
    ipcRenderer.on("ui-sound:play", (_event, soundName) => {
      callback(soundName);
    });
  },
});