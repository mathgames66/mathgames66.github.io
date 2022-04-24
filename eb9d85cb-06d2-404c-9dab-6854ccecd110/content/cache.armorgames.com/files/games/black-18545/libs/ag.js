(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * JavaScript MD5 1.0.1
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 * 
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*jslint bitwise: true */
/*global unescape, define */

(function ($) {
    'use strict';

    /*
    * Add integers, wrapping at 2^32. This uses 16-bit operations internally
    * to work around bugs in some JS interpreters.
    */
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
    * Bitwise rotate a 32-bit number to the left.
    */
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
    * These functions implement the four basic operations the algorithm uses.
    */
    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }
    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
    * Calculate the MD5 of an array of little-endian words, and a bit length.
    */
    function binl_md5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var i, olda, oldb, oldc, oldd,
            a =  1732584193,
            b = -271733879,
            c = -1732584194,
            d =  271733878;

        for (i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;

            a = md5_ff(a, b, c, d, x[i],       7, -680876936);
            d = md5_ff(d, a, b, c, x[i +  1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i +  2], 17,  606105819);
            b = md5_ff(b, c, d, a, x[i +  3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i +  4],  7, -176418897);
            d = md5_ff(d, a, b, c, x[i +  5], 12,  1200080426);
            c = md5_ff(c, d, a, b, x[i +  6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i +  7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i +  8],  7,  1770035416);
            d = md5_ff(d, a, b, c, x[i +  9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12],  7,  1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22,  1236535329);

            a = md5_gg(a, b, c, d, x[i +  1],  5, -165796510);
            d = md5_gg(d, a, b, c, x[i +  6],  9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14,  643717713);
            b = md5_gg(b, c, d, a, x[i],      20, -373897302);
            a = md5_gg(a, b, c, d, x[i +  5],  5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10],  9,  38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i +  4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i +  9],  5,  568446438);
            d = md5_gg(d, a, b, c, x[i + 14],  9, -1019803690);
            c = md5_gg(c, d, a, b, x[i +  3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i +  8], 20,  1163531501);
            a = md5_gg(a, b, c, d, x[i + 13],  5, -1444681467);
            d = md5_gg(d, a, b, c, x[i +  2],  9, -51403784);
            c = md5_gg(c, d, a, b, x[i +  7], 14,  1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i +  5],  4, -378558);
            d = md5_hh(d, a, b, c, x[i +  8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16,  1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i +  1],  4, -1530992060);
            d = md5_hh(d, a, b, c, x[i +  4], 11,  1272893353);
            c = md5_hh(c, d, a, b, x[i +  7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13],  4,  681279174);
            d = md5_hh(d, a, b, c, x[i],      11, -358537222);
            c = md5_hh(c, d, a, b, x[i +  3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i +  6], 23,  76029189);
            a = md5_hh(a, b, c, d, x[i +  9],  4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16,  530742520);
            b = md5_hh(b, c, d, a, x[i +  2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i],       6, -198630844);
            d = md5_ii(d, a, b, c, x[i +  7], 10,  1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i +  5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12],  6,  1700485571);
            d = md5_ii(d, a, b, c, x[i +  3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i +  1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i +  8],  6,  1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i +  6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21,  1309151649);
            a = md5_ii(a, b, c, d, x[i +  4],  6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i +  2], 15,  718787259);
            b = md5_ii(b, c, d, a, x[i +  9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return [a, b, c, d];
    }

    /*
    * Convert an array of little-endian words to a string
    */
    function binl2rstr(input) {
        var i,
            output = '';
        for (i = 0; i < input.length * 32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        }
        return output;
    }

    /*
    * Convert a raw string to an array of little-endian words
    * Characters >255 have their high-byte silently ignored.
    */
    function rstr2binl(input) {
        var i,
            output = [];
        output[(input.length >> 2) - 1] = undefined;
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0;
        }
        for (i = 0; i < input.length * 8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        }
        return output;
    }

    /*
    * Calculate the MD5 of a raw string
    */
    function rstr_md5(s) {
        return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
    }

    /*
    * Calculate the HMAC-MD5, of a key and some data (raw strings)
    */
    function rstr_hmac_md5(key, data) {
        var i,
            bkey = rstr2binl(key),
            ipad = [],
            opad = [],
            hash;
        ipad[15] = opad[15] = undefined;
        if (bkey.length > 16) {
            bkey = binl_md5(bkey, key.length * 8);
        }
        for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
    }

    /*
    * Convert a raw string to a hex string
    */
    function rstr2hex(input) {
        var hex_tab = '0123456789abcdef',
            output = '',
            x,
            i;
        for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F) +
                hex_tab.charAt(x & 0x0F);
        }
        return output;
    }

    /*
    * Encode a string as utf-8
    */
    function str2rstr_utf8(input) {
        return unescape(encodeURIComponent(input));
    }

    /*
    * Take string arguments and return either raw or hex encoded strings
    */
    function raw_md5(s) {
        return rstr_md5(str2rstr_utf8(s));
    }
    function hex_md5(s) {
        return rstr2hex(raw_md5(s));
    }
    function raw_hmac_md5(k, d) {
        return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
    }
    function hex_hmac_md5(k, d) {
        return rstr2hex(raw_hmac_md5(k, d));
    }

    function md5(string, key, raw) {
        if (!key) {
            if (!raw) {
                return hex_md5(string);
            }
            return raw_md5(string);
        }
        if (!raw) {
            return hex_hmac_md5(key, string);
        }
        return raw_hmac_md5(key, string);
    }

    if (typeof define === 'function' && define.amd) {
        define(function () {
            return md5;
        });
    } else {
        $.md5 = md5;
    }
}(this));

},{}],2:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   3.0.2
 */

