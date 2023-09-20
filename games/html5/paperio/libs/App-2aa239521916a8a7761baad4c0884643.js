/**
 * Created by qixiaowei on 16/8/8.
 *
 * @version 2.2.1.6
 * @time 2016-12-26
 * 区别了cocos和egret引擎对minilogo的加载缓存处理方式
 *
* @version 2.2.1.5
 * @time 2016-09-12
 * 增加事件类型没有时的兼容
 * 修复MGFramework与com4jAPI同时有时游戏多次执行事件问题
 *
 * @version 2.2.1.4
 * @time 2016-08-17
 * 增加App.debug时输出
 *
 * @version 2.2.1.3
 * @time 2016-08-17
 * App.Fullscreen()更改为App.ClickFullscreen()
 *
 * @version 2.2.1.2
 * @time 2016-08-17
 * 增加App.ClickCredits()
 *
 * @version 2.2.1.2
 * @time 2016-08-11
 * 统一命名
 * App.ScreenshotEnabled = App.frameworkInfo["HasScreenshot"];
 * App.CreditsEnabled = App.frameworkInfo['showCredits'];
 * App.MoreGamesButtonEnabled = App.frameworkInfo['showMoreGamesButton'];
 * App.FullscreenEnabled = App.frameworkInfo['fullscreenEnabled'];
 *
 * @version 2.2.1.1
 * @time 2016-08-11
 * FIX: 在非Com4jAPI情况下无法切换场景
 *
 * @version 2.2.1
 * @time 2016/08/10
 * 更改App.ChangeScene()为带回调方法参数
 *
 * @version 2.2.0
 * @time 2016/08/08
 * 增加App.CreditsEnabled
 * 增加App.MoreGamesButtonEnabled
 * 增加App.ContinueGame();
 * 增加App.LevelFail();
 * 增加App.LevelWin();
 *
 *
 */
