var canvas = document.getElementById("display");
var ctx = canvas.getContext("2d");

var disks = [];

var WIDTH_RATIO = 1;
var HEIGHT_RATIO = 1;
var mouseX = 0;
var mouseY = 0;
var mouseDown = false;
var mousePressed = false;
var mouseReleased = false;

var hasLocalStorage = false;

try {
    hasLocalStorage = !!localStorage.getItem;
} catch (err) {
    hasLocalStorage = false;
}

function getLocalStorage(name) {
    if (!hasLocalStorage) {
        return undefined;
    }
    
    return localStorage.getItem(name);
}
    
function setLocalStorage(name, value) {
    if (!hasLocalStorage) {
        return;
    }
    
    localStorage.setItem(name, value);
}

 function removeLocalStorage(name) {
    if (!hasLocalStorage) {
        return;
    }
    
    localStorage.removeItem(name);
}

canvas.addEventListener("mousedown", function (event) {
    var rect = canvas.getBoundingClientRect();
    var button = event.button;
    
    event.preventDefault();
    
    mouseX = Math.floor((event.pageX - window.scrollX - rect.left) * WIDTH_RATIO);
    mouseY = Math.floor((event.pageY - window.scrollY - rect.top) * HEIGHT_RATIO);
    
    if (button === 0 && !mouseDown) {
        mouseDown = true;
        mousePressed = true;
    }
});

window.addEventListener("mouseup", function (event) {
    var rect = canvas.getBoundingClientRect();
    var button = event.button;
    
    event.preventDefault();
    
    if (button === 0 && mouseDown) {
        mouseDown = false;
        mouseReleased = true;
    }
});

window.addEventListener("mousemove", function (event) {
    var rect = canvas.getBoundingClientRect();
    
    mouseX = Math.floor((event.pageX - window.scrollX - rect.left) * WIDTH_RATIO);
    mouseY = Math.floor((event.pageY - window.scrollY - rect.top) * HEIGHT_RATIO);
});

function updateInput() {
    mousePressed = false;
    mouseReleased = false;
}

function resizeHandler() {//return;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var c = canvas;
    var sw = c.width;
    var sh = c.height;
    
    var r = w / h;
    var sr = sw / sh;
    
    if (r > sr) {
        sw *= h / sh;
        sh = h;
    } else {
        sh *= w / sw;
        sw = w;
    }
    
    WIDTH_RATIO = c.width / sw;
    HEIGHT_RATIO = c.height / sh;
    
    c.style.width = Math.floor(sw) + "px";
    c.style.height = Math.floor(sh) + "px";
    document.getElementById("top-div").style.marginTop = Math.floor((h - sh) / 2) + "px";
};

function drawMusicIcon(x, y) {
    var size = 32;
    var cx = x + size / 2 + 4;
    var cy = y + size / 2;
    
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 10 + 2 + 2 + 1);
    ctx.lineTo(cx - 8 + 12 - 1, cy - 10 + 2 + 1);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 10 + 1 + 2 + 1);
    ctx.lineTo(cx - 8, cy - 10 + 14 + 1 + 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(cx - 8 + 12 - 1, cy - 10 + 1 + 1);
    ctx.lineTo(cx - 8 + 12 - 1, cy - 10 + 14 + 1 + 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(cx - 11 + 1, cy + 6 - 1, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(cx - 11 + 12 + 1 - 1, cy + 6 - 1, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx - 3, cy + 1 - 1, size / 2 - 4 + 2 + 2, 0, 2 * Math.PI);
    ctx.stroke();
    
    if (!MUSIC) {
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(cx - 13, cy + 13);
        ctx.lineTo(cx + 10, cy - 10);
        ctx.stroke();
    }
}

function toggleMusic() {
    if (!musicLoaded) {
        return;
    }
    
    MUSIC = !MUSIC;
    if (MUSIC) {
        music.volume = 1;
    } else {
        music.volume = 0;
    }
    
    saveGameState();
}
