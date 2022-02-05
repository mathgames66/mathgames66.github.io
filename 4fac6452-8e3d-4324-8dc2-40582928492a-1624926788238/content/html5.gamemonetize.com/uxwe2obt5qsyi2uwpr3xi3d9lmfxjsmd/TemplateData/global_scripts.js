window.onload = function(){
    window.onresize = function () {

        var game = document.getElementById("unity-canvas");
        console.log('game '+game);
        if (game == null)
            return;
    
        var width = window.innerWidth;
        var height = window.innerHeight;

        console.trace("WIDTH AND HEIGHT = " + width + "x" + height);
        // Determine game size
        var w = width;
        var h = w * height / width;

        /* Landscape mode
        var scaleFactor = 16 / 9;
        if (w / h > scaleFactor) {
            w = h / 9 * 16;
        } else {
            h = w / 16 * 9;
        }*/
        
        // Portrait mode
        var scaleFactor = 9 / 16;
        if (w / h > scaleFactor) {
            w = h / 16 * 9;
        } else {
            h = w / 9 * 16;
        }
        
        
        // Resize game
        game.style.width = w + "px";
        game.style.height = h + "px";
    };
    
    window.onresize();
    window.onclick = function () {
        window.focus();
    };
};