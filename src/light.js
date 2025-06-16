import * as THREE from 'three';

export function addLights(scene) {
    const asdf = new THREE.AmbientLight( 0xffffff, 1); 
    scene.add(asdf);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0 ,10, 10); 
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 512;
    directionalLight.shadow.mapSize.height = 512;
    scene.add(directionalLight);

    // const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    // directionalLight2.position.set(0, 0, 10);
    // directionalLight2.castShadow = true;
    // directionalLight2.shadow.mapSize.width = 512;
    // directionalLight2.shadow.mapSize.height = 512;
    // scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight3.position.set(10, 0, 10);
    directionalLight3.castShadow = true;
    directionalLight3.shadow.mapSize.width = 512;
    directionalLight3.shadow.mapSize.height = 512;
    scene.add(directionalLight3);

    const directionalLight4 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight4.position.set(-10, 0, 10);
    directionalLight4.castShadow = true;
    directionalLight4.shadow.mapSize.width = 512;
    directionalLight4.shadow.mapSize.height = 512;
    scene.add(directionalLight4);

    const directionalLight5 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight5.position.set(0 ,-10, 10); 
    directionalLight5.castShadow = true;
    directionalLight5.shadow.mapSize.width = 512;
    directionalLight5.shadow.mapSize.height = 512;
    scene.add(directionalLight5);

    const helper2 = new THREE.DirectionalLightHelper(directionalLight);
    // const helper3 = new THREE.DirectionalLightHelper(directionalLight2);
    const helper4 = new THREE.DirectionalLightHelper(directionalLight3);
    const helper5 = new THREE.DirectionalLightHelper(directionalLight4);
    const helper6 = new THREE.DirectionalLightHelper(directionalLight5);




    // scene.add(helper3);
    // scene.add(helper4);
    // scene.add(helper2);
    // scene.add(helper5);
    // scene.add(helper6);
}