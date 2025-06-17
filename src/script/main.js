import * as THREE from "three";
import { loadMeshes } from "./meshLoader.js";

export async function main(windowTarget) {
    const window = document.getElementById(windowTarget);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x777777);

    const jsonData = await loadJson('./src/finalLogs/shapeLogs1.json');
    const { allGroup } = loadMeshes(jsonData, scene, 0.005);

    const timeJson = await loadJson('./src/finalLogs/timeLogs1.json');
    const timekeys = Object.keys(timeJson).sort();

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.clientWidth, window.clientHeight);
    window.appendChild(renderer.domElement);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const camera = new THREE.PerspectiveCamera(75, window.offsetWidth / window.offsetHeight, 0.01, 5000);
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);

    // 조명 추가
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    light.castShadow = true;
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040); // 부드러운 전체광
    scene.add(ambientLight);

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