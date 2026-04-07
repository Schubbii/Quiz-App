import fs from "fs/promises";

export default class QuizzesHandler {
  constructor(filePath = "./data/quizzes.json") {
    this.filePath = filePath;
  }

  async getData() {
    const data = await fs.readFile(this.filePath, "utf-8");
    return JSON.parse(data);
  }

  async setData(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async addQuestion(questionData) {
    const data = await this.getData();

    let id = 1;

    if (data.questions.length > 0) {
      const ids = data.questions.map((q) => q.id);
      id = Math.max(...ids) + 1;
    }

    const newQuestion = {
      id: id,
      question: questionData.question,
      answers: questionData.answers,
      correctAnswerIndex: questionData.correctAnswerIndex,
      category: questionData.category,
      difficulty: questionData.difficulty,
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
      (q) => q.category === category && q.difficulty === difficulty
    );

    const questionsForRound = [...filteredQuestions];

    for (let i = questionsForRound.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questionsForRound[i], questionsForRound[j]] = [questionsForRound[j], questionsForRound[i]];
    }

    return questionsForRound.slice(0, count);
  }

  async updateQuestion(id, updates) {
    const data = await this.getData();

    for (let i = 0; i < data.questions.length; i++) {
      if (data.questions[i].id === id) {
        data.questions[i] = { ...data.questions[i], ...updates };
        await this.setData(data);
        return data.questions[i];
      }
    }
  }

  async deleteQuestion(id) {
    const data = await this.getData();

    for (let i = 0; i < data.questions.length; i++) {
      if (data.questions[i].id === id) {
        const deletedQuestion = data.questions[i];
        data.questions.splice(i, 1);
        await this.setData(data);
        return deletedQuestion;
      }
    }
  }
}
