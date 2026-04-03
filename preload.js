const { contextBridge } = require('electron');
const questions = require('./data/questions.json');

contextBridge.exposeInMainWorld('quizAPI', {
  getQuestions: () => questions
});