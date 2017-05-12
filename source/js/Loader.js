const Tile = require("./Tile.js");

function Loader(service, settings)
{
    this.service = service;

    this.service.resources = {};
    this.service.resources.tiles = [];
    this.service.resources.monsters = [];

    this.service.resources.getTile = function(tilename, renderX, renderY, renderWidth, renderHeight) {
        let tile = this.service.resources.tiles.find(tile => tile.name === tilename);

        // Where to render tile
        tile.renderX = renderX;
        tile.renderY = renderY;

        // Render size
        tile.renderWidth = renderWidth;
        tile.renderHeight = renderHeight;

        return tile;
    }.bind(this);
    
    this.tick = 0;

    this.endTick = null;

    this.placeholderImage = new Image();
    this.placeholderImage.src = "img/placeholder.png";

    this.loading = false;

    this.loadCallable1 = null;
    this.loadCallable2 = null;
    this.loadCallable3 = null;

    /**
     * Create the tiles
     */
    this._createTiles();

    /**
     * Add the images to the tiles
     */

    this._loadImages();

    this._loadAudios();
}

Loader.prototype._loadAudios = function() {
    let audiosSrc = [
        "audio/music1.mp3",
        "audio/music2.mp3"
    ];

    let audios = [];

    for (let i = 0; i < audiosSrc.length; i++) {
        let audio = new Audio(audiosSrc[i]);
        audios.push(audio);
    }

    this.service.resources.audios = audios;
}

/**
 * Iterate all tiles and load their image srcs
 */
Loader.prototype._loadImages = function() {
    // Create a unique array of all images used in the game
    let imagesSrc = [];

    for (let i = 0; i < this.service.resources.tiles.length; i++) {
        let tile = this.service.resources.tiles[i];

        imagesSrc.push(tile.src);
    }

    imagesSrc = [...new Set(imagesSrc)];

    // Create an image element for every src
    for (let i = 0; i < imagesSrc.length; i++) {
        let imageSrc = imagesSrc[i];

        let image = new Image();

        // When the image has finished loading...
        image.addEventListener("load", function(event) {
            let img = event.target;

            // ...add the image element to all tiles with the same src
            for (let i = 0; i < this.service.resources.tiles.length; i++) {
                let tile = this.service.resources.tiles[i];

                if (tile.src === img.getAttribute("src")) {
                    tile.image = img;
                }
            }
        }.bind(this));

        image.src = imageSrc;
    }
}

Loader.prototype._createTiles = function() {
    /**
     * Sprites
     * (Sprite has many tiles)
     */
    // Takes a sprite and return tiles
    let spriteToTiles = function(sprite) {
        let tiles = [];

        for (let y = 0; y < sprite.spriteHeight/sprite.tileHeight; y++) {
            for (let x = 0; x < sprite.spriteWidth/sprite.tileWidth; x++) {
                let tile = new Tile(Object.assign({}, sprite, {
                    // placeholderImage: this.placeholderImage,
                    name: sprite.name + "(" + x + "," + y + ")",
                    spriteCol: x,
                    spriteRow: y
                }));
                tiles.push(tile);
            }
        }

        return tiles;
    }.bind(this);

    let sprites = require("./resources/sprites.json");

    for (let i = 0; i < sprites.length; i++) {
        let tiles = spriteToTiles(sprites[i]);

        this.service.resources.tiles.push(...tiles);
    }

    /**
     * Tiles
     */
    let tiles = require("./resources/tiles.json");

    for (let i = 0; i < tiles.length; i++) {
        tiles[i].placeholderImage = this.placeholderImage;

        this.service.resources.tiles.push(new Tile(tiles[i]));
    }

    /**
     * Monster tiles
     */
    let monsters = require("./resources/monsters.json");

    for (let i = 0; i < monsters.length; i++) {
        monsters[i].tileFront = new Tile(monsters[i].tileFront);
    }

    this.service.resources.monsters = monsters;
}

/**
 * Starts a new loading
 */
Loader.prototype.load = function(callable1, callable2, callable3)
{
    this.service.loadCanvas.style.zIndex = 1;

    this.tick = 0;

    this.endTick = null;

    this.loading = true;

    this.loadCallable1 = callable1;
    this.loadCallable2 = callable2;
    this.loadCallable3 = callable3;

    if (this.loadCallable1) {
        this.service.events.push(this.loadCallable1);
    }
}

Loader.prototype.update = function()
{
    this.tick += 1;

    // Start the actual loading only if 30 ticks have passed
    if (this.tick === 10) {
        if (this.loadCallable2) {
            this.service.events.push(this.loadCallable2);
        }

        // this.endTick = this.tick + 10;
        this.endTick = 10 + 10; // Black screen duration + tone duration
    }

    if (this.endTick > 0) {
        this.endTick -= 1;
    }

    if (this.endTick === 0) {
        this.endTick = null;

        this.loading = false;

        this.service.loadCanvas.style.zIndex = -1;

        if (this.loadCallable3) {
            this.service.events.push(this.loadCallable3);
        }
    }
}

Loader.prototype.render = function()
{
    let context = this.service.loadContext;

    context.clearRect(0, 0, this.service.loadCanvas.width, this.service.loadCanvas.height);

    context.beginPath();

    let alpha = 1;
    if (this.endTick > 0) {
        alpha = this.endTick/10;
    }
    else if (this.tick > 0)
    {
        alpha = this.tick/10;
    }

    context.fillStyle = "rgba(0, 0, 0, " + alpha + ")";
    context.fillRect(0, 0, this.service.loadCanvas.width, this.service.loadCanvas.height);
    context.stroke();

    // context.font = "26px Georgia";
    // context.fillStyle = "rgba(255, 255, 255, " + alpha + ")";
    // context.fillText("Loading!", context.canvas.width/2 - 50, context.canvas.height/2 - 10);
}

module.exports = Loader;
