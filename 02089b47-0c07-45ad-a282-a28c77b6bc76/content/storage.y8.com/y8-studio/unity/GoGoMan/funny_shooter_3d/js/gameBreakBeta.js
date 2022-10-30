window.adsbygoogle = window.adsbygoogle || [];
const adBreak = adConfig = function(o) {adsbygoogle.push(o);}
adConfig({
    preloadAdBreaks: 'on',
    sound: 'on', // This game has sound
    onReady: () => {
        console.log("ready");
    }, // Called when API has initialised and adBreak() is ready
});
function showNextAd()
{
    console.log("showNextAd")
    adBreak({
        type: 'next', // ad shows at start of next level
        name: 'next-game',
        beforeAd: () => {            
            console.log("beforeAd")
            passBeforeAdData()
        }, // You may also want to mute thegame's sound.
        afterAd: () => {
            console.log("afterAd")
        }, // resume the game flow.
        adBreakDone: (placementInfo) => {
            console.log("adBreak complete ");
            adBreakDoneData()
            console.log(placementInfo.breakType);
            console.log(placementInfo.breakName);
            console.log(placementInfo.breakFormat);
            console.log(placementInfo.breakStatus);
        },
    });
}

function showReward()
{
    console.log("showReward")
    adBreak({
        type: 'reward', // ad shows at start of next level
        name: 'rewarded Ad',
        beforeAd: () => {            
            console.log("beforeAd")
            passBeforeAdData()
        }, // You may also want to mute thegame's sound.
        afterAd: () => {
            console.log("afterAd")
        }, // resume the game flow.
        beforeReward: (showAdFn) => {console.log("beforeReward ")+showAdFn(0)},
        adDismissed: () => {console.log("adDismissed");cancelReward()},
        adViewed: () => {console.log("adViewed");gainReward()},
        adBreakDone: (placementInfo) => {
            console.log("adBreak complete ");
            console.log(placementInfo.breakType);
            console.log(placementInfo.breakName);
            console.log(placementInfo.breakFormat);
            console.log(placementInfo.breakStatus);
            if(placementInfo.breakStatus == "frequencyCapped"){noRewardAdsAvailable()};
        },
    });
}

function noRewardAdsAvailable()
{
    console.log("noRewardAdsAvailable")
    myGameInstance.SendMessage('SDK Platform', 'NoRewardedAdsTryLater');
}

function cancelReward()
{
    console.log("cancelReward")
    myGameInstance.SendMessage('SDK Platform', 'rewardAdsCanceled');
}

function gainReward()
{
    console.log("gainReward")
    myGameInstance.SendMessage('SDK Platform', 'rewardAdsCompleted');
}

function passBeforeAdData()
{
    myGameInstance.SendMessage('SDK Platform', 'pauseGame');
}

function adBreakDoneData()
{
    myGameInstance.SendMessage('SDK Platform', 'resumeGame');
}
