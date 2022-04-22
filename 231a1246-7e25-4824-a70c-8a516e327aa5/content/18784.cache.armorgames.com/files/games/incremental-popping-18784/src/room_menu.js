var infoText = "";
var buyTitleAlpha = 0;
var nextRoom = 0;

var stuff = {
    
    "Multiplier": {
        update: function () {
            incrMultiplierProgress += 1;
            incrMultiplier = this.getNextValue();
        },
        getProgress: function () { return incrMultiplierProgress; },
        getValue: function () { return incrMultiplier; },
        getNextValue: function () {
            return incrMultiplier + 0.15;
        },
        getPrice: function () {
            return Math.floor(100 - 1 + Math.pow(8.8, incrMultiplierProgress));
        },
    },
    
    "Ball Number": {
        update: function () {
            incrNumberProgress += 1;
            incrNumber = this.getNextValue();
        },
        getProgress: function () { return incrNumberProgress; },
        getValue: function () { return incrNumber; },
        getNextValue: function () {
            return incrNumber + 2;
        },
        getPrice: function () {
            return Math.floor(50 - 1 + Math.pow(9.1, incrNumberProgress));
        },
    },
    
    "Pop Size": {
        update: function () {
            incrRadiusProgress += 1;
            incrRadius = this.getNextValue();
        },
        getProgress: function () { return incrRadiusProgress; },
        getValue: function () { return incrRadius; },
        getNextValue: function () {
            if (prestige > 0) { return incrRadius + 2; }
            return incrRadius + (incrRadiusProgress > 2 ? 1 : 2);
        },
        getPrice: function () {
            return Math.floor(10 - 1 + Math.pow(8.6, incrRadiusProgress));
        },
    },
    
    "Pop Time": {
        update: function () {
            incrLifetimeProgress += 1;
            incrLifetime = this.getNextValue();
        },
        getProgress: function () { return incrLifetimeProgress; },
        getValue: function () { return incrLifetime; },
        getNextValue: function () {
            return incrLifetime + 15;
        },
        getPrice: function () {
            return Math.floor(50 - 1 + Math.pow(8.1, incrLifetimeProgress));
        },
    },
    
};

function gotoRoomMenu() {
    room = ROOM_MENU;
    roomFadeState = 2;
    
    buyTitleAlpha = 0;
    infoText = "";
    
    saveGameState();
    submitStats();
}

