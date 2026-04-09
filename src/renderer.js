const startBtn = document.getElementById("start-btn");
const quizBox = document.getElementById("quiz-box");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");

const quizQuestions = [
  {
    question: "Welche Sprache wird oft mit Electron verwendet?",
    answers: ["Python", "JavaScript", "C#", "PHP"],
    correct: "JavaScript"
  }
];

startBtn.addEventListener("click", () => {
  quizBox.classList.remove("hidden");
  showQuestion();
});

function showQuestion() {
  const currentQuestion = quizQuestions[0];
  questionEl.textContent = currentQuestion.question;
  answersEl.innerHTML = "";

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.classList.add("answer-btn");

    button.addEventListener("click", () => {
      if (answer === currentQuestion.correct) {
        button.style.backgroundColor = "green";
      } else {
        button.style.backgroundColor = "red";
      }
    });

    answersEl.appendChild(button);
  });
}