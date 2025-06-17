import * as THREE from "three";
import { loadMeshes } from "./meshLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js"; 
import { sliderControls } from "./slider.js";
import { GetPlanes } from "./GetPlane.js";

export async function main(windowTarget, slider, isPartial) {
    // Scene 설정정
    const window = document.getElementById(windowTarget);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#F5F5DC");

    // 조명 설정
    const lightConfigs = [
        [0, 10, 0],
        [0, 10, 5],
        [5, 10, 0],
        [-5, 10, 5],
        [5, 10, -5],
        [0, 10, -5],
        [-5, 10, 0],
    ];

    lightConfigs.forEach(pos => {
        const light = new THREE.DirectionalLight(0xffffff, 0.7);
        light.position.set(...pos);
        light.castShadow = true;
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
    renderer.shadowMap.enabled = true;
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

    let planes;
    let inversePlanes;
    let cons;
    let helpers;
    

    if (isPartial) {
        // 가장 최신 객체가 들어있는 객체 array: latestElem!
        const latestTime = timekeys[timekeys.length - 1];
        const latestElem = [];
        for (const elemid of timeData[latestTime]["Elements"]) {
            const groups = meshDict[elemid];
            groups.visible = true;
            latestElem.push(groups.clone());
        }

        const box = MakeBox(scene);
        ({ planes, inversePlanes, cons, helpers } = GetPlanes(box, scene));

        let draggingCone = null;
        let dragStartPoint = new THREE.Vector3();
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        window.addEventListener('mousedown', planeMouseDown);
        window.addEventListener('mousemove', planeMouseMove);
        window.addEventListener('mouseup', planeMouseUp);

        function planeMouseDown(event) {
            const intersects = GetIntersects(event);
            if (intersects.length > 0) {
                const clickedObject = intersects[0].object;
                if (clickedObject.Data) {
                    controls.enabled = false;
                    
                    draggingCone = clickedObject;
                    draggingCone.material.color.set(0xff0000);
                    draggingCone.material.emissiveIntensity = 1.5;
                    dragStartPoint.copy(intersects[0].point);
                }
            }
        }

        function planeMouseMove(event) {
            if (!draggingCone) return;

            const intersects = GetIntersects(event);
            if (intersects.length > 0) {
                const currentPoint = intersects[0].point;
                const plane = draggingCone.Data;
                const inversePlane = draggingCone.Data2;
                const normal = plane.normal.clone();

                const dragVector = currentPoint.clone().sub(dragStartPoint);
                const projectedDistance = dragVector.dot(normal);

                plane.constant -= projectedDistance;
                inversePlane.constant += projectedDistance;
                const newPosition = normal.clone().multiplyScalar(-plane.constant);
                draggingCone.position.copy(newPosition).add(normal.clone().multiplyScalar(0.1));
                dragStartPoint.copy(currentPoint);
            }
        }

        function planeMouseUp(event) {
            if (draggingCone) {
                controls.enabled = true;
                draggingCone.material.color.set(0x00ff00);
                draggingCone.material.emissiveIntensity = 1;
            }
            draggingCone = null;
        }

        function GetIntersects(event) {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
            raycaster.setFromCamera(mouse, camera);
            return raycaster.intersectObjects(cons, true);  // scene 내 모든 객체 검사
        }

        renderer.localClippingEnabled = true;
        // makeClippingForLatestElem(realLatestElem, planes, inversePlanes, false); 
    }
    
    sliderControls(slider, timekeys, timeJson, allGroup, meshDict);

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

function MakeBox(scene) {
    const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
    const boxMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.4,
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.castShadow = true;
    box.receiveShadow = false;
    
    const edges = new THREE.EdgesGeometry(boxGeometry);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // 흰색 테두리
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial);

    // ✅ 박스와 윤곽선을 함께 추가
    const boxGroup = new THREE.Group();
    boxGroup.add(box);
    boxGroup.add(edgeLines);

    // scene.add(boxGroup);
    return boxGroup;
}