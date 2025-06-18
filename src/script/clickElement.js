import * as THREE from 'three';

export function clickEvent(renderer, allGroup) {
    const raycaster = new THREE.Raycaster();
    let selectedObject = undefined;

    function onMouseDown(event) {
        if (event.button === 0) {
            const rect = renderer.domElement.getBoundingClientRect();
            const mouse = new THREE.Vector2(
                ((event.clientX - rect.left) / rect.width) * 2 - 1,
                -((event.clientY - rect.top) / rect.height) * 2 + 1
            )

            raycaster.setFromCamera(mouse, camera);
            let intersections = raycaster.intersectObject(allGroup, true);
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

                    const meshInfo = meshInfoDict[intersectedObject.name];
                    if (meshInfo) {
                        updatePopupContent(meshInfo);
                    }
                } else {
                    selectedObject = null;
                }
            } else {
                if (selectedObject) {
                    selectedObject.traverse((child => {
                        if (child.isMesh && child.material) {
                            child.material.emissive.setHex(0x000000);
                        }
                    }));
                    selectedObject = null;
                }
            } 
        }
    }
}