const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("audioHost", {
  onPlaySound(callback) {
    ipcRenderer.on("sound:play", (_event, soundName) => {
      callback(soundName);
    });
  },

  onPlayMusic(callback) {
    ipcRenderer.on("music:play", (_event, musicName) => {
      callback(musicName);
    });
  },

  onStopMusic(callback) {
    ipcRenderer.on("music:stop", (_event, musicName) => {
      callback(musicName);
    });
  },

  onPauseMusic(callback) {
    ipcRenderer.on("music:pause", (_event, musicName) => {
      callback(musicName);
    });
  },

  onSetSfxMuted(callback) {
    ipcRenderer.on("sfx:set-muted", (_event, isMuted) => {
      callback(isMuted);
    });
  },
});