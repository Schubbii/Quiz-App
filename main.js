const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      contextIsolation: true,
    }
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