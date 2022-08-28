/* JSEmbed
 * is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 * by Keith McCullough, Workinman Interactive, 2013
 * thanks to Nate Altschul, Oliver Marsh, SWFObject project
 *
 * USAGE:
 * jsembed.embed(appJS.js:String, targetDivId:String, idealCanvasWidth:String, idealCanvasHeight:String, paramas:Object, attr:Object);
 *
 * Parameters configure jsembed itself.
 * Attributes will be set on the embed target for use by the app. "base" will be set as well.
 *
 * Supported Parameters (all String, all Optional):
 * base : Specify set a base URL for all lib and content loading. Follows standard relative/absolute rules (ie: absolute only if http is present). Available publically via jsembed.base.
 * api : Specify a custom API. Currenctly supports "nme", "flambe", "c2" and "tresensa"
 * scaletype : Specify what type of canvas scaling to use. Supports "none", "fit" and "fill"
 * indexroot : Specify weather the location of the HTML or PHP that embedded jsembed is the root for pathing. "true" or "false." If false, assumes domain as root instead. base url is appended AFTER this, unless absolute.
 * allowtouchmove :Specifyc whether to allow touchmove on devices when user drags over canvas. "true" or "false." Defaults to false.
 * libs : Array of libs to embed before starting the app script itself.
 *
 * Example embed:
 *
<html lang="en">
	<head>
		<script type="text/javascript">
			// Parameters configure jsembed itself.
			var params = {
				base: "", // base url of all content. Defaults ""
			 	api: "none", // supported custom apis are defined in jsembed. Defaults none.
			 	scaletype: "fit", // update window.canvasScale on window resize? Defaults "fit". Also supports "fill", "fillto" and "none."
			 	indexroot: "true", // use the current index url as the path root? If false uses domain root instead. Defaults false (use domain root).
			 	//allowtouchmove: "false", // allow the page to scroll when user drags or swipes? Defaults to false.
			 	//maxwidth: 1024, //The maximum width to scale the canvas to. Only works with fillto.
			 	//maxheight: 640, //The maximum height to scale the canvas to. Only works with fillto.
			 	//libs: ["testlib.js"] // array of libs to embed before trying to launch app. Defaults []. Libs will load from base url unless you set libsIgnoreBase: "true" param.

			}
			// Attributes will be set on the embed target for use by the app. "base" will be set as well.
			var attr = {

			};

			jsembed.embed("test.js", "embedtarget", "960", "560", params, attr);
		</script>
	</head>
	<body style="padding: 0; margin: 0; background-color:#000000">
		<div id="embedtarget"></div>
	</body>
</html>
 */
