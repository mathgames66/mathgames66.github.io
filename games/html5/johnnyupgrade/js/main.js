var zoomFactor = 1.1;
var screenWidth = 800;
var screenHeight = 600;
var levelScreenWidth = 800 * zoomFactor;
var levelScreenHeight = 600 * zoomFactor;
var rotDevice;
var world;
var levl = 0;
var mu;
var vol = 1;
var ld;
var wait = 0;
var clickFX;

function addFocusAndDesktopDetection() {
    game.input.onDown.add(function(e) {
        if (e.isMouse) {
            game.device.desktop = true;
        }
        window.self.focus();
    }, this);
    game.input.keyboard.onDownCallback = function(e) {
        game.device.desktop = true;
    };
}
var MainState = {
    preload: function() {
        addFocusAndDesktopDetection();
        world = this;
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
        game.input.keyboard.createCursorKeys();
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        game.stage.backgroundColor = "#000000";
        game.load.image('black', 'assets/pics/black.gif');
        game.load.image('rotateDevice', 'assets/pics/rotateDevice.png');
        game.load.image('CoolmathGamesLogo', 'assets/pics/CoolmathGamesLogo.jpg');
        game.load.image('loading1', 'assets/pics/loading1.png');
        game.load.image('preloadBar', 'assets/pics/preloadBar.gif');
    },
    create: function() {
        this.game.stage.disableVisibilityChange = true;
        world.logo = this.add.sprite(0, game.camera.height / 2, 'CoolmathGamesLogo');
        world.logo.anchor.setTo(0.5);
        world.logo.width = screenWidth;
        world.logo.height = Math.ceil(world.logo.width / 16 * 9);
        world.logo.sendToBack();
        game.splashCT = 60 * 3;
        storageAvailable();
        if (game.storageAvailable) {
            game.ldat = JSON.parse(localStorage.getItem('ldat'));
        }
        if (!game.ldat || !game.ldat.nrg || !game.ldat.nrg.v) {
            iniLdat();
        }
        game.scale.onSizeChange.add(onSizeChange);
        game.scale.setResizeCallback(onSizeChange);
        onSizeChange();
        addPreText(-222);
        addPreText2(-222);
    },
    update: function() {
        if (game.camera.width <= game.camera.height / 9 * 16) {
            world.logo.width = game.camera.width;
            world.logo.height = Math.ceil(world.logo.width / 16 * 9);
        } else {
            world.logo.height = game.camera.height;
            world.logo.width = Math.ceil(world.logo.height / 9 * 16);
        }
        world.logo.x = Math.round(game.camera.width / 2);
        world.logo.y = Math.round(game.camera.height / 2);
        game.splashCT--;
        if (game.splashCT <= 0) {
            game.state.start('Loader');
            game.scale.onOrientationChange.add(oriChange, game);
            oriChange();
        }
    }
};

function iniLdat() {
    game.ldat = new Object;
    game.ldat.spd = {
        v: 0.0,
        u: 0.1
    };
    game.ldat.jmp = {
        v: 0.0,
        u: 0.1
    };
    game.ldat.jmp2 = {
        v: 0.0,
        u: 0.1
    };
    game.ldat.tim = {
        v: 0,
        u: 0.1
    };
    game.ldat.nrg = {
        v: 0.1,
        u: 0.1
    };
    game.ldat.wpn = {
        v: 0.0,
        u: 0.1
    };
    game.ldat.ammo = {
        v: 0.0,
        u: 0.1
    };
    game.ldat.gunpow = {
        v: 0.0,
        u: 0.1
    };
    game.ldat.multi = {
        v: 0.0,
        u: 0.1
    };
    game.ldat.csh = {
        v: 1
    };
    game.ldat.xp = {
        v: 0
    };
    game.ldat.ars = new Array();
    game.ldat.stats = {
        t: 0,
        s: 0
    };
}

function oriChange(e) {
    var ori = 'landscape';
    if (game.scale.screenOrientation === 'portrait-primary' || game.scale.screenOrientation === 'portrait-secondary') {
        ori = 'portrait';
    }
    if (ori == 'landscape') {
        if (rotDevice) {
            rotDevice.destroy();
            rotDevice = null;
        }
        if (!game.keepPaused) {
            game.paused = false;
            muResume();
        }
    } else {
        game.keepPaused = null;
        if (game.paused) {
            game.keepPaused = true;
        }
        muPause();
        rotDevice = game.add.group();
        rotDevice.rd = rotDevice.create(0, 0, 'rotateDevice');
        rotDevice.rd.width = game.camera.width;
        rotDevice.rd.height = game.camera.height;
        game.paused = true;
    }
}

function rotDeviceCheck() {
    if (rotDevice) {
        rotDevice.x = game.camera.x;
        rotDevice.y = game.camera.y;
        rotDevice.rd.width = game.camera.width;
        rotDevice.rd.height = game.camera.height;
        game.world.bringToTop(rotDevice);
    }
}
function storageAvailable() {
    game.storageAvailable = true;
    if (typeof localStorage === 'object') {
        try {
            localStorage.setItem('localStorage', 1);
            localStorage.removeItem('localStorage');
        } catch (e) {
            Storage.prototype._setItem = Storage.prototype.setItem;
            Storage.prototype.setItem = function() {};
            game.storageAvailable = false;
        }
    } else {
        game.storageAvailable = false;
    }
}

function saveStats() {
    if (game.storageAvailable) {
        localStorage.setItem('ldat', JSON.stringify(game.ldat));
    }
}

function newState() {
    loopStop();
    game.paused = false;
    if (levl > 0) {
        game.state.start('Level');
        return;
    }
    if (levl == 0) {
        game.state.start('Title');
        return;
    }
    if (levl == -1) {
        game.state.start('Shop');
        return;
    }
    if (levl == -9) {
        game.state.start('GameOver');
        return;
    }
}

function click() {}
var game = new Phaser.Game(screenWidth, screenHeight, Phaser.AUTO);
game.preserveDrawingBuffer = true;
game.state.add('Main', MainState);
game.state.add('Loader', LoaderState);
game.state.add('Title', TitleState);
game.state.add('Level', LevelState);
game.state.add('Shop', ShopState);
game.state.add('GameOver', GameOverState);

game.state.start('Main');


function settings(st) {
    addFocusAndDesktopDetection();
    st.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    onSizeChange();
    st.scale.pageAlignHorizontally = true;
    st.scale.pageAlignVertically = true;
    game.stage.backgroundColor = "#000000";
}

function onSizeChange() {}

function muPlay(st, vol, loop) {
    var m = false;
    if (mu && mu.key != st) {
        var m = mu.mute;
        mu.stop();
        mu.destroy();
        mu = null;
    }
    if (!mu) {
        mu = game.add.audio(st);
        mu.loop = false;
        if (loop) {
            mu.loop = true;
        }
        mu.mute = m;
        mu.xVol = vol;
        game.sound.setDecodedCallback([mu], soundsDecoded, game);
    }
}

function fxPlay(fx, n) {
    if (!game.muteFX) {
        fx.play();
    }
}

function clickSound() {
    if (!game.muteFX) {
        clickFX.play();
    }
}

function muPause() {
    if (mu) {
        mu.pause();
    }
}

function muResume() {
    if (mu) {
        mu.resume();
    }
}

function soundsDecoded() {
    mu.play(null, 0, vol * mu.xVol, mu.loop);
    setMuFXBtns();
}