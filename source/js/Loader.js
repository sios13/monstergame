const Tile = require("./Tile.js");

function Loader(service, settings)
{
    this.service = service;
    
    this.tick = 0;

    this.endTick = null;

    this.loadEssentialCounter = 0;

    this.loadEvent = function() {
        this.loadEssentialCounter += 1;

        if (this.loadEssentialCounter === this.images.length + this.audios.length) {
            this.endTick = this.tick + 30;
        }
    }.bind(this);

    this.tiles = [];

    // this.images = [
    //     "img/character7_walking.png",
    //     "img/Sea.png",
    //     "img/map1layer1.png",
    //     "img/map1layer2.png"
    // ];

    this.audios = [
        "audio/music1.mp3"
    ];

    this.loadEssentialResources();
}

Loader.prototype._loadTiles = function() {
    // Takes a sprite and return tiles
    let spriteToTiles = function(sprite) {
        let tiles = [];

        for (let y = 0; y < sprite.spriteHeight/sprite.tileHeight; y++) {
            for (let x = 0; x < sprite.spriteWidth/sprite.tileWidth; x++) {
                let tile = new Tile(Object.assign(seaSprite, {
                    spriteCol: x,
                    spriteRow: y
                }));
            }
        }

        return tiles;
    };

    let seaSprite = {
        src: "img/Sea.png",
        tileWidth: 16,
        tileHeight: 16,
        spriteWidth: 96,
        spriteHeight: 128,
        numberOfFrames: 8,
        updateFrequency: 7,
        renderWidth: 32,
        renderHeight: 32,
    };

    let tiles = [];
    
    tiles.push(spriteToTiles(seaSprite));
}

Loader.prototype.loadEssentialResources = function() {
    // Load tiles
    this._loadTiles();
    // for (let i = 0; i < this.images.length; i++) {
    //     let src = this.images[i];
    //     this.images[i] = new Image();
    //     this.images[i].addEventListener("load", this.loadEvent);
    //     this.images[i].src = src;
    // }

    // Load audios
    for (let i = 0; i < this.audios.length; i++) {
        let src = this.audios[i];
        this.audios[i] = new Audio();
        this.audios[i].addEventListener("loadeddata", this.loadEvent);
        this.audios[i].src = src;
    }

    this.service.resources = {};

    this.service.resources.images = this.images;
    this.service.resources.audios = this.audios;
}

/**
 * Starts a new loading
 */
Loader.prototype.load = function(callable)
{
    this.tick = 0;

    this.endTick = null;

    this.loadCallable = callable;
}

Loader.prototype.update = function()
{
    this.tick += 1;

    // Do not update while essential resources is loading
    if (this.loadEssentialCounter !== this.images.length + this.audios.length) {
        return;
    }

    // If 30 ticks have passed since loading started -> add the callable to the events queue
    if (this.tick === 30) {
        console.log(this.images);

        this.service.events.push(this.loadCallable);

        this.endTick = this.tick;
    }
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
