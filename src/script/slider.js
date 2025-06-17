export function sliderControls(sliderName, timeKeys, timeJson, allGroup, meshDict) {
    const slider = document.getElementById(sliderName);
    slider.max = timeKeys.length - 1;
    slider.value = timeKeys.length - 1;
    const currentTime = timeKeys[timeKeys.length - 1];

    updateMeshes(currentTime);
    
    slider.addEventListener('input', () => {
        const currentIndex = parseInt(slider.value, 10);
        const currentTime = timeKeys[currentIndex];
        updateMeshes(currentTime);
    });

    function updateSlider(value) {
        slider.value = value;
        slider.dispatchEvent(new Event('input'));
    }

    function updateMeshes(currentTime) {
        for (const mm of allGroup) {
            mm.visible = false;
        }
        for (const timelog of timeJson[currentTime]["Elements"]) {
            const groups = meshDict[timelog];
            if (groups === undefined) continue;
            groups.visible = true;
        }
    }
}