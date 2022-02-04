function InitExternEval(appid) {
  Gamebreak.init();
}

function Y8ExternEval(allowGamePause) {
  if (!Gamebreak.adsRunning && Gamebreak.adTimeoutPassed()) {
    Gamebreak.displayAds();
  }
}

var Gamebreak = {
  adsRunning: false,
  adTimeout: 180000,
  adTagBaseUrl: 'https://pubads.g.doubleclick.net/gampad/ads?iu=/83578953/y8/video&env=vp&impl=s&correlator=&tfcd=0&npa=0&gdfp_req=1&output=vast&sz=640x480&ciu_szs=250x250,300x250,728x90&max_ad_duration=30000&unviewed_position_start=1',
  lastAdTime: 0,
  allowGamePause: true,
  defaultGamKey: 'y8',
  defaultGamValue: 'default',
  init: function() {
    // Gamebreak.loadScript('https://imasdk.googleapis.com/js/sdkloader/ima3.js');
    Gamebreak.loadScript('https://imasdk.googleapis.com/js/sdkloader/outstream.js');
    Gamebreak.drawContainer();
  },
  drawContainer: function() {
    var overlay = document.createElement('div');
    overlay.classList.add('ad-overlay');
    document.getElementsByClassName('webgl-content')[0].appendChild(overlay);
    var container = document.createElement('div');
    container.classList.add('ad-container');
    document.getElementsByClassName('ad-overlay')[0].appendChild(container);
  },
  displayAds: function() {
    new Html5Ima({
      adTagUrl: Gamebreak.adTagUrl(),
      overlayContainer: document.getElementsByClassName('ad-overlay')[0],
      container: document.getElementsByClassName('ad-container')[0]
    }).load();
  },
  loadScript: function(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  },
  adTimeoutPassed: function() {
    var date = new Date();
    if (Gamebreak.lastAdTime + Gamebreak.adTimeout > date.getTime()) {
        return false;
    }
    return true;
  },
  setTimeScale: function(value) {
    const instance = typeof(window.gameInstance) === 'undefined' ? window.unityInstance : window.gameInstance;
    instance.SendMessage('IDNET(Idnet.cs)', 'SetAudio', value);

    if (Gamebreak.allowGamePause) {
      instance.SendMessage('IDNET(Idnet.cs)', 'SetTimeScale', value);
    }
  },
  adTagUrl: function() {
    var key = Gamebreak.getQueryParam('key') || Gamebreak.defaultGamKey;
    var value = Gamebreak.getQueryParam('value') || Gamebreak.defaultGamValue;

    return [
      Gamebreak.adTagBaseUrl,
      'cust_params=' + key + '%3D' + value,
      'description_url=' + document.URL
    ].join('&');
  },
  getQueryParam: function(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if(pair[0] == variable){
        return pair[1];
      }
    }
    return(false);
  }
}

window.Html5Ima = (function() {
  function _bind(thisObj, fn) {
    return function() {
      fn.apply(thisObj, arguments);
    };
  };

  var Html5Ima = function(config) {
    this.adTagUrl = config.adTagUrl;
    this.overlayContainer = config.overlayContainer;
    this.container = config.container;

    this.adsController = new google.outstream.AdsController(
      this.container,
      _bind(this, this.onAdLoaded),
      _bind(this, this.onAdDone)
    );
  };

  Html5Ima.prototype.load = function() {
    this.overlayContainer.style.display = 'block';
    this.requestAds();
  };

  Html5Ima.prototype.onAdLoaded = function() {
    Gamebreak.lastAdTime = new Date().getTime();
    Gamebreak.adsRunning = true;
    Gamebreak.setTimeScale('0');
    this.adsController.showAd();
  };

  Html5Ima.prototype.onAdDone = function() {
    Gamebreak.setTimeScale('1');
    this.overlayContainer.style.display = 'none';
    this.container.innerHTML = '';
    Gamebreak.adsRunning = false;
  };

  Html5Ima.prototype.requestAds = function() {
    this.adsController.initialize();
    this.adsController.requestAds(this.adTagUrl);
  };

  return Html5Ima;
})();
