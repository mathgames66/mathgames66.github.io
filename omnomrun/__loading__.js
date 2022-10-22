/* jshint esversion: 6 */
pc.script.createLoadingScreen(function (app) {
    
    var showSplash = function () {
        if(document.getElementById('application-splash-wrapper')) {
            //wrapper presents, do not create
            return;
        }

        var css =
            `
            body {
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                touch-action: none;
                -webkit-touch-action: none;
                -moz-touch-action: none;
                -ms-touch-action: none;
            }            

            #application-splash-wrapper {      
                background-color: black;
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                z-index: 999;
            }
            
            #application-splash {
                position: absolute;
                height: 64px;
                width: 256px;
                left: calc(50% - 128px);
                bottom: 7%;
            }

            #application-splash img {
                width: 100%;
            }
            
            #loaderBar {
                bottom: 0;
                height: 64px;
                width: 0;
                position: absolute;
                background-image: url('data:image/png;base64,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');
                background-repeat: no-repeat;
                background-position: left center;
                background-size: 256px 100%;
                z-index: 10;
            }
            
            #loadingText {
                color: white;
                font-size: 30px;                
                font-weight: bold;
                line-height: 64px;
                bottom: 0;
                left: 0;
                right: 0;
                top: 1px;
                margin: auto;
                position: absolute;
                text-align: center;
                z-index: 100;
            }
                  
            .hide {
               opacity: 0 !important;
               transition: opacity 0.3s ease-in;
            }

            @media (max-width: 480px) {
                 #application-splash {
                     height: 32px;
                     width: 128px;
                     left: calc(50% - 64px);
                 }

                 #loaderBar {
                     background-size: 128px 100%;
                     height: 32px;
                 }
            
                 #loadingText {
                     font-size: 24px;
                     line-height: 32px;
                     top: -25px;
                 }
            }

            @media (max-height: 480px) {
                #logo {
                    left: calc(50% - 150px);
                    width: 300px;
                    height: 150px;
                }
            }
        `;

        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.head.appendChild(style);

        // splash wrapper
        var wrapper = document.createElement('div');
        wrapper.id = 'application-splash-wrapper';
        document.body.appendChild(wrapper);

        // splash
        var splash = document.createElement('div');
        splash.id = 'application-splash';
        wrapper.appendChild(splash);
        splash.style.display = 'block';

        var loaderBar = document.createElement('div');
        loaderBar.id = 'loaderBar';
        splash.appendChild(loaderBar);

        var loadingText = document.createElement('span');
        loadingText.innerHTML = '0%';
        loadingText.id = 'loadingText';
        splash.appendChild(loadingText);
    };


    var hideSplash = function () {
        famobi.log('v1.0; ©Famobi/IFGD, 2021');        
        var splash = document.getElementById('application-splash-wrapper');
        if(splash && splash.parentElement) {
            splash.parentElement.removeChild(splash);
        }
    };
    
    var lastPreloaderProgressValue = '';
    var preloaderBar = document.getElementById('loaderBar');
    var preloaderText = document.getElementById('loadingText');

    var setVisibleProgress = function(value) {
        if(typeof displayProgress === "function") {
            stopPreloaderSimulation();
            displayProgress(value);
            if(typeof famobi !== 'undefined') famobi.setPreloadProgress(Math.floor(value * 99));
        } else {
            preloaderBar = preloaderBar || document.getElementById('loaderBar');
            preloaderText = preloaderText || document.getElementById('loadingText');

            let currentProgressValue = Math.round(value * 100) + '%';
            if(lastPreloaderProgressValue != currentProgressValue) {
                lastPreloaderProgressValue = currentProgressValue;
                if(preloaderBar) preloaderBar.style.width = lastPreloaderProgressValue;
                if(preloaderText) preloaderText.innerHTML = lastPreloaderProgressValue;
                if(typeof famobi !== 'undefined') famobi.setPreloadProgress(Math.floor(value * 99));
            }
        }       
    };
    
    var loadingProgressMultiplier = 0.85;
    
    var setProgress = function (value) {
        const displayValueScale = loadingProgressMultiplier;
        const displayValue = Math.min(1, Math.max(0, value)) * displayValueScale;
        setVisibleProgress(displayValue);
    };
    
    var hidePreloader = function() {        
        hideSplash();
    };
        
    var updatePostLoadingProgress = function(progress) {
        const postLoadingProgress = (1 - loadingProgressMultiplier);       
         setVisibleProgress(loadingProgressMultiplier + postLoadingProgress * progress);   
    };
    
    
    var injectForcedModeProperties = function() {
        famobi.log('Injecting forced mode properties...');
        const forcedModeProperties = getForcedModeProperties();
        
        if(forcedModeProperties.state.level >= 0) {
            MissionsManager.CURRENT_MISSION = forcedModeProperties.state.level;         
            MissionsManager.MAX_UNLOCKED_MISSION = Math.max(MissionsManager.MAX_UNLOCKED_MISSION, MissionsManager.CURRENT_MISSION);
        } 
        
        if(forcedModeProperties.state.coins >= 0) {
            CoinsStorage.getInstance().setTotalCoins(forcedModeProperties.state.coins);
        }
    };
    
    var doAPIHandshake = function(startGameCallback) {   
        if(isExternalStart()) {
            app.timeScale = 0.0;
            famobi.onRequest("startGame", function() {
                app.timeScale = 1.0;                               
                if(startGameCallback) startGameCallback();
            });
        } else {
            if(startGameCallback) startGameCallback();
        }
        
        /* game ready report */
        famobi.gameReady();
    };
    
    var startLevelDirectly = function() {
        famobi.log("Starting level " + MissionsManager.CURRENT_MISSION + " directly");
        
        doAPIHandshake(() => {
            app.fire(EventTypes.START_GAMEPLAY_MUSIC);
            MissionsManager.getInstance().launchSelectedMode(isEndlessMode(), false, 0.0);
            famobi.log('Handshake completed, skip_title mode');
        });
    };
    
    
    

    showSplash();

    app.on('preload:end', function () {
        app.off('preload:progress');
    });
    app.on('preload:progress', setProgress);
    app.on('start', function() {
        famobi.log('App started, post loading assets...');  
    });
    app.on('postinitialize', () => {
                
        setTimeout(() => {
            app.fire(EventTypes.SHOW_TRANSITION_SCREEN, 0.0, () => {});
            app.on(EventTypes.ASSETS_LOADER_PROGRESS, updatePostLoadingProgress);
            AssetsLoader.getInstance().loadPendingAssets().then(() => {
                app.off(EventTypes.ASSETS_LOADER_PROGRESS, updatePostLoadingProgress);                
                app.fire(EventTypes.APP_LOADED);
               
                
                /* game is loaded, send final progress to Famobi API. */
                famobi.setPreloadProgress(100);
                
                /* inject forced mode properties if needed */
                if(isForcedMode()) {
                    injectForcedModeProperties();
                }
    
                 /* hide preloader and navigate to next screen */
                 hidePreloader();
                 app.fire(EventTypes.HIDE_TRANSITION_SCREEN, 0.35, () => {});
        
                 /* if running into MonkeyGames container, start the gameplay/level screen directly */
                if(skipTitleScreen()) {
                     startLevelDirectly();                
                } else {
                     doAPIHandshake(() => {
                         app.fire(EventTypes.START_MENU_MUSIC);
                         famobi.log('Handshake completed in normal gameplay mode');
                     });
                }    
                
            });     
        }, 50);   
        
    });
   
});