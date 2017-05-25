function Map(service, settings) {
    this.service = service;

    this.x = settings.x ? settings.x : 0;
    this.y = settings.y ? settings.y : 0;

    this.collisionMap = settings.collisionMap;

    this.gridSize = settings.gridSize ? settings.gridSize : 32;

    this.layer1Tile = settings.layer1Tile;

    this.layer2Tile = settings.layer2Tile;

    this.audio = settings.audio;
    this.audio.loop = true;
    // this.audio.play();

    this.tiles = settings.tiles;
}

Map.prototype.attachEvent = function(col, row, event) {
    this.collisionMap[row][col] = event;
}

Map.prototype.getEvent = function(col, row) {
    return this.collisionMap[row][col];
}

Map.prototype.update = function() {
    // Update map position
    this.x = this.service.coolguy.canvasX - this.service.coolguy.x;
    this.y = this.service.coolguy.canvasY - this.service.coolguy.y;

    for (let i = 0; i < this.tiles.length; i++) {
        this.tiles[i].update();
    }
}

Map.prototype.renderLayer1 = function() {
    let context = this.service.worldContext;

    this.layer1Tile.render(context, this.x, this.y);

    /**
     * Render tiles!
     */
    for (let i = 0; i < this.tiles.length; i++) {
        this.tiles[i].render(context, this.x, this.y);
    }
}

Map.prototype.renderLayer2 = function() {
    let context = this.service.worldContext;

    if (this.layer2Tile !== undefined) {
        this.layer2Tile.render(context, this.x, this.y);
    }

    /**
     * Render squares!
     */
    for (let y = 0; y < this.collisionMap.length; y++) {
        for (let x = 0; x < this.collisionMap[y].length; x++) {
            if (this.collisionMap[y][x] !== 0) {
                // context.beginPath();
                // context.rect(this.x + x*32, this.y + y*32, 32, 32);
                // context.stroke();
            }
        }
    }
}

module.exports = Map;