function loopRoomMenu() {
    ctx.fillStyle = "rgb(230, 230, 230)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    infoText = "";
    drawFrame();
    
    if (roomFadeState === 1) {
        buyTitleAlpha -= 0.05;
    }
    if (roomFadeState === 2) {
        buyTitleAlpha += 0.05;
    }
    buyTitleAlpha = Math.max(0, Math.min(buyTitleAlpha, 1));
    
    ctx.globalAlpha = buyTitleAlpha;
    ctx.font = "36px gamefont, sans-serif";
    ctx.textAlign = "left"
    ctx.fillStyle = "rgb(220, 220, 220)";
    ctx.fillText("Buy Upgrades", 35, 55);
    ctx.globalAlpha = 1;
    
    // shop
    
    var x = areaX + 10;
    var y = areaY + 25;
    
    ctx.font = "bold 36px gamefont, sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "rgb(20, 20, 20)";
    //ctx.fillText("Buy Upgrades", x, y);
    
    x += 30;
    //y += 30;
    y += 15;
    ctx.font = "24px gamefont, sans-serif";
    
    ctx.fillText("Multiplier", x + 10, y + 50);
    drawUpgradeProgress(x + 180, y + 26, "Multiplier");
    if (mouseInBox(x, y + 20, 150, 50)) {
        infoText = "Multiplier - Value of colliding ball equals value of other ball times this number";
    }
    
    ctx.fillStyle = "rgb(20, 20, 20)";
    ctx.fillText("Ball Number", x + 10, y + 110);
    drawUpgradeProgress(x + 180, y + 86, "Ball Number");
    if (mouseInBox(x, y + 80, 150, 50)) {
        infoText = "Ball Number - The initial number of balls in a game";
    }
    
    ctx.fillStyle = "rgb(20, 20, 20)";
    ctx.fillText("Pop Size", x + 10, y + 170);
    drawUpgradeProgress(x + 180, y + 146, "Pop Size");
    if (mouseInBox(x, y + 140, 150, 50)) {
        infoText = "Pop Size - The size of a ball that has been popped";
    }
    
    ctx.fillStyle = "rgb(20, 20, 20)";
    ctx.fillText("Pop Time", x + 10, y + 230);
    drawUpgradeProgress(x + 180, y + 206, "Pop Time");
    if (mouseInBox(x, y + 200, 150, 50)) {
        infoText = "Pop Time - The amount of time a ball stays popped (in seconds)";
    }
    
    y -= 15;
    // buttons
    y += 45;
    if (drawButton(x + 10, y + 260, "ACHIEVEMENTS", 180)) {
        // ...
        
        infoText = "Check out your achievements!";
        
        if (mousePressed) {
            nextRoom = ROOM_ACH;
            roomFadeState = 1;
        }
    }
    
    if (prestige < 1) {
        var allMaxedOut = incrMultiplierProgress === 10 && incrRadiusProgress === 10 && incrNumberProgress === 10 && incrLifetimeProgress === 10;
        
        if (drawButton(x + 255, y + 260, "PRESTIGE", 160, !allMaxedOut)) {
            // ...
            
            if (allMaxedOut) {
                infoText = "Prestige - Restart the game and multiply the initial popping value by 10";
                
                if (mousePressed) {
                    prestige = 1;
                    initialize();
                    
                    nextRoom = ROOM_MENU;
                    roomFadeState = 1;
                }
                
            } else {
                infoText = "Max out all the upgrades in order to prestige";
            }
            
        }
    }
    
    if (drawButton(x + 485, y + 260, "LET'S PLAY!", 170)) {
        // ...
        
        infoText = "Let's play again!";
        
        if (mousePressed) {
            nextRoom = ROOM_PLAY;
            roomFadeState = 1;
        }
    }
    
    // info text
    ctx.globalAlpha = buyTitleAlpha;
    ctx.font = "18px gamefont, sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "rgb(180, 180, 180)";
    ctx.fillText(infoText, 35, canvas.height - 22);
    ctx.globalAlpha = 1;
    
    
    // logo
    ctx.globalAlpha = 0.7;
    //armorGames.drawImageClickable("fb_white", canvas.width/2 + 100, 40, 0.6, game.mouseX, game.mouseY, game.mousePressed("Left"), false);
    armorGames.drawImageClickable("hor_black", canvas.width-160, 90, 0.3, mouseX, mouseY, mousePressed, false);
    ctx.globalAlpha = 1;
    
    loopParticles();
    
    drawTransition(function () {
        if (nextRoom === ROOM_PLAY) {
            gotoRoomPlay();
        }
        
        if (nextRoom === ROOM_ACH) {
            gotoRoomAch();
        }
        
        if (nextRoom === ROOM_MENU) {
            gotoRoomMenu();
        }
    });
}

var pcolors = {
    "Multiplier": "rgb(0, 160, 60)",
    "Ball Number": "rgb(160, 0, 60)",
    "Pop Size": "rgb(160, 160, 0)",
    "Pop Time": "rgb(60, 0, 160)",
};

