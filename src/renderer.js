const startAnimation = document.getElementById("Startanimation");
const logoAnimation = document.getElementById("Logoanimation");
const hauptmenue = document.getElementById("Hauptmenue");

const startBtn = document.getElementById("start-btn");
// const nextBtn = document.getElementById("next-btn");
const quizBox = document.getElementById("quiz-box");
const questionEl = document.getElementById("question");
// const answersEl = document.getElementById("answers");

const playButton = document.querySelector(".playBtn");
const hauptMenu = document.getElementById("menu");

const questionFrame = document.getElementById("question2");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const fragenText = document.querySelector(".FragenText");

let currentQuestionIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("fragen.html")) {
    showQuestion();
  }
});

logoAnimation.addEventListener("ended", () => {
  startAnimation.style.display = "none";
  hauptmenue.classList.remove("hidden");
});


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

if (playButton) {
  playButton.addEventListener("click", () => {
    console.log("Play button clicked");
    window.location.href = "fragen.html";
    console.log("Start button clicked");
    showQuestion();
  });
}

// if (startBtn) {
//   startBtn.addEventListener("click", () => {
//     console.log("Start button clicked");
//     quizBox.classList.remove("hidden");
//     showQuestion();
//   });
// }


nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    showQuestion();
    nextBtn.classList.add("hidden");
  } else {
    questionFrame.textContent = "Quiz beendet!";
    answersEl.innerHTML = "";
    nextBtn.classList.add("hidden");
  }
});

function showQuestion() {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  questionFrame.textContent = currentQuestion.question;
  answersEl.innerHTML = ""; // Clear previous answers

  if (fragenText) {
    fragenText.textContent = `Frage ${currentQuestionIndex + 1} von ${quizQuestions.length}`;
  }

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.classList.add("buttonAnswers");

    button.addEventListener("click", () => {
      if (answer === currentQuestion.correct) {
        button.style.backgroundColor = "green";
      } else {
        button.style.backgroundColor = "red";
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