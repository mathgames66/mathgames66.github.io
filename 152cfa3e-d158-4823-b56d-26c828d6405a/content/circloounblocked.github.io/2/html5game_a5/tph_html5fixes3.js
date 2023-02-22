//Source: http://stackoverflow.com/questions/8603656/html5-canvas-arcs-not-rendering-correctly-in-google-chrome
var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
if (is_chrome && false) {
    CanvasRenderingContext2D.prototype.arc = function(x, y, radius, startAngle, endAngle, anticlockwise) {
    // Signed length of curve
    var signedLength;
    var tau = 2 * Math.PI;

    if (!anticlockwise && (endAngle - startAngle) >= tau) {
        signedLength = tau;
    } else if (anticlockwise && (startAngle - endAngle) >= tau) {
        signedLength = -tau;
    } else {
        var delta = endAngle - startAngle;
        signedLength = delta - tau * Math.floor(delta / tau);

        // If very close to a full number of revolutions, make it full
        if (Math.abs(delta) > 1e-12 && signedLength < 1e-12)
        signedLength = tau;

        // Adjust if anti-clockwise
        if (anticlockwise && signedLength > 0)
        signedLength = signedLength - tau;
    }

    // Minimum number of curves; 1 per quadrant.
    var minCurves = Math.ceil(Math.abs(signedLength)/(Math.PI/2));

    // Number of curves; square-root of radius (or minimum)
    var numCurves = Math.ceil(Math.max(minCurves, Math.sqrt(radius)));

    // "Radius" of control points to ensure that the middle point
    // of the curve is exactly on the circle radius.
    var cpRadius = radius * (2 - Math.cos(signedLength / (numCurves * 2)));

    // Angle step per curve
    var step = signedLength / numCurves;

    // Draw the circle
    this.lineTo(x + radius * Math.cos(startAngle), y + radius * Math.sin(startAngle));
    for (var i = 0, a = startAngle + step, a2 = startAngle + step/2; i < numCurves; ++i, a += step, a2 += step)
        this.quadraticCurveTo(x + cpRadius * Math.cos(a2), y + cpRadius * Math.sin(a2), x + radius * Math.cos(a), y + radius * Math.sin(a));
    }

    console.log("drawARC");
}

var context_2;
function beginPath(ctx, linewidth)
{
	ctx.beginPath();
	ctx.lineWidth = linewidth;
	context_2 = ctx;
}

function pathMoveTo(x1, y1)
{
    context_2.moveTo(x1, y1);
}

function pathLineTo(x1, y1)
{
	context_2.lineTo(x1, y1);
}

function pathCircle(x, y, radius)
{
	context_2.moveTo(x, y);
	context_2.arc(x, y, radius, 0, 2*Math.PI);
}

function drawPathArc(x, y, radius, sAngle, eAngle) {
    sAngle = 360 - sAngle;
    eAngle = 360 - eAngle;
    context_2.arc(x, y, radius, sAngle / 180 * Math.PI, eAngle / 180 * Math.PI, true);
}

function pathStroke(name)
{
	context_2.stroke();
}

function pathFill()
{
	context_2.fill();
}

//Avoid the popup blocker
var urlOpenFunction;
function addLinkHandler(url)
{
	urlOpenFunction = function(e)
	{
		var keyCode = e.keyCode;
		if ((keyCode == 13) || (keyCode == 32))
		{
			window.open(url, "_blank", "width=1000, height=500, location=yes, resizable=yes, scrollbars=yes, toolbar=yes");
			document.getElementById("canvas").focus();
		}
	};
	document.addEventListener("keydown", urlOpenFunction);
}

function removeLinkHandler()
{
	document.removeEventListener("keydown", urlOpenFunction);
}

//Avoid keydown problems
var keys = {};
window.addEventListener("keydown",
function(e){
keys[e.keyCode] = true;
switch(e.keyCode){
case 37: case 39: case 38: case 40: // Arrow keys
case 32: e.preventDefault(); break; // Space
default: break; // do not block other keys
}
},
false);
window.addEventListener("keyup",
function(e){
keys[e.keyCode] = false;
},
false);

function addAnimationPolyfill()
{
	window.requestAnimFrame = (function(){
  return  function( callback ){
            window.setTimeout(callback, 16);
          };
})();
}

function isEdge()
{
    return window.navigator.userAgent.indexOf("Edge") > -1;
}

var failedOrientationLock = false;

