const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const quizBox = document.getElementById("quiz-box");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");

let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;

const quizQuestions = [
  {
    question: "Welche Sprache wird oft mit Electron verwendet?",
    answers: ["Python", "JavaScript", "C#", "PHP"],
    correct: "JavaScript"
  },
  {
    question: "Was ist Electron?",
    answers: ["Ein Framework für Desktop-Apps", "Ein Webserver", "Ein Datenbankmanagementsystem", "Ein Betriebssystem"],
    correct: "Ein Framework für Desktop-Apps"
  }
];

startBtn.addEventListener("click", () => {
  quizBox.classList.remove("hidden");
  nextBtn.classList.add("hidden");
  currentQuestionIndex = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  showQuestion();
});

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    showQuestion();
    nextBtn.classList.add("hidden");
  } else {
    questionEl.textContent = "Quiz beendet!";
    
    const total = correctAnswers + wrongAnswers;
    const percentage = Math.round((correctAnswers / total) * 100);

    answersEl.innerHTML = `
      <p>Richtig: ${correctAnswers}</p>
      <p>Falsch: ${wrongAnswers}</p>
      <p>Quote: ${percentage}%</p>
    `;
    nextBtn.classList.add("hidden");
  }
});

function showQuestion() {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  questionEl.textContent = currentQuestion.question;
  answersEl.innerHTML = "";

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.classList.add("answer-btn");

    button.addEventListener("click", () => {
      if (answer === currentQuestion.correct) {
        button.style.backgroundColor = "green";
        correctAnswers++; 
      } else {
        button.style.backgroundColor = "red";
        wrongAnswers++;
        const correctButton = Array.from(answersEl.children).find(btn => btn.textContent === currentQuestion.correct);
        if (correctButton) {
          correctButton.style.backgroundColor = "green";
        }
      }
      Array.from(answersEl.children).forEach(btn => btn.disabled = true);
      nextBtn.classList.remove("hidden");
    });

    answersEl.appendChild(button);
  });
}