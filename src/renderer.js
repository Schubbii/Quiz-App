const timeValue = document.getElementById("timeValue");
const resultText = document.getElementById("result-text");

const startAnimation = document.getElementById("Startanimation");
const logoAnimation = document.getElementById("Logoanimation");
const hauptmenue = document.getElementById("Hauptmenue");

if (window.location.pathname.includes("start.html") && startAnimation && hauptmenue) {
  setTimeout(() => {
    if (startAnimation.style.display !== "none") {
      startAnimation.style.display = "none";
      hauptmenue.classList.remove("hidden");
      sessionStorage.setItem("animationPlayed", "true");
    }
  }, 5000);
}

const adminBtn = document.getElementById("admin-btn");
const menuBtn = document.getElementById("menu-btn");

const questionFrame = document.getElementById("question2");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const fragenText = document.querySelector(".FragenText");

const restartBtn = document.getElementById("restart-btn");

const startQuizBtn = document.getElementById("start-quiz-btn");
const questionCountInput = document.getElementById("question-count");
const roundCountInput = document.getElementById("round-count");

const categorySelect = document.getElementById("category-select");
const maxQuestionsInfo = document.getElementById("max-questions-info");

const player1NameInput = document.getElementById("player1-name");
const player2NameInput = document.getElementById("player2-name");
const playerDisplay = document.getElementById("player-display");
const timePowerupBtn = document.getElementById("time-powerup-btn");
const timePowerupCountEl = document.getElementById("time-powerup-count");

const bgTimerMusic1 = new Audio("./audio/Timer_Variant-1.mp3");
const bgTimerMusic2 = new Audio("./audio/Timer_Variant-2.mp3");
const bgTimerMusic3 = new Audio("./audio/Timer_Variant-3.mp3");
const bgTimerMusic5sec = new Audio("./audio/Timer+5sec.mp3");
bgTimerMusic5sec.volume = 0; // wird nur angeschalten, wenn das Powerup aktiviert wird

const sfxMuteBtn = document.getElementById("ButtonsToggle");

const WIKIMEDIA_CATEGORIES = {
  musician: "Sänger & Musiker",
  actor: "Schauspieler",
};

function isWikimediaCategory(category) {
  return Object.prototype.hasOwnProperty.call(WIKIMEDIA_CATEGORIES, category);
}

function getQuestionPageForCategory(category) {
  return category === "all" || isWikimediaCategory(category) ? "./fragenBild.html" : "./fragen.html";
}

function getCategoryLabel(category) {
  if (!category || category === "all") return "Alle Kategorien";

  return WIKIMEDIA_CATEGORIES[category] || category;
}

function goToQuestionPage() {
  window.location.href = getQuestionPageForCategory(localStorage.getItem("selectedCategory"));
}

