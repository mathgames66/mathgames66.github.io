// var adsCodeResp; var lastTimeShow; var showFirstTime;
var adsCode;
// var type;
// var typeBanner;
// var lastRandomShow;
// var intervalVar;
// var timeCheck;
// var timeCheckShow;
// var showFirst;
// var timeCheck = 0;
var clickSkip = false;
var showAdFlag = true;
var callBaclFn;
var hostStr;
var imgErr;
var adsCodeType = -1;
var urlAds;
var isTimeOutMessageResponse = false;
var timeOutMessageResponse = 10;

var runLoopCheckTimeOut = true;
var run = true;
var txIndex = 15;

function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

      // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

var loop = function() {
    if (run && txIndex >= 0) {
        // console.log(txIndex);
        if (txIndex === 0) {
            run = false;
            try{
                window.parent.jQuery("#scoreFrame").css({"display":"none", "z-index":"-1"});
                // if (typeof parent.callBaclFn !== 'undefined') {
                //     parent.postMessage({
                //         "callBackFnCalled": 1
                //     }, "*");
                // } else if (typeof callBaclFn !== 'undefined') {
                //     window.postMessage({
                //         "callBackFnCalled": 1
                //     }, "*");
                // }
                if (typeof parent.AdObject.callBackFuntion !== 'undefined') {
                    parent.postMessage({
                        "callBackFnCalled": 1
                    }, "*");
                    window.postMessage({
                        "callBackFnCalled": 1
                    }, "*");
                } else if (typeof AdObject.callBackFuntion !== 'undefined') {
                    window.postMessage({
                        "callBackFnCalled": 1
                    }, "*");
                }
                while(window.parent.jQuery("#adsFrame").length > 0){
                    window.parent.jQuery("#adsFrame").remove();
                }
                // var frame = parent.document.getElementById("adsFrame");
                // frame.parentNode.removeChild(frame);
                window.parent.jQuery("#adsScript").remove();
            }catch(e){
                jQuery("#scoreFrame").css({"display":"none", "z-index":"-1"});
                // if (typeof callBaclFn !== 'undefined') {
                //     try{
                //         parent.postMessage({
                //             "callBackFnCalled": 1
                //         }, "*");
                //     }catch(e){
                //         window.postMessage({
                //             "callBackFnCalled": 1
                //         }, "*");
                //     }
                // }
                if (typeof AdObject.callBackFuntion !== 'undefined') {
                    try{
                        parent.postMessage({
                            "callBackFnCalled": 1
                        }, "*");

                        window.postMessage({
                            "callBackFnCalled": 1
                        }, "*");                  
                    }catch(e){
                        window.postMessage({
                            "callBackFnCalled": 1
                        }, "*");
                    }
                }
                try{
                    while(window.parent.jQuery("#adsFrame").length > 0){
                        window.parent.jQuery("#adsFrame").remove();
                    }
                    // var frame = parent.document.getElementById("adsFrame");
                    // frame.parentNode.removeChild(frame);
                    window.parent.jQuery("#adsScript").remove();
                }catch(e){
                    while(window.jQuery("#adsFrame").length > 0){
                        window.jQuery("#adsFrame").remove();
                    }
                    // var frame = document.getElementById("adsFrame");
                    // frame.parentNode.removeChild(frame);
                    window.jQuery("#adsScript").remove();
                }
            }

        } else {
            if (txIndex < 10) {
                jQuery("#adsFrame").contents().find("#textAutoSkip").html("Ad will close in 0:0" + txIndex);
            } else {
                jQuery("#adsFrame").contents().find("#textAutoSkip").html("Ad will close in 0:" + txIndex);
            }
        }
        txIndex--;
        setTimeout(loop, 1000);
    } else {
        run = false;
    }
};

var checkTimeOut = function(){
    if (runLoopCheckTimeOut && timeOutMessageResponse >= 0) {
        // console.log(timeOutMessageResponse);
        if(timeOutMessageResponse == 0){
            run = false;
            var frame;
            try{
                frame = parent.document.getElementById("adsFrame");
                if(frame == null){
                    frame = document.getElementById("adsFrame");
                }
            }catch(e){
                frame = document.getElementById("adsFrame");
            }
            
            frame.parentNode.removeChild(frame);
            try{
                window.parent.jQuery("#adsScript").remove();
            }catch(e){
                window.jQuery("#adsScript").remove();
            }
        }else{
            timeOutMessageResponse--;
            setTimeout(checkTimeOut, 1000);
        }
    }
}

