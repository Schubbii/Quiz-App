const fs = require('fs/promises');

class QuizzesHandler {
  constructor(filePath = './data/quizzes.json') {
    this.filePath = filePath;
  }

  async getData() {
    const rawData = await fs.readFile(this.filePath, 'utf-8');
    const parsedData = JSON.parse(rawData);

    if (!Array.isArray(parsedData.questions)) {
      parsedData.questions = Array.isArray(parsedData.qestions)
        ? parsedData.qestions.map((question) => ({
            id: Number(question.id),
            question: String(question.question || '').trim(),
            answers: Array.isArray(question.answers) ? question.answers : [],
            correctAnswerIndex: Number.isInteger(question.correctAnswerIndex)
              ? question.correctAnswerIndex
              : Number(question.rightAnswer ?? 0),
            category: String(question.category || '').trim(),
            difficulty: String(question.difficulty || '').trim(),
          }))
        : [];
    }

    return parsedData;
  }

  async setData(data) {
    const normalized = {
      questions: Array.isArray(data.questions) ? data.questions : [],
    };

    await fs.writeFile(this.filePath, JSON.stringify(normalized, null, 2), 'utf-8');
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
    if (!questionData.question) {
      throw new Error('Fragetext fehlt.');
    }

    if (!Array.isArray(questionData.answers) || questionData.answers.length < 2) {
      throw new Error('Mindestens zwei Antwortmöglichkeiten sind erforderlich.');
    }

    if (
      !Number.isInteger(questionData.correctAnswerIndex) ||
      questionData.correctAnswerIndex < 0 ||
      questionData.correctAnswerIndex >= questionData.answers.length
    ) {
      throw new Error('Der Index der richtigen Antwort ist ungültig.');
    }

    if (!questionData.category) {
      throw new Error('Kategorie fehlt.');
    }

    if (!questionData.difficulty) {
      throw new Error('Schwierigkeit fehlt.');
    }
  }

  async addQuestion(questionData) {
    const data = await this.getData();
    const normalizedQuestion = this.normalizeQuestion(questionData);
    this.validateQuestion(normalizedQuestion);

    const ids = data.questions.map((question) => Number(question.id) || 0);
    const id = ids.length > 0 ? Math.max(...ids) + 1 : 1;

    const newQuestion = {
      id,
      ...normalizedQuestion,
    };

    data.questions.push(newQuestion);
    await this.setData(data);

    return newQuestion;
  }

  async getAllQuestions() {
    const data = await this.getData();
    return data.questions;
  }

  async getQuestionsForRound(category, difficulty, count) {
    const data = await this.getData();

    const filteredQuestions = data.questions.filter(
      (question) => question.category === category && question.difficulty === difficulty
    );

    const questionsForRound = [...filteredQuestions];

    for (let i = questionsForRound.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [questionsForRound[i], questionsForRound[j]] = [questionsForRound[j], questionsForRound[i]];
    }

    return questionsForRound.slice(0, count);
  }

  async updateQuestion(id, updates) {
    const data = await this.getData();
    const numericId = Number(id);
    const questionIndex = data.questions.findIndex((question) => Number(question.id) === numericId);

    if (questionIndex === -1) {
      throw new Error(`Frage mit ID ${id} wurde nicht gefunden.`);
    }

    const updatedQuestion = {
      ...data.questions[questionIndex],
      ...this.normalizeQuestion({
        ...data.questions[questionIndex],
        ...updates,
      }),
      id: data.questions[questionIndex].id,
    };

    this.validateQuestion(updatedQuestion);

    data.questions[questionIndex] = updatedQuestion;
    await this.setData(data);

    return updatedQuestion;
  }

  async deleteQuestion(id) {
    const data = await this.getData();
    const numericId = Number(id);
    const questionIndex = data.questions.findIndex((question) => Number(question.id) === numericId);

    if (questionIndex === -1) {
      throw new Error(`Frage mit ID ${id} wurde nicht gefunden.`);
    }

    const [deletedQuestion] = data.questions.splice(questionIndex, 1);
    await this.setData(data);

    return deletedQuestion;
  }
}

module.exports = QuizzesHandler;