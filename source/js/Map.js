function Map(x, y, collisionMap, gridSize, layer1Src, layer2Src, audioSrc) {
    this.x = x;
    this.y = y;

    this.collisionMap = collisionMap;

    this.gridSize = gridSize;

    this.layer1Image = new Image();
    this.layer1Image.src = layer1Src;

    this.layer2Image = new Image();
    this.layer2Image.src = layer2Src;

    this.audio = new Audio(audioSrc);
    this.audio.loop = true;
    this.audio.play();
}

Map.prototype.attachEvent = function(col, row, event) {
    this.collisionMap[row][col] = event;
}

Map.prototype.getEvent = function(col, row) {
    return this.collisionMap[row][col];
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