var AdObject = {
    lastTimeShow: 0,
    lastTimeRank: 0,
    timeCheck: 0,
    callBackFuntion: function(){

    },
    // showAdvertising: function(timeCheckVar, timeCountCheck) {
    showAdvertising: function() {
        if (showAdFlag) {
            run = true;
            runLoopCheckTimeOut = true;
            txIndex = 15;
            timeOutMessageResponse = 10;
            AdObject.callBackFuntion = undefined;
            try{
                if (typeof parent.AdObject.callBackFuntion !== 'undefined') {
                    // if (parent.AdObject.lastTimeShow == 0) {
                    parent.AdObject.callBackFuntion = undefined;
                    // }
                }
            }catch(e){

            }
            
            checkTimeOut();
            // var $ = jQuery.noConflict();
            // jQuery(function($) {
            var adsCodeResp;
            // this.adsCodeResp = response;
            // this.adsType = Math.floor(Math.random() * 9 + 2);
            // var mgid = 0;
            // adsCode = adsCode.replace(/(?:\r\n|\r|\n|\t)/g, '').replace(/[\/]/gi, '\/').replace(/['"]/gi, '\"');
            // if (adsCode === '') {
            //     adsCode = "<img src=\""+hostStr + imgErr + "\"/>";
            // }

            // var clientHeight = document.documentElement.clientHeight;
            // var clientWidth = document.documentElement.clientWidth;
            var clientHeight = jQuery(window).height();
            var clientWidth = jQuery(window).width();
            // alert(clientWidth +" - "+clientHeight);
            var scriptCode = makeScriptCode();
            // scriptCode = "document.getElementById('adsFrame').contentWindow.document.write('<html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\"><style type=\"text\/css\">.container{width: 100%;background: white;position: relative; height: 100vh;}<\/style><script type=\"text\/javascript\" src=\"function/jquery-3.2.1.min.js\"></script><\/head><body><div class=\"container\" style=\"width: 100%; height: 102vh; vertical-align: middle;\"><div style=\"position: absolute; width: 70%; height: auto; margin: auto; top: 50%;left: 50%; transform: translate(-50%, -50%);\">" + adsCode + "</div><div style=\"clear: both;\"><\/div><br\/><br\/><div id=\"skipAds\" style=\"right: 20px; bottom: 20px;  position: absolute; background: white; z-index: 1000; width: 10%, height: 50px; margin-right: 2%; margin-bottom: 20px; border: 1px solid; padding: 2px 2px; display: none;\"><font color=\"black\">Skip this ads</font><\/div><script type=\"text\/javascript\">jQuery(\"#skipAds\").css(\"display\", \"\");for(var i = 5; i >=0 ; i--){(function(index) {setTimeout(function(){console.log(index);if(index === 0){jQuery(\"#skipAds\").html(\"Skip this ads\");jQuery(\"#skipAds\").click(function(iframe){var frame = parent.document.getElementById(\"adsFrame\");frame.parentNode.removeChild(frame); window.parent.jQuery(\"#adsScript\").remove();});}else{jQuery(\"#skipAds\").html(\"Skip this ads in \"+index+\" seconds\");}}, 5000 - (1000 * index));})(i);}</script><\/div><\/body><\/html>');"; 
            // console.log("mgid: " + mgid);
            var requestTime = Date.now();
            if (jQuery('#adsScript').length > 0) {
                jQuery('#adsScript').remove();
            }
            // jQuery('#adsCheck').reomove();
            createIframe(clientWidth, clientHeight, scriptCode);
            try{
                if (typeof parent.AdObject !== 'undefined') {
                    // if (parent.AdObject.lastTimeShow == 0) {
                    parent.AdObject.lastTimeShow = Date.now();
                    // }
                }
            }catch(e){
                console.log(e);
            }
            
            // if (AdObject.lastTimeShow == 0) {
            AdObject.lastTimeShow = Date.now();
            // }
            // console.log("AdObject: " + AdObject.lastTimeShow + " - parent:" + parent.AdObject.lastTimeShow);
            // });
        }else{
            console.log("------------ show ads");
        }

    },
    showAdCallBack: function(callback) {
        this.showAdCallBack3(callback);
    },
    showAdCallBack2: function(callback) {
        this.showAdCallBack3(callback);
    },
    showAdCallBack3: function(callback) {
        if (showAdFlag) {
            run = true;
            runLoopCheckTimeOut = true;
            txIndex = 15;
            timeOutMessageResponse = 10;
            checkTimeOut();
            // var $ = jQuery.noConflict();
            // jQuery(function($) {
            var adsCodeResp;
            // this.adsCodeResp = response;
            // this.adsType = Math.floor(Math.random() * 9 + 2);
            // var mgid = 0;
            // adsCode = adsCode.replace(/(?:\r\n|\r|\n|\t)/g, '').replace(/[\/]/gi, '\/').replace(/['"]/gi, '\"');
            // if (adsCode === '') {
            //     adsCode = "<img src=\"" +hostStr+ imgErr + "\"/>";
            // }

            // var clientHeight = document.documentElement.clientHeight;
            // var clientWidth = document.documentElement.clientWidth;
            var clientHeight = jQuery(window).height();
            var clientWidth = jQuery(window).width();
            // alert(clientWidth +" - "+clientHeight);
            var scriptCode = makeScriptCode2(callback);
            // scriptCode = "document.getElementById('adsFrame').contentWindow.document.write('<html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\"><style type=\"text\/css\">.container{width: 100%;background: white;position: relative; height: 100vh;}<\/style><script type=\"text\/javascript\" src=\"function/jquery-3.2.1.min.js\"></script><\/head><body><div class=\"container\" style=\"width: 100%; height: 102vh; vertical-align: middle;\"><div style=\"position: absolute; width: 70%; height: auto; margin: auto; top: 50%;left: 50%; transform: translate(-50%, -50%);\">" + adsCode + "</div><div style=\"clear: both;\"><\/div><br\/><br\/><div id=\"skipAds\" style=\"right: 20px; bottom: 20px;  position: absolute; background: white; z-index: 1000; width: 10%, height: 50px; margin-right: 2%; margin-bottom: 20px; border: 1px solid; padding: 2px 2px; display: none;\"><font color=\"black\">Skip this ads</font><\/div><script type=\"text\/javascript\">jQuery(\"#skipAds\").css(\"display\", \"\");for(var i = 5; i >=0 ; i--){(function(index) {setTimeout(function(){console.log(index);if(index === 0){jQuery(\"#skipAds\").html(\"Skip this ads\");jQuery(\"#skipAds\").click(function(iframe){var frame = parent.document.getElementById(\"adsFrame\");frame.parentNode.removeChild(frame); window.parent.jQuery(\"#adsScript\").remove();});}else{jQuery(\"#skipAds\").html(\"Skip this ads in \"+index+\" seconds\");}}, 5000 - (1000 * index));})(i);}</script><\/div><\/body><\/html>');"; 
            // console.log("mgid: " + mgid);
            var requestTime = Date.now();
            if (jQuery('#adsScript').length > 0) {
                jQuery('#adsScript').remove();
            }
            // jQuery('#adsCheck').reomove();
            createIframe(clientWidth, clientHeight, scriptCode);
            AdObject.lastTimeRank = Date.now();
            try{
                if (typeof parent.AdObject !== 'undefined') {
                    // if (parent.AdObject.lastTimeShow == 0) {
                    parent.AdObject.lastTimeShow = Date.now();
                    // }
                }
            }catch(e){
                console.log(e);
            }
            // if (AdObject.lastTimeShow == 0) {
            AdObject.lastTimeShow = Date.now();
            // }


            try{
                if (typeof parent.AdObject !== 'undefined') {
                    // if (parent.AdObject.lastTimeShow == 0) {
                    parent.AdObject.callBackFuntion = callback;
                    // }
                }
            }catch(e){
                AdObject.callBackFuntion = callback;
            }

            // try{
            //     if (typeof parent.callBaclFn !== 'undefined') {
            //         parent.callBaclFn = callback;
            //     } else {
            //         callBaclFn = callback;
            //     }
            // }catch(e){
            //     callBaclFn = callback;
            // }
        } else {
            console.log("------------ show ads");
            callback();
        }

        // jQuery("#adsFrame").contents().find("#skipAds").click(function() {
        //     console.log("");
        //     callback();
        // });
        // setTimeout(function(){
        //     callback();
        // }, 2000);
        // });
    },
    // init: function(randomShow, showFirstVar) {
    init: function(timeCheckInit) {
        // var $ = jQuery.noConflict();
        // timeCheck = timeCheckVar;
        // timeCheckShow = timeCountCheck;
        // showFirst = showFirstVar;
        // lastRandomShow = 0;
        // var items = Array(0, 1, 2);
        // type = items[Math.floor(Math.random() * items.length)];
        // typeBanner = Math.floor(Math.random() * 9 + 2);
        // jQuery(function($) {
        try {
            hostStr = host;
        } catch (e) {
            hostStr = window.parent.host;
        }

        
        

        // console.log(window.parent.location.protocol+"\/\/"+window.parent.location.hostname);
        var items = Array(2, 2, 2);
        var item = items[Math.floor(Math.random() * items.length)];

        var ios = getMobileOperatingSystem();

        if (ios === 'iOS') {
            item = 1;
        }

        jQuery.get('' + hostStr + 'function/config', function(data) {
            // console.log(data);
            var arr = data.split("\n");
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].startsWith("#ads")) {
                    var group = getParamValue("group");
                    if (typeof group === 'undefined') {
                        group = 1;
                    }
                    adsCodeType = item;
                    // console.log(group);
                    urlAds = arr[i].split(";")[0].split("|")[1].replace("type=2", "type=" + item).replace("group=x", "group=" + group);
                    // console.log(urlAds);
                    imgErr = arr[i].split(";")[1].split("|")[1];
                    // AdObject.timeCheck = arr[i].split(";")[2].split("|")[1];
                    // if (typeof parent.AdObject !== 'undefined') {
                    //     parent.AdObject.timeCheck = arr[i].split(";")[2].split("|")[1];
                    // }
                    // console.log(1);
                    // console.log(urlAds);
                    AdObject.timeCheck = timeCheckInit;
                    try{
                        if (typeof parent.AdObject !== 'undefined') {
                            parent.AdObject.timeCheck = timeCheckInit;
                        }
                    }catch(e){
                        console.log(e);;
                    }
                    break
                }
            }

            // jQuery.ajax({
            //     url: urlAds,
            //     dataType: 'text',
            //     type: 'post',
            //     cors: true,
            //     secure: true,
            //     headers: {
            //         'Access-Control-Allow-Origin': '*',
            //         'Access-Control-Allow-Headers': '*'
            //     },
            //     success: function(response) {
            //         // console.log(response);
            //         adsCode = response;
            //     },
            //     error: function(XMLHttpRequest, textStatus, errorThrown) {
            //         jQuery("<div id='adsBlock' style='position: absolute; left: 0; top: 0; display: inline-block;z-index: 1000; width: 100%; height: 100vh; background-color: orange; text-align: center; vertical-align: middle;'><div style='position: relative;float: left;top: 50%;left: 50%;transform: translate(-50%, -50%);'>Đã xảy ra lỗi trong quá trình tải game!<br/>Vui lòng bấm vào <a style='cursor: pointer; color: blue;' onclick='location.reload()'>đây</a> hoặc bấm f5 để load lại game!<br/>Xin cảm ơn!</div></div>").appendTo("body");
            //     }
            // });
        }, 'text');
        // jQuery('<link rel="stylesheet" href="function/css/style2.css">').appendTo('head');

        jQuery(document).ready(function() {
            // clearInterval(intervalVar);
            // jQuery("<iframe id='ads' style='width: 1px; height: 1px;' src='" + hostStr + "function/ads/show.html' frameborder='0' scrolling='no'></iframe>").appendTo("body");
            // setTimeout(function() {
            //     jQuery('iframe#adsCheck').ready(function() {
            //         var adsCss = jQuery("iframe#ads").css("display");
            //         if (adsCss.indexOf("none") !== -1) {
            //             jQuery("<div id='adsBlock' style='position: absolute; left: 0; top: 0; display: inline-block;z-index: 1000; width: 100%; height: 100vh; background-color: orange; text-align: center; vertical-align: middle;'><div style='position: relative;float: left;top: 50%;left: 50%;transform: translate(-50%, -50%);'>Bạn đang sử dụng Adblock hoặc chương trình chặn quảng cáo!<br/>Vui lòng tắt chúng để giúp chúng tôi duy trì hệ thống!<br/>Sau khi tắt chúng, vui lòng bấm vào <a style='cursor: pointer; color: blue;' onclick='location.reload()'>đây</a> hoặc bấm f5 để load lại game!<br/>Xin cảm ơn!</div></div>").appendTo("body");
            //             // var frame = parent.document.getElementById("ads");
            //             var frame = jQuery('#ads');
            //             frame.remove();
            //             // frame.parentNode.removeChild(frame);
            //         } else {
            //             // var frame = parent.document.getElementById("#ads");
            //             var frame = jQuery('#ads');
            //             var iframeBodyContent = frame.contents().find(".container");
            //             // var iframeDocument = frame.contentDocument;
            //             // if(typeof(iframeDocument) == 'undefined'){
            //             //     iframeDocument =  frame.contentWindow.document
            //             // }
            //             // var iframeBodyContent = iframeDocument.body.innerHTML;
            //             // if (iframeBodyContent === "" || iframeBodyContent.toUpperCase().indexOf("file not found") !== -1) {
            //             if (iframeBodyContent == null || typeof(iframeBodyContent) == 'undefined') {
            //                 jQuery("<div id='adsBlock' style='position: absolute; left: 0; top: 0; display: inline-block;z-index: 1000; width: 100%; height: 100vh; background-color: orange; text-align: center; vertical-align: middle;'><div style='position: relative;float: left;top: 50%;left: 50%;transform: translate(-50%, -50%);'>Bạn đang sử dụng Adblock hoặc chương trình chặn quảng cáo!<br/>Vui lòng tắt chúng để giúp chúng tôi duy trì hệ thống!<br/>Sau khi tắt chúng, vui lòng bấm vào <a style='cursor: pointer; color: blue;' onclick='location.reload()'>đây</a> hoặc bấm f5 để load lại game!<br/>Xin cảm ơn!</div></div>").appendTo("body");
            //                 frame.remove();
            //             } else {
            //                 frame.remove();

            //                 // if (randomShow) {
            //                 //     intervalVar = setInterval(showAdRandom, 30000);
            //                 // } else {

            //                 //     lastTimeShow = Date.now();
            //                 //     showFirstTime = true;
            //                 // }
            //             }
            //         }
            //     });
            // }, 3000);
        });
        // });
    },
    getLastTimeShow: function() {
        if (typeof lastTimeShow === 'undefined') {
            return null;
        } else {
            return lastTimeShow;
        }
    }
}

