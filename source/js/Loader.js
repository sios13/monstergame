const Tile = require("./Tile.js");

function Loader(service, settings)
{
    this.service = service;

    this.service.resources = {};

    this.service.resources.getTile = function(tilename, renderX, renderY, renderWidth, renderHeight) {
        // Get the tile template
        let tileOrig = this.tiles.find(tile => tile.name === tilename);

        // Copy the template
        let tile = tileOrig.copy();

        // Add properties to the template
        tile.service = this.service;

        tile.renderX = renderX;
        tile.renderY = renderY;

        tile.renderWidth = renderWidth;
        tile.renderHeight = renderHeight;

        return tile;
    }.bind(this);

    this.service.resources.getRandomMonster = function() {
        let index = this.service.tick % this.service.resources.monsters.length;

        let monsterTemplate = this.service.resources.monsters[index];

        let monster = {};

        monster.id = monsterTemplate.id;
        monster.name = monsterTemplate.name;
        monster.HP = monsterTemplate.HP;
        monster.maxHP = monsterTemplate.maxHP;
        monster.tileFront = monsterTemplate.tileFront.copy();
        monster.tileBack = monsterTemplate.tileBack.copy();
        monster.cry = monsterTemplate.cry;

        return monster;
    }.bind(this);

    this.loadTick = 0;

    this.loading = false;

    this.alpha = 0;

    this.loadCallable1 = null;
    this.loadCallable2 = null;
    this.loadCallable3 = null;

    this.loadedImages = 0;
    this.nrOfImages = 0;

    this.tiles = [];

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
                let settings = Object.assign({}, sprite, {
                    name: sprite.name + "(" + x + "," + y + ")",
                    spriteCol: x,
                    spriteRow: y
                });

                let tile = new Tile(undefined, settings);

                tiles.push(tile);
            }
        }

        return tiles;
    }.bind(this);

    let sprites = require("./resources/sprites.json");

    for (let i = 0; i < sprites.length; i++) {
        let tiles = spriteToTiles(sprites[i]);

        this.tiles.push(...tiles);
    }

    /**
     * Tiles
     */
    let tiles = require("./resources/tiles.json");

    for (let i = 0; i < tiles.length; i++) {
        let settings = tiles[i];

        this.tiles.push(new Tile(undefined, settings));
    }

    /**
     * Monster tiles
     */
    let monsters = require("./resources/monsters.json");

    for (let i = 0; i < monsters.length; i++) {
        monsters[i].tileFront = new Tile(undefined, monsters[i].tileFront);
        monsters[i].tileBack = new Tile(undefined, monsters[i].tileBack);
    }

    this.service.resources.monsters = monsters;
}

/**
 * Iterate all tiles and load their image srcs
 */
Loader.prototype._loadImages = function() {
    // Create a unique array of all image srcs used in the game
    let imagesSrc = [];

    for (let i = 0; i < this.tiles.length; i++) {
        let tile = this.tiles[i];

        if (tile.image === "-") {continue;}

        imagesSrc.push(tile.src);
    }

    for (let i = 0; i < this.service.resources.monsters.length; i++) {
        let monster = this.service.resources.monsters[i];

        imagesSrc.push(monster.tileFront.src);
        imagesSrc.push(monster.tileBack.src);
    }

    imagesSrc = [...new Set(imagesSrc)];

    this.nrOfImages = imagesSrc.length;

    // Create an image element for every src
    for (let i = 0; i < imagesSrc.length; i++) {
        let imageSrc = imagesSrc[i];

        let image = new Image();

        // When the image has finished loading...
        image.addEventListener("load", function(event) {
            this.loadedImages += 1;

            let img = event.target;

            // ...add the image element to all tiles with the same src
            for (let i = 0; i < this.tiles.length; i++) {
                let tile = this.tiles[i];

                if (tile.src === img.getAttribute("src")) {
                    tile.image = img;
                }
            }

            for (let i = 0; i < this.service.resources.monsters.length; i++) {
                let monster = this.service.resources.monsters[i];

                if (monster.tileFront.src === img.getAttribute("src")) {
                    monster.tileFront.image = img;
                }

                if (monster.tileBack.src === img.getAttribute("src")) {
                    monster.tileBack.image = img;
                }
            }
        }.bind(this));

        image.src = imageSrc;
    }
}

