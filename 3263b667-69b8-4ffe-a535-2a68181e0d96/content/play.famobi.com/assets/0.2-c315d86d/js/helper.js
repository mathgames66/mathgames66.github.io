"use strict";

function __(key, data) {
	var i = 0, str = "", j = 1, rx;
	key = key+"";

	if (key.indexOf("|") == -1){
		if (!data){
			str = app.modules.i18n.getTranslation(key);
			return str;
		}
	}

	if (!data){
		data = key.split("|");
		key = data.shift();
	}

	// Translate string
	str = app.modules.i18n.getTranslation(key);

	for (i in data){
		if (typeof data[i] === "object"){
			var k;
			for (k in data[i]){
				rx = new RegExp("%"+k.toUpperCase());
				str = str.replace(rx, data[i][k]);
				str = str.replace(/%s/, data[i]);
			}
		} else {
			j = Number(i) + 1;
			rx = new RegExp("%"+j);
			str = str.replace(rx, data[i]);
			str = str.replace(/%s/, data[i]);
		}
	}

	return str;
}

function nl2br(str) {
	str = (str && str.length) ? jQuery.trim(str) : "";

	return str.replace(/\n/g, "<br>");
}

function pad(time) {
	return Number(time) < 10 ? "0" + time.toString() : time.toString();
}

function numFormat(n) {
	return Number(n).toFixed(0).replace(/(?=(?:\d{3})+$)(?!^)/g, '.');
}

function dataToAttr(data){
	var out = '';

	for(var idx in data){
		out += idx + '="' + data[idx].toString() + '" ';
	}

	return out;
}

function getBaseUrl() {
	var l = document.location;
	return l.protocol + "//" + l.hostname + "/";
}

function getQRCodeForUrl(url, width, height) {
	var w = width || 150,
		h = height || 150;
	return "http://chart.apis.google.com/chart?chs=" + w + "x" + h + "&cht=qr&chl=" + encodeURI(url);
}

function getQueryParams(qs) {
	qs = qs.split("+").join(" ");

	var params = {},
		tokens,
		re = /[?&]?([^=]+)=([^&]*)/g;

	while (tokens = re.exec(qs)){
		params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	}

	return params;
}

function sizeOf(data) {
	var length = 0;
	var prop;

	if (!data) {
		return length;
	}

	if (typeof data.length != 'undefined') {
		return data.length;
	}

	if (Object.keys) {
		// available since ECMAScript 5 and in some browser 10x faster
		length = Object.keys(data).length;
	} else {
		for (prop in data){
			if (data.hasOwnProperty(prop)) {
				length++;
			}
		}
	}
	return length;
}

function splitNewlines(string) {
	return string.split("\n");
}

