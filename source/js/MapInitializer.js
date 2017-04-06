const Map = require("./Map.js");
const Tile = require("./Tile.js");

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
        [1,1,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1],
        [1,1,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1],
        [1,1,0,0,1,1,1,1,0,0,0,0,0,0,1,2,1,1,0,0,0,0,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,3,3,0,0,0,1,1],
        [1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,3,3,0,0,0,1,1],
        [1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1],
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

    let tiles = [
        new Tile(
            15,
            30,
            32,
            32,
            0,
            0,
            32,
            32,
            32,
            4,
            "img/Flowers2.png"
        ),
        new Tile(
            15, // column where to render
            32, // row where to render
            32, // render width
            32, // render height
            0,  // col of tile in spirte
            2,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            16, // column where to render
            32, // row where to render
            32, // render width
            32, // render height
            1,  // col of tile in spirte
            2,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            17, // column where to render
            32, // row where to render
            32, // render width
            32, // render height
            2,  // col of tile in spirte
            2,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            18, // column where to render
            32, // row where to render
            32, // render width
            32, // render height
            3,  // col of tile in spirte
            2,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            19, // column where to render
            32, // row where to render
            32, // render width
            32, // render height
            4,  // col of tile in spirte
            2,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            20, // column where to render
            32, // row where to render
            32, // render width
            32, // render height
            5,  // col of tile in spirte
            2,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            15, // column where to render
            33, // row where to render
            32, // render width
            32, // render height
            0,  // col of tile in spirte
            3,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            16, // column where to render
            33, // row where to render
            32, // render width
            32, // render height
            1,  // col of tile in spirte
            3,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            17, // column where to render
            33, // row where to render
            32, // render width
            32, // render height
            2,  // col of tile in spirte
            3,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            18, // column where to render
            33, // row where to render
            32, // render width
            32, // render height
            3,  // col of tile in spirte
            3,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            19, // column where to render
            33, // row where to render
            32, // render width
            32, // render height
            4,  // col of tile in spirte
            3,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            20, // column where to render
            33, // row where to render
            32, // render width
            32, // render height
            5,  // col of tile in spirte
            3,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            15, // column where to render
            34, // row where to render
            32, // render width
            32, // render height
            0,  // col of tile in spirte
            4,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            16, // column where to render
            34, // row where to render
            32, // render width
            32, // render height
            1,  // col of tile in spirte
            4,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            17, // column where to render
            34, // row where to render
            32, // render width
            32, // render height
            2,  // col of tile in spirte
            4,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            18, // column where to render
            34, // row where to render
            32, // render width
            32, // render height
            3,  // col of tile in spirte
            4,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            19, // column where to render
            34, // row where to render
            32, // render width
            32, // render height
            4,  // col of tile in spirte
            4,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            20, // column where to render
            34, // row where to render
            32, // render width
            32, // render height
            5,  // col of tile in spirte
            4,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            15, // column where to render
            35, // row where to render
            32, // render width
            32, // render height
            0,  // col of tile in spirte
            5,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            16, // column where to render
            35, // row where to render
            32, // render width
            32, // render height
            1,  // col of tile in spirte
            5,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            17, // column where to render
            35, // row where to render
            32, // render width
            32, // render height
            2,  // col of tile in spirte
            5,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            18, // column where to render
            35, // row where to render
            32, // render width
            32, // render height
            3,  // col of tile in spirte
            5,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            19, // column where to render
            35, // row where to render
            32, // render width
            32, // render height
            4,  // col of tile in spirte
            5,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            20, // column where to render
            35, // row where to render
            32, // render width
            32, // render height
            5,  // col of tile in spirte
            5,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            15, // column where to render
            36, // row where to render
            32, // render width
            32, // render height
            0,  // col of tile in spirte
            6,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            16, // column where to render
            36, // row where to render
            32, // render width
            32, // render height
            1,  // col of tile in spirte
            6,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            17, // column where to render
            36, // row where to render
            32, // render width
            32, // render height
            2,  // col of tile in spirte
            6,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            18, // column where to render
            36, // row where to render
            32, // render width
            32, // render height
            3,  // col of tile in spirte
            6,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            19, // column where to render
            36, // row where to render
            32, // render width
            32, // render height
            4,  // col of tile in spirte
            6,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            20, // column where to render
            36, // row where to render
            32, // render width
            32, // render height
            5,  // col of tile in spirte
            6,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            15, // column where to render
            37, // row where to render
            32, // render width
            32, // render height
            0,  // col of tile in spirte
            7,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            16, // column where to render
            37, // row where to render
            32, // render width
            32, // render height
            1,  // col of tile in spirte
            7,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            17, // column where to render
            37, // row where to render
            32, // render width
            32, // render height
            2,  // col of tile in spirte
            7,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            18, // column where to render
            37, // row where to render
            32, // render width
            32, // render height
            3,  // col of tile in spirte
            7,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            19, // column where to render
            37, // row where to render
            32, // render width
            32, // render height
            4,  // col of tile in spirte
            7,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        ),
        new Tile(
            20, // column where to render
            37, // row where to render
            32, // render width
            32, // render height
            5,  // col of tile in spirte
            7,  // row of tile in sprite
            16, // width of tile in sprite
            16, // height of tile in sprite
            96, // offset length
            8,  // number of frames
            "img/Sea.png" // sprite or sprites src
        )
        // {x: 17*32, y: 35*32, width:32, height:32, img:"img/grass.png"},
        // {x: 18*32, y: 35*32, width:32, height:32, img:"img/grass.png"},
        // {x: 17*32, y: 36*32, width:32, height:32, img:"img/grass.png"},
        // {x: 18*32, y: 36*32, width:32, height:32, img:"img/grass.png"}
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
                map.attachEvent(x, y, {
                    id: 3,
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
