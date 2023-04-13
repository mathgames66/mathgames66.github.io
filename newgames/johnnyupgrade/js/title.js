var title;
var TitleState = {
    preload: function() {
        addFocusAndDesktopDetection();
        world = this;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        game.stage.backgroundColor = "#000000";
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
    },
    create: function() {
        muPlay('muTitle', 1, true);
        game.scale.setGameSize(screenWidth, screenHeight);
        title = {};
        title.ani = game.add.group();
        title.ani.x = 400;
        title.ani.y = 260;
        title.ani.angle = -45;
        title.bg = game.add.sprite(0, 0, 'titleBG0');
        title.c3 = game.add.tileSprite(0, 0, 800, 600, 'titleCloud3');
        title.c3.scale.x = title.c3.scale.y = 1.25;
        game.add.sprite(0, 0, 'titleBG1');
        title.c2 = game.add.tileSprite(0, 0, 800, 600, 'titleCloud2');
        title.c2.scale.x = title.c2.scale.y = 1.25;
        title.c1 = game.add.tileSprite(0, 0, 800, 600, 'titleCloud1');
        title.c1.scale.x = title.c1.scale.y = 1.25;
        game.add.sprite(0, 0, 'titleBGLogo');
        game.add.sprite(0, 0, 'titleJohnny');
        this.btnPlay = world.game.add.sprite(400, screenHeight - 10, 'btnTitlePlay');
        this.btnPlay.anchor.setTo(0.5, 1);
        this.btnPlay.inputEnabled = true;
        this.btnPlay.events.onInputDown.add(gotoL1, this);
        game.btnMu = game.add.sprite(160, 522, 'btnMu');
        game.btnMu.anchor.setTo(1, 0.5);
        game.btnMu.inputEnabled = true;
        game.btnFX = game.add.sprite(160, 522, 'btnFX');
        game.btnFX.anchor.setTo(0, 0.5);
        game.btnFX.inputEnabled = true;
        setMuFXBtns();
        game.input.onDown.add(muteButtons);
        this.btnReset = game.add.sprite(640, 522, 'btnReset');
        this.btnReset.anchor.setTo(0.5, 0.5);
        this.btnReset.inputEnabled = true;
        if (game.ldat.stats.s) {
            this.btnReset.frame = 1;
            this.btnReset.events.onInputDown.add(function() {
                game.btnFX.noControl = true;
                this.confirmReset.visible = true;
            }, this);
        }
        this.confirmReset = game.add.sprite(0, 0, 'resetBG');
        this.confirmReset.inputEnabled = true;
        this.confirmReset.visible = false;
        this.confirmResetNo = this.confirmReset.addChild(game.make.sprite(170, 480, 'btnSettings'));
        this.confirmResetNo.frame = 1;
        this.confirmResetNo.anchor.setTo(0.5);
        this.confirmResetNo.inputEnabled = true;
        this.confirmResetNo.events.onInputDown.add(function() {
            game.btnFX.noControl = null;
            this.confirmReset.visible = false;
        }, this);
        this.confirmResetYes = this.confirmReset.addChild(game.make.sprite(630, 480, 'btnResetCheck'));
        this.confirmResetYes.anchor.setTo(0.5);
        this.confirmResetYes.inputEnabled = true;
        this.confirmResetYes.events.onInputDown.add(function() {
            game.btnFX.noControl = null;
            iniLdat();
            saveStats();
            newState();
        }, this);
    },
    update: function() {
        title.c1.tilePosition.x -= 2;
        title.c2.tilePosition.x += 1;
        title.c3.tilePosition.x -= 0.5;
        title.bg.alpha = Math.random() * 0.1 + 0.9;
    },
    render: function() {
        rotDeviceCheck();
        if (title.dd) {
            game.black.alpha += 0.02;
            if (game.black.alpha > 1.02) {
                levl = 1;
                if (game.ldat.stats.s) {
                    levl = -1;
                }
                newState();
            }
        }
    }
};

function addButtonsTitle(nam, xOff) {
    var b = game.add.sprite(world.btnPlay.x + xOff, screenHeight - 60, nam);
    b.anchor.setTo(0.5, 0.5);
    b.inputEnabled = true;
    return b;
}

function gotoL1(e) {
    if (title.dd) {
        return;
    }
    clickSound();
    
    /*
    if (parent && parent.cmgGameEvent) {
        parent.cmgGameEvent('start');
    }
    */
    
    title.dd = true;
    game.black = game.add.sprite(0, 0, 'black');
    game.black.width = 800;
    game.black.height = 600;
    game.black.alpha = 0;
}