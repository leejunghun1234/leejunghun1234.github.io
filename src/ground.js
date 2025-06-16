import * as THREE from 'three';

export function createGround(scene) {
    const planeGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    
    const loader = new THREE.TextureLoader();
    loader.load('./sky/grass.png', function(texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(40, 40);

        const planeGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
        const planeMaterial = new THREE.MeshStandardMaterial({ map: texture} );

        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;
        plane.position.set(0, 0, -1);
        scene.add(plane);
    });

    loader.load('./sky/paze_dn.jpg', function(texture) {
        const centerGeometry = new THREE.CircleGeometry(1);
        const centerMaterial = new THREE.MeshStandardMaterial({ map: texture });
        const center = new THREE.Mesh(centerGeometry, centerMaterial);
        center.receiveShadow = true;
        center.position.set(0, 0, -0.95);
        scene.add(center);
    })
}