function parseJsonOrFallback(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function getWikimediaPersonKey(person) {
  return `${person.type}:${person.wikiLink || person.displayName}`;
}

function getMixedQuestionPool(serverQuestions) {
  const mixedQuestions = [...serverQuestions];

  Object.keys(WIKIMEDIA_CATEGORIES).forEach((category) => {
    const count = getWikimediaCategoryCount(category);

    for (let i = 0; i < count; i++) {
      mixedQuestions.push({ category, isWikimediaPlaceholder: true });
    }
  });

  return mixedQuestions;
}

function getTotalWikimediaQuestionCount() {
  return Object.keys(WIKIMEDIA_CATEGORIES).reduce(
    (total, category) => total + getWikimediaCategoryCount(category),
    0
  );
}

function buildQuestionFromPoolItem(poolItem) {
  if (poolItem?.isWikimediaPlaceholder) {
    return getWikimediaQuestion(poolItem.category)[0];
  }

  return poolItem;
}

if (localStorage.getItem("musicMuted") == "true") {
  bgTimerMusic1.volume = 0;
  bgTimerMusic2.volume = 0;
  bgTimerMusic3.volume = 0;

  window.audio?.stopMusic("lobbyBackground");

  localStorage.setItem("musicMuted", "true");

  if (document.getElementById("musicToggle")) {
    document.getElementById("musicToggle").checked = true;
  }
}

if (document.getElementById("musicToggle")) {
  document.getElementById("musicToggle").onchange = event => {
    if (document.getElementById("musicToggle").checked == true) {
      bgTimerMusic1.volume = 0;
      bgTimerMusic2.volume = 0;
      bgTimerMusic3.volume = 0;

      window.audio?.stopMusic("lobbyBackground");

      localStorage.setItem("musicMuted", "true");
    }

    if (document.getElementById("musicToggle").checked == false) {
      bgTimerMusic1.volume = 1;
      bgTimerMusic2.volume = 1;
      bgTimerMusic3.volume = 1;

      window.audio?.playMusic("lobbyBackground");

      localStorage.setItem("musicMuted", "false");
    }
  }
}

if (localStorage.getItem("sfxMuted")) {
  if (localStorage.getItem("sfxMuted") == "true") {
    sfxMuteBtn.checked = true;
  }
}

if (sfxMuteBtn) {
  sfxMuteBtn.onchange = event => {
    if (sfxMuteBtn.checked == true) {
      window.audio?.setSfxMuted(true);

      localStorage.setItem("sfxMuted", "true");
    }
    if (sfxMuteBtn.checked == false) {
      window.audio?.setSfxMuted(false);

      localStorage.setItem("sfxMuted", "false");
    }
  }
}



function resetTimerMusic() {
  bgTimerMusic1.pause();         //laufende Audios pausieren und zurück and den Anfang setzen
  bgTimerMusic1.currentTime = 0;
  bgTimerMusic2.pause();
  bgTimerMusic2.currentTime = 0;
  bgTimerMusic3.pause();
  bgTimerMusic3.currentTime = 0;
}

function playTimerMusicForCurrentQuestion() {
  const totalQuestions = quizQuestions.length || 1;
  const progress = (currentQuestionIndex + 1) / totalQuestions;
  const selectedTrack =
    progress >= 0.6 ? bgTimerMusic3 :
      progress >= 0.3 ? bgTimerMusic2 :
        bgTimerMusic1;

  resetTimerMusic();
  selectedTrack.play().catch((error) => {
    console.warn("Timer-Musik konnte nicht abgespielt werden:", error);
  });

  try {
    bgTimerMusic5sec.pause();
    bgTimerMusic5sec.currentTime = 0;
    bgTimerMusic5sec.volume = 0;
    bgTimerMusic5sec.play();
  } catch (error) {
    console.log(error);
  }

}

if (!(window.location.pathname.includes("menu.html") || window.location.pathname.includes("multiplayer.html") || window.location.pathname.includes("start.html"))) {
  window.audio?.stopMusic("lobbyBackground");
}

function attachButtonAudioHandlers(button) {
  button.onmouseover = event => {
    window.audio?.playSound("buttonHover");
  }

  button.onmousedown = event => {
    window.audio?.playSound("buttonClick");
  }

  button.onmouseup = event => {
    window.audio?.playSound("buttonRelease");
  }
}

document.querySelectorAll("button").forEach(attachButtonAudioHandlers);

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
          } else { output("badcountry1") }
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




/////////////////////////////////////////////////////
/// Fragengenerierung für Sänger und Schauspieler ///
/////////////////////////////////////////////////////


let WikiMediaObject;

let usedPersons = []

usedPersons = parseJsonOrFallback(sessionStorage.getItem("usedWikiPersons"), []);
sessionStorage.setItem("usedWikiPersons", JSON.stringify(usedPersons))

try {
  document.getElementById("jsonFile").addEventListener("change", async (event) => {
    const inputFile = event.target.files[0];
    const fileText = await inputFile.text();
    WikiMediaObject = await JSON.parse(fileText);
    sessionStorage.setItem("WikiMediaObject", JSON.stringify(WikiMediaObject));
  });
} catch (error) {

}

async function loadWikimediaData() {
  if (Array.isArray(WikiMediaObject) && WikiMediaObject.length > 0) {
    return WikiMediaObject;
  }

  const storedData = sessionStorage.getItem("WikiMediaObject");
  if (storedData) {
    WikiMediaObject = parseJsonOrFallback(storedData, []);
    return WikiMediaObject;
  }

  if (window.mediawikiAPI?.getLinks) {
    WikiMediaObject = await window.mediawikiAPI.getLinks();
  } else {
    const response = await fetch("./database/mediawikiLinks.json");
    WikiMediaObject = await response.json();
  }

  if (!Array.isArray(WikiMediaObject)) {
    throw new Error("Wikimedia-Daten konnten nicht geladen werden.");
  }

  sessionStorage.setItem("WikiMediaObject", JSON.stringify(WikiMediaObject));
  return WikiMediaObject;
}

