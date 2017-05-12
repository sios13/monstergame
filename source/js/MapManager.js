const Map = require("./Map.js");
const Tile = require("./Tile.js");
const Battle = require("./Battle.js");

function MapManager(service, {}) {
    this.service = service;

    // Some nice events
    this.normalEvent = function() {
        this.service.coolguy.setState("walking");
    };
    this.newMapEvent = function(newMapName, newX, newY) {
        this.loader.load(
            function() {
                this.service.util.pauseAudio(this.service.map.audio);

                this.service.coolguy.stop = true;
            },
            function() {
                this.service.map = this.service.mapManager.getMap(newMapName);

                this.service.coolguy.x = newX * 32;
                this.service.coolguy.y = newY * 32;
            },
            function() {
                this.service.util.playAudio(this.service.map.audio);

                this.service.coolguy.stop = false;
            }
        );
    };
    this.grassEvent = function() {
        this.service.coolguy.setState("grass");

        // Find the tile coolguy is standing on
        let tile = this.service.map.tiles.find(tile => tile.renderCol === this.service.coolguy.col && tile.renderRow === this.service.coolguy.row);

        // tile.pause = false;

        if (true) {
            this.service.state = "battle";

            let monsters = this.service.resources.monsters;
            this.service.battle = new Battle(this.service, {opponent: monsters[this.service.tick % monsters.length]});

            this.service.worldCanvas.style.zIndex = -1;
            this.service.battleCanvas.style.zIndex = 1;
        }
    };
    this.waterEvent = function() {
        this.service.coolguy.setState("water");
    }
}

MapManager.prototype.getMap = function(mapName) {
    if (mapName === "startMap") {
        return this.createStartMap();
    }

    if (mapName === "house1Map") {
        return this.createHouse1Map();
    }
}

/**
 * Creates and returns a start map
 */
