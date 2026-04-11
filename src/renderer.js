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

let currentQuestionIndex = 0;

function initMenuPage() {
  const startAnimation = document.getElementById("Startanimation");
  const logoAnimation = document.getElementById("Logoanimation");
  const menu = document.getElementById("Hauptmenue");
  const playButton = document.querySelector(".playBtn");

  if (logoAnimation && startAnimation && menu) {
    logoAnimation.addEventListener("ended", () => {
      startAnimation.classList.add("hidden");
      menu.classList.remove("hidden");
    });
  }

  if (playButton) {
    playButton.addEventListener("click", () => {
      window.location.href = "fragen.html";
    });
  }
}

function initQuestionPage() {
  const questionFrame = document.getElementById("question2");
  const answersEl = document.getElementById("answers");
  const nextBtn = document.getElementById("next-btn");
  const fragenText = document.querySelector(".FragenText");
  const resultText = document.getElementById("result-text");

  if (!questionFrame || !answersEl || !nextBtn) {
    return;
  }

  function showQuestion() {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    questionFrame.textContent = currentQuestion.question;
    answersEl.innerHTML = "";

    if (fragenText) {
      fragenText.textContent = `Frage ${currentQuestionIndex + 1} von ${quizQuestions.length}`;
    }

    if (resultText) {
      resultText.textContent = "";
    }

    currentQuestion.answers.forEach((answer) => {
      const button = document.createElement("button");
      button.textContent = answer;
      button.classList.add("buttonAnswers");

      button.addEventListener("click", () => {
        const isCorrect = answer === currentQuestion.correct;

        if (isCorrect) {
          button.classList.add("correct");
          if (resultText) {
            resultText.textContent = "Richtig ✅";
            resultText.className = "resultText correctText";
          }
        } else {
          button.classList.add("wrong");
          if (resultText) {
            resultText.textContent = "Falsch ❌";
            resultText.className = "resultText wrongText";
          }

          const correctButton = Array.from(answersEl.children).find(
            (btn) => btn.textContent === currentQuestion.correct
          );
          if (correctButton) {
            correctButton.classList.add("correct");
          }
        }

        Array.from(answersEl.children).forEach((btn) => {
          btn.disabled = true;
        });

        nextBtn.classList.remove("hidden");
      });

      answersEl.appendChild(button);
    });
  }

  nextBtn.addEventListener("click", () => {
    currentQuestionIndex += 1;

    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
      nextBtn.classList.add("hidden");
      return;
    }

    questionFrame.textContent = "Quiz beendet!";
    answersEl.innerHTML = "";
    nextBtn.classList.add("hidden");

    if (resultText) {
      resultText.textContent = "Super gespielt!";
      resultText.className = "resultText";
    }
  });

  showQuestion();
}

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("menu.html")) {
    initMenuPage();
  }

  if (path.includes("fragen.html")) {
    initQuestionPage();
  }
});
