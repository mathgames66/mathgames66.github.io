var shopObj;
var ShopState = {
    preload: function() {
        addFocusAndDesktopDetection();
        world = this;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        game.stage.backgroundColor = "#000000";
    },
    create: function() {
        muPlay('muIngame', 0.4, true);
        game.black = null;
        game.scale.setGameSize(screenWidth, screenHeight);
        game.ldat.csh.v = Math.floor(game.ldat.csh.v);
        shopObj = {};
        shopObj.dsp = game.add.group();
        var bg = shopObj.dsp.create(0, 0, 'shopBG');
        shopObj.dsp.width = screenWidth;
        shopObj.dsp.height = screenHeight;
        shopObj.fxSelect1 = this.add.audio("fxSelect1", 0.9);
        shopObj.fxLeaveShop = this.add.audio("fxLeaveShop", 0.5);
        shopObj.fxChing = this.add.audio("fxChing", 0.4);
        shopObj.dd = 0;
        shopObj.yd = 56;
        shopObj.yy = 64;
        shopObj.itm = [];
        shopObj.pnr = 0;
        addITM("Speed", "increases your running speed!", game.ldat.spd, new Array(1, 2, 5, 8, 10, 20, 60, 400, 800, 1000));
        addITM("Jump Power", "lets you jump higher!", game.ldat.jmp, new Array(3, 10, 15, 20, 25, 50, 75, 100, 150, 200));
        addITM("Double Jump", "ability to jump in mid-air!", game.ldat.jmp2, new Array([600]));
        addITM("Time Limit", "expands the time limit!", game.ldat.tim, new Array(10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 120, 140, 160, 180, 200, 250, 300, 350, 400, 500));
        addITM("Energy", "absorbs more enemy hits!", game.ldat.nrg, new Array(25, 50, 150, 200, 300));
        if (game.ldat.wpn.v) {
            addITM("Ammo", "more ammo for your laser gun!", game.ldat.ammo, new Array(20, 40, 70, 100, 150, 200, 250, 300, 400, 500));
            addITM("Gun Power", "powers up your laser gun power!", game.ldat.gunpow, new Array(25, 50, 100, 150, 200));
            shopObj.pnr++;
        } else {
            shopObj.pnr += 2;
            addITM("LOCKED", "find a gun to unlock!", game.ldat.ammo, new Array());
            shopObj.pnr--;
            addITM("LOCKED", "find a gun to unlock!", game.ldat.gunpow, new Array());
        }
        addITM("Multiplier", "+50% on top of collected coins!", game.ldat.multi, new Array(20, 30, 40, 60, 80, 100, 150, 200, 250, 300));
        var style = {
            font: 'shopFont',
            fill: '#37767B',
            wordWrap: false,
            wordWrapWidth: 0,
            align: 'center',
            boundsAlignH: 'center',
            backgroundColor: null
        };
        var txtCash = game.add.text(238, 21, '$' + game.ldat.csh.v + '', style);
        txtCash.fontSize = 27 * 2;
        txtCash.addColor('#FFFFFF');
        txtCash.anchor.setTo(0.5, 0);
        txtCash.setShadow(0, 6, "#FFFFFF", 0, false, true);
        txtCash.smoothed = false;
        shopObj.dsp.add(txtCash);
        txtCash.scale.x = txtCash.scale.y = 0.5;
        var style = {
            font: 'shopFont',
            fill: '#37767B',
            wordWrap: false,
            wordWrapWidth: 0,
            align: 'center',
            boundsAlignH: 'center',
            backgroundColor: null
        };
        var txtXP = game.add.text(562, 21, 'XP: ' + getXP() + '', style);
        txtXP.fontSize = 27 * 2;
        txtXP.addColor('#FFFFFF');
        txtXP.anchor.setTo(0.5, 0);
        txtXP.setShadow(0, 6, "#FFFFFF", 0, false, true);
        shopObj.dsp.add(txtXP);
        txtXP.scale.x = txtXP.scale.y = 0.5;
        var style = {
            font: 'shopFont',
            fill: '#37767B',
            wordWrap: false,
            wordWrapWidth: 0,
            align: 'center',
            boundsAlignH: 'center',
            backgroundColor: null
        };
        var txtXP = game.add.text(410, 534, 'time ' + getTime(game.ldat.stats.t), style);
        txtXP.fontSize = 27;
        txtXP.addColor('#FFFFFF');
        txtXP.anchor.setTo(0.5, 0);
        txtXP.setShadow(0, 3, "#FFFFFF", 0, false, true);
        shopObj.dsp.add(txtXP);
        txtXP.scale.x = txtXP.scale.y = 0.5;
        var style = {
            font: 'shopFont',
            fill: '#37767B',
            wordWrap: false,
            wordWrapWidth: 0,
            align: 'center',
            boundsAlignH: 'center',
            backgroundColor: null
        };
        var txtXP = game.add.text(410, 552, 'fails ' + game.ldat.stats.s, style);
        txtXP.fontSize = 27;
        txtXP.addColor('#FFFFFF');
        txtXP.anchor.setTo(0.5, 0);
        txtXP.setShadow(0, 3, "#FFFFFF", 0, false, true);
        shopObj.dsp.add(txtXP);
        txtXP.scale.x = txtXP.scale.y = 0.5;
        addShopMuteButtons();
        shopObj.btnHome = shopObj.dsp.create(160, 525, 'btnShopHome');
        shopObj.btnHome.anchor.setTo(0.5, 0);
        shopObj.btnHome.scale.x = shopObj.btnHome.scale.y = 0.5;
        shopObj.btnHome.inputEnabled = true;
        shopObj.btnHome.events.onInputDown.add(function() {
            clickSound();
            levl = 0;
            newState();
        }, this);
        if (game.ldat.spd.v) {
            shopObj.btnPlay = shopObj.dsp.create(602, 525, 'btnShopPlay');
            shopObj.btnPlay.anchor.setTo(0.5, 0);
            shopObj.btnPlay.scale.x = shopObj.btnPlay.scale.y = 0.5;
            shopObj.btnPlay.inputEnabled = true;
            shopObj.btnPlay.events.onInputDown.add(shopLeave, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(shopLeave, this);
        } else {
            var joe = shopObj.dsp.create(270, 180, 'shopJohnny');
        }
    },
    update: function() {},
    render: function() {
        rotDeviceCheck();
        if (game.black) {
            newState();
        }
    }
};

function addShopMuteButtons() {
    game.btnMu = game.add.sprite(268, 522, 'btnMu');
    game.btnMu.anchor.setTo(1, 0);
    game.btnMu.scale.x = game.btnMu.scale.y = 0.5;
    game.btnMu.inputEnabled = true;
    game.btnFX = game.add.sprite(268, 522, 'btnFX');
    game.btnFX.anchor.setTo(0, 0);
    game.btnFX.scale.x = game.btnFX.scale.y = 0.5;
    game.btnFX.inputEnabled = true;
    setMuFXBtns();
    game.input.onDown.add(muteButtons);
}

function getTime(sec) {
    sec = sec / 60;
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec - m * 60);
    return (doubleDigitFormat(m) + ":" + doubleDigitFormat(s));
}

