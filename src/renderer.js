const questions = window.quizAPI.getQuestions();

let currentQuestionIndex = 0;
let score = 0;
let answered = false;

const progressEl = document.getElementById('progress');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

function renderQuestion() {
  answered = false;
  nextBtn.disabled = true;
  feedbackEl.textContent = '';

  const current = questions[currentQuestionIndex];
  progressEl.textContent = `Frage ${currentQuestionIndex + 1} von ${questions.length}`;
  questionEl.textContent = current.frage;
  answersEl.innerHTML = '';

  current.optionen.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.addEventListener('click', () => handleAnswer(index, button));
    answersEl.appendChild(button);
  });

  scoreEl.textContent = `Punkte: ${score}`;
}

function handleAnswer(selectedIndex, selectedButton) {
  if (answered) return;
  answered = true;

  const current = questions[currentQuestionIndex];
  const buttons = answersEl.querySelectorAll('button');

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === current.richtig) {
      button.classList.add('correct');
    }
  });

  if (selectedIndex === current.richtig) {
    score++;
    feedbackEl.textContent = 'Richtig!';
  } else {
    selectedButton.classList.add('wrong');
    feedbackEl.textContent = 'Leider falsch.';
  }

  scoreEl.textContent = `Punkte: ${score}`;
  nextBtn.disabled = false;
}

function showEndScreen() {
  progressEl.textContent = 'Quiz beendet';
  questionEl.textContent = `Du hast ${score} von ${questions.length} Punkten erreicht.`;
  answersEl.innerHTML = '';
  feedbackEl.textContent = '';
  nextBtn.classList.add('hidden');
  restartBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    renderQuestion();
  } else {
    showEndScreen();
  }
});

restartBtn.addEventListener('click', () => {
  currentQuestionIndex = 0;
  score = 0;
  nextBtn.classList.remove('hidden');
  restartBtn.classList.add('hidden');
  renderQuestion();
});

renderQuestion();