var ROOM_START = 0;
var ROOM_PLAY = 1;
var ROOM_MENU = 2;
var ROOM_ACH = 3;
var ROOM_LOGO = 4;
var room = ROOM_LOGO;
var firstTime = true;

var money = 0//+3847192084;
var prestige = 0;

var incrInitialRadius;// = 8;
var incrInitial;// = 10//10;
var incrMultiplier;// = 1.1;
var incrRadius;// = 28//32;
var incrNumber;// = 20//30;
var incrLifetime;// = 100//240;
var incrSpeed;// = 3//2;

var incrMultiplierProgress = 0;
var incrRadiusProgress = 0;
var incrNumberProgress = 0;
var incrLifetimeProgress = 0;

function initialize() {
    incrInitialRadius = 9;
    incrInitial = 10//10;
    incrMultiplier = 1.1;
    incrRadius = 28//32;
    incrNumber = 20//30;
    incrLifetime = 100//240;
    incrSpeed = 3//2;

    incrMultiplierProgress = 0;
    incrRadiusProgress = 0;
    incrNumberProgress = 0;
    incrLifetimeProgress = 0;

    money = 0;
}

initialize();

var shopRainbow = !false;
var shopRed = true;
// ...
var diskColor = { r: 250, g: 50, b: 50 };

var MUSIC = true;
var musicClicked = false;
var musicLoaded = false;
var music = new Audio();
music.src = "src/music.mp3";
music.oncanplaythrough = function () {
    if (music.paused || music.currentTime === 0) {
        musicLoaded = true;
        music.loop = true;
        //music.play();

        if (MUSIC) {
            music.volume = 1;
        } else {
            music.volume = 0;
        }
    }
};

window.addEventListener("mousedown", function (event) {
    if (musicLoaded && !musicClicked) {
        musicClicked = true;
        music.play();
    }
});

function gameloop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (room === ROOM_LOGO) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        armorGames.drawSplash(1.0, mousePressed, function () {
        //armorGames.playVideo(1.0, mousePressed, function () {
            if (firstTime) {
                gotoRoomPlay();
            } else {
                gotoRoomMenu();
            }
        });

        updateInput();
        window.requestAnimationFrame(gameloop);
        return;
    }

    switch (room) {
        case ROOM_START:
            loopRoomStart();
            break;

        case ROOM_PLAY:
            loopRoomPlay();
            break;

        case ROOM_MENU:
            loopRoomMenu();
            break;

        case ROOM_ACH:
            loopRoomAch();
            break;
    }

    updateInput();
    window.requestAnimationFrame(gameloop);
}

var kongApi;

window.addEventListener("load", function () {
    if (!armorGames.siteLock()) {
        return;
    }

    resizeHandler();

    loadKongregateApi(function (api) {
        kongApi = api;
        loadGameState();
        submitStats();
        window.requestAnimationFrame(gameloop);

        canvas.style.backgroundColor = "rgb(240, 240, 240)";

        /*
        if (firstTime) {
            gotoRoomPlay();
        } else {
            gotoRoomMenu();
        }
        */
    });
});

window.addEventListener("resize", resizeHandler);

var roomFadeState = 0;
var roomFadeValue = 0;

function drawFrame() {
    ctx.strokeStyle = "black";
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 7;
    ctx.strokeRect(areaX - areaPadding, areaY - areaPadding, areaWidth + 2 * areaPadding, areaHeight + 2 * areaPadding);
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgb(40, 40, 40)";
    ctx.fillRect(0, 0, canvas.width, areaY - areaPadding);
    ctx.fillRect(0, areaY - areaPadding, areaBorder - areaPadding, areaHeight + 2 * areaPadding);
    ctx.fillRect(areaX + areaWidth + areaPadding, areaY - areaPadding, areaBorder - areaPadding, areaHeight + 2 * areaPadding);
    ctx.fillRect(0, areaY + areaHeight + areaPadding, canvas.width, canvas.height - areaY - areaHeight - areaPadding);

    var mx = canvas.width - 70;
    var my = canvas.height - 45;
    if (MUSIC) {
        ctx.fillStyle = "rgb(100, 100, 100)";
    } else {
        ctx.fillStyle = "rgb(100, 100, 100)";
    }
    if (mouseInBox(mx, my, 32, 32)) {
        ctx.fillStyle = "rgb(220, 220, 220)";
        if (mousePressed) {
            toggleMusic();
        }
    }
    ctx.strokeStyle = ctx.fillStyle;
    drawMusicIcon(mx, my);

    ctx.font = "42px gamefont, sans-serif";
    ctx.textAlign = "right";
    ctx.fillStyle = "rgb(220, 220, 220)";
    ctx.fillText("$" + formatMoney(money), canvas.width - 35, 55);
}