function htmlSpecialChars(string){
	string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	string = string.replace(/'/g, '&#039;');
	string = string.replace(/"/g, '&quot;');
	return string;
}

var app__viewport = {};

function getViewport(force){
	var o = getOrientation(),
		x = window.innerWidth,
		y = window.innerHeight;

	if(!app__viewport.hasOwnProperty(o) || force){
		app__viewport[o] = {};
		app__viewport[o].orientation = o;
		if(o == 'landscape'){
			app__viewport[o].width = Math.max(x,y);
			app__viewport[o].height = Math.min(x,y);
		}else{
			app__viewport[o].width = Math.min(x,y);
			app__viewport[o].height = Math.max(x,y);
		}

		if(!detection.is.ios)
			app__viewport[o].pixelratio = Math.max(window.devicePixelRatio, 1);
		else
			app__viewport[o].pixelratio = 1;
	}
	return app__viewport[o];
}

function getOrientation(){
	var orientationMatch = window.matchMedia('all and (orientation:landscape)');

	if(orientationMatch && orientationMatch.matches === true)
		return 'landscape';
	return 'portrait';
}

function playGif(gifContainer) {
	var $gifContainer;
	var $img;
	var $play;
	var imgSrc;
	if (!gifContainer) {
		return;
	}
	$gifContainer = jQuery(gifContainer);
	$img = $gifContainer.find("img");
	$play = $gifContainer.find("span.play");
	imgSrc = $img.attr("src");
	if ($img.data("alt")) {
		$play.toggle();
		$img.attr("src", $img.data("alt"));
		$img.data("alt", imgSrc);
	}
}

function storageFallback(){
	var storage = {};
}

storageFallback.prototype.setItem = function(key, value){
	this.storage[key] = value;
};

storageFallback.prototype.getItem = function(key){
	try{
		return this.storage[key];
	}catch(e){
		return false;
	}
};

storageFallback.prototype.removeItem = function(key){
	try{
		delete this.storage[key];
		return true;
	}catch(e){
		return false;
	}
};

storageFallback.prototype.clear = function(){
	try{
		this.storage = {};
		return true;
	}catch(e){
		return false;
	}
};

/* MediaMatch v.2.0.2 - Testing css media queries in Javascript. Authors & copyright (c) 2013 = WebLinc, David Knight. */

window.matchMedia||(window.matchMedia=function(c){var a=c.document,w=a.documentElement,l=[],t=0,x="",h={},G=/\s*(only|not)?\s*(screen|print|[a-z\-]+)\s*(and)?\s*/i,H=/^\s*\(\s*(-[a-z]+-)?(min-|max-)?([a-z\-]+)\s*(:?\s*([0-9]+(\.[0-9]+)?|portrait|landscape)(px|em|dppx|dpcm|rem|%|in|cm|mm|ex|pt|pc|\/([0-9]+(\.[0-9]+)?))?)?\s*\)\s*$/,y=0,A=function(b){var z=-1!==b.indexOf(",")&&b.split(",")||[b],e=z.length-1,j=e,g=null,d=null,c="",a=0,l=!1,m="",f="",g=null,d=0,f=null,k="",p="",q="",n="",r="",k=!1;if(""===
b)return!0;do{g=z[j-e];l=!1;if(d=g.match(G))c=d[0],a=d.index;if(!d||-1===g.substring(0,a).indexOf("(")&&(a||!d[3]&&c!==d.input))k=!1;else{f=g;l="not"===d[1];a||(m=d[2],f=g.substring(c.length));k=m===x||"all"===m||""===m;g=-1!==f.indexOf(" and ")&&f.split(" and ")||[f];d=g.length-1;if(k&&0<=d&&""!==f){do{f=g[d].match(H);if(!f||!h[f[3]]){k=!1;break}k=f[2];n=p=f[5];q=f[7];r=h[f[3]];q&&(n="px"===q?Number(p):"em"===q||"rem"===q?16*p:f[8]?(p/f[8]).toFixed(2):"dppx"===q?96*p:"dpcm"===q?0.3937*p:Number(p));
k="min-"===k&&n?r>=n:"max-"===k&&n?r<=n:n?r===n:!!r;if(!k)break}while(d--)}if(k)break}}while(e--);return l?!k:k},B=function(){var b=c.innerWidth||w.clientWidth,a=c.innerHeight||w.clientHeight,e=c.screen.width,j=c.screen.height,g=c.screen.colorDepth,d=c.devicePixelRatio;h.width=b;h.height=a;h["aspect-ratio"]=(b/a).toFixed(2);h["device-width"]=e;h["device-height"]=j;h["device-aspect-ratio"]=(e/j).toFixed(2);h.color=g;h["color-index"]=Math.pow(2,g);h.orientation=a>=b?"portrait":"landscape";h.resolution=
d&&96*d||c.screen.deviceXDPI||96;h["device-pixel-ratio"]=d||1},C=function(){clearTimeout(y);y=setTimeout(function(){var b=null,a=t-1,e=a,j=!1;if(0<=a){B();do if(b=l[e-a])if((j=A(b.mql.media))&&!b.mql.matches||!j&&b.mql.matches)if(b.mql.matches=j,b.listeners)for(var j=0,g=b.listeners.length;j<g;j++)b.listeners[j]&&b.listeners[j].call(c,b.mql);while(a--)}},10)},D=a.getElementsByTagName("head")[0],a=a.createElement("style"),E=null,u="screen print speech projection handheld tv braille embossed tty".split(" "),
m=0,I=u.length,s="#mediamatchjs { position: relative; z-index: 0; }",v="",F=c.addEventListener||(v="on")&&c.attachEvent;a.type="text/css";a.id="mediamatchjs";D.appendChild(a);for(E=c.getComputedStyle&&c.getComputedStyle(a)||a.currentStyle;m<I;m++)s+="@media "+u[m]+" { #mediamatchjs { position: relative; z-index: "+m+" } }";a.styleSheet?a.styleSheet.cssText=s:a.textContent=s;x=u[1*E.zIndex||0];D.removeChild(a);B();F(v+"resize",C);F(v+"orientationchange",C);return function(a){var c=t,e={matches:!1,
media:a,addListener:function(a){l[c].listeners||(l[c].listeners=[]);a&&l[c].listeners.push(a)},removeListener:function(a){var b=l[c],d=0,e=0;if(b)for(e=b.listeners.length;d<e;d++)b.listeners[d]===a&&b.listeners.splice(d,1)}};if(""===a)return e.matches=!0,e;e.matches=A(a);t=l.push({mql:e,listeners:null});return e}}(window));function mediahack(a,i){function n(a,i){var n=i.split(" "),l=a.classList;if(l)for(var i,e=0;e<n.length;e++)(i=n[e])&&l.add(i);else{for(var i,t=" "+a.className+" ",r=t,e=0;e<n.length;e++)(i=n[e])&&(i+=" ",~t.indexOf(" "+i)||(t+=i));t!==r&&(a.className=t.slice(1,-1))}}function l(a,i){var n=i.split(" "),l=a.classList;if(l)for(var i,e=0;e<n.length;e++)(i=n[e])&&l.remove(i);else{for(var i,t=" "+a.className+" ",r=t,e=0;e<n.length;e++)(i=n[e])&&(i=" "+i+" ",~t.indexOf(i)&&(t=t.replace(i," ")));t!==r&&(a.className=t.slice(1,-1))}}var i=i||{landscape:"all and (orientation:landscape)",portrait:"all and (orientation:portrait)",small:"all and (max-width:768px)",medium:"all and (min-width:768px) and (max-width:991px)",large:"all and (min-width:992px)"};for(var e in i){var t=window.matchMedia(i[e]);!function(i,e){var t=function(i){i.matches?n(a,e):l(a,e)};t(i),i.addListener(t)}(t,e)}}




var detection = (function() {
	var mod = {is:{}},
		d,
		ua = navigator.userAgent;
	mod.detect = {
		html5: function() {
			return document.createElement('canvas').getContext !== undefined;
		},
		touch: function() {
			var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
			return !!supportsTouch;
		},
		android: function() {
			return !!ua.match(/Android/i);
		},
		ios: function() {
			return !!ua.match(/iPhone|iPad|iPod/i);
		},
		ios7: function(){
			return mod.detect.ios && ua.match(/version\/7\./i);
		},
		bb10: function() {
			return !!ua.match(/BB10/i);
		},
		windows: function() {
			return !!ua.match(/Windows/i);
		},
		webkitVersion: function() {
			var regex = new RegExp(/AppleWebKit\/([\d.]+)/),
				result = regex.exec(ua),
				webkitVersion = result === null ? false : parseFloat(result[1]);
			return webkitVersion;
		},
		androidStockBrowser: function() {
			if (mod.is.android && mod.is.webkitVersion && mod.is.webkitVersion < 537) {
				return true;
			}
			return false;
		},
		standalone: function() {
			return !!window.navigator.standalone;
		},
		smartphone: function() {
			return (ua.match(/Android.*Mobile|iPhone|IEMobile|WPDesktop|BB10/i)) ? true : false;
		},
		tablet: function() {
			// Android smartphones have the combination Android...Mobile, tablets only Android
			var androidTablet = (mod.is.android && !mod.is.smartphone),
				iPad = ua.match(/iPad/i) ? true : false;
			return (androidTablet || iPad);
		},
		pc: function() {
			return (!mod.is.smartphone && !mod.is.tablet);
		},
		phantom: function() {
			return !!(window.callPhantom || ua.match(/PhantomJS/));
		},
		iframe: function() {
			try {
				return window.self !== window.top;
			} catch (e) {
				return true;
			}
		}
	};

	for (d in mod.detect) {
		if (typeof mod.detect[d] === 'function') {
			mod.is[d] = mod.detect[d]();
		}
	}

	return mod;
})();