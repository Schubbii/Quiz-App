class QuizzesHandler {
  constructor(database) {
    this.database = database;
  }

  normalizeQuestion(questionData) {
    return {
      question: String(questionData.question || '').trim(),
      answers: Array.isArray(questionData.answers)
        ? questionData.answers.map((answer) => String(answer).trim()).filter(Boolean)
        : [],
      correctAnswerIndex: Number(questionData.correctAnswerIndex),
      category: String(questionData.category || '').trim(),
      difficulty: String(questionData.difficulty || '').trim(),
    };
  }

  validateQuestion(questionData) {
    if (!questionData.question) throw new Error('Fragetext fehlt.');
    if (!Array.isArray(questionData.answers) || questionData.answers.length < 2) {
      throw new Error('Mindestens zwei Antwortmöglichkeiten sind erforderlich.');
    }
    if (!Number.isInteger(questionData.correctAnswerIndex) || questionData.correctAnswerIndex < 0 || questionData.correctAnswerIndex >= questionData.answers.length) {
      throw new Error('Der Index der richtigen Antwort ist ungültig.');
    }
    if (!questionData.category) throw new Error('Kategorie fehlt.');
    if (!questionData.difficulty) throw new Error('Schwierigkeit fehlt.');
  }

  async mapQuestionRows(rows) {
    const questions = [];
    for (const row of rows) {
      const answers = await this.database.all(
        `SELECT answer_text, is_correct, order_index FROM answers WHERE question_id = ? ORDER BY order_index ASC`,
        [row.id]
      );
      questions.push({
        id: row.id,
        question: row.question,
        answers: answers.map((answer) => answer.answer_text),
        correctAnswerIndex: answers.findIndex((answer) => Number(answer.is_correct) === 1),
        category: row.category,
        difficulty: row.difficulty,
      });
    }
    return questions;
  }

  async getAllQuestions() {
    const rows = await this.database.all(`SELECT id, question, category, difficulty FROM questions ORDER BY id ASC`);
    return this.mapQuestionRows(rows);
  }

  async getQuestionsForRound(category, difficulty, count) {
    const params = [];
    const conditions = [];
    if (category && category !== 'all') {
      conditions.push('category = ?');
      params.push(category);
    }
    if (difficulty && difficulty !== 'all') {
      conditions.push('difficulty = ?');
      params.push(difficulty);
    }
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = Number(count) > 0 ? Number(count) : 10;
    const rows = await this.database.all(
      `SELECT id, question, category, difficulty FROM questions ${whereClause} ORDER BY RANDOM() LIMIT ?`,
      [...params, limit]
    );
    return this.mapQuestionRows(rows);
  }

  async addQuestion(questionData) {
    const normalizedQuestion = this.normalizeQuestion(questionData);
    this.validateQuestion(normalizedQuestion);
    const questionResult = await this.database.run(
      `INSERT INTO questions (question, category, difficulty) VALUES (?, ?, ?)`,
      [normalizedQuestion.question, normalizedQuestion.category, normalizedQuestion.difficulty]
    );
    const questionId = questionResult.lastID;
    for (let index = 0; index < normalizedQuestion.answers.length; index += 1) {
      await this.database.run(
        `INSERT INTO answers (question_id, answer_text, is_correct, order_index) VALUES (?, ?, ?, ?)`,
        [questionId, normalizedQuestion.answers[index], index === normalizedQuestion.correctAnswerIndex ? 1 : 0, index]
      );
    }
    return { id: questionId, ...normalizedQuestion };
  }

  async updateQuestion(id, updates) {
    const numericId = Number(id);
    const existingQuestion = await this.database.get(
      `SELECT id, question, category, difficulty FROM questions WHERE id = ?`,
      [numericId]
    );
    if (!existingQuestion) throw new Error(`Frage mit ID ${id} wurde nicht gefunden.`);
    const existingAnswers = await this.database.all(
      `SELECT answer_text, is_correct, order_index FROM answers WHERE question_id = ? ORDER BY order_index ASC`,
      [numericId]
    );
    const mergedQuestion = this.normalizeQuestion({
      question: existingQuestion.question,
      answers: existingAnswers.map((answer) => answer.answer_text),
      correctAnswerIndex: existingAnswers.findIndex((answer) => Number(answer.is_correct) === 1),
      category: existingQuestion.category,
      difficulty: existingQuestion.difficulty,
      ...updates,
    });
    this.validateQuestion(mergedQuestion);
    await this.database.run(`UPDATE questions SET question = ?, category = ?, difficulty = ? WHERE id = ?`, [mergedQuestion.question, mergedQuestion.category, mergedQuestion.difficulty, numericId]);
    await this.database.run('DELETE FROM answers WHERE question_id = ?', [numericId]);
    for (let index = 0; index < mergedQuestion.answers.length; index += 1) {
      await this.database.run(
        `INSERT INTO answers (question_id, answer_text, is_correct, order_index) VALUES (?, ?, ?, ?)`,
        [numericId, mergedQuestion.answers[index], index === mergedQuestion.correctAnswerIndex ? 1 : 0, index]
      );
    }
    return { id: numericId, ...mergedQuestion };
  }

  async deleteQuestion(id) {
    const numericId = Number(id);
    const existingQuestions = await this.mapQuestionRows(
      await this.database.all(`SELECT id, question, category, difficulty FROM questions WHERE id = ?`, [numericId])
    );
    if (existingQuestions.length === 0) throw new Error(`Frage mit ID ${id} wurde nicht gefunden.`);
    await this.database.run('DELETE FROM questions WHERE id = ?', [numericId]);
    return existingQuestions[0];
  }
}

module.exports = QuizzesHandler;