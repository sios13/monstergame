function Tile(renderCol, renderRow, renderWidth, renderHeight, spriteCol, spriteRow, tileWidth, tileHeight, offset, numberOfFrames, image) {
    // new Tile(
    //     14, // column where to render
    //     30, // row where to render
    //     32, // render width
    //     32, // render height
    //     1,  // col of tile in spirte
    //     3,  // row of tile in sprite
    //     16, // width of tile in sprite
    //     16, // height of tile in sprite
    //     96, // width of a sprite
    //     128,// height of a sprite
    //     "img/Sea.png" // sprite or sprites src
    // )
    this.renderCol = renderCol;
    this.renderRow = renderRow;

    this.renderWidth = renderWidth;
    this.renderHeight = renderHeight;

    this.spriteCol = spriteCol;
    this.spriteRow = spriteRow;

    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    
    this.offset = offset;

    this.numberOfFrames = numberOfFrames;

    this.image = image;

    // Initialize sprite
    // function loadEvent() {this.loadCounter += 1;}

    // this.loadCoutner = 0;

    // this.loadCounterFinish = 1;

    // this.image = new Image();
    // this.image.addEventListener("load", loadEvent.bind(this));
    // this.image.src = imageSrc;

    // Animation
    this.animationCounter = 0;

    this.spriteOffset = 0;
}

/**
 * Returns true if tile has been loaded
 */
Map.prototype.isLoaded = function() {
    if (this.loadCounter === this.loadCounterFinish) {
        return true;
    }

    return false;
}

Tile.prototype.update = function(game) {
    if (game.tickCounter % 5 === 0) {
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
