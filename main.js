const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs/promises');
const path = require('path');
const SessionHistoryHandler = require('./src/handlers/sessionHistoryHandler');

let audioWindow;
let audioReady = false;
const pendingSounds = [];
let sessionHistory;

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


  // Fenster mit Konsole öffnet sich beim start, bitte bei zuküftigen Versionen ohne Fenster nur auskommentieren, dass man das easy wieder einschalten kann:
  //                                        vvv
   win.webContents.openDevTools(); // Variante mit Konsole im Spielfenster
   win.webContents.openDevTools({ mode: 'detach' }); // Variante mit Konsle als seperates Fenster


  win.on("closed", () => {
  if (audioWindow && !audioWindow.isDestroyed()) {
    audioWindow.destroy();
  }

});

}

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

      // Electron defaults to this, but being explicit is fine for a sound host.
      autoplayPolicy: "no-user-gesture-required",
    },
  });

  audioWindow.loadFile(path.join(__dirname, "src", "audio-window", "audio.html"));

  audioWindow.webContents.once("did-finish-load", () => {
    audioReady = true;

    for (const soundName of pendingSounds) {
      audioWindow.webContents.send("ui-sound:play", soundName);
    }

    pendingSounds.length = 0;
  });

  audioWindow.on("closed", () => {
    audioWindow = null;
    audioReady = false;
  });
}

function playUiSound(soundName) {
  if (!audioWindow || audioWindow.isDestroyed()) {
    createAudioWindow();
  }

  if (!audioReady) {
    pendingSounds.push(soundName);
    return;
  }

  audioWindow.webContents.send("ui-sound:play", soundName);
}

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

ipcMain.handle("mediawiki:getLinks", async () => {
  const filePath = path.join(__dirname, "src", "database", "mediawikiLinks.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
});

ipcMain.handle("history:getBlockedQuestionIds", async () => {
  if (!sessionHistory) return [];
  return sessionHistory.getBlockedQuestionIds();
});

ipcMain.handle("history:saveSessionQuestions", async (_event, questionIds) => {
  if (!sessionHistory) return false;
  await sessionHistory.saveSessionQuestions(questionIds);
  return true;
});

app.whenReady().then(async () => {
  sessionHistory = new SessionHistoryHandler(path.join(app.getPath('userData'), 'sessionHistory.json'));
  await sessionHistory.init();

  createWindow();
  createAudioWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

