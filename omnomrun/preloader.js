var loadingProgress = 0.0;
var simulatedProgressRange = 0.65; // 0.65 ~ 65%
var simulationSteps = 100;
var simulationTime = 15; //seconds

var displayProgress = function(value) {
    var bar = document.getElementById('loaderBar');
    var loadingText = document.getElementById('loadingText');

    if(bar) bar.style.width = value * 100 + '%';
    if(loadingText) loadingText.innerHTML = Math.round(value * 100) + '%';
    if(typeof famobi !== 'undefined') famobi.setPreloadProgress(Math.floor(value * 99));
};

var stopPreloaderSimulation = function () {
    clearInterval(simulatingInterval);
};

var simulatingInterval = setInterval(() => {
    if(loadingProgress >= simulatedProgressRange) {
        return stopPreloaderSimulation();
    }
    loadingProgress += simulatedProgressRange / simulationSteps * Math.random();
    displayProgress(loadingProgress);
}, simulationTime / simulationSteps * 1000);