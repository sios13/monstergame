function Tile(settings) {
    this.name = settings.name ? settings.name : "hehe";

    this.src = settings.src;

    this.placeholderImage = settings.placeholderImage;

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

    this.renderCol = settings.renderCol ? settings.renderCol : 0;
    this.renderRow = settings.renderRow ? settings.renderRow : 0;

    this.renderX = settings.renderX ? settings.renderX : 0;
    this.renderY = settings.renderY ? settings.renderY : 0;

    // Animation
    this.animationCounter = 0;

    this.spriteOffset = 0;

    // 
    this.tick = 0;
}

Tile.prototype.setFrame = function(framenumber) {
    this.animationCounter = framenumber;
    this.spriteOffset = framenumber * this.spriteWidth;
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

Tile.prototype.render = function(context, mapX, mapY) {
    mapX = mapX ? mapX : this.service.map.x;
    mapY = mapY ? mapY : this.service.map.y;

    let xInImage = this.spriteCol * this.tileWidth + this.spriteOffset;
    let yInImage = this.spriteRow * this.tileHeight;

    let renderX = this.renderCol ? this.renderCol * 32 : this.renderX;
    let renderY = this.renderRow ? this.renderRow * 32 : this.renderY;

    context.save();

    context.globalAlpha = this.alpha;

    context.drawImage(
        this.image ? this.image : this.placeholderImage,
        xInImage,
        yInImage,
        this.tileWidth,
        this.tileHeight,
        mapX + renderX,
        mapY + renderY,
        this.renderWidth,
        this.renderHeight
    );

    context.restore();
}

module.exports = Tile;