(function() {
    "use strict";
    function lib$es6$promise$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$es6$promise$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$es6$promise$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$es6$promise$utils$$_isArray;
    if (!Array.isArray) {
      lib$es6$promise$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$es6$promise$utils$$_isArray = Array.isArray;
    }

    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
    var lib$es6$promise$asap$$len = 0;
    var lib$es6$promise$asap$$toString = {}.toString;
    var lib$es6$promise$asap$$vertxNext;
    var lib$es6$promise$asap$$customSchedulerFn;

    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
      lib$es6$promise$asap$$len += 2;
      if (lib$es6$promise$asap$$len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (lib$es6$promise$asap$$customSchedulerFn) {
          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
        } else {
          lib$es6$promise$asap$$scheduleFlush();
        }
      }
    }

    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
    }

    function lib$es6$promise$asap$$setAsap(asapFn) {
      lib$es6$promise$asap$$asap = asapFn;
    }

    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$es6$promise$asap$$useNextTick() {
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // see https://github.com/cujojs/when/issues/410 for details
      return function() {
        process.nextTick(lib$es6$promise$asap$$flush);
      };
    }

    // vertx
    function lib$es6$promise$asap$$useVertxTimer() {
      return function() {
        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
      };
    }

    function lib$es6$promise$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$es6$promise$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$es6$promise$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$es6$promise$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$es6$promise$asap$$flush, 1);
      };
    }

    var lib$es6$promise$asap$$queue = new Array(1000);
    function lib$es6$promise$asap$$flush() {
      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
        var callback = lib$es6$promise$asap$$queue[i];
        var arg = lib$es6$promise$asap$$queue[i+1];

        callback(arg);

        lib$es6$promise$asap$$queue[i] = undefined;
        lib$es6$promise$asap$$queue[i+1] = undefined;
      }

      lib$es6$promise$asap$$len = 0;
    }

    function lib$es6$promise$asap$$attemptVertx() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$es6$promise$asap$$useVertxTimer();
      } catch(e) {
        return lib$es6$promise$asap$$useSetTimeout();
      }
    }

    var lib$es6$promise$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$es6$promise$asap$$isNode) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
    } else if (lib$es6$promise$asap$$isWorker) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertx();
    } else {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
    }

    function lib$es6$promise$$internal$$noop() {}

    var lib$es6$promise$$internal$$PENDING   = void 0;
    var lib$es6$promise$$internal$$FULFILLED = 1;
    var lib$es6$promise$$internal$$REJECTED  = 2;

    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$selfFulfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function lib$es6$promise$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$es6$promise$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
        return lib$es6$promise$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
       lib$es6$promise$asap$$asap(function(promise) {
        var sealed = false;
        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$es6$promise$$internal$$resolve(promise, value);
          } else {
            lib$es6$promise$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$es6$promise$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$es6$promise$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, thenable._result);
      } else {
        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = lib$es6$promise$$internal$$getThen(maybeThenable);

        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$es6$promise$utils$$isFunction(then)) {
          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$es6$promise$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment());
      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
        lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
      } else {
        lib$es6$promise$$internal$$fulfill(promise, value);
      }
    }

    function lib$es6$promise$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      lib$es6$promise$$internal$$publish(promise);
    }

    function lib$es6$promise$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$es6$promise$$internal$$FULFILLED;

      if (promise._subscribers.length !== 0) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
      }
    }

    function lib$es6$promise$$internal$$reject(promise, reason) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
      promise._state = lib$es6$promise$$internal$$REJECTED;
      promise._result = reason;

      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
    }

    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
      }
    }

    function lib$es6$promise$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$es6$promise$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
    }

    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$es6$promise$$internal$$reject(promise, e);
      }
    }

    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
      var enumerator = this;

      enumerator._instanceConstructor = Constructor;
      enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (enumerator._validateInput(input)) {
        enumerator._input     = input;
        enumerator.length     = input.length;
        enumerator._remaining = input.length;

        enumerator._init();

        if (enumerator.length === 0) {
          lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
        } else {
          enumerator.length = enumerator.length || 0;
          enumerator._enumerate();
          if (enumerator._remaining === 0) {
            lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
          }
        }
      } else {
        lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
      }
    }

    lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$es6$promise$utils$$isArray(input);
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;

    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
      var enumerator = this;

      var length  = enumerator.length;
      var promise = enumerator.promise;
      var input   = enumerator._input;

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        enumerator._eachEntry(input[i], i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var enumerator = this;
      var c = enumerator._instanceConstructor;

      if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
          entry._onerror = null;
          enumerator._settledAt(entry._state, i, entry._result);
        } else {
          enumerator._willSettleAt(c.resolve(entry), i);
        }
      } else {
        enumerator._remaining--;
        enumerator._result[i] = entry;
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var enumerator = this;
      var promise = enumerator.promise;

      if (promise._state === lib$es6$promise$$internal$$PENDING) {
        enumerator._remaining--;

        if (state === lib$es6$promise$$internal$$REJECTED) {
          lib$es6$promise$$internal$$reject(promise, value);
        } else {
          enumerator._result[i] = value;
        }
      }

      if (enumerator._remaining === 0) {
        lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
      });
    };
    function lib$es6$promise$promise$all$$all(entries) {
      return new lib$es6$promise$enumerator$$default(this, entries).promise;
    }
    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
    function lib$es6$promise$promise$race$$race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (!lib$es6$promise$utils$$isArray(entries)) {
        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
    function lib$es6$promise$promise$resolve$$resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
    function lib$es6$promise$promise$reject$$reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

    var lib$es6$promise$promise$$counter = 0;

    function lib$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function lib$es6$promise$promise$$Promise(resolver) {
      this._id = lib$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (lib$es6$promise$$internal$$noop !== resolver) {
        if (!lib$es6$promise$utils$$isFunction(resolver)) {
          lib$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof lib$es6$promise$promise$$Promise)) {
          lib$es6$promise$promise$$needsNew();
        }

        lib$es6$promise$$internal$$initializePromise(this, resolver);
      }
    }

    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

    lib$es6$promise$promise$$Promise.prototype = {
      constructor: lib$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection) {
        var parent = this;
        var state = parent._state;

        if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
          return this;
        }

        var child = new this.constructor(lib$es6$promise$$internal$$noop);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          lib$es6$promise$asap$$asap(function(){
            lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    function lib$es6$promise$polyfill$$polyfill() {
      var local;

      if (typeof global !== 'undefined') {
          local = global;
      } else if (typeof self !== 'undefined') {
          local = self;
      } else {
          try {
              local = Function('return this')();
          } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
          }
      }

      var P = local.Promise;

      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
        return;
      }

      local.Promise = lib$es6$promise$promise$$default;
    }
    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

    var lib$es6$promise$umd$$ES6Promise = {
      'Promise': lib$es6$promise$promise$$default,
      'polyfill': lib$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
require('whatwg-fetch');
module.exports = self.fetch.bind(self);

},{"whatwg-fetch":5}],5:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this)
      }, this)
    }, this)
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return fileReaderReady(reader)
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return fileReaderReady(reader)
  }

  var support = {
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob();
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  function Body() {
    this.bodyUsed = false


    this._initBody = function(body) {
      this._bodyInit = body
      if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (!body) {
        this._bodyText = ''
      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
        // Only support ArrayBuffers for POST method.
        // Receiving ArrayBuffers happens via Blobs, instead.
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer)
      }

      this.text = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return Promise.resolve(this._bodyText)
        }
      }
    } else {
      this.text = function() {
        var rejected = consumed(this)
        return rejected ? rejected : Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body
    if (Request.prototype.isPrototypeOf(input)) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = input
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this)
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function headers(xhr) {
    var head = new Headers()
    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
    pairs.forEach(function(header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      head.append(key, value)
    })
    return head
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request
      if (Request.prototype.isPrototypeOf(input) && !init) {
        request = input
      } else {
        request = new Request(input, init)
      }

      var xhr = new XMLHttpRequest()

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL')
        }

        return;
      }

      xhr.onload = function() {
        var status = (xhr.status === 1223) ? 204 : xhr.status
        if (status < 100 || status > 599) {
          reject(new TypeError('Network request failed'))
          return
        }
        var options = {
          status: status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        }
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}],6:[function(require,module,exports){
module.exports = function (Promise) {
	var PromiseObject = require('promise-object')(Promise);

	var PromiseRetryer = PromiseObject.create({
		$TRUE_FUNC: function () {return true;},
		$TRUE_PROMISE: function ($deferred, response) {$deferred.resolve(response);},

		$run: function ($deferred, $class, $config, _attempt) {
	 		if (typeof $config.promise !== 'function') {
				throw new TypeError($class.message('the :promise property mush be a function that returns a promise'));
			}

			_attempt = _attempt || 1;

			$config.delay = $config.delay || 0;
			$config.maxRetries = $config.maxRetries || 1;
			$config.debug = $config.debug || false;
			$config.validate = $config.validate || $class.TRUE_PROMISE;
			$config.onError = $config.onError || $class.TRUE_FUNC;
			$config.onAttempt = $config.onAttempt || $class.TRUE_FUNC;

			$class.debug($config, 'Starting Attempt #' + _attempt);
			$config.onAttempt(_attempt);
			
			$config.promise(_attempt)
				.then(function (response) {
					return $config.validate(response, _attempt);
				})
				.then(
					function (result) {
						$deferred.resolve(result);
					},
					function (error) {
						$class.debug($config, 'Error on attempt #' + _attempt);

						$config.onError(error, _attempt);

						if (_attempt < $config.maxRetries) {
							setTimeout(function () {
								$class.run($config, ++_attempt).then(
									function (result) {
										$deferred.resolve(result);
									},
									function (error) {
										$deferred.reject(error);
									}
								);
							}, typeof $config.delay === 'function' ? $config.delay(_attempt) : $config.delay);
						} else {
							$deferred.reject(error);
						}
					}
				);
		},

		$message: function ($config, message) {
			return 'PromiseRetryer' + ($config.name ? '[' + $config.name + ']' : '')  + ': ' + message;
		},

		$debug: function ($class, $config, message) {
			if ($config.debug) {
				console.log($class.message($config, message));
			}
		}
	});

	return PromiseRetryer;
};
},{"promise-object":7}],7:[function(require,module,exports){
module.exports = function (Promise) {
	function isFunction (obj) {
		return 'function' == typeof obj || obj instanceof ExtendedMethod;
	}

	function deferPromise (Promise)  {
		var result = {};
		result.promise = new Promise(function(resolve, reject) {
			result.resolve = function(value) {
				resolve(value);
			};
			result.reject = function(value) {
				reject(value);
			};
		});
		return result;
	}

	function ExtendedMethod (name, func, superFunc) {
		this.name = name;
		this.func = func;
		this.superFunc = superFunc;
	}

	function makeMethod (func, scope, name) {
		var superFunc = (scope.prototype || scope)[name];

		if (!isFunction(func) || !isFunction(superFunc)) {
			return func;
		} else {
			return new ExtendedMethod(name, func, superFunc);
		}
	}

	function mapPseudoArgsToMethod (func, scope, name, params, superMethod) {
		function mapArgsArray (args, actualArgsArray) {
			for (var param in params) {
				if (typeof params[param] !== 'string') continue;

				if (params[param] === '$self') {
					args.push(scope);
				} else if (params[param] === '$class') {
						args.push(scope.__class__);
				} else if (params[param] === '$super') {
					if (!superMethod) throw new Error('$super argument for "' + name + '" has no super method');
					args.push(superMethod);
				} else if (params[param].substr(0,1) !== '$') {
					break;
				}
			}

			// ensure that config object is an object
			if (params.indexOf('$config') !== -1) actualArgsArray[0] = actualArgsArray[0] || {};
		}

		return function () {
			var args = [],
				actualArgsArray = Array.prototype.slice.call(arguments);

			if (params.indexOf('$deferred') !== -1) {
				var index = params.indexOf('$deferred');

				if (index !== 0) throw new Error('$deferred argument on the "' + name + '" method has an arguments index of ' + index + ' and needs to be 0');

				var resolver = Promise.defer ? Promise.defer() : deferPromise(Promise);

				args.push(resolver);

				mapArgsArray(args, actualArgsArray);

				args = args.concat(actualArgsArray);

				if (func.constructor.name === 'GeneratorFunction') {
					Promise.coroutine(func).apply(scope, args).then(null, function (error) {
						resolver.reject(error);
					});
				} else {
					func.apply(scope, args);
				}

				return resolver.promise;
			} else {
				mapArgsArray(args, actualArgsArray);

				args = args.concat(actualArgsArray);

				return func.apply(scope, args);
			}
		};
	}

	function getPseudoArgs (string) {
		var args = string.match(/^function\*? [^\(]*\(([a-z0-9_$,\s]+)\)/i);
		return (args && /\$(deferred|self|super|config|class)/.test(args[1])) ? args : false;
	}

	function mapMethod (func, scope, name, superMethod) {
		var funcString = func.toString(),
			args = getPseudoArgs(funcString);

		if (args) {
			args = args[1].replace(/\s/g, '').split(',');

			return mapPseudoArgsToMethod(func, scope, name, args, superMethod);
		} else if (func instanceof ExtendedMethod) {
			var superFunc,
				current = func.superFunc,
				chain = [];

			while (current instanceof ExtendedMethod) {
				chain.push(current);
				current = current.superFunc instanceof ExtendedMethod ? current.superFunc : null;
			}

			if (chain.length) {
				chain.reverse().forEach(function (current) {
					var superSuperFunc = mapMethod(current.superFunc, scope, current.name, superFunc);
					superFunc = mapMethod(current.func, scope, current.name, superSuperFunc);
				});
			} else {
				superFunc = func.superFunc;
			}

			if (!getPseudoArgs(String(superFunc))) superFunc = superFunc.bind(scope);

			superFunc = mapMethod(superFunc, scope, name);

			return mapMethod(func.func, scope, name, superFunc);
		} else {
			return func.bind(scope);
		}
	}

	function makeAndMapMethod (func, scope, name) {
		scope[name] = makeMethod(func, scope, name);
		return isFunction(scope[name]) ? mapMethod(scope[name], scope, name) : scope[name];
	}

	function addMixins (args) {
		var mixins = Array.prototype.slice.call(args, 0, -1),
			proto = args[args.length-1];

		mixins.forEach(function (mixin) {
			for (var method in mixin) {
				if (method === 'initialize') {
					if (!proto.___mixin_initializers___) proto.___mixin_initializers___ = [];
					proto.___mixin_initializers___.push(mixin[method]);
					continue;
				}

				if (typeof proto[method] !== 'undefined') throw new Error('Mixin: "' + method + '" collision, cannot override class methods');
				proto[method] = mixin[method];
			}
		});

		return proto;
	}

	var Class = function () {};
	Class.create = function () {
		var Self = this,
			instance = function (_Class) {
				var self = this;

				self.reopen = function (methods) {
					for (var method in methods) {
						self[method] = makeAndMapMethod(methods[method], self, method);
					}
				};

				if (_Class !== Class && isFunction(this.initialize)) {
					for (var method in this) {
						if (method.substr(0, 1) !== '$' && method !== '__class__' && isFunction(this[method])) {
							this[method] = mapMethod(this[method], this, method);
						}
					}

					if (this.___mixin_initializers___) {
						this.___mixin_initializers___.forEach(function (initializer) {
							initializer.apply(self);
						});
						delete this.___mixin_initializers___;
					}

					this.initialize.apply(this, arguments);
				}
			};

		// when Class is passed in the initialize method will not be run
		instance.prototype = new Self(Class);

		var proto = arguments.length > 1 ? addMixins(arguments) : arguments[0];

		for (var method in proto) {
			instance.prototype[method] = makeMethod(proto[method], instance, method);
		}

		for (method in instance.prototype) {
			if (method.substr(0, 1) === '$') {
				instance[method.substr(1)] = makeAndMapMethod(instance.prototype[method], instance.prototype, method);
			}
		}

		instance.prototype.constructor = instance.prototype.__class__ = instance;
		instance.extend = this.extend || this.create;
		instance.reopen = function (methods) {
			for (var method in methods) {
				if (method === 'initialize') {
					instance.prototype[method] = makeMethod(methods[method], instance.prototype, method);
				} else {
					instance[method] = makeAndMapMethod(methods[method], instance.prototype, '$' + method);
				}
			}
		};

		return instance;
	};

	return Class;
};
},{}],8:[function(require,module,exports){
'use strict';

module.exports = require('./lib')

},{"./lib":13}],9:[function(require,module,exports){
'use strict';

var asap = require('asap/raw');

function noop() {}

// States:
//
// 0 - pending
// 1 - fulfilled with _value
// 2 - rejected with _value
// 3 - adopted the state of another promise, _value
//
// once the state is no longer pending (0) it is immutable

// All `_` prefixed properties will be reduced to `_{random number}`
// at build time to obfuscate them and discourage their use.
// We don't use symbols or Object.defineProperty to fully hide them
// because the performance isn't good enough.


// to avoid using try/catch inside critical functions, we
// extract them to here.
var LAST_ERROR = null;
var IS_ERROR = {};
function getThen(obj) {
  try {
    return obj.then;
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}
function tryCallTwo(fn, a, b) {
  try {
    fn(a, b);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

module.exports = Promise;

function Promise(fn) {
  if (typeof this !== 'object') {
    throw new TypeError('Promises must be constructed via new');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('not a function');
  }
  this._45 = 0;
  this._81 = 0;
  this._65 = null;
  this._54 = null;
  if (fn === noop) return;
  doResolve(fn, this);
}
Promise._10 = null;
Promise._97 = null;
Promise._61 = noop;

Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};

function safeThen(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
};
function handle(self, deferred) {
  while (self._81 === 3) {
    self = self._65;
  }
  if (Promise._10) {
    Promise._10(self);
  }
  if (self._81 === 0) {
    if (self._45 === 0) {
      self._45 = 1;
      self._54 = deferred;
      return;
    }
    if (self._45 === 1) {
      self._45 = 2;
      self._54 = [self._54, deferred];
      return;
    }
    self._54.push(deferred);
    return;
  }
  handleResolved(self, deferred);
}

function handleResolved(self, deferred) {
  asap(function() {
    var cb = self._81 === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._81 === 1) {
        resolve(deferred.promise, self._65);
      } else {
        reject(deferred.promise, self._65);
      }
      return;
    }
    var ret = tryCallOne(cb, self._65);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
}
function resolve(self, newValue) {
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  if (newValue === self) {
    return reject(
      self,
      new TypeError('A promise cannot be resolved with itself.')
    );
  }
  if (
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (
      then === self.then &&
      newValue instanceof Promise
    ) {
      self._81 = 3;
      self._65 = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  self._81 = 1;
  self._65 = newValue;
  finale(self);
}

function reject(self, newValue) {
  self._81 = 2;
  self._65 = newValue;
  if (Promise._97) {
    Promise._97(self, newValue);
  }
  finale(self);
}
function finale(self) {
  if (self._45 === 1) {
    handle(self, self._54);
    self._54 = null;
  }
  if (self._45 === 2) {
    for (var i = 0; i < self._54.length; i++) {
      handle(self, self._54[i]);
    }
    self._54 = null;
  }
}

function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, promise) {
  var done = false;
  var res = tryCallTwo(fn, function (value) {
    if (done) return;
    done = true;
    resolve(promise, value);
  }, function (reason) {
    if (done) return;
    done = true;
    reject(promise, reason);
  })
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}

},{"asap/raw":17}],10:[function(require,module,exports){
'use strict';

var Promise = require('./core.js');

module.exports = Promise;
Promise.prototype.done = function (onFulfilled, onRejected) {
  var self = arguments.length ? this.then.apply(this, arguments) : this;
  self.then(null, function (err) {
    setTimeout(function () {
      throw err;
    }, 0);
  });
};

},{"./core.js":9}],11:[function(require,module,exports){
'use strict';

//This file contains the ES6 extensions to the core Promises/A+ API

var Promise = require('./core.js');

module.exports = Promise;

/* Static Functions */

var TRUE = valuePromise(true);
var FALSE = valuePromise(false);
var NULL = valuePromise(null);
var UNDEFINED = valuePromise(undefined);
var ZERO = valuePromise(0);
var EMPTYSTRING = valuePromise('');

function valuePromise(value) {
  var p = new Promise(Promise._61);
  p._81 = 1;
  p._65 = value;
  return p;
}
Promise.resolve = function (value) {
  if (value instanceof Promise) return value;

  if (value === null) return NULL;
  if (value === undefined) return UNDEFINED;
  if (value === true) return TRUE;
  if (value === false) return FALSE;
  if (value === 0) return ZERO;
  if (value === '') return EMPTYSTRING;

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then;
      if (typeof then === 'function') {
        return new Promise(then.bind(value));
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex);
      });
    }
  }
  return valuePromise(value);
};

Promise.all = function (arr) {
  var args = Array.prototype.slice.call(arr);

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([]);
    var remaining = args.length;
    function res(i, val) {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        if (val instanceof Promise && val.then === Promise.prototype.then) {
          while (val._81 === 3) {
            val = val._65;
          }
          if (val._81 === 1) return res(i, val._65);
          if (val._81 === 2) reject(val._65);
          val.then(function (val) {
            res(i, val);
          }, reject);
          return;
        } else {
          var then = val.then;
          if (typeof then === 'function') {
            var p = new Promise(then.bind(val));
            p.then(function (val) {
              res(i, val);
            }, reject);
            return;
          }
        }
      }
      args[i] = val;
      if (--remaining === 0) {
        resolve(args);
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
};

Promise.race = function (values) {
  return new Promise(function (resolve, reject) {
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    });
  });
};

/* Prototype Methods */

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
};

},{"./core.js":9}],12:[function(require,module,exports){
'use strict';

var Promise = require('./core.js');

module.exports = Promise;
Promise.prototype['finally'] = function (f) {
  return this.then(function (value) {
    return Promise.resolve(f()).then(function () {
      return value;
    });
  }, function (err) {
    return Promise.resolve(f()).then(function () {
      throw err;
    });
  });
};

},{"./core.js":9}],13:[function(require,module,exports){
'use strict';

module.exports = require('./core.js');
require('./done.js');
require('./finally.js');
require('./es6-extensions.js');
require('./node-extensions.js');
require('./synchronous.js');

},{"./core.js":9,"./done.js":10,"./es6-extensions.js":11,"./finally.js":12,"./node-extensions.js":14,"./synchronous.js":15}],14:[function(require,module,exports){
'use strict';

// This file contains then/promise specific extensions that are only useful
// for node.js interop

var Promise = require('./core.js');
var asap = require('asap');

module.exports = Promise;

/* Static Functions */

Promise.denodeify = function (fn, argumentCount) {
  if (
    typeof argumentCount === 'number' && argumentCount !== Infinity
  ) {
    return denodeifyWithCount(fn, argumentCount);
  } else {
    return denodeifyWithoutCount(fn);
  }
}

var callbackFn = (
  'function (err, res) {' +
  'if (err) { rj(err); } else { rs(res); }' +
  '}'
);
function denodeifyWithCount(fn, argumentCount) {
  var args = [];
  for (var i = 0; i < argumentCount; i++) {
    args.push('a' + i);
  }
  var body = [
    'return function (' + args.join(',') + ') {',
    'var self = this;',
    'return new Promise(function (rs, rj) {',
    'var res = fn.call(',
    ['self'].concat(args).concat([callbackFn]).join(','),
    ');',
    'if (res &&',
    '(typeof res === "object" || typeof res === "function") &&',
    'typeof res.then === "function"',
    ') {rs(res);}',
    '});',
    '};'
  ].join('');
  return Function(['Promise', 'fn'], body)(Promise, fn);
}
function denodeifyWithoutCount(fn) {
  var fnLength = Math.max(fn.length - 1, 3);
  var args = [];
  for (var i = 0; i < fnLength; i++) {
    args.push('a' + i);
  }
  var body = [
    'return function (' + args.join(',') + ') {',
    'var self = this;',
    'var args;',
    'var argLength = arguments.length;',
    'if (arguments.length > ' + fnLength + ') {',
    'args = new Array(arguments.length + 1);',
    'for (var i = 0; i < arguments.length; i++) {',
    'args[i] = arguments[i];',
    '}',
    '}',
    'return new Promise(function (rs, rj) {',
    'var cb = ' + callbackFn + ';',
    'var res;',
    'switch (argLength) {',
    args.concat(['extra']).map(function (_, index) {
      return (
        'case ' + (index) + ':' +
        'res = fn.call(' + ['self'].concat(args.slice(0, index)).concat('cb').join(',') + ');' +
        'break;'
      );
    }).join(''),
    'default:',
    'args[argLength] = cb;',
    'res = fn.apply(self, args);',
    '}',
    
    'if (res &&',
    '(typeof res === "object" || typeof res === "function") &&',
    'typeof res.then === "function"',
    ') {rs(res);}',
    '});',
    '};'
  ].join('');

  return Function(
    ['Promise', 'fn'],
    body
  )(Promise, fn);
}

Promise.nodeify = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var callback =
      typeof args[args.length - 1] === 'function' ? args.pop() : null;
    var ctx = this;
    try {
      return fn.apply(this, arguments).nodeify(callback, ctx);
    } catch (ex) {
      if (callback === null || typeof callback == 'undefined') {
        return new Promise(function (resolve, reject) {
          reject(ex);
        });
      } else {
        asap(function () {
          callback.call(ctx, ex);
        })
      }
    }
  }
}

