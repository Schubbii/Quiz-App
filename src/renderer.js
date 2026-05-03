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

const player1NameInput = document.getElementById("player1-name");
const player2NameInput = document.getElementById("player2-name");
const playerDisplay = document.getElementById("player-display");

const bgMusic1 = new Audio("./audio/Timer_Variant-1.mp3");
const bgMusic2 = new Audio("./audio/Timer_Variant-2.mp3");
const bgMusic3 = new Audio("./audio/Timer_Variant-3.mp3");


function resetMusic () {
  bgMusic1.pause();         //laufende Audios pausieren und zurück and den Anfang setzen
        bgMusic1.currentTime = 0;
        bgMusic2.pause();
        bgMusic2.currentTime = 0;
        bgMusic3.pause();
        bgMusic3.currentTime = 0;
}

//////////////////////////////////////////////////////////////////
/// Setup für API-Generierte Fragen bei Kategorie "Geographie" ///
//////////////////////////////////////////////////////////////////

/*
0: Welches dieser Länder ist Teil der UN
1: Welches dieser Länder ist nicht Teil der UN
2: Welches dieser Länder gehört zur Region {region}
3: Welches dieser Länder gehört nicht zur Region {region}
4: Welches dieser Länder grenzt an {land}
5: Welches dieser Länder grenzt nicht an {land}
6: Was ist die Hauptstadt von {land}


250 Länder


name.common = string Name
cca3 = Ländercode im cca3 Format
unMember = boolean ist eine UN mitglied
region = Region bsp. Europa
border[] = Angrenzende Länder (im "cca3" Format)
cca3 = Land im cca3 Format


*/

let response;
let countryDataJson;
let regions = ["Asia", "Europe", "Oceania", "Americas", "Africa"];

async function fetchCountries() {
  response = await fetch("https://restcountries.com/v3.1/all?fields=name,capital,borders,unMember,region,cca3");
  countryDataJson = await response.json();
  await output(countryDataJson);
  await output("fetched Country Data")
}


let geoQuestions = ["Welches dieser Länder ist Teil der UN?",
  "Welches dieser Länder ist nicht Teil der UN?",
  "Welches dieser Länder gehört zur Region {region}?",
  "Welches dieser Länder gehört nicht zur Region {region}?",
  "Welches dieser Länder grenzt an {land}?",
  "Welches dieser Länder grenzt nicht an {land}?",
  "Was ist die Hauptstadt von {land}?"
];

function output(input) {
  console.log(input);
}

function rndCountry() {
  let countryIndex = Math.floor(Math.random() * countryDataJson.length);
  output("got new country");
  // output("countryDataJson[countryIndex].name.common: " + countryDataJson[countryIndex].name.common);
  return countryDataJson[countryIndex];
}

