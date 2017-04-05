function Tile(x, y, width, height, images) {
    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;

    this.images = images;

    this.animationCounter = 0;

    this.loadCoutner = 0;

    function loadEvent() {this.loadCounter += 1;}

    // for (let i = 0; i < this.images.length; i++) {
    //     let src = this.images[i];

    //     this.images[i] = new Image();
    //     this.images[i].addEventListener("load", loadEvent);
    //     this.images[i].src = src;
    // }
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
    if (game.tickCounter % 3 === 0) {
        this.animationCounter += 1;
    }


}

Tile.prototype.render = function(context, mapX, mapY) {
    // console.log(this.x + ":" + this.y + ":" + this.width + ":" + this.height);
    let imageIndex = this.animationCounter % 2;

    // context.drawImage(this.images[imageIndex], 0, 0, 16, 16, maxX + this.x, maxY + this.y, this.width, this.height);

    // context.beginPath();
    // context.rect(mapX + this.x, mapY + this.y, this.width, this.height);
    // context.stroke();
}

module.exports = Tile;