function setLastTimeShow(lastTime) {
    lastTimeShow = lastTime;
}

// function showAdRandom() {
//     // var itemTimes = Array(1, 2, 3, 4, 5);
//     // var time = itemTimes[Math.floor(Math.random() * itemTimes.length)];
//     // console.log(time);
//     // var time = 30;
//     // if(Date.now() - lastRandomShow >= time * 1000){
//     if (jQuery('#adsScript').length > 0) {
//         jQuery('#adsScript').remove();
//     }
//     adsCode = adsCode.replace(/(?:\r\n|\r|\n|\t)/g, '').replace(/[\/]/gi, '\/').replace(/['"]/gi, '\"');

//     var clientHeight = jQuery(document).height(); 
//     var clientWidth = jQuery(document).width(); 
//     var scriptCode = makeScriptCode();
//     createIframe(clientWidth, clientHeight, scriptCode);
//     // lastRandomShow = Date.now();
//     // }

// }

function createIframe(width, height, scriptCode) {
    var $ = jQuery.noConflict();
    // jQuery(function($) {
    var body = document.body;
    // jQuery("<iframe id='adsFrame' style='display: none; width: " + width + "px; height: " + height + "px; position: fixed; z-index: 9999; top: 0; left: 0;' frameborder='0' scrolling='no'></iframe>").insertBefore(body.firstChild);
    if(jQuery("#adsFrame").length == 0){
        jQuery("<iframe id='adsFrame' style='display: none; width: " + width + "px; height: 100%; position: fixed; z-index: 9999; top: 0; left: 0;' frameborder='0' scrolling='no'></iframe>").insertBefore(body.firstChild);
    

        jQuery('<script id="adsScript">')
            .attr('type', 'text/javascript')
            .text(scriptCode)
            .append('</script>').appendTo('body');
    // });
    }
}