function fetchGeoQuestion() {
  let randomQuestion = Math.floor(Math.random() * 7);
  let questionString = "";
  let answerArray = [];
  let testCountry;
  let breakOutIteration = 0;
  let correctAnswerIndex;
  let selectedRegion;
  let iteration;
  let selectedCountry;
  let bordersOfSelectedCountry;
  let borderOfSelectedCountry;
  let falseAnswers;
  let falseAnswer;
  let cca3AnswerArray = [];

  output("randomQuestion: " + randomQuestion);

  ///////////////////////////////////////////////////
  /// Fragengenerierung für API-Geographie-Fragen ///
  ///////////////////////////////////////////////////

  switch (randomQuestion) {

    case 0:

      questionString = geoQuestions[0];
      correctAnswerIndex = Math.floor(Math.random() * 4);
      while (answerArray.length < 4) {
        testCountry = rndCountry();
        if (answerArray.length == correctAnswerIndex) {
          if (testCountry.unMember == true) {
            answerArray.push(testCountry.name.common);
          }
        } else {
          if (testCountry.unMember == false) {
            answerArray.push(testCountry.name.common);
          }
        }

      }


      breakOutIteration += 1;
      if (breakOutIteration > 500) { answerArray = ["1", "2", "3", "4", "5", "6", "7"] }
      break;


    case 1:

      questionString = geoQuestions[1];
      correctAnswerIndex = Math.floor(Math.random() * 4);
      while (answerArray.length < 4) {
        testCountry = rndCountry();
        if (answerArray.length == correctAnswerIndex) {
          if (testCountry.unMember == false) {
            answerArray.push(testCountry.name.common);
          }
        } else {
          if (testCountry.unMember == true) {
            answerArray.push(testCountry.name.common);
          }
        }

      }


      breakOutIteration += 1;
      if (breakOutIteration > 500) { answerArray = ["1", "2", "3", "4", "5", "6", "7"] }
      break;


    case 2:
      selectedRegion = regions[Math.floor(Math.random() * 5)]
      questionString = geoQuestions[2].replace("{region}", selectedRegion);
      correctAnswerIndex = Math.floor(Math.random() * 4);

      while (answerArray.length < 4) {
        testCountry = rndCountry();
        if (answerArray.length == correctAnswerIndex) {
          if (testCountry.region == selectedRegion) {
            answerArray.push(testCountry.name.common);
          } else { output("badcountry1")}
        } else {
          if (testCountry.region != selectedRegion) {
            answerArray.push(testCountry.name.common);
          }
        }

      }

      breakOutIteration += 1;
      if (breakOutIteration > 500) { answerArray = ["1", "2", "3", "4", "5", "6", "7"] }
      break;

    case 3:
      selectedRegion = regions[Math.floor(Math.random() * 5)]
      questionString = geoQuestions[3].replace("{region}", selectedRegion);
      correctAnswerIndex = Math.floor(Math.random() * 4);

      while (answerArray.length < 4) {
        testCountry = rndCountry();
        if (answerArray.length == correctAnswerIndex) {
          if (testCountry.region != selectedRegion) {
            answerArray.push(testCountry.name.common);
          }
        } else {
          if (testCountry.region == selectedRegion) {
            answerArray.push(testCountry.name.common);
          }
        }

      }

      breakOutIteration += 1;
      if (breakOutIteration > 500) { answerArray = ["1", "2", "3", "4", "5", "6", "7"] }
      break;




    case 4: //Welches dieser Länder grenz an {land}
      selectedCountry = null;
      while (selectedCountry == null) {
        testCountry = rndCountry();
        if (testCountry.borders.length >= 1) {
          selectedCountry = testCountry;
        } else { output("bad country") }
      }

      questionString = geoQuestions[4].replace("{land}", selectedCountry.name.common);

      borderOfSelectedCountry = selectedCountry.borders[Math.floor(Math.random() * selectedCountry.borders.length)];

      falseAnswers = [];
      iteration = 0;
      while (falseAnswers.length < 3) {
        testCountry = rndCountry();
        if (!(selectedCountry.borders.includes(testCountry.cca3)) && !(falseAnswers.includes(testCountry.cca3))) {
          falseAnswers.push(testCountry.cca3);
        }
        iteration += 1;
        if (iteration > 500) break;
      }



      correctAnswerIndex = Math.floor(Math.random() * 4);
      iteration = 0;
      while (cca3AnswerArray.length < 4) {
        if (cca3AnswerArray.length == correctAnswerIndex) {
          cca3AnswerArray.push(borderOfSelectedCountry);
        } else {
          cca3AnswerArray.push(falseAnswers[iteration]);
          iteration += 1;
        }

        breakOutIteration += 1;
        if (breakOutIteration > 500) {
          cca3AnswerArray = ["1", "2", "3", "4", "5", "6", "7"]
        }
      }



      cca3AnswerArray.forEach(a => {
        const country = countryDataJson.find(countryDataJson => countryDataJson.cca3 === a);
        answerArray.push(country.name.common);
      })

      break;




    case 5: //Welches dieser Länder grenzt nicht an {land}

      selectedCountry = null;
      bordersOfSelectedCountry = [];
      while (selectedCountry == null) {
        testCountry = rndCountry();
        if (testCountry.borders.length >= 3) {
          selectedCountry = testCountry;
        } else { output("bad country") }
      }

      questionString = geoQuestions[5].replace("{land}", selectedCountry.name.common);

      bordersOfSelectedCountry[0] = selectedCountry.borders[Math.floor(Math.random() * selectedCountry.borders.length)];
      bordersOfSelectedCountry[1] = bordersOfSelectedCountry[0];

      while (bordersOfSelectedCountry[1] == bordersOfSelectedCountry[0]) {
        bordersOfSelectedCountry[1] = selectedCountry.borders[Math.floor(Math.random() * selectedCountry.borders.length)];
      }

      bordersOfSelectedCountry[2] = bordersOfSelectedCountry[0];
      while ((bordersOfSelectedCountry[2] == bordersOfSelectedCountry[0]) || (bordersOfSelectedCountry[2] == bordersOfSelectedCountry[1])) {
        bordersOfSelectedCountry[2] = selectedCountry.borders[Math.floor(Math.random() * selectedCountry.borders.length)];
      }

      falseAnswer = "";

      while ((falseAnswer == "") || (bordersOfSelectedCountry.includes(falseAnswer))) {
        testCountry = rndCountry();
        if (!(selectedCountry.borders.includes(testCountry.cca3))) { falseAnswer = testCountry.cca3 }
      }


      cca3AnswerArray = []
      correctAnswerIndex = Math.floor(Math.random() * 4);
      iteration = 0;
      while (cca3AnswerArray.length < 4) {
        if (cca3AnswerArray.length == correctAnswerIndex) {
          cca3AnswerArray.push(falseAnswer);
        } else {
          cca3AnswerArray.push(bordersOfSelectedCountry[iteration]);
          iteration += 1;
        }

        breakOutIteration += 1;
        if (breakOutIteration > 500) {
          cca3AnswerArray = ["1", "2", "3", "4", "5", "6", "7"]
        }
      }


      cca3AnswerArray.forEach(a => {
        const country = countryDataJson.find(countryDataJson => countryDataJson.cca3 === a);
        answerArray.push(country.name.common);
      })

      break;

    case 6: //Was ist die Hauptstadt von {land}
      selectedCountry = rndCountry();
      falseAnswers = [];

      questionString = geoQuestions[6].replace("{land}", selectedCountry.name.common);

      while (falseAnswers.length < 3) {
        testCountry = rndCountry();

        if (!(falseAnswers.includes(testCountry.capital[0]))) {
          if (testCountry.capital[0] == undefined) {
          } else {
            falseAnswers.push(testCountry.capital[0]);
          }

        }
      }


      answerArray = [];
      correctAnswerIndex = Math.floor(Math.random() * 4);

      iteration = 0;
      while (answerArray.length < 4) {
        if (answerArray.length == correctAnswerIndex) {
          answerArray.push(selectedCountry.capital[0]);
        } else {
          answerArray.push(falseAnswers[iteration]);
          iteration += 1;
        }

        breakOutIteration += 1;
        if (breakOutIteration > 500) {
          answerArray = ["1", "2", "3", "4", "5", "6", "7"]
        }

      }

      break;
  }
  output("questionString: " + questionString);
  output("answerArray: " + answerArray);
  output("correctAnswerIndex: " + correctAnswerIndex);

  let questionObject = [];
  questionObject.push({
    question: questionString,
    answers: answerArray,
    correctAnswerIndex: correctAnswerIndex
  })

  return questionObject;

}


