const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('quizAPI', {
  getQuestions: () => ipcRenderer.invoke('questions:getAll'),
  addQuestion: (questionData) => ipcRenderer.invoke('questions:add', questionData),
  updateQuestion: (id, updates) => ipcRenderer.invoke('questions:update', id, updates),
  deleteQuestion: (id) => ipcRenderer.invoke('questions:delete', id),
});