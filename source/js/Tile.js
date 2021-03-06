function Tile(service, settings) {
    this.service = service;
    this.settings = settings;

    if (this.settings.mode === "testing") {
        return;
    }

    this.name = settings.name ? settings.name : "tilename";

    this.image = settings.image;

    this.src = settings.src;

    // if (this.src === null) {this.image === "no image!";}

    this.tileWidth = settings.tileWidth ? settings.tileWidth : 0;
    this.tileHeight = settings.tileHeight ? settings.tileHeight : 0;

    this.spriteWidth = settings.spriteWidth ? settings.spriteWidth : this.tileWidth;
    this.spriteHeight = settings.spriteHeight ? settings.spriteHeight : this.tileHeight;

    this.renderWidth = settings.renderWidth ? settings.renderWidth : this.tileWidth;
    this.renderHeight = settings.renderHeight ? settings.renderHeight : this.tileHeight;

    this.spriteCol = settings.spriteCol ? settings.spriteCol : 0;
    this.spriteRow = settings.spriteRow ? settings.spriteRow : 0;

    this.numberOfFrames = settings.numberOfFrames ? settings.numberOfFrames : 1;

    this.updateFrequency = settings.updateFrequency ? settings.updateFrequency : null;

    this.loop = settings.loop === undefined ? true : settings.loop;

    this.pause = settings.pause === undefined ? false : settings.pause;

    this.alpha = settings.alpha ? settings.alpha : 1;

    this.renderX = settings.renderX ? settings.renderX : 0;
    this.renderY = settings.renderY ? settings.renderY : 0;

    // Animation
    this.animationCounter = 0;

    this.spriteOffset = 0;

    // 
    this.tick = 0;
}

Tile.prototype.pointerInside = function() {
    let x = this.service.listeners.mousePositionX;
    let y = this.service.listeners.mousePositionY;

    return x > this.renderX && y > this.renderY && x < (this.renderX + this.renderWidth) && y < (this.renderY + this.renderHeight);
}

Tile.prototype.setFrame = function(framenumber) {
    this.animationCounter = framenumber;
    this.spriteOffset = framenumber * this.spriteWidth;
}

Tile.prototype.copy = function() {
    let tileCopy = new Tile(this.service, {
        name: this.name,
        image: this.image,
        renderX: this.renderX,
        renderY: this.renderY,
        renderWidth: this.renderWidth,
        renderHeight: this.renderHeight,
        tileWidth: this.tileWidth,
        tileHeight: this.tileHeight,
        spriteWidth: this.spriteWidth,
        spriteHeight: this.spriteHeight,
        spriteCol: this.spriteCol,
        spriteRow: this.spriteRow,
        numberOfFrames: this.numberOfFrames,
        updateFrequency: this.updateFrequency,
        loop: this.loop,
        pause: this.pause,
        alpha: this.alpha
    });

    return tileCopy;
}

Tile.prototype.update = function() {
    this.tick += 1;

    // Dont update if animation is paused
    if (this.pause === true) {
        return;
    }

    // No need to update if only one frame!
    if (this.numberOfFrames === 1) {
        return;
    }

    if (this.tick % this.updateFrequency === 0) {
        this.animationCounter += 1;

        this.spriteOffset = this.spriteWidth * (this.animationCounter % this.numberOfFrames);

        // If no looping and at the first frame of the animation -> pause animation
        if (this.loop === false && this.animationCounter % this.numberOfFrames === 0) {
            this.pause = true;
        }
    }
}

Tile.prototype.render = function(context, rX, rY) {
    // Do not render if tile has no image
    if (this.image === undefined || this.image === "-") {
        // console.log("no image!");

        return;
    }

    rX = rX ? rX : 0;
    rY = rY ? rY : 0;

    let xInImage = this.spriteCol * this.tileWidth + this.spriteOffset;
    let yInImage = this.spriteRow * this.tileHeight;

    context.save();

    context.globalAlpha = this.alpha;

    context.drawImage(
        this.image,
        Math.round(xInImage),
        Math.round(yInImage),
        Math.round(this.tileWidth),
        Math.round(this.tileHeight),
        Math.round(rX + this.renderX),
        Math.round(rY + this.renderY),
        Math.round(this.renderWidth),
        Math.round(this.renderHeight)
    );

    context.restore();
}

module.exports = Tile;