var App = (function () {
    App.VERSION = "2.2.1.6";
    App.debug = true;
    App.frameworkInfo = null;
    App.engine=null;
    App.Doc = null;
    App.miniLogoUrl = "";
    App.instance = null;
    App.PLATFORM_FACEBOOK = "facebook";
    App.PLATFORM_TWITTER = "twitter";
    App.PLATFORM_WEIXIN = "weixin";
    App.PLATFORM_QQ = "qq";
    App.PLATFORM_WEIBO = "weibo";
    App.PLATFORM_GOOGLE_PLUS = "google_plus";
    App.gamename = "-1";
    App.nameid = "-1";
    App.sharemsgs = {};
    App.showmsgs = {};
    App.platforms = [];
    ///为egret缓存logo等texture图片资源
    App.textures={};
    App.FullscreenEnabled = true;
    /**
     * 下载平台（AppStore， GooglePlay)
     * @type {Array}
     */
    App.apps = [];
    App.language = "";
    /**
     * loading界面状态
     * @type {string}
     */
    App.PREGAME = "pregame";
    /**
     * 已经进入游戏了
     * @type {string}
     */
    App.INGAME = "ingame";
    /**
     * 游戏状态
     * @type {string}
     */
    App.state = App.PREGAME;
    /**
     * LOGO显示方式
     * 对齐方式| NONE=不显示，TL=top left; TM=top middle; TR=top right; BL=bottom left; BM=bottom middle; BR=bottom right; XY=x,y(示例100,100)
     * @type {string}
     */
    App.LogoAlign = "NONE";
    /**
     * 是否可以截屏
     * @type {boolean}
     */
    App.ScreenshotEnabled = true;
    /**
     * 是否显示Credits
     * @type {boolean}
     */
    App.CreditsEnabled = true;
    /**
     * 是否显示more games button
     * @type {boolean}
     */
    App.MoreGamesButtonEnabled = true;
    function App() {
        if (App.instance) {
            console.log("can not new App again");
        }
        this.onAddToStageHandler();
    };

    var dispatch = function (event) {
        if (App.debug) {
            console.log('%c%s', 'background:yellow;color:green;', event.type);
        }
        MGDelegate.dispatcherEvent(event);
    };

    App.prototype.onAddToStageHandler = function () {
        MGDelegate.isApp = false;
        MGDelegate.addEventListener(MGEvent.FRAMEWORK_INFO_RESPONSE || "FRAMEWORK_INFO_RESPONSE", this.onFrameworkInfoHandler, this);
        MGDelegate.addEventListener(MGEvent.ENTER_GAME || "ENTER_GAME", this.enterGame, this);
        //请求获取FRAMEWORK信息
        var evt = new MGEvent(MGEvent.FRAMEWORK_INFO_REQUEST || "FRAMEWORK_INFO_REQUEST");
        evt.data = {"AppVersion": App.VERSION};
        dispatch(evt);
        //通知游戏已经添加到舞台
        dispatch(new MGEvent(MGEvent.ADDED_TO_STAGE || "ADDED_TO_STAGE"));
    };
    ///获取框架的信息
    App.prototype.onFrameworkInfoHandler = function (event) {
        MGDelegate.removeEventListener(MGEvent.FRAMEWORK_INFO_RESPONSE || "FRAMEWORK_INFO_RESPONSE", this.onFrameworkInfoHandler, this);
        App.frameworkInfo = event.data;
        if (App.frameworkInfo) {
            console.log("AppVersion: " + App.VERSION);
        }
        App.debug = App.frameworkInfo['debug'];

        if (window.location.hostname == 'localhost'
            || window.location.hostname == '127.0.0.1') {
            App.debug = true;
        }

        App.gamename = App.frameworkInfo["gamename"];
        App.nameid = App.frameworkInfo["nameid"];
        App.language = App.frameworkInfo["language"] || 'en';
        App.sharemsgs = App.frameworkInfo["sharemsgs"] || [];
        App.showmsgs = App.frameworkInfo["showmsgs"] || [];

        App.ScreenshotEnabled = App.frameworkInfo["HasScreenshot"];
        App.CreditsEnabled = App.frameworkInfo.hasOwnProperty("showCredits") ? App.frameworkInfo['showCredits'] : true;
        App.MoreGamesButtonEnabled = App.frameworkInfo.hasOwnProperty("showMoreGamesButton") ? App.frameworkInfo['showMoreGamesButton'] : true;
        App.FullscreenEnabled = App.frameworkInfo.hasOwnProperty("fullscreenEnabled") ? App.frameworkInfo['fullscreenEnabled'] : true;

        for (var p in App.sharemsgs) {
            if (p.substr(0, 4) == "app_") {
                App.apps.push(p);
            }
            else {
                App.platforms.push(p);
            }
        }
        //进行排序，使每次显示顺序都统一
        App.platforms.sort();
        App.apps.sort();

        try {
            eval("cc");
            App.engine="cocos";
        } catch (e) {

        }
        try {
            eval("egret");
            App.engine="egret";
        } catch (e) {

        }
        if(!App.engine){
            throw "no such a engine exsit!";
        }
        switch (App.engine){
            case "cocos":
                this.CocosFrameworkInfoHandler();
                break;
            case "egret":
                this.EgretFrameworkInfoHandler();
                break;
        }
    };
    ////Cocos对框架资源的处理
    App.prototype.CocosFrameworkInfoHandler=function () {
        if (App.frameworkInfo["miniLogoUrl"]) {
            App.miniLogoUrl = App.frameworkInfo["miniLogoUrl"];

            res.miniLogoUrl = App.miniLogoUrl;
            res_resource.push(App.miniLogoUrl);
            //RES.getResByUrl(App.miniLogoUrl, App.instance["onMiniLogoLoaded"], App.instance);
        }
        var platformLen = App.platforms.length;
        var appLen = App.apps.length;
        var new_key = "";
        var itm;
        var key = "";
        if (platformLen != 0) {
            for (var i = 0; i < platformLen; i++) {
                key = App.platforms[i];
                if (key.indexOf("weixin") < 0) {
                    var url = "res/platform/" + key + ".png";
                    new_key = "$platform_" + key;
                    res[new_key] = url;
                    res_resource.push(url);
                }
            }
        }
        if (appLen != 0) {
            for (var i = 0; i < appLen; i++) {
                key = App.apps[i];
                var url = "res/app/" + key + ".png";
                new_key = "$" + key;
                res[new_key] = url;
                res_resource.push(url);
            }
        }
        var creditsRes = [
            "c_button",
        ];
        var creditsLen = creditsRes.length;
        for (var i = 0; i < creditsLen; i++) {
            key = creditsRes[i];
            var url = "res/credits/" + key + ".png";
            new_key = "$" + key;
            res[new_key] = url;
            res_resource.push(url);
        }
    }
    ////egret中logo等资源预加载
    App.prototype.PreLoadEgretTexture=function (new_key,url) {
        RES.getResByUrl(url, function (texture) {
            //将加载完的资源进行显示
            App.textures[new_key]=texture;
        }, App, RES.ResourceItem.TYPE_IMAGE);
    }
    ////Egret对框架资源的处理
    App.prototype.EgretFrameworkInfoHandler=function () {
        if (App.frameworkInfo["miniLogoUrl"]) {
            App.miniLogoUrl = App.frameworkInfo["miniLogoUrl"];
            if(App.miniLogoUrl.indexOf("office")>-1){
                return;
            }
            this.PreLoadEgretTexture("miniLogoUrl",App.miniLogoUrl);
        }
    }
    ///框架通知可以开始游戏了
    App.prototype.enterGame = function (event) {
        App.state = App.INGAME;
    };
    /**
     * 分享到平台
     * @param platform
     * @param score
     * @param level
     * @param percent
     * @constructor
     */
    App.Share = function (platform, score, level, percent) {
        if (score === void 0) {
            score = 0;
        }
        if (level === void 0) {
            level = 0;
        }
        if (percent === void 0) {
            percent = 0;
        }
        if (!App.sharemsgs[platform]) {
//			console.warn("Can not found platform msg: " + platform);
            return;
        }
        var msg = App.sharemsgs[platform];
        msg = msg.replace(/\{nameid\}/g, App.nameid);
        msg = msg.replace(/\{gamename\}/g, App.gamename);
        msg = msg.replace(/\{score\}/g, score + "");
        msg = msg.replace(/\{level\}/g, level + "");
        msg = msg.replace(/\{percent\}/g, percent + "");

        var evt = new MGEvent(MGEvent.SHARE || "SHARE");
        evt.data = {
            "platform": platform,
            "gamename": App.gamename,
            "nameid": App.nameid,
            "msg": msg
        };
        dispatch(evt);
    };
    /**
     * 获取显示类文本
     * @param language
     * @param score
     * @param percent
     * @returns {string}
     * @constructor
     */
    App.GetShowMsg = function (language, score, level, percent) {
        if (language === void 0) {
            language = App.language;
        }
        if (score === void 0) {
            score = 0;
        }
        if (level === void 0) {
            level = 0;
        }
        if (percent === void 0) {
            percent = 0;
        }
        if (!App.showmsgs[language]) {
            console.warn("can not found show msg: ");
            return;
        }


        App.Share("weixin", score, level, percent);
        var msg = App.showmsgs[language];
        msg = msg.replace(/\{nameid\}/g, App.nameid);
        msg = msg.replace(/\{gamename\}/g, App.gamename);
        msg = msg.replace(/\{score\}/g, score + "");
        msg = msg.replace(/\{percent\}/g, percent + "");
        return msg;
    };
    /**
     * 点击App下载
     * @param platform
     * @constructor
     */
    App.DownloadApp = function (platform) {
        var evt = new MGEvent(MGEvent.DOWNLOAD_APP || "DOWNLOAD_APP");
        evt.data = {"platform": platform};
        dispatch(evt);
    };
    /**
     * 开始游戏
     * @constructor
     */
    App.Start = function () {
        dispatch(new MGEvent(MGEvent.START_GAME || "START_GAME"));
    };
    /**
     * 暂停游戏
     * @constructor
     */
    App.Pause = function () {
        dispatch(new MGEvent(MGEvent.PAUSE_GAME || "PAUSE_GAME"));
    };
    /**
     * 点击更多
     * @constructor
     */
    App.ClickMore = function () {
        dispatch(new MGEvent(MGEvent.CLICK_MORE || "CLICK_MORE"));
    };
    /**
     * 点击LOGO
     * @constructor
     */
    App.ClickLogo = function () {
        dispatch(new MGEvent(MGEvent.CLICK_MINILOGO || "CLICK_MINILOGO"));
    };
    /**
     * 点击Credits
     * @constructor
     */
    App.ClickCredits = function () {
        dispatch(new MGEvent(MGEvent.CLICK_CREDITS || "CLICK_CREDITS"));
    };

    /**
     * 显示赢了界面，并调用接口
     * @constructor
     */
    App.ShowWin = function () {
        App.Pause();
        dispatch(new MGEvent(MGEvent.SHOW_WIN || "SHOW_WIN"));
    };
    /**
     * 显示赢了界面，并调用接口
     * @constructor
     */
    App.ShowLose = function () {
        App.Pause();
        dispatch(new MGEvent(MGEvent.SHOW_LOSE || "SHOW_LOSE"));
    };
    /**
     * 截屏
     * @param clipBounds            截屏的矩形
     * @param msg                   截屏分享文字
     * @param callback_success      截屏分享成功
     * @param callback_failed       截屏分享失败
     */
    App.Screenshot = function (clipBounds, msg, callback_success, callback_failed) {
        if (!clipBounds) {
            clipBounds = cc.winSize;
            //clipBounds = new egret.Rectangle(0, 0, App.stage.stageWidth, App.stage.stageHeight);
        }
        if (!msg) {
            msg = "";
        }
        if (!callback_success) {
            callback_success = function () {
                console.log("screenshot success.");
            };
        }
        if (!callback_failed) {
            callback_failed = function () {
                console.log("screenshot faild.");
            };
        }
        if (MGDelegate.isApp) {
            var evt = new MGEvent(MGEvent.SCREENSHOT || "SCREENSHOT");
            evt.data = {
                "rect": clipBounds,
                "msg": msg,
                "success": callback_success,
                "faild": callback_failed
            };
            dispatch(evt);
        }
        var newCanvas = App.Doc.getElementById("screenshootCanvas");
        if (!newCanvas) {
            var container = App.Doc.getElementById("gameCanvas");
            newCanvas = App.Doc.createElement("canvas");
            newCanvas.id = "screenshootCanvas";
            newCanvas.style.display = "none";
            newCanvas.width = clipBounds.width;
            newCanvas.height = clipBounds.height;
            container.appendChild(newCanvas);
        }
        else {
            newCanvas.getContext("2d").clearRect(0, 0, newCanvas.width, newCanvas.height);
            newCanvas.width = clipBounds.width;
            newCanvas.height = clipBounds.height;
        }
        setTimeout(function () {
            try {
                var canvas = App.Doc.getElementById("gameCanvas");
                var data = canvas.getContext("2d").getImageData(clipBounds.x, clipBounds.y, clipBounds.width, clipBounds.height);
                newCanvas.getContext("2d").putImageData(data, 0, 0, 0, 0, clipBounds.width, clipBounds.height);
                var evt = new MGEvent(MGEvent.SCREENSHOT || "SCREENSHOT");
                evt.data = {
                    "rect": clipBounds,
                    "msg": msg,
                    "success": callback_success,
                    "faild": callback_failed
                };
                dispatch(evt);
            }
            catch (e) {
                console.error("Security Error", e.message);
            }
        }, 60);
    };
    /**
     * 继续游戏
     * @constructor
     */
    App.ContinueGame = function () {
        BaseScene.creditNone = false;
        dispatch(new MGEvent(MGEvent.CONTINUE_GAME || "CONTINUE_GAME"));
    };
    /**
     * 关卡失败
     * @param level
     * @constructor
     */
    App.LevelFail = function (level) {
        var evt = new MGEvent(MGEvent.LEVEL_FAIL || "LEVEL_FAIL");
        evt.data = {"level": level};
        dispatch(evt);
    };
    /**
     * 关卡胜利
     * @param level
     */
    App.LevelWin = function (level) {
        var evt = new MGEvent(MGEvent.LEVEL_WIN || "LEVEL_WIN");
        evt.data = {"level": level};
        dispatch(evt);
    };
    /**
     * 更改场景
     * @param {Function}    callback
     * @param {Object}      thisObj
     * @constructor
     */
    App.ChangeScene = function (callback, thisObj) {
        var args = null;
        if (arguments.length >= 3) {
            args = arguments.slice(2);
        }
        var type = MGEvent.CHANGE_SCENE || "CHANGE_SCENE";
        if (!MGDelegate._eventMap[type] || MGDelegate._eventMap[type].length == 0) {
            callback.apply(thisObj, args);
            return;
        }
        var evt = new MGEvent(type);
        evt.data = {
            'callback': callback,
            'thisObj': thisObj,
            'args': args
        };
        dispatch(evt);
    };
    App.ClickFullscreen = function () {
        if (App.FullscreenEnabled) {
            dispatch(new MGEvent(MGEvent.FULLSCREEN || "FULLSCREEN"));
        }
    };
    return App;
})();
App.init = function () {
    if (!App.instance) {
        App.instance = new App();
    }
}
App.prototype.__class__ = "App";