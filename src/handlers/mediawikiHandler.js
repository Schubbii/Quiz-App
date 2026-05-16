const filePath = "C:/Users/Vincent Rothweiler/Documents/GitHub/Quiz-App/src/database/mediawikiLinks.json";

let inputDisplayName;
let inputWikiLink;
let inputGender;
let inputType;

let data = [];
const storageName = "wikimediaData"

function loadData() {
    data = JSON.parse(localStorage.getItem(storageName)) || [];
} 


function setupData () {
    localStorage.setItem(storageName, "[]");
    data = []
}
function showData () {
    document.getElementById("dataPlaceholder").textContent = JSON.stringify(data, null, 2);
}


function pushData () {
    inputDisplayName = document.getElementById("displayName").value;
    inputWikiLink = document.getElementById("wikiLink").value;
    inputGender = document.querySelector("input[name=gender]:checked").value;
    inputType = document.querySelector("input[name=type]:checked").value;

    console.log(inputDisplayName, inputWikiLink, inputGender, inputType);

    const newEntry = {
        displayName: inputDisplayName,
        wikiLink: inputWikiLink,
        gender: inputGender,
        type: inputType
    }

    data.push(newEntry);


    localStorage.setItem(storageName, JSON.stringify(data));    
}





function clearData () {
    localStorage.setItem(storageName, "[]")
    data = []
}

function copyData() {
    document.getElementById("copyButton").addEventListener("click", async () => {
  const json = JSON.stringify(data, null, 2);
  await navigator.clipboard.writeText(json);
  alert("JSON copied to clipboard");
});
}

document.getElementById("jsonFile").addEventListener("change", async (event) => {
    const inputFile = event.target.files[0];
    const fileText = await inputFile.text();
    data = await JSON.parse(fileText);

    console.log(data);
});