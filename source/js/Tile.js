function Tile(x, y, width, height, image) {
    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;

    this.image = image;

    this.animationCounter = 0;

    function loadEvent() {this.loadCounter += 1;}

    this.loadCoutner = 0;

    this.loadCounterFinish = 1;

    let src = image;
    this.image = new Image();
    this.image.addEventListener("load", loadEvent.bind(this));
    this.image.src = src;

    this.imageIndex = 0;
}

/**
 * Returns true if tile has been loaded
 */
Map.prototype.isLoaded = function() {
    if (this.loadCounter === this.images.length) {
        return true;
    }

    return false;
}

Tile.prototype.update = function(game) {
    if (game.tickCounter % 15 === 0) {
        this.animationCounter += 1;

        this.imageIndex = this.animationCounter % 4;
    }
}

Tile.prototype.render = function(context, mapX, mapY) {
    context.drawImage(this.image, this.imageIndex*32, 0, 32, 32, mapX + this.x, mapY + this.y, this.width, this.height);

    // context.beginPath();
    // context.rect(mapX + this.x, mapY + this.y, this.width, this.height);
    // context.stroke();
}

module.exports = Tile;
