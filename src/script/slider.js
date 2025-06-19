export function sliderControls(sliderName, timeKeys, timeJson, allGroup, meshDict, isPartial) {
    const slider = document.getElementById(sliderName);
    slider.max = timeKeys.length - 1;
    slider.value = timeKeys.length - 1;
    const currentTime = timeKeys[timeKeys.length - 1];
    let buttonState = {
        "Walls": false,
        "Curtain Walls": false,
        "Floors": false,
        "Ceilings": false,
        "Columns": false,
        "Structural Columns": false,
        "Stairs": false,
        "Railings": false,
        "Windows": false,
        "Doors": false,
    }

    updateMeshes(currentTime);
    if (!isPartial) {
        updateInfos(currentTime);
        makeCategoryList(buttonState);
    }

    slider.addEventListener('input', () => {
        const currentIndex = parseInt(slider.value, 10);
        const currentTime = timeKeys[currentIndex];
        updateMeshes(currentTime);
        if (!isPartial) {
            updateInfos(currentTime);
            makeCategoryList(buttonState);
        }
        if (isPartial) {
            const insideButton = document.getElementById("inside-button");
            
            if (!insideButton.classList.contains("Visible")) {
                insideButton.classList.add("Visible");
                insideButton.style.backgroundColor = "#4CAF50";
            } 
        }
    });

    function updateSlider(value) {
        slider.value = value;
        slider.dispatchEvent(new Event('input'));
    }

    function updateMeshes(currentTime) {
        for (const mm of allGroup) {
            mm.visible = false;
        }
        for (const timelog of timeJson[currentTime]["Elements"]) {
            const groups = meshDict[timelog];
            if (groups === undefined) continue;
            groups.visible = true;
        }
    }

    

    function updateInfos(currentTime) {
        const timeKeysLength = timeKeys.length - 1;
        const currentTimeLength = (slider.value / timeKeysLength) * 100;
        
        const quantity = Object.keys(timeJson[currentTime]["Quantity"]);
        const infoTarget = document.getElementById("info-target");
        infoTarget.innerHTML = "";
        
        for (const cat of quantity) {
            const catReplace = cat.replace(" ", "-");
            const quantityCat = Object.keys(timeJson[currentTime]["Quantity"][cat]);
            let categoryDiv = document.createElement("div");
            categoryDiv.classList.add("category-container");

            let catNameDiv = document.createElement("div");
            catNameDiv.classList.add("category-name-container");
            catNameDiv.innerHTML = `<div id = "category-title" class="category-title">${cat}</div>`;
            catNameDiv.innerHTML += `<button id = ${catReplace}-category-button class="category-button">▾</button>`; 

            categoryDiv.appendChild(catNameDiv);

            let list = document.createElement("ul");
            list.classList.add("category-list");

            list.id = `${catReplace}-list`;
            let importantInfo = document.createElement("div");
            for (const quantityCatQuan of quantityCat) {
                let value = timeJson[currentTime]["Quantity"][cat][quantityCatQuan];
                if (quantityCatQuan === "All Volume"
                    || quantityCatQuan === "All Length"
                    || quantityCatQuan === "Column Volume"
                    || quantityCatQuan === "Column Length"
                    || quantityCatQuan === "Stair Length"
                    || quantityCatQuan === "Railing Length"
                ) {
                    importantInfo.innerHTML += `<div> <span class="main-qunt">${quantityCatQuan}: </span> <span id = "value123" class = "main-value">${(value).toFixed(3)} </span> </div>`;
                } else if (quantityCatQuan === "All Numbers") {
                    importantInfo.innerHTML += `<div> <span class="main-qunt">${quantityCatQuan}: </span> <span id = "value123" class = "main-value">${value} </span> </div>`
                } else if (["Windows", "Doors"].includes(cat)) {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = `<span class="key123">${quantityCatQuan}: </span> <span id = "value123" class = "value123">${value} </span> `;
                    list.appendChild(listItem);
                } else {
                    let listItem = document.createElement("li");
                    listItem.innerHTML = `<span class="key123">${quantityCatQuan}: </span> <span id = "value123" class = "value123">${(value).toFixed(3)} </span> `;
                    list.appendChild(listItem);
                }
            }
            categoryDiv.appendChild(importantInfo);
            categoryDiv.appendChild(list);
            infoTarget.appendChild(categoryDiv);
            if (!buttonState[cat]) {
                list.classList.add("hide");
            } else {
                document.getElementById(`${catReplace}-category-button`).textContent = "▴";
                list.style.maxHeight = list.scrollHeight + "px";
                list.classList.remove("hide");
            }
        }
    }

    // slider update
    const sliderFully = document.getElementById("fully-slider");
    const sliderPartially = document.getElementById("partially-slider");
    
    
    function updateSliderBackground(slider) {
        const min = slider.min || 0;
        const max = slider.max || 100;
        const val = (slider.value - min) / (max - min) * 100;
        slider.style.background = `linear-gradient(to right, #263238 0%, #45a049 ${val}%, #ddd ${val}%, #ddd 100%)`;
    }
    sliderFully.addEventListener("input", () => updateSliderBackground(sliderFully));
    sliderPartially.addEventListener("input", () => updateSliderBackground(sliderPartially));
    
    updateSliderBackground(sliderFully);
    updateSliderBackground(sliderPartially);
}

function makeCategoryList(buttonState) {
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
        getButton[k].addEventListener("click", () => buttonClickEventHandler(k, getList));
    });
}