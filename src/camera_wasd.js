import * as THREE from 'three';
import { TransformControls  } from 'three/addons/controls/TransformControls.js';

export function createCamera2(gameWindow, scene, renderer, allGroup, meshInfoDict) {
    const sliderContainer = document.getElementById('slider-container');
    const controlButtons = document.getElementById('control-buttons');
    const graphPopup = document.getElementById('graph-window');
    const infoPopup = document.getElementById('info-window');
    const elemPopup = document.getElementById('mesh-info-popup');
    const modal = document.getElementById("dateTimeModal");
    console.log(controlButtons);
    let isMouseInsideSliderContainer = false;
    sliderContainer.addEventListener('mouseenter', () => {
        isMouseInsideSliderContainer = true;
    })
    sliderContainer.addEventListener('mouseleave', () => {
        isMouseInsideSliderContainer = false;
    });
    controlButtons.addEventListener("mouseenter", () => {
        isMouseInsideSliderContainer = true;
    });
    controlButtons.addEventListener("mouseleave", () => {
        isMouseInsideSliderContainer = false;
    });
    graphPopup.addEventListener("mouseenter", () => {
        isMouseInsideSliderContainer = true;
    });
    graphPopup.addEventListener("mouseleave", () => {
        isMouseInsideSliderContainer = false;
    });
    infoPopup.addEventListener("mouseenter", () => {
        isMouseInsideSliderContainer = true;
    });
    infoPopup.addEventListener("mouseleave", () => {
        isMouseInsideSliderContainer = false;
    });
    elemPopup.addEventListener("mouseenter", () => {
        isMouseInsideSliderContainer = true;
    });
    elemPopup.addEventListener("mouseleave", () => {
        isMouseInsideSliderContainer = false;
    });
    modal.addEventListener("mouseenter", () => {
        isMouseInsideSliderContainer = true;
    });
    modal.addEventListener("mouseleave", () => {
        isMouseInsideSliderContainer = false;
    });
    

    const DEG2RAD = Math.PI / 180;
    const camera = new THREE.PerspectiveCamera(75, gameWindow.offsetWidth / gameWindow.offsetHeight, 0.01, 5000);
    
    // click event 만들기
    const raycaster = new THREE.Raycaster();
    let selectedObject = undefined;
    const popup = document.getElementById("mesh-info-popup");

    camera.position.set(-2, 0, 0); // 앞에서 바라보는 위치로 조정
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0); 
    
    camera.lookAtPoint = new THREE.Vector3(0, 0, 0);

    const movement = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        space: false,
        ctrl: false,
        G: false
    };

    const baseSpeed = 0.02; // 기본 이동 속도
    let moveSpeed = baseSpeed; // 현재 이동 속도
    const moveVector = new THREE.Vector3(); // 카메라 이동 벡터
    const direction = new THREE.Vector3(); // 카메라 방향 계산용

    let isLeftMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    let cameraAzimuth = 90; // 방위각 (좌우)
    let cameraElevation = 0; // 고도 (상하)
    const rotationSensitivity = 0.3;
    
    let check = 1;
    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', () => {
        camera.position.set(-2, 0, 1);
        camera.up.set(0, 0, 1);
        camera.lookAt(0, 0, 1);
        camera.lookAtPoint = new THREE.Vector3(0, 0, 0);

        prevMouseX = 0;
        prevMouseY = 0;
        cameraAzimuth = 90; 
        cameraElevation = 0;
    });

    function updateCameraRotation(deltaX, deltaY) {
        cameraAzimuth += deltaX * rotationSensitivity; // 좌우 회전
        cameraElevation -= deltaY * rotationSensitivity; // 상하 회전
    
        // 고도각(Elevation)은 -90도에서 90도 사이로 제한
        cameraElevation = Math.max(-89.9, Math.min(89.9, cameraElevation));
    
        // 방위각(Azimuth)과 고도각(Elevation)을 라디안으로 변환
        const azimuthRad = THREE.MathUtils.degToRad(cameraAzimuth);
        const elevationRad = THREE.MathUtils.degToRad(cameraElevation);
    
        // LookAtPoint와 카메라 위치 사이의 거리 유지
        const distanceVector = new THREE.Vector3()
            .subVectors(camera.lookAtPoint, camera.position);
        const radius = distanceVector.length(); // LookAt 점과 카메라 간 거리
    
        // 새 방향 계산 (구 좌표계 사용)
        const newLookAtOffset = new THREE.Vector3(
            radius * Math.cos(elevationRad) * Math.sin(azimuthRad), // X 좌표
            radius * Math.cos(elevationRad) * Math.cos(azimuthRad), // Y 좌표
            radius * Math.sin(elevationRad) // Z 좌표
        );
    
        // 새로운 LookAt 점 계산
        camera.lookAtPoint.copy(camera.position.clone().add(newLookAtOffset));
    
        // 카메라의 LookAt 업데이트
        camera.lookAt(camera.lookAtPoint);
    }

    const infoButton = document.getElementById('model-info');

    infoButton.addEventListener('click', () => {
        if (selectedObject) {
            selectedObject.userData.comment = null;
            selectedObject.traverse((child => {
                if (child.isMesh && child.material) {
                    child.material.emissive.setHex(0x000000);
                }
            }));
            selectedObject = null;
            popup.classList.remove("expanded");
        }
    });

    const graphButton = document.getElementById('model-graph');

    graphButton.addEventListener('click', () => {
        if (selectedObject) {
            selectedObject.userData.comment = null;
            selectedObject.traverse((child => {
                if (child.isMesh && child.material) {
                    child.material.emissive.setHex(0x000000);
                }
            }));
            selectedObject = null;
            popup.classList.remove("expanded");
        }
    })

    function onMouseDown(event) {
        if (event.button === 0) {
            if (event.shiftKey) {
                if (infoPopup.classList.contains("expanded")) {
                    infoPopup.classList.remove("expanded");
                }
                if (graphPopup.classList.contains("expanded")) {
                    graphPopup.classList.remove("expanded");
                }
                
                const rect = renderer.domElement.getBoundingClientRect();
                const mouse = new THREE.Vector2(
                    ((event.clientX - rect.left) / rect.width) * 2 - 1,
                    -((event.clientY - rect.top) / rect.height) * 2 + 1
                );

                raycaster.setFromCamera(mouse, camera);
                let intersections = raycaster.intersectObjects(allGroup, true);
                if (intersections.length > 0) {
                    let intersectedObject = undefined;
                    for (let is of intersections) {
                        if (is.object.parent.visible) {
                            intersectedObject = is.object.parent;
                            break;
                        }
                    }
                    
                    

                    // 즉 intersectedObject 는 Group이니까 이거 관리 할 때 Children 이용해서 mesh의 material에 접근해야지

                    // 이 코드는 초기화 다른거 크릭하면 색깔 정상화 하는거거
                    if (selectedObject && selectedObject.userData.comment === "selected") {
                        selectedObject.userData.comment = null;
                        selectedObject.traverse((child => {
                            if (child.isMesh && child.material) {
                                child.material.emissive.setHex(0x000000);
                            }
                        }))
                    }

                    if (intersectedObject && selectedObject !== intersectedObject) {
                        intersectedObject.traverse((child) => {
                            if (child.isMesh && child.material) {
                                child.material.emissive.setHex(0x555555);
                            }
                        })
                        
                        selectedObject = intersectedObject;
                        selectedObject.userData.comment = "selected";

                        const meshInfo = meshInfoDict[intersectedObject.name];
                        if (meshInfo) {
                            updatePopupContent(meshInfo);
                            popup.classList.add("expanded");
                        }
                    } else {
                        selectedObject = null;
                        popup.classList.remove("expanded");
                    }
                } else {
                    if (selectedObject) {
                        selectedObject.traverse((child => {
                            if (child.isMesh && child.material) {
                                child.material.emissive.setHex(0x000000);
                            }
                        }))
                        selectedObject = null;
                        popup.classList.remove("expanded");
                    }
                    
                }
            }
            else {
                isLeftMouseDown = true;
                prevMouseX = event.clientX;
                prevMouseY = event.clientY;
            }
        }
    }

    function onMouseUp(event) {
        if (event.button === 0) { // 왼쪽 마우스 버튼
            isLeftMouseDown = false;
        }
    }

    function onMouseMove(event) {
        if (!isLeftMouseDown) return;
        if (isMouseInsideSliderContainer) {
            return;
        }
        const deltaX = event.clientX - prevMouseX;
        const deltaY = event.clientY - prevMouseY;

        updateCameraRotation(deltaX, deltaY);

        prevMouseX = event.clientX;
        prevMouseY = event.clientY;
    }

    function onKeyDown(event) {
        blockSystemShortcuts(event);

        switch (event.code) {
            case 'KeyW':
                movement.forward = true;
                break;
            case 'KeyS':
                movement.backward = true;
                break;
            case 'KeyA':
                movement.left = true;
                break;
            case 'KeyD':
                movement.right = true;
                break;
            case 'Space':
                movement.space = true;
                break;
            case 'ControlLeft':
                movement.ctrl = true;
                break;
            case 'ShiftLeft': // Shift 키가 눌렸을 때
                movement.shift = true;
                moveSpeed = baseSpeed * 2; // 속도 2배
                break;
            case 'KeyG':
                movement.G = true;
                moveSpeed = baseSpeed * 5;
                break;
        }
    }

    function onKeyUp(event) {
        switch (event.code) {
            case 'KeyW':
                movement.forward = false;
                break;
            case 'KeyS':
                movement.backward = false;
                break;
            case 'KeyA':
                movement.left = false;
                break;
            case 'KeyD':
                movement.right = false;
                break;
            case 'Space':
                movement.space = false;
                break;
            case 'ControlLeft':
                movement.ctrl = false;
                break;
            case 'ShiftLeft': // Shift 키가 떼어졌을 때
                movement.shift = false;
                moveSpeed = baseSpeed; // 기본 속도로 복원
                break;
            case 'KeyG':
                movement.G = true;
                moveSpeed = baseSpeed;
                break;
        }
    }

    function updateCameraPosition() {
        moveVector.set(0, 0, 0); // 매 프레임 이동 벡터 초기화

        if (movement.forward) {
            camera.getWorldDirection(direction); // 카메라의 정면 방향 가져오기
            moveVector.addScaledVector(direction, moveSpeed);
        }
        if (movement.backward) {
            camera.getWorldDirection(direction);
            moveVector.addScaledVector(direction, -moveSpeed);
        }
        if (movement.left) {
            camera.getWorldDirection(direction);
            const left = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 0, 1), direction);
            moveVector.addScaledVector(left, moveSpeed);        
        }
        if (movement.right) {
            camera.getWorldDirection(direction);
            const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 0, -1), direction);
            moveVector.addScaledVector(right, moveSpeed);
        }
        if (movement.space) {
            moveVector.z += moveSpeed;
        }
        if (movement.ctrl) {
            moveVector.z -= moveSpeed;
        }

        camera.position.add(moveVector); // 계산된 이동 벡터를 카메라 위치에 추가
    }

    function blockSystemShortcuts(event) {
        // Ctrl + W, Ctrl + S 등 단축키 차단
        if (event.ctrlKey) {
            switch (event.code) {
                case 'KeyW':
                case 'KeyS':
                case 'KeyR': // Ctrl + R (새로고침)
                    event.preventDefault();
                    console.log(`Blocked ${event.code} with Ctrl`);
                    break;
            }
        }
    }
    
    let isZPressed = false;
    window.addEventListener('keydown', (event) => {
        blockSystemShortcuts(event); // 단축키 차단 함수 호출
        onKeyDown(event); // 기존 키 이벤트 처리
        if (event.code === "KeyZ") {
            isZPressed = true;
        }
    });
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keyup', (event) => {
        if (event.code === "KeyZ") {
            isZPressed = false;
        }
    })
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousedown', (event) => {
        if (isZPressed) {
            const rect = renderer.domElement.getBoundingClientRect();
            const mouse = new THREE.Vector2(
                ((event.clientX - rect.left)/ rect.width) * 2 - 1,
                -((event.clientY - rect.top) / rect.height) * 2 + 1
            )

            raycaster.setFromCamera(mouse, camera);
            let intersections = raycaster.intersectObjects(allGroup, true);
            if (intersections.length > 0) {
                let intersectedObject = undefined;
                for (let is of intersections) {
                    if (is.object.parent.visible) {
                        intersectedObject = is.object.parent;
                        break;
                    }
                }
                if (intersectedObject) {
                    intersectedObject.visible = false;
                }
            }
        }
    })
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);    

    return {
        camera,
        updateCameraPosition,
    };

    function updatePopupContent(meshInfo) {
        const popupContent = document.getElementById("popup-content");
        popupContent.innerHTML = generateHTMLFromJSON(meshInfo); // JSON 데이터를 HTML로 변환
    }
    
    // ✅ JSON 데이터를 HTML 테이블 형태로 변환하는 함수
    function generateHTMLFromJSON(json, parentKey = "") {
        let html = `<div class="json-section"><strong class="key">${parentKey}</strong><div class="json-content">`;

        if (typeof json === "object" && !Array.isArray(json)) {
            // ✅ 객체일 경우 테이블 형식으로 변환
            html += `<table class="json-table">`;
            for (const [key, value] of Object.entries(json)) {
                html += `<tr><td class="key"></td><td>${generateHTMLFromJSON(value, key)}</td></tr>`;
            }
            html += `</table>`;
        } else if (Array.isArray(json)) {
            // ✅ 배열일 경우 리스트 형태로 변환
            html += `<ul class="json-list">`;
            json.forEach((item, index) => {
                html += `<li><strong>Item ${index + 1}:</strong> ${generateHTMLFromJSON(item, parentKey)}</li>`;
            });
            html += `</ul>`;
        } else {
            // ✅ 기본 값 (숫자, 문자열 등)
            html += `<span class="value">${json}</span>`;
        }

        html += `</div></div>`;
        return html;
    }
}