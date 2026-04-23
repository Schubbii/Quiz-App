let category = ""; // optionen in zahlen, müsste man unsere Kategorien in die passenden Zahlen umwandeln
let difficulty = ""; // "easy","medium","hard"
let type = "multiple";




let combinedURL;
function calculateURL (questionAmount, category, difficulty) {

    if (Boolean(category) == true) {
        category = "&category=" + category;
    } 
    if (Boolean(difficulty) == true) {
        difficulty = "&difficulty=" + difficulty;
    } 
    if (Boolean(type) == true) {
        type = "&type=" + type;
    } 

    combinedURL = "https://opentdb.com/api.php?amount=" + questionAmount + category + difficulty + type; 
}


async function fetchQuestions (questionAmount, category, difficulty) {
    calculateURL(questionAmount, category, difficulty);

    console.log(combinedURL);
    let response = await fetch(combinedURL);
    let jsonString = await response.json();
    await console.log(response);

    let question = [];

    let iteration = 0;
    const  interval = setInterval(() => {
        let newContent = undefined;

        
        console.log(jsonString);
        console.log(jsonString.results[iteration].question)
        
        

        iteration += 1;
        if (iteration == jsonString.results.length) clearInterval(interval);
    }, 1000);
    
}
