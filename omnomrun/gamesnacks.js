! function(e) {
    var t = {};

    function n(r) {
        if (t[r]) return t[r].exports;
        var i = t[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return e[r].call(i.exports, i, i.exports, n), i.l = !0, i.exports
    }
    n.m = e, n.c = t, n.d = function(e, t, r) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: r
        })
    }, n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, n.t = function(e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var r = Object.create(null);
        if (n.r(r), Object.defineProperty(r, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var i in e) n.d(r, i, function(t) {
                return e[t]
            }.bind(null, i));
        return r
    }, n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 0)
}([function(e, t, n) {
    "use strict";
    n.r(t), n.d(t, "GAMESNACKS", (function() {
        return S
    }));
    var r, i = function() {
            var e = this;
            this.isType = function(t, n) {
                var r = e.validateOrReturnError(t, n);
                return !0 === r || (console.error(r), !1)
            }
        },
        a = function(e, t, n) {
            for (var r = 0, i = Object.entries(t); r < i.length; r++) {
                var a = i[r],
                    s = a[0],
                    d = a[1],
                    u = o(e, s, d, n);
                if (!0 !== u) return u
            }
            return !0
        },
        o = function(e, t, n, r) {
            return typeof e[t] === n || r + ' expects "' + t + '" property of type "' + n + '".'
        },
        s = (r = function(e, t) {
            return (r = Object.setPrototypeOf || {
                    __proto__: []
                }
                instanceof Array && function(e, t) {
                    e.__proto__ = t
                } || function(e, t) {
                    for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                })(e, t)
        }, function(e, t) {
            function n() {
                this.constructor = e
            }
            r(e, t), e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n)
        }),
        d = {
            afgSdkUrl: "string",
            publisherId: "string",
            dataAdFrequencyHint: "string",
            dataAdbreakTest: "string",
            preloadAdBreaks: "string"
        },
        u = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.validateOrReturnError = function(e, t) {
                    return "object" != typeof e ? t + ' expects parameter of type "object".' : a(e, d, t)
                }, t
            }
            return s(t, e), t.instance = new t, t
        }((function() {
            var e = this;
            this.isType = function(t, n) {
                return !0 === e.validateOrReturnError(t, n)
            }
        })),
        c = function() {
            var e = function(t, n) {
                return (e = Object.setPrototypeOf || {
                        __proto__: []
                    }
                    instanceof Array && function(e, t) {
                        e.__proto__ = t
                    } || function(e, t) {
                        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
                    })(t, n)
            };
            return function(t, n) {
                function r() {
                    this.constructor = t
                }
                e(t, n), t.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype, new r)
            }
        }(),
        f = {
            beforeReward: "function",
            beforeBreak: "function",
            adComplete: "function",
            adDismissed: "function",
            afterBreak: "function"
        },
        A = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.validateOrReturnError = function(e, t) {
                    return "object" != typeof e ? t + ' expects parameter of type "object".' : a(e, f, "rewardedAdOpportunity")
                }, t
            }
            return c(t, e), t.instance = new t, t
        }(i),
        p = {
            afgSdkUrl: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
            publisherId: "ca-pub-5356814494732193",
            dataAdFrequencyHint: "120s",
            dataAdbreakTest: "on",
            preloadAdBreaks: "on"
        },
        l = ["test", "production"],
        S = {
            environment: "production",
            audioEnabled: !0,
            shouldAudioBeEnabledAfterAd: !0,
            isAdInProgress: !1,
            audioSubscribers: [],
            ghostDataSubscriber: null,
            adsInitialized: !1,
            rewardedAdsAllowed: !1,
            rewardedAdName: "",
            sendScore: function(e, t) {
                void 0 === t && (t = {}), parent.postMessage(JSON.stringify({
                    score: e,
                    scoreMetadata: t
                }), "*")
            },
            gameOver: function() {
                parent.postMessage(JSON.stringify({
                    type: "gameOver",
                    value: !0
                }), "*")
            },
            isAudioEnabled: function() {
                return this.notifyGamesnacksOfAudioApiUsage(), this.audioEnabled
            },
            subscribeToAudioUpdates: function(e) {
                this.notifyGamesnacksOfAudioApiUsage(), this.audioSubscribers.push(e)
            },
            notifyGamesnacksOfAudioApiUsage: function() {
                parent.postMessage(JSON.stringify({
                    type: "GAMESNACKS_AUDIO_SUBCRIPTION",
                    value: !0
                }), "*")
            },
            listenAndDelegateMessages: function() {
                var e = this;
                window.addEventListener("message", (function(t) {
                    var n = t && t.data && t.data.type;
                    "GAMESNACKS_AUDIO_UPDATE" === n ? e.handleAudioUpdates(t) : "GAMESNACKS_ADS_INITIALIZE" === n ? e._initializeAds(t) : "GAMESNACKS_ADS_AD_BREAK" === n ? e._adBreak(t) : "GAMESNACKS_ALLOW_REWARDED_ADS" === n ? e._handleRewardedAdsAllowed() : "GAMESNACKS_DECLARE_TEST_ENVIRONMENT" === n && e._testEnvironment()
                }), !1)
            },
            _sendSdkLoadedMessage: function() {
                parent.postMessage(JSON.stringify({
                    type: "GAMESNACKS_SDK_LOADED",
                    value: !0
                }), "*")
            },
            _initializeAds: function(e) {
                var t = e.data.value;
                u.instance.isType(t, "GAMESNACKS_ADS_INITIALIZE") ? this._initializeAdsWithValidatedConfig(t) : console.warn("Malformatted GS SDK request: initializeAds.")
            },
            _initializeAdsWithValidatedConfig: function(e) {
                if (!this.adsInitialized) {
                    this.adsInitialized = !0;
                    var t = window.document.createElement("script");
                    t.setAttribute("data-ad-client", e.publisherId), t.setAttribute("data-ad-frequency-hint", e.dataAdFrequencyHint), t.setAttribute("src", e.afgSdkUrl), "on" === e.dataAdbreakTest && t.setAttribute("data-adbreak-test", "on"), window.document.head.appendChild(t), window.adsbygoogle = window.adsbygoogle || [], window.adBreak = window.adConfig = function(e) {
                        window.adsbygoogle.push(e)
                    }, window.adConfig({
                        preloadAdBreaks: e.preloadAdBreaks,
                        sound: this._getAdconfigSoundParam(),
                        EXPERIMENTAL_userInteractionChecks: "off"
                    })
                }
            },
            _getAdconfigSoundParam: function() {
                return this.audioEnabled ? "on" : "off"
            },
            _adBreak: function(e) {
                var t = e.data.value;
                if (t && t.type && t.name) {
                    var n = {
                        type: t.type,
                        name: t.name,
                        beforeAd: this._beforeBreak,
                        afterAd: this._afterBreak
                    };
                    window.adBreak && window.adBreak(n)
                } else console.warn("Malformatted GS SDK request: initializeAds.")
            },
            _beforeBreak: function() {
                parent.postMessage(JSON.stringify({
                    type: "GAMESNACKS_ADS_BEFORE_BREAK",
                    value: !0
                }), "*"), this.isAdInProgress = !0, this.shouldAudioBeEnabledAfterAd = this.audioEnabled, this._changeAudioAndUpdateSubscribers(!1)
            },
            _afterBreak: function() {
                parent.postMessage(JSON.stringify({
                    type: "GAMESNACKS_ADS_AFTER_BREAK",
                    value: !0
                }), "*"), this.isAdInProgress = !1, this._changeAudioAndUpdateSubscribers(this.shouldAudioBeEnabledAfterAd)
            },
            _checkEnvironmentAttribute: function() {
                var e = document.currentScript && document.currentScript.getAttribute("data-environment");
                "string" == typeof e && (l.includes(e) || console.warn("Invalid value for data-environment attrbute: " + e), "test" === e && (this.environment = "test", this._testEnvironment()))
            },
            _testEnvironment: function() {
                console.log("GameSnacks SDK is running in a test environment."), this._initializeAdsWithValidatedConfig(p), this._handleRewardedAdsAllowed()
            },
            _handleRewardedAdsAllowed: function() {
                this.rewardedAdsAllowed = !0
            },
            rewardedAdOpportunity: function(e) {
                if (A.instance.isType(e, "rewardedAdOpportunity") && this.rewardedAdsAllowed) {
                    var t = {
                        type: "reward",
                        name: this.rewardedAdName,
                        beforeReward: function(t) {
                            e.beforeReward((function() {
                                console.log("gsjs gsShowAdFn"), t(), parent.postMessage(JSON.stringify({
                                    type: "GAMESNACKS_SHOW_REWARDED_AD",
                                    value: !0
                                }), "*")
                            })), parent.postMessage(JSON.stringify({
                                type: "GAMESNACKS_BEFORE_REWARD",
                                value: !0
                            }), "*")
                        },
                        beforeAd: function() {
                            e.beforeBreak()
                        },
                        adViewed: function() {
                            e.adComplete(), parent.postMessage(JSON.stringify({
                                type: "GAMESNACKS_REWARDED_AD_COMPLETE",
                                value: !0
                            }), "*")
                        },
                        adDismissed: function() {
                            e.adDismissed(), parent.postMessage(JSON.stringify({
                                type: "GAMESNACKS_REWARDED_AD_DISMISSED",
                                value: !0
                            }), "*")
                        },
                        afterAd: function() {
                            e.afterBreak()
                        }
                    };
                    window.adBreak && window.adBreak(t)
                }
            },
            handleAudioUpdates: function(e) {
                if (e && e.data && "GAMESNACKS_AUDIO_UPDATE" === e.data.type) {
                    var t = e.data.isAudioEnabled;
                    "boolean" == typeof t && (this.isAdInProgress ? this.shouldAudioBeEnabledAfterAd = t : (this._changeAudioAndUpdateSubscribers(t), window.adConfig && window.adConfig({
                        sound: this._getAdconfigSoundParam()
                    })))
                }
            },
            _changeAudioAndUpdateSubscribers: function(e) {
                this.audioEnabled = e, this.updateAudioSubscribers()
            },
            updateAudioSubscribers: function() {
                var e = this;
                this.audioSubscribers.forEach((function(t) {
                    t(e.audioEnabled)
                }))
            },
            _subscribeToGhostData: function(e) {
                this.ghostDataSubscriber = e;
                var t = this;
                window.addEventListener("message", (function(e) {
                    e && e.data && "GAMESNACKS_RECEIVE_GHOST_DATA" === e.data.type && t.ghostDataSubscriber(e.data.value)
                }), !1), parent.postMessage(JSON.stringify({
                    type: "GAMESNACKS_SUBSCRIBE_TO_GHOST_DATA",
                    value: !0
                }), "*")
            },
            _gameOverWithGhost: function(e) {
                parent.postMessage(JSON.stringify({
                    type: "GAMESNACKS_GAME_OVER_WITH_GHOST",
                    value: e
                }), "*")
            },
            gameReady: function() {
                parent.postMessage(JSON.stringify({
                    type: "GAMESNACKS_GAME_READY",
                    value: Date.now()
                }), "*")
            },
            levelComplete: function(e) {
                parent.postMessage(JSON.stringify({
                    type: "GAMESNACKS_LEVEL_COMPLETE",
                    value: e
                }), "*")
            }
        };
    S._checkEnvironmentAttribute(), S.listenAndDelegateMessages(), S._afterBreak = S._afterBreak.bind(S), S._beforeBreak = S._beforeBreak.bind(S), S._sendSdkLoadedMessage(), window.GAMESNACKS = S
}]);
