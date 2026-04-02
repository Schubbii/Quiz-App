console.log("Hello, World!");
console.log("Hello, World!");

document.getElementById("btn1").addEventListener("click", testeTimer);



function timer(t, textID, funcName) {
    console.log("in Timer");

    let timerVar = setInterval(function() {
            document.getElementById(textID).innerHTML = t;
            if (t == 0) {
                clearInterval(timerVar)
                timerVar = 0    
                
                console.log(timerVar)
            }
            t = t-1; 
            
        }, 1000);
    
}


function testeTimer() {
    console.log("Teste Timer")
    timer(10, "Testtext")

    
}
