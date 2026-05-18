const { contextBridge, ipcRenderer } = require('electron');

const API_BASE_URL = "https://quiz-api-server-production-bdfd.up.railway.app";
const ADMIN_TOKEN = 'Schubbii';

// --Vincent Rothweiler--
const allowedSounds = new Set([
  "buttonHover",
  "buttonClick",
  "buttonRelease",
]);

const allowedMusic = new Set([
  "lobbyBackground",
]);

// --Silas Ciupke--
async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Unbekannter Serverfehler');
  }

  return data;
}

contextBridge.exposeInMainWorld('quizAPI', {
  getQuestions: () => apiRequest('/questions'),
  getQuestionsForRound: (category, difficulty, count) => {
    const query = new URLSearchParams({
      category: category || 'all',
      difficulty: difficulty || 'all',
      count: String(count || 10),
    });
    return apiRequest(`/questions/round?${query.toString()}`);
  },
  addQuestion: (questionData) =>
    apiRequest('/questions', {
      method: 'POST',
      headers: {
        'x-admin-token': ADMIN_TOKEN,
      },
      body: JSON.stringify(questionData),
    }),
  updateQuestion: (id, updates) =>
    apiRequest(`/questions/${id}`, {
      method: 'PUT',
      headers: {
        'x-admin-token': ADMIN_TOKEN,
      },
      body: JSON.stringify(updates),
    }),
  deleteQuestion: (id) =>
    apiRequest(`/questions/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-token': ADMIN_TOKEN,
      },
    }),
});

// -- Vincent Rothweiler--
contextBridge.exposeInMainWorld('mediawikiAPI', {
  getLinks: () => ipcRenderer.invoke('mediawiki:getLinks'),
});

// --Vincent Rothweiler--
contextBridge.exposeInMainWorld("audio", {
  playSound(soundName) {
    if (!allowedSounds.has(soundName)) return;
    ipcRenderer.send("sound:play", soundName);
  },

  playMusic(musicName) {
    if (!allowedMusic.has(musicName)) return;
    ipcRenderer.send("music:play", musicName);
  },

  stopMusic(musicName) {
    if (!allowedMusic.has(musicName)) return;
    ipcRenderer.send("music:stop", musicName);
  },

  pauseMusic(musicName) {
    if (!allowedMusic.has(musicName)) return;
    ipcRenderer.send("music:pause", musicName);
  },

  setSfxMuted(isMuted) {
    if (typeof isMuted !== "boolean") return;
    ipcRenderer.send("sfx:set-muted", isMuted);
  },
  
});
