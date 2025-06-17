import * as THREE from 'three';
import { MakeBox } from './boxHelper.js';
import { GetPlanes } from './clippingPlanes.js';
import { MakeClipping } from './clippingHandler.js';

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
}