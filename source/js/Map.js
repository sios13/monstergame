function Map(x, y, collisionMap, gridSize, layer1Src, layer2Src, audioSrc, tiles) {
    this.x = x;
    this.y = y;

    this.collisionMap = collisionMap;

    this.gridSize = gridSize;

    // this.isLoading = true;

    this.tickCounter = 0;

    this.loadCounter = 0;

    this.loadCounterFinish = 3;

    function loadEvent() {this.loadCounter += 1;}

    this.layer1Image = new Image();
    this.layer1Image.addEventListener("load", loadEvent.bind(this));
    this.layer1Image.src = layer1Src;

    this.layer2Image = new Image();
    this.layer2Image.addEventListener("load", loadEvent.bind(this));
    this.layer2Image.src = layer2Src;

    this.audio = new Audio(audioSrc);
    this.audio.addEventListener("loadeddata", loadEvent.bind(this));
    this.audio.loop = true;
    this.audio.play();

    this.tiles = tiles;
}

/**
 * Returns true if map has been loaded
 */
Map.prototype.isLoaded = function() {
    if (this.loadCounter === this.loadCounterFinish) {
        return true;
    }

    return false;
}

Map.prototype.attachEvent = function(col, row, event) {
    this.collisionMap[row][col] = event;
}

Map.prototype.getEvent = function(col, row) {
    return this.collisionMap[row][col];
}

Map.prototype.update = function(game) {
    this.tickCounter += 1;

    // Update map position
    this.x = game.coolguy.canvasX - game.coolguy.x;
    this.y = game.coolguy.canvasY - game.coolguy.y;

    for (let i = 0; i < this.tiles.length; i++) {
        this.tiles[i].update(game);
    }
}

Map.prototype.renderTiles = function(context) {
    for (let i = 0; i < this.tiles.length; i++) {
        this.tiles[i].render(context, this.x, this.y);
    }
}

Map.prototype.render = function(context) {
    for (let y = 0; y < this.collisionMap.length; y++) {
        for (let x = 0; x < this.collisionMap[y].length; x++) {
            if (this.collisionMap[y][x] !== 0) {
                // context.beginPath();
                // context.rect(this.x + x*this.gridSize, this.y + y*this.gridSize, this.gridSize, this.gridSize);
                // context.stroke();
            }
        }
    }
}

Map.prototype.renderLayer1 = function(context) {
    context.beginPath();
    context.fillStyle = "rgb(255, 255, 255)";
    context.fillRect(this.x, this.y, 580, 450);
    context.stroke();

    context.drawImage(this.layer1Image, this.x, this.y);
}

Map.prototype.renderLayer2 = function(context) {
    context.drawImage(this.layer2Image, this.x, this.y);
}

Map.prototype.destroy = function() {
    this.audio.pause();
}

module.exports = Map;
