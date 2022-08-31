// var hostName = window.location.hostname;
// var protocol = window.location.protocol;
// // var pathname = window.location.pathname;
// var host = protocol + "\/\/" + hostName+pathname;
var host;
var idOfGame;
// var urlLibs = "http://api.gamemobi.net/lib/libs.js";
var urlLibs = window.location.protocol+"\/\/"+ window.location.hostname+"\/" + "api/lib/libs.js";
// var urlLibs = "https://123-games.org/api/lib/libs.js";


function getParamValue(paramName) {
    var url = window.location.search.substring(1); //get rid of "?" in querystring
    var qArray = url.split('&'); //get key-value pairs
    for (var i = 0; i < qArray.length; i++) {
        var pArr = qArray[i].split('='); //split key and value
        if (pArr[0] == paramName)
            return pArr[1]; //return value
    }
}

var Libs = {
	init: function(idGame, timeCheck, landscape){
		// var $ = jQuery.noConflict();
		jQuery(document).ready(function() {
			// var $ = jQuery.noConflict();
		// console.log(1);



			var script = document.createElement('script');
		    script.src = "https://imasdk.googleapis.com/js/sdkloader/ima3.js"; // no such script
		    // document.head.append(script);
		    jQuery("head").append(script);

		    script.onerror = function() {
		      jQuery("<div id='adsBlock' style='position: absolute; left: 0; top: 0; display: inline-block;z-index: 100000000; width: 100%; height: 100vh; background-color: orange; text-align: center; vertical-align: middle;'><div style='position: relative;float: left;top: 50%;left: 50%;transform: translate(-50%, -50%);'>You are in ads block mode!<br/>Please kindly turn it off. This ads helps to maintain system!<br/>After turning off, please click <a style='cursor: pointer; color: blue;' onclick='location.reload()'>here</a> or push F5 to reload game!<br/>Thank You!</div></div>").appendTo("body");
		    };

			var height = jQuery(window).height();
	        var width = jQuery(window).width();
	        var body = document.body;
	        
			console.log(urlLibs);
			var url;
			if(typeof jQuery("#libScript")[0] === 'undefined'){
				url = urlLibs;
			}else{
				url = jQuery("#libScript")[0].src;
			}
			host = url.replace('libs.js', '');

			var load = getParamValue("load");
	        if (typeof load !== 'undefined') {
	        	var width = $('body').width();
			    var height = $('body').height();
			    var widthImg = (width < height) ? width * 20 / 100 : height * 20 / 100;
			    var top = 0 + "%";
			    var body = document.body;
			    jQuery("<iframe id='loadingOverlay' style='display: block; width: " + width + "px; height: 100%; position: fixed; z-index: 9999; top: 0; left: 0;' frameborder='0' scrolling='no'></iframe>").insertBefore(body.firstChild);
			    jQuery("#loadingOverlay").contents().find("body").html("<div id = 'loadingOverlayDiv' style='width: " + width + "px; height: 100%; background-color: rgba(0, 0, 0, 1); z-index: 9999; position: fixed;top: 0; left: 0;'><div id='loading' style='position: absolute; top:" + top + "; bottom: 0; left: 0; right: 0; margin: auto; width: " + widthImg + "px; height: " + widthImg + "px; background: url(" + host + "\/function\/img\/SkinnySeveralAsianlion.gif); background-size: 100% 100%;'></div></div>");
			    
	            window.addEventListener('resize', function () {
	                var height = $('body').height();
	                jQuery('#loadingOverlay').css("height", height);
	            });

	            setTimeout(function(){
	                if($("#loadingOverlay").length > 0){
	                    $("#loadingOverlay").remove();
	                    $(window).focus();
	                }
	            }, load * 1000);
	        }

			if (jQuery("#menuFrame").length <= 0) {
	            // console.log(2);
	            jQuery("<iframe id='menuFrame' style='background-color: rgba(0, 0, 0, 0.8); display: none; padding: 0; margin: 0; width: " + width + "px; height: " + height + "px; position: fixed; z-index: 8888; top: 0; left: 0;' frameborder='0' scrolling='no' allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>").insertBefore(body.firstChild);
	        }
			// console.log(url);
			// $('<script src="'+host+'function\/jquery-3.2.1.min.js"></script>').appendTo("head");
			// jQuery('<link rel="stylesheet" href="'+host+'function/css/style2.css">').appendTo('head');
			jQuery('<script src="'+host+'function\/function.js"></script>').appendTo("head");
			jQuery('<script src="'+host+'function\/iframeResizer.contentWindow.min.js"></script>').appendTo("head");
			jQuery('<script src="'+host+'function\/iframeResizer.min.js"></script>').appendTo("head");
			jQuery('<script>window.iFrameResizer = {targetOrigin: "*"}</script>').appendTo("head");
			
			// setTimeout(function(){
			// 	jQuery('<script type="text\/javascript">AdObject.init('+timeCheck+');</script>').appendTo("head");
			// }, 500);
			jQuery('<script type="text\/javascript">AdObject.init('+timeCheck+');</script>').appendTo("head");
			jQuery('<script src="'+host+'function\/menu.js"></script>').appendTo("head");
			// setTimeout(function(){
			// 	if(typeof idGame !== 'undefined' && idGame !== null){
			// 		jQuery('<script type="text/javascript">Menu.init('+idGame+');</script>').appendTo("head");
			// 	}else{
			// 		jQuery('<script type="text/javascript">Menu.init();</script>').appendTo("head");
			// 	}
			// }, 500);
			if(typeof idGame !== 'undefined' && idGame !== null){
				jQuery('<script type="text/javascript">Menu.init('+idGame+');</script>').appendTo("head");
			}else{
				jQuery('<script type="text/javascript">Menu.init();</script>').appendTo("head");
			}

			if(typeof idGame !== 'undefined' && idGame !== null){
				// idOfGame = idGame;
				jQuery('<script src="'+host+'function\/saveScore.js"></script>').appendTo("head");
				jQuery('<script src="'+host+'function\/scoreAjax.js"></script>').appendTo("head");
				// setTimeout(function(){
				// 	jQuery('<script type="text/javascript">Score.init('+idGame+', '+timeCheck+');</script>').appendTo("head");
				// }, 500);
				jQuery('<script type="text/javascript">Score.init('+idGame+', '+timeCheck+');</script>').appendTo("head");
			}

			if(typeof landscape !== 'undefined' && landscape !== null){
				jQuery('<script src="'+host+'orientation/js/orientation.js"></script>').appendTo("head");
				// setTimeout(function(){
				// 	jQuery('<script type="text/javascript">Orientation.init('+landscape+');</script>').appendTo("head");
				// }, 500);
				jQuery('<script type="text/javascript">Orientation.init('+landscape+');</script>').appendTo("head");
			}

			
	    });
		// // console.log("a");
		// var $;

		// var load = setInterval( function () {
		// 	if (window.jQuery) {  
  //               $ = window.jQuery;
  //               initializing($, idGame, timeCheck, landscape);
  //               clearInterval(load);
  //           } else {
  //           	var script = document.createElement('script');
		// 		script.onload = function() {
		// 			var tid = setInterval( function () {
		// 			    if(document.readyState === 'complete'){
		//             		$ = jQuery.noConflict();
		//             		initializing($, idGame, timeCheck, landscape);
		// 			    	clearInterval(tid);
		// 			    	clearInterval(load);
	 //            		}      
		// 			    // do your work
		// 			}, 100 );
					
		// 		};
		// 		script.src = "https://123gamesfree.com/api/lib/jquery-3.2.1.min.js";
		// 		document.getElementsByTagName('head')[0].appendChild(script);
            	
  //           }
		// }, 100);

		// // window.onload = function() {
            
  // //       }

		// // var $ = jQuery.noConflict();
		
	},
	checkMobile: function(){
		if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())) {
			return true;
		}else{
			return false;
		}
	}
}

function initializing($, idGame, timeCheck, landscape){
	
}
