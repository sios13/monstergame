const Tile = require("./Tile.js");

function Loader(service, settings)
{
    this.service = service;

    this.service.resources = {};

    this.service.resources.getTile = function(tilename, renderX, renderY) {
        let tile = this.service.resources.tiles.find(tile => tile.name === tilename);
        tile.renderX = renderX;
        tile.renderY = renderY;
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

    this._loadTiles();

    this._loadImages();

    this._loadAudios();

    this._createMonsterTiles();
}

Loader.prototype._createMonsterTiles = function() {
    let monsters = require("./resources/monsters.json");

    for (let i = 0; i < monsters.length; i++) {
        monsters[i].tileFront = new Tile(monsters[i].tileFront);
    }

    this.service.resources.monsters = monsters;

    console.log(this.service.resources.monsters);
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
    // List of all image srcs to ever be used in the game
    let imageSrcs = [
        "img/Sea.png",
        "img/map1layer1.png",
        "img/map1layer2.png",
        "img/house1layer1.png",
        "img/house1layer2.png",
        "img/character7_walking.png",
        "img/character_water.png",
        "img/character7_grass.png",
        "img/monsters/haunter_front.png"
    ];

    let images = [];

    // Create image elements for all images
    for (let i = 0; i < imageSrcs.length; i++) {
        let image = new Image();

        image.addEventListener("load", function(event) {
            let image2 = event.target;
            // let image2 = event.path[0];
            // Add this image to all tiles that should have this image
            for (let i = 0; i < this.service.resources.tiles.length; i++) {
                let tile = this.service.resources.tiles[i];
                if (tile.src === image2.getAttribute("src")) {
                    tile.image = image2;
                }
            }
        }.bind(this));

        image.src = imageSrcs[i];

        images.push(image);
    }

    this.service.resources.images = images;
}

Loader.prototype._loadTiles = function() {
    // Takes a sprite and return tiles
    let spriteToTiles = function(sprite) {
        let tiles = [];

        for (let y = 0; y < sprite.spriteHeight/sprite.tileHeight; y++) {
            for (let x = 0; x < sprite.spriteWidth/sprite.tileWidth; x++) {
                let tile = new Tile(Object.assign({}, sprite, {
                    placeholderImage: this.placeholderImage,
                    name: sprite.name + "(" + x + "," + y + ")",
                    spriteCol: x,
                    spriteRow: y
                }));
                tiles.push(tile);
            }
        }

        return tiles;
    }.bind(this);

    /**
     * Sprites
     */
    let playerWalkingSprite = {
        name: "playerWalk",
        src: "img/character7_walking.png",
        tileWidth: 32,
        tileHeight: 48,
        spriteWidth: 32,
        spriteHeight: 192,
        renderWidth: 32,
        renderHeight: 48,
        numberOfFrames: 4,
        updateFrequency: 7
    };

    let playerWaterSprite = {
        name: "playerWater",
        src: "img/character_water.png",
        tileWidth: 64,
        tileHeight: 64,
        spriteWidth: 64,
        spriteHeight: 256,
        renderWidth: 64,
        renderHeight: 64,
        numberOfFrames: 4,
        updateFrequency: 7
    };

    let playerGrassSprite = {
        name: "playerGrass",
        src: "img/character7_grass.png",
        tileWidth: 32,
        tileHeight: 48,
        spriteWidth: 32,
        spriteHeight: 192,
        renderWidth: 32,
        renderHeight: 48,
        numberOfFrames: 4,
        updateFrequency: 7
    };

    let seaSprite = {
        name: "sea",
        src: "img/Sea.png",
        tileWidth: 16,
        tileHeight: 16,
        spriteWidth: 96,
        spriteHeight: 128,
        renderWidth: 32,
        renderHeight: 32,
        numberOfFrames: 8,
        updateFrequency: 7,
    };

    /**
     * Tiles
     */
    let map1layer1Tile = new Tile({name: "map1layer1", src: "img/map1layer1.png", placeholderImage: this.placeholderImage, tileWidth: 3200, tileHeight: 3200});

    let map1layer2Tile = new Tile({name: "map1layer2", src: "img/map1layer2.png", placeholderImage: this.placeholderImage, tileWidth: 3200, tileHeight: 3200});
    
    let house1layer1Tile = new Tile({name: "house1layer1", src: "img/house1layer1.png", placeholderImage: this.placeholderImage, tileWidth: 3200, tileHeight: 3200});
    
    let house1layer2Tile = new Tile({name: "house1layer2", src: "img/house1layer2.png", placeholderImage: this.placeholderImage, tileWidth: 3200, tileHeight: 3200});

    /**
     * Create tiles from sprites
     * Add tiles to resources.tiles
     */
    let tiles = [];

    tiles.push(...spriteToTiles(seaSprite));
    tiles.push(...spriteToTiles(playerWalkingSprite));
    tiles.push(...spriteToTiles(playerWaterSprite));
    tiles.push(...spriteToTiles(playerGrassSprite));
    tiles.push(map1layer1Tile);
    tiles.push(map1layer2Tile);
    tiles.push(house1layer1Tile);
    tiles.push(house1layer2Tile);

    this.service.resources.tiles = tiles;
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
    context.fillRect(0, 0, 2000, 2000);
    context.stroke();

    // context.font = "26px Georgia";
    // context.fillStyle = "rgba(255, 255, 255, " + alpha + ")";
    // context.fillText("Loading!", context.canvas.width/2 - 50, context.canvas.height/2 - 10);
}

module.exports = Loader;
