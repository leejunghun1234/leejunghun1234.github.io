import { Chart, LineController, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from "chart.js";
import { makeCategoryList } from "./categoryList.js";

Chart.register(
    LineElement,
    LineController,
    CategoryScale,  // X축 스케일
    LinearScale,    // Y축 스케일
    PointElement,   // 데이터 포인트
    Tooltip

);

// /**
//  * Initialize slider controls for time-based interaction.
//  *
//  * @param {Object} options - Configuration options for the slider controls.
//  * @param {HTMLElement} options.slider - The slider HTML element.
//  * @param {HTMLElement} options.display - The display element to show the current slider value.
//  * @param {HTMLElement} options.rewindButton - The rewind button element.
//  * @param {HTMLElement} options.pauseButton - The pause button element.
//  * @param {HTMLElement} options.playButton - The play button element.
//  * @param {HTMLElement} options.fastForwardButton - The fast-forward button element.
//  * @param {Function} options.allMesh - Callback to update meshes based on the current slider value.
//  * @param {Array} options.timeKeys - Array of time keys for slider positions.
//  */
export function initializeSliderControls({
    allGroup,
    meshDict,
    timeKeys,
    timeJson,
    chart1, myCanvas1,
    chart2, myCanvas2, 
    chart3, myCanvas3, 
    chart4, myCanvas4, 
    chart5, myCanvas5, 
    chart6, myCanvas6, 
    chart7, myCanvas7, 
    chart8, myCanvas8, 
    chart9, myCanvas9, 
    chart10, myCanvas10, 
}) {
    let sliderInterval = null;
    let playbackSpeed = 1;

    const slider = document.getElementById('slider-1');
    const display = document.getElementById('value-1');

    const rewindButton = document.getElementById('rewind');
    const pauseButton = document.getElementById('pause');
    const playButton = document.getElementById('play');
    const fastForwardButton = document.getElementById('fast-forward');
    
    const increaseButton = document.getElementById('increase-1');
    const decreaseButton = document.getElementById('decrease-1');
    
    const infoButton = document.getElementById('model-info');
    const infoPopup = document.getElementById('info-window');
    const infoTarget = document.getElementById('info-target');

    const arrows = document.querySelectorAll(".gapa");

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

    makeChartClickEvent(chart1, myCanvas1);
    makeChartClickEvent(chart2, myCanvas2);
    makeChartClickEvent(chart3, myCanvas3);
    makeChartClickEvent(chart4, myCanvas4);
    makeChartClickEvent(chart5, myCanvas5);
    makeChartClickEvent(chart6, myCanvas6);
    makeChartClickEvent(chart7, myCanvas7);
    makeChartClickEvent(chart8, myCanvas8);
    makeChartClickEvent(chart9, myCanvas9);
    makeChartClickEvent(chart10, myCanvas10);
    
    function makeChartClickEvent(chart, myCanvas) {
        myCanvas.addEventListener("click", function(event) {
            const points = chart.getElementsAtEventForMode(event, "index", { intersect: true}, true);
            if (points.length) {
                const firstPoint = points[0];
                const clickedLabel = chart.data.labels[firstPoint.index];
                const labelIndex = timeKeys.indexOf(clickedLabel);
                slider.value = labelIndex;

                const parts = clickedLabel.split("_");
                const formattedDate = `${String(parseInt(parts[2])).padStart(2, '0')}/${String(parseInt(parts[1])).padStart(2, '0')}/${parts[0]}\n`
                    + `${String(parseInt(parts[3])).padStart(2, '0')}:${String(parseInt(parts[4])).padStart(2, '0')}:${String(parseInt(parts[5])).padStart(2, '0')}`;
        

        
        
                display.textContent = `${formattedDate}`;
                updateMeshes(clickedLabel);
                updatesInfos(clickedLabel);
            }
        })
    }

    slider.max = timeKeys.length - 1;
    slider.value = 0;
    const currentTime = timeKeys[0];
    const parts = currentTime.split("_");
    const formattedDateKR = `${parts[0]}년 ${parseInt(parts[1])}월 ${parseInt(parts[2])}일\n`
                + `${parseInt(parts[3])}시 ${parseInt(parts[4])}분 ${parseInt(parts[5])}초`;
    const formattedDate = `${String(parseInt(parts[2])).padStart(2, '0')}/${String(parseInt(parts[1])).padStart(2, '0')}/${parts[0]}\n`
        + `${String(parseInt(parts[3])).padStart(2, '0')}:${String(parseInt(parts[4])).padStart(2, '0')}:${String(parseInt(parts[5])).padStart(2, '0')}`;

    display.textContent = formattedDate;

    updateMeshes(currentTime);
    updatesInfos(currentTime);
    makeCategoryList(buttonState);

    slider.addEventListener('input', () => {
        const currentIndex = parseInt(slider.value, 10);
        const currentTime = timeKeys[currentIndex];
        const parts = currentTime.split("_");
        const formattedDateKR = `${parts[0]}년 ${parseInt(parts[1])}월 ${parseInt(parts[2])}일\n`
                    + `${parseInt(parts[3])}시 ${parseInt(parts[4])}분 ${parseInt(parts[5])}초`;
        const formattedDate = `${String(parseInt(parts[2])).padStart(2, '0')}/${String(parseInt(parts[1])).padStart(2, '0')}/${parts[0]}\n`
            + `${String(parseInt(parts[3])).padStart(2, '0')}:${String(parseInt(parts[4])).padStart(2, '0')}:${String(parseInt(parts[5])).padStart(2, '0')}`;
        
        display.textContent = `${formattedDate}`;
        updateMeshes(currentTime);
        updatesInfos(currentTime);
        makeCategoryList(buttonState);
    });

    function updateSlider(value) {
        slider.value = value;
        slider.dispatchEvent(new Event('input'));
    }

    function playSlider() {
        clearInterval(sliderInterval);
        sliderInterval = setInterval(() => {
            let currentValue = parseInt(slider.value);
            if (currentValue < parseInt(slider.max)) {
                updateSlider(currentValue + playbackSpeed);
            } else {
                clearInterval(sliderInterval);
            }
        }, 100);
    }

    function rewindSlider() {
        clearInterval(sliderInterval);
        sliderInterval = setInterval(() => {
            let currentValue = parseInt(slider.value);
            if (currentValue > parseInt(slider.min)) {
                updateSlider(currentValue - playbackSpeed);
            } else {
                clearInterval(sliderInterval);
            }
        }, 100);
    }

    function pauseSlider() {
        clearInterval(sliderInterval);
    }

    function fastForwardSlider() {
        playbackSpeed = 2;
        playSlider();
    }

    increaseButton.addEventListener('click', () => {
        const step = 1;
        const max = parseInt(slider.max);

        let newValue = parseInt(slider.value) + step;
        if (newValue > max) {
            newValue = max
        }

        updateSlider(newValue);
    })

    decreaseButton.addEventListener('click', () => {
        const step = 1;
        const min = parseInt(slider.min);

        let newValue = parseInt(slider.value) - step;
        if (newValue < min) {
            newValue = min;
        }

        updateSlider(newValue);
    })

    const graphPopup = document.getElementById('graph-window');
    infoButton.addEventListener('click', () => {
        if (!infoPopup.classList.contains("expanded")) {
            if (graphPopup.classList.contains("expanded")) {
                graphPopup.style.right = "350px";
                graphPopup.style.transition = "all 0.9s ease";
            }
            infoPopup.classList.add("expanded");
            const currentIndex = parseInt(slider.value, 10);
            const currentTime = timeKeys[currentIndex];
            updatesInfos(currentTime);
        } else {
            infoPopup.classList.remove("expanded");
            if (graphPopup.classList.contains("expanded")) {
                graphPopup.style.right = "20px";
                graphPopup.style.transition = "all 0.9s ease";
            }
        }
    });

    function updateMeshes(currentTime) {
        for (const mm of allGroup) {
            mm.visible = false;
        }
        for (const timelog of timeJson[currentTime]["Elements"]) {
            const groups = meshDict[timelog];
            if (groups === undefined) continue;
            groups.visible = true;
            
            // for (const m of meshes) {
            //     m.visible = true;
            // }
        }
    }

    function updatesInfos(currentTime) {
        const timeKeysLength = timeKeys.length - 1;
        const currentTimeLength = (slider.value / timeKeysLength) * 100;
        arrows.forEach((arrow) => {
            arrow.style.left = `${currentTimeLength}%`;
        });

        const quantity = Object.keys(timeJson[currentTime]["Quantity"]);
        infoTarget.innerHTML = ""; // 기존 내용 초기화

        for (const cat of quantity) {
            const catReplace = cat.replace(" ", "-");

            const quantityCat = Object.keys(timeJson[currentTime]["Quantity"][cat]);
            let categoryDiv = document.createElement("div");
            categoryDiv.classList.add("category-container");

            let catNameDiv = document.createElement("div");
            catNameDiv.classList.add("category-name-container");
            catNameDiv.innerHTML = `<div id = "category-title" class="category-title">${cat}</div>`;
            catNameDiv.innerHTML += `<div id = ${catReplace}-category-button class="category-button">▾</div>`;

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
                    importantInfo.innerHTML += `<span class="key1234">${quantityCatQuan}: </span> <span id = "value123" class = "value123">${(value).toFixed(3)} </span> `;
                } else if (quantityCatQuan === "All Numbers") {
                    importantInfo.innerHTML += `<span class="key1234">${quantityCatQuan}: </span> <span id = "value123" class = "value123">${value} </span> `
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
                list.classList.remove("hide");
            }
        }
    }

    rewindButton.addEventListener('click', rewindSlider);
    pauseButton.addEventListener('click', pauseSlider);
    playButton.addEventListener('click', () => {
        playbackSpeed = 1;
        playSlider();
    });
    fastForwardButton.addEventListener('click', fastForwardSlider);

    const dateInput = document.getElementById("dateInput");
    const timeInput = document.getElementById("timeInput");
    
    const modal = document.getElementById("dateTimeModal");
    const cancelBtn = document.getElementById("cancel-button");
    const okayBtn = document.getElementById("okay-button");
    const body = document.body;
    const allInteractiveElements = document.querySelectorAll("button, input, select, textarea"); // 버튼, 입력창 등
    
    display.addEventListener('click', () => {
        const a = display.textContent;
        const b = a.split("\n");

        const dateMatch = b[0].split("/");
        const timeMatch = b[1].split(":");
        console.log(dateMatch);
        console.log(timeMatch);
    
        const day = dateMatch[0];
        const month = dateMatch[1].padStart(2, '0');
        const year = dateMatch[2].padStart(2, '0');
        const dateText = `${year}-${month}-${day}`;
    
          // 시간 변환 (HH:MM:SS)
        const hours = timeMatch[0].padStart(2, '0');
        const minutes = timeMatch[1].padStart(2, '0');
        const seconds = timeMatch[2].padStart(2, '0');
        const timeText = `${hours}:${minutes}:${seconds}`;
    
        dateInput.value = dateText;
        timeInput.value = timeText;
    })
    display.addEventListener('click', openModal);

    cancelBtn.addEventListener('click', () => {
        closeModal();
    });
    okayBtn.addEventListener('click', () => {
        closeModal();
        if (dateInput != undefined && timeInput != undefined){
            
            const okayDate = dateInput.value.replaceAll("-", "_");
            const okayTime = timeInput.value.replaceAll(":", "_");
            const okayDT = okayDate + "_" + okayTime;
            const closestTimestamp = findClosestTimestamp(okayDT, timeKeys);

            const labelIndex = timeKeys.indexOf(closestTimestamp);
            slider.value = labelIndex;
            const parts = closestTimestamp.split("_");
            const formattedDate = `${String(parseInt(parts[2])).padStart(2, '0')}/${String(parseInt(parts[1])).padStart(2, '0')}/${parts[0]}\n`
                + `${String(parseInt(parts[3])).padStart(2, '0')}:${String(parseInt(parts[4])).padStart(2, '0')}:${String(parseInt(parts[5])).padStart(2, '0')}`;

            display.textContent = `${formattedDate}`;
            updateMeshes(closestTimestamp);
            updatesInfos(closestTimestamp);
            makeCategoryList(true, buttonState);
        }
        
    });
    modal.addEventListener("mousedown", (event) => {
        if (event.target === modal) { // 모달 바깥 클릭 감지
            closeModal();
        }
    });
    
    function openModal() {
        modal.style.display = "flex";
        // body.classList.add("modal-active");
        body.style.overflow = "hidden";
        modal.style.opinterEvents = "auto";

        allInteractiveElements.forEach(el => {
            if (!modal.contains(el)) {
                el.classList.add('disable-interaction');
            }
        });
    }

    function closeModal() {
        modal.style.display = "none";
        body.style.overflow = "";

        allInteractiveElements.forEach(el => {
            el.classList.remove("disable-interaction");
        });
    }

    function parseTimestamp(timestamp) {
        const formatted = timestamp.replace(/_/g, "-"); // 2025-02-08-18-02-59
        console.log(formatted);
        const parts = formatted.split("-"); // 배열로 변환
    
        // Date 객체로 변환 (년, 월-1, 일, 시, 분, 초)
        return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
    }
    
    // ⏳ 기준 시간과 가장 가까운 타임스탬프 찾기
    function findClosestTimestamp(target, timestamps) {
        const targetDate = parseTimestamp(target);
        let closest = timestamps[0];
        let minDiff = Math.abs(parseTimestamp(closest) - targetDate);
    
        timestamps.forEach(timestamp => {
            const currentDate = parseTimestamp(timestamp);
            const diff = Math.abs(currentDate - targetDate);
            if (diff < minDiff) {
                closest = timestamp;
                minDiff = diff;
            }
        });
    
        return closest;
    }
}