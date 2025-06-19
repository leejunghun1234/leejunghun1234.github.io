import * as THREE from 'three';

export function clickEvent(renderer, camera, allGroup, scene) {
    const raycaster = new THREE.Raycaster();
    let selectedObject = undefined;
    const parentKeies = ["Common", "Geometry", "Layers", "Property", "Parameter", "comment"];

    window.addEventListener("mousedown", onMouseDown);

    function onMouseDown(event) {
        if (event.button === 0) {
            const rect = renderer.domElement.getBoundingClientRect();
            const mouse = new THREE.Vector2(
                ((event.clientX - rect.left) / rect.width) * 2 - 1,
                -((event.clientY - rect.top) / rect.height) * 2 + 1
            );
            const meshObjects = [];
            for (const group of allGroup) {
                if (!group) continue;
                group.traverse(child => {
                    if (child.isMesh) {
                        meshObjects.push(child);
                    }
                });
            }
            
            raycaster.setFromCamera(mouse, camera);
            let intersections = raycaster.intersectObjects(meshObjects, true);
            if (intersections.length > 0) {
                let intersectedObject = undefined;
                for (let is of intersections) {
                    if (is.object.parent.visible) {
                        intersectedObject = is.object.parent;
                        break;
                    }
                }

                if (selectedObject && selectedObject.userData.comment === "selected") {
                    selectedObject.userData.comment = null;
                    selectedObject.traverse((child => {
                        if (child.isMesh && child.material) {
                            child.material.emissive.setHex(0x000000);
                        }
                    }));
                }

                if (intersectedObject && selectedObject != intersectedObject) {
                    intersectedObject.traverse((child) => {
                        if (child.isMesh && child.material) {
                            child.material.emissive.setHex(0x555555);
                        }
                    });

                    selectedObject = intersectedObject;
                    selectedObject.userData.comment = "selected";

                    // 이거 바꿔야 해~

                    const meshInfo = intersectedObject.userData;
                    if (meshInfo) {
                        UpdateElementInfo(meshInfo);
                        for (const parentKey of parentKeies) {
                            const section = document.getElementById(`json-content-${parentKey}`)
                            console.log(section);
                        }
                    }
                } else {
                    selectedObject = null;
                    const elementTarget = document.getElementById("element-target");
                    elementTarget.innerHTML = `<h2 id="select-element">Select the Element in Scene!</h2>`
                }
            }
        }
    }
    
    function UpdateElementInfo(meshInfo) {
        const elementTarget = document.getElementById("element-target");
        elementTarget.innerHTML = generateHTMLFromJSON(meshInfo);

        for (const parentKey of parentKeies) {
            const button = document.getElementById(`category-button-${parentKey}`);
            const section = document.getElementById(`json-content-${parentKey}`);
            
            button.addEventListener("click", () => {
                section.classList.toggle("hide");
                button.textContent = section.classList.contains("hide") ? "▾" : "▴";
            })
        }
    }

    function generateHTMLFromJSON(json, parentKey = "", depth = 0) {
        let html = ``;
        console.log(depth);
        if (depth != 0) {
            if (parentKey === "Common" ||
                parentKey === "Geometry" ||
                parentKey === "Property" ||
                parentKey === "Layers" ||
                parentKey === "Parameter" ||
                parentKey === "comment"
            ) {
                html = `<div class = "json-section-${depth}" id="json-section-${depth}-${parentKey}">`;
            } else {
                html = `<div class="json-section-${depth}">`;
            }
        }

        if (parentKey && depth === 0) {
            html += `<div class="json-header">${parentKey.toUpperCase()}</div>`;
        } else if (parentKey) {
            html += `<div class="json-key-${depth}">${parentKey}</div>`;
            if (depth === 1) {
                html += `<button class = "category-button" id="category-button-${parentKey}">▾</button>`;
            }
        }
        if (depth === 1) {
            html += `<div class="json-content-${depth} hide" id="json-content-${parentKey}">`;

        } else {
            html += `<div class="json-content-${depth}">`;
        }

        if (typeof json === "object" && json !== null && !Array.isArray(json)) {
            for (const [key, value] of Object.entries(json)) {
                html += generateHTMLFromJSON(value, key, depth + 1);
            }
        } else if (Array.isArray(json)) {
            json.forEach((item, index) => {
                html += `<div class="json-array-index">ITEM ${index + 1}:</div>`;
                html += generateHTMLFromJSON(item, parentKey, depth + 1);
            });
        } else {
            html += `<div class="json-value">${json}</div>`;
        }
        
        html += `</div></div>`;
        return html;
    }
}