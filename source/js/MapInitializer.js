const Map = require("./Map.js");
const TileManager = require("./TileManager.js");

function getMap(mapName) {
    if (mapName === "startMap") {
        return startMap();
    }

    if (mapName === "house1Map") {
        return house1Map();
    }
}

function startMap() {
    let x = 0;
    let y = 0;

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

    let gridSize = 32;

    let layer1Src = "img/map1layer1.png";
    let layer2Src = "img/map1layer2.png";

    let audioSrc = "audio/music1.mp3";

    let tileManager = new TileManager([{
            identifier: "sea",  // identifier
            src: "img/Sea.png", // image source
            renderWidth: 32,    // width when rendering
            renderHeight: 32,   // height when rendering
            tileWidth: 16,      // width of tile in image
            tileHeight: 16,     // height of tile in image
            offset: 96,         // offset for every tick
            numberOfFrames: 8,  // number of frames/ticks
            updateFrequency: 7, // specifies how often to update (5 is every fifth tick, 2 is every other tick, 1 is every tick etc...)
        },
        {
            identifier: "nice",
            src: "img/007.png",
            renderWidth: 48,
            renderHeight: 48,
            tileWidth: 42,
            tileHeight: 42,
            offset: 43,
            numberOfFrames: 51,
            updateFrequency: 2
        },
        {
            identifier: "seashore",
            src: "img/seashore.png",
            renderWidth: 32,
            renderHeight: 32,
            tileWidth: 16,
            tileHeight: 16,
            offset: 96,
            numberOfFrames: 8,
            updateFrequency: 7
        },
        {
            identifier: "grass",
            src: "img/grass.png",
            renderWidth: 32,
            renderHeight: 32,
            tileWidth: 16,
            tileHeight: 16,
            offset: 16,
            numberOfFrames: 4,
            updateFrequency: 2,
            loop: false,
            pause: true
        }
    ]);

    tileManager.addSettings({
        identifier: "flower",
        src: "img/Flowers2.png",
        renderWidth: 32,
        renderHeight: 32,
        tileWidth: 32,
        tileHeight: 32,
        offset: 32,
        numberOfFrames: 4,
        updateFrequency: 10
    });

    let tiles = [
        tileManager.getTile(
            "sea",  // identifier
            15,     // column where to render
            32,     // row where to render
            0,      // column of tile in sprite
            2       // row of tile in sprite
        ),
        tileManager.getTile("sea", 16, 32, 1, 2),
        tileManager.getTile("sea", 17, 32, 2, 2),
        tileManager.getTile("sea", 18, 32, 3, 2),
        tileManager.getTile("sea", 19, 32, 4, 2),
        tileManager.getTile("sea", 20, 32, 5, 2),
        tileManager.getTile("sea", 15, 33, 0, 3),
        tileManager.getTile("sea", 16, 33, 1, 3),
        tileManager.getTile("sea", 17, 33, 2, 3),
        tileManager.getTile("sea", 18, 33, 3, 3),
        tileManager.getTile("sea", 19, 33, 4, 3),
        tileManager.getTile("sea", 20, 33, 5, 3),
        tileManager.getTile("sea", 15, 34, 0, 4),
        tileManager.getTile("sea", 16, 34, 1, 4),
        tileManager.getTile("sea", 17, 34, 2, 4),
        tileManager.getTile("sea", 18, 34, 3, 4),
        tileManager.getTile("sea", 19, 34, 4, 4),
        tileManager.getTile("sea", 20, 34, 5, 4),
        tileManager.getTile("sea", 15, 35, 0, 5),
        tileManager.getTile("sea", 16, 35, 1, 5),
        tileManager.getTile("sea", 17, 35, 2, 5),
        tileManager.getTile("sea", 18, 35, 3, 5),
        tileManager.getTile("sea", 19, 35, 4, 5),
        tileManager.getTile("sea", 20, 35, 5, 5),
        tileManager.getTile("sea", 15, 36, 0, 6),
        tileManager.getTile("sea", 16, 36, 1, 6),
        tileManager.getTile("sea", 17, 36, 2, 6),
        tileManager.getTile("sea", 18, 36, 3, 6),
        tileManager.getTile("sea", 19, 36, 4, 6),
        tileManager.getTile("sea", 20, 36, 5, 6),
        tileManager.getTile("sea", 15, 37, 0, 7),
        tileManager.getTile("sea", 16, 37, 1, 7),
        tileManager.getTile("sea", 17, 37, 2, 7),
        tileManager.getTile("sea", 18, 37, 3, 7),
        tileManager.getTile("sea", 19, 37, 4, 7),
        tileManager.getTile("sea", 20, 37, 5, 7),

        tileManager.getTile("flower", 15, 30, 0, 0),
        tileManager.getTile("nice", 12, 31, 0, 0),

        tileManager.getTile("sea", 0, 4, 1, 2),
        tileManager.getTile("seashore", 0, 5, 1, 2),

        tileManager.getTile("grass", 8, 27, 0, 0),
        tileManager.getTile("grass", 9, 27, 0, 0),
        tileManager.getTile("grass", 10, 27, 0, 0),
        tileManager.getTile("grass", 11, 27, 0, 0),
        tileManager.getTile("grass", 8, 28, 0, 0),
        tileManager.getTile("grass", 9, 28, 0, 0),
        tileManager.getTile("grass", 10, 28, 0, 0),
        tileManager.getTile("grass", 11, 28, 0, 0),
        tileManager.getTile("grass", 8, 29, 0, 0),
        tileManager.getTile("grass", 9, 29, 0, 0),
        tileManager.getTile("grass", 10, 29, 0, 0),
        tileManager.getTile("grass", 11, 29, 0, 0),
        tileManager.getTile("grass", 9, 30, 0, 0),
        tileManager.getTile("grass", 10, 30, 0, 0),
        tileManager.getTile("grass", 11, 30, 0, 0)
    ];

    let map = new Map(x, y, collisionMap, gridSize, layer1Src, layer2Src, audioSrc, tiles);

    for (let y = 0; y < collisionMap.length; y++) {
        for (let x = 0; x < collisionMap[y].length; x++) {
            if (collisionMap[y][x] === 2) {
                map.attachEvent(x, y, {
                    id: 2,
                    data: {
                        mapName: "house1Map",
                        spawnX: 10*32,
                        spawnY: 8*32
                    }
                });
            }

            if (collisionMap[y][x] === 3) {
                // Find the tile associated to the grid
                let tile = tileManager.tiles.find(tile => tile.renderCol === x && tile.renderRow === y);

                map.attachEvent(x, y, {
                    id: 3,
                    data: {tile: tile}
                });
            }

            if (collisionMap[y][x] === 4) {
                map.attachEvent(x, y, {
                    id: 4,
                    data: {}
                });
            }
        }
    }

    return map;
}

function house1Map() {
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

    let gridSize = 32;

    let layer1Src = "img/house1layer1.png";
    let layer2Src = "img/house1layer2.png";

    let audioSrc = "audio/music2.mp3";

    let tiles = [];

    let map = new Map(x, y, collisionMap, gridSize, layer1Src, layer2Src, audioSrc, tiles);

    for (let y = 0; y < collisionMap.length; y++) {
        for (let x = 0; x < collisionMap[y].length; x++) {
            if (collisionMap[y][x] === 2) {
                map.attachEvent(x, y, {
                    id: 2,
                    data: {
                        mapName: "startMap",
                        spawnX: 6*32,
                        spawnY: 39*32
                    }
                });
            }
        }
    }

    return map;
}

module.exports = {
    getMap: getMap
};
