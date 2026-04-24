const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const seedQuestions = require('./seedQuestions');

class Database {
  constructor(dbFilePath) {
    this.dbFilePath = dbFilePath;
    this.db = null;
  }

  async init() {
    const dbDirectory = path.dirname(this.dbFilePath);
    fs.mkdirSync(dbDirectory, { recursive: true });

    this.db = await new Promise((resolve, reject) => {
      const instance = new sqlite3.Database(this.dbFilePath, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(instance);
      });
    });

    await this.run('PRAGMA foreign_keys = ON');
    await this.createTables();
    await this.seedIfEmpty();
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function onRun(error) {
        if (error) {
          reject(error);
          return;
        }

        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (error, row) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(row);
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (error, rows) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(rows);
      });
    });
  }

  async createTables() {
    await this.run(`
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        category TEXT NOT NULL,
        difficulty TEXT NOT NULL
      )
    `);

    await this.run(`
      CREATE TABLE IF NOT EXISTS answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_id INTEGER NOT NULL,
        answer_text TEXT NOT NULL,
        is_correct INTEGER NOT NULL DEFAULT 0,
        order_index INTEGER NOT NULL,
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
      )
    `);
  }

  async seedIfEmpty() {
    const row = await this.get('SELECT COUNT(*) AS count FROM questions');
    if ((row?.count || 0) > 0) return;

    for (const question of seedQuestions) {
      const questionResult = await this.run(
        `INSERT INTO questions (id, question, category, difficulty) VALUES (?, ?, ?, ?)`,
        [Number(question.id), String(question.question).trim(), String(question.category).trim(), String(question.difficulty).trim()]
      );
      const questionId = questionResult.lastID || Number(question.id);
      for (let index = 0; index < question.answers.length; index += 1) {
        await this.run(
          `INSERT INTO answers (question_id, answer_text, is_correct, order_index) VALUES (?, ?, ?, ?)`,
          [questionId, String(question.answers[index]).trim(), index === question.correctAnswerIndex ? 1 : 0, index]
        );
      }
    }
  }

  async close() {
    if (!this.db) return;
    await new Promise((resolve, reject) => {
      this.db.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
}

module.exports = Database;
