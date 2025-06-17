import * as THREE from "three";
import { loadMeshes } from "./meshLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js"; 
import { sliderControls } from "./slider.js";
import { initPartialClipping } from "./initPartial.js";

export async function main(windowTarget, slider, isPartial) {
    // Scene 설정정
    const window = document.getElementById(windowTarget);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#F5F5DC");

    // 조명 설정
    const lightConfigs = [
        [0, 3, 0],
        [0, 3, 5],
        [5, 3, 0],
        [-5, 3, 5],
        [5, 3, -5],
        [0, 3, -5],
        [-5, 3, 0],
    ];

    lightConfigs.forEach(pos => {
        const light = new THREE.DirectionalLight(0xffffff, 0.7);
        light.position.set(...pos);
        light.castShadow = true;
        light.shadow.bias = -0.0005;
        light.shadow.mapSize.width = 1024; // 그림자 품질 낮추면 퍼지게 보임
        light.shadow.mapSize.height = 1024;
        scene.add(light);
    });

    // 조명 설정2
    const ambientLight = new THREE.AmbientLight(0x000000); // 부드러운 전체광
    scene.add(ambientLight);

    // renderer 설정
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.clientWidth, window.clientHeight, false);
    window.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Camera 설정
    const camera = new THREE.PerspectiveCamera(75, window.offsetWidth / window.offsetHeight, 0.01, 5000);
    camera.position.set(4, 10, 4);
    camera.lookAt(0, 1, 0);

    // Resizer 설정하기기
    window.addEventListener("resize", () => {
        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    // Controler 설정정
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.minPolarAngle = -0;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);
    controls.update();

    // log 불러오기
    const jsonData = await loadJson('./src/finalLogs/shapeLogs1.json');
    const { allGroup, meshDict } = loadMeshes(jsonData, scene, 0.2);

    const timeJson = await loadJson('./src/finalLogs/timeLogs1.json');
    const timekeys = Object.keys(timeJson).sort();

    if (isPartial) {
        initPartialClipping(scene, meshDict, timeJson, timekeys, allGroup, renderer, camera, controls);
    }
    
    sliderControls(slider, timekeys, timeJson, allGroup, meshDict, isPartial);

    // animate 실행
    animate();

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
}

async function loadJson(jsonPath) {
    try {
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error("Failed to load Json");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error loading Json: ",);
    }
}

