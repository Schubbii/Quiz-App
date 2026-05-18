const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs/promises');
const path = require('path');

let audioWindow;

// --Silas Ciupke--
function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 1024,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile('src/start.html');
  win.setMenuBarVisibility(false);


  // --Vincent Rothweiler--


  win.on("closed", () => {
  if (audioWindow && !audioWindow.isDestroyed()) {
    audioWindow.destroy();
  }

});

}

// --Vincent Rothweiler--
function createAudioWindow() {
  audioWindow = new BrowserWindow({
    width: 1,
    height: 1,
    show: false,
    frame: false,
    skipTaskbar: true,
    focusable: false,
    webPreferences: {
      preload: path.join(__dirname, "src", "audio-window", "audio-preload.js"),
      contextIsolation: true,
      nodeIntegration: false,

      autoplayPolicy: "no-user-gesture-required",
    },
  });

  audioWindow.loadFile(path.join(__dirname, "src", "audio-window", "audio.html"));

  audioWindow.on("closed", () => {
    audioWindow = null;
  });
}

// --Vincent Rothweiler--
function sendToAudioWindow(channel, value) {
  if (!audioWindow || audioWindow.isDestroyed()) return;

  audioWindow.webContents.send(channel, value);
}

ipcMain.on("sound:play", (_event, soundName) => {
  sendToAudioWindow("sound:play", soundName);
});

ipcMain.on("music:play", (_event, musicName) => {
  sendToAudioWindow("music:play", musicName);
});

ipcMain.on("music:stop", (_event, musicName) => {
  sendToAudioWindow("music:stop", musicName);
});

ipcMain.on("music:pause", (_event, musicName) => {
  sendToAudioWindow("music:pause", musicName);
});

ipcMain.on("sfx:set-muted", (_event, isMuted) => {
  sendToAudioWindow("sfx:set-muted", isMuted);
});

// --Vincent Rothweiler + Silas Ciupke--
ipcMain.handle("mediawiki:getLinks", async () => {
  const filePath = path.join(__dirname, "src", "database", "mediawikiLinks.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
});


app.whenReady().then(() => {
  createWindow();
  createAudioWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