//////////////////////////////////////////////////////////
/// ENDE - Fragengenerierung für API-Geographie-Fragen ///
//////////////////////////////////////////////////////////



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
    function updateMaxQuestions() {
      const selectedCategory = categorySelect ? categorySelect.value : "all";

      const filteredQuestions =
        selectedCategory === "all"
          ? questions
          : questions.filter(
            (question) =>
              String(question.category || "").trim() === selectedCategory
          );


      let maxCount = filteredQuestions.length;

      if (selectedCategory == "Geografie") {
        // Da beim erstmaligen Auswählen von der Kategorie "Geographie" die Fragen geladen werden müssen, wird das Starten kurz blockiert, damit das Quiz nicht ohne Fragen startet
        console.log("countryDataJson: " + countryDataJson);
        console.log("Boolean(countryDataJson): " + Boolean(countryDataJson));
        if (!(countryDataJson)) {
          fetchCountries();
          document.getElementById("start-quiz-btn").innerText = "Daten werden heruntergeladen";
          document.getElementById("start-quiz-btn").style.background = "rgba(125, 125, 125, 0.73)";
          startQuizBtn.disabled = true;
          const hasDataLoaded = setInterval(() => {
            if (Boolean(countryDataJson)) {
              console.log("daten haben geladen")
              startQuizBtn.disabled = false;
              document.getElementById("start-quiz-btn").innerText = "Quiz starten";
              document.getElementById("start-quiz-btn").style.background = " rgba(255, 100.53, 249.85, 0.73)";
              clearInterval(hasDataLoaded);
            }
          }, 50)

        }

        maxCount = 30;
      }

      if (questionCountInput) {
        questionCountInput.max = maxCount;

        if (Number(questionCountInput.value) > maxCount) {
          questionCountInput.value = maxCount;
        }
      }

      if (maxQuestionsInfo) {
        maxQuestionsInfo.textContent = `Maximal ${maxCount} Fragen verfügbar`;
      }
    }

    updateMaxQuestions();

    if (categorySelect) {
      categorySelect.addEventListener("change", updateMaxQuestions);
    }
  } catch (error) {
    console.error("Fehler beim Laden der Fragen:", error);
  }
}

