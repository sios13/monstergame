function Tile(settings) {
    // renderCol, renderRow, renderWidth, renderHeight, spriteCol, spriteRow, tileWidth, tileHeight, offset, numberOfFrames, updateFrequency, image
    this.renderCol = settings.renderCol;
    this.renderRow = settings.renderRow;

    this.renderWidth = settings.renderWidth;
    this.renderHeight = settings.renderHeight;

    this.spriteCol = settings.spriteCol;
    this.spriteRow = settings.spriteRow;

    this.tileWidth = settings.tileWidth;
    this.tileHeight = settings.tileHeight;
    
    this.offset = settings.offset ? settings.offset : 0;

    this.numberOfFrames = settings.numberOfFrames;

    this.updateFrequency = settings.updateFrequency ? settings.updateFrequency : 0;

    this.image = new Image();
    this.image.src = settings.src;

    // Animation
    this.animationCounter = 0;

    this.spriteOffset = 0;
}

/**
 * Returns true if tile has been loaded
 */
Tile.prototype.isLoaded = function() {
    if (this.loadCounter === this.loadCounterFinish) {
        return true;
    }

    return false;
}

Tile.prototype.update = function(game) {
    // No need to update if only one frame!
    if (this.numberOfFrames === 1) {
        return;
    }

    if (game.tickCounter % this.updateFrequency === 0) {
        this.animationCounter += 1;

        this.spriteOffset = this.offset * (this.animationCounter % this.numberOfFrames);
    }
}

Tile.prototype.render = function(context, mapX, mapY) {
    let xInImage = this.spriteCol * this.tileWidth + this.spriteOffset;
    let yInImage = this.spriteRow * this.tileHeight;

    let renderX = this.renderCol * 32; // Assuming game tile width is 32
    let renderY = this.renderRow * 32; // Assuming game tile height is 32

    context.drawImage(this.image, xInImage, yInImage, this.tileWidth, this.tileHeight, mapX + renderX, mapY + renderY, this.renderWidth, this.renderHeight);
}

module.exports = Tile;
