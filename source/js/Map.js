function Map(x, y, collisionMap, gridSize, layer1Src, layer2Src, audioSrc) {
    this.x = x;
    this.y = y;

    this.collisionMap = collisionMap;

    this.gridSize = gridSize;

    this.isLoading = true;

    this.tickCounter = 0;

    this.loadCounter = 0;

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
    this.audio.play();

    // The tick at which this map was born and fully loaded
    // this.spawnTick = null;
}

Map.prototype.attachEvent = function(col, row, event) {
    this.collisionMap[row][col] = event;
}

Map.prototype.getEvent = function(col, row) {
    return this.collisionMap[row][col];
}

Map.prototype.update = function(game) {
    if (this.loadCounter === 3) {
        this.isLoading = false;
    }

    if (!this.isLoading) {
        this.tickCounter += 1;

        // Update map position
        this.x = game.coolguy.mapX - game.coolguy.x;
        this.y = game.coolguy.mapY - game.coolguy.y;
    }
}

Map.prototype.render = function(context) {
    for (let y = 0; y < this.collisionMap.length; y++) {
        for (let x = 0; x < this.collisionMap[y].length; x++) {
            if (this.collisionMap[y][x] === 1) {
                // context.beginPath();
                // context.rect(this.x + x*this.gridSize, this.y + y*this.gridSize, this.gridSize, this.gridSize);
                // context.stroke();
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
