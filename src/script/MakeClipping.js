import * as THREE from 'three';

export function MakeClipping(latestElem, allGroup,planes, inversePlanes, inside) {
    if (!inside) {
        for (let i = 0; i < latestElem.length; i++) {
            const group = latestElem[i];
            group.visible = true;
            for (let a = 0; a < group.children.length; a++) {
                const object = group.children[a];
                if (object.isMesh || object.isLine) {
                    object.material.clippingPlanes = inversePlanes;
                    object.material.clipIntersection = false;
                    object.material.needsUpdate = true;
                }
            }
        }
        for (let i = 0; i < allGroup.length; i++) {
            const group = allGroup[i];
            for (let a = 0; a < group.children.length; a++) {
                const object = group.children[a];
                if (object.isMesh || object.isLine) {
                    object.material.clippingPlanes = planes;
                    object.material.clipIntersection = true;
                    object.material.needsUpdate = true;
                }
            }
        }
    } else {
        for (let i = 0; i < latestElem.length; i++) {
            const group = latestElem[i];
            group.visible = true;
            for (let a = 0; a < group.children.length; a++) {
                const object = group.children[a];
                if (object.isMesh || object.isLine) {
                    object.material.clippingPlanes = planes;
                    object.material.clipIntersection = true;
                    object.material.needsUpdate = true;
                }
            }
        }
        for (let i = 0; i < allGroup.length; i++) {
            const group = allGroup[i];
            for (let a = 0; a < group.children.length; a++) {
                const object = group.children[a];
                if (object.isMesh || object.isLine) {
                    object.material.clippingPlanes = inversePlanes;
                    object.material.clipIntersection = false;
                    object.material.needsUpdate = true;
                }
            }
        }
    }
}