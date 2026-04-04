const { contextBridge } = require('electron');
const questions = require('./data/quizzes.json');

contextBridge.exposeInMainWorld('quizAPI', {
  getQuestions: () => questions
});