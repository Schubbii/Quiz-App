const timeValue = document.getElementById("timeValue");
const resultText = document.getElementById("result-text");

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

const restartBtn = document.getElementById("restart-btn");

const startQuizBtn = document.getElementById("start-quiz-btn");
const questionCountInput = document.getElementById("question-count");

const categorySelect = document.getElementById("category-select");
const maxQuestionsInfo = document.getElementById("max-questions-info");


async function setQuizSettings() {
  try {
    const questions = await window.quizAPI.getQuestions();

    // Kategorien automatisch aus allen Fragen holen
    const categories = [...new Set(
      questions
        .map((q) => String(q.category || "").trim())
        .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b, "de"));

    // Kategorie-Dropdown füllen
    if (categorySelect) {
      categorySelect.innerHTML = '<option value="all">Alle Kategorien</option>';

      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });
    }

    // Maximalwert für Fragenanzahl setzen
    const maxCount = questions.length;
    questionCountInput.max = maxCount;

    if (Number(questionCountInput.value) > maxCount) {
      questionCountInput.value = maxCount;
    }

    if (maxQuestionsInfo) {
      maxQuestionsInfo.textContent = `Maximal ${maxCount} Fragen verfügbar`;
    }
  } catch (error) {
    console.error("Fehler beim Laden der Fragen:", error);
  }
}

if (window.location.pathname.includes("menu.html")) {
  setQuizSettings();
}

if (startQuizBtn) {
  startQuizBtn.addEventListener("click", async () => {
    const count = Number(questionCountInput.value);
    const selectedCategory = categorySelect ? categorySelect.value : "all";

    if (!count || count < 1) {
      alert("Bitte eine gültige Anzahl eingeben.");
      return;
    }

    localStorage.setItem("questionCount", count);
    localStorage.setItem("selectedCategory", selectedCategory);

    window.location.href = "./fragen.html";
  });
}


// fragen von quizzes.json laden
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let quizQuestions = [];
let timerInterval = null;
let timeLeft = 15;
const QUESTION_TIME = 15;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function loadQuestions() {
  try {
   let questions = await window.quizAPI.getQuestions();

const count = Number(localStorage.getItem("questionCount")) || questions.length;
const selectedCategory = localStorage.getItem("selectedCategory") || "all";

if (selectedCategory !== "all") {
  questions = questions.filter(
    (question) => String(question.category || "").trim() === selectedCategory
  );
}

// Fragen mischen
shuffleArray(questions);

// nur gewünschte Anzahl nehmen
quizQuestions = questions.slice(0, count);

    if (quizQuestions.length === 0) {
      if (questionFrame) {
        questionFrame.textContent = "Keine Fragen gefunden.";
      }
      return;
    }

    if (count > questions.length) {
      alert(`Es gibt nur ${questions.length} Fragen.`);
    }

    currentQuestionIndex = 0;
    correctAnswers = 0;
    wrongAnswers = 0;

    showQuestion();
  } catch (error) {
    console.error("Fehler beim Laden der Fragen:", error);
    if (questionFrame) {
      questionFrame.textContent = "Fragen konnten nicht geladen werden.";
    }
  }
}


//fragen werden angezeigt
function showQuestion() {
  if (!questionFrame || !answersEl || currentQuestionIndex >= quizQuestions.length) return;

  const currentQuestion = quizQuestions[currentQuestionIndex];
  questionFrame.textContent = currentQuestion.question;
  answersEl.innerHTML = "";

  if (fragenText) {
    fragenText.textContent = `Frage ${currentQuestionIndex + 1} von ${quizQuestions.length}`;
  }

  if (resultText) {
    resultText.textContent = "";
  }

  if (nextBtn) {
    nextBtn.classList.add("hidden");
  }

  currentQuestion.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.classList.add("buttonAnswers");

    button.addEventListener("click", () => {
      stopTimer();

      const allButtons = Array.from(answersEl.children);
      const correctIndex = currentQuestion.correctAnswerIndex;

      if (index === correctIndex) {
        button.classList.add("correct");
        correctAnswers++;
        // if (resultText) {
        //   resultText.textContent = "Richtig!";
        // }
      } else {
        button.classList.add("wrong");
        wrongAnswers++;
        // if (resultText) {
        //   resultText.textContent = "Falsch!";
        // }

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

  startTimer();
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
      logoAnimation.addEventListener("loadedmetadata", () => {
        const targetDuration = 1; // gewünschte Dauer in Sekunden
        logoAnimation.playbackRate = logoAnimation.duration / targetDuration;
      });

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
    stopTimer();
    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
      if (resultText) {
        resultText.textContent = "";
      }

      nextBtn.classList.add("hidden");
      showQuestion();
    } else {
      const total = correctAnswers + wrongAnswers;
      const percentage = total > 0 ? Math.round((correctAnswers / total) * 100) : 0;

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

  loadQuestions();
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = QUESTION_TIME;

  if (timeValue) {
    timeValue.textContent = timeLeft;
  }

  timerInterval = setInterval(() => {
    timeLeft--;

    if (timeValue) {
      timeValue.textContent = timeLeft;
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeUp();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function handleTimeUp() {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const allButtons = Array.from(answersEl.children);

  allButtons.forEach((btn, index) => {
    btn.disabled = true;

    if (index === currentQuestion.correctAnswerIndex) {
      btn.classList.add("correct");
      wrongAnswers++;
    }
  });

  if (resultText) {
    resultText.textContent = "Zeit abgelaufen!";
  }

  if (nextBtn) {
    nextBtn.classList.remove("hidden");
  }
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

if (adminBtn) {
  adminBtn.addEventListener("click", () => {
    window.location.href = "admin/question-management.html";
  });
}

if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    window.location.href = "./fragen.html";
  });
}

// Elemente holen
    const dialog = document.getElementById('popupDialog');
    const openBtn = document.getElementById('openBtn');
    const closeBtn = document.getElementById('closeBtn');

    // Öffnen
    openBtn.addEventListener('click', () => {
        dialog.showModal(); // Modal öffnen
    });

// Schließen
    closeBtn.addEventListener('click', () => {
        dialog.close();
    });


// Menü - Button zum Menü Singleplayer o. Multiplayer

const singleplayerBtn = document.getElementById("singleplayerBtn");
const multiplayerBtn = document.getElementById("multiplayerBtn");
const backBtn = document.getElementById("backBtn");

if (backBtn) {  
backBtn.addEventListener("click", () => {
  window.location.href = "./start.html";
});
}
if (singleplayerBtn) {
singleplayerBtn.addEventListener("click", () => {
window.location.href = "./menu.html";
});
}
if (multiplayerBtn) {
multiplayerBtn.addEventListener("click", () => {
  window.location.href = "./multiplayer.html";
});
}

