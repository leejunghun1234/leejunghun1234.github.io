/**
 * Adds a resize event listener to update the camera and renderer.
 *
 * @param {HTMLElement} container - The HTML container element (e.g., gameWindow).
 * @param {THREE.PerspectiveCamera} camera - The camera to update on resize.
 * @param {THREE.WebGLRenderer} renderer - The renderer to update on resize.
 */
export function addResizeListener(container, camera, renderer) {
    window.addEventListener("resize", () => {
        // Get new dimensions
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Update camera aspect ratio and projection matrix
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // Update renderer size
        renderer.setSize(width, height);
    });
}