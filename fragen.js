function timer(t) {
    console.log("in Timer");

    let timerVar = setInterval(function() {
        t = t-1;
        if (t < 0) {           //Ende des Timers
              console.log("TIMER FERTISCH")
              triggerPopUp();
              clearInterval(timerVar)  
            } else {
                document.getElementById("timeValue").innerHTML = t;
            }
        }, 1000);
}

function triggerPopUp () {
    document.getElementById("answerButtons").style.display = "none";
    if (true == true) {                                                                 //Hier Variable zum Wahrheitswert der Auswahl einfügen
        document.getElementById("answerText").innerText = "Deine Antwort war richtig";
    }
    if (true == false) {                                                                //Hier Variable zum Wahrheitswert der Auswahl einfügen
        document.getElementById("answerText").innerText = "Deine Antwort war falsch";
    }
    if (true == undefined) {                                                            //Hier Variable zum Wahrheitswert der Auswahl einfügen
        document.getElementById("answerText").innerText = "Keine Antwort ausgewählt";
    }
    
    document.getElementById("popUp").style.display = "flex";

}


function testeTimer() {
    console.log("Teste Timer")
    timer(10, "Testtext")
}

timer(15)
