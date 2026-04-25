const { app, BrowserWindow } = require('electron');
const path = require('path');

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


  // vvv Fenster mit Konsole öffnet sich beim start, bitte bei zuküftigen Versionen ohne Fenster nur auskommentieren, dass man das easy wieder einschalten kann
   win.webContents.openDevTools(); // Variante mit Konsole im Spielfenster
  // win.webContents.openDevTools({ mode: 'detach' }); // Variante mit Konsle als seperates Fenster

}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

