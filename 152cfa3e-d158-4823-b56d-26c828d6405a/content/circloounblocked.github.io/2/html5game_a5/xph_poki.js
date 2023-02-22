console.log("Poki wrapper load");
///~
function poki_init_raw() {
    console.log("Poki wrapper init");
    // fix GMS1 bug with iframes
    var ctr = document.getElementById("gm4html5_div_id");
    if (ctr && !ctr.frames) ctr.frames = [];
    return 0;
}
///~
function poki_script_closure_raw(self, other, script, custom) {
    return function(result) {
        window.gml_Script_gmcallback_poki_closure(self, other, script, result, custom)
    }
}

function poki_is_blocked() {
    return !window.PokiSDK_OK;
}

function poki_gameplay_start() {
    if (PokiSDK) PokiSDK.gameplayStart();
}

function poki_gameplay_stop() {
    if (PokiSDK) PokiSDK.gameplayStop();
}

function poki_happy_time(magnitude) {
    if (PokiSDK) PokiSDK.happyTime(magnitude);
}

///~
function poki_commercial_break_raw(fn) {
    if (PokiSDK) {
        PokiSDK.commercialBreak().then(function() { fn(true); });
    } else setTimeout(function() { fn(false); }, 0);
}

///~
function poki_rewarded_break_raw(fn) {
    if (PokiSDK) {
        PokiSDK.rewardedBreak().then(fn);
    } else setTimeout(function() { fn(false); }, 0);
}

/// https://yal.cc/gamemaker-html5-loading-bar-extended/
var inst = { };
///~
var loadBarImage = null, canUseLoadBarImage = false, setLoadBarSource = false;
try {
var loadBarImage = new Image();
loadBarImage.onload = () => {
    canUseLoadBarImage = true;
};
} catch (e) {

}

function poki_loadbar(ctx, width, height, total, current, image) {

    image = loadBarImage;

    if (window.PokiSDK) { // if you have your own loadbar, just copy this block in there
        if (window.PokiSDK_loadState == 0 && !window.PokiSDK_isLoading) {
            window.PokiSDK_isLoading = 1;
            PokiSDK.gameLoadingStart();
        }
        PokiSDK.gameLoadingProgress({ percentageDone: current/total });
        if (current >= total && window.PokiSDK_loadState != 2) {
            window.PokiSDK_loadState = 2;
            PokiSDK.gameLoadingFinished();
        }
    }
    
    function getv(s) {
        if (window.gml_Script_gmcallback_poki_loadbar) {
            return window.gml_Script_gmcallback_poki_loadbar(inst, null,
                s, current, total,
                width, height, image ? image.width : 0, image ? image.height : 0)
        } else return undefined;
    }
    function getf(s, d) {
        var r = getv(s);
        return typeof(r) == "number" ? r : d;
    }
    function getw(s, d) {
        var r = getv(s);
        return r && r.constructor == Array ? r : d;
    }
    function getc(s, d) {
        var r = getv(s);
        if (typeof(r) == "number") {
            r = r.toString(16);
            while (r.length < 6) r = "0" + r;
            return "#" + r;
        } else if (typeof(r) == "string") {
            return r;
        } else return d;
    }

    //Set image of load bar
    if (! setLoadBarSource) {
        loadBarImage.src = getv("loadingImageUrl");
        setLoadBarSource = true;
    }

    // get parameters:
    width = getf("width", width);
    height = getf("height", height);
    var csswidth = getf("csswidth", width);
    var cssheight = getf("cssheight", height);

    //Resize the canvas
    var cnv = document.getElementById("loading_screen");
    if (cnv != null) {
        cnv.style.width = csswidth + "px";
        cnv.style.height = cssheight + "px";

        cnv.width = width;
        cnv.height = height;

        cnv.style.display = "block";
        cnv.style.position = "fixed";
    }
    
    var backgroundColor = getc("background_color", "#FFFFFF");
    var barBackgroundColor = getc("bar_background_color", "#FFFFFF");
    var barForegroundColor = getc("bar_foreground_color", "#242238");
    var barBorderColor = getc("bar_border_color", "#242238");
    var barWidth = getf("bar_width", Math.round(width * 0.8));
    var barHeight = getf("bar_height", 20);
    var barBorderWidth = getf("bar_border_width", 2);
    var barOffset = getf("bar_offset", 10);
    // background:
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    // image:
    var totalHeight, barTop;
    if (image != null && canUseLoadBarImage) {
        var wrh = 1920 / 1080;
        var newWidth = width;
        var newHeight = newWidth / wrh;
        if (newHeight < height) {
            newHeight = height;
            newWidth = newHeight * wrh;
        }

        ctx.drawImage(image, (width - newWidth) / 2, (height - newHeight) / 2, newWidth, newHeight);
    }
    var barTop = Math.max(height - Math.round(width * 0.1) - barHeight, (height - barHeight) >> 1);
    // bar border:
    var barLeft = (width - barWidth) >> 1;
    ctx.fillStyle = barBorderColor;
    ctx.fillRect(barLeft, barTop, barWidth, barHeight);
    //
    var barInnerLeft = barLeft + barBorderWidth;
    var barInnerTop = barTop + barBorderWidth;
    var barInnerWidth = barWidth - barBorderWidth * 2;
    var barInnerHeight = barHeight - barBorderWidth * 2;
    // bar background:
    ctx.fillStyle = barBackgroundColor;
    ctx.fillRect(barInnerLeft, barInnerTop, barInnerWidth, barInnerHeight);
    // bar foreground:
    var barLoadedWidth = Math.round(barInnerWidth * current / total);
    ctx.fillStyle = barForegroundColor;
    ctx.fillRect(barInnerLeft, barInnerTop, barLoadedWidth, barInnerHeight);
}