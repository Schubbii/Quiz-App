const formMessage = document.getElementById('formMessage');
const addQuestionForm = document.getElementById('addQuestionForm');
const questionsTableBody = document.getElementById('questionsTableBody');
const questionCount = document.getElementById('questionCount');

const editModal = document.getElementById('editModal');
const closeModalButton = document.getElementById('closeModalButton');
const editQuestionForm = document.getElementById('editQuestionForm');
const deleteQuestionButton = document.getElementById('deleteQuestionButton');
const editMessage = document.getElementById('editMessage');
const backButton = document.getElementById('backButton');

let allQuestions = [];
let selectedQuestionId = null;

function setStatusMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle('error', isError);
}

function clearStatusMessage(element) {
  element.textContent = '';
  element.classList.remove('error');
}

function normalizeAnswers(rawOptions) {
  return rawOptions
    .split(';')
    .map((option) => option.trim())
    .filter(Boolean);
}

function toFormOptionsString(answers) {
  return answers.join('; ');
}

function renderQuestions(questions) {
  if (!Array.isArray(questions) || questions.length === 0) {
    questionsTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">Noch keine Fragen vorhanden.</td>
      </tr>
    `;
    questionCount.textContent = '0 Fragen';
    return;
  }

  questionsTableBody.innerHTML = questions
    .map(
      (question) => `
        <tr data-question-id="${question.id}">
          <td>${question.id}</td>
          <td>${escapeHtml(question.question)}</td>
          <td>${escapeHtml(question.category)}</td>
          <td>${escapeHtml(question.difficulty)}</td>
          <td>${question.answers.map(escapeHtml).join('; ')}</td>
        </tr>
      `
    )
    .join('');

  questionCount.textContent = `${questions.length} Fragen`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function loadQuestions() {
  clearStatusMessage(formMessage);

  try {
    const questions = await window.quizAPI.getQuestions();
    allQuestions = Array.isArray(questions) ? questions : [];
    renderQuestions(allQuestions);
  } catch (error) {
    console.error('Fehler beim Laden der Fragen:', error);
    setStatusMessage(formMessage, `Fragen konnten nicht geladen werden: ${error.message}`, true);
  }
}

function validateQuestionPayload({ question, answers, correctAnswerIndex, category, difficulty }) {
  if (!question) {
    throw new Error('Bitte einen Fragetext eingeben.');
  }

  if (!Array.isArray(answers) || answers.length < 2) {
    throw new Error('Bitte mindestens zwei Antwortmöglichkeiten eingeben.');
  }

  if (
    !Number.isInteger(correctAnswerIndex) ||
    correctAnswerIndex < 0 ||
    correctAnswerIndex >= answers.length
  ) {
    throw new Error('Die richtige Antwort ist ungültig.');
  }

  if (!category) {
    throw new Error('Bitte eine Kategorie eingeben.');
  }

  if (!difficulty) {
    throw new Error('Bitte eine Schwierigkeit auswählen.');
  }
}

function readAddFormPayload() {
  const question = document.getElementById('questionText').value.trim();
  const optionsRaw = document.getElementById('options').value.trim();
  const correctOptionRaw = document.getElementById('correctOption').value.trim();
  const category = document.getElementById('category').value.trim();
  const difficulty = document.getElementById('difficulty').value;

  const answers = normalizeAnswers(optionsRaw);
  const correctAnswerIndex = Number(correctOptionRaw) - 1;

  const payload = {
    question,
    answers,
    correctAnswerIndex,
    category,
    difficulty,
  };

  validateQuestionPayload(payload);
  return payload;
}

function readEditFormPayload() {
  const question = document.getElementById('editQuestionText').value.trim();
  const optionsRaw = document.getElementById('editOptions').value.trim();
  const correctOptionRaw = document.getElementById('editCorrectOption').value.trim();
  const category = document.getElementById('editCategory').value.trim();
  const difficulty = document.getElementById('editDifficulty').value;

  const answers = normalizeAnswers(optionsRaw);
  const correctAnswerIndex = Number(correctOptionRaw) - 1;

  const payload = {
    question,
    answers,
    correctAnswerIndex,
    category,
    difficulty,
  };

  validateQuestionPayload(payload);
  return payload;
}

function openEditModal(question) {
  selectedQuestionId = question.id;

  document.getElementById('editQuestionId').textContent = question.id;
  document.getElementById('editQuestionText').value = question.question;
  document.getElementById('editOptions').value = toFormOptionsString(question.answers);
  document.getElementById('editCorrectOption').value = String(question.correctAnswerIndex + 1);
  document.getElementById('editCategory').value = question.category;
  document.getElementById('editDifficulty').value = question.difficulty;

  clearStatusMessage(editMessage);
  editModal.classList.remove('hidden');
}

function closeEditModal() {
  selectedQuestionId = null;
  editModal.classList.add('hidden');
  clearStatusMessage(editMessage);
}

addQuestionForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearStatusMessage(formMessage);

  try {
    const payload = readAddFormPayload();
    await window.quizAPI.addQuestion(payload);

    setStatusMessage(formMessage, 'Frage erfolgreich hinzugefügt.');
    addQuestionForm.reset();
    await loadQuestions();
  } catch (error) {
    console.error('Fehler beim Hinzufügen:', error);
    setStatusMessage(formMessage, error.message || 'Fehler beim Hinzufügen der Frage.', true);
  }
});

questionsTableBody.addEventListener('click', (event) => {
  const row = event.target.closest('tr[data-question-id]');
  if (!row) return;

  const questionId = Number(row.dataset.questionId);
  const question = allQuestions.find((item) => item.id === questionId);

  if (!question) return;
  openEditModal(question);
});

editQuestionForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!selectedQuestionId) {
    setStatusMessage(editMessage, 'Keine Frage ausgewählt.', true);
    return;
  }

  clearStatusMessage(editMessage);

  try {
    const payload = readEditFormPayload();
    await window.quizAPI.updateQuestion(selectedQuestionId, payload);

    setStatusMessage(editMessage, 'Frage erfolgreich gespeichert.');
    await loadQuestions();
    closeEditModal();
  } catch (error) {
    console.error('Fehler beim Speichern:', error);
    setStatusMessage(editMessage, error.message || 'Fehler beim Speichern der Frage.', true);
  }
});

deleteQuestionButton.addEventListener('click', async () => {
  if (!selectedQuestionId) {
    setStatusMessage(editMessage, 'Keine Frage ausgewählt.', true);
    return;
  }

  const confirmed = window.confirm('Willst du diese Frage wirklich löschen?');
  if (!confirmed) return;

  clearStatusMessage(editMessage);

  try {
    await window.quizAPI.deleteQuestion(selectedQuestionId);
    closeEditModal();
    await loadQuestions();
    setStatusMessage(formMessage, 'Frage erfolgreich gelöscht.');
  } catch (error) {
    console.error('Fehler beim Löschen:', error);
    setStatusMessage(editMessage, error.message || 'Fehler beim Löschen der Frage.', true);
  }
});

backButton.addEventListener('click', () => {
  window.location.href = '../menu.html';
});
closeModalButton.addEventListener('click', closeEditModal);

editModal.addEventListener('click', (event) => {
  if (event.target?.dataset?.closeModal === 'true') {
    closeEditModal();
  }
});

if (backButton) {
  backButton.addEventListener('click', () => {
    window.history.back();
  });
}

loadQuestions();