(function(zonevars) {
	var zonemasters = zonevars.zonemasters;
	var top_loc="",top_href="",top_hash="";
	function getQueryHash() {
		top_hash = (top_hash=top_href.match(/[\?\&]cpmstarhash=([^\&]*)/))==null?"":"#"+top_hash[1];		
	}
	try { top_loc=window.top.location; top_href=top_loc.href; top_hash=top_loc.hash; } catch(err) {
		top_href = window.document.referrer;
		getQueryHash();
	}
	if(!top_hash) getQueryHash();

    var x=(10+((x*7)%26)).toString(36)+(x=window.location.href.split('').reduce(function(a,b){return(a<<5)-a+b.charCodeAt(0)>>>1},0));
	var y=window.location.href.split('').reduce(function(a,b){return(a<<5)-a+b.charCodeAt(0)>>>1},0);y=(10+((y*7)%26)).toString(36)+y.toString(36);
	var z=window.location.href.split('').reduce(function(a,b){return(a<<5)-a+b.charCodeAt(0)>>>0},0);z=(10+((z*7)%26)).toString(36)+z.toString(36);
	var q=window.location.href.split('#')[0].split('').reduce(function(a,b){return(a<<5)-a+b.charCodeAt(0)>>>1},0);q=(10+((q*7)%26)).toString(36)+q.toString(36);
	var cpmstarx="cpmstarx";
	if(window[x]) window[y] = window[x];
	if(window[y]) window[z] = window[y];
	if(window[z]) window[q] = window[z];
	if(window[q]) window[cpmstarx] = window[q];
    
    var dev = top_hash == "#cpmstarDev";
	var staging = (top_hash == "#cpmstarStaging" || top_hash == "#urlzing");
	if(typeof window[cpmstarx]!=="object") window[x] = window[y] = window[z] = window[q] = window[cpmstarx] = {};
	
	if(typeof(window[cpmstarx].zonevars)==="object") return;
	window[cpmstarx].zonevars = zonevars;

	var ver = "1103";
	window[cpmstarx].zonevars.ver = ver;


	if(top_hash == "#urlzing") {
		var qs = new URLSearchParams(window.location.search);
		if(qs.has('cpmstarDev')) {
			dev = true;
		}
	}

	for(var i=0; i<zonemasters.length; i++) { //Insert all the zonemasters
		var zonemasterobj = (typeof zonemasters[i]==="string")?{path:'/cached/zonemasters/'+zonemasters[i]}:zonemasters[i];

		var s = document.createElement('script'); 
		s.type = 'text/javascript'; 
		s.async = true;
		
		var proto = (window.location.protocol == "http:")?"http:":"https:";
		if(zonemasterobj.host == null) {            
			if(dev) zonemasterobj.host = "dev.server.cpmstar.com";
			else if(staging) zonemasterobj.host = "staging.server.cpmstar.com";
			else if(proto == "https:") zonemasterobj.host = "ssl.cdne.cpmstar.com";
			else zonemasterobj.host = "cdn.cpmstar.com";
		}else{
			if(staging) {
				if(zonevars.jbcheck) zonevars.jbcheck.host = "staging.urlzing.com";				
				zonemasterobj.host = "staging.urlzing.com"; 				
			}
		}
		
		s.src = proto + "//" + zonemasterobj.host + zonemasterobj.path + "?ver="+ver;
		var s2=document.getElementsByTagName('script')[0];
		s2.parentNode.insertBefore(s, s2);
	}
})(
{
  "zonemasters": [
    "mobilemodules.js",
    {
      "path": "/cached/zonemasters/cpmstarjsgameapi.js",
      "api": "game"
    }
  ],
  "requests": {
    "hb": {
      "kind": "hb",
      "pbjsfile": "starprebid.js",
      "PREBID_TIMEOUT": 850,
      "adUnits": [
        {
          "bids": [
            {
              "bidder": "rubicon",
              "params": {
                "accountId": "23330",
                "siteId": "368968",
                "zoneId": "2010084",
                "sizes": [
                  201
                ],
                "video": {
                  "language": "en"
                }
              },
              "campaignid": "467669",
              "campaignids": {}
            }
          ],
          "mediaTypes": {
            "video": {
              "playerSize": [
                960,
                540
              ],
              "context": "instream"
            },
            "banner": {
              "sizes": [
                [
                  300,
                  250
                ]
              ]
            }
          },
          "fallback": {
            "kind": "video",
            "poolid": 80615,
            "vast": true
          },
          "code": "instream"
        },
        {
          "bids": [
            {
              "bidder": "ix",
              "params": {
                "siteId": "480921",
                "size": [
                  728,
                  90
                ]
              },
              "campaignid": 456271,
              "campaignids": {
                "728x90": 456271
              }
            },
            {
              "bidder": "ix",
              "params": {
                "siteId": "480921",
                "size": [
                  970,
                  90
                ]
              },
              "campaignid": 456272,
              "campaignids": {
                "970x90": 456272
              }
            }
          ],
          "mediaTypes": {
            "banner": {
              "sizes": [
                [
                  728,
                  90
                ],
                [
                  800,
                  100
                ],
                [
                  970,
                  90
                ],
                [
                  320,
                  50
                ],
                [
                  300,
                  50
                ],
                [
                  216,
                  36
                ]
              ]
            }
          },
          "fallback": {
            "poolid": 80617
          },
          "code": "anchor"
        },
        {
          "bids": [
            {
              "bidder": "rubicon",
              "params": {
                "accountId": "23330",
                "siteId": "368968",
                "zoneId": "2010084",
                "sizes": [
                  201
                ],
                "video": {
                  "language": "en"
                }
              },
              "campaignid": "467669",
              "campaignids": {}
            }
          ],
          "mediaTypes": {
            "video": {
              "playerSize": [
                960,
                540
              ],
              "context": "instream"
            }
          },
          "fallback": {
            "kind": "video",
            "poolid": 80837,
            "vast": true
          },
          "code": "midroll"
        },
        {
          "fallback": {
            "kind": "banner"
          },
          "code": "banner300x250",
          "mediaTypes": {
            "banner": {
              "sizes": [
                [
                  300,
                  250
                ]
              ]
            }
          }
        }
      ],
      "FALLBACK_FORCE_PERCENT": 1,
      "FALLBACK_BID_MULTIPLIER": 1,
      "publisherid": 41,
      "bidderDiscreps": {
        "rubicon": {
          "tagperadunit": false,
          "totalgross": 111.35409999999999,
          "totallocalgross": 65.49181590369676,
          "discrep": 1.7002750414455141
        }
      }
    },
    "instream": {
      "kind": "json",
      "vast": true,
      "poolid": 80615
    },
    "bypassanchor": {
      "kind": "editorial",
      "multi": "7",
      "json": "nc_editorial",
      "css": "h1{margin:0}.box,h1{font-weight:700}h1{color:#69b8ee;border-bottom:1px solid #69b8ee;line-height:1.5em;font-size:18px;font-family:Helvetica,Arial,sans-serif}body .box:last-child{margin-right:0}.box{box-shadow: #0000008a 3px 3px 1px 4px; position:relative;width:100px;height:100px;display:inline-block;vertical-align:text-bottom;margin:0 12px 12px 0;color:#000;text-decoration:none;font-size:14px;font-family:helvetica;overflow:hidden;border-radius:15px}.cpmstar-editorial-image{height:100px;width:100px;background-color:green;margin:auto} .box:hover{ cursor: pointer;} .box:hover .cpmstar-editorial-image{transform:scale(1.2);transition:.33s ease-in-out}.cpmstar-editorial-title{height:30%;bottom:0;left:0;position:absolute;z-index:1;display:block;font-family:helvetica;font-size:11px;line-height:14px;font-weight:500;background-color:rgba(0,125,179,.8);color:#fff;padding-top:2px;text-align:center;width:100%}.editorial_container{margin-left:35px}  a:nth-child(odd) div.cpmstar-editorial-title {background-color:darkcyan;}",
      "template": "{{~it.creatives :creative:index}} <a style=\"display:inline-block; border-bottom:none;\" href=\"{{=creative.clickUrl}}\" target=\"_blank\" class=\"box\"> <div class=\"imagebox\"> <img src=\"{{=creative.imageUrl}}\" height=\"100\" width=\"100\" class=\"cpmstar-editorial-image\"> </div> <div class=\"cpmstar-editorial-title\"> {{=creative.title}} </div> </a>{{~}}",
      "options": {
        "thumbWidth": 100,
        "thumbHeight": 100,
        "imageHeight": 100,
        "imageWidth": 100
      },
      "style": {
        "height": 105,
        "width": 810
      },
      "poolid": 80616
    },
    "anchor": null,
    "bypassvideo": {
      "kind": "editorial",
      "json": "nc_editorial",
      "multi": "1",
      "options": {
        "width": "348px",
        "height": "348px",
        "thumbWidth": 100,
        "thumbHeight": 100,
        "imageHeight": 100,
        "imageWidth": 100
      },
      "requiredmacros": "IMAGE800X288|IMAGE180X100",
      "style": {
        "width": "348px",
        "height": "348px"
      },
      "css": {},
      "template": "<h1>Brought to you by some dudes!</h1>",
      "poolid": 80618
    },
    "midroll": {
      "kind": "json",
      "vast": true,
      "poolid": 80837
    }
  },
  "modules": [
    {
      "kind": "banner",
      "info": {
        "name": "POOL 80617"
      },
      "conditions": {
        "target": {
          "kind": "replace",
          "find": "$80617"
        }
      },
      "options": {
        "maxHeight": 100
      },
      "request": "hb",
      "adUnitPath": "/ArmorGames/$80617"
    },
    {
      "info": {
        "name": "anchor"
      },
      "blueprint": "hybridanchor",
      "conditions": [
        {
          "wait": true,
          "jbStatus": [
            "0",
            "1"
          ],
          "request": "anchor"
        },
        {
          "wait": true,
          "jbStatus": "2",
          "request": "bypassanchor"
        }
      ]
    },
    {
      "info": {
        "name": "banner300x250"
      },
      "kind": "banner",
      "request": "hb",
      "adUnitPath": "banner300x250",
      "conditions": {
        "wait": true
      },
      "options": {
        "width": 300,
        "height": 250
      }
    },
    {
      "info": {
        "name": "banner728x90"
      },
      "kind": "banner",
      "request": "hb",
      "adUnitPath": "banner728x90",
      "conditions": {
        "wait": true
      },
      "options": {
        "width": 728,
        "height": 90
      }
    },
    {
      "info": {
        "name": "preroll"
      },
      "blueprint": "instreamvideo",
      "request": "hb",
      "adUnitPath": "instream",
      "options": {
        "requireViewable": false,
        "autoSizeToTarget": true
      },
      "conditions": {
        "wait": true
      },
      "css": {
        ".cpmsvideoclosebanner:after": {
          "content": "'Start Game'"
        }
      }
    },
    {
      "info": {
        "name": "interstitial"
      },
      "blueprint": "hybridinstreamvideo",
      "options": {
        "startHidden": true
      }
    },
    {
      "info": {
        "name": "midroll"
      },
      "blueprint": "instreamvideo",
      "request": "hb",
      "adUnitPath": "midroll"
    },
    {
      "info": {
        "name": "rewardedvideo"
      },
      "blueprint": "instreamvideo",
      "adUnitPath": "instream",
      "options": {
        "autoSkippability": false
      }
    }
  ],
  "options": {
    "referrerRevshare": 1
  },
  "info": {
    "id": 198
  }
}
);