function drawUpgradeProgress(x, y, name) {
    var n = 10;
    var pad = 20;
    var stx = x;
    var sty = y;
    
    ctx.fillStyle = "rgb(20, 20, 20)";
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 2;
    
    var price = stuff[name].getPrice();
    var value = stuff[name].getValue();
    var nextValue = stuff[name].getNextValue();
    var progressNumber = stuff[name].getProgress();
    
    if (progressNumber > 1) {
        var yy = progressNumber === 10 ? 1 : 0;
        ctx.fillStyle = pcolors[name];
        ctx.globalAlpha = progressNumber === 10 ? 0.7 : 0.2;
        ctx.fillRect(x + 1, y - yy, (progressNumber - 1) * pad, 30 + 2 * yy);
        ctx.globalAlpha = 1;
    }
    
    for (var i = 0; i < n; i++) {
        if (i < progressNumber) {
            ctx.fillStyle = pcolors[name];//"rgb(0, 120, 40)";//"rgb(20, 20, 20)";
            ctx.fillRect(x + i * pad, y, 9, 30);
        } else {
            ctx.fillStyle = "rgb(200, 200, 210)";
            ctx.fillRect(x + i * pad, y, 9, 30);
            ctx.globalAlpha = 0.5;
        }
        ctx.strokeRect(x + i * pad, y, 9, 30);
        ctx.globalAlpha = 1;
    }
    
    var canBuy = money >= price && progressNumber < 10;
    x = x + n * pad;
    
    ctx.fillStyle = canBuy ? "rgb(100, 250, 150)" : "rgb(160, 160, 160)";
    ctx.fillRect(x + 30, y, 30, 30);
    
    ctx.strokeRect(x + 30, y, 30, 30);
    ctx.lineWidth = 4;
    ctx.strokeStyle = canBuy ? "rgb(20, 20, 20)" : "rgb(100, 100, 100)";
    drawLine(x + 30 + 15, y + 5, x + 30 + 15, y + 30 - 5);
    drawLine(x + 30 + 5, y + 15, x + 30 + 30 - 5, y + 15);
    
    if (mouseInBox(x + 30, y, 30, 30)) {
        if (progressNumber < 10) {
            infoText = "Upgrade " + name.toLowerCase() + ", costs $" + formatMoney(price);
        } else {
            var cap = name[0];
            infoText = cap + name.slice(1).toLowerCase() + " is maxed out";
        }
        
        if (canBuy) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "white";
            ctx.fillRect(x + 30, y, 30, 30);
            ctx.globalAlpha = 1;
            
            if (mousePressed) {
                stuff[name].update();
                money -= price;
                
                for (var i = 0; i < 7; i++) {
                    var px = stx + progressNumber * pad + 4;
                    var py = sty + i * 6;
                    new Particle(px, py, pcolors[name]);
                }
                
                saveGameState();
                submitStats();
            }
        }
    }
    
    var diff = nextValue - value;
    diff = Math.round(diff * 100) / 100;
    
    var val = Math.round(value * 100) / 100;
    
    if (name === "Pop Time") {
        val = Math.round(val / 60 * 10) / 10;
        nval = Math.round(Math.round(nextValue * 100) / 100 / 60 * 10) / 10;
        diff = Math.round((nval - val) * 100) / 100;
    }
    
    //ctx.font = "24px gamefont, sans-serif";
    ctx.fillStyle = "rgb(20, 20, 20)";
    ctx.fillText(val, x + 100, y + 24);
    if (progressNumber < 10) {
        ctx.fillText("(+ " + diff  + ")", x + 190, y + 24);
    } else {
        ctx.fillText("(max)", x + 190, y + 24);
    }
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawButton(x, y, text, width, disabled) {
    var height = 30;
    
    if (disabled) {
        ctx.globalAlpha = 0.2//0.1;
        ctx.fillStyle = "rgb(160, 160, 160)"//"rgb(200, 190, 100)";
        ctx.fillRect(x, y, width, height);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgb(100, 100, 100)";
        ctx.strokeRect(x, y, width, height);
        
        ctx.fillStyle = "rgb(60, 60, 60)";
        ctx.font = "20px gamefont, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(text, x + width / 2, y + 22);
        ctx.globalAlpha = 1;
        
        return mouseInBox(x, y, width, height);
    }
    
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.2;
    ctx.fillRect(x + 3, y + 3, width, height);
    ctx.globalAlpha = 1;
    
    ctx.fillStyle = "rgb(200, 190, 100)";
    ctx.fillRect(x, y, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(20, 20, 20)";
    ctx.strokeRect(x, y, width, height);
    
    ctx.fillStyle = "rgb(20, 20, 20)";
    ctx.font = "20px gamefont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, x + width / 2, y + 22);
    
    if (mouseInBox(x, y, width, height)) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "white";
        ctx.fillRect(x, y, width, height);
        ctx.globalAlpha = 1;
        
        return true;
    }
    
    return false;
}

var particles = [];

function Particle(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.hspeed = Math.random() < 0.5 ? 1 : -1;
    this.vspeed = -(3 + Math.floor(Math.random() * 3));
    this.gravity = 0.5;
    
    particles.push(this);
}

Particle.prototype.update = function () {
    this.x += this.hspeed;
    this.y += this.vspeed;
    this.vspeed += this.gravity;
    
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - 3, this.y - 3, 6, 6);
    
    if (this.y > canvas.height + 20) {
        particles.splice(particles.indexOf(this), 1);
    }
};

function loopParticles() {
    var p = particles.slice();
    for (var i = 0; i < p.length; i++) {
        var particle = p[i];
        particle.update();
    }
}