var jsembed = function()
{

	// Constants
	var VERSION 			= "1.0.5";

	var API_NONE 			= "none";
	var API_HAXE_NME 		= "nme";
	var API_HAXE_FLAMBE 	= "flambe";
	var API_CONSTRUCT_2 	= "c2";
	var API_TRESENSA		= "tresensa";
	var API_PLAYCANVAS      = "playcanvas";

	var UNDEF 					= "undefined";
    var OBJECT 					= "object";
    var ON_READY_STATE_CHANGE 	= "onReadystatechange";

    var SCALETYPE_NONE		= "none"; // No scaling
    var SCALETYPE_FIT		= "fit"; // Fits the canvas to the browser window as best it can, based on ideal width/height.
    var SCALETYPE_FILL		= "fill"; // Fills the browser window with the canvas.
    var SCALETYPE_FILL_TO	= "fillto"; // Fills the browser window with the canvas.
    var SCALETYPE_FIT_HORIZONTAL = "fith"; // Fits the canvas width to the browser window, lets the height clip off the bottom.

    // Scaling and Dimension support
    var widthIdeal 	= 960; // Default only, value set at runtime via jsembed.embed -- represents the "native" dimensions of the embeded JS app
    var heightIdeal = 560; // Default only, value set at runtime via jsembed.embed -- represents the "native" dimensions of the embeded JS app
    var scaleMax = 3; // The largest ratio we let the app scale to. 3 represents 300%.
    var widthMax = 960; // The maximum canvas width we'll allow. Only applies to FILL_TO
    var heightMax = 560; // The maximum canvas height we'll allow. Only applies to FILL_TO

    // DOM Elements
    var win = window;
    var doc = document;
    var nav = navigator;

    // Load/Embed Sequencing props
    var flagDomLoaded = false;
    var flagEmbedCalled = false;
    var flagBodyScriptsEmbeded = false;
    var flagScalingScriptEmbeded = false;
    var flagPaused = false;
    var domLoadFunctions = [onReady];

    // Library loading support.
    var libsLoaded = 0;
    var libsToLoad = 0;
    var libList = [];
    var libs;

    // Stored props
	var appJs = "";
	var base = ""; // Default. Should be passed in as param.
	var targetId;
	var api; // API used for this embed (see API_ contants above). Set as param in jsembed.embed().
	var _appRef; // Ref to app script tag.
	//var width; // Requested embed width in pixels via jsembed.embed() property. // OBSOLETE, now widthIdeal
	//var height; // Requested embed height in pixels via jsembed.embed() property. // OBSOLETE, now heightIdeal
	var attributes; // Attributes will be available inside the app. They are also set as attributes on the embedtarget div.
	var parameters; // Parameters are for configuring JSEmbed at runtime.
	var retryCountMain = 0;  // Number of times we've retried loading Main.
	var flagIndexRoot; // Use the page index as the root for relative base path, instead of the domain root. Set as indexroot:"true"/"false" in jsembed params.
	var flagBaseCrossdomain = false; // Flag. Updated when base is defined. Becomes true if base domain doesn't match page domain.
	var _canvasWidth; // The width of the browser window in px. Updated constantly.
	var _canvasHeight; // The height of the browser window in px. Updated constantly.
	var _canvasScale; // Actual runtime scale of canvas, calculated by comparing real width/height to widthIdeal/heightIdeal. Updated constantly.
	//var _canvasScaleX; // Actual runtime scale of the canvas on the X axis. Only relevant in scaling modes that fill rather than fit.
	//var _canvasScaleY; // Actual runtime scale of the canvas on the Y axis. Only relevant in scaling modes that fill rather than fit.
	var _contentOffsetX = 0; // Amount to offset the content from the center of the stage. Only used with scaletype "fill", otherwise always 0.
	var _contentOffsetY = 0; // Amount to offset the content from the center of the stage. Only used with scaletype "fill", , otherwise always 0.
	var _scaledWidth = 0; // The width of the canvas after scaling is applied.
	var _scaledHeight = 0; // The height of the canvas after scaling is applied.
	// IE Console fix, for the inevitable situation when a .log is accidentally left in the code.
	if (!window.console) window.console = {};
	if (!window.console.log) window.console.log = function () { };

	// Start things by embedding the default meta tags.
	embedMetaTags();

	 /* Centralized function for browser feature detection
    - User agent string detection is only used when no good alternative is possible
    - Is executed directly for optimal performance
    - Based on SWFObject solution.
	*/
	var ua = function() {
	    var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF,
	            u = nav.userAgent.toLowerCase(),
	            p = nav.platform.toLowerCase(),
	            windows = p ? /win/.test(p) : /win/.test(u),
	            mac = p ? /mac/.test(p) : /mac/.test(u),
	            webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
	            ie = !+"\v1", // feature detection based on Andrea Giammarchi's solution: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
	            playerVersion = [0,0,0],
	            d = null;

	    return { w3:w3cdom, wk:webkit, ie:ie, win:windows, mac:mac };
	}();

	var onDomLoad = function() {

        if ((typeof doc.readyState != UNDEF && doc.readyState == "complete") || (typeof doc.readyState == UNDEF && (doc.getElementsByTagName("body")[0] || doc.body))) { // function is fired after onload, e.g. when script is inserted dynamically
                verifyDomLoad();
        }
        if (!flagDomLoaded) {
                if (typeof doc.addEventListener != UNDEF) {
                        doc.addEventListener("DOMContentLoaded", verifyDomLoad, false);
                }
                if (ua.ie && ua.win) {
                        doc.attachEvent(ON_READY_STATE_CHANGE, function() {
                                if (doc.readyState == "complete") {
                                        doc.detachEvent(ON_READY_STATE_CHANGE, arguments.callee);
                                        verifyDomLoad();
                                }
                        });
                        if (win == top) { // if not inside an iFrame
                                (function(){
                                        if (flagDomLoaded) { return; }
                                        try {
                                                doc.documentElement.doScroll("left");
                                        }
                                        catch(e) {
                                                setTimeout(arguments.callee, 0);
                                                return;
                                        }
                                        verifyDomLoad();
                                })();
                        }
                }
                if (ua.wk) {
                        (function(){
                                if (flagDomLoaded) { return; }
                                if (!/loaded|complete/.test(doc.readyState)) {
                                        setTimeout(arguments.callee, 0);
                                        return;
                                }
                                verifyDomLoad();
                        })();
                }

                addDomLoadListeners(verifyDomLoad, failDomLoad);
        }
	}();

	/*
	Sets necessary CSS Settings to make games work on tablets, phones, etc.
	 */
	function embedCSS()
	{
		var tStyle = doc.body.style;
		tStyle.setProperty("-ms-touch-action", "none", null);
	}
	/*
	Adds meta tags needed to make games work on tablets, phones, etc.
	 */
	function embedMetaTags()
	{
		addMetaTag("apple-mobile-web-app-capable", "yes");
		addMetaTag("apple-mobile-web-app-status-bar-style", "black");
		addMetaTag("viewport", "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, minimal-ui");
		addMetaTag("HandheldFriendly", "true");
	}
	/*
	Adds script to make canvas scale dynamically
	 */
	function embedScalingScript()
	{
		if(parameters.scaletype==SCALETYPE_NONE)
		{
			scaleSet(1);
			return;
		}
		if(flagScalingScriptEmbeded){return;}
		flagScalingScriptEmbeded = true;
		addEvent(window,'resize',onEventResize);
		scaleCalculate();
		setTimeout(scaleCalculate, 500); // Ugly hack to work around mobile safari's documentSize delay. [Keith] No longer needed?
	}
	/*
	Adds misc. support scripts to body.
	 */
	function embedSupportBodyScripts()
	{
		// winParameters
		document.body.winParameters = function() { return {};}

		// Playnomics Custom inclusion. [Keith][TODO] This definitely should not be here but is stuck for the time being due to legacy support. Will get rid of this as soon as it's safe!
		document.body._pnConfig = new Array();
		window._pnConfig = new Array();

		// prevent touchmove, unless it's specifically manually enabled in parameters via:
		// allowtouchmove = "false"
		if(parameters == null || parameters.allowtouchmove==null || parameters.allowtouchmove != "true" )
		{
			addEvent(document.body, 'touchmove', function(e){e.preventDefault();});
		}
	}
	/*
	Helper method to embed a lib Js.
	set skipDuplicateLibs to skip this embed if the libJs is also present in the libs array.
	This is useful if you want to hardcode libraries for a custom api but don't want them embedded twice on accident.
	 */
	function embedLib( libJs , skipDuplicateLibs , isReload, loadDelay, libsIgnoreBase)
	{
		if(loadDelay>0)
		{
			libsToLoad++;
			setTimeout( function(){embedLib(libJs, skipDuplicateLibs, true, 0)}, loadDelay);
			return;
		}
		var duplicateFound = false;
		if(skipDuplicateLibs != false || isReload != false )
		{
			for(var l in libList)
			{
				if(libList[l].src == libJs)
				{
					duplicateFound = true;
					if(isReload)
					{
						libList[l].retry++;
						if(libList[l].retry>3)
						{
							return;
						}
					} else {
						return;
					}
				}
			}
		}
		if(!duplicateFound)
		{
			if(!isReload){libsToLoad++;}
			libList[libList.length] = {src:libJs, retry:0};
		}

		var libscript = document.createElement("script");
		libscript.setAttribute('type', 'text/javascript');
		libscript.src = libsIgnoreBase==true?libJs:fixUrl(libJs);
		addEvent(libscript, "load", onEventLibLoaded);
		addEvent(libscript, "error", onEventLibError);
		doc.getElementsByTagName('head').item(0).appendChild(libscript);
	}

	/* Helper method to add a metatag easily */
	function addMetaTag( inName, inContent )
	{
		var tMetaTag = doc.createElement('meta');
		tMetaTag.name = inName;
		tMetaTag.content = inContent;

		doc.getElementsByTagName('head').item(0).appendChild(tMetaTag);
	}
	/* Helper method to add an event listener to an element. */
	function addEvent (elem, type, eventHandle) {
		if (elem == null || elem == undefined) return;
		if ( elem.addEventListener ) {
			elem.addEventListener( type, eventHandle, false );
		} else if ( elem.attachEvent ) {
			elem.attachEvent( "on" + type, eventHandle );
		} else {
			elem["on"+type]=eventHandle;
		}
	}
	/* Helper method to remove an event listener to an element. */
	function removeEvent (elem, type, eventHandle) {
		if (elem == null || elem == undefined) return;
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, eventHandle );
		} else if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, eventHandle );
		} else {
			elem["on"+type]=null;
		}
	}

	/* Test if the DOM is loaded. */
	function verifyDomLoad() {
	        if (flagDomLoaded) { return; }
	        try { // test if we can really add/remove elements to/from the DOM; we don't want to fire it too early
	                var t = doc.getElementsByTagName("body")[0].appendChild(doc.createElement("span"));

	                t.parentNode.removeChild(t);
	        }
	        catch (e) { return; }
	        flagDomLoaded = true;
	        var dl = domLoadFunctions.length;
	        for (var i = 0; i < dl; i++) {
	                domLoadFunctions[i]();
	        }
	}
	/* Test if the DOM load failed. */
	function failDomLoad() {
		//alert("jsEmbed Dom load failed!");
		//embedLib(event.target.src, false, true,0);
	}

	/* Cross-browser onload
	        - Based on James Edwards' solution: http://brothercake.com/site/resources/scripts/onload/
	        - Will fire an event as soon as a web page including all of its assets are loaded
	        - Based on SWFObject
	 */
	function addDomLoadListeners(fnPass, fnFail)
	{
	        if (typeof win.addEventListener != UNDEF) {
	                win.addEventListener("load", fnPass, false);
	                win.addEventListener("error", fnFail, false);
	        }
	        else if (typeof doc.addEventListener != UNDEF) {
	                doc.addEventListener("load", fnPass, false);
	                doc.addEventListener("error", fnFail, false);
	        }
	        else if (typeof win.attachEvent != UNDEF) {
	                addListener(win, "onload", fnPass);
	                addListener(win, "onerror", fnFail);
	        }
	        else if (typeof win.onload == "function") {
	                var fnOld = win.onload;
	                win.onload = function() {
	                        fnOld();
	                        fnPass();
	                };
	                var fnOldFail = win.onerror;
	                win.onerror = function() {
	                	fnOldFail();
	                	fnFail();
	                };
	        }
	        else {
	                win.onload = fn;
	        }
	}

	/*
    Occurs when the DOM is loaded
	 */
	function onReady()
	{
		// If we're still loading libs, don't progress!
		if(libsLoaded<libsToLoad)
		{
			return;
		}

		if(flagEmbedCalled)
		{
			// Embed body support scripts
			embedSupportBodyScripts();

			// Embed CSS
			embedCSS();

			// Prepare to launch the embed
			setTimeout( executeJsEmbed, 500);
		}
	}

	/*
    Execute the actual jsembed code.
	 */
	function executeJsEmbed()
	{
		var tar = doc.getElementById(targetId);

		// Create app script element
		var app = doc.createElement('script');
		// Set attributes included in embed
		// Attributes are set on the target <div> or <object>. You can get them from within your app by referencing it. [TODO] Better recommendations for getting it? It's rather difficult currently.
		app.setAttribute("async", "true");
		app.setAttribute('type', 'text/javascript');

		// Add all attributes to the tar object
		for (var pKey in attributes)
		{
		  if (attributes.hasOwnProperty(pKey))
		  {
			  tar.setAttribute(pKey, attributes[pKey]);
		  }
		}

		// Always Include the base
		tar.setAttribute("base", base);

		if(embedCustomAPIMain(tar, app) == true)
		{
			if(appJs == "")
			{
				return;
			}
			// Append the app
			_appRef = app; // blarg
			addEvent(_appRef, "load", onEventMainLoaded);
			addEvent(_appRef, "error", onEventMainError);
			tar.appendChild(_appRef);
		}

	}
	/*
    Append base to a URL, if it's not absolute.
	 */
	function fixUrl( inUrl )
	{
		if(inUrl && inUrl.indexOf("http")<0)
		{
			return base+inUrl; // omarsh
		}
		return inUrl;

	}
	/*
    Get the domain from a URL
	 */
	function getDomain( inUrl )
	{
		var s = inUrl.substr(0, 8), d;
		try{
		if(s.search('http://')<0 && s.search('https://')<0 && s.search('ftp://')<0){s="http://"+inUrl;}else{s=inUrl;}
		d = s.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/)[2];}
		catch(e){
		d = "" ;}
		return d ;
	}
	/*
    Helper method to return the api set via parameters. If null, assume API_NONE.
	 */
	function getCustomAPI()
	{
		if(parameters==null){return API_NONE;}
		var ret = API_NONE;
		if(api!=null)
		{
			var lowerCaseApi = api.toLowerCase();
			switch (lowerCaseApi) {
				case "nme" : 
					ret = API_HAXE_NME;
					break;
				case "flambe" : 
					ret = API_HAXE_FLAMBE;
					break;
				case "c2" :
				case "construct2":
					ret = API_CONSTRUCT_2;
					break;
				case "tresensa" :
					ret = API_TRESENSA;
					break;
				case "playcanvas" :
					ret = API_PLAYCANVAS;
					break;
				default : 
					ret = API_NONE;
					break;
			}
		}
		return ret;
	}
	/*
    Set the scale of the document canvas. Used for dynamic stage resizing.
	 */
	function scaleSet (pScale)
	{
	    if ( pScale > scaleMax ){ pScale = scaleMax; }

	    if(parameters.scaletype!=SCALETYPE_NONE)
	    {
		    var tFinalW = Math.round(widthIdeal*pScale*1000)/1000;
		    var tFinalH = Math.round(heightIdeal*pScale*1000)/1000;

		    var d = doc.getElementById(targetId);

		    if(parameters.scaletype==SCALETYPE_FILL)
	    	{
		    	d.style.width = getBrowserWidth() + "px";
				d.style.height = getBrowserHeight() + "px";
				tFinalW = getBrowserWidth();
				tFinalH = getBrowserHeight();
	    	} else if(parameters.scaletype==SCALETYPE_FILL_TO)
	    	{
	    		tFinalW = Math.round(widthMax*pScale*1000)/1000;
	    		tFinalH = Math.round(heightMax*pScale*1000)/1000;
	    		if ( getBrowserWidth() > tFinalW ) d.style.width = tFinalW + "px";
	    		else{
	    			d.style.width = getBrowserWidth() + "px";
	    			tFinalW = getBrowserWidth();
	    		}
	    		if ( getBrowserHeight() > tFinalH ) d.style.height = tFinalH + "px";
	    		else {
	    			d.style.height = getBrowserHeight() + "px";
					tFinalH = getBrowserHeight();
	    		}
	    	} else  if(parameters.scaletype==SCALETYPE_FIT){
		    	d.style.width = tFinalW + "px";
		    	d.style.height = tFinalH + "px";
		    	d.style.left = ((getBrowserWidth()/2) - (tFinalW/2)) + "px";


		    	if (tFinalH < getBrowserHeight()) {
		    		d.style.top = ((getBrowserHeight() / 2) - (tFinalH/2)) + "px";
		    	} else {
		    		// set top to 0 if height >= browser height (fill the page height)
		    		d.style.top = '0px';
		    	}
	    	} else if(parameters.scaletype==SCALETYPE_FIT_HORIZONTAL) {
	    		if ( getBrowserWidth() > tFinalW ) d.style.width = tFinalW + "px";
	    		else d.style.width = getBrowserWidth() + "px";
	    		d.style.height = tFinalH + "px";
	    		d.style.left = ((getBrowserWidth()/2) - (tFinalW/2)) + "px";
	    	}
	    }
	    //if(console.log){console.log("CanvasScale: " + pScale);}
	    win.canvasScale = pScale; // [TODO] Legacy. Should probably remove.
	    doc.canvasScale = pScale; // [TODO] Legacy. Should probably remove.
	    _canvasScale	= pScale;
	    _canvasWidth 	= getBrowserWidth();
	    _canvasHeight 	= getBrowserHeight();
	    _scaledWidth  	= tFinalW;
	    _scaledHeight  	= tFinalH;

	    if(parameters.scaletype==SCALETYPE_FILL)
    	{
	    	_contentOffsetX = ( getBrowserWidth() - tFinalW ) / 2;
			_contentOffsetY = ( getBrowserHeight() - tFinalH ) / 2;
    	} else if(parameters.scaletype==SCALETYPE_FILL_TO)
    	{
    		_contentOffsetX = ( tFinalW - (widthIdeal*pScale) ) / 2;
			_contentOffsetY = ( tFinalH - (heightIdeal*pScale) ) / 2;
    	} else {
    		// Nothing, just leave it 0.
    	}
	}
	/*
    Window Resize event listener callback. Used for dynamic stage resizing.
	 */
	function onEventResize (event)
	{
		scaleCalculate();
	}
	/*
    Helper method to calculate the correct scale ratio. Used for dynamic stage resizing.
	 */
	function scaleCalculate()
	{
		 var tWidth = getBrowserWidth();
         var tHeight = getBrowserHeight();
         //if(console.log){console.log("Width: " + tWidth + " Height: " + tHeight);}
         var tScale = 1;
         if (parameters.scaletype==SCALETYPE_FIT_HORIZONTAL){
        	 tScale = tWidth/widthIdeal;
         } else {
	         if ( tWidth/widthIdeal < tHeight/heightIdeal ) tScale = tWidth/widthIdeal;
	         else tScale = tHeight/heightIdeal;
         }
         scaleSet(tScale);
	}
	/*
	Get the client width.
	 */
    function getBrowserWidth()
    {
    	if (window.innerWidth) { width = window.innerWidth; }
        else if (document.documentElement && document.documentElement.clientWidth != 0) { width = document.documentElement.clientWidth; }
        else if (document.body) { width = document.body.clientWidth; }

        return width;
    };
    /*
	Get the client height.
	 */
    function getBrowserHeight()
    {
        if (window.innerHeight) {  return window.innerHeight; }
        if (document.documentElement && document.documentElement.clientHeight != 0) { return document.documentElement.clientHeight; }
        if (document.body) { return document.body.clientHeight; }
        return 0;
    };
    /*
	Callback when one of the library js preloads. Library JS would be loading via embedLib, which will only usually run before the mainJS is embedded.
	 */
	function onEventLibLoaded( event )
	{
		libsLoaded++;
		if(flagDomLoaded)
		{
			onReady();
		}
	}

	function onEventLibError( event )
	{
		//alert("jsEmbed onEventLibError " + event.target.src);

		//embedLib(event.target.src, false, true,0);
		//setTimeout( function (){embedLib(event.target.src, false, true,0);}, 500);
		embedLib(event.target.src, false, true, 500, true)

	}

	/*
	Callback when the main JS loads. Only exists to call embedCustomAPIPost();
	 */
	function onEventMainLoaded( event )
	{
		//removeEvent(_appRef, "load", onEventMainLoaded);
		//removeEvent(_appRef, "error", onEventMainError);
		embedCustomAPIPost();
	}
	/*
	Callback if the main JS load fails.
	 */
	function onEventMainError( event )
	{
		removeEvent(_appRef, "load", onEventMainLoaded);
		removeEvent(_appRef, "error", onEventMainError);

		retryCountMain++;
		if(retryCountMain>3)
		{
			if(console.log){console.log("JSEmbed : Main Target retry limit reached. Load failed.");}
			return;
		}// Fail quietly
		console.log("JSEmbed : Main Target load failed. Retrying... (" + retryCountMain+")");
		executeJsEmbed();
	}
	 /*
	Toggle isPaused flag on window.
	 */
	function setPause( val )
	{
		flagPaused = val;
		win.isPaused = flagPause; // [TODO] Legacy. Probably should remove.
	}
	/*
	Returns the embed div element
	 */
	function getEmbedDiv()
	{
		return doc.getElementById(targetId);
	}
	/*
	Returns the embed div's Id
	 */
	function getEmbedDivId()
	{
		return targetId;
	}
	/*
	Set the max scale so it's not just the default 3.
	 */
	function setScaleMax(inScaleMax)
	{
		if(isNaN(inScaleMax) || inScaleMax<=0){return;}
		scaleMax = inScaleMax;
		scaleCalculate();
	}
	 /*
	An inform event from anywhere.
	 */
	function inform( inString )
	{
		// dispatch an inform event.
		if(console.log){console.log("inform: " + inString);}
		var event = new Event(inString);
		getEmbedDiv().dispatchEvent(event);
	}
	 /*
	  * Add text alert
	 */
	function addAlertDiv( inText , inTarget )
	{
		if(inTarget=="" || inTarget==null)
		{
			inTarget = targetId;
		}
		var id = "alertoverlay";
		var tar = doc.getElementById(inTarget);//doc.getElementsByTagName("body")[0];//

		if(doc.getElementById(id))
		{
			//if(console.log){console.log("[jsEmbed](addDiv) already exists. Updating instead.");}
			div = doc.getElementById(id);
			div.innerHTML = "<font color=#FFFFFFF; size=6; align='center'>"+inText+"<font>";
			return;
		}

		var div = doc.createElement("div");
		div.setAttribute("id", id);
		div.innerHTML = "<font color=#FFFFFFF; size=6; align='center'>"+inText+"<font>";
		div.setAttribute("style", "position:absolute; index:99999; left:5%; top:40%; text-align:'center'; text-shadow:1px 1px 1px black; ");
		tar.appendChild(div);

		//if(console.log){console.log("[jsEmbed](addDiv) Complete! ");}
	}

	function removeAlertDiv( inTarget )
	{
		if(inTarget=="" || inTarget==null)
		{
			inTarget = targetId;
		}
		var id = "alertoverlay";
		var targ = doc.getElementById(inTarget);//doc.getElementsByTagName("body")[0];//

		if(doc.getElementById(id))
		{
			div = doc.getElementById(id);
			targ.removeChild(div);
			//if(console.log){console.log("[jsEmbed](removeAlertDiv) Complete!");}
			return;
		}
		//if(console.log){console.log("[jsEmbed](removeAlertDiv) Alert div doesn't exist.");}

	}

	/*
    Public methods
	 */
	return {
		exists : function()
		{
			return true;
		},
		params : function()
		{
			return parameters;
		},
		attr : function()
		{
			return attributes;
		},
		baseUrl : function()
		{
			return base;
		},
		embedDiv : function()
		{
			return getEmbedDiv();
		},
		embedDivId : function()
		{
			return getEmbedDivId();
		},
		isBaseCrossdomain : function()
		{
			return flagBaseCrossdomain;
		},
		canvasWidth : function()
		{
			return _canvasWidth;
		},
		canvasHeight : function()
		{
			return _canvasHeight;
		},
		scaledWidth : function()
		{
			return _scaledWidth;
		},
		scaledHeight : function()
		{
			return _scaledHeight;
		},
		canvasScale : function()
		{
			return _canvasScale;
		},
		contentOffsetX : function()
		{
			return _contentOffsetX;
		},
		contentOffsetY : function()
		{
			return _contentOffsetY;
		},
		scaleType : function()
		{
			return parameters.scaletype==null?SCALETYPE_FIT:parameters.scaletype;
		},
		setCanvasScaleMax : function( inScaleMax )
		{
			setScaleMax( inScaleMax );
		},
		setCanvasOffset : function( inOffsetX, inOffsetY )
		{
			_contentOffsetX = inOffsetX;
			_contentOffsetY = inOffsetY;
		},
		embed : function( inAppJs, inTarget, inWidth, inHeight, inParams, inAttributes )
		{
			if(console.log){console.log("[jsEmbed] v" + VERSION);}
			// Store the params for later.
			appJs = inAppJs;
			targetId = inTarget;
			//width = inWidth;
			//height = inHeight;
			attributes = inAttributes;
			parameters = inParams;
			flagEmbedCalled = true;
			// Get the API, if any
			api = "";
			// legacy support
			if(parameters.haxeapi!=null)
			{
				api = parameters.haxeapi;
			} else if(parameters.api!=null)
			{
				api = parameters.api;
			}

			// Set the expected scale
			widthIdeal = inWidth;
			heightIdeal = inHeight;

			// Set the indexroot flag, so we know if the index is the root of the URL or if the domain is.
			if(parameters.indexroot==null)
			{
				flagIndexRoot = false;
			} else {
				flagIndexRoot = parameters.indexroot=="true";
			}

			// Set the scaleType. If scaleType was set in embed, use that setting over anything else.
			if(parameters.scaletype==null)
			{
				// Interpret autoscale setting (legacy support)
				if(parameters.autoscale==null)
				{
					parameters.scaletype = SCALETYPE_FIT;
				} else {
					parameters.scaletype=parameters.autoscale=="true"?SCALETYPE_FIT:SCALETYPE_NONE;
				}
			}

			// Set the max dimensions
			if(parameters.maxwidth!=null)
			{
				widthMax = parameters.maxwidth;
			}
			if(parameters.maxheight!=null)
			{
				heightMax = parameters.maxheight;
			}

			// Calculate the current real domain
			var realDomain = window.location.host;
			var baseDomain = "";

			// Calculate base
			if(parameters.base==null)
			{
				base = "";
				baseDomain = realDomain;
			} else {
				base = parameters.base;
				if(base.indexOf("http")>=0)
				{
					// Nothing
					baseDomain = getDomain(base);
				} else if(flagIndexRoot)
				{
					// Nothing
					baseDomain = realDomain;
				} else
				{
					// Append the real domain onto the relative base.
					var http = (window.location.toString().indexOf("https://")<0?"http://":"https://");
					base = http + realDomain + ((realDomain.charAt(realDomain.length-1)=="/" || base.charAt(0)=="/")?"":"/") + base;
					baseDomain = realDomain;
				}

				if(base.length>0 && base.charAt(base.length-1)!="/")
				{
					base+="/";
				}

			}
			if(console.log)
			{
				if(base=="")
				{
					//console.log("[JsEmbed] base : ''"); // don't bother printing the base if it's empty
				} else {
					console.log("[JsEmbed] base : " + base);
				}
			}

			// Determine if we're loading crossdomain
			flagBaseCrossdomain = baseDomain!=realDomain;
			if(flagBaseCrossdomain)
			{
				if(console.log){console.log("[JsEmbed] Warning: Loading Crossdomain");}
			}

			// Load any libs
			if(parameters.libs==null)
			{
				libs = [];
			} else {
				if( typeof parameters.libs === 'string' ) {
				    libs = [ parameters.libs ];
				} else {
					libs = parameters.libs;
				}
			}

			// Now have array of libs. Start loading them.
			var index = 0;
			for(var l in libs)
			{
				embedLib(libs[l], true, false, index*250, parameters.libsIgnoreBase=="true"?true:false);
				index++;
			}

			embedCustomAPIPre();

			// Wait until the DOM is loaded, if it's not already.
			if(flagDomLoaded)
			{
				onReady();
			} else {
				//alert("[JSEmbed] DOM not loaded. Waiting...");
			}

		}
		,
		pause : function()
		{
			setPause(true);
		}
		,
		unpause : function()
		{
			setPause(false);
		}
		,
		isPaused : function()
		{
			return flagPaused;
		}
		,
		inform : function( inString )
		{
			inform( inString );
		}
		,
		informConstructed : function()
		{
			inform("constructed");
		}
		,
		informtInitialized : function()
		{
			inform("init");
		}
		,
		informReady : function()
		{
			inform("ready");
		}
		,
		setDimensions : function( inWidth, inHeight )
		{
	         var tScale = 1;
	         if ( inWidth/widthIdeal < inHeight/heightIdeal ) tScale = inWidth/widthIdeal;
	         else tScale = inHeight/heightIdeal;
	         scaleSet(tScale);
		}
		,
		setScale : function( pScale )
		{
	         scaleSet(pScale);
		}
		,
		addMetaTag : function ( inName, inContent )
		{
			addMetaTag( inName, inContent );
		}
		,
		addAlert : function ( inText, inTarget )
		{
			addAlertDiv(inText, inTarget);
		}
		,
		removeAlert : function ( inTarget )
		{
			removeAlertDiv(inTarget);
		},
		enableAutoScaling : function() {
			embedScalingScript();
		},

		disableAutoScaling : function() {
			if (!flagScalingScriptEmbeded) {
				return;
			}
			flagScalingScriptEmbeded = false;
			removeEvent(window, "resize", onEventResize);
		},

		setDefaultEmbedDivStyle : function() {
			var tar = getEmbedDiv();
			tar.setAttribute("style", "padding:0;-webkit-user-select: none; -ms-touch-action:none;	overflow: hidden; width:"+widthIdeal+"px;	height:"+heightIdeal+"px; -webkit-tap-highlight-color: rgba(0,0,0,0);");
		},

		getIdealDimension : function() {
			return {width : widthIdeal, height : heightIdeal};
		}
	};

	/*
	 * PRE-EMBED STEP:
	 Add support for custom API Libs here. This runs BEFORE embed, during the DOM loading sequence. Good chance to embed libraries.
	 */
	function embedCustomAPIPre()
	{
		switch(getCustomAPI())
		{
			case API_HAXE_FLAMBE:
				embedLib(appJs, true, false, 0);//embedLib("flambe.js", true, false, 0); // Previously enforced flambe.js here. Now allows for relocating flambe.js if desired. Flambe.js still necessary.
				break;
			case API_CONSTRUCT_2:
				break;
			case API_TRESENSA:
			case API_HAXE_NME:
			case API_NONE:
			default:
				break;
		}

	}
	/*
	 * EMBED STEP
    Any custom code for embedding a custom API goes here. Tar is the target object of div. App is the new <script> that will contain the main JS Application as it's src.
    Return true to continue with appending app to tar after this method resolves.
    Return false to cancel appending. Useful if your API doesn't really want to append anything  and you're just using jsembed as a tool for embedding libraries.
    WARNING: IF you return false, embedCustomAPIPost will not fire because it relies on the app script object's load event. You'll have to write your own callback if you have post processes you need to run.
	 */
	function embedCustomAPIMain(tar, app)
	{
		switch(getCustomAPI())
		{
			case API_HAXE_NME:
				tar.setAttribute("style", "position: absolute; left: 50%;	" + (attributes.autoscale=="false"?"margin-left:-512px;":"padding:0;") +	"-webkit-user-select: none; -ms-touch-action:none;	overflow: hidden; width:"+widthIdeal+"px;	height:"+heightIdeal+"px; -webkit-tap-highlight-color: rgba(0,0,0,0); data-framerate:30;");
				targetId = "haxe:jeash";
				tar.setAttribute("id", "haxe:jeash");
				tar.setAttribute("name", "viewport");
				app.setAttribute("id", "haxe:jeash:script");
				embedScalingScript();
				// If the appJs path is absolute, make sure we account for that.
				app.src = fixUrl(appJs);
				return true;
			case API_HAXE_FLAMBE:
				tar.setAttribute("style", "padding:0;-webkit-user-select: none; -ms-touch-action:none;	overflow: hidden; width:"+widthIdeal+"px;	height:"+heightIdeal+"px; -webkit-tap-highlight-color: rgba(0,0,0,0); data-framerate:30;");
				embedScalingScript();
				var flambeEmbed = parameters && parameters.flambeEmbed ? parameters.flambeEmbed : base + 'targets/main-html.js';
				win.flambe.embed([flambeEmbed], targetId);
				return false;
			case API_CONSTRUCT_2:
				var canvas = document.createElement("canvas");
				canvas.setAttribute('id', 'c2canvas');
				canvas.setAttribute('width', widthIdeal);
				canvas.setAttribute('height', heightIdeal);
				//addEvent(canvas, "load", onEventConstruct2Loaded);
				doc.getElementsByTagName("body")[0].appendChild(canvas);

				app.src = fixUrl(appJs); // [TODO] Here I'm embedding the c2runtime.js (or whatever they renamed it to). This is untested, but I think it'll work..
				return true;
			case API_TRESENSA:
                tar.setAttribute("style", "position:relative; width:"+widthIdeal+"px; height:"+heightIdeal+"px; overflow: hidden;");
                app.src = fixUrl(appJs);
                embedScalingScript();
				return true;
			case API_PLAYCANVAS:
				tar.setAttribute("style", "position:absolute; padding:0;-webkit-user-select: none; -ms-touch-action:none;	overflow: hidden; width:"+widthIdeal+"px;	height:"+heightIdeal+"px; -webkit-tap-highlight-color: rgba(0,0,0,0); data-framerate:30;");
				embedScalingScript();
				return false;
			default:
			case API_NONE:
				app.src = fixUrl(appJs);
				return true;
		}
		return true;
	}

	/*
	 * POST-EMBED STEP
    Any custom code to run after the main JS has been embedded goes here.
	 */
	function embedCustomAPIPost()
	{
		switch(getCustomAPI())
		{
			case API_CONSTRUCT_2:
				// [TODO] Run script block here to create the runtime and add document listeners, etc.
				/*
				if(parameters.init==null){return;}
				var c2init = document.createElement("script");
				c2init.src=parameters.init;
				doc.getElementsByTagName("body")[0].appendChild(c2init);
				*/
				break;
			case API_TRESENSA:
                var tgeGame = new window[attributes.gameclass]();
                if(tgeGame.IsPlatformAcceptable()) {
                    tgeGame.Launch( {gameDiv:targetId, initialWidth:widthIdeal, initialHeight:heightIdeal} );
                }
				break;
			case API_HAXE_NME:
			case API_HAXE_FLAMBE:
			case API_NONE:
			default:
				// Nothing.
				break;
		}
	}
}();
