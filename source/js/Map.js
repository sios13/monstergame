function Map(service, settings) {
    this.service = service;

    this.x = settings.x ? settings.x : 0;
    this.y = settings.y ? settings.y : 0;

    this.collisionMap = settings.collisionMap;

    this.gridSize = settings.gridSize ? settings.gridSize : 32;

    this.layer1Image = this.service.resources.images.find(x => x.getAttribute("src") === settings.layer1Src);

    this.layer2Image = this.service.resources.images.find(x => x.getAttribute("src") === settings.layer2Src);

    this.audio = this.service.resources.audios.find(x => x.getAttribute("src") === settings.audioSrc);
    this.audio.loop = true;
    this.audio.play();

    // this.layer1Image = new Image();
    // this.layer1Image.addEventListener("load", loadEvent.bind(this));
    // this.layer1Image.src = layer1Src;

    // this.layer2Image = new Image();
    // this.layer2Image.addEventListener("load", loadEvent.bind(this));
    // this.layer2Image.src = layer2Src;

    // this.audio = new Audio(audioSrc);
    // this.audio.addEventListener("loadeddata", loadEvent.bind(this));
    // this.audio.loop = true;
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