function drawTransition(callback) {
    if (roomFadeState === 0) return;

    var sx = roomFadeState === 1 ? canvas.width + 1 - roomFadeValue : -roomFadeValue;

    ctx.fillStyle = "rgb(60, 60, 60)";
    ctx.fillRect(sx, areaY - areaPadding, canvas.width, areaHeight + 2 * areaPadding);
    roomFadeValue += (canvas.width - roomFadeValue) / 6;

    if (roomFadeValue > canvas.width - 10) {
        var prev = roomFadeState;
        roomFadeState = 0;
        roomFadeValue = 0;
        if (prev === 1) {
            callback();
        }
    }

    ctx.fillStyle = "rgb(40, 40, 40)";
    ctx.fillRect(0, areaY - areaPadding, areaBorder - areaPadding, areaHeight + 2 * areaPadding);
    ctx.fillRect(areaX + areaWidth + areaPadding, areaY - areaPadding, areaBorder - areaPadding, areaHeight + 2 * areaPadding);
}

function saveGameState() {
    if (!hasLocalStorage) {
        return;
    }

    var data = {
        money: money,
        prestige: prestige,

        multiplier_progress: incrMultiplierProgress,
        radius_progress: incrRadiusProgress,
        number_progress: incrNumberProgress,
        lifetime_progress: incrLifetimeProgress,

        initial_radius: incrInitialRadius,
        initial: incrInitial,
        multiplier: incrMultiplier,
        radius: incrRadius,
        number: incrNumber,
        lifetime: incrLifetime,
        speed: incrSpeed,

        achnone: achNone,
        achall: achAll,

        chain_record: chainRecord,

        music: MUSIC,
    };

    var text = JSON.stringify(data);
    setLocalStorage("incrpop_save", text);
}

function loadGameState() {
    if (!hasLocalStorage) {
        return;
    }

    var text = getLocalStorage("incrpop_save");
    if (!text) {
        return;
    }

    try {
        var data = JSON.parse(text);

        money = data.money;
        prestige = data.prestige;

        incrMultiplierProgress = data.multiplier_progress;
        incrRadiusProgress = data.radius_progress;
        incrNumberProgress = data.number_progress;
        incrLifetimeProgress = data.lifetime_progress;

        incrInitialRadius = data.initial_radius;
        incrInitial = data.initial;
        incrMultiplier = data.multiplier;
        incrRadius = data.radius;
        incrNumber = data.number;
        incrLifetime = data.lifetime;
        incrSpeed = data.speed;

        achNone = data.achnone;
        achAll = data.achall;

        chainRecord = data.chain_record;

        firstTime = false;

        MUSIC = data.music;
        if (musicLoaded) {
            if (MUSIC) {
                music.volume = 1;
            } else {
                music.volume = 0;
            }
        }
    } catch (err) {
        // unable to load data
    }
}

function submitStats() {
    var total = 0;
    total += incrMultiplierProgress;
    total += incrRadiusProgress;
    total += incrNumberProgress;
    total += incrLifetimeProgress;
    if (prestige > 0) {
        total += 4 * 10;
    }

    var achCount = 0;
    for (var i = 0; i < achs.length; i++) {
        var ach = achs[i];
        if (ach.done()) {
            achCount += 1;
        }
    }

    kongApi.submitStat("Completion", (achCount === 5) ? 1 : 0);
    kongApi.submitStat("Progress", total);
    kongApi.submitStat("Chain", chainRecord);
    kongApi.submitStat("Achievements", achCount);
}