Loader.prototype._loadAudios = function() {
    // Array of all audio src used in the game
    let audiosSrc = [
        "audio/music1.mp3",
        "audio/music2.mp3",
        "audio/pkmn-fajt.mp3",
        "audio/normaldamage.wav",
        "audio/faint.wav",
        "audio/Refresh.mp3"
    ];

    // Make an audio element for every audio src
    let audios = [];

    for (let i = 0; i < audiosSrc.length; i++) {
        let audio = new Audio(audiosSrc[i]);

        audio.setAttribute("preload", "auto");

        audios.push(audio);
    }

    // Save all audios to the service
    this.service.resources.audios = audios;

    /**
     * Monsters
     */
    // Iterate the monsters and create audio elements
    for (let i = 0; i < this.service.resources.monsters.length; i++) {
        let monster = this.service.resources.monsters[i];

        if (monster.crySrc !== undefined) {
            monster.cry = new Audio(monster.crySrc);
        }
    }
}

/**
 * Starts a new loading
 */
Loader.prototype.load = function(callable1, callable2, callable3)
{
    this.service.loadCanvas.style.zIndex = 1;

    this.loadTick = -1;

    this.loading = true;

    this.alpha = 0;

    this.loadCallable1 = callable1;
    this.loadCallable2 = callable2;
    this.loadCallable3 = callable3;

    if (this.loadCallable1 !== undefined) {
        this.service.events.push(this.loadCallable1);

        this.loadCallable1 = undefined;
    }
}

Loader.prototype.update = function()
{
    this.loadTick += 1;

    if (this.loadTick > 10 && this.loading === false && this.alpha <= 0) {
        this.alpha = 0;

        if (this.loadCallable3 !== undefined) {
            this.service.events.push(this.loadCallable3);

            this.loadCallable3 = undefined;
        }

        this.service.loadCanvas.style.zIndex = -1;

        return;
    }

    if (this.loadTick < 10) {
        this.alpha += 0.1;

        return;
    }

    if (this.loadTick === 10) {

        this.alpha = 2;

        return;
    }

    if (this.loadTick > 10 && this.loading === true) {
        let loading = false;

        for (let i = 0; i < this.tiles.length; i++) {
            let tile = this.tiles[i];

            if (tile.image === "-") {
                continue;
            }

            if (tile.image === undefined || tile.image.complete === false || tile.image.naturalHeight === 0) {
                loading = true;

                break;
            }
        }

        this.loading = loading;

        // If all images have finished loading
        if (this.loading === false) {
            if (this.loadCallable2 !== undefined) {
                this.service.events.push(this.loadCallable2);

                this.loadCallable2 = undefined;
            }
        }

        return;
    }

    if (this.loadTick > 10 && this.loading === false) {
        this.alpha -= 0.1;

        return;
    }
}

Loader.prototype.render = function()
{
    let context = this.service.loadContext;

    context.clearRect(0, 0, this.service.loadCanvas.width, this.service.loadCanvas.height);

    context.beginPath();

    context.fillStyle = "rgba(0, 0, 0, " + this.alpha + ")";
    context.fillRect(0, 0, this.service.loadCanvas.width, this.service.loadCanvas.height);
    context.stroke();

    context.font = "26px Georgia";
    context.fillStyle = "rgba(255, 255, 255, " + this.alpha + ")";
    context.fillText("" + this.loadedImages + "/" + this.nrOfImages, context.canvas.width/2 - 50, context.canvas.height/2 - 10);
}

module.exports = Loader;
