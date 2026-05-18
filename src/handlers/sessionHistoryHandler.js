const fs = require('fs').promises;
const path = require('path');

class SessionHistoryHandler {
  constructor(filePath) {
    this.sessionHistory = [];
    this.filePath = filePath || path.join(__dirname, 'sessionHistory.json');
    this.initialized = false;
  }

  async init() {
    this.sessionHistory = await this.loadSessionHistory();
    this.initialized = true;
  }

  async ensureDirectoryExists() {
    const directory = path.dirname(this.filePath);
    await fs.mkdir(directory, { recursive: true });
  }

  async loadSessionHistory() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(data);
      console.log('[SessionHistoryHandler] loaded sessionHistory from', this.filePath, 'entries=', (parsed.sessionHistory || []).length);
      return parsed.sessionHistory || [];
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Fehler beim Laden der Session-Historie:', error);
      }
      return [];
    }
  }

  async saveSessionQuestions(questionIds) {
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      console.warn('Keine gültigen Fragen-IDs');
      return;
    }

    const newSession = {
      timestamp: Date.now(),
      questionIds,
    };

    this.sessionHistory.push(newSession);
    this.cleanupOldSessions();

    try {
      await this.ensureDirectoryExists();
      await fs.writeFile(this.filePath, JSON.stringify({ sessionHistory: this.sessionHistory }, null, 2), 'utf-8');
      console.log('[SessionHistoryHandler] saved sessionHistory to', this.filePath, 'entries=', this.sessionHistory.length);
    } catch (error) {
      console.error('Fehler beim Speichern der Session-Historie:', error);
    }
  }

  getBlockedQuestionIds() {
    const recentSessions = this.sessionHistory.slice(-2);
    const blockedIds = new Set();
    recentSessions.forEach(session => {
      if (!Array.isArray(session.questionIds)) return;
      session.questionIds.forEach((id) => {
        const num = Number(id);
        if (Number.isFinite(num)) blockedIds.add(num);
      });
    });
    const result = Array.from(blockedIds);
    console.log('[SessionHistoryHandler] getBlockedQuestionIds ->', result);
    return result;
  }

  cleanupOldSessions() {
    if (this.sessionHistory.length > 2) {
      this.sessionHistory = this.sessionHistory.slice(-2);
    }
  }
}

module.exports = SessionHistoryHandler;