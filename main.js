import * as THREE from "three";
import { createCamera2 } from './src/camera_wasd.js';
import { createGround } from './src/ground.js';
import { createSky } from './src/sky.js';
import { loadMeshes } from './src/meshLoader.js';
import { addResizeListener } from './panel/resizeWindow.js';
import { initializeSliderControls } from './panel/sliderControls.js';
import { addLights } from "./src/light.js";
import { rightupbuttons } from './panel/rightup.js';
import { makeChart } from "./src/makeChart.js";

/**
 * Load JSON data from a given path.
 * @param {string} jsonPath - Path to the JSON file.
 * @returns {Promise<Object>} - The parsed JSON object.
 */
async function loadJson(jsonPath) {
    try {
        const response = await fetch(jsonPath); // Fetch the JSON file
        if (!response.ok) throw new Error('Failed to load JSON');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

async function loadCSV(csvPath) {
    const response = await fetch(csvPath);
    const text = await response.text();

    // 개행 문자로 줄 단위로 나누고, 각 줄을 쉼표 기준으로 분할
    const rows = text.trim().split("\n").map(row => row.split(",").map(cell => cell.trim()));

    return rows;
}


/**
 * Main function to initialize the 3D scene.
 */
export async function main() {
    const gameWindow = document.getElementById('render-target');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x777777);

    // Load meshes
    const jsonData = await loadJson('../finalLogs/shapeLogs1.json');
    const { meshDict, meshInfoDict, allMesh, allGroup } = loadMeshes(jsonData, scene, 0.005);
    
    // Load time data and initialize slider controls
    const timeJson = await loadJson('../finalLogs/timeLogs1.json');
    const timeKeys = Object.keys(timeJson).sort();

    // 하ㅏ압!
    const wallQInfo = await loadCSV("../finalLogs/Walls_test.csv");
    const ctwallQInfo = await loadCSV("../finallogs/Curtain Walls_test.csv");
    const floorQInfo = await loadCSV("../finallogs/Floors_test.csv");
    const ceilingQInfo = await loadCSV("../finallogs/Ceilings_test.csv");
    const columnQInfo = await loadCSV("../finallogs/Columns_test.csv");
    const stColumnQInfo = await loadCSV("../finallogs/Structural Columns_test.csv");
    const stairQInfo = await loadCSV("../finallogs/Stairs_test.csv");
    const railingQInfo = await loadCSV("../finallogs/Railings_test.csv");
    const windowQInfo = await loadCSV("../finallogs/Windows_test.csv");
    const doorQInfo = await loadCSV("../finallogs/Doors_test.csv");
    const a123 = document.getElementById("slider-1");
    const { chart1: chart1, myCanvas: myCanvas1 } = makeChart("Walls", timeKeys, wallQInfo, "graph-wall");
    const { chart1: chart2, myCanvas: myCanvas2 } = makeChart("Curtain Walls", timeKeys, ctwallQInfo, "graph-curtainWall");
    const { chart1: chart3, myCanvas: myCanvas3 } = makeChart("Floors", timeKeys, floorQInfo, "graph-floor");
    const { chart1: chart4, myCanvas: myCanvas4 } = makeChart("Ceilings", timeKeys, ceilingQInfo, "graph-ceiling");
    const { chart1: chart5, myCanvas: myCanvas5 } = makeChart("Columns", timeKeys, columnQInfo, "graph-column");
    const { chart1: chart6, myCanvas: myCanvas6 } = makeChart("Structural Columns", timeKeys, stColumnQInfo, "graph-structuralColumn");
    const { chart1: chart7, myCanvas: myCanvas7 } = makeChart("Stairs", timeKeys, stairQInfo, "graph-stair");
    const { chart1: chart8, myCanvas: myCanvas8 } = makeChart("Railings", timeKeys, railingQInfo, "graph-railing");
    const { chart1: chart9, myCanvas: myCanvas9 } = makeChart("Windows", timeKeys, windowQInfo, "graph-forwindow");
    const { chart1: chart10, myCanvas: myCanvas10 } = makeChart("Doors", timeKeys, doorQInfo, "graph-door");
    
    

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(gameWindow.clientWidth, gameWindow.clientHeight);
    gameWindow.appendChild(renderer.domElement);

    renderer.shadowMap.enabled = true; // Enable shadows
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use soft shadows

    // Initialize camera
    const { camera, updateCameraPosition } = createCamera2(gameWindow, scene, renderer, allGroup, meshInfoDict);

    // 우측 상단 event
    rightupbuttons(scene, camera, renderer);

    // 우측 버튼 click
    
    const graphContainer = document.getElementById('graph-window');
    const graphButton = document.getElementById('model-graph');
    const graphPopup = document.getElementById('graph-window');
    const infoButton = document.getElementById('model-info');
    const infoPopup = document.getElementById('info-window');

    

    graphButton.addEventListener('click', () => {
        let computedStyle = window.getComputedStyle(graphPopup);
        let currentRight = parseInt(computedStyle.right) || 20; // 초기 값 없으면 20px로 설정

        console.log("Computed right:", computedStyle.right);
        console.log("Current right:", currentRight);

        

        if (!graphPopup.classList.contains("expanded")) {
            if (infoPopup.classList.contains("expanded")) {
                graphPopup.style.right = "350px"; // 새로운 위치 설정
                graphPopup.classList.add("expanded");
            } else {
                graphPopup.style.right = "20px"; // 새로운 위치 설정
                graphPopup.classList.add("expanded");
            }
            
        } else {
            graphPopup.classList.remove("expanded");
        }
    });

    // add lights
    addLights(scene);

    // Add ground and sky
    createGround(scene);
    createSky(scene);

    initializeSliderControls({
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
    });


    const categoryButtons = [
        { id: "wall-select", category: "Walls" },
        { id: "curtainWall-select", category: "Curtain Walls" },
        { id: "floor-select", category: "Floors" },
        { id: "ceiling-select", category: "Ceilings" },
        { id: "column-select", category: "Columns" },
        { id: "structuralColumn-select", category: "Structural Columns" },
        { id: "stair-select", category: "Stairs" },
        { id: "railing-select", category: "Railings" },
        { id: "window-select", category: "Windows" },
        { id: "door-select", category: "Doors" }
    ];
    
    // 상태 저장 객체
    let visibilityState = {};
    
    // 버튼 이벤트 등록
    categoryButtons.forEach(({ id, category }) => {
        const button = document.getElementById(id);
        visibilityState[category] = { visible: true, objects: [] }; // 초기 상태 설정
    
        button.addEventListener("click", () => {
            toggleCategoryVisibility(button, category);
        });
    });
    
    // ✅ 공통 함수: 카테고리별 가시성 전환
    function toggleCategoryVisibility(button, category) {
        if (visibilityState[category].visible) {
            button.style.background = "black";
            visibilityState[category].objects = [];
    
            scene.traverse((object) => {
                if (object.visible && object instanceof THREE.Group) {
                    if (object.userData.Common.ElementCategory === category) {
                        object.visible = false;
                        visibilityState[category].objects.push(object);
                    }
                }
            });
    
            visibilityState[category].visible = false;
        } else {
            button.style.background = "#1e90ff";
            visibilityState[category].objects.forEach((obj) => {
                obj.visible = true;
            });
    
            visibilityState[category].visible = true;
            visibilityState[category].objects = [];
        }
    }
    
    const selectDone = document.getElementById("okay-select");
    selectDone.addEventListener("click", () => {
        categoryButtons.forEach(({ id, category }) => {
            const button = document.getElementById(id);
            button.style.background = "#1e90ff";
            visibilityState[category].objects.forEach((obj) => {
                obj.visible = true;
            });
            visibilityState[category].visible = true;
            visibilityState[category].object = [];
        });
    });

    
    function animate() {
        requestAnimationFrame(animate);
        updateCameraPosition();
        renderer.render(scene, camera);
        addResizeListener(gameWindow, camera, renderer);
    }

    animate();
}