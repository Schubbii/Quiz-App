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
let jsonString;
let regions = ["Asia", "Europe", "Oceania", "Americas", "Africa"];

async function fetchCountries() {
    response = await fetch("https://restcountries.com/v3.1/all?fields=name,capital,borders,unMember,region,cca3");
    jsonString = await response.json();
    await output(jsonString);
    output("fetched Country Data")
}

fetchCountries();
let questions = ["Welches dieser Länder ist Teil der UN?",
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
    let countryIndex = Math.floor(Math.random() * 250);
    return jsonString[countryIndex];
}

function getQuestion() {
    let randomQuestion = Math.floor(Math.random() * 6);
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


    switch (randomQuestion) {
        case 0:

            questionString = questions[0];
            correctAnswerIndex = Math.floor(Math.random() * 3);
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

            questionString = questions[1];
            correctAnswerIndex = Math.floor(Math.random() * 3);
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
            questionString = questions[2].replace("{region}", selectedRegion);
            correctAnswerIndex = Math.floor(Math.random() * 3);

            while (answerArray.length < 4) {
                testCountry = rndCountry();
                if (answerArray.length == correctAnswerIndex) {
                    if (testCountry.region == selectedRegion) {
                        answerArray.push(testCountry.name.common);
                    }
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
            questionString = questions[3].replace("{region}", selectedRegion);
            correctAnswerIndex = Math.floor(Math.random() * 3);

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
                }
            }

            questionString = questions[4].replace("{land}", selectedCountry.name.common);

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



            correctAnswerIndex = Math.floor(Math.random() * 3);
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
                const country = jsonString.find(jsonString => jsonString.cca3 === a);
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
                }
            }

            questionString = questions[5].replace("{land}", selectedCountry.name.common);

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
            correctAnswerIndex = Math.floor(Math.random() * 3);
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
                const country = jsonString.find(jsonString => jsonString.cca3 === a);
                answerArray.push(country.name.common);
            })

            break;

        case 6: //Was ist die Hauptstadt von {land}
            selectedCountry = rndCountry();
            falseAnswers = [];



            questionString = questions[6].replace("{land}", selectedCountry.name.common);





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
            correctAnswerIndex = Math.floor(Math.random() * 3);
            
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


    output("questionObject: " + questionObject);

    return questionObject;

    
}


function hs() {
    output(Math.random() * 4);
    output(Math.random() * 4);
    output(Math.random() * 4);
    output(Math.random() * 4);
    output(Math.random() * 4);
    output(Math.random() * 4);
    output(Math.random() * 4);
    output(Math.random() * 4);
    output(Math.random() * 4);
    output(Math.random() * 4);
    output(Math.random() * 4);

    output(Math.floor(Math.random() * 4));
    output(Math.floor(Math.random() * 4));
    output(Math.floor(Math.random() * 4));
    output(Math.floor(Math.random() * 4));
    output(Math.floor(Math.random() * 4));
    output(Math.floor(Math.random() * 4));
    output(Math.floor(Math.random() * 4));
    output(Math.floor(Math.random() * 4));
    output(Math.floor(Math.random() * 4));
    output(Math.floor(Math.random() * 4));
    output(Math.floor(Math.random() * 4));


}