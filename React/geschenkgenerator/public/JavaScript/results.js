function EnableResultView() {
    document.getElementById("kopflogo").style.display = "inline";
    if(document.getElementById("kopf")!=null) document.getElementById("kopf").remove();
}

function UpdateResults() {
    var allTags=GetAllTags();

    ShowElement("geschenk");
}
