window.adsbygoogle = window.adsbygoogle || [];
const adBreak = adConfig = function(o) {adsbygoogle.push(o);}
adConfig({
    sound: 'on',
    preloadAdBreaks: 'on',
    onReady: () => {
    }, 
});

function InitExternEval(appid) {
  
}

function Y8ExternEval(allowGamePause) {
    interstitial();
}

function Y8ExternEvalReward(allowGamePause) {
    reward();
}

var allowGamePause = true; 

function interstitial() {  
    adBreak({
        type: 'start',
        name: 'start-game',
        beforeAd: () => {            
            setTimeScale('0');
        },
        afterAd: () => {
            setTimeScale('1');
        },
        adBreakDone: (placementInfo) => {
            window.focus(); 
        },
    });
}

function reward() {  
    adBreak({
        type: 'reward',
        name: 'rewarded-ad',
        beforeAd: () => {   
        	DisableRewardLoader();
            setTimeScale('0');   
        },
        afterAd: () => {
            setTimeScale('1');
        },
        beforeReward: (showAdFn) => {showAdFn(0);},
        adDismissed: () => {setRewardCallBack('false')},
        adViewed: () => {setRewardCallBack('true')},
        adBreakDone: (placementInfo) => { window.focus();
        },
    });
}

function setTimeScale(value) {
    const instance = typeof(window.gameInstance) === 'undefined' ? window.unityInstance : window.gameInstance;
    instance.SendMessage('IDNET(Idnet.cs)', 'SetAudio', value);

    if (allowGamePause) {
        instance.SendMessage('IDNET(Idnet.cs)', 'SetTimeScale', value);
    }
}
function setRewardCallBack(value) {
    const instance = typeof(window.gameInstance) === 'undefined' ? window.unityInstance : window.gameInstance;
    instance.SendMessage('IDNET(Idnet.cs)', 'SetRewardCallback', value);
}

function EnableRewardLoader() {
    const instance = typeof(window.gameInstance) === 'undefined' ? window.unityInstance : window.gameInstance;
    instance.SendMessage('IDNET(Idnet.cs)', 'EnableRewardLoader');
}

function DisableRewardLoader() {
    const instance = typeof(window.gameInstance) === 'undefined' ? window.unityInstance : window.gameInstance;
    instance.SendMessage('IDNET(Idnet.cs)', 'DisableRewardLoader');
}