if (
  window.location.pathname.includes("menu.html") ||
  window.location.pathname.includes("multiplayer.html")
) {
  setQuizSettings();
}

if (startQuizBtn) {
  startQuizBtn.addEventListener("click", async () => {
    const count = Number(questionCountInput.value);
    const selectedCategory = categorySelect ? categorySelect.value : "all";

    const player1Name = player1NameInput ? player1NameInput.value.trim() : "";
    const player2Name = player2NameInput ? player2NameInput.value.trim() : "";

    if (!count || count < 1) {
      alert("Bitte eine gültige Anzahl eingeben.");
      return;
    }

    const isMultiplayer = window.location.pathname.includes("multiplayer.html");

    localStorage.setItem("questionCount", count);
    localStorage.setItem("selectedCategory", selectedCategory);
    localStorage.setItem("gameMode", isMultiplayer ? "multi" : "single");

    localStorage.setItem("player1Name", player1Name || "Player 1");
    localStorage.setItem("player2Name", player2Name || "Player 2");

    localStorage.removeItem("multiQuestions");
    localStorage.removeItem("currentPlayer");
    localStorage.removeItem("p1Correct");
    localStorage.removeItem("p1Wrong");
    localStorage.removeItem("p1Percentage");
    localStorage.removeItem("p2Correct");
    localStorage.removeItem("p2Wrong");
    localStorage.removeItem("p2Percentage");

    if (isMultiplayer) {
      localStorage.setItem("currentPlayer", "1");
    }

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
const QUESTION_TIME = 11;

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
    const gameMode = localStorage.getItem("gameMode") || "single";
    const currentPlayer = localStorage.getItem("currentPlayer") || "1";

    if (selectedCategory !== "all") {
      if (selectedCategory === "Geografie") {
        if (!countryDataJson) {
          await fetchCountries();
        }

        questions = [];

        for (let i = 0; i < count; i++) {
          const geoQuestion = await fetchGeoQuestion()[0];
          await questions.push(geoQuestion);
        }
      } else {
        questions = questions.filter((question) => {
          return String(question.category || "").trim() === selectedCategory;
        });
      }

    }

    if (gameMode === "multi" && currentPlayer === "2") {
      quizQuestions = JSON.parse(localStorage.getItem("multiQuestions") || "[]");
    } else {
      shuffleArray(questions);
      quizQuestions = questions.slice(0, count);

      if (gameMode === "multi") {
        localStorage.setItem("multiQuestions", JSON.stringify(quizQuestions));
      }
    }

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

    updatePlayerDisplay();
    showQuestion();


  } catch (error) {
    console.error("Fehler beim Laden der Fragen:", error);

    if (questionFrame) {
      questionFrame.textContent = "Fragen konnten nicht geladen werden.";
    }
  }
}


function updatePlayerDisplay() {
  if (!playerDisplay) return;

  const gameMode = localStorage.getItem("gameMode") || "single";

  if (gameMode !== "multi") {
    playerDisplay.classList.add("hidden");
    return;
  }

  const player1Name = localStorage.getItem("player1Name") || "Player 1";
  const player2Name = localStorage.getItem("player2Name") || "Player 2";
  const currentPlayer = localStorage.getItem("currentPlayer") || "1";

  playerDisplay.classList.remove("hidden");
  playerDisplay.textContent =
    `Aktuell: ${currentPlayer === "1" ? player1Name : player2Name} | ${player1Name} vs. ${player2Name}`;
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
        resetMusic();
      }
    });

    answersEl.appendChild(button);
  });

  startTimer();
  // output("questionCount: " + questionCount);
  if(localStorage.getItem("questionCount") >= (0.6 * questionCountInput)) {bgMusic3.play()} else {
    if (localStorage.getItem("questionCount") >= (0.3 * questionCountInput)) {bgMusic2.play()} else {  
      bgMusic1.play();
    }
  }
}


// MENU.HTML
// Überprüft, ob Animation bereits abgespielt wurde
if (window.location.pathname.includes("start.html")) {
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
    window.location.href = "./fragenBild.html";
    resetMusic();
  });
}

