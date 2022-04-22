var areaPadding = 8;
var areaBorder = 30;
var areaX = areaBorder;
var areaY = 90;
var areaWidth = canvas.width - 2 * areaBorder;
var areaHeight = canvas.height - areaY - 68;
var popCount = 0;
var extraMoney = 0;
var poppedInit = false;
var gameover = false;
var timer = 0;
var startExtraMoney = 0;
var barTextAlpha = 0;
var chainRecord = 0;

var msx = 300;
var msy = 300;

function gotoRoomPlay() {
    room = ROOM_PLAY;
    roomFadeState = 2;
    
    barTextAlpha = 0;
    timer = 0;
    gameOver = false;
    poppedInit = false;
    extraMoney = 0;
    popCount = 0;
    disks = [];
    for (var i = 0; i < incrNumber; i++) {
        var x = areaX + 20 + Math.floor(Math.random() * (areaWidth - 2 * 20));
        var y = areaY + 20 + Math.floor(Math.random() * (areaHeight - 2 * 20));
        var disk = new Disk(x, y);
        disks.push(disk);
    }
}

function loopRoomPlay() {
    ctx.fillStyle = prestige > 0 ? "rgb(30, 30, 30)" : "rgb(230, 230, 230)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (achs[4].done()) {
        ctx.fillStyle = "rgb(45, 45, 45)";
        ctx.strokeStyle = ctx.fillStyle;
        ctx.beginPath();
        ctx.arc((areaX + areaWidth) / 2 - 90, areaY + 120 - 30, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc((areaX + areaWidth) / 2 + 90, areaY + 120 - 30, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.arc((areaX + areaWidth) / 2, areaY + 100 - 70, 220, 0.3, Math.PI - 0.3);
        ctx.stroke();
        
        ctx.font = "48px gamefont, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Congratulations!", (areaX + areaWidth) / 2, areaY + 340);
    }
    
    var cell = 64;
    var pad = 0;
    ctx.strokeStyle = prestige > 0 ? "rgb(35, 35, 35)" : "rgb(226, 226, 226)";
    ctx.lineWidth = 2;
    for (var i = 0; i <= Math.ceil(areaWidth / cell); i++) {
        ctx.beginPath();
        ctx.moveTo(i * cell + pad, areaY);
        ctx.lineTo(i * cell + pad, areaY + areaHeight);
        ctx.stroke();
    }
    for (var i = 0; i <= Math.ceil(areaHeight / cell) + 1; i++) {
        ctx.beginPath();
        ctx.moveTo(areaX, i * cell + pad);
        ctx.lineTo(areaX + areaWidth, i * cell + pad);
        ctx.stroke();
    }
    
    if (!poppedInit && mousePressed && areaX <= mouseX && mouseX < areaX + areaWidth && areaY <= mouseY && mouseY < areaY + areaHeight) {
        var x = mouseX;
        var y = mouseY;
        var disk = new Disk(x, y);
        disk.score = incrInitial * (prestige === 0 ? 1 : 10);
        disk.popped = true;
        disk.tween.set(incrRadius);
        disk.color = { r: diskColor.r, g: diskColor.g, b: diskColor.b };
        disks.push(disk);
        disks.sort(function (a, b) { a.id - b.id; });
        poppedInit = true;
        firstTime = false;
    }
    
    /*
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.4;
    ctx.fillRect(0 + 3, 0 + 3, canvas.width, areaY);
    ctx.fillRect(0 + 3, areaY + 3, areaBorder, areaHeight);
    ctx.globalAlpha = 1;
    */
    
    drawFrame();
    
    var longestChain = 0;
    for (var i = 0; i < disks.length; i++) {
        var disk = disks[i];
        if (disk.chain > longestChain) {
            longestChain = disk.chain;
        }
    }
    if (longestChain > chainRecord) {
        chainRecord = longestChain;
    }
    
    if (roomFadeState === 1) {
        barTextAlpha -= 0.05;
    }
    if (roomFadeState === 2) {
        barTextAlpha += 0.05;
    }
    barTextAlpha = Math.max(0, Math.min(barTextAlpha, 1));
    
    if (firstTime) {
        ctx.font = "18px gamefont, sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgb(180, 180, 180)";
        ctx.fillText("Click somewhere to pop a ball. Each chain collision earns you more points.", 35, canvas.height - 22);
    } else {
        ctx.globalAlpha = barTextAlpha;
        ctx.font = "18px gamefont, sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgb(180, 180, 180)";
        ctx.fillText("Popped " + popCount + " out of " + incrNumber, 35, canvas.height - 22);
        ctx.textAlign = "center";
        ctx.fillText("Longest chain reaction is " + longestChain, canvas.width / 2 + 70, canvas.height - 22);
    }
    
    // logo
    ctx.globalAlpha = barTextAlpha * 0.7;
    armorGames.drawImageClickable("shield_white", canvas.width-130, canvas.height-48, 0.3, mouseX, mouseY, mousePressed, false);
    ctx.globalAlpha = 1;
    
    ctx.font = "36px gamefont, sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "rgb(220, 210, 120)";
    ctx.fillText("+ " + formatMoney(extraMoney), 35, 55);//canvas.width / 2, 55);
    ctx.globalAlpha = 1;
    
    var previousCount = popCount;
    var done = true;
    
    for (var i = 0; i < disks.length; i++) {
        var disk = disks[i];
        disk.update();
        
        if (disk.popped && !disk.dead) {
            done = false;
        }
    }
    
    if (previousCount < popCount) {
        disks.sort(function (a, b) { return a.depth - b.depth; });
    }
    
    if (!gameOver && poppedInit && done) {
        gameOver = true;
        startExtraMoney = extraMoney;
        
        if (popCount === 0) {
            achNone = true;
        }
        
        if (popCount === incrNumber) {
            achAll = true;
        }
        
        if (longestChain >= 8) {
            achChain = true;
        }
    }
    
    if (gameOver) {
        if (timer < 60) {
            timer += 1;
        } else if (extraMoney > 0) {
            var counter = Math.ceil(startExtraMoney / 120);
            var amount = Math.min(counter, extraMoney);
            extraMoney -= amount;
            money += amount;
        } else if (timer < 120) {
            timer += 1;
        } else {
            roomFadeState = 1;
        }
    }
    
    //var msx = 300;
    //var msy = 300;
    if (firstTime) {
        var t = performance.now() / 1000;
        var scale = 2 / (3 - Math.cos(2*t)) * 200;
        msx = (areaX + areaWidth) / 2 + scale * Math.cos(t);
        msy = (areaY + areaHeight) / 2 + 40 + scale * Math.sin(2*t) / 2;
        
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "black";
        drawMouse(msx + 4, msy + 4);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        drawMouse(msx, msy);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        drawMouse(msx, msy);
        ctx.stroke();
    }
    
    drawTransition(function () {
        gotoRoomMenu();
    });
}

function formatMoney(value) {
    var val = "" + value;
    var str = "";
    var k = 0;
    
    for (var i = val.length - 1; i >= 0; i--) {
        var c = val.charAt(i);
        str = c + str;
        k += 1;
        if (k === 3 && i > 0) {
            str = "," + str;
            k = 0;
        }
    }
    
    return str;
}

function mouseInBox(x, y, width, height) {
    return x <= mouseX && mouseX < x + width && y <= mouseY && mouseY < y + height;
}

function drawMouse(x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 4, y + 20);
    ctx.lineTo(x + 9, y + 16);
    
    ctx.lineTo(x + 18, y + 26);
    ctx.lineTo(x + 23, y + 21);
    
    ctx.lineTo(x + 15, y + 12);
    ctx.lineTo(x + 20, y + 8);
    ctx.closePath();
}
