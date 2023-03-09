///////////////////////////////////////////////////////////////////////////////
// file game.main.js
///////////////////////////////////////////////////////////////////////////////

// Provides requestAnimationFrame in a cross browser way. @author paulirish / http://paulirish.com/
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function () {
        "use strict";
        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();
}

function startGame() {
    $("#canvas").fadeIn();

    // Prevent scrolling when moving.
    $(document).on("touchmove", function (e) {
        "use strict";
        e.preventDefault();
    });

    var onGameLoading = function (percent) {
        //console.log("game loading " + percent + "%");
    };

    var onGameSessionStarted = function (level) {
        //console.log("onGameSessionStarted " + level);
    };

    var onGameSessionEnded = function (session) {
        //console.log("onGameSessionEnded " + session.level + " | " + session.score);
    };

    var isDesktop = function () {
        if (OkijinAPI) {
            return OkijinAPI.isDesktop();
        }
        else {
            return false;
        }
    };

    // Initialize the game.
    var settings = {
        "root": OkijinAPISettings.gameId,
        "onGameLoading": onGameLoading,
        "onGameSessionStarted": onGameSessionStarted,
        "onGameSessionEnded": onGameSessionEnded,
        "useHighResolution": isDesktop(),
        "rollTime": 0,
    };

    JellyDoods.initialize(settings);
}

// Document has loaded.
$(document).ready(function () {
    "use strict";

    // Disable scrollbars.
    $("body").css("overflow", "hidden");
    // Remove outlines.
    $("body > *").css("outline", "none");

    startGame();
});

// Window is resized.
$(window).resize(function () {
    "use strict";
    if (JellyDoods.getCurrentGameState()) {
        // Reset the display.
        JellyDoods.resetDisplay();
    }
});



