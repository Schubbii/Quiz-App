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


document.getElementById("btn1").addEventListener("click", testeTimer);



function timer(t, textID) {
    console.log("in Timer");

    let timerVar = setInterval(function() {
            document.getElementById(textID).innerHTML = t;
            if (t == 0) {           //Ende des Timers
              //window.location.href = "cutoffscreen.html"; //Hiermit wird die aktuelle Seite auf eine Neue geleitet, damit der Nutzer nix mehr eingeben kann (zeitabgelaufen)
              clearInterval(timerVar)  
            }
            t = t-1; 
            
        }, 1000);
}


function displayTimer(t) {
    console.log("in Timer");
    document.appendChild(<p id="cutOffTimer"> 10</p>)
    let timerVar = setInterval(function() {
            document.getElementById(cutOffTimer).innerHTML = t;
            if (t == 0) {           //Ende des Timers
              //window.location.href = "cutoffscreen.html"; //Hiermit wird die aktuelle Seite auf eine Neue geleitet, damit der Nutzer nix mehr eingeben kann (zeitabgelaufen)
              clearInterval(timerVar)  
            }
            t = t-1; 
            
        }, 1000);
}


function testeTimer() {
    console.log("Teste Timer")
    timer(10, "Testtext")

    
}