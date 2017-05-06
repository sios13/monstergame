const Tile = require("./Tile.js");

function Loader(service, settings)
{
    this.service = service;

    this.service.resources = {};
    
    this.tick = 0;

    this.endTick = null;

    // this.loadCounter = 0;

    // this.loadEvent = function() {
    //     this.loadCounter += 1;

    //     if (this.loadCounter === this.images.length + this.audios.length) {
    //         this.endTick = this.tick + 30;
    //     }
    // }.bind(this);

    this.tiles = [];
    // when an image has been loaded -> give the image to all associated tiles (tiles with the same src)
    this.images = [];

    this.audios = [];
}

Loader.prototype._loadAudios = function() {
    let audioSrcs = [
        "audio/music1.mp3"
    ];

    for (let i = 0; i < audioSrcs.length; i++) {
        let audio = new Audio(audioSrcs[i]);
        this.audios.push(audio);
    }

    this.service.resources.audios = this.audios;
}

Load.prototype._loadImages = function() {
    // List of all image srcs to ever be used in the game
    let imageSrcs = [];

    // Create image elements for all images
    for (let i = 0; i < imageSrcs.length; i++) {
        let image = new Image();
        image.src = imageSrcs[i];
        this.images.push(image);
    }
}

Loader.prototype._getImage = function(imageSrc) {
    let image = new Image();

    image.src = imageSrc;

    return image;
}

Loader.prototype._loadTiles = function() {
    // Takes a sprite and return tiles
    let spriteToTiles = function(sprite) {
        let tiles = [];

        for (let y = 0; y < sprite.spriteHeight/sprite.tileHeight; y++) {
            for (let x = 0; x < sprite.spriteWidth/sprite.tileWidth; x++) {
                let tile = new Tile(Object.assign({placeholderImage: placeholderImage}, sprite, {
                    name: sprite.name + "(" + x + "," + y + ")",
                    spriteCol: x,
                    spriteRow: y
                }));

                tiles.push(tile);
            }
        }

        return tiles;
    };

    let seaSprite = {
        name: "sea",
        image: this._getImage("img/Sea.png"),
        tileWidth: 16,
        tileHeight: 16,
        spriteWidth: 96,
        spriteHeight: 128,
        renderWidth: 32,
        renderHeight: 32,
        numberOfFrames: 8,
        updateFrequency: 7,
    };

    let map1layer1Tile = new Tile({name: "map1layer1", image: this._getImage("img/map1layer1.png"), tileWidth: 3200, tileHeight: 3200});
    let map1layer2Tile = new Tile({name: "map1layer2", image: this._getImage("img/map1layer2.png"), tileWidth: 3200, tileHeight: 3200});

    let tiles = [];

    tiles.push(...spriteToTiles(seaSprite));
    tiles.push(map1layer1Tile);
    tiles.push(map1layer2Tile);

    this.service.resources.tiles = tiles;
}

/**
 * Starts a new loading
 */
Loader.prototype.load = function(callable)
{
    this.tick = 0;

    this.loading = true;

    this.loadCallable = callable;
}

Loader.prototype.update = function()
{
    this.tick += 1;

    // If there is no loading currently happening -> exit
    if (this.loading === false) {
        return;
    }
    
    // Start the actual loading only if 30 ticks have passed
    if (this.tick < 30) {
        return;
    }

    this._loadTiles();

    this._loadAudios();

    this.service.events.push(this.loadCallable);

    // If a tile is loading -> exit
    for (let i = 0; i < this.tiles.length; i++) {
        if (this.tiles[i].loading === true) {
            return;
        }
    }

    // If an audio is loading -> exit
    for (let i = 0; i < this.audios.length; i++) {
        if (this.audios[i].readyState !== 4) {
            return;
        }
    }
    
    // If everything is loaded -> stop loading and set end tick
    this.loading = false;

    this.endTick = this.tick + 30;
}

Loader.prototype.render = function(context)
{
    context.beginPath();

    context.fillStyle = "rgba(0, 0, 0, " + this.tick + ")";
    context.fillRect(0, 0, 2000, 2000);
    context.stroke();

    context.font = "26px Georgia";
    context.fillStyle = "#DDDDDD";
    context.fillText("Loading!", context.canvas.width/2 - 50, context.canvas.height/2 - 10);
}

module.exports = Loader;