Promise.prototype.nodeify = function (callback, ctx) {
  if (typeof callback != 'function') return this;

  this.then(function (value) {
    asap(function () {
      callback.call(ctx, null, value);
    });
  }, function (err) {
    asap(function () {
      callback.call(ctx, err);
    });
  });
}

},{"./core.js":9,"asap":16}],15:[function(require,module,exports){
'use strict';

var Promise = require('./core.js');

module.exports = Promise;
Promise.enableSynchronous = function () {
  Promise.prototype.isPending = function() {
    return this.getState() == 0;
  };

  Promise.prototype.isFulfilled = function() {
    return this.getState() == 1;
  };

  Promise.prototype.isRejected = function() {
    return this.getState() == 2;
  };

  Promise.prototype.getValue = function () {
    if (this._81 === 3) {
      return this._65.getValue();
    }

    if (!this.isFulfilled()) {
      throw new Error('Cannot get a value of an unfulfilled promise.');
    }

    return this._65;
  };

  Promise.prototype.getReason = function () {
    if (this._81 === 3) {
      return this._65.getReason();
    }

    if (!this.isRejected()) {
      throw new Error('Cannot get a rejection reason of a non-rejected promise.');
    }

    return this._65;
  };

  Promise.prototype.getState = function () {
    if (this._81 === 3) {
      return this._65.getState();
    }
    if (this._81 === -1 || this._81 === -2) {
      return 0;
    }

    return this._81;
  };
};

Promise.disableSynchronous = function() {
  Promise.prototype.isPending = undefined;
  Promise.prototype.isFulfilled = undefined;
  Promise.prototype.isRejected = undefined;
  Promise.prototype.getValue = undefined;
  Promise.prototype.getReason = undefined;
  Promise.prototype.getState = undefined;
};

},{"./core.js":9}],16:[function(require,module,exports){
"use strict";

// rawAsap provides everything we need except exception management.
var rawAsap = require("./raw");
// RawTasks are recycled to reduce GC churn.
var freeTasks = [];
// We queue errors to ensure they are thrown in right order (FIFO).
// Array-as-queue is good enough here, since we are just dealing with exceptions.
var pendingErrors = [];
var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

function throwFirstError() {
    if (pendingErrors.length) {
        throw pendingErrors.shift();
    }
}

/**
 * Calls a task as soon as possible after returning, in its own event, with priority
 * over other events like animation, reflow, and repaint. An error thrown from an
 * event will not interrupt, nor even substantially slow down the processing of
 * other events, but will be rather postponed to a lower priority event.
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
module.exports = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    rawAsap(rawTask);
}

// We wrap tasks with recyclable task objects.  A task object implements
// `call`, just like a function.
function RawTask() {
    this.task = null;
}

// The sole purpose of wrapping the task is to catch the exception and recycle
// the task object after its single use.
RawTask.prototype.call = function () {
    try {
        this.task.call();
    } catch (error) {
        if (asap.onerror) {
            // This hook exists purely for testing purposes.
            // Its name will be periodically randomized to break any code that
            // depends on its existence.
            asap.onerror(error);
        } else {
            // In a web browser, exceptions are not fatal. However, to avoid
            // slowing down the queue of pending tasks, we rethrow the error in a
            // lower priority turn.
            pendingErrors.push(error);
            requestErrorThrow();
        }
    } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
    }
};

},{"./raw":17}],17:[function(require,module,exports){
(function (global){
"use strict";

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.
var BrowserMutationObserver = global.MutationObserver || global.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

// MessageChannels are desirable because they give direct access to the HTML
// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.

// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396

// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],18:[function(require,module,exports){
/**
 * Url class to handle URL properties
 * 
 * @version 1.2
 * @author Maxime Thirouin <maxime.thirouin@gmail.com>
 */

'use strict';

exports.__esModule = true;
(function () {
    var Url = function Url(url, useUTF8) {
        var urlNode;

        this.setUseUTF8(typeof useUTF8 != 'undefined' ? useUTF8 : Url.useUTF8);

        if (url) {
            var a = document.createElement('a');
            a.href = url;
            urlNode = a;
        } else {
            urlNode = window.location;
        }

        for (var i in this._urlAttributes) {
            this[this._urlAttributes[i]] = urlNode[this._urlAttributes[i]];
        }

        if (this.port == 0) {
            this.port = null;
        }

        if (this.search.length > 0) {
            this.query = this.parseQuery(this.search.substring(1));
        }

        this.query || (this.query = {});
    };

    Url.prototype._urlAttributes = ['protocol', 'host', 'port', 'pathname', 'search', 'hash', 'baseURI', 'hostname', 'href', 'hreflang', 'origin'];

    Url.prototype.parseQuery = function (queryString) {
        var values = {};
        var vars = queryString.split('&');

        if (vars.length > 0) {
            for (var i = 0; i < vars.length; i++) {
                if (typeof vars[i] == 'string' && vars[i] != '') {
                    var parts = vars[i].split('=');
                    if (parts.length > 0) {
                        //log('Decode: ', parts[0], this.decoder(parts[0]), parts[1], this.decoder(parts[1]));
                        values[this.decoder(parts[0])] = this.decoder(parts[1]).replace(/\+/g, ' ') || true;
                    }
                }
            }
        }

        return values;
    };

    Url.prototype.updateSearch = function () {
        var queryString = [];
        for (var key in this.query) {
            //log('Encode: ', key, this.encoder(key), this.query[key], this.encoder(this.query[key]));
            queryString.push(this.encoder(key) + '=' + this.encoder(this.query[key]));
        }
        this.search = '?' + queryString.join('&');

        return this;
    };

    /**
     * Get the filename *only* from the pathname
     * @author Austin White <austingym@gmail.com>
     */
    Url.prototype.filename = function () {
        return this.pathname.replace(/^.*[\\\/]/, '');
    };

    /**
     * Generate url from parameters
     * <protocol>//<host>[:<port>]/<pathname>[<search>][<hash>]
     */
    Url.prototype.toString = function () {
        this.updateSearch();
        return this.protocol + '//' + this.host + (this.port && this.port != 80 ? ':' + this.port : '') + this.pathname + this.search + this.hash;
    };

    // ENCODING solutions

    Url.useUTF8 = true;

    Url.prototype.setUseUTF8 = function (useUTF8) {
        this.useUTF8 = useUTF8;

        if (this.useUTF8) {
            this._encoder = encodeURIComponent;
            this._decoder = decodeURIComponent;
        } else {
            this._encoder = Url.encodeURIComponentISO;
            this._decoder = Url.decodeURIComponentISO;
        }

        this.encoder = function (s) {
            if (typeof s === "boolean") return "1";
            if (typeof s === "number") return s.toString();
            if (typeof s === "undefined") return "";

            s = s.replace(/ /g, "+");
            return this._encoder(s);
        };

        this.decoder = function (s) {
            s = s.replace(/\+/g, " ");
            return this._decoder(s);
        };
    };

    // encodeURIComponent() is the good function
    // // the problem is it works only for utf-8 content...
    // escape() is a good start for ISO, but I does not encode these characters:
    // * @ - _ + . /
    Url.encodeURIComponentISO = function (s) {
        return Url._encodeOrDecodeURIComponentISO(s, true);
    };

    Url.decodeURIComponentISO = function (s) {
        return Url._encodeOrDecodeURIComponentISO(s, false);
    };

    Url._encodeOrDecodeURIComponentISO = function (s, encode) {
        var fnBase = encode ? escape : unescape;
        // we use encode/decodeURIComponent because we know for the listed character the ISO en UTF8 are the same
        var fnComplementary = encode ? encodeURIComponent : decodeURIComponent;

        s = fnBase(s);

        $.each('* @ /'.split(' '), function (i, item) {
            s = s.replace(new RegExp('\\' + item, 'g'), fnComplementary(item));
        });

        return s;
    };

    window.Url = Url;
})();

exports.Url = Url;

},{}],19:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _userEs6 = require('./user.es6');

