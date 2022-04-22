var achTitleAlpha = 0;

var achNone = false;
var achAll = false;

var achRot = 0;

var achs = [
    {
        text: function () { return "Get every single ball popped in a game."; },
        done: function () { return achAll; },
    },
    {
        text: function () { return "Get a chain reaction length of at least 15 in a game."; },
        done: function () { return chainRecord >= 15; },
    },
    {
        text: function () { return "Get no single ball popped in a game."; },
        done: function () { return achNone; },
    },
    {
        text: function () { return "Prestige!"; },
        done: function () { return prestige > 0; },
    },
    {
        text: function () { return "Max out every upgrade, twice."; },
        done: function () { return prestige > 0 && incrMultiplierProgress === 10 && incrRadiusProgress === 10 && incrNumberProgress === 10 && incrLifetimeProgress === 10; },
    }
];

function gotoRoomAch() {
    room = ROOM_ACH;
    roomFadeState = 2;
    
    achTitleAlpha = 0;
    infoText = "";
}

function loopRoomAch() {
    ctx.fillStyle = "rgb(230, 230, 230)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    infoText = "";
    drawFrame();
    
    achRot += 0.05;
    
    if (roomFadeState === 1) {
        achTitleAlpha -= 0.05;
    }
    if (roomFadeState === 2) {
        achTitleAlpha += 0.05;
    }
    achTitleAlpha = Math.max(0, Math.min(achTitleAlpha, 1));
    
    ctx.globalAlpha = achTitleAlpha;
    ctx.font = "36px gamefont, sans-serif";
    ctx.textAlign = "left"
    ctx.fillStyle = "rgb(220, 220, 220)";
    ctx.fillText("Achievements", 35, 55);
    ctx.globalAlpha = 1;
    
    var x = areaX + 10 + 30;
    var y = areaY + 25 + 45;
    
    if (drawButton(x + 10 + 236, y + 260, "GO BACK", 180)) {
        infoText = "Go back to the upgrade menu";
        
        if (mousePressed) {
            roomFadeState = 1;
        }
    }
    
    // achievements
    
    x = areaX + 10 - 20;
    y = areaY + 25 + 30;
    var dy = 54;
    
    ctx.font = "16px gamefont, sans-serif";
    ctx.textAlign = "center";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(20, 20, 20)";
    
    var s = 10;
    
    for (var i = 0; i < achs.length; i++) {
        var ach = achs[i];
        
        ctx.fillStyle = ach.done() ? "rgb(230, 220, 160)" : "rgb(200, 200, 200)";
        ctx.fillRect(x + 135, y + dy * i - 28, 500, dy - 10);
        
        ctx.strokeRect(x + 135, y + dy * i - 28, 500, dy - 10);
        
        ctx.fillStyle = "rgb(20, 20, 20)";
        ctx.fillText(ach.text(), canvas.width / 2, y + dy * i);
        
        if (i === 1 && mouseInBox(x + 135, y + dy * i - 28, 500, dy - 10)) {
            infoText = "Your current chain reaction record is " + chainRecord;
        }
        
        if (ach.done()) {
            var t = s * 1.2;
            
            ctx.fillStyle = "rgb(230, 220, 20)";
            ctx.save();
            ctx.translate(x + 100, y + dy * i - 6);
            ctx.rotate(Math.PI / 4 - achRot);
            ctx.fillRect(-t, -t, 2 * t, 2 * t);
            ctx.strokeRect(-t, -t, 2 * t, 2 * t);
            ctx.restore();
            
            ctx.save();
            ctx.translate(x + 670, y + dy * i - 6);
            ctx.rotate(Math.PI / 4 + achRot);
            ctx.fillRect(-t, -t, 2 * t, 2 * t);
            ctx.strokeRect(-t, -t, 2 * t, 2 * t);
            ctx.restore();
        } else {
            ctx.fillStyle = "rgb(200, 200, 200)";
            ctx.save();
            ctx.translate(x + 100, y + dy * i - 6);
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(-s, -s, 2 * s, 2 * s);
            ctx.strokeRect(-s, -s, 2 * s, 2 * s);
            ctx.restore();
            
            ctx.save();
            ctx.translate(x + 670, y + dy * i - 6);
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(-s, -s, 2 * s, 2 * s);
            ctx.strokeRect(-s, -s, 2 * s, 2 * s);
            ctx.restore();
        }
    }
    
    // info text
    ctx.globalAlpha = achTitleAlpha;
    ctx.font = "18px gamefont, sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "rgb(180, 180, 180)";
    ctx.fillText(infoText, 35, canvas.height - 22);
    ctx.globalAlpha = 1;
    
    ctx.globalAlpha = 0.7;
    armorGames.drawImageClickable("fb_black", canvas.width-150, canvas.height-110, 0.5, mouseX, mouseY, mousePressed, false);
    armorGames.drawImageClickable("hor_black", 50, canvas.height-120, 0.4, mouseX, mouseY, mousePressed, false);
    ctx.globalAlpha = 1;
    
    drawTransition(function () {
        gotoRoomMenu();
    });
}
