var gameReady = false;
		
function game_fullscreen() {
	var elem = document.body; // Make the body go full screen.
	requestFullScreen(elem);
}

function game_ready(resize) {
	gameReady = true;
	
	if (resize) {
		var nw = window.innerWidth;
		var nh = window.innerHeight;
		
		if( typeof( window.innerWidth ) == 'number' ) {
			//Non-IE
			nw = window.innerWidth;
			nh = window.innerHeight;
		} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
			//IE 6+ in 'standards compliant mode'
			nw = document.documentElement.clientWidth;
			nh = document.documentElement.clientHeight;
		}		
		
		document.getElementById("canvas").width 	= nw;
		document.getElementById("canvas").height 	= nh;
		
		game_resize(nw, nh);
	}
}

function game_resize(w, h) {
	var arg = { width: w, height: h};
	gmCallback.game_callback("resize", JSON.stringify(arg));
}

function web_audio_resume() {
	if (g_WebAudioContext != undefined) {
		g_WebAudioContext.resume();
	}
}

function requestFullScreen(element) {
	var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

	if (requestMethod) { // Native full screen.
		requestMethod.call(element);
	} else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
		var wscript = new ActiveXObject("WScript.Shell");
		if (wscript !== null) {
			wscript.SendKeys("{F11}");
		}
	}
}