var _fetchEs6 = require('./fetch.es6');

/*!
 * ArmorGames JS API v0.3.1 (http://www.armorgames.com)
 * Copyright 2015 ArmorGames.
 * Author: Austin White, Michael Morrison
 * Licensed under the MIT license
 */

var ArmorGames = (function () {
    function ArmorGames(params) {
        _classCallCheck(this, ArmorGames);

        this.debug = true;

        this._user = null;
        this.game_id = params.game_id;

        this.adapter = new _fetchEs6.AGFetch(params);

        this.agi = params.agi;
        this.agi.v2.setVendor('website');
        this.agi.v2.setVendorElement(this);

        this._purchaseHandler = null;

        this.version = '0.3.1';
    }

    /**
     * Get authenticated user info
     * @example
     * authenticateUser().then(function(ArmorGamesUser) {});
     *
     * @return {Promise}
     */

    ArmorGames.prototype.authenticateUser = function authenticateUser() {
        var _this = this;

        var required = ['user_id', 'auth_token', 'api_key'];

        return this.adapter.get({
            endpoint: 'authenticate/user',
            required: required
        }).then(function (response) {
            _this.user = response.payload;
            return _this.user;
        });
    };

    /**
     * Get any user info
     * @param  {String} uid
     * @param  {Boolean} usernameFlag If true, specify username instead of a uid
     * @example
     * getUser(uid, usernameFlag).then(function(ArmorGamesUser) {});
     *
     * @return {Promise}
     */

    ArmorGames.prototype.getUser = function getUser(uid, usernameFlag) {
        var required = ['api_key'];

        var query = usernameFlag ? { username: true } : null;
        return this.adapter.get({
            endpoint: 'users/' + uid,
            required: required,
            query: query
        }).then(function (response) {
            return new _userEs6.ArmorGamesUser(response.payload);
        });
    };

    /**
     * Get friends of user by specifying a uid. Allows for pagination.
     * @param  {object} params Keys required: uid, limit, (offset|page)
     *     {String} uid
     *     {Integer} limit   Limit the number of users returned.
     *     {Integer} offset  Start the search at a specific number (50, 100, ...)
     *     {Integer} page    Use page *instead* of offset for simple pagination
     * @example
     * getFriends({uid, limit, offset}).then(function(friends) {});
     * getFriends({uid, limit, page}).then(function(friends) {});
     *
     * @return {Promise}
     */

    ArmorGames.prototype.getFriends = function getFriends(params) {
        var required = ['api_key'];

        var query = { limit: params.limit };

        if (typeof params.offset !== "undefined") {
            query.offset = params.offset;
        } else if (typeof params.page !== "undefined") {
            query.page = params.page;
        }

        return this.adapter.get({
            endpoint: 'friends/' + params.uid,
            required: required,
            query: query
        }).then(function (response) {
            var friends = response.payload;

            friends.map(function (friend) {
                return new _userEs6.ArmorGamesUser(friend);
            });

            return friends;
        });
    };

    /**
     * Retrieve a game save using a specified key.
     * @param  {String} key
     * @example
     * ag.retrieveGame(key).then(function (response) {
     *     var gameSave = response.payload[key];
     * });
     *
     * @return {Promise}|boolean false if error
     */

    ArmorGames.prototype.retrieveGame = function retrieveGame(key) {
        var required = ['api_key'];

        return this.adapter.get({
            endpoint: 'gamesave/' + this.adapter.user_id,
            required: required,
            query: { key: key }
        }).then(function (response) {
            if (typeof response.payload != 'undefined' && response.payload[key] && ArmorGames._isJSON(response.payload[key])) {
                var result = {};
                result[key] = JSON.parse(response.payload[key]);
                return result;
            }
            return false;
        });
    };

    /**
     * Save a game by specifying key/value.
     * @param  {String} key
     * @param  {object} value Can be any primitive type including array and object
     * @example
     * ag.saveGame('stats_level_1', {
     *     time: 532,
     *     kills: 27,
     *     completed: true
     * }).then(function(response) {
     *     var key = response.key;
     * });
     *
     * @return {Promise}|boolean false if error
     */

    ArmorGames.prototype.saveGame = function saveGame(key, value) {
        var required = ['auth_token', 'api_key'];

        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }

        return this.adapter.post({
            endpoint: 'gamesave/' + this.adapter.user_id,
            required: required,
            query: { key: key },
            options: {
                body: {
                    data: value
                }
            }
        }).then(function (response) {
            if (typeof response.payload != 'undefined') {
                return response.payload;
            }
            return false;
        });
    };

    /**
     * Erase a game save
     * @param  {String} key
     * @example
     * ag.eraseGame(key).then(function (response) {
     *     var gameSave = response[key];
     * });
     *
     * @return {Promise}|boolean false if error
     */

    ArmorGames.prototype.eraseGame = function eraseGame(key) {
        var required = ['auth_token', 'api_key'];

        return this.adapter['delete']({
            endpoint: 'gamesave/' + this.adapter.user_id,
            required: required,
            query: { key: key }
        }).then(function (response) {
            if (typeof response.payload != 'undefined') {
                return response.payload;
            }
            return false;
        });
    };

    /**
     * Show storefront
     * @param {String} Product SKU (optional). If none, show all products in the
     *                 storefront.
     */

    ArmorGames.prototype.showStorefront = function showStorefront(sku) {
        if (typeof this.agi === 'undefined') {
            alert("AGI must be loaded and accessible.");
            return false;
        }

        var payload = {};
        if (sku) {
            payload.sku = sku;
        }

        this.agi.v2.sendMessage({
            "action": "showStorefront",
            "payload": payload
        });
    };

    /**
     * Set purchase handler
     * @param {Function} Callback function to respond to payment completion
     * @todo Unit test
     */

    ArmorGames.prototype.setPurchaseHandler = function setPurchaseHandler(callback) {
        this.agi.v2._registerCallback('completePurchase', callback);
        this.agi.v2._registerCallback('cancelPurchase', callback);
    };

    /**
     * Complete purchase. Called by the Armor Games server, not developer.
     * @param {Object} Payload from AGI Payment Processor
     * @todo Unit test
     */

    ArmorGames.prototype._completePurchase = function _completePurchase(payload) {
        if (this._purchaseHandler) {
            this.agi.v2.sendMessage({ "action": "hideStorefront" });
            this._purchaseHandler(payload);
        }
    };

    /**
     * Retrieve all the purchases made by the user.
     *
     * The return is an array of all products available to the game, and each element
     * of the array has two objects, "product" and "purchase".  "Product" contains
     * details about the product itself, and "purchase" has details about the user's
     * purchase or lack of purchase.  For instance, you can check:
     * purchase.success (boolean) to see if the user has purchased the product.
     * If it's a consumable, you can check purchase.data (int) to see how many
     * they currently have of that consumable.
     *
     * @return {Promise}
     */

    ArmorGames.prototype.retrievePurchases = function retrievePurchases() {
        var required = ["api_key"];
        var query = {};

        query.game_id = this.adapter.game_id;

        return this.adapter.get({
            endpoint: 'products/user/' + this.adapter.user_id,
            required: required,
            query: query
        }).then(function (response) {
            if (Array.isArray(response.payload) && response.payload.length > 0) {
                response = response.payload;
            } else {
                response = new Array();
            }
            return response;
        }, function (error) {
            return false;
        });
    };

    /**
     * Retrieve a single purchase made by the user.
     *
     * @param {String} sku The product sku string.
     * @return {Promise}|boolean false on error
     */

    ArmorGames.prototype.retrievePurchase = function retrievePurchase(sku) {
        var required = ["api_key"];

        var query = {};

        query.sku = sku;
        query.game_id = this.adapter.game_id;

        return this.adapter.get({
            endpoint: 'products/user/' + this.adapter.user_id,
            required: required,
            query: query
        }).then(function (response) {
            if (Array.isArray(response.payload) && response.payload.length == 1) {
                response = response.payload[0];
            }
            return response;
        }, function (error) {
            return false;
        });
    };

    /**
     * Consume a specified quantity of a purchased item.
     * @param  {String} sku       The product sku string.
     * @param  {Integer} quantity Quantity of the product to consume. If positive,
     *                            the quantity will be decremented from the total
     *                            ("consume"). If negative, the quantity will be
     *                            replenished to the user.
     * @return {Promise}
     */

    ArmorGames.prototype.consume = function consume(sku, quantity) {
        var required = ["api_key"];
        var query = {};

        if (quantity < 0) {
            query.increment = "true";
            query.qty = quantity * -1;
        } else if (quantity > 0) {
            query.decrement = "true";
            query.qty = quantity;
        } else {
            return false;
        }

        query.sku = sku;
        query.game_id = this.adapter.game_id;

        return this.adapter.put({
            endpoint: 'products/user/' + this.adapter.user_id,
            required: required,
            query: query
        }).then(function (response) {
            if (typeof response.payload != 'undefined' && typeof response.payload.purchase != 'undefined') {
                var result = {};
                result.purchase = response.payload.purchase;
                result.product = response.payload.product;
                return result;
            }
            return false;
        }, function (error) {
            return false;
        });
    };

    ArmorGames.prototype.retrieveQuests = function retrieveQuests() {
        var required = ["api_key"];
        var query = {};

        return this.adapter.get({
            endpoint: 'achievements/user/' + this.adapter.user_id,
            required: required,
            query: query
        }).then(function (response) {
            if (typeof response.payload != 'undefined') {
                var result = response.payload;
                return result;
            }
            return false;
        }, function (error) {
            return false;
        });
    };

    ArmorGames.prototype.submitQuest = function submitQuest(key, progress) {
        var _this2 = this;

        var required = ["api_key"];
        var query = {};

        query.progress = progress;
        query.developer_id = key;
        query.pid = this.game_id;

        return this.adapter.put({
            endpoint: 'achievements/user/' + this.adapter.user_id,
            required: required,
            query: query
        }).then(function (response) {
            if (typeof response.payload != 'undefined') {
                _this2.agi.v2.sendMessage({ "action": "questUpdate", "payload": response });
                var result = response.payload;
                return result;
            }
            return false;
        });
    };

    ArmorGames.prototype.resetQuest = function resetQuest(key) {
        var _this3 = this;

        var required = ["api_key"];
        var query = {};

        query.reset = 1;
        query.developer_id = key;
        query.pid = this.game_id;

        return this.adapter.put({
            endpoint: 'achievements/user/' + this.adapter.user_id,
            required: required,
            query: query
        }).then(function (response) {
            if (typeof response.payload != 'undefined') {
                _this3.agi.v2.sendMessage({ "action": "questUpdate", "payload": response });
                var result = response.payload;
                return result;
            }
            return false;
        }, function (error) {
            return false;
        });
    };

    /**
     * Test if str is valid JSON
     * @param  {String}  str
     * @return {Boolean}
     */

    ArmorGames._isJSON = function _isJSON(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };

    _createClass(ArmorGames, [{
        key: 'user',
        set: function set(properties) {
            this._user = new _userEs6.ArmorGamesUser(properties);
        },
        get: function get() {
            return this._user;
        }
    }]);

    return ArmorGames;
})();