function doubleDigitFormat(num) {
    if (num < 10) {
        return ('0' + num);
    }
    return num;
}

function addITM(nam, dsc, levl, priceArr) {
    var lvl = Math.round(levl.v * 10);
    var price = priceArr[lvl];
    var bg;
    if (game.device.desktop) {
        bg = shopObj.dsp.create(90, shopObj.yy, 'sheetShopPanelDesktop');
    } else {
        bg = shopObj.dsp.create(90, shopObj.yy, 'sheetShopPanelMobile');
    }
    bg.frame = shopObj.pnr;
    var style = {
        font: 'shopFont',
        fill: '#BBBBBB',
        wordWrap: false,
        wordWrapWidth: 0,
        align: 'center',
        boundsAlignH: 'right',
        backgroundColor: null
    };
    var txt1 = game.add.text(622, 8, '', style);
    txt1.fontSize = 18;
    txt1.addColor('#FFFFFF');
    txt1.anchor.setTo(1, 0);
    bg.addChild(txt1);
    var txt2 = game.add.text(622, 31, ' $' + price + ' ', style);
    txt2.fontSize = 18;
    txt2.addColor('#FFFFFF');
    txt2.anchor.setTo(1, 0);
    txt2.setShadow(0, 0, "#00FF00", 8, false, true);
    txt2.fill = '#FFFFFF';
    bg.addChild(txt2);
    txt1.setText('level: ' + lvl + '/' + priceArr.length + ' ');
    shopObj.yy += shopObj.yd;
    shopObj.pnr++;
    if (lvl < priceArr.length) {
        txt2.setText(' $ ' + price + ' ');
        if (nam == "Double Jump") {
            txt2.setText(price + ' EXP ');
        }
    } else {
        txt2.setText(' MAX!!! ');
        if (nam == 'LOCKED') {
            txt2.setText(' NO GUN! ');
            txt1.setText('');
        }
    }
    if ((nam != 'Double Jump' && game.ldat.csh.v >= price) || (nam == 'Double Jump' && getXP() >= price)) {
        bg.lvl = levl;
        bg.prc = price;
        bg.itm = nam;
        bg.inputEnabled = true;
        bg.events.onInputDown.add(shopBtnPress);
    } else {
        var lok = shopObj.dsp.create(bg.x, bg.y, 'shopPanelLock');
    }
}

function getXP() {
    var n = 0;
    for (var i = 0; i < game.ldat.ars.length; i++) {
        var a = game.ldat.ars[i];
        if (a) {
            n++;
        }
    }
    n = n * n * 5;
    return n;
}

function shopBtnPress(e) {
    e.lvl.v += e.lvl.u;
    if (e.itm != "Double Jump") {
        game.ldat.csh.v -= e.prc;
    }
    lvl = 1;
    fxPlay(shopObj.fxSelect1);
    newState();
}

function shopLeave() {
    if (game.black) {
        return;
    }
    fxPlay(shopObj.fxChing);
    fxPlay(shopObj.fxLeaveShop);
	/*
    if (parent && parent.cmgGameEvent) {
        parent.cmgGameEvent('replay');
    }
	*/
    levl = 1;
    game.black = game.add.sprite(0, 0, 'black');
    game.black.width = 800;
    game.black.height = 600;
    saveStats();
}