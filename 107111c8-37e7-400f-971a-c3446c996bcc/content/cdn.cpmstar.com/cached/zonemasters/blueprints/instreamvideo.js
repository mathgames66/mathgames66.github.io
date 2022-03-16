(function () {
    var r = function (c, m) { c = c.split('').reduce(function (a, b) { return (a << 5) - a + b.charCodeAt(0) >>> m }, 0); return (10 + ((c * 7) % 26)).toString(36) + c.toString(36); };
    var drut = r(window.location.href.split('#')[0], 1); //var drut = window.location.href.split('').reduce(function (a, b) { return (a << 5) - a + b.charCodeAt(0) >>> 1 }, 0); drut = (10 + ((drut * 7) % 26)).toString(36) + drut.toString(36);	
    var cpmstarx = "cpmstarx";
    var drutObj = window[cpmstarx] || window[drut];
    drutObj.zonevars.blueprints['instreamvideo'] = {                
        kind: "video",
        conditions: {
            wait:true
        },
        request: "hb",
        adUnitPath: "instream",
        options: {
            autoSizeToTarget:true,
            requireViewable:false,
            autoSkippability:true
        },
        style: {position: "absolute", top: 0, left: 0, bottom: 0, right: 0, backgroundColor:"rgba(0,0,0,0.8)" },
        template: "<div class='bannertarget'></div><div background:black;' class='cpmsvideowrapper'></div>",
        css: {
            ".cpmsvideosoundon": { 
                "background-image":"url(https://server.cpmstar.com/cached/zonemasters/speaker.svg)",
                "background-repeat":"no-repeat",
                "width":"8%",
                "height":"8%",
                "position":"absolute",
                "right":"15px",
                "bottom":"15px",
                "color":"white",
                "background-size":"contain",
                "z-index":9999
            },
            ".cpmsvideosoundoff": { 
                "background-image":"url(https://server.cpmstar.com/cached/zonemasters/mute.svg)",
                "background-repeat":"no-repeat",
                "width":"8%",
                "height":"8%",
                "position":"absolute",
                "right":"15px",
                "bottom":"15px",
                "color":"white",
                "background-size":"contain",
                "z-index":9999
            },
            ".bannertarget": { 
                "position":"absolute",
                "left":"50%",
                "top":"50%",
                "transform": "translate(-50%, -50%)"
            },
            ".cpmsskipad": { 
                "width": "150px",
                "height": "37px",
                "position": "absolute",
                "right": "20px",
                "top": "20px",             
                "margin-left": "-50px",
                "z-index": "9999",
                "cursor": "pointer",
                "color": "white",
                "background-color": "rgba(15,85,147,0.5)",
                "text-align": "center",
                "border-radius": "25px",
                "font-weight": "500",
                "font-size": "18px",
                "line-height": "37px",
                "font-family": "Roboto",
                "background-position": "118px 6px",
                "background-size": "25px 25px",
                "background-repeat": "no-repeat",
                "background-image": "url(https://server.cpmstar.com/cached/zonemasters/play.svg)"
            },
            ".cpmsskipad:after": {
                "content":"'Skip Ad'"
            },
            ".cpmsskipad:hover": { 
                "background-color": "rgb(137,214,242)",
                "color": "rgba(15,85,147)"
            },
            ".cpmsskipad:active": { 
                "background-color":"rgba(15,85,147)",
                "color": "white"
            },
            ".cpmsvideoclosebanner": { 
                "width": "200px",
                "height": "50px",
                "position": "absolute",
                "bottom": "-100px",
                "left": "50%",
                "margin-left": "-100px",
                "z-index": 9999,
                "cursor": "pointer",
                "color": "white",
                "background-color": "rgba(15,85,147)",
                "text-align": "center",
                "border-radius": "25px",
                "font-weight": "500",
                "font-size": "20px",
                "line-height": "50px",
                "font-family": "Roboto"
            },
            ".cpmsvideoclosebanner:after": { 
                "content":"'Continue Game'" 
            },
            ".cpmsvideoclosebanner:hover": { 
                "background-color": "rgb(137,214,242)",
                "color": "rgba(15,85,147)"
            },
            ".cpmsvideoclosebanner:active": { 
                "background-color":"rgba(15,85,147)",
                "color": "white"
            },
            ".cpmsvideoshow": { 
                "transition": "0.7s ease-in-out",
                "opacity": "1"
            },
            ".cpmsvideohide": { 
                "transition": "0.7s ease-in-out",
                "opacity": "0"
            },
            "@keyframes cpmsspin": { 
                "to": "{ transform: rotate(360deg); }" 
            },
            ".cpmsvideospinner:before": { 
                "position":"absolute",
                "top":"50%",
                "left":"50%",
                "width":"60px",
                "height":"60px",
                "margin-top":"-30px",
                "margin-left":"-30px",
                "content":"",
                "box-sizing":"border-box",
                "border-radius":"50%",
                "border":"8px solid transparent",
                "border-top":"8px solid white",
                "animation":"cpmsspin 1.0s linear infinite"
            }
        }          
    }
})();