const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const QuizzesHandler = require('./src/handlers/quizzesHandler');

const quizzesHandler = new QuizzesHandler(path.join(__dirname, 'data', 'quizzes.json'));

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

  win.loadFile("src/menu.html");

  win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  ipcMain.handle('questions:getAll', async () => quizzesHandler.getAllQuestions());
  ipcMain.handle('questions:add', async (_event, questionData) => quizzesHandler.addQuestion(questionData));
  ipcMain.handle('questions:update', async (_event, id, updates) => quizzesHandler.updateQuestion(id, updates));
  ipcMain.handle('questions:delete', async (_event, id) => quizzesHandler.deleteQuestion(id));

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});