// Nächste Frage oder Quiz beenden
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    stopTimer();
    resetMusic();
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

      const gameMode = localStorage.getItem("gameMode") || "single";
      const currentPlayer = localStorage.getItem("currentPlayer") || "1";

      if (gameMode === "multi") {
        if (currentPlayer === "1") {
          localStorage.setItem("p1Correct", correctAnswers);
          localStorage.setItem("p1Wrong", wrongAnswers);
          localStorage.setItem("p1Percentage", percentage);

          localStorage.setItem("currentPlayer", "2");

          alert(`${localStorage.getItem("player1Name") || "Player 1"} ist fertig. Jetzt spielt ${localStorage.getItem("player2Name") || "Player 2"} mit den gleichen Fragen.`);

          window.location.href = "./fragen.html";
        } else {
          localStorage.setItem("p2Correct", correctAnswers);
          localStorage.setItem("p2Wrong", wrongAnswers);
          localStorage.setItem("p2Percentage", percentage);

          window.location.href = "./multi-scoreboard.html";
        }

        return;
      }

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
    window.location.href = "./start.html";
  });
}

// Überprüft, ob aktuelle Fragen-Seite sind und zeigt die erste Frage an
if (window.location.pathname.includes("fragenBild.html")) {
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


// SCOREBOARD.HTML nur im Singleplayer
if (
  window.location.pathname.includes("scoreboard.html") &&
  !window.location.pathname.includes("multi-scoreboard.html")
) {
  document.getElementById("score-correct").textContent =
    localStorage.getItem("c") || 0;

  document.getElementById("score-wrong").textContent =
    localStorage.getItem("w") || 0;

  document.getElementById("score-percentage").textContent =
    (localStorage.getItem("p") || 0) + "%";
}

// MULTI-SCOREBOARD.HTML
if (window.location.pathname.includes("multi-scoreboard.html")) {
  const player1Name = localStorage.getItem("player1Name") || "Player 1";
  const player2Name = localStorage.getItem("player2Name") || "Player 2";
  const selectedCategory = localStorage.getItem("selectedCategory") || "all";

  const p1Title = document.getElementById("player1-title");
  const p2Title = document.getElementById("player2-title");

  if (p1Title) p1Title.textContent = player1Name;
  if (p2Title) p2Title.textContent = player2Name;

  document.getElementById("p1-correct").textContent = localStorage.getItem("p1Correct") || 0;
  document.getElementById("p1-wrong").textContent = localStorage.getItem("p1Wrong") || 0;
  document.getElementById("p1-percentage").textContent = (localStorage.getItem("p1Percentage") || 0) + "%";

  document.getElementById("p2-correct").textContent = localStorage.getItem("p2Correct") || 0;
  document.getElementById("p2-wrong").textContent = localStorage.getItem("p2Wrong") || 0;
  document.getElementById("p2-percentage").textContent = (localStorage.getItem("p2Percentage") || 0) + "%";

  const categoryEl = document.getElementById("multi-category");

  if (categoryEl) {
    const categoryText =
      selectedCategory === "all" || !selectedCategory
        ? "Alle Kategorien"
        : selectedCategory;

    categoryEl.textContent = "Kategorie: " + categoryText;
  }
}

if (adminBtn) {
  adminBtn.addEventListener("click", () => {
    window.location.href = "admin/question-management.html";
  });
}

if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    const gameMode = localStorage.getItem("gameMode") || "single";

    if (gameMode === "multi") {
      localStorage.setItem("currentPlayer", "1");

      localStorage.removeItem("multiQuestions");
      localStorage.removeItem("p1Correct");
      localStorage.removeItem("p1Wrong");
      localStorage.removeItem("p1Percentage");
      localStorage.removeItem("p2Correct");
      localStorage.removeItem("p2Wrong");
      localStorage.removeItem("p2Percentage");

      window.location.href = "./fragen.html";
      return;
    }

    window.location.href = "./fragen.html";
  });
}

// Elemente holen
const dialog = document.getElementById("popupDialog");
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");

// Öffnen
if (openBtn && dialog) {
  openBtn.addEventListener("click", () => {
    dialog.showModal();
  });
}

// Schließen
if (closeBtn && dialog) {
  closeBtn.addEventListener("click", () => {
    dialog.close();
  });
}


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


//Gewinner anzeige
const p1Correct = Number(localStorage.getItem("p1Correct")) || 0;
const p2Correct = Number(localStorage.getItem("p2Correct")) || 0;

const player1Card = document.getElementById("player1-title")?.closest(".player-score");
const player2Card = document.getElementById("player2-title")?.closest(".player-score");

if (p1Correct > p2Correct) {
  player1Card?.classList.add("winner-card");
  document.getElementById("player1-title").textContent = player1Name + " 🏆";
} else if (p2Correct > p1Correct) {
  player2Card?.classList.add("winner-card");
  document.getElementById("player2-title").textContent = player2Name + " 🏆";
} else {
  player1Card?.classList.add("draw-card");
  player2Card?.classList.add("draw-card");
}
