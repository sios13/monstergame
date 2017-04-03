function Map(x, y, collisionMap, gridSize, layer1Src, layer2Src, audioSrc, tiles) {
    this.x = x;
    this.y = y;

    this.collisionMap = collisionMap;

    this.gridSize = gridSize;

    this.isLoading = true;

    this.tickCounter = 0;

    this.loadCounter = 0;

    this.loadCounterFinish = 3;

    function loadEvent() {
        this.loadCounter += 1;
    }

    this.layer1Image = new Image();
    this.layer1Image.addEventListener("load", loadEvent.bind(this));
    this.layer1Image.src = layer1Src;

    this.layer2Image = new Image();
    this.layer2Image.addEventListener("load", loadEvent.bind(this));
    this.layer2Image.src = layer2Src;

    this.audio = new Audio(audioSrc);
    this.audio.addEventListener("loadeddata", loadEvent.bind(this));
    this.audio.loop = true;

    this.tiles = tiles;
    for (let i = 0; i < this.tiles.length; i++) {
        let src = this.tiles[i].img;

        this.tiles[i].img = new Image();
        this.tiles[i].img.addEventListener("load", loadEvent.bind(this));
        this.tiles[i].img.src = src;

        this.loadCounterFinish += 1;
    }
}

Map.prototype.attachEvent = function(col, row, event) {
    this.collisionMap[row][col] = event;
}

Map.prototype.getEvent = function(col, row) {
    return this.collisionMap[row][col];
}

Map.prototype.update = function(game) {
    if (this.loadCounter === this.loadCounterFinish) {
        this.isLoading = false;

        this.audio.play();
    }

    if (this.isLoading) {
        return;
    }

    this.tickCounter += 1;

    // Update map position
    this.x = game.coolguy.mapX - game.coolguy.x;
    this.y = game.coolguy.mapY - game.coolguy.y;
}

Map.prototype.renderTile = function(context, x, y) {
    for (let i = 0; i < this.tiles.length; i++) {
        if (this.tiles.x === x && this.tiles.y === y) {
            let tile = this.tiles[i];

            context.drawImage(tile.img, 0, 0, 16, 16, this.x + tile.x, this.y + tile.y, tile.width, tile.height);
        }
    }
}

Map.prototype.renderTiles = function(context) {
    for (let i = 0; i < this.tiles.length; i++) {
        let tile = this.tiles[i];

        context.beginPath();
        context.drawImage(tile.img, 0, 0, 16, 16, this.x + tile.x, this.y + tile.y, tile.width, tile.height);
        // context.rect(this.x + tile.x, this.y + tile.y, 32, 32);
        context.stroke();
    }
}

Map.prototype.render = function(context) {
    for (let y = 0; y < this.collisionMap.length; y++) {
        for (let x = 0; x < this.collisionMap[y].length; x++) {
            if (this.collisionMap[y][x] !== 0) {
                context.beginPath();
                context.rect(this.x + x*this.gridSize, this.y + y*this.gridSize, this.gridSize, this.gridSize);
                context.stroke();
            }
        }
    }

    context.beginPath();
    context.fillStyle = "rgba(0, 0, 0, " + (1 - this.tickCounter/20) + ")";
    context.fillRect(0, 0, 10000, 10000);
    context.stroke();
}

Map.prototype.renderLayer1 = function(context) {
    context.drawImage(this.layer1Image, this.x, this.y);
}

Map.prototype.renderLayer2 = function(context) {
    context.drawImage(this.layer2Image, this.x, this.y);
}

Map.prototype.destroy = function() {
    this.audio.pause();
}

module.exports = Map;
