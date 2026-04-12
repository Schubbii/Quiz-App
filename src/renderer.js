const startAnimation = document.getElementById("Startanimation");
const logoAnimation = document.getElementById("Logoanimation");
const hauptmenue = document.getElementById("Hauptmenue");

const adminBtn = document.getElementById("admin-btn");
const playButton = document.querySelector(".playBtn");
const menuBtn = document.getElementById("menu-btn");

const questionFrame = document.getElementById("question2");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const fragenText = document.querySelector(".FragenText");


// fragen von quizzes.json laden
let currentQuestionIndex = 0;
let quizQuestions = [];

async function loadQuestions() {
  try {
    quizQuestions = await window.quizAPI.getQuestions();

    console.log("Geladene Fragen:", quizQuestions);

    if (!Array.isArray(quizQuestions) || quizQuestions.length === 0) {
      if (questionFrame) {
        questionFrame.textContent = "Keine Fragen gefunden.";
      }
      return;
    }

    showQuestion();
  } catch (error) {
    console.error("Fehler beim Laden der Fragen:", error);
    if (questionFrame) {
      questionFrame.textContent = "Fragen konnten nicht geladen werden.";
    }
  }
}
//   {
//     question: "Welche Sprache wird oft mit Electron verwendet?",
//     answers: ["Python", "JavaScript", "C#", "PHP"],
//     correct: "JavaScript"
//   },
//   {
//     question: "Was ist Electron?",
//     answers: [
//       "Ein Framework für Desktop-Apps",
//       "Ein Webserver",
//       "Ein Datenbankmanagementsystem",
//       "Ein Betriebssystem"
//     ],
//     correct: "Ein Framework für Desktop-Apps"
//   }
// ];


//fragen werden angezeigt
function showQuestion() {
  if (!questionFrame || !answersEl || currentQuestionIndex >= quizQuestions.length) return;

  const currentQuestion = quizQuestions[currentQuestionIndex];
  answersEl.innerHTML = "";
  questionFrame.textContent = currentQuestion.question;

  if (fragenText) {
    fragenText.textContent = `Frage ${currentQuestionIndex + 1} von ${quizQuestions.length}`;
  }

  if (nextBtn) {
    nextBtn.classList.add("hidden");
  }

  currentQuestion.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.classList.add("buttonAnswers");

    button.addEventListener("click", () => {
      const allButtons = Array.from(answersEl.children);
      const correctIndex = currentQuestion.correctAnswerIndex;

      if (index === correctIndex) {
        button.classList.add("correct");
      } else {
        button.classList.add("wrong");

        const correctButton = allButtons[correctIndex];
        if (correctButton) {
          correctButton.classList.add("correct");
        }
      }

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
    } else {
      if (questionFrame) questionFrame.textContent = "Quiz beendet!";
      if (answersEl) answersEl.innerHTML = "";
      if (fragenText) fragenText.textContent = "Fertig";
      nextBtn.classList.add("hidden");

      if (menuBtn) {
        menuBtn.classList.remove("hidden");
      }
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
  loadQuestions();
}

if(adminBtn) {
  adminBtn.addEventListener("click", () => {
    window.location.href = './admin/question-management.html';
  });
}