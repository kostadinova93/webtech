

function ShowFilter() {
  //  AddTag("Testparnet", "Testgeschenk");
    document.getElementById("suchfeld").style.borderBottom = "1px dotted";
    ShowElement("filterbox");
    EnableResultView();
}

function HideFilter() {
    HideElement("filterbox");
}

function OpenSubFilter(name) {
    var doc = document.getElementById("filter_2nd");
    RemoveClassFromChild(doc, "shown");
    RemoveClassFromEverywhere("filterEntrySelected");
    document.getElementById("f2_" + name).classList.add("shown");
    document.getElementById("f1_" + name).classList.add("filterEntrySelected");
}


function RemoveClassFromChild(parent, classname) {
    for (var i = 0; i < parent.childNodes.length; i++) {
        if (parent.childNodes[i].classList != null && parent.childNodes[i].classList.contains(classname)) {
            parent.childNodes[i].classList.remove(classname);
            break;
        }
    }
}

function RemoveClassFromEverywhere(classname) {
    var elems = document.querySelectorAll("." + classname);

    [].forEach.call(elems, function(el) {
        el.classList.remove(classname);
    });
}

function AddFilter(category, tagname) {
    AddTag(category, tagname);
    HideFilter();
}


function GetAllTags() {
    var tagElements=document.getElementsByClassName("tagchip");
    if(tagElements==null) return [];
    var arr=Array.from(tagElements);
    var ret=arr.map(x=>({category: x.getAttribute("category"), name: x.getAttribute("tagname")}));
    return ret;
}


function AddTag(category, tagname) {
    if(GetAllTags().find(x=>x.name==tagname)!=null) return;

    var tagDiv = document.createElement("div");
    tagDiv.classList.add("tagchip");
    tagDiv.setAttribute("tagname", tagname);
    tagDiv.setAttribute("category", category);

    var nameDiv=document.createElement("div");
    nameDiv.innerHTML=tagname+" ";
    nameDiv.classList.add("tagname");
    
    var nameClose=document.createElement("div");
    nameClose.classList.add("tagclose");
    nameClose.innerText="X";
    nameClose.setAttribute("onclick", "RemoveTag(this.parentNode);")

    tagDiv.appendChild(nameDiv);
    tagDiv.appendChild(nameClose);
    var suchbox = document.getElementById("suchbox");
    suchbox.insertBefore(tagDiv, suchbox.firstChild);
    UpdateResults();
}


function RemoveTag(tagchip) {
    tagchip.remove(); 
    HideFilter();
    if(GetAllTags().length==0) {
        location.reload(); 
    } else {
        UpdateResults();
    }

}


document.addEventListener("DOMContentLoaded", function(event) {

   
})