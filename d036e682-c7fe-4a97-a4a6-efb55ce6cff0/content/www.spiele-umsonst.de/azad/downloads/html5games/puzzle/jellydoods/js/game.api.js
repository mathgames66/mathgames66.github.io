///////////////////////////////////////////////////////////////////////////////
// file game.api.js
// Copyright (c) 2015 Frédéric J. Rézeau. All rights reserved.
///////////////////////////////////////////////////////////////////////////////

(function (namespace, undefined) {
    "use strict";

    namespace.isDesktop = function () {
        return categorizr.isDesktop ? true : false;
    };

})(window.OkijinAPI = window.OkijinAPI || {});