exports.ArmorGames = ArmorGames;

if (typeof window !== 'undefined') {
    window.ArmorGames = ArmorGames;
}

},{"./fetch.es6":20,"./user.es6":22}],20:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var fetch = require('isomorphic-fetch');
require('es6-promise').polyfill();

var Promise = require('promise');
var PromiseRetryer = require('promise-retryer')(Promise);
var md5 = require('blueimp-md5').md5;
var Url = require('./Url').Url;

/*!
 * AGFetch is responsible for handling requests and reponses from Armor Games
 * Copyright 2015 ArmorGames.
 * Author: Austin White, Michael Morrison
 * Licensed under the MIT license
 */

var AGFetch = (function () {

    /**
     * Initialize AGFetch with some parameters that are needed for requests
     * @param  {object} params Keys required: user_id, auth_token, api_key, game_id, env
     * @return {AGFetch}
     */

    function AGFetch(params) {
        _classCallCheck(this, AGFetch);

        this._debug = false;

        this.user_id = params.user_id;
        this.auth_token = params.auth_token;
        this.api_key = params.api_key;
        this.game_id = params.game_id;
        this.env = params.env || 'production';

        this.sign = {};

        this._responseType = 'json';

        this.defaultOptions = {
            mode: 'cors',
            headers: {
                'Accept': 'application/json'
            }
        };

        return this;
    }

    /**
     * Host names for Armor Games API servers
     * @type {Object}
     */

    /**
     * Make a GET request to the Armor Games API
     * @param  {object} params {
     *                             endpoint: '',
     *                             required: [],
     *                             query: {},
     *                             options: {}
     *                         }
     * @return {Promise}       Returns a promise wrapping results from the
     *                         server using ES6 fetch() api
     */

    AGFetch.prototype.get = function get(params) {
        var path = this.constructPath(params.endpoint);

        path = this._compileQuery(path, params.required, params.query);

        var options = params.options || {};
        options.method = 'get';
        options = AGFetch.mergeObjects(this.defaultOptions, options);
        return fetch(path.toString(), options).then(this._retryCheck).then(this._catchErrors).then(AGFetch.readJSON).then(this._catchAppErrors);
    };

    /**
     * Make a POST request to the Armor Games API
     * @param  {object} params {
     *                             endpoint: '',
     *                             required: [],
     *                             query: {},
     *                             options: {
     *                                 body: new FormData(...),
     *                                 ...
     *                             }
     *                         }
     * @return {Promise}       Returns a promise wrapping results from the
     *                         server using ES6 fetch() api
     */

    AGFetch.prototype.post = function post(params) {
        var options = params.options || {};
        options.method = 'post';
        params.options = options;

        return this._requestWithBody(params);
    };

    /**
     * Make a PUT request to the Armor Games API
     * @param  {object} params {
     *                             endpoint: '',
     *                             required: [],
     *                             query: {},
     *                             options: {
     *                                 body: new FormData(...),
     *                                 ...
     *                             }
     *                         }
     * @return {Promise}       Returns a promise wrapping results from the
     *                         server using ES6 fetch() api
     */

    AGFetch.prototype.put = function put(params) {
        var options = params.options || {};
        options.method = 'post';
        params.options = options;
        params.query.method = 'put';

        return this._requestWithBody(params);
    };

    /**
     * Make a DELETE request to the Armor Games API
     * @param  {object} params {
     *                             endpoint: '',
     *                             required: [],
     *                             query: {},
     *                             options: {
     *                                 body: new FormData(...),
     *                                 ...
     *                             }
     *                         }
     * @return {Promise}       Returns a promise wrapping results from the
     *                         server using ES6 fetch() api
     */

    AGFetch.prototype['delete'] = function _delete(params) {
        var options = params.options || {};
        options.method = 'post';
        params.options = options;
        params.query.method = 'delete';

        return this._requestWithBody(params);
    };

    /**
     * Private method to request the Armor Games API with request body content
     * @param  {object} params {
     *                             endpoint: '',
     *                             required: [],
     *                             query: {},
     *                             options: {
     *                                 body: new FormData(...),
     *                                 ...
     *                             }
     *                         }
     * @return {Promise}       Returns a promise wrapping results from the
     *                         server using ES6 fetch() api
     */

    AGFetch.prototype._requestWithBody = function _requestWithBody(params) {
        var _this = this;

        var path = this.constructPath(params.endpoint);

        path = this._compileQuery(path, params.required, params.query);

        var options = params.options || {};
        options = AGFetch.mergeObjects(this.defaultOptions, options);
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';

        var bodyCopy = options.body;
        if (options.body && typeof options.body !== 'string') {
            options.body = AGFetch.serialize(options.body);
        }

        return PromiseRetryer.run({
            debug: this._debug,
            delay: function delay(attempt) {
                return attempt * 100; // 0.1s, 0.2s, 0.3s...
            },
            maxRetries: 3,
            promise: function promise(attempt) {
                if (_this.havePartialSignature()) {
                    _this.sign.sig = _this.signIt(path, bodyCopy);

                    path.query.sig = _this.sign.sig;
                    path.query.session = _this.sign.session;
                    path.updateSearch();

                    // No need to keep the key around
                    delete _this.sign.key;
                }

                return fetch(path.toString(), options).then(function (response) {
                    return _this._catchErrors(response, _this);
                }).then(AGFetch.readJSON).then(_this._catchAppErrors).then(_this.sign = {});
            }
        });
    };

    /**
     * Construct a URI.js object representing a path to Armor Games API
     * @param  {String} endpoint e.g. 'authenticate/user', 'friends/{user_id}'
     * @return {URI}             URI.js path object
     */

    AGFetch.prototype.constructPath = function constructPath(endpoint) {
        var https = 'http';
        if (this.env == 'production') {
            var https = 'https';
        }
        var url = https + "://" + AGFetch.API_HOST[this.env];
        url += "/" + AGFetch.API_PATH;
        url += "/" + AGFetch.API_VERSION;
        url += "/" + endpoint + '.' + this._responseType;

        return new Url(url);
    };

    /**
     * Compile all parameters into query string variables
     * @param  {URI} path
     * @param  {array} required  List of required fields to be included
     * @param  {object} query    Object map of variables to add to query string
     * @return {URI}             Return the URI object back
     */

    AGFetch.prototype._compileQuery = function _compileQuery(path, required, query) {

        for (var k in required) {
            path.query[required[k]] = this[required[k]];
        }

        for (var k in query) {
            path.query[k] = query[k];
        }

        path.updateSearch();

        return path;
    };

    /**
     * Catch potential errors and throw exceptions based on responses from the
     * server. Special case when a 401 response is returned, indicating the
     * request needs to be signed. This method will handle retrieving the
     * signing variables (session, key) and assigning them to the object to be
     * used in the next request to generate a signature.
     * @param  {object}  response Response from the server
     * @param  {object}  thisObj  Reference back to the object instance to
     *                            assign the signing variables to.
     * @return {Promise}          Return the resolved or rejected Promise.
     */

    AGFetch.prototype._catchErrors = function _catchErrors(response, thisObj) {

        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
        } else {
            if (response.status === 401) {
                return Promise.resolve(response).then(AGFetch.readJSON).then(function (jsonResponse) {
                    if (jsonResponse.payload && jsonResponse.payload.session && jsonResponse.payload.key) {
                        thisObj.sign.session = jsonResponse.payload.session;
                        thisObj.sign.key = jsonResponse.payload.key;
                    }
                });
            } else {
                return Promise.reject(response);
            }
        }
    };

    /**
     * Catch errors that are disguised in HTTP 200 (success) response codes.
     * @param  {object} response
     * @throws {object} Throws the response if there is an error detected.
     * @return {object} Returns the response if all is ok.
     */

    AGFetch.prototype._catchAppErrors = function _catchAppErrors(response) {
        if (response.code === 200 && typeof response.message !== 'undefined' && (response.payload === null || typeof response.payload === 'undefined')) {
            // Response is a 200 indicating success, but is actually a failure
            throw response;
        } else {
            return response;
        }
    };

    /**
     * Does this instance have signing variables present?
     * @return {bool}
     */

    AGFetch.prototype.havePartialSignature = function havePartialSignature() {
        return this.sign.session && this.sign.key && !this.sign.sig;
    };

    /**
     * Does this instance have a signature?
     * @return {bool}
     */

    AGFetch.prototype.haveSignature = function haveSignature() {
        return !!this.sign.sig;
    };

    /**
     * Sign the request using the following algorithm:
     * 1. Compile array of request variables:
     *      Secret key,
     *      session,
     *      key,
     *      {request body} fields,
     *      {request filename} e.g. authenticate/user.json,
     *      [query string parameters...]
     * 2. Convert all elements to a string
     * 3. Sort the array in ascending order
     * 4. Concatenate the array into a string
     * 5. Lowercase the string
     * 6. md5() the string
     *
     * @param  {URI}    path The request path object
     * @param  {object} body The request body object
     * @return {String}      md5() hash
     */

    AGFetch.prototype.signIt = function signIt(path, body) {
        if (!this.havePartialSignature()) {
            throw "Signature values required.";
        }

        var params = path.query;

        // Step 1
        var values = [];

        for (var k in params) {
            if (k !== 'sig') values.push(params[k]);
        }

        values.push(atob('U2hpZWxkMg=='));

        values.push(this.sign.session);

        values.push(this.sign.key);

        for (var b in body) {
            values.push(body[b]);
        }

        values.push(path.filename());

        // Step 2
        for (var k in values) {
            values[k] = values[k].toString();
        }

        // Step 3
        values.sort();

        // Step 4 & 5
        var joined = values.join('').toLowerCase();

        // Step 6
        var hash = md5(joined);

        return hash;
    };

    /**
     * Merge two objects together. Note: Key priority given to the second object
     * @param  {object} obj1
     * @param  {object} obj2
     * @return {object}
     */

    AGFetch.mergeObjects = function mergeObjects(obj1, obj2) {
        var newObj = {};
        for (var attrName in obj1) {
            newObj[attrName] = obj1[attrName];
        }
        for (var attrName in obj2) {
            newObj[attrName] = obj2[attrName];
        }

        return newObj;
    };

    /**
     * Serialize an object into request body format (application/x-www-form-urlencoded)
     * @param  {object} obj
     * @return {String} Serialized string (e.g. data=%7B%22time%22%3A532%2C%22score%22%3A27%2C%22completed%22%3Atrue%7D)
     */

    AGFetch.serialize = function serialize(obj) {
        var str = [];
        for (var p in obj) if (obj.hasOwnProperty(p) && typeof obj[p] !== 'undefined') {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
    };

    /**
     * Read JSON from the response.
     * @param  {object} response
     * @return {Promise} Unresolved Promise
     */

    AGFetch.readJSON = function readJSON(response) {
        if (response) {
            return response.clone().json()['catch'](function () {
                return response.text();
            });
        } else {
            throw "Cannot read response.";
        }
    };

    return AGFetch;
})();

