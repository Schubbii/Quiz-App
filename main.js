const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      contextIsolation: true,
    },
  });

  win.loadFile("src/index.html");

  win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

document.getElementById("btn1").addEventListener("click", testeTimer);

function timer(t, textID, funcName) {
  console.log("in Timer");

  let timerVar = setInterval(function () {
    document.getElementById(textID).innerHTML = t;
    if (t == 0) {
      clearInterval(timerVar);
    }
    t = t - 1;
  }, 1000);
}

function testeTimer() {
  console.log("Teste Timer");
  timer(10, "Testtext");
}

import DBHandler from "./quizzesHandler.js";

const db = new DBHandler("./data/quizzes.json");

async function test() {
  try {
    const neueFrage = await db.addQuestion({
      frage: "Wie viele Kontinente gibt es?",
      antworten: ["5", "6", "7", "8"],
      richtigeAntwort: "7",
      kategorie: "Geographie",
      schwierigkeit: "einfach",
    });

    console.log("Neu gespeichert:", neueFrage);

    const alleFragen = await db.getAllQuestions();
    console.log("Alle Fragen:", alleFragen);

    const updated = await db.updateQuestion(neueFrage.id, {
      frage: "Wie viele Kontinente gibt es auf der Erde?",
    });
    console.log("Aktualisiert:", updated);

    console.log("Alle Fragen nach Update:", await db.getAllQuestions());

  } catch (error) {
    console.error(error.message);
  }
}

test();