function getWikimediaCategoryCount(category) {
  if (!Array.isArray(WikiMediaObject)) return 0;

  return WikiMediaObject.filter((person) => person.type === category).length;
}


async function fetchWikimediaImage(pageTitle) {
  const imageElement = document.getElementById("wikiemediaQuestionImage");
  if (!imageElement) return;

  try {
    const pageData = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(pageTitle));
    const pageJson = await pageData.json();

    if (pageJson.thumbnail?.source) {
      imageElement.src = pageJson.thumbnail.source;
    } else {
      imageElement.removeAttribute("src");
      console.log("No Wikimedia thumbnail found for: " + pageTitle);
    }
  } catch (error) {
    console.log("Could not display Image: " + error);
  }
}

function getWikimediaQuestion(typething) {

  output("sessionStorage.getItem('usedWikiPersons').length: " + usedPersons.length);
  output("sessionStorage.getItem('usedWikiPersons'): " + usedPersons);

  if (!Array.isArray(WikiMediaObject)) {
    const storedData = sessionStorage.getItem("WikiMediaObject");
    WikiMediaObject = parseJsonOrFallback(storedData, []);
  }

  if (!Array.isArray(WikiMediaObject) || WikiMediaObject.length === 0) {
    throw new Error("Wikimedia-Daten wurden noch nicht geladen.");
  }

  const peopleForType = WikiMediaObject.filter(obj => obj.type === typething);

  output("WikiMediaObject.filter(obj => obj.type === typething).length: " + peopleForType.length);
  output("WikiMediaObject.filter(obj => obj.type === typething): " + peopleForType);

  const usedPersonKeys = new Set(usedPersons);

  if (usedPersonKeys.size >= peopleForType.length) {
    clearPersons();
    usedPersonKeys.clear();
  }

  let correctPerson = generatePerson(typething);
  while (usedPersonKeys.has(getWikimediaPersonKey(correctPerson))) {
    correctPerson = generatePerson(typething);
    output("already used");
  }

  usedPersons.push(getWikimediaPersonKey(correctPerson));

  console.log("used persons: " + usedPersons);


  sessionStorage.setItem("usedWikiPersons", JSON.stringify(usedPersons));


  let falsePersons;
  falsePersons = generateFalsePersons(correctPerson);
  let answerPacket = generateAAAI(correctPerson, falsePersons);
  let questionString = "Was ist der Name der auf dem Bild dargestellten Person?"


  let questionObject = [];
  questionObject.push({
    question: questionString,
    answers: answerPacket[1],
    correctAnswerIndex: answerPacket[0],
    category: typething,
    difficulty: "Wikimedia",
    imageWikiLink: correctPerson.wikiLink
  })
  return questionObject;
}

function generatePerson(type) {
  const peopleForType = WikiMediaObject.filter((person) => person.type === type);

  if (peopleForType.length === 0) {
    throw new Error(`Keine Wikimedia-Personen für Kategorie ${type} gefunden.`);
  }

  return peopleForType[Math.floor(Math.random() * peopleForType.length)];
}


function generateFalsePersons(inputPerson) {
  const possibleFalsePersons = WikiMediaObject.filter((person) =>
    person.type === inputPerson.type &&
    person.gender === inputPerson.gender &&
    person.displayName !== inputPerson.displayName
  );

  if (possibleFalsePersons.length < 3) {
    throw new Error(`Zu wenige falsche Antworten für ${inputPerson.displayName} gefunden.`);
  }

  shuffleArray(possibleFalsePersons);
  return possibleFalsePersons.slice(0, 3);
}

function generateAAAI(correctPersonInput, falsePersonsInput) {

  let answerIndex = Math.floor(Math.random() * 4);
  let falsePersonsIndex = 0;
  let answerArray = [];

  for (let i = 0; i < 4; i += 1) {
    if (i == answerIndex) {
      answerArray.push(correctPersonInput);
    } else {
      answerArray.push(falsePersonsInput[falsePersonsIndex]);
      falsePersonsIndex += 1;
    }
  }
  return [answerIndex, answerArray];
}

function clearPersons() {
  sessionStorage.setItem("usedWikiPersons", JSON.stringify([]));
  usedPersons = []
  output("cleared")
}

