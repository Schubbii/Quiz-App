const startAnimation = document.getElementById("Startanimation");
const logoAnimation = document.getElementById("Logoanimation");
const hauptmenue = document.getElementById("Hauptmenue");

const playButton = document.querySelector(".playBtn");
const menuBtn = document.getElementById("menu-btn");

const questionFrame = document.getElementById("question2");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const fragenText = document.querySelector(".FragenText");

const restartBtn = document.getElementById("restart-btn");

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
    answers: [
      "Ein Framework für Desktop-Apps",
      "Ein Webserver",
      "Ein Datenbankmanagementsystem",
      "Ein Betriebssystem"
    ],
    correct: "Ein Framework für Desktop-Apps"
  }
];


//fragen werden angezeigt
function showQuestion() {
  if (!questionFrame || !answersEl || currentQuestionIndex >= quizQuestions.length) return;

  const currentQuestion = quizQuestions[currentQuestionIndex];
  questionFrame.textContent = currentQuestion.question;
  answersEl.innerHTML = "";

  if (fragenText) {
    fragenText.textContent = `Frage ${currentQuestionIndex + 1} von ${quizQuestions.length}`;
  }

  if (nextBtn) {
    nextBtn.classList.add("hidden");
  }

  //für jede Antwortmöglichkeit wird ein button erstellt
  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.classList.add("buttonAnswers");

    button.addEventListener("click", () => {
      const allButtons = Array.from(answersEl.children);

      if (answer === currentQuestion.correct) {
        button.classList.add("correct");
        correctAnswers++;
      } else {
        button.classList.add("wrong");
        wrongAnswers++;

        const correctButton = allButtons.find(
          btn => btn.textContent === currentQuestion.correct
        );

        if (correctButton) {
          correctButton.classList.add("correct");
        }
      }
// Alle Buttons werden deaktiviert
      allButtons.forEach(btn => {
        btn.disabled = true;
      });

      if (nextBtn) {
        nextBtn.classList.remove("hidden");
      }
    });

    answersEl.appendChild(button);
  });
}

// MENU.HTML
// Überprüft, ob Animation bereits abgespielt wurde
if (window.location.pathname.includes("menu.html")) {
  const animationPlayed = sessionStorage.getItem("animationPlayed");

  if (animationPlayed === "true") {
    if (startAnimation) {
      startAnimation.style.display = "none";
    }
    if (hauptmenue) {
      hauptmenue.classList.remove("hidden");
    }
  } else {
    if (logoAnimation && startAnimation && hauptmenue) {
      logoAnimation.addEventListener("ended", () => {
        startAnimation.style.display = "none";
        hauptmenue.classList.remove("hidden");
        sessionStorage.setItem("animationPlayed", "true");
      });
    }
  }
}

// FRAGEN.HTML 
// Startet Quiz
if (playButton) {
  playButton.addEventListener("click", () => {
    window.location.href = "./fragen.html";
  });
}

// Nächste Frage oder Quiz beenden
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
      nextBtn.classList.add("hidden");
    }
   else {
      const total = correctAnswers + wrongAnswers;
      const percentage = Math.round((correctAnswers / total) * 100);

      localStorage.setItem("c", correctAnswers);
      localStorage.setItem("w", wrongAnswers);
      localStorage.setItem("p", percentage);

  window.location.href = "./scoreboard.html";
    } 
  });
}

// Zurück zum Menü
if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    window.location.href = "./menu.html";
  });
}
// Überprüft, ob aktuelle Fragen-Seite sind und zeigt die erste Frage an
if (window.location.pathname.includes("fragen.html")) {
  currentQuestionIndex = 0;
  correctAnswers = 0;
  wrongAnswers = 0;

  if (nextBtn) {
    nextBtn.classList.add("hidden");
  }

  showQuestion();
}

// SCOREBOARD.HTML
if (window.location.pathname.includes("scoreboard.html")) {
  document.getElementById("score-correct").textContent =
    localStorage.getItem("c");

  document.getElementById("score-wrong").textContent =
    localStorage.getItem("w");

  document.getElementById("score-percentage").textContent =
    localStorage.getItem("p") + "%";
}

if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    window.location.href = "./fragen.html";
  });
}