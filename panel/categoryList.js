export function makeCategoryList(buttonState) {
    let getButton = {
        "Walls": document.getElementById("Walls-category-button"),
        "Curtain Walls": document.getElementById("Curtain-Walls-category-button"),
        "Floors": document.getElementById("Floors-category-button"),
        "Ceilings": document.getElementById("Ceilings-category-button"),
        "Columns": document.getElementById("Columns-category-button"),
        "Structural Columns": document.getElementById("Structural-Columns-category-button"),
        "Stairs": document.getElementById("Stairs-category-button"),
        "Railings": document.getElementById("Railings-category-button"),
        "Windows": document.getElementById("Windows-category-button"),
        "Doors": document.getElementById("Doors-category-button"),
    }
    let getList = {
        "Walls": document.getElementById("Walls-list"),
        "Curtain Walls": document.getElementById("Curtain-Walls-list"),
        "Floors": document.getElementById("Floors-list"),
        "Ceilings": document.getElementById("Ceilings-list"),
        "Columns": document.getElementById("Columns-list"),
        "Structural Columns": document.getElementById("Structural-Columns-list"),
        "Stairs": document.getElementById("Stairs-list"),
        "Railings": document.getElementById("Railings-list"),
        "Windows": document.getElementById("Windows-list"),
        "Doors": document.getElementById("Doors-list"),
    }
    
    function buttonClickEventHandler(cat, getList) {
        console.log("하이");
        const catReplace = cat.replace(' ', "-");
        console.log("안녕");
        if (!buttonState[cat]) {
            getList[cat].classList.remove("hide");
            buttonState[cat] = true;
            getButton[cat].textContent = "▴";
        } else {
            getList[cat].classList.add("hide");
            buttonState[cat] = false;
            getButton[cat].textContent = "▾";
        }
    }

    Object.keys(getButton).forEach(k => {
        console.log("하이");
        console.log(getButton[k]);
        getButton[k].addEventListener("click", () => buttonClickEventHandler(k, getList));
    });
}