MapManager.prototype.createStartMap = function() {
    let collisionMap = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
        [1,1,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,0,0,0,0,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1],
        [1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
        [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,0,0,1,1,1,1,3,3,3,3,0,0,1,1,1,1,0,0,0,0,1,1],
        [1,1,0,0,1,1,1,1,3,3,3,3,0,0,1,1,1,1,0,0,0,0,1,1],
        [1,1,0,0,1,1,1,1,3,3,3,3,0,0,1,2,1,1,0,0,0,0,1,1],
        [1,1,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,0,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4,4,0,1,1],
        [1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,4,4,4,4,4,4,0,1,1],
        [1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,4,4,4,4,4,4,0,1,1],
        [1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,4,4,4,4,4,4,0,1,1],
        [1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,4,4,4,4,4,4,0,1,1],
        [1,1,0,0,0,1,2,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
        [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    let layer1Tile = this.service.resources.tiles.find(tile => tile.name === "map1layer1");

    let layer2Tile = this.service.resources.tiles.find(tile => tile.name === "map1layer2");

    let audio = this.service.resources.audios.find(audio => audio.getAttribute("src") === "audio/music1.mp3");

    let tiles = [
        this.service.resources.getTile("sea(0,2)", 15*32, 32*32, 32, 32),
        this.service.resources.getTile("sea(1,2)", 16*32, 32*32, 32, 32),
        this.service.resources.getTile("sea(2,2)", 17*32, 32*32, 32, 32),
        this.service.resources.getTile("sea(3,2)", 18*32, 32*32, 32, 32),
        this.service.resources.getTile("sea(4,2)", 19*32, 32*32, 32, 32),
        this.service.resources.getTile("sea(5,2)", 20*32, 32*32, 32, 32),
        this.service.resources.getTile("sea(0,3)", 15*32, 33*32, 32, 32),
        this.service.resources.getTile("sea(1,3)", 16*32, 33*32, 32, 32),
        this.service.resources.getTile("sea(2,3)", 17*32, 33*32, 32, 32),
        this.service.resources.getTile("sea(3,3)", 18*32, 33*32, 32, 32),
        this.service.resources.getTile("sea(4,3)", 19*32, 33*32, 32, 32),
        this.service.resources.getTile("sea(5,3)", 20*32, 33*32, 32, 32),
        this.service.resources.getTile("sea(0,4)", 15*32, 34*32, 32, 32),
        this.service.resources.getTile("sea(1,4)", 16*32, 34*32, 32, 32),
        this.service.resources.getTile("sea(2,4)", 17*32, 34*32, 32, 32),
        this.service.resources.getTile("sea(3,4)", 18*32, 34*32, 32, 32),
        this.service.resources.getTile("sea(4,4)", 19*32, 34*32, 32, 32),
        this.service.resources.getTile("sea(5,4)", 20*32, 34*32, 32, 32),
        this.service.resources.getTile("sea(0,5)", 15*32, 35*32, 32, 32),
        this.service.resources.getTile("sea(1,5)", 16*32, 35*32, 32, 32),
        this.service.resources.getTile("sea(2,5)", 17*32, 35*32, 32, 32),
        this.service.resources.getTile("sea(3,5)", 18*32, 35*32, 32, 32),
        this.service.resources.getTile("sea(4,5)", 19*32, 35*32, 32, 32),
        this.service.resources.getTile("sea(5,5)", 20*32, 35*32, 32, 32),
        this.service.resources.getTile("sea(0,6)", 15*32, 36*32, 32, 32),
        this.service.resources.getTile("sea(1,6)", 16*32, 36*32, 32, 32),
        this.service.resources.getTile("sea(2,6)", 17*32, 36*32, 32, 32),
        this.service.resources.getTile("sea(3,6)", 18*32, 36*32, 32, 32),
        this.service.resources.getTile("sea(4,6)", 19*32, 36*32, 32, 32),
        this.service.resources.getTile("sea(5,6)", 20*32, 36*32, 32, 32),
        this.service.resources.getTile("sea(0,7)", 15*32, 37*32, 32, 32),
        this.service.resources.getTile("sea(1,7)", 16*32, 37*32, 32, 32),
        this.service.resources.getTile("sea(2,7)", 17*32, 37*32, 32, 32),
        this.service.resources.getTile("sea(3,7)", 18*32, 37*32, 32, 32),
        this.service.resources.getTile("sea(4,7)", 19*32, 37*32, 32, 32),
        this.service.resources.getTile("sea(5,7)", 20*32, 37*32, 32, 32)
    ];

    let map = new Map(this.service, {
        x: 0,
        y: 0,
        collisionMap: collisionMap,
        layer1Tile: layer1Tile,
        layer2Tile: layer2Tile,
        audio: audio,
        tiles: tiles
    });

    // Attach map events!
    for (let y = 0; y < collisionMap.length; y++) {
        for (let x = 0; x < collisionMap[y].length; x++) {
            // Normal state!
            if (collisionMap[y][x] === 0) {
                map.attachEvent(x, y, this.normalEvent);
            }

            // Teleport!
            if (collisionMap[y][x] === 2) {
                map.attachEvent(x, y, this.newMapEvent.bindArgs("house1Map", 10, 10));
            }

            // Grass!
            if (collisionMap[y][x] === 3) {
                map.attachEvent(x, y, this.grassEvent);
            }

            // Water! Swim!
            if (collisionMap[y][x] === 4) {
                map.attachEvent(x, y, this.waterEvent);
            }
        }
    }

    return map;
}

MapManager.prototype.createHouse1Map = function() {
    let x = 0;
    let y = 0;

    let collisionMap = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    let layer1Tile = this.service.resources.tiles.find(tile => tile.name === "house1layer1");

    let layer2Tile = this.service.resources.tiles.find(tile => tile.name === "house1layer2");

    let audio = this.service.resources.audios.find(audio => audio.getAttribute("src") === "audio/music2.mp3");

    let tiles = [];

    let map = new Map(this.service, {
        x: 0,
        y: 0,
        collisionMap: collisionMap,
        layer1Tile: layer1Tile,
        layer2Tile: layer2Tile,
        audio: audio,
        tiles: tiles
    });

    for (let y = 0; y < collisionMap.length; y++) {
        for (let x = 0; x < collisionMap[y].length; x++) {
            // Normal state!
            if (collisionMap[y][x] === 0) {
                map.attachEvent(x, y, this.normalEvent);
            }

            // Teleport!
            if (collisionMap[y][x] === 2) {
                map.attachEvent(x, y, this.newMapEvent.bindArgs("startMap", 13, 37));
            }

            // Grass!
            if (collisionMap[y][x] === 3) {
                map.attachEvent(x, y, this.grassEvent);
            }

            // Water! Swim!
            if (collisionMap[y][x] === 4) {
                map.attachEvent(x, y, this.waterEvent);
            }
        }
    }

    return map;
}

module.exports = MapManager;
