import * as THREE from "three";

import { loadMeshes } from "./meshLoader.js";

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

    const camera = new THREE.PerspectiveCamera(75, window.offsetWidth / window.offsetHeight, 0.01, 5000)

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
}