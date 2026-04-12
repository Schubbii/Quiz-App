const addQuestionForm = document.getElementById('addQuestionForm');
const editQuestionForm = document.getElementById('editQuestionForm');
const formMessage = document.getElementById('formMessage');
const editMessage = document.getElementById('editMessage');
const questionsTableBody = document.getElementById('questionsTableBody');
const questionCount = document.getElementById('questionCount');
const editModal = document.getElementById('editModal');
const editQuestionId = document.getElementById('editQuestionId');
const deleteQuestionButton = document.getElementById('deleteQuestionButton');
const backButton = document.getElementById('backButton');
const closeModalButton = document.getElementById('closeModalButton');

let questions = [];
let selectedQuestionId = null;

function setMessage(element, message, isError = false) {
    element.textContent = message;
    element.classList.toggle('error', isError);
}

function parseQuestionForm(values) {
    const answers = values.options
        .split(',')
        .map((option) => option.trim())
        .filter(Boolean);

    const correctAnswerIndex = Number.parseInt(values.correctOption, 10) - 1;

    if (!values.questionText.trim()) {
        throw new Error('Bitte einen Fragetext eingeben.');
    }

    if (!values.category.trim()) {
        throw new Error('Bitte eine Kategorie eingeben.');
    }

    if (answers.length < 2) {
        throw new Error('Bitte mindestens zwei Antwortmöglichkeiten eingeben.');
    }

    if (
        Number.isNaN(correctAnswerIndex) ||
        correctAnswerIndex < 0 ||
        correctAnswerIndex >= answers.length
    ) {
        throw new Error('Die Nummer der richtigen Antwort ist ungültig.');
    }

    return {
        question: values.questionText.trim(),
        answers,
        correctAnswerIndex,
        category: values.category.trim(),
        difficulty: values.difficulty,
    };
}

function getAnswerPreview(question) {
    return question.answers
        .map((answer, index) => `${index + 1}. ${answer}${index === question.correctAnswerIndex ? ' ✓' : ''}`)
        .join(' | ');
}

function openEditModal(question) {
    selectedQuestionId = question.id;
    editQuestionId.textContent = question.id;
    document.getElementById('editQuestionText').value = question.question;
    document.getElementById('editOptions').value = question.answers.join(', ');
    document.getElementById('editCorrectOption').value = String(question.correctAnswerIndex + 1);
    document.getElementById('editCategory').value = question.category;
    document.getElementById('editDifficulty').value = question.difficulty;
    setMessage(editMessage, '');
    editModal.classList.remove('hidden');
}

function closeEditModal() {
    selectedQuestionId = null;
    editModal.classList.add('hidden');
}

function renderQuestions() {
    questionCount.textContent = `${questions.length} ${questions.length === 1 ? 'Frage' : 'Fragen'}`;

    if (questions.length === 0) {
        questionsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">Noch keine Fragen vorhanden.</td>
            </tr>
        `;
        return;
    }

    questionsTableBody.innerHTML = '';

    questions.forEach((question) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${question.id}</td>
            <td>${question.question}</td>
            <td>${question.category}</td>
            <td>${question.difficulty}</td>
            <td>${getAnswerPreview(question)}</td>
        `;

        row.addEventListener('click', () => openEditModal(question));
        questionsTableBody.appendChild(row);
    });
}

async function loadQuestions() {
    try {
        questions = await window.quizAPI.getQuestions();
        renderQuestions();
    } catch (error) {
        console.error(error);
        setMessage(formMessage, `Fehler beim Laden der Fragen: ${error.message}`, true);
    }
}

addQuestionForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        const questionData = parseQuestionForm({
            questionText: document.getElementById('questionText').value,
            options: document.getElementById('options').value,
            correctOption: document.getElementById('correctOption').value,
            category: document.getElementById('category').value,
            difficulty: document.getElementById('difficulty').value,
        });

        await window.quizAPI.addQuestion(questionData);
        addQuestionForm.reset();
        document.getElementById('difficulty').value = 'leicht';
        setMessage(formMessage, 'Frage wurde gespeichert.');
        await loadQuestions();
    } catch (error) {
        console.error(error);
        setMessage(formMessage, error.message, true);
    }
});

editQuestionForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (selectedQuestionId === null) {
        return;
    }

    try {
        const questionData = parseQuestionForm({
            questionText: document.getElementById('editQuestionText').value,
            options: document.getElementById('editOptions').value,
            correctOption: document.getElementById('editCorrectOption').value,
            category: document.getElementById('editCategory').value,
            difficulty: document.getElementById('editDifficulty').value,
        });

        await window.quizAPI.updateQuestion(selectedQuestionId, questionData);
        setMessage(editMessage, 'Frage wurde aktualisiert.');
        await loadQuestions();
        closeEditModal();
    } catch (error) {
        console.error(error);
        setMessage(editMessage, error.message, true);
    }
});

deleteQuestionButton.addEventListener('click', async () => {
    if (selectedQuestionId === null) {
        return;
    }

    const confirmed = window.confirm('Möchtest du diese Frage wirklich löschen?');
    if (!confirmed) {
        return;
    }

    try {
        await window.quizAPI.deleteQuestion(selectedQuestionId);
        closeEditModal();
        setMessage(formMessage, 'Frage wurde gelöscht.');
        await loadQuestions();
    } catch (error) {
        console.error(error);
        setMessage(editMessage, error.message, true);
    }
});

backButton.addEventListener('click', () => {
    window.location.href = '../index.html';
});

closeModalButton.addEventListener('click', closeEditModal);
editModal.addEventListener('click', (event) => {
    if (event.target.dataset.closeModal === 'true') {
        closeEditModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !editModal.classList.contains('hidden')) {
        closeEditModal();
    }
});

loadQuestions();