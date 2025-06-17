import * as THREE from "three";
import { loadMeshes } from "./meshLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js"; 

export async function main(windowTarget) {
    // Scene 설정정
    const window = document.getElementById(windowTarget);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x777000);

    // 조명 설정
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    light.castShadow = true;
    scene.add(light);

    // 조명 설정2
    const ambientLight = new THREE.AmbientLight(0x404040); // 부드러운 전체광
    scene.add(ambientLight);

    // renderer 설정
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.clientWidth, window.clientHeight, false);
    window.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Camera 설정
    const camera = new THREE.PerspectiveCamera(75, window.offsetWidth / window.offsetHeight, 0.01, 5000);
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);

    const circle = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(circle, material);
    cube.position.set(0, 0.5, 0);
    scene.add(cube);
    
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
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);
    controls.update();

    // log 불러오기
    const jsonData = await loadJson('./src/finalLogs/shapeLogs1.json');
    const { allGroup } = loadMeshes(jsonData, scene, 0.005);

    const timeJson = await loadJson('./src/finalLogs/timeLogs1.json');
    const timekeys = Object.keys(timeJson).sort();

    


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