function makeScriptCode() {
    var $ = jQuery.noConflict();
    // jQuery(function($) {
    var clientHeight = jQuery(window).height();
    var clientWidth = jQuery(window).width();
    var scriptCode;

    var skipAdsCode = "";
    // skipAdsCode += '<div style="bottom: 20px; width: 100%; height: 50px; position: absolute;">';
    // skipAdsCode += '<div id="skipAds" style="margin-right: 40px; width: auto; float: right; bottom: 50px; background: white; z-index: 1000;  border: 1px solid; padding: 2px; font: regular 18px arial;"><span id="textSkip" style="color: black;">Skip this ads<\/span><\/div>';
    // skipAdsCode += '<div style="clear: both;"><\/div>';
    // skipAdsCode += '<div id="adsBy" style="width: auto; float: left; margin-left: 40px; bottom: 50px; z-index: 1000; padding: 2px; font: regular 18px arial;"><span id="txtBy" style="color: black;"><\/span><\/div>';
    // skipAdsCode += '<div id="autoSkipAds" style="margin-right: 40px; width: auto; float: right; margin-top: 5px; z-index: 1000; margin-bottom: 20px; padding: 2px; font-size: 12px;"><span id="textAutoSkip" style="color: black;">Ad will close in 0:12<\/span><\/div>';
    // skipAdsCode += '<script type="text\/javascript">';
    // skipAdsCode += 'setInterval(function(){';
    // skipAdsCode += 'if(jQuery(".mgheader").length > 0){';
    // skipAdsCode += '    jQuery(".mgheader").remove();';
    // skipAdsCode += '    jQuery("#txtBy").html("Ad by mGid");';
    // skipAdsCode += '}else if(jQuery(".SC_TBlock_265262_ads-modal-button").length > 0){';
    // skipAdsCode += '    jQuery(".SC_TBlock_265262_ads-modal-button").remove();';
    // skipAdsCode += '    var div = jQuery("#SC_TBlock_265262 div")[0];';
    // skipAdsCode += '    jQuery(div).css("style","padding: 0px; margin: 0px;");';
    // skipAdsCode += '    jQuery("#txtBy").html("Ad by Adnow");';
    // skipAdsCode += '}else if(jQuery(".adsbygoogle").length > 0){';
    // skipAdsCode += '    jQuery("#txtBy").html("Ad by Google");';
    // skipAdsCode += '}';
    skipAdsCode += '<div style="bottom: 20px; width: 100%; height: 50px; position: absolute;">';
    skipAdsCode += '<div id="skipAds" style="margin-right: 5px; width: auto; float: right; bottom: 50px; background: white; z-index: 1000;  border: 1px solid; padding: 2px; font: regular 10% arial;"><span id="textSkip" style="color: black;">Skip this ads<\/span><\/div>';
    skipAdsCode += '<div style="clear: both;"><\/div>';
    skipAdsCode += '<div id="adsBy" style="width: auto; float: left; margin-left: 40px; bottom: 50px; z-index: 1000; padding: 2px; font: regular 18px arial;"><span id="txtBy" style="color: black;"><\/span><\/div>';
    skipAdsCode += '<div id="autoSkipAds" style="margin-right: 5px; width: auto; float: right; margin-top: 5px; z-index: 1000; margin-bottom: 20px; padding: 2px; font-size: 12px;"><span id="textAutoSkip" style="color: black;">Ad will close in 0:12<\/span><\/div>';
    skipAdsCode += '<script type="text\/javascript">';
    skipAdsCode += 'setInterval(function(){';
    // skipAdsCode += 'var adunit = jQuery("#adsFrame").contents().find("iframe").contents().find("iframe").contents().find("google_ads_frame1").contents(),find("cbb"); if(typeof adunit !== "undefined" && adunit != null){console.log("adsense is loaded!");}';
    // skipAdsCode += 'if(jQuery(".mgheader").length > 0){';
    // skipAdsCode += '    jQuery(".mgheader").remove();';
    // // skipAdsCode += '    jQuery("#txtBy").html("Ad by mGid");';
    // skipAdsCode += '}else if(jQuery(".SC_TBlock_265262_ads-modal-button").length > 0){';
    // skipAdsCode += '    jQuery(".SC_TBlock_265262_ads-modal-button").remove();';
    // skipAdsCode += '    var div = jQuery("#SC_TBlock_265262 div")[0];';
    // skipAdsCode += '    jQuery(div).css("style","padding: 0px; margin: 0px;");';
    // // skipAdsCode += '    jQuery("#txtBy").html("Ad by Adnow");';
    // skipAdsCode += '}else if(jQuery(".adsbygoogle").length > 0){';
    // // skipAdsCode += '    jQuery("#txtBy").html("Ad by Google");';
    // skipAdsCode += '}';

    // console.log("adsCodeType: " + adsCodeType); 

    if (adsCodeType == 1) {
        skipAdsCode += 'jQuery("#txtBy").html("Ad by mGid");';
    } else if (adsCodeType == 0) {
        skipAdsCode += 'jQuery("#txtBy").html("Ad by Adnow");';
    } else if (adsCodeType == 2) {
        skipAdsCode += 'jQuery("#txtBy").html("Ad by Google");'; 
    }


    skipAdsCode += '}, 10);';
    // skipAdsCode += 'jQuery("#skipAds").css("display", "");';
    // skipAdsCode += ' for (var i = 5; i >= 0; i--) {';
    // skipAdsCode += '    (function(index) {';
    // skipAdsCode += '        setTimeout(function() {';
    // skipAdsCode += '   if (index === 0) {';
    // // skipAdsCode += ' jQuery("#skipAds").html("<span id=textSkip style=color:black;>Skip this ads<\/span><img style=margin-right:10px;margin-left:3px;max-width:15px;max-heigh:15px; src=function\/img\/skip.png \/>");';
    // skipAdsCode += ' jQuery("#skipAds").html("<span id=textSkip style=color:black;font-size:25px;>Skip this ads<\/span><img style=margin-right:10px;margin-left:3px;max-width:15px;max-heigh:15px; src='+hostStr+'function\/img\/skip.png \/>");';
    // skipAdsCode += ' jQuery("#skipAds").click(function(iframe) {';
    // skipAdsCode += '    console.log("----checkAdBackVar: "+parent.checkAdBackVar); if(parent.checkAdBackVar == true){console.log("----checkAdBackVar: "+parent.checkAdBackVar) ;window.parent.parent.jQuery("#scoreFrame").css({"display":"none", "z-index":"-1"});} parent.checkAdBackVar = false;  var frame = parent.document.getElementById("adsFrame");';
    // skipAdsCode += '    frame.parentNode.removeChild(frame);';
    // skipAdsCode += '  window.parent.jQuery("#adsScript").remove();';
    // skipAdsCode += ' });';
    // skipAdsCode += '} else {';
    // // skipAdsCode += '     jQuery("#textSkip").html("You can skip this ad in " + index+"  ");';
    // skipAdsCode += 'jQuery("#skipAds").html("<span id=textSkip style=color:black;font-size:25px;>You can skip this ad in " + index+"  <\/span>");';
    // // skipAdsCode += '     jQuery("#textSkip").html("You can skip this ad in " + index+"  ");';
    // skipAdsCode += ' }';
    // skipAdsCode += ' }, 5000 - (1000 * index));';
    // skipAdsCode += '})(i);';
    // skipAdsCode += ' }';
    // skipAdsCode += 'for (var i = 150; i >= 0; i--) {';
    // skipAdsCode += '(function(index) {';
    // skipAdsCode += '  setTimeout(function() {';
    // skipAdsCode += '    if (index === 0) {';
    // skipAdsCode += '      var frame = parent.document.getElementById("adsFrame");';
    // skipAdsCode += '         frame.parentNode.removeChild(frame);';
    // skipAdsCode += '        window.parent.jQuery("#adsScript").remove();';
    // skipAdsCode += ' } else {';
    // skipAdsCode += '    if(index < 10){';
    // skipAdsCode += '        jQuery("#textAutoSkip").html("Ad will close in 0:0" + index);';
    // skipAdsCode += '    }else{';
    // skipAdsCode += '    jQuery("#textAutoSkip").html("Ad will close in 0:" + index);';
    // skipAdsCode += '}';
    // skipAdsCode += '}';
    // skipAdsCode += ' }, 150000 - (1000 * index));';
    // skipAdsCode += ' })(i);';
    // skipAdsCode += ' }';
    skipAdsCode += '<\/script>';
    skipAdsCode += '<\/div>';

    skipAdsCode += '<\/div>';
    // scriptCode = "document.getElementById('adsFrame').contentWindow.document.write('<html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\"><style type=\"text\/css\">.container{width: " + clientWidth + "px; height: " + clientHeight + "px; background: white;position: relative;background: -webkit-linear-gradient(#ededed, white);background: -o-linear-gradient(#ededed, white;background: -moz-linear-gradient(#ededed, white);background: linear-gradient(#ededed, white);}<\/style><script type=\"text\/javascript\" src=\""+hostStr+"function/jquery-3.2.1.min.js\"><\/script><\/head><body><div class=\"container\" style=\"width: 100%; height: 100%; position: fixed; top: 0; left: 0;\"><div style=\"position: absolute;  min-width: 300px; min-height: 250px; margin: auto; top: 50%;left: 50%; transform: translate(-50%, -50%);\">" + adsCode + "<\/div><div style=\"clear: both;\"><\/div><br\/><br\/>" + skipAdsCode + "<\/div><\/div><\/body><\/html>'); var jQuery = jQuery.noConflict(); jQuery('#adsFrame').fadeIn(2000);";
    // scriptCode = "document.getElementById('adsFrame').contentWindow.document.write('<html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\"><style type=\"text\/css\">.container{width: " + clientWidth + "px; height: " + clientHeight + "px; background: white;position: relative;background: -webkit-linear-gradient(#ededed, white);background: -o-linear-gradient(#ededed, white;background: -moz-linear-gradient(#ededed, white);background: linear-gradient(#ededed, white);}<\/style><script type=\"text\/javascript\" src=\""+hostStr+"function/jquery-3.2.1.min.js\"><\/script><\/head><body><div class=\"container\" style=\"width: 100%; height: 100%; position: fixed; top: 0; left: 0;\"><div style=\"position: absolute; width: 60%; height: 60%; min-width: 300px; min-height: 250px; margin: auto; top: 50%;left: 50%; transform: translate(-50%, -50%);\">" + "<iframe src=\"http:\/\/123gamescenter.com\/api\/ads-fullscreen.php?type="+adsCodeType+"&group=1\" width=\"100%\" height=\"100%\"  frameborder=\"0\" scrolling=\"no\"><\/iframe>" + "<\/div><div style=\"clear: both;\"><\/div><br\/><br\/>" + skipAdsCode + "<\/div><\/div><\/body><\/html>'); var jQuery = jQuery.noConflict(); jQuery('#adsFrame').fadeIn(2000);";
    scriptCode = "document.getElementById('adsFrame').contentWindow.document.write('<html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\"><style type=\"text\/css\">.container{width: " + clientWidth + "px; height: " + clientHeight + "px; background: white;position: relative;background: -webkit-linear-gradient(#ededed, white);background: -o-linear-gradient(#ededed, white;background: -moz-linear-gradient(#ededed, white);background: linear-gradient(#ededed, white);}<\/style><script type=\"text\/javascript\" src=\"" + hostStr + "function/jquery-3.2.1.min.js\"><\/script><\/head><body><div class=\"container\" style=\"width: 100%; height: 100%; position: fixed; top: 0; left: 0;\"><div style=\"position: absolute; width: 60%; height: 60%; min-width: 300px; min-height: 250px; margin: auto; top: 50%;left: 50%; transform: translate(-50%, -50%); z-index: 99999;\">" + "<iframe src=\"" + urlAds + "\" width=\"100%\" height=\"100%\"  frameborder=\"0\" scrolling=\"no\"><\/iframe>" + "<\/div><div style=\"clear: both;\"><\/div><br\/><br\/>" + skipAdsCode + "<\/div><\/div><\/body><\/html>'); var jQuery = jQuery.noConflict(); jQuery('#adsFrame').fadeIn(2000);";
    // }
    return scriptCode;
    // });
}

