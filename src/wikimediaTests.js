let WikiMediaObject;

let usedPersons = []
usedPersons = JSON.parse(sessionStorage.getItem("usedWikiPersons") || []);

document.getElementById("jsonFile").addEventListener("change", async (event) => {
    const inputFile = event.target.files[0];
    const fileText = await inputFile.text();
    WikiMediaObject = await JSON.parse(fileText);
});

async function fetchWikimedia(pageTitle) {
    const pageData = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + pageTitle);
    const pageJson = await pageData.json();
    const imageURL = await pageJson.thumbnail.source;
    await console.log(pageJson.thumbnail.source);
    document.getElementById("wikiemediaQuestionImage").src = await pageJson.thumbnail.source;
}

function output(input) {
    console.log(input);
}

function buttonPressed() {
    const typething = "actor";

    output("sessionStorage.getItem('usedWikiPersons').length: " + JSON.parse(sessionStorage.getItem("usedWikiPersons")).length);
    output("sessionStorage.getItem('usedWikiPersons'): " + JSON.parse(sessionStorage.getItem("usedWikiPersons")));

    output("WikiMediaObject.filter(obj => obj.type === typething).length: " + WikiMediaObject.filter(obj => obj.type === typething).length);
    output("WikiMediaObject.filter(obj => obj.type === typething): " + WikiMediaObject.filter(obj => obj.type === typething));

    if (JSON.parse(sessionStorage.getItem("usedWikiPersons")).length >= WikiMediaObject.filter(obj => obj.type === typething).length) {
        clearPersons();
    }

    let correctPerson = generatePerson(typething);
    while (usedPersons.includes(correctPerson.displayName)) {
        correctPerson = generatePerson(typething);
        output("already used");
    }

    document.getElementById("correctAnswer").innerText = "test";
    document.getElementById("falseAnswers").innerText = "test";

    usedPersons.push(correctPerson.displayName);

    console.log("used persons: " + usedPersons);


    sessionStorage.setItem("usedWikiPersons", JSON.stringify(usedPersons));
    fetchWikimedia(correctPerson.wikiLink);

    let falsePersons;
    falsePersons = generateFalsePersons(correctPerson);
    let answerPacket = generateAAAI(correctPerson, falsePersons);
    console.log(answerPacket);
    let questionString = "Was ist der Name der auf dem Bild dargestellten Person?"

    for (let i = 0; i < answerPacket[1].length; i++) {
        if (i == answerPacket[0]) {
            document.getElementById("correctAnswer").innerText = answerPacket[1][i].displayName;
        } else {
            document.getElementById("falseAnswers").innerText = document.getElementById("falseAnswers").innerText + ", " + answerPacket[1][i].displayName;
        }
    }



    let questionObject = [];
    questionObject.push({
        question: questionString,
        answers: answerPacket[1],
        correctAnswerIndex: answerPacket[0]
    })

    return questionObject;
}

function generatePerson(type) {

    // Questionstypes:
    // 0: Male Musician
    // 1: Female Musician
    // 2: Male Actor
    // 3: Female Actor

    let questionType = Math.floor(Math.random() * 4);
    let testPerson;

    testPerson = WikiMediaObject[Math.floor(Math.random() * WikiMediaObject.length)];

    if (type == "musician") {
        while (questionType > 1) {
            questionType = Math.floor(Math.random() * 4);
        }
    } else if (type == "actor") {
        while (questionType < 2) {
            questionType = Math.floor(Math.random() * 4);
        }
    }

    switch (questionType) {
        case 0:
            while ((testPerson.gender != "male") || (testPerson.type != "musician")) {
                testPerson = WikiMediaObject[Math.floor(Math.random() * WikiMediaObject.length)]
            }
            break;

        case 1:
            while ((testPerson.gender != "female") || (testPerson.type != "musician")) {
                testPerson = WikiMediaObject[Math.floor(Math.random() * WikiMediaObject.length)]
            }
            break;

        case 2:
            while ((testPerson.gender != "male") || (testPerson.type != "actor")) {
                testPerson = WikiMediaObject[Math.floor(Math.random() * WikiMediaObject.length)]
            }
            break;

        case 3:
            while ((testPerson.gender != "female") || (testPerson.type != "actor")) {
                testPerson = WikiMediaObject[Math.floor(Math.random() * WikiMediaObject.length)]
            }
            break;
        default:
            console.log("error: you should never see this");
    }
    return testPerson;

}



function generateFalsePersons(inputPerson) {
    let falsePersons = [];
    let testPerson = WikiMediaObject[Math.floor(Math.random() * WikiMediaObject.length)];

    while (falsePersons.length < 3) {
        if ((testPerson.gender != inputPerson.gender) || (testPerson.type != inputPerson.type) || (falsePersons.includes(testPerson))) {
            testPerson = WikiMediaObject[Math.floor(Math.random() * WikiMediaObject.length)];
        } else if ((testPerson.gender == inputPerson.gender) && (testPerson.type == inputPerson.type)) {
            falsePersons.push(testPerson);
        }
    }

    return falsePersons;
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