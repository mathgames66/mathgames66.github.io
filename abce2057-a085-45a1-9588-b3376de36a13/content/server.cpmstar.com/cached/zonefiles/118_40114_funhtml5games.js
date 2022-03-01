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

	var ver = "1164";
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
    "mobilemodules.js"
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
              "bidder": "onemobile",
              "params": {
                "dcn": "8a9698ab017474066989078e55c100cd",
                "pos": "8a969001017474066d5608c41f370169"
              },
              "campaignid": 445036,
              "campaignids": {
                "160x600": 445036
              }
            },
            {
              "bidder": "33across",
              "params": {
                "siteId": "asGKjG5Rar6yoTaKkv7mNO",
                "productId": "siab"
              },
              "campaignid": 449962,
              "campaignids": {
                "160x600": 449962
              }
            }
          ],
          "mediaTypes": {
            "banner": {
              "sizes": [
                [
                  160,
                  600
                ]
              ]
            }
          },
          "fallback": {
            "poolid": 71335,
            "width": 160,
            "height": 600
          },
          "code": "/PaulHTML5/$71335"
        },
        {
          "bids": [
            {
              "bidder": "appnexus",
              "params": {
                "placementId": "14741530"
              },
              "campaignid": 429993,
              "campaignids": {
                "728x90": 429993
              }
            },
            {
              "bidder": "onemobile",
              "params": {
                "dcn": "8a9698ab017474066989078e55c100cd",
                "pos": "8a969001017474066d5608c41bbe0167"
              },
              "campaignid": 445037,
              "campaignids": {
                "728x90": 445037
              }
            },
            {
              "bidder": "consumable",
              "params": {
                "unitId": "6863",
                "unitName": "cnsmbl-audio-728x90-slider",
                "zoneIds": [
                  2002341
                ],
                "siteId": "2000865",
                "networkId": "9969"
              },
              "campaignid": 446167,
              "campaignids": {
                "728x90": 446167
              }
            },
            {
              "bidder": "33across",
              "params": {
                "siteId": "d5vDic5Q8r6z9AaKlId8sQ",
                "productId": "siab"
              },
              "campaignid": 449961,
              "campaignids": {
                "728x90": 449961
              }
            },
            {
              "bidder": "aol",
              "params": {
                "placement": "5189183",
                "network": "11506.1"
              },
              "campaignid": 455155,
              "campaignids": {
                "728x90": 455155
              }
            },
            {
              "bidder": "appnexus",
              "params": {
                "placementId": "18480862"
              },
              "campaignid": 455166,
              "campaignids": {
                "728x90": 455166
              },
              "discrep": 1
            },
            {
              "bidder": "openx",
              "params": {
                "delDomain": "cpmstar-d.openx.net",
                "unit": "541079551"
              },
              "campaignid": 459091,
              "campaignids": {
                "728x90": 459091
              }
            },
            {
              "bidder": "amx",
              "params": {
                "tagId": "Y3Btc3Rhci5jb20",
                "adUnitId": "465936"
              },
              "campaignid": "465936",
              "campaignids": {
                "728x90": 465936
              }
            }
          ],
          "mediaTypes": {
            "banner": {
              "sizes": [
                [
                  728,
                  90
                ]
              ]
            }
          },
          "fallback": {
            "poolid": 71336,
            "width": 728,
            "height": 90
          },
          "code": "/PaulHTML5/$71336"
        },
        {
          "bids": [
            {
              "bidder": "onemobile",
              "params": {
                "dcn": "8a9698ab017474066989078e55c100cd",
                "pos": "8a969001017474066d5608c41d720168"
              },
              "campaignid": 445034,
              "campaignids": {
                "300x250": 445034
              }
            },
            {
              "bidder": "consumable",
              "params": {
                "unitId": "6864",
                "unitName": "cnsmbl-audio-300x250-slider",
                "zoneIds": [
                  2002342
                ],
                "siteId": "2000865",
                "networkId": "9969"
              },
              "campaignid": 446168,
              "campaignids": {
                "300x250": 446168
              }
            },
            {
              "bidder": "33across",
              "params": {
                "siteId": "aiiLsg5Rar6yGYaKkGJozW",
                "productId": "siab"
              },
              "campaignid": 449960,
              "campaignids": {
                "300x250": 449960
              }
            },
            {
              "bidder": "aol",
              "params": {
                "placement": "5189178",
                "network": "11506.1"
              },
              "campaignid": 455154,
              "campaignids": {
                "300x250": 455154
              }
            },
            {
              "bidder": "openx",
              "params": {
                "delDomain": "cpmstar-d.openx.net",
                "unit": "541079540"
              },
              "campaignid": 459092,
              "campaignids": {
                "300x250": 459092
              }
            }
          ],
          "mediaTypes": {
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
            "poolid": 71337,
            "width": 300,
            "height": 250
          },
          "code": "/PaulHTML5/$71337"
        },
        {
          "bids": [
            {
              "bidder": "appnexus",
              "params": {
                "placementId": "14741532"
              },
              "campaignid": 429995,
              "campaignids": {
                "300x600": 429995
              }
            },
            {
              "bidder": "onemobile",
              "params": {
                "dcn": "8a9698ab017474066989078e55c100cd",
                "pos": "8a969001017474066d5608c418540165"
              },
              "campaignid": 445035,
              "campaignids": {
                "300x600": 445035
              }
            },
            {
              "bidder": "aol",
              "params": {
                "placement": "5189182",
                "network": "11506.1"
              },
              "campaignid": 455164,
              "campaignids": {
                "300x600": 455164
              }
            },
            {
              "bidder": "appnexus",
              "params": {
                "placementId": "18480924"
              },
              "campaignid": 455171,
              "campaignids": {
                "300x600": 455171
              },
              "discrep": 1
            }
          ],
          "mediaTypes": {
            "banner": {
              "sizes": [
                [
                  300,
                  600
                ]
              ]
            }
          },
          "fallback": {
            "poolid": 71340,
            "width": 300,
            "height": 600
          },
          "code": "/PaulHTML5/$71340"
        },
        {
          "bids": [
            {
              "bidder": "appnexus",
              "params": {
                "placementId": "14741531"
              },
              "campaignid": 429994,
              "campaignids": {
                "970x90": 429994
              }
            },
            {
              "bidder": "onemobile",
              "params": {
                "dcn": "8a9698ab017474066989078e55c100cd",
                "pos": "8a969001017474066d5608c41bbe0167"
              },
              "campaignid": 445037,
              "campaignids": {
                "728x90": 445037
              }
            },
            {
              "bidder": "aol",
              "params": {
                "placement": "5189180",
                "network": "11506.1"
              },
              "campaignid": 455157,
              "campaignids": {
                "970x90": 455157
              }
            },
            {
              "bidder": "appnexus",
              "params": {
                "placementId": "18480881"
              },
              "campaignid": 455169,
              "campaignids": {
                "970x90": 455169
              },
              "discrep": 1
            },
            {
              "bidder": "openx",
              "params": {
                "delDomain": "cpmstar-d.openx.net",
                "unit": "541130818"
              },
              "campaignid": 459096,
              "campaignids": {
                "970x90": 459096
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
                ]
              ]
            }
          },
          "fallback": {
            "poolid": 76715
          },
          "code": "/PaulHTML5/$76715"
        }
      ],
      "publisherid": 40114,
      "bidderDiscreps": {
        "appnexus": {
          "tagperadunit": true,
          "totalgross": 0.45915096599999994,
          "totallocalgross": 0.2578050002384953,
          "discrep": 1.7810010107454843
        },
        "onemobile": {
          "tagperadunit": true,
          "totalgross": 0.022386965999999994,
          "totallocalgross": 0.01,
          "discrep": 2.2386965999999995
        },
        "aol": {
          "tagperadunit": false,
          "totalgross": 0.022386965999999994,
          "totallocalgross": 0.01,
          "discrep": 1
        },
        "openx": {
          "tagperadunit": true,
          "totalgross": 0.01,
          "totallocalgross": 0.01,
          "discrep": 1
        }
      }
    },
    "banner160x600": {
      "kind": "banner",
      "poolid": 71335
    },
    "banner728x90": {
      "kind": "banner",
      "poolid": 71336
    },
    "banner300x250": {
      "kind": "banner",
      "poolid": 71337
    },
    "banner300x600": {
      "kind": "banner",
      "poolid": 71340
    },
    "anchor": null
  },
  "modules": [
    {
      "kind": "banner",
      "info": {
        "name": "POOL 71335"
      },
      "conditions": {
        "target": {
          "kind": "replace",
          "find": "$71335"
        }
      },
      "options": {
        "maxHeight": 600
      },
      "request": "hb",
      "adUnitPath": "/PaulHTML5/$71335"
    },
    {
      "kind": "banner",
      "info": {
        "name": "POOL 71336"
      },
      "conditions": {
        "target": {
          "kind": "replace",
          "find": "$71336"
        }
      },
      "options": {
        "maxHeight": 90
      },
      "request": "hb",
      "adUnitPath": "/PaulHTML5/$71336"
    },
    {
      "kind": "banner",
      "info": {
        "name": "POOL 71337"
      },
      "conditions": {
        "target": {
          "kind": "replace",
          "find": "$71337"
        }
      },
      "options": {
        "maxHeight": 250
      },
      "request": "hb",
      "adUnitPath": "/PaulHTML5/$71337"
    },
    {
      "kind": "banner",
      "info": {
        "name": "POOL 71340"
      },
      "conditions": {
        "target": {
          "kind": "replace",
          "find": "$71340"
        }
      },
      "options": {
        "maxHeight": 600
      },
      "request": "hb",
      "adUnitPath": "/PaulHTML5/$71340"
    },
    {
      "kind": "banner",
      "info": {
        "name": "POOL 76715"
      },
      "conditions": {
        "target": {
          "kind": "replace",
          "find": "$76715"
        }
      },
      "options": {
        "maxHeight": 100
      },
      "request": "hb",
      "adUnitPath": "/PaulHTML5/$76715"
    }
  ],
  "info": {
    "id": 118,
    "zonepools": {
      "71335": {
        "module": "POOL 71335"
      },
      "71336": {
        "module": "POOL 71336"
      },
      "71337": {
        "module": "POOL 71337"
      },
      "71340": {
        "module": "POOL 71340"
      },
      "76715": {
        "module": "POOL 76715"
      }
    }
  }
}
);