import * as THREE from 'three';
import { TransformControls  } from 'three/addons/controls/TransformControls.js';

export function rightupbuttons(scene, camera, renderer) {
    // make full size
    const fullscreenButton = document.getElementById("fullscreen-button");

    fullscreenButton.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
                .then(() => {
                    fullscreenButton.innerText = 'Exit Fullscreen';
                })
                .catch((err) => {
                    console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
                });
        } else {
            document.exitFullscreen()
                .then(() => {
                    fullscreenButton.innerText = 'Enter Fullscreen';
                })
                .catch((err) => {
                    console.error(`Error attempting to exit fullscreen mode: ${err.message} (${err.name})`);
                });
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenButton.innerText = 'Enter Fullscreen';
        } else {
            fullscreenButton.innerText = 'Exit Fullscreen';
        }
    });

    // camera reset
    // 초기 카메라 설정 => in main.js 41

    
}
