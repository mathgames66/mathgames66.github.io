(function() {
    var windowHandleHasOnClickInited = false;
    var gotoUrl = null;
    var gotoUrlIfInPos = null;
    var stepsSinceActivation = 0;

    var alwaysGoToMinX = -1, alwaysGoToMaxX = -1, alwaysGoToMinY = -1, alwaysGoToMaxY = -1;

    function doActivate(url) {
        if (url.indexOf("gmcallback_") == 0) {
            window["gml_Script_" + url]();
        }
        else
            window.open(url, "_blank");
    }

    window.html5LinkActivate = function(windowHandleName, url) {
        var windowHandle = document.getElementById(windowHandleName);
        gotoUrl = url;
        stepsSinceActivation = 2;

        if (! windowHandleHasOnClickInited) {
            windowHandleHasOnClickInited = true;

            var onClickDo = function(evt) {
                if (gotoUrl !== null) {
                    doActivate(gotoUrl);
                }

                if (gotoUrlIfInPos !== null) {
                    var rect = windowHandle.getBoundingClientRect();
                    var clickX = (evt.clientX - rect.left) / (rect.width), clickY = (evt.clientY - rect.top) / (rect.height);

                    if (clickX >= alwaysGoToMinX && clickX < alwaysGoToMaxX && clickY >= alwaysGoToMinY && clickY < alwaysGoToMaxY) {
                        doActivate(gotoUrlIfInPos);
                    }
                }

                gotoUrl = null;
                gotoUrlIfInPos = null;
            };

            windowHandle.addEventListener("click", onClickDo)

            windowHandle.addEventListener("touchend", function(evt) {
                evt.clientX = evt.changedTouches[0].clientX;
                evt.clientY = evt.changedTouches[0].clientY;
                onClickDo(evt);
            });
        }
    };

    window.html5LinkActivatePositioned = function(windowHandleName, url, minXToGo, minYToGo, maxXToGo, maxYToGo) {
        window.html5LinkActivate(windowHandleName, url);
        gotoUrl = null;
        gotoUrlIfInPos = url;

        alwaysGoToMinX = minXToGo;
        alwaysGoToMinY = minYToGo;
        alwaysGoToMaxX = maxXToGo;
        alwaysGoToMaxY = maxYToGo;
    }

    window.html5LinkStep = function() {
        if (gotoUrl !== null && stepsSinceActivation >= 0) {
            stepsSinceActivation--;

            if (stepsSinceActivation <= 0) {
                gotoUrl = null;
                gotoUrlIfInPos = null;
            }
        }
    };

    window.html5LinkDeactivate = function() {
        gotoUrl = null;
        gotoUrlIfInPos = null;
    };

    window.html5LinkActive = function() {
        return gotoUrl !== null;
    }
})();