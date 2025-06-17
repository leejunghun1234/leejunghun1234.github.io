import * as THREE from 'three';
import { GetPlanes } from './GetPlane.js';
import { MakeClipping } from './MakeClipping.js';

export function initPartialClipping(
    scene, 
    meshDict, 
    timeJson, 
    timekeys, 
    allGroup, 
    renderer, 
    camera, 
    controls) {
    const latestTime = timekeys[timekeys.length - 1];
    const latestElem = [];

    for (const elemid of timeJson[latestTime]["Elements"]) {
        const groups = meshDict[elemid];
        groups.visible = true;

        const copied = groups.clone(true);
        copied.traverse(child => {
            if (child.isMesh || child.isLine) {
                if (child.material && child.material.isMaterial) {
                    child.material = child.material.clone();
                }
            }
        });

        copied.visible = true;
        scene.add(copied);
        latestElem.push(copied);
    }

    const box = MakeBox(scene);
    const { planes, inversePlanes, cons, helpers } = GetPlanes(box, scene);
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
        return raycaster.intersectObjects(cons, true);
    }

    renderer.localClippingEnabled = true;
    MakeClipping(latestElem, allGroup, planes, inversePlanes, true);

    const insideButton = document.getElementById("inside-button");
    const outsideButton = document.getElementById("outside-button");
    const planeButton = document.getElementById("plane-button");
    const slider = document.getElementById("partially-slider");
    
    let insideVisible = false;
    let outsideVisible = true;
    
    insideButton.addEventListener("click", () => {
        insideButton.classList.toggle("Visible");
        if (insideButton.classList.contains("Visible")) {
            insideButton.style.backgroundColor = "#4CAF50";
            const currentIndex = parseInt(slider.value, 10);
            const currentTime = timekeys[currentIndex];
            updateMeshes(currentTime);
        } else {
            insideButton.style.backgroundColor = "#263238";
            for (const group of allGroup) {
                group.visible = false;
            }
        }
        insideVisible = !insideVisible;  // 상태 반전
    });

    outsideButton.addEventListener("click", () => {
        outsideVisible = !outsideVisible;
        for (const group of latestElem) {
            group.visible = outsideVisible;
        }

        if (outsideVisible) {
            outsideButton.style.backgroundColor = "#4CAF50";
        } else {
            outsideButton.style.backgroundColor = "#263238";
        }
        
    });

    planeButton.addEventListener("click", () => {
        planeButton.classList.toggle("Visible");
        if (planeButton.classList.contains("Visible")) {
            planeButton.style.backgroundColor = "#263238";
            for (const helper of helpers) {
                helper.visible = false;
            }
            for (const con of cons) {
                con.visible = false;
            }
        } else {
            planeButton.style.backgroundColor = "#4CAF50";
            for (const helper of helpers) {
                helper.visible = true;
            }
            for (const con of cons) {
                con.visible = true;
            }
        }
    })

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
}



function MakeBox(scene) {
    const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
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