var donePlayingIntro = false;

/**
 * Play the Armor Games intro
 * @param {string} windowHandleName Index of the canvas element 
 * @param {string} directory Directory to find the armor games intros in. A / will be automatically added
 */
function playIntro(windowHandleName, directory) {
    var windowHandle = document.getElementById(windowHandleName);

    donePlayingIntro = false;

    var videoElementA = document.createElement("a");
    videoElementA.style.textDecoration = "none";
    videoElementA.href = "http://armor.ag/MoreGames";
    videoElementA.target = "_blank";

    var videoElement = document.createElement("video");
    if (videoElement.canPlayType("video/ogg")) {
        videoElement.setAttribute("src", directory + "/armorIntro.ogv");
    } else if (videoElement.canPlayType("video/x-m4v")) {
        videoElement.setAttribute("src", directory + "/armorIntro.m4v");
    } else if (videoElement.canPlayType("video/webm")) {
        videoElement.setAttribute("src", directory + "/armorIntro.webm");
    } else {
        console.log("Cannot play Armor Games intro, skipping!");
        donePlayingIntro = true;
    }

    videoElement.setAttribute("width", windowHandle.width);
    videoElement.setAttribute("height", windowHandle.height);
    videoElement.style.backgroundColor = "black";
    videoElement.style.position = "fixed";
    var rect = windowHandle.getBoundingClientRect();
    videoElement.style.left = rect.left + "px";
    videoElement.style.top = rect.top + "px";
    var promise = videoElement.play();
    if (promise !== undefined) {
        promise.catch(function(err) {
            videoElement.muted = true;
            promise = videoElement.play();
            promise.catch(function(err) {
                //Failed, skip the intro
                finalizeIntro();
            });
        });
    }

    videoElement.addEventListener("ended", function() {
        finalizeIntro();
    });
    videoElementA.appendChild(videoElement);
    document.body.appendChild(videoElementA);

    /**
     * Finalize the intro animation.
     */
    function finalizeIntro() {
        document.body.removeChild(videoElementA);
        donePlayingIntro = true;
        videoElement = null;
    }
}

/**
 * Whether we're done playing the armor games intro
 */
function hasPlayedIntro() {
    return donePlayingIntro;
}