function makeScriptCode2(callback) {
    var $ = jQuery.noConflict();
    // jQuery(function($) {
    var clientHeight = jQuery(window).height();
    var clientWidth = jQuery(window).width();
    var scriptCode;

    var skipAdsCode = "";

    skipAdsCode += '<div style="bottom: 20px; width: 100%; height: 50px; position: absolute;">';
    skipAdsCode += '<div id="skipAds" style="margin-right: 5px; width: auto; float: right; bottom: 50px; background: white; z-index: 1000;  border: 1px solid; padding: 2px; font: regular 10% arial;"><span id="textSkip" style="color: black;">Skip this ads<\/span><\/div>';
    skipAdsCode += '<div style="clear: both;"><\/div>';
    skipAdsCode += '<div id="adsBy" style="width: auto; float: left; margin-left: 40px; bottom: 50px; z-index: 1000; padding: 2px; font: regular 18px arial;"><span id="txtBy" style="color: black;"><\/span><\/div>';
    skipAdsCode += '<div id="autoSkipAds" style="margin-right: 5px; width: auto; float: right; margin-top: 5px; z-index: 1000; margin-bottom: 20px; padding: 2px; font-size: 12px;"><span id="textAutoSkip" style="color: black;">Ad will close in 0:12<\/span><\/div>';
    skipAdsCode += '<script type="text\/javascript">';
    skipAdsCode += 'setInterval(function(){'; 

    if (adsCodeType == 1) {
        skipAdsCode += 'jQuery("#txtBy").html("Ad by mGid");';
    } else if (adsCodeType == 0) {
        skipAdsCode += 'jQuery("#txtBy").html("Ad by Adnow");';
    } else if (adsCodeType == 2) {
        skipAdsCode += 'jQuery("#txtBy").html("Ad by Google");';
    }

    skipAdsCode += '}, 10);';
    // skipAdsCode += 'jQuery("#skipAds").css("display", "");';
    // skipAdsCode += ' for (var i = 5; i >= 0; i--) {';
    // skipAdsCode += '    (function(index) {';
    // skipAdsCode += '        setTimeout(function() {';
    // skipAdsCode += '   if (index === 0) {';
    // // skipAdsCode += ' jQuery("#skipAds").html("<span id=textSkip style=color:black;>Skip this ads<\/span><img style=margin-right:10px;margin-left:3px;max-width:15px;max-heigh:15px; src=function\/img\/skip.png \/>");';
    // skipAdsCode += ' jQuery("#skipAds").html("<span id=textSkip style=color:black;font-size:25px;>Skip this ads<\/span><img style=margin-right:10px;margin-left:3px;max-width:15px;max-heigh:15px; src='+hostStr+'function\/img\/skip.png \/>");';
    // skipAdsCode += ' jQuery("#skipAds").click(function(iframe) {';
    // skipAdsCode += '   parent.postMessage({"callBackFnCalled":1}, "*"); console.log("----checkAdBackVar: "+parent.checkAdBackVar); if(parent.checkAdBackVar == true){console.log("----checkAdBackVar: "+parent.checkAdBackVar) ;window.parent.parent.jQuery("#scoreFrame").css({"display":"none", "z-index":"-1"});} parent.checkAdBackVar = false;  var frame = parent.document.getElementById("adsFrame");';
    // skipAdsCode += '    frame.parentNode.removeChild(frame);';
    // skipAdsCode += '  window.parent.jQuery("#adsScript").remove();';
    // skipAdsCode += ' });';
    // skipAdsCode += '} else {';
    // // skipAdsCode += '     jQuery("#textSkip").html("You can skip this ad in " + index+"  ");';
    // skipAdsCode += 'jQuery("#skipAds").html("<span id=textSkip style=color:black;font-size:25px;>You can skip this ad in " + index+"  <\/span>");';
    // // skipAdsCode += '     jQuery("#textSkip").html("You can skip this ad in " + index+"  ");';
    // skipAdsCode += ' }';
    // skipAdsCode += ' }, 5000 - (1000 * index));';
    // skipAdsCode += '})(i);';
    // skipAdsCode += ' }';
    // skipAdsCode += 'for (var i = 15; i >= 0; i--) {';
    // skipAdsCode += '(function(index) {';
    // skipAdsCode += '  setTimeout(function() {';
    // skipAdsCode += '    if (index === 0) {';
    // skipAdsCode += '      parent.postMessage({"callBackFnCalled":1}, "*"); var frame = parent.document.getElementById("adsFrame");';
    // skipAdsCode += '         frame.parentNode.removeChild(frame);';
    // skipAdsCode += '        window.parent.jQuery("#adsScript").remove();';
    // skipAdsCode += ' } else {';
    // skipAdsCode += '    if(index < 10){';
    // skipAdsCode += '        jQuery("#textAutoSkip").html("Ad will close in 0:0" + index);';
    // skipAdsCode += '    }else{';
    // skipAdsCode += '    jQuery("#textAutoSkip").html("Ad will close in 0:" + index);';
    // skipAdsCode += '}';
    // skipAdsCode += '}';
    // skipAdsCode += ' }, 15000 - (1000 * index));';
    // skipAdsCode += ' })(i);';
    // skipAdsCode += ' }';
    skipAdsCode += '<\/script>';
    skipAdsCode += '<\/div>';

    skipAdsCode += '<\/div>';
    // scriptCode = "document.getElementById('adsFrame').contentWindow.document.write('<html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\"><style type=\"text\/css\">.container{width: " + clientWidth + "px; height: " + clientHeight + "px; background: white;position: relative;background: -webkit-linear-gradient(#ededed, white);background: -o-linear-gradient(#ededed, white;background: -moz-linear-gradient(#ededed, white);background: linear-gradient(#ededed, white);}<\/style><script type=\"text\/javascript\" src=\""+hostStr+"function/jquery-3.2.1.min.js\"><\/script><\/head><body><div class=\"container\" style=\"width: 100%; height: 100%; position: fixed; top: 0; left: 0;\"><div style=\"position: absolute;  min-width: 300px; min-height: 250px; margin: auto; top: 50%;left: 50%; transform: translate(-50%, -50%);\">" + adsCode + "<\/div><div style=\"clear: both;\"><\/div><br\/><br\/>" + skipAdsCode + "<\/div><\/div><\/body><\/html>'); var jQuery = jQuery.noConflict(); jQuery('#adsFrame').fadeIn(2000);";
    // scriptCode = "document.getElementById('adsFrame').contentWindow.document.write('<html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\"><style type=\"text\/css\">.container{width: " + clientWidth + "px; height: " + clientHeight + "px; background: white;position: relative;background: -webkit-linear-gradient(#ededed, white);background: -o-linear-gradient(#ededed, white;background: -moz-linear-gradient(#ededed, white);background: linear-gradient(#ededed, white);}<\/style><script type=\"text\/javascript\" src=\""+hostStr+"function/jquery-3.2.1.min.js\"><\/script><\/head><body><div class=\"container\" style=\"width: 100%; height: 100%; position: fixed; top: 0; left: 0;\"><div style=\"position: absolute; width: 60%; height: 60%; min-width: 300px; min-height: 250px; margin: auto; top: 50%;left: 50%; transform: translate(-50%, -50%);\">" + "<iframe src=\"http:\/\/123gamescenter.com\/api\/ads-fullscreen.php?type="+adsCodeType+"&group=1\" width=\"100%\" height=\"100%\"  frameborder=\"0\" scrolling=\"no\"><\/iframe>" + "<\/div><div style=\"clear: both;\"><\/div><br\/><br\/>" + skipAdsCode + "<\/div><\/div><\/body><\/html>'); var jQuery = jQuery.noConflict(); jQuery('#adsFrame').fadeIn(2000);";
    scriptCode = "document.getElementById('adsFrame').contentWindow.document.write('<html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\"><style type=\"text\/css\">.container{width: " + clientWidth + "px; height: " + clientHeight + "px; background: white;position: relative;background: -webkit-linear-gradient(#ededed, white);background: -o-linear-gradient(#ededed, white;background: -moz-linear-gradient(#ededed, white);background: linear-gradient(#ededed, white);}<\/style><script type=\"text\/javascript\" src=\"" + hostStr + "function/jquery-3.2.1.min.js\"><\/script><\/head><body><div class=\"container\" style=\"width: 100%; height: 100%; position: fixed; top: 0; left: 0;\"><div style=\"position: absolute; width: 60%; height: 60%; min-width: 300px; min-height: 250px; margin: auto; top: 50%;left: 50%; transform: translate(-50%, -50%);  z-index: 99999;\">" + "<iframe src=\"" + urlAds + "\" width=\"100%\" height=\"100%\"  frameborder=\"0\" scrolling=\"no\"><\/iframe>" + "<\/div><div style=\"clear: both;\"><\/div><br\/><br\/>" + skipAdsCode + "<\/div><\/div><\/body><\/html>'); var jQuery = jQuery.noConflict(); jQuery('#adsFrame').fadeIn(2000);";
    // }
    return scriptCode;
    // });


}


