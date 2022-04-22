function Disk(x, y) {
    this.x = x;
    this.y = y;
    this.popped = false;
    this.direction = Math.floor(Math.random() * 2 * Math.PI);
    this.startRadius = incrInitialRadius;
    this.radius = this.startRadius;
    this.color = { r: diskColor.r, g: diskColor.g, b: diskColor.b };
    this.lifetime = 0;
    this.dying = false;
    this.dead = false;
    this.score = 0;
    this.depth = 0;
    this.tween = new Tween(0.8, 15);
    this.chain = 0;
    
    if (shopRainbow) {
        var r = Math.floor(Math.random() * 220);
        var g = Math.floor(Math.random() * 220);
        var b = Math.floor(Math.random() * 220);
        this.color = { r: r, g: g, b: b };
    }
}

Disk.prototype.update = function () {
    if (this.dead) return;
    
    if (this.popped) {
        if (this.dying) {
            if (this.radius > 0) {
                this.radius -= 1;
            } else {
                this.dead = true;
            }
        } else {
            var value = this.tween.get();
            this.radius = incrRadius - value;
        }
        
        if (this.lifetime < incrLifetime) {
            this.lifetime += 1;
        } else {
            this.dying = true;
        }
    } else {
        this.x += Math.cos(this.direction) * incrSpeed;
        this.y -= Math.sin(this.direction) * incrSpeed;
        
        if (this.x < areaX || areaX + areaWidth <= this.x) {
            this.direction = (3 * Math.PI - this.direction) % (2 * Math.PI);
        }
        if (this.y < areaY || areaY + areaHeight <= this.y) {
            this.direction = (2 * Math.PI - this.direction) % (2 * Math.PI);
        }
        
        for (var i = 0; i < disks.length; i++) {
            var that = disks[i];
            if (that.popped && !that.dying) {
                var dx = this.x - that.x;
                var dy = this.y - that.y;
                
                if (Math.sqrt(dx * dx + dy * dy) < this.radius + that.radius) {
                    popCount += 1;
                    this.popped = true;
                    this.depth = popCount;
                    this.score = that.score * incrMultiplier;
                    this.chain = that.chain + 1;
                    /*this.color.r = Math.max(0, that.color.r - 10);
                    this.color.g = Math.max(0, that.color.g - 10);
                    this.color.b = Math.max(0, that.color.b - 10);*/
                    this.tween.set(incrRadius - this.startRadius);
                    extraMoney += Math.floor(this.score);
                    break;
                }
            }
        }
    }
    
    var offset = this.popped ? 4 : 2;
    
    ctx.globalAlpha = this.popped ? 0.3 : 0.2;
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x + offset, this.y + offset, Math.max(0, this.radius), 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    ctx.fillStyle = "rgb(" + this.color.r + ", " + this.color.g + ", " + this.color.b + ")";
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0, this.radius), 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.globalAlpha = 0//.8;
    ctx.lineWidth = this.popped ? 4 : 2;
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0, this.radius), 0, 2 * Math.PI);
    ctx.stroke();
    ctx.globalAlpha = 1;
    
    if (this.popped && !this.dying) {
        var val = formatMoney(Math.floor(this.score));
        
        ctx.font = (val.length < 8 ? 18 : 14) + "px gamefont, sans-serif";
        ctx.textAlign = "center";
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "black"
        ctx.fillText(val, this.x + 2, this.y + 2 + 7);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        ctx.fillText(val, this.x, this.y + 7);
    }
};