// Try to lock the device orientation to the right orientation
function tryLockOrientation() {
    if ("orientation" in screen) {
        if ("lock" in screen.orientation)
            screen.orientation.lock("landscape").catch(function() {
                failedOrientationLock = true;
            });
        else if ("lockOrientation" in screen.orientation)
            screen.orientation.lockOrientation("landscape");
        else if ("mozLockOrientation" in screen.orientation)
            screen.orientation.mozLockOrientation("landscape");
    } else if ("mozOrientation" in screen) {
        if ("mozLock" in screen.mozOrientation)
            screen.orientation.mozLock("landscape").catch(function() {
                failedOrientationLock = true;
            });
        else if ("mozLockOrientation" in screen.mozOrientation)
            screen.orientation.mozLockOrientation("landscape");
    } else if ("msOrientation" in screen) {
        if ("msLock" in screen.msOrientation)
            screen.orientation.msLock("landscape").catch(function() {
                failedOrientationLock = true;
            });
        else if ("msLockOrientation" in screen.msOrientation)
            screen.orientation.msLockOrientation("landscape");
    } else if ("webkitOrientation" in screen) {
        if ("webkitLock" in screen.webkitOrientation)
            screen.orientation.webkitLock("landscape").catch(function() {
                failedOrientationLock = true;
            });
        else if ("webkitLockOrientation" in screen.webkitOrientation)
            screen.orientation.webkitLockOrientation("landscape");
    }
}

function toggleHTML5Fullscreen()
{
    if (! isHTML5FullScreen()) {
        try {
            var thePromiseHopefully;

            if (document.documentElement.requestFullscreen) {  
                thePromiseHopefully = document.documentElement.requestFullscreen();  
            } else if (document.documentElement.mozRequestFullScreen) {
                thePromiseHopefully = document.documentElement.mozRequestFullScreen();  
            } else if (document.documentElement.webkitRequestFullScreen) {
                thePromiseHopefully = document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
            } else if (document.documentElement.msRequestFullscreen) {
                thePromiseHopefully = document.documentElement.msRequestFullscreen();  
            }   

            //If the stars are right, .
            if (thePromiseHopefully != undefined)
                thePromiseHopefully.catch(function() {
                    //No catch
                }).then(function() {
                    if (failedOrientationLock)
                        tryLockOrientation();
                });

            tryLockOrientation();
        } catch (err) {

        }
    } else {  
        if (document.cancelFullscreen) {  
            document.cancelFullscreen();  
        } else if (document.mozCancelFullScreen) {  
            document.mozCancelFullScreen();  
        } else if (document.webkitCancelFullScreen) {  
            document.webkitCancelFullScreen();  
        } else if (document.msCancelFullscreen) {  
            document.msCancelFullscreen();  
        }
    } 

    //Firefox bug
    setTimeout(function()
    {
        document.documentElement.style.backgroundColor = "#101010";
        document.body.style.backgroundColor = "#101010";

        setTimeout(function()
        {
            document.documentElement.style.backgroundColor = "black";
            document.body.style.backgroundColor = "black";
        }, 100);
    }, 1000);
}

function isHTML5FullScreen()
{
    return (document.fullScreenElement && document.fullScreenElement !== null) || (document.mozFullScreenElement && document.mozFullScreenElement !== null) || (document.msFullscreenElement && document.msFullscreenElement !== null) || (document.webkitFullscreenElement && document.webkitFullscreenElement !== null);
}

function getDevicePixelRatio() {
    return window.devicePixelRatio;
}

function setCanvasCSSSize(width, height) {
    var cnv = document.getElementById("canvas");
    cnv.style.width = width + "px";
    cnv.style.height = height + "px";
}

function addTouchscreenHandlerCanvas() {
    document.getElementById("canvas").addEventListener("touchend", function() {
        if (! isHTML5FullScreen())
            toggleHTML5Fullscreen();
    });
}

if(typeof AudioContext != "undefined" || typeof webkitAudioContext != "undefined") {
   var resumeAudio = function() {
      if(typeof g_WebAudioContext == "undefined" || g_WebAudioContext == null) return;
      if(g_WebAudioContext.state == "suspended") g_WebAudioContext.resume();
   };
   document.getElementById("canvas").addEventListener("click", resumeAudio);
   document.getElementById("canvas").addEventListener("touchend", resumeAudio);
   document.getElementById("canvas").style.display = "block";
}

var clickRegisteredSinceLastFrame = false, clickRegisteredOnThisFrame = false;

function registerClick() {
    clickRegisteredSinceLastFrame = true;
}

document.getElementById("canvas").addEventListener("mousedown", registerClick);

//document.getElementById("canvas").addEventListener("keyup")

function mouse_check_pressed_left_notbroken() {
    return clickRegisteredOnThisFrame ? 1 : 0;
}

function mouse_handle_beginstep() {
    clickRegisteredOnThisFrame = clickRegisteredSinceLastFrame;
    clickRegisteredSinceLastFrame = false;
}

function browser_scroll_zero() {
    window.scrollTo(0, 0);

    window.setTimeout(function() {
        window.scrollTo(0, 0);
    }, 500);
}

htmlFixedLoaded = true;