let WikiMediaObject;

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

function buttonPressed()    {
     fetchWikimedia("Freddie_Mercury");
}


function setWikimediaObject() {
    
}