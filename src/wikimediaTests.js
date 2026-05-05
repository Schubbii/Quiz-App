async function fetchWikimedia() {
    const pageData = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/Freddie_Mercury");
    const pageJson = await pageData.json();
    const imageURL = await pageJson.thumbnail.source;
    await console.log(pageJson.thumbnail.source);
    
    document.getElementById("wikiemediaQuestionImage").src = await pageJson.thumbnail.source;
}

