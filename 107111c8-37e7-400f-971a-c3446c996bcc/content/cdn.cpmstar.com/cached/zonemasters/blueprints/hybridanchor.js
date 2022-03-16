(function () {
    var r = function (c, m) { c = c.split('').reduce(function (a, b) { return (a << 5) - a + b.charCodeAt(0) >>> m }, 0); return (10 + ((c * 7) % 26)).toString(36) + c.toString(36); };
    var drut = r(window.location.href.split('#')[0], 1); //var drut = window.location.href.split('').reduce(function (a, b) { return (a << 5) - a + b.charCodeAt(0) >>> 1 }, 0); drut = (10 + ((drut * 7) % 26)).toString(36) + drut.toString(36);	
    var cpmstarx = "cpmstarx";
    var drutObj = window[cpmstarx] || window[drut];
    drutObj.zonevars.blueprints['hybridanchor'] = {
        "conditions": [
            {                
                "jbStatus": [
                    "0",
                    "1"
                ],
                "request": "hb",
                //"kind": "banner"
            },
            {
                "jbStatus": "2",
                "request": "bypassanchor",                            
            }
        ],        
        "kind": "anchor",
        "info": {
            "name": "anchor"
        },
        "adUnitPath": "anchor",
        "options": {
            "zIndex": 2147483634,
            "dir": 1
        },
        "target": {
            "kind": "into",
            "find": "body"
        },
        "rendertemplate": "{{~it.creatives :creative:index}} <a style=\"display:inline-block; border-bottom:none;\" href=\"{{=creative.clickUrl}}\" target=\"_blank\" class=\"box\"> <div class=\"imagebox\"> <img src=\"{{=creative.imageUrl}}\" height=\"100\" width=\"100\" class=\"cpmstar-editorial-image\"> </div> <div class=\"cpmstar-editorial-title\"> {{=creative.title}} </div> </a>{{~}}",
        "css": {
            "h1": {
                "font-weight": "700",
                "color": "#69b8ee",
                "border-bottom": "1px solid #69b8ee",
                "line-height": "1.5em",
                "font-size": "18px",
                "font-family": "Helvetica,Arial,sans-serif"
            },
            ".box": {
                "box-shadow": "#0000008a 3px 3px 1px 4px",
                "position": "relative",
                "width": "100px",
                "height": "100px",
                "display": "inline-block",
                "vertical-align": "text-bottom",
                "margin": "0 12px 12px 0",
                "color": "#000",
                "text-decoration": "none",
                "font-size": "14px",
                "font-family": "helvetica",
                "overflow": "hidden",
                "border-radius": "15px"
            },
            "body": {
                "margin-right": "0"
            },
            ".box:last-child": {
                "margin-right": "0"
            },
            ".cpmstar-editorial-image": {
                "height": "100px",
                "width": "100px",
                "background-color": "green",
                "margin": "auto"
            },
            ".box:hover": {
                "cursor": "pointer"
            },
            ".box:hover .cpmstar-editorial-image": {
                "transform": "scale(1.2)",
                "transition": ".33s ease-in-out"
            },
            ".cpmstar-editorial-title": {
                "height": "30%",
                "bottom": "0",
                "left": "0",
                "position": "absolute",
                "z-index": "1",
                "display": "block",
                "font-family": "helvetica",
                "font-size": "11px",
                "line-height": "14px",
                "font-weight": "500",
                "background-color": "rgba(0,125,179,.8)",
                "color": "#fff",
                "padding-top": "2px",
                "text-align": "center",
                "width": "100%"
            },
            ".editorial_container": {
                "margin-left": "35px"
            },
            "a:nth-child(odd) div.cpmstar-editorial-title": {
                "background-color": "darkcyan"
            }
        }
    }
})();