window.addEventListener("resize", function() {
    var $ = jQuery.noConflict();
    // jQuery(function($) {
    var clientHeight = jQuery(window).height();
    var clientWidth = jQuery(window).width();
    jQuery('#adsFrame').css("width", clientWidth);
    // });
});

function receiveCallBackCalled(event) {
    if (event.data.callBackFnCalled == 1) {
        // console.log(1);
        try{
            if (typeof parent.callBaclFn !== 'undefined') {
                parent.callBaclFn();
            } else {
                callBaclFn();
            }
        }catch(e){
            try{
                callBaclFn();
            }catch(e){

            }
        }

        try{
            if (typeof parent.AdObject.callBackFuntion !== 'undefined') {
                parent.AdObject.callBackFuntion();
            } else {
                AdObject.callBackFuntion();
            }
        }catch(e){
            try{
                AdObject.callBackFuntion();
            }catch(e){

            }
        }
    } else {
        // console.log(0);
    }

    receiveAdsLoaded(event);
}

addEventListener("message", receiveCallBackCalled, false);


function receiveAdsLoaded(event) {
    if (event.data.adsLoaded == 1) {
        // alert(1);
        console.log(event.data.adsbygoogle);
        runLoopCheckTimeOut = false;
        try{
            if(typeof parent.runLoopCheckTimeOut !== 'undefined'){
                parent.runLoopCheckTimeOut = false;
            }
        }catch(e){

        }
        jQuery("#adsFrame").contents().find("#skipAds").css("display", "");

        setTimeout(function(){
            var clickSkipVar = true;
            for (var i = 5; i >= 0; i--) {
                (function(index) {
                    setTimeout(function() {
                        if (index === 0) {
                            //  jQuery("#skipAds").html("<span id=textSkip style=color:black;>Skip this ads<\/span><img style=margin-right:10px;margin-left:3px;max-width:15px;max-heigh:15px; src=function\/img\/skip.png \/>");
                            jQuery("#adsFrame").contents().find("#skipAds").html("<span id=textSkip style=color:black;font-size:70%;>Skip this ads<\/span><img style=margin-right:10px;margin-left:3px;max-width:15px;max-heigh:15px; src="+hostStr+"function\/img\/skip.png \/>");
                            jQuery("#adsFrame").contents().find("#skipAds").click(function(iframe) {
                                run = false;
                                try{
                                    window.parent.jQuery("#scoreFrame").css({"display":"none", "z-index":"-1"}); 
                                    // if (typeof parent.callBaclFn !== 'undefined') {
                                    //     parent.postMessage({
                                    //         "callBackFnCalled": 1
                                    //     }, "*");
                                    // } else if (typeof callBaclFn !== 'undefined') {
                                    //     window.postMessage({
                                    //         "callBackFnCalled": 1
                                    //     }, "*");
                                    // }
                                    if (typeof parent.AdObject.callBackFuntion !== 'undefined') {
                                        parent.postMessage({
                                            "callBackFnCalled": 1
                                        }, "*");
                                    } else if (typeof AdObject.callBackFuntion !== 'undefined') {
                                        window.postMessage({
                                            "callBackFnCalled": 1
                                        }, "*");
                                    }
                                }catch(e){
                                    jQuery("#scoreFrame").css({"display":"none", "z-index":"-1"});
                                    // if (typeof callBaclFn !== 'undefined') {
                                    //     try{
                                    //         parent.postMessage({
                                    //             "callBackFnCalled": 1
                                    //         }, "*");
                                    //     }catch(e){
                                    //         window.postMessage({
                                    //             "callBackFnCalled": 1
                                    //         }, "*");
                                    //     }
                                    try{
                                        if (typeof parent.AdObject.callBackFuntion !== 'undefined') {
                                            parent.postMessage({
                                                "callBackFnCalled": 1
                                            }, "*");
                                        } else if (typeof AdObject.callBackFuntion !== 'undefined') {
                                            window.postMessage({
                                                "callBackFnCalled": 1
                                            }, "*");
                                        }
                                    }catch(e){
                                        window.postMessage({
                                            "callBackFnCalled": 1
                                        }, "*");
                                    }
                                }
                                // console.log(1);

                                try{
                                    if(typeof parent.checkAdBackVar !== 'undefined'){
                                        // console.log("----checkAdBackVar: " + parent.checkAdBackVar);
                                        if (parent.checkAdBackVar == true) {
                                            // console.log("----checkAdBackVar: " + parent.checkAdBackVar);
                                            window.parent.parent.jQuery("#scoreFrame").css({
                                                "display": "none",
                                                "z-index": "-1"
                                            });
                                        }
                                        parent.checkAdBackVar = false;
                                    }else if(typeof checkAdBackVar !== 'undefined'){
                                        if (checkAdBackVar == true) {
                                            // console.log("----checkAdBackVar: " + parent.checkAdBackVar);
                                            window.parent.jQuery("#scoreFrame").css({
                                                "display": "none",
                                                "z-index": "-1"
                                            });
                                        }
                                        parent.checkAdBackVar = false;
                                    }
                                    var frame = parent.document.getElementById("adsFrame");
                                    if(frame == null){
                                        frame = document.getElementById("adsFrame");
                                    }
                                    frame.parentNode.removeChild(frame);
                                    window.parent.jQuery("#adsScript").remove();
                                }catch(e){
                                    if(typeof checkAdBackVar !== 'undefined'){
                                        if (checkAdBackVar == true) {
                                            // console.log("----checkAdBackVar: " + parent.checkAdBackVar);
                                            window.parent.jQuery("#scoreFrame").css({
                                                "display": "none",
                                                "z-index": "-1"
                                            });
                                        }
                                        checkAdBackVar = false;
                                    }else if(typeof checkAdBackVar !== 'undefined'){
                                        if (checkAdBackVar == true) {
                                            // console.log("----checkAdBackVar: " + parent.checkAdBackVar);
                                            window.jQuery("#scoreFrame").css({
                                                "display": "none",
                                                "z-index": "-1"
                                            });
                                        }
                                        checkAdBackVar = false;
                                    }
                                    
                                    var frame = document.getElementById("adsFrame");
                                    // if(frame == null){
                                    //     frame = document.getElementById("adsFrame");
                                    // }
                                    frame.parentNode.removeChild(frame);
                                    window.jQuery("#adsScript").remove();
                                }
                            });
                        } else {
                            //      jQuery("#textSkip").html("You can skip this ad in " + index+"  ");
                            jQuery("#adsFrame").contents().find("#skipAds").html("<span id=textSkip style=color:black;font-size:70%;>You can skip this ad in " + index + "  <\/span>");
                            //      jQuery("#textSkip").html("You can skip this ad in " + index+"  ");
                        }
                    }, 5000 - (1000 * index));
                })(i);
            }

            var timer;
            loop();
        }, 2000);
        

        // for (var j = 15; j >= 0; j--) {
        //     (function(index1) {
        //         timer = setInterval(function() {
        //             if (parent.clickSkip) {
        //                 clearInterval(timer);
        //             }
        //             console.log(index1);

        //             if (index1 === 0) {

        //                 if (typeof parent.callBaclFn !== 'undefined') {
        //                     parent.postMessage({
        //                         "callBackFnCalled": 1
        //                     }, "*");
        //                 } else if (typeof callBaclFn !== 'undefined') {
        //                     parent.postMessage({
        //                         "callBackFnCalled": 1
        //                     }, "*");
        //                 }
        //                 var frame = parent.document.getElementById("adsFrame");
        //                 frame.parentNode.removeChild(frame);
        //                 window.parent.jQuery("#adsScript").remove();

        //             } else {
        //                 if (index1 < 10) {
        //                     jQuery("#adsFrame").contents().find("#textAutoSkip").html("Ad will close in 0:0" + index1);
        //                 } else {
        //                     jQuery("#adsFrame").contents().find("#textAutoSkip").html("Ad will close in 0:" + index1);
        //                 }
        //             }

        //         }, 15000 - (1000 * index1));

        //         // setTimeout(function() {



        //         // }, 15000 - (1000 * index1));
        //     })(j);

        // }
    } else {
        // console.log(0);
    }
}



// addEventListener("message", receiveAdsLoaded, false);

function getParamValue(paramName) {
    var url = window.location.search.substring(1); //get rid of "?" in querystring
    var qArray = url.split('&'); //get key-value pairs
    for (var i = 0; i < qArray.length; i++) {
        var pArr = qArray[i].split('='); //split key and value
        if (pArr[0] == paramName)
            return pArr[1]; //return value
    }
}