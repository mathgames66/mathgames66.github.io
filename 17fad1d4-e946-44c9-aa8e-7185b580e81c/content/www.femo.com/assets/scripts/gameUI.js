//////// INITIALISATIONS //////////
///////////////////////////////////
var debug = false;
var version = "v0.1"
var siteURL = "https://www.femo.com/";
var analyticsID = "UA-3596694-35";

if (debug) {
    alert(version);
}

var os = "Other";

var userAgent = navigator.userAgent || navigator.vendor || window.opera;

//get user os
function getOperatingSystem() {
    if (/android/i.test(userAgent)) {
        return "Android";
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }
    if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 0) {
        return "iOS";
    }
    return "Desktop";
}

var os = getOperatingSystem();

var touchDevice = false;
if (os == "Android" || os == "iOS") {
    touchDevice = true;
}

if (game.diableRightMouseButton) {
    document.addEventListener('contextmenu', event => event.preventDefault());
}




//////// ANALYTICS /////////
////////////////////////////
var imported = document.createElement('script');
imported.src = 'https://www.googletagmanager.com/gtag/js';
document.head.appendChild(imported);

window.dataLayer = window.dataLayer || [];

function gtag() {
    dataLayer.push(arguments);
}

gtag('js', new Date());
gtag('config', analyticsID);

gtag('event', ("Loaded : " + game.title), {
    'event_category': 'Game Play',
    'event_label': ('Game : Loaded')
});

setTimeout(function () {
    gtag('event', ("3 Mins : " + game.title), {
        'event_category': 'Game Play',
        'event_label': ('Game : 3 Mins')
    });
}, 180000);




//////// EXECUTE BULK OF CODE ONLY WHEN PAGE FULLY LOADED /////////
///////////////////////////////////////////////////////////////////
document.body.onload = function () {




    //////// ADD DIVS TO PAGE /////////
    ///////////////////////////////////
    console.log("Document loaded, adding divs");
    var div1 = document.createElement('div');
    div1.id = 'backButton';
    //div1.className = 'block';
    document.body.appendChild(div1);
    var div2 = document.createElement('div');
    div2.id = 'orientationOverlay';
    //div1.className = 'block';
    document.body.appendChild(div2);

    //walkthrough button, promo bar, effects etc.




    //////// ADD STYLING TO ANY DIVS ETC /////////
    //////////////////////////////////////////////

    //IF NEED TO ADD STYLING (e.g. hover)  
    if (false) { //disabled
        var css = "#backButton:hover{ background-color: red };";
        var style = document.createElement('style');
        style.appendChild(document.createTextNode(css));

        /* REMOVE AFTER EXTENSIVE TESTING - FEB 2021
if (style.styleSheet) {
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}
*/
        document.getElementsByTagName('head')[0].appendChild(style);
    }




    //////// BACK BUTTON FUNCTIONALITY /////////
    ////////////////////////////////////////////
    backButton.addEventListener('click', function (e) {
        window.location.assign(siteURL);
    });




    //////// CHECK FOR IFRAME /////////
    ///////////////////////////////////
    if (window.location !== window.parent.location) {
        console.log("The page is in an iFrame");
    } else {
        console.log("The page is not in an iFrame");
    }




    //////// UI ADJUSTMENTS /////////
    /////////////////////////////////
    if (game.shiftBackButton > 0) {
        backButton.style.top = game.shiftBackButton + "vh";
    }




    //////// ORIENTATION ADVICE FOR TOUCH USERS /////////
    /////////////////////////////////////////////////////
    function checkOrientation() {

        setTimeout(function () {

            if (os == "iOS") {

                if ((window.orientation == 90 || window.orientation == -90) && game.orientation == "Landscape") {
                    orientationOverlay.style.display = "none";
                    //alert("iOS case1");
                }
                if ((window.orientation == 0 || window.orientation == 180) && game.orientation == "Landscape") {
                    orientationOverlay.style.display = "block";
                    //alert("iOS case2");
                }

                if ((window.orientation == 90 || window.orientation == -90) && game.orientation == "Portrait") {
                    orientationOverlay.style.display = "block";
                    //alert("iOS case3");
                }
                if ((window.orientation == 0 || window.orientation == 180) && game.orientation == "Portrait") {
                    orientationOverlay.style.display = "none";
                    //alert("iOS case4");
                }

            }

            if (os == "Android") {

                if ((screen.width > screen.height) && game.orientation == "Landscape") {
                    orientationOverlay.style.display = "none";
                    //alert("Android case1");
                }
                if ((screen.width < screen.height) && game.orientation == "Landscape") {
                    orientationOverlay.style.display = "block";
                    //alert("Android case2");
                }

                if ((screen.width > screen.height) && game.orientation == "Portrait") {
                    orientationOverlay.style.display = "block";
                    //alert("Android case3");
                }
                if ((screen.width < screen.height) && game.orientation == "Portrait") {
                    orientationOverlay.style.display = "none";
                    //alert("Android case4");
                }
            }

        }, 500);

    }

    //orientation - add listener where applicable
    if (((game.orientation == "Portrait") || (game.orientation == "Landscape")) && (game.orientationAdviceRequired == true)) {
        checkOrientation();
        window.addEventListener('orientationchange', checkOrientation);
    }




};
