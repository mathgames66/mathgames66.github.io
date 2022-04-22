var armorGames = {};
armorGames.images = {};
armorGames.splashAlpha = -0.5;
armorGames.video = null;
armorGames.startedVideo = false;

window.addEventListener("load", function () {
    armorGames.loadImage("hor_black", "src/armorgames/armorgames_hor_black.png");
    armorGames.loadImage("hor_white", "src/armorgames/armorgames_hor_white.png");
    armorGames.loadImage("ver_black", "src/armorgames/armorgames_ver_black.png");
    armorGames.loadImage("ver_white", "src/armorgames/armorgames_ver_white.png");
    armorGames.loadImage("fb_black", "src/armorgames/armorgames_fb_black.png");
    armorGames.loadImage("fb_white", "src/armorgames/armorgames_fb_white.png");
    armorGames.loadImage("shield_white", "src/armorgames/armorgames_shield_white.png");
    armorGames.loadVideo("src/armorgames/armorgames_video.webm");
});

armorGames.imagesLoaded = function () {
    return armorGames.images["hor_black"] && armorGames.images["hor_white"] &&
        armorGames.images["ver_black"] && armorGames.images["ver_white"] &&
        armorGames.images["fb_black"] && armorGames.images["fb_white"];
};

armorGames.loadVideo = function (src) {
    var video = document.createElement("video");
    video.autoplay = false;
    video.oncanplaythrough = function () {
        armorGames.video = video;
    }
    video.src = src;
};

armorGames.loadImage = function (name, src) {
    var image = new Image();
    image.onload = function () {
        armorGames.images[name] = image;
    }
    image.src = src;
};

armorGames.drawImage = function (name, x, y, s) {
    if (!armorGames.images[name]) return;
    var img = armorGames.images[name];
    var w = img.naturalWidth;
    var h = img.naturalHeight;
    ctx.drawImage(img, 0, 0, w, h, x, y, w*s, h*s);
};

armorGames.drawImageClickable = function (name, x, y, s, mouseX, mouseY, mousePressed, noeffect) {
    if (!armorGames.images[name]) return;
    var img = armorGames.images[name];
    var w = img.naturalWidth;
    var h = img.naturalHeight;
    var ws = w*s;
    var hs = h*s;
    var hover = x <= mouseX && mouseX < x + ws && y <= mouseY && mouseY < y + hs;

    if (hover && !noeffect) {
        es = 0.05;
        s += es;
        x -= w*es/2;
        y -= h*es/2;
    }

    ctx.drawImage(img, 0, 0, w, h, x, y, w*s, h*s);

    if (hover && mousePressed) {
        var link = name.indexOf("fb") < 0 ? "http://armor.ag/MoreGames" : "http://www.facebook.com/ArmorGames";
        window.open(link, "_blank");
    }
};

armorGames.playVideo = function (s, mousePressed, callback) {
    if (!armorGames.video) return;

    var vid = armorGames.video;

    if (!armorGames.startedVideo) {
        armorGames.startedVideo = true;
        var onended = function () {
            vid.removeEventListener("ended", onended);
            callback();
        };
        vid.addEventListener("ended", onended);
        vid.play();
    }

    var w = vid.videoWidth;
    var h = vid.videoHeight;

    var ww = w*s;
    var hh = h*s;
    var xx = canvas.width/2-ww/2;
    var yy = canvas.height/2-hh/2;

    ctx.drawImage(vid, 0, 0, w, h, xx, yy, ww, hh);

    if (mousePressed) {
        window.open("http://armor.ag/MoreGames", "_blank");
    }
};

armorGames.drawSplash = function (s, mousePressed, callback) {
    var image = "ver_black";
    if (!armorGames.images[image]) return;

    var img = armorGames.images[image];
    var w = img.naturalWidth;
    var h = img.naturalHeight;

    var ww = w*s;
    var hh = h*s;
    var xx = canvas.width/2-ww/2;
    var yy = canvas.height/2-hh/2;

    var a = armorGames.splashAlpha;
    var t = 4;
    if (armorGames.splashAlpha >= t) {
        a = (t + 1) - armorGames.splashAlpha;
    }

    var alpha = ctx.globalAlpha;
    ctx.globalAlpha = Math.max(0, Math.min(a, 1));
    ctx.drawImage(img, 0, 0, w, h, xx, yy, ww, hh);
    ctx.globalAlpha = alpha;

    if (mousePressed) {
        window.open("http://armor.ag/MoreGames", "_blank");
    }

    armorGames.splashAlpha += 0.03;
    if (armorGames.splashAlpha > (t + 1 + 0.7) && armorGames.splashAlpha < 99) {
        armorGames.splashAlpha = 100;
        callback();
    }
};

armorGames.siteLock = function () {
    var hostname = location.hostname;
    if (hostname === "" || hostname === "localhost") return true;
    var names = [
        "armorgames.com",
        "http://games.armorgames.com",
        "http://preview.armorgames.com",
        "http://cache.armorgames.com",
        "http://cdn.armorgames.com",
        "http://gamemedia.armorgames.com",
        "http://files.armorgames.com",
        "https://games.armorgames.com",
        "https://preview.armorgames.com",
        "https://cache.armorgames.com",
        "https://cdn.armorgames.com",
        "https://gamemedia.armorgames.com",
        "https://files.armorgames.com",
    ];
    for (var i = 0; i < names.length; i++) {
        if (hostname.indexOf(names[i]) >= 0) {
            return true;
        }
    }
    return false;
};
