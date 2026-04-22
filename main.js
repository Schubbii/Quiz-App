const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('./src/database/database');
const QuizzesHandler = require('./src/handlers/quizzesHandler');

let database;
let quizzesHandler;

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

  win.loadFile('src/menu.html');
  win.setMenuBarVisibility(false);
}

app.whenReady().then(async () => {
  const dbPath = path.join(app.getPath('userData'), 'database', 'quiz.sqlite');
  database = new Database(dbPath);
  await database.init();
  quizzesHandler = new QuizzesHandler(database);

  ipcMain.handle('questions:getAll', async () => quizzesHandler.getAllQuestions());
  ipcMain.handle('questions:add', async (_event, questionData) => quizzesHandler.addQuestion(questionData));
  ipcMain.handle('questions:update', async (_event, id, updates) => quizzesHandler.updateQuestion(id, updates));
  ipcMain.handle('questions:delete', async (_event, id) => quizzesHandler.deleteQuestion(id));
  ipcMain.handle('questions:getRound', async (_event, category, difficulty, count) => quizzesHandler.getQuestionsForRound(category, difficulty, count));

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', async () => {
  if (database) await database.close();
  if (process.platform !== 'darwin') app.quit();
});