window.famobi = window.famobi || {};
window.famobi.hasGameReadyCalled = false;
window.famobi.subscribedToAudioUpdates = false;

// FOR TESTING ONLY
window.famobi.gameReady = function() {
	console.log("gameReady");
}

// --------------------------------------
window.famobi_analytics = window.famobi_analytics || {};
window.famobi_tracking = window.famobi_tacking || {
	init: function() {},
	trackEvent: function() {},
	EVENTS: {
	    'LEVEL_START'	: 'event/level/start',
	    'LEVEL_END'		: 'event/level/end',
	    'LEVEL_UPDATE'	: 'event/level/update',
	    'PING'          : 'event/ping',
	    'AD'			: 'event/ad'
	}
};

// ------------ GameReady API ------------
window.famobi._gameReady = window.famobi.gameReady;
window.famobi.gameReady = function() {
	window.famobi._gameReady();
	if(!window.famobi.hasGameReadyCalled) {
		window.famobi.hasGameReadyCalled = true;
		try{
			GAMESNACKS.gameReady();
		} catch(e) {
			console.log(e);
		}
	}
};

// ------------ Score, GameOver & LevelComplete API ------------
window.famobi_analytics.trackEvent = function(event, params) {
	return new Promise(function(resolve, reject) {
		switch(event) {
			case "EVENT_TOTALSCORE":
				// Score API
				try{
					GAMESNACKS.sendScore(params.totalScore);
				} catch(e) {
					console.log(e);
				}
				break;
			case "EVENT_LIVESCORE":
				// Score API
				try{
					GAMESNACKS.sendScore(params.liveScore);
				} catch(e) {
					console.log(e);
				}
				break;
			case "EVENT_LEVELFAIL":
				// GameOver API
				try{
					GAMESNACKS.gameOver();
				} catch(e) {
					console.log(e);
				}
				break;
			case "EVENT_LEVELSUCCESS":
				// LevelComplete API
				try{
					params.levelName = params.levelName || "";
					GAMESNACKS.levelComplete(parseInt(params.levelName.replace(/\D/g, "")) || -1);
				} catch(e) {
					console.log(e);
				}
			default:
				// do nothing
		}
		return resolve(event, params);
	});
};

// ------------ AUDIO ------------
// hide mute buttons
window.famobi.config = window.famobi.config || {};
window.famobi.config.features = window.famobi.config.features || {};
window.famobi.config.features.external_mute = true;

window.famobi.getVolume = function() {
	try{
		return GAMESNACKS.isAudioEnabled() ? 1.0 : 0.0;
	} catch(e) {
		console.log(e);
	}
	return 1.0;
}

// ------------ Gamesnack Audio Listener ------------
if(typeof GAMESNACKS !== "undefined") {
	GAMESNACKS.subscribeToAudioUpdates((isAudioEnabled) => {
		try{
			window.famobi.setVolume(isAudioEnabled ? 1.0 : 0.0);
		} catch(e) {
			console.log(e);
		}
	});
}

// ------------ Rewarded Ads APIs ------------
var showRewarded_adViewed = function() {

}
var showRewarded_adDismissed = function() {

}

var rewardedAdObject = {
	enableLog: false,
	showAdFn: null,
	state: 0,
	states: {
		"WAITING": 0,
        "READY": 1,
        "PLAYING": 2,
        "CLOSED": 3
    },
    setState: function(state) {
    	this.enableLog && console.log("new state: " + state);
    	this.state = state;
    },
    beforeReward: function(showAdFn) {
        this.showAdFn = showAdFn;
        this.setState(this.states.READY);
    },
    beforeAd: function() {
        if(typeof window.famobi_onPauseRequested == "function") {
        	window.famobi_onPauseRequested();
        }
        this.setState(this.states.PLAYING);
    },
    beforeBreak: function() {
        if(typeof window.famobi_onPauseRequested == "function") {
        	window.famobi_onPauseRequested();
        }
        this.setState(this.states.PLAYING);
    },
    adComplete: function() {
        this.setState(this.states.CLOSED);
        showRewarded_adViewed();
    },
    adViewed: function() {
        this.setState(this.states.CLOSED);
        showRewarded_adViewed();
    },
    adDismissed: function() {
        this.setState(this.states.CLOSED);
        showRewarded_adDismissed();
    },
    afterAd: function() {
        if(typeof window.famobi_onResumeRequested == "function") {
        	window.famobi_onResumeRequested();
        }
        this.setState(this.states.WAITING);
    },
    afterBreak: function() {
        if(typeof window.famobi_onResumeRequested == "function") {
        	window.famobi_onResumeRequested();
        }
        this.setState(this.states.WAITING);
    }
}

window.famobi.hasRewardedAd = function() {

	if(!window.famobi.hasFeature("rewarded")) {
		rewardedAdObject.enableLog && console.log("rewarded disabled")
		return false;
	}

	rewardedAdObject.enableLog && console.log("current state: " + rewardedAdObject.state);

	if(rewardedAdObject.state == rewardedAdObject.states.WAITING) {
		try{
			GAMESNACKS.rewardedAdOpportunity(rewardedAdObject);
		}catch(e) {
			console.log(e);
		}
		return typeof rewardedAdObject.showAdFn == "function";
	}

	if(rewardedAdObject.state == rewardedAdObject.states.READY) {
		return typeof rewardedAdObject.showAdFn == "function";
	}
	return false;
}

window.famobi.rewardedAd = function(callback) {

	var doCallback = function(result) {
		if(typeof callback === "function") {
			callback(result);
		} else {
			rewardedAdObject.enableLog && console.log("callback is not of type 'function'");
		}
	}

	if(rewardedAdObject.state !== rewardedAdObject.states.READY) {
		rewardedAdObject.enableLog && console.log("not ready: " + rewardedAdObject.state);
		doCallback({adDidLoad: false, adDidShow: false, rewardGranted: false});
		return;
	}

	if(typeof rewardedAdObject.showAdFn !== "function") {
		rewardedAdObject.enableLog && console.log("showAdFn is not a function");
		doCallback({adDidLoad: false, adDidShow: false, rewardGranted: false});
		return;
	}

	showRewarded_adViewed = function() {
		doCallback({adDidLoad: true, adDidShow: true, rewardGranted: true});
	};

	showRewarded_adDismissed = function() {
		doCallback({adDidLoad: true, adDidShow: true, rewardGranted: false});
	};

	try{
		rewardedAdObject.showAdFn();
	} catch(e) {
		rewardedAdObject.enableLog && console.log(e);
		doCallback({adDidLoad: false, adDidShow: false, rewardGranted: false});
	}
}
