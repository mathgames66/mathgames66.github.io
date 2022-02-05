var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation,lib;
var iw = window.innerWidth, ih=window.innerHeight;
function init() {
	canvas = document.getElementById("canvas");
	anim_container = document.getElementById("animation_container");
	dom_overlay_container = document.getElementById("dom_overlay_container");
	var comp=AdobeAn.getComposition("064A5EF8A526134DBB45A732B5EC511C");
	lib=comp.getLibrary();
	createjs.MotionGuidePlugin.install();
	var loader = new createjs.LoadQueue(false);
	loader.installPlugin(createjs.Sound);
	loader.addEventListener("fileload", function(evt){handleFileLoad(evt,comp)});
	loader.addEventListener("complete", function(evt){handleComplete(evt,comp)});
	loader.addEventListener("progress", function(evt){handleProgress(evt)});
	lib=comp.getLibrary();
	loader.loadManifest(lib.properties.manifest);
}
function handleFileLoad(evt, comp) {
	var images=comp.getImages();	
	if (evt && (evt.item.type == "image")) { images[evt.item.id] = evt.result; }	
}
function handleProgress(evt) {
		$("#centertext").text(Math.floor(evt.loaded * 100)+"%");
}
function handleComplete(evt,comp) {
	clearInterval(loadrotate);
	lib=comp.getLibrary();
	var ss=comp.getSpriteSheet();
	var queue = evt.target;
	var ssMetadata = lib.ssMetadata;
	for(i=0; i<ssMetadata.length; i++) {
		ss[ssMetadata[i].name] = new createjs.SpriteSheet( {"images": [queue.getResult(ssMetadata[i].name)], "frames": ssMetadata[i].frames} )
	}
	var stb = document.getElementById("stBut");
	stb.style.display = 'inline';
}
function startG() {

	var preloaderDiv = document.getElementById("_preload_div_");
	preloaderDiv.style.display = 'none';
	canvas.style.display = 'block';
	exportRoot = new lib.truckhtml5();
	stage = new lib.Stage(canvas);	
	fnStartAnimation = function() {
		stage.addChild(exportRoot);
		createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
		createjs.Ticker.interval = 1000/60;
		createjs.Ticker.addEventListener("tick", stage);
	}	    
	function makeResponsive(isResp, respDim, isScale, scaleType) {		
		var lastW, lastH, lastS=1;		
		window.addEventListener('resize', resizeCanvas);
		resizeCanvas();		
		function resizeCanvas() {			
			var w = lib.properties.width, h = lib.properties.height;			
			iw = window.innerWidth;
			ih=window.innerHeight;			
			var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
			if(isResp) {                
				if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
					sRatio = lastS;                
				}				
				else if(!isScale) {					
					if(iw<w || ih<h)						
						sRatio = Math.min(xRatio, yRatio);				
				}				
				else if(scaleType==1) {					
					sRatio = Math.min(xRatio, yRatio);				
				}				
				else if(scaleType==2) {					
					sRatio = Math.max(xRatio, yRatio);				
				}			
			}


		if(createjs.Touch.isSupported()) {
			
			createjs.Touch.enable(stage);
			var scaleX = iw / lib.properties.width;
			var scaleY = ih / lib.properties.height;
			var scale = Math.min(scaleX, scaleY);
			
			stage.canvas.width = iw * pRatio;
			stage.canvas.height = ih * pRatio;

			stage.scaleX = sRatio * pRatio;
			stage.scaleY = sRatio * pRatio;

			stage.x = (iw - (lib.properties.width * sRatio)) / 2  * pRatio;
			stage.y = (ih - (lib.properties.height * sRatio)) / 2  * pRatio;

			anim_container.style.width = dom_overlay_container.style.width = 100+'%';
			anim_container.style.height = dom_overlay_container.style.height = 100+'%';
			
			canvas.style.width = 100+'%';				
			//canvas.style.height = 100+'%';			
			 updateButtons();
			
		} else {
			pRatio = 1.5;
			canvas.width = w*pRatio*sRatio;			
			canvas.height = h*pRatio*sRatio;
			
			anim_container.style.width = dom_overlay_container.style.width = w*sRatio+'px';
			anim_container.style.height = dom_overlay_container.style.height = h*sRatio+'px';
			
			canvas.style.width = preloaderDiv.style.width = w*sRatio+'px';				
			canvas.style.height = preloaderDiv.style.height = h*sRatio+'px';			
			stage.scaleX = pRatio*sRatio;			
			stage.scaleY = pRatio*sRatio;	
		}
			
			lastW = iw; lastH = ih; lastS = sRatio;            
			stage.tickOnUpdate = false;            
			stage.update();            
			stage.tickOnUpdate = true;		
		}
	}
	makeResponsive(true,'both',true,1);	
	AdobeAn.compositionLoaded(lib.properties.id);
	fnStartAnimation();
}
function playSound(id, loop) {return createjs.Sound.play(id, createjs.Sound.INTERRUPT_EARLY, 0, 0, loop);}
var ref = "direct";checkdomain();var angle = 0;var loadrotate = setInterval(loadscreen, 20);
function loadscreen() {document.getElementById("loadingicon").style.WebkitTransform = "rotate(" + angle + "deg)"; document.getElementById("loadingicon").style.msTransform = "rotate(" + angle + "deg)"; document.getElementById("loadingicon").style.transform = "rotate(" + angle + "deg)";angle+=8;if (angle >= 360) { angle = 0; }}
function checkdomain() {if(self!=top) ref = document.referrer.split('/')[2];}