AGFetch.API_HOST = {
    dev: 'dev.services.armorgames.com',
    stage: 'services-stage.armorgames.com',
    production: 'services.armorgames.com'
};

/**
 * Path to the API
 * @type {String}
 */
AGFetch.API_PATH = 'services/rest';

/**
 * API version to use
 * @type {String}
 */
AGFetch.API_VERSION = 'v1';

exports.AGFetch = AGFetch;

if (typeof window !== 'undefined') {
    window.AGFetch = AGFetch;
}

},{"./Url":18,"blueimp-md5":1,"es6-promise":2,"isomorphic-fetch":4,"promise":8,"promise-retryer":6}],21:[function(require,module,exports){
/**
 * Url class to handle URL properties
 * 
 * @version 1.2
 * @author Maxime Thirouin <maxime.thirouin@gmail.com>
 */

'use strict';

exports.__esModule = true;
(function () {
    var Url = function Url(url, useUTF8) {
        var urlNode;

        this.setUseUTF8(typeof useUTF8 != 'undefined' ? useUTF8 : Url.useUTF8);

        if (url) {
            var a = document.createElement('a');
            a.href = url;
            urlNode = a;
        } else {
            urlNode = window.location;
        }

        for (var i in this._urlAttributes) {
            this[this._urlAttributes[i]] = urlNode[this._urlAttributes[i]];
        }

        if (this.port == 0) {
            this.port = null;
        }

        if (this.search.length > 0) {
            this.query = this.parseQuery(this.search.substring(1));
        }

        this.query || (this.query = {});
    };

    Url.prototype._urlAttributes = ['protocol', 'host', 'port', 'pathname', 'search', 'hash', 'baseURI', 'hostname', 'href', 'hreflang', 'origin'];

    Url.prototype.parseQuery = function (queryString) {
        var values = {};
        var vars = queryString.split('&');

        if (vars.length > 0) {
            for (var i = 0; i < vars.length; i++) {
                if (typeof vars[i] == 'string' && vars[i] != '') {
                    var parts = vars[i].split('=');
                    if (parts.length > 0) {
                        //log('Decode: ', parts[0], this.decoder(parts[0]), parts[1], this.decoder(parts[1]));
                        values[this.decoder(parts[0])] = this.decoder(parts[1]).replace(/\+/g, ' ') || true;
                    }
                }
            }
        }

        return values;
    };

    Url.prototype.updateSearch = function () {
        var queryString = [];
        for (var key in this.query) {
            //log('Encode: ', key, this.encoder(key), this.query[key], this.encoder(this.query[key]));
            queryString.push(this.encoder(key) + '=' + this.encoder(this.query[key]));
        }
        this.search = '?' + queryString.join('&');

        return this;
    };

    /**
     * Get the filename *only* from the pathname
     * @author Austin White <austingym@gmail.com>
     */
    Url.prototype.filename = function () {
        return this.pathname.replace(/^.*[\\\/]/, '');
    };

    /**
     * Generate url from parameters
     * <protocol>//<host>[:<port>]/<pathname>[<search>][<hash>]
     */
    Url.prototype.toString = function () {
        this.updateSearch();
        return this.protocol + '//' + this.host + (this.port && this.port != 80 ? ':' + this.port : '') + this.pathname + this.search + this.hash;
    };

    // ENCODING solutions

    Url.useUTF8 = true;

    Url.prototype.setUseUTF8 = function (useUTF8) {
        this.useUTF8 = useUTF8;

        if (this.useUTF8) {
            this._encoder = encodeURIComponent;
            this._decoder = decodeURIComponent;
        } else {
            this._encoder = Url.encodeURIComponentISO;
            this._decoder = Url.decodeURIComponentISO;
        }

        this.encoder = function (s) {
            if (typeof s === "boolean") return "1";
            if (typeof s === "number") return s.toString();
            if (typeof s === "undefined") return "";

            s = s.replace(/ /g, "+");
            return this._encoder(s);
        };

        this.decoder = function (s) {
            s = s.replace(/\+/g, " ");
            return this._decoder(s);
        };
    };

    // encodeURIComponent() is the good function
    // // the problem is it works only for utf-8 content...
    // escape() is a good start for ISO, but I does not encode these characters:
    // * @ - _ + . /
    Url.encodeURIComponentISO = function (s) {
        return Url._encodeOrDecodeURIComponentISO(s, true);
    };

    Url.decodeURIComponentISO = function (s) {
        return Url._encodeOrDecodeURIComponentISO(s, false);
    };

    Url._encodeOrDecodeURIComponentISO = function (s, encode) {
        var fnBase = encode ? escape : unescape;
        // we use encode/decodeURIComponent because we know for the listed character the ISO en UTF8 are the same
        var fnComplementary = encode ? encodeURIComponent : decodeURIComponent;

        s = fnBase(s);

        $.each('* @ /'.split(' '), function (i, item) {
            s = s.replace(new RegExp('\\' + item, 'g'), fnComplementary(item));
        });

        return s;
    };

    window.Url = Url;
})();

exports.Url = Url;

},{}],22:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ArmorGamesUser = function ArmorGamesUser(properties) {
    _classCallCheck(this, ArmorGamesUser);

    for (var k in properties) this[k] = properties[k];
};

exports.ArmorGamesUser = ArmorGamesUser;

},{}]},{},[19,20,22,21])
//# sourceMappingURL=ag.js.map