////////////////////////////////////////////////////////////
/// ENDE - Fragengenerierung für Sänger und Schauspieler ///
////////////////////////////////////////////////////////////

async function setQuizSettings() {
  try {
    const questions = await window.quizAPI.getQuestions();
    await loadWikimediaData();

    // Kategorien automatisch aus allen Fragen holen
    const categories = [...new Set(
      questions
        .map((q) => String(q.category || "").trim())
        .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b, "de"));

    // Kategorie-Dropdown füllen
    if (categorySelect) {
      categorySelect.innerHTML = '<option value="all">Alle Kategorien</option>';

      Object.entries(WIKIMEDIA_CATEGORIES).forEach(([value, label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        categorySelect.appendChild(option);
      });

      categories.forEach((category) => {
        if (isWikimediaCategory(category)) return;

        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });
    }

    // Maximalwert für Fragenanzahl setzen
    async function updateMaxQuestions() {
      const selectedCategory = categorySelect ? categorySelect.value : "all";

      const filteredQuestions =
        selectedCategory === "all"
          ? questions
          : questions.filter(
            (question) =>
              String(question.category || "").trim() === selectedCategory
          );


      let maxCount = filteredQuestions.length;

      if (selectedCategory === "all") {
        await loadWikimediaData();
        maxCount = questions.length + getTotalWikimediaQuestionCount();
      }

      if (selectedCategory == "Geografie") {
        // Da beim erstmaligen Auswählen von der Kategorie "Geographie" die Fragen geladen werden müssen, wird das Starten kurz blockiert, damit das Quiz nicht ohne Fragen startet

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

      if (isWikimediaCategory(selectedCategory)) {
        // Da beim erstmaligen Auswählen von der Kategorie "musician" oder "actor" die Fragen geladen werden müssen, wird das Starten kurz blockiert, damit das Quiz nicht ohne Fragen startet

        if (!(WikiMediaObject)) {
          console.log("fragendaten noch nicht geladen")
          document.getElementById("start-quiz-btn").innerText = "Daten werden heruntergeladen";
          document.getElementById("start-quiz-btn").style.background = "rgba(125, 125, 125, 0.73)";
          startQuizBtn.disabled = true;
          const hasDataLoaded = setInterval(() => {
            if (Boolean(WikiMediaObject)) {
              console.log("daten haben geladen")
              startQuizBtn.disabled = false;
              document.getElementById("start-quiz-btn").innerText = "Quiz starten";
              document.getElementById("start-quiz-btn").style.background = " rgba(255, 100.53, 249.85, 0.73)";
              clearInterval(hasDataLoaded);
            }
          }, 50)
        }
        await loadWikimediaData();
        const roundCount = Number(roundCountInput?.value) || 1;
        maxCount = Math.max(1, Math.floor(getWikimediaCategoryCount(selectedCategory) / roundCount));
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

    await updateMaxQuestions();

    if (categorySelect) {
      categorySelect.addEventListener("change", updateMaxQuestions);
    }

    if (roundCountInput) {
      roundCountInput.addEventListener("input", updateMaxQuestions);
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
    const roundCount = Number(roundCountInput?.value) || 1;

    const player1Name = player1NameInput ? player1NameInput.value.trim() : "";
    const player2Name = player2NameInput ? player2NameInput.value.trim() : "";

    if (!count || count < 1) {
      alert("Bitte eine gültige Anzahl eingeben.");
      return;
    }

    if (!roundCount || roundCount < 1) {
      alert("Bitte eine gültige Rundenanzahl eingeben.");
      return;
    }

    if (isWikimediaCategory(selectedCategory)) {
      await loadWikimediaData();
      const availableWikimediaQuestions = getWikimediaCategoryCount(selectedCategory);
      const neededWikimediaQuestions = count * roundCount;

      if (neededWikimediaQuestions > availableWikimediaQuestions) {
        alert(`Es gibt nur ${availableWikimediaQuestions} Bildfragen in dieser Kategorie. Bitte weniger Fragen oder weniger Runden wählen.`);
        return;
      }
    }

    const isMultiplayer = window.location.pathname.includes("multiplayer.html");

    localStorage.setItem("questionCount", count);
    localStorage.setItem("roundCount", roundCount);
    localStorage.setItem("selectedCategory", selectedCategory);
    localStorage.setItem("gameMode", isMultiplayer ? "multi" : "single");

    localStorage.setItem("currentRound", "0");

    localStorage.setItem("player1Name", player1Name || "Player 1");
    localStorage.setItem("player2Name", player2Name || "Player 2");

    localStorage.removeItem("roundQuestions");
    localStorage.removeItem("currentPlayer");
    localStorage.removeItem("p1Correct");
    localStorage.removeItem("p1Wrong");
    localStorage.removeItem("p1Percentage");
    localStorage.removeItem("p2Correct");
    localStorage.removeItem("p2Wrong");
    localStorage.removeItem("p2Percentage");
    localStorage.removeItem("p1TimePowerups");
    localStorage.removeItem("p2TimePowerups");
    localStorage.removeItem("p1CorrectStreak");
    localStorage.removeItem("p2CorrectStreak");
    clearPersons();

    if (isMultiplayer) {
      localStorage.setItem("currentPlayer", "1");
      localStorage.setItem("currentRound", "0");

      alert("Im Multiplayer-Modus treten beide Spieler mit denselben Fragen gegeneinander an. Jede Runde startet zuerst Spieler 1, danach ist Spieler 2 an der Reihe.");
    }

    console.log("selectedCategory: " + selectedCategory);

    goToQuestionPage();

  });
}


// fragen von quizzes.json laden
let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let quizQuestions = [];
let timerInterval = null;
let timeLeft = 15;
let isQuestionActive = false;
const QUESTION_TIME = 10;
const TIME_POWERUP_SECONDS = 5;
const TIME_POWERUP_STREAK_GOAL = 2;

function getPowerupPlayerKey() {
  const gameMode = localStorage.getItem("gameMode") || "single";
  const currentPlayer = gameMode === "multi" ? (localStorage.getItem("currentPlayer") || "1") : "1";
  return `p${currentPlayer}`;
}

function getPowerupCountKey() {
  return `${getPowerupPlayerKey()}TimePowerups`;
}

function getPowerupStreakKey() {
  return `${getPowerupPlayerKey()}CorrectStreak`;
}

function getTimePowerupCount() {
  return Number(localStorage.getItem(getPowerupCountKey())) || 0;
}

function setTimePowerupCount(count) {
  localStorage.setItem(getPowerupCountKey(), String(Math.max(0, count)));
  updateTimePowerupDisplay();
}

function getCorrectStreak() {
  return Number(localStorage.getItem(getPowerupStreakKey())) || 0;
}

function setCorrectStreak(streak) {
  localStorage.setItem(getPowerupStreakKey(), String(Math.max(0, streak)));
}

function handlePowerupProgress(answerWasCorrect) {
  if (answerWasCorrect) {
    const nextStreak = getCorrectStreak() + 1;

    if (nextStreak >= TIME_POWERUP_STREAK_GOAL) {
      setTimePowerupCount(getTimePowerupCount() + 1);
      setCorrectStreak(0);
      return;
    }

    setCorrectStreak(nextStreak);
    return;
  }

  setCorrectStreak(0);
}

function updateTimePowerupDisplay() {
  if (!timePowerupBtn || !timePowerupCountEl) return;

  const count = getTimePowerupCount();
  timePowerupCountEl.textContent = count;
  timePowerupBtn.disabled = count <= 0 || !isQuestionActive;
  timePowerupBtn.classList.toggle("timePowerup--available", count > 0);
}

function useTimePowerup() {
  if (!isQuestionActive || getTimePowerupCount() <= 0) return;

  timeLeft += TIME_POWERUP_SECONDS;

  if (localStorage.getItem("musicMuted") == "false") {
    bgTimerMusic5sec.volume = 1;
  }


  if (timeValue) {
    timeValue.textContent = timeLeft;
  }

  setTimePowerupCount(getTimePowerupCount() - 1);
}

if (timePowerupBtn) {
  timePowerupBtn.addEventListener("click", useTimePowerup);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function loadQuestions() {
  console.log("die function wurde ausgeführt");
  try {
    let questions = await window.quizAPI.getQuestions();

    const count = Number(localStorage.getItem("questionCount")) || questions.length;
    const selectedCategory = localStorage.getItem("selectedCategory") || "all";
    const gameMode = localStorage.getItem("gameMode") || "single";
    const currentPlayer = localStorage.getItem("currentPlayer") || "1";
    let availableQuestionCount = questions.length;
    let mixedQuestionPool = [];

    if (selectedCategory === "all") {
      await loadWikimediaData();
      mixedQuestionPool = getMixedQuestionPool(questions);
      availableQuestionCount = mixedQuestionPool.length;
    }

    if (selectedCategory !== "all") {
      if (selectedCategory === "Geografie") {
        if (!countryDataJson) {
          await fetchCountries();
        }

        questions = [];
        availableQuestionCount = 30;
      } else if (isWikimediaCategory(selectedCategory)) {
        await loadWikimediaData();

        questions = [];
        availableQuestionCount = getWikimediaCategoryCount(selectedCategory);
      } else {
        questions = questions.filter((question) => {
          return String(question.category || "").trim() === selectedCategory;
        });
        availableQuestionCount = questions.length;
      }

      //  {
      //   questions = questions.filter((question) => {
      //     return String(question.category || "").trim() === selectedCategory;
      //   });
      // }

    }

    const roundCount = Number(localStorage.getItem("roundCount")) || 1;
    const currentRound = Number(localStorage.getItem("currentRound")) || 0;

    if (gameMode === "multi") {
      if (currentPlayer === "2") {
        const savedRounds = JSON.parse(localStorage.getItem("roundQuestions") || "[]");
        quizQuestions = savedRounds[currentRound] || [];
      } else {
        let savedRounds = JSON.parse(localStorage.getItem("roundQuestions") || "[]");

        if (savedRounds.length === 0) {
          const rounds = [];

          for (let round = 0; round < roundCount; round++) {
            let roundQuestions = [];

            if (selectedCategory === "Geografie") {
              for (let i = 0; i < count; i++) {
                roundQuestions.push(fetchGeoQuestion()[0]);
              }
            } else if (isWikimediaCategory(selectedCategory)) {
              for (let i = 0; i < count; i++) {
                roundQuestions.push(getWikimediaQuestion(selectedCategory)[0]);
              }
            } else if (selectedCategory === "all") {
              const questionsCopy = [...mixedQuestionPool];
              shuffleArray(questionsCopy);
              roundQuestions = questionsCopy
                .slice(0, count)
                .map(buildQuestionFromPoolItem);
            } else {
              const questionsCopy = [...questions];
              shuffleArray(questionsCopy);
              roundQuestions = questionsCopy.slice(0, count);
            }

            rounds.push(roundQuestions);
          }

          localStorage.setItem("roundQuestions", JSON.stringify(rounds));
          savedRounds = rounds;
        }

        quizQuestions = savedRounds[currentRound] || [];
      }
    } else {
      const rounds = [];

      for (let round = 0; round < roundCount; round++) {
        let roundQuestions = [];

        if (selectedCategory === "Geografie") {
          for (let i = 0; i < count; i++) {
            roundQuestions.push(fetchGeoQuestion()[0]);
          }
        } else if (isWikimediaCategory(selectedCategory)) {
          for (let i = 0; i < count; i++) {
            roundQuestions.push(getWikimediaQuestion(selectedCategory)[0]);
          }
        } else if (selectedCategory === "all") {
          const questionsCopy = [...mixedQuestionPool];
          shuffleArray(questionsCopy);
          roundQuestions = questionsCopy
            .slice(0, count)
            .map(buildQuestionFromPoolItem);
        } else {
          const questionsCopy = [...questions];
          shuffleArray(questionsCopy);
          roundQuestions = questionsCopy.slice(0, count);
        }

        rounds.push(roundQuestions);
      }

      quizQuestions = rounds.flat();
    }


    if (quizQuestions.length === 0) {
      if (questionFrame) {
        questionFrame.textContent = "Keine Fragen gefunden.";
      }
      return;
    }

    if (count > availableQuestionCount) {
      alert(`Es gibt nur ${availableQuestionCount} Fragen.`);
    }

    currentQuestionIndex = 0;
    correctAnswers = 0;
    wrongAnswers = 0;

    updatePlayerDisplay();
    updateTimePowerupDisplay();
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

  isQuestionActive = false;
  updateTimePowerupDisplay();

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isWikimediaQuestion = Boolean(currentQuestion.imageWikiLink);
  const imageFrame = document.querySelector(".image");

  answersEl.classList.toggle("answersImage", isWikimediaQuestion);
  answersEl.classList.toggle("answersGrid", !isWikimediaQuestion);

  if (imageFrame) {
    imageFrame.classList.toggle("hidden", !isWikimediaQuestion);
  }

  if (
    window.location.pathname.includes("fragenBild.html") &&
    isWikimediaQuestion
  ) {
    fetchWikimediaImage(currentQuestion.imageWikiLink);
  }


  questionFrame.textContent = currentQuestion.question;
  answersEl.innerHTML = "";

  if (fragenText) {
    const questionsPerRound = Number(localStorage.getItem("questionCount")) || quizQuestions.length;
    const roundCount = Number(localStorage.getItem("roundCount")) || 1;
    const storedRound = Number(localStorage.getItem("currentRound")) || 0;

    const questionInRound =
      localStorage.getItem("gameMode") === "multi"
        ? currentQuestionIndex + 1
        : (currentQuestionIndex % questionsPerRound) + 1;

    const shownRound =
      localStorage.getItem("gameMode") === "multi"
        ? storedRound + 1
        : Math.floor(currentQuestionIndex / questionsPerRound) + 1;

    fragenText.textContent =
      `Runde ${shownRound} von ${roundCount} | Frage ${questionInRound} von ${questionsPerRound}`;
  }

  if (resultText) {
    resultText.textContent = "";
  }

  if (nextBtn) {
    nextBtn.classList.add("hidden");
  }

  currentQuestion.answers.forEach((answer, index) => {
    const button = document.createElement("button");


    if (                                                              // Änderung der darstellung der fragen für die bilderfragen, weil die als objekt gespeichert werden
      window.location.pathname.includes("fragenBild.html") && answer && typeof answer === "object"
    ) {
      button.textContent = answer.displayName;
    } else {
      button.textContent = answer;
    }



    button.classList.add("buttonAnswers");

    attachButtonAudioHandlers(button);


    button.addEventListener("click", () => {
      stopTimer();
      isQuestionActive = false;

      const allButtons = Array.from(answersEl.children);
      const correctIndex = currentQuestion.correctAnswerIndex;

      if (index === correctIndex) {
        button.classList.add("correct");
        correctAnswers++;
        handlePowerupProgress(true);
        // if (resultText) {
        //   resultText.textContent = "Richtig!";
        // }
      } else {
        button.classList.add("wrong");
        wrongAnswers++;
        handlePowerupProgress(false);
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

      updateTimePowerupDisplay();

      if (nextBtn) {
        nextBtn.classList.remove("hidden");
        resetTimerMusic();
        //questionDone.play();
      }
    });

    answersEl.appendChild(button);
  });

  startTimer();
  playTimerMusicForCurrentQuestion();
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


    if (localStorage.getItem("musicMuted") == "false") {
      window.audio?.playMusic("lobbyBackground");
    }

  } else {
    if (logoAnimation && startAnimation && hauptmenue) {
      logoAnimation.addEventListener("loadedmetadata", () => {
        const targetDuration = 0; // gewünschte Dauer in Sekunden
        logoAnimation.playbackRate = logoAnimation.duration / targetDuration;
      });
      let introDone = false;

      const showStartMenu = () => {
        if (introDone) return;

        introDone = true;
        startAnimation.style.display = "none";
        hauptmenue.classList.remove("hidden");
        sessionStorage.setItem("animationPlayed", "true");

        if (localStorage.getItem("musicMuted") == "false") {
          window.audio?.playMusic("lobbyBackground");
        }
      };

      const speedUpIntro = () => {
        const targetDuration = 0; // gewünschte Dauer in Sekunden

        if (Number.isFinite(logoAnimation.duration) && logoAnimation.duration > 0) {
          logoAnimation.playbackRate = logoAnimation.duration / targetDuration;
        }
      };

      logoAnimation.addEventListener("loadedmetadata", speedUpIntro);
      logoAnimation.addEventListener("ended", showStartMenu);
      logoAnimation.addEventListener("error", showStartMenu);

      if (logoAnimation.readyState >= 1) {
        speedUpIntro();
      }

      if (logoAnimation.ended) {
        showStartMenu();
      }

      setTimeout(showStartMenu, 5000);
    }
  }
}

// Nächste Frage oder Quiz beenden
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    stopTimer();
    resetTimerMusic();
    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
      const gameMode = localStorage.getItem("gameMode") || "single";
      const questionsPerRound = Number(localStorage.getItem("questionCount")) || quizQuestions.length;

      if (
        gameMode === "single" &&
        currentQuestionIndex % questionsPerRound === 0
      ) {
        const nextRound = Math.floor(currentQuestionIndex / questionsPerRound) + 1;
        alert(`Runde ${nextRound} startet!`);
      }

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
        let currentRound = Number(localStorage.getItem("currentRound")) || 0;
        const roundCount = Number(localStorage.getItem("roundCount")) || 1;

        const oldP1Correct = Number(localStorage.getItem("p1Correct")) || 0;
        const oldP1Wrong = Number(localStorage.getItem("p1Wrong")) || 0;

        const oldP2Correct = Number(localStorage.getItem("p2Correct")) || 0;
        const oldP2Wrong = Number(localStorage.getItem("p2Wrong")) || 0;

        if (currentPlayer === "1") {
          localStorage.setItem("p1Correct", oldP1Correct + correctAnswers);
          localStorage.setItem("p1Wrong", oldP1Wrong + wrongAnswers);

          localStorage.setItem("currentPlayer", "2");

          alert(`${localStorage.getItem("player1Name") || "Player 1"} ist mit Runde ${currentRound + 1} fertig. Jetzt spielt ${localStorage.getItem("player2Name") || "Player 2"} dieselbe Runde.`);

          goToQuestionPage();

        } else {
          localStorage.setItem("p2Correct", oldP2Correct + correctAnswers);
          localStorage.setItem("p2Wrong", oldP2Wrong + wrongAnswers);

          currentRound++;

          if (currentRound < roundCount) {
            localStorage.setItem("currentRound", currentRound);
            localStorage.setItem("currentPlayer", "1");

            alert(`Runde ${currentRound + 1} startet. ${localStorage.getItem("player1Name") || "Player 1"} beginnt.`);

            goToQuestionPage();

          } else {
            const p1CorrectTotal = Number(localStorage.getItem("p1Correct")) || 0;
            const p1WrongTotal = Number(localStorage.getItem("p1Wrong")) || 0;
            const p2CorrectTotal = Number(localStorage.getItem("p2Correct")) || 0;
            const p2WrongTotal = Number(localStorage.getItem("p2Wrong")) || 0;

            const p1Total = p1CorrectTotal + p1WrongTotal;
            const p2Total = p2CorrectTotal + p2WrongTotal;

            const p1Percentage = p1Total > 0 ? Math.round((p1CorrectTotal / p1Total) * 100) : 0;
            const p2Percentage = p2Total > 0 ? Math.round((p2CorrectTotal / p2Total) * 100) : 0;

            localStorage.setItem("p1Percentage", p1Percentage);
            localStorage.setItem("p2Percentage", p2Percentage);

            window.location.href = "./multi-scoreboard.html";
          }
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
if (window.location.pathname.includes("fragen.html") || window.location.pathname.includes("fragenBild.html")) {
  currentQuestionIndex = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  updateTimePowerupDisplay();

  if (nextBtn) {
    nextBtn.classList.add("hidden");
  }

  loadQuestions();
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = QUESTION_TIME;
  isQuestionActive = true;

  if (timeValue) {
    timeValue.textContent = timeLeft;
  }

  updateTimePowerupDisplay();

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
  isQuestionActive = false;
  updateTimePowerupDisplay();
  handlePowerupProgress(false);

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
  const categoryEl = document.querySelector(".scoreboard-category");
  if (categoryEl) {
    categoryEl.textContent = "Kategorie: " + getCategoryLabel(localStorage.getItem("selectedCategory"));
  }

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
    categoryEl.textContent = "Kategorie: " + getCategoryLabel(selectedCategory);
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
      localStorage.setItem("currentRound", "0");

      localStorage.removeItem("roundQuestions");
      localStorage.removeItem("currentRound");
      localStorage.removeItem("p1Correct");
      localStorage.removeItem("p1Wrong");
      localStorage.removeItem("p1Percentage");
      localStorage.removeItem("p2Correct");
      localStorage.removeItem("p2Wrong");
      localStorage.removeItem("p2Percentage");
    }

    goToQuestionPage();
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
if (window.location.pathname.includes("multi-scoreboard.html")) {
  const player1Name = localStorage.getItem("player1Name") || "Player 1";
  const player2Name = localStorage.getItem("player2Name") || "Player 2";
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
}

console.log("current site: " + window.location.pathname)
