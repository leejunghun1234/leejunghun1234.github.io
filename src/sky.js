import * as THREE from 'three';

export function createSky(scene) {
    const texturePaths = [
        './sky/yonder_ft.jpg', // 1번째
        './sky/yonder_bk.jpg',
        './sky/yonder_lf.jpg',
        './sky/yonder_rt.jpg', // 4번째
        './sky/yonder_up.jpg', // 3번째
        './sky/yonder_dn.jpg'  // 6번째째
    ];

    // 텍스처 로드 및 회전 적용
    const textureLoader = new THREE.TextureLoader();

    const skyMaterialArray = texturePaths.map(path => {
        const texture = textureLoader.load(path);
    
    
        return new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide, // 내부에서 보이도록 설정
            depthWrite: false,
        });
    });

    const skyGeometry = new THREE.BoxGeometry(800, 800, 800);
    const sky = new THREE.Mesh(skyGeometry, skyMaterialArray);
    sky.receiveShadow = false;
    sky.position.set(0, 0, 0);
    scene.add(sky);
}