(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Entity(x, y, mapX, mapY, width, height, speed, direction) {
    this.x = x;
    this.y = y;

    this.mapX = mapX;
    this.mapY = mapY;

    this.width = width;
    this.height = height;

    this.col = null;
    this.row = null;

    this.speed = speed;

    this.speedX = null;
    this.speedY = null;

    this.newGrid = false;

    this.direction = direction;

    this.moveAnimationCounter = 0;

    this.loadCounter = 0;

    this.loadCounterFinish = 1;

    function loadEvent() {this.loadCounter += 1;}

    let sprites = new Image();
    sprites.addEventListener("load", loadEvent.bind(this));
    sprites.src = "img/character2.png";

    this.sprite = {
        img: sprites,   // Specifies the image, canvas, or video element to use
        sx: 4*16 + 3,   // Optional. The x coordinate where to start clipping
        sy: 0,          // Optional. The y coordinate where to start clipping
        swidth: 16,     // Optional. The width of the clipped image
        sheight: 16,    // Optional. The height of the clipped image
    }
}

/**
 * Returns true if entity has been loaded
 */
Entity.prototype.isLoaded = function() {
    if (this.loadCounter === this.loadCounterFinish) {
        return true;
    }

    return false;
}

Entity.prototype._setSpeed = function(game) {
    let deltaX = game.mousePositionX - this.mapX - this.width/2;
    let deltaY = game.mousePositionY - this.mapY - this.height/2;

    let distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

    if (distance < 5) {
        return;
    }

    this.speedX = deltaX/distance*this.speed;
    this.speedY = deltaY/distance*this.speed;
}

Entity.prototype._setDirection = function() {
    let radians = Math.atan2(this.speedY, this.speedX);

    let degrees = radians * (180 / Math.PI);

    if (degrees < -135 || degrees > 135) {
        this.direction = "left";
    } else if (degrees < -45) {
        this.direction = "up";
    } else if (degrees < 45) {
        this.direction = "right";
    } else if (degrees < 135) {
        this.direction = "down";
    }
}

Entity.prototype._detectCollision = function(game) {
    let x = this.x;
    let y = this.y;

    let squareLength = 30;

    let collisionPoints = [
        [x, y],                             // Top left
        [x+squareLength, y],                // Top right
        [x, y+squareLength],                // Bottom left
        [x+squareLength, y+squareLength],   // Bottom right
        [x+squareLength/2, y],              // Top
        [x+squareLength, y+squareLength/2], // Right
        [x+squareLength/2, y+squareLength], // Bottom
        [x, y+squareLength/2]               // Left
    ];

    // Iterate the collision points
    for (let i = 0; i < collisionPoints.length; i++) {
        let pointX = collisionPoints[i][0];
        let pointY = collisionPoints[i][1];

        let oldColumn = Math.floor(pointX / game.map.gridSize);
        let oldRow = Math.floor(pointY / game.map.gridSize);

        let newColumn = Math.floor((pointX+this.speedX) / game.map.gridSize);
        let newRow = Math.floor((pointY+this.speedY) / game.map.gridSize);

        // If collision point is trying to enter a disallowed grid
        if (game.map.collisionMap[newRow][newColumn] === 1) {
            // If trying to enter new column and row at the same time
            if (newColumn !== oldColumn && newRow !== oldRow) {
                // Trust that another collision point will find the collision
                continue;
            }

            // If trying to enter a new column
            if (newColumn !== oldColumn) {
                this.speedX = 0;
            }

            // If trying to enter a new row
            if (newRow !== oldRow) {
                this.speedY = 0;
            }
        }
    }
}

Entity.prototype._checkGrid = function(game) {
    let oldColumn = Math.floor((this.x+this.width/2) / game.map.gridSize);
    let oldRow = Math.floor((this.y+this.height/2) / game.map.gridSize);

    let newColumn = Math.floor((this.x+this.width/2+this.speedX) / game.map.gridSize);
    let newRow = Math.floor((this.y+this.height/2+this.speedY) / game.map.gridSize);

    if (oldColumn !== newColumn || oldRow !== newRow) {
        this.newGrid = true;
    }

    this.col = newColumn;
    this.row = newRow;
}

Entity.prototype.update = function(game) {
    if (game.listeners.isMousedown) {
        // Use the mouse position to determine the entity speed
        this._setSpeed(game);

        // Use the speed to determine the direction
        this._setDirection();

        // Detect collision.
        // If collision is detected -> set the speed to 0
        this._detectCollision(game);

        // Determine if entity is entering a new grid
        this._checkGrid(game);

        // Finally, add the speed to the position
        this.x += this.speedX;
        this.y += this.speedY;

        // Animation
        if (game.tickCounter % 5 === 0) {
            this.moveAnimationCounter += 1;
        }

        this.sprite.sx = this.moveAnimationCounter % 4 * 64;

        if (this.direction === "up") {
            this.sprite.sy = 3*64;
        } else if (this.direction === "right") {
            this.sprite.sy = 2*64;
        } else if (this.direction === "down") {
            this.sprite.sy = 0*64;
        } else if (this.direction === "left") {
            this.sprite.sy = 1*64;
        }

        return;
    }

    this.sprite.sx = 0;
}

Entity.prototype.render = function(context) {
    context.drawImage(this.sprite.img, this.sprite.sx, this.sprite.sy, 64, 64, this.mapX - this.width/4, this.mapY - 17, 48, 48);

    context.beginPath();
    // context.rect(this.mapX, this.mapY, this.width, this.height);
    context.stroke();
}

module.exports = Entity;

},{}],2:[function(require,module,exports){
const Entity = require("./Entity.js");
const MapInitializer = require("./MapInitializer.js");

function Game() {
    this.tickCounter = 0;
    this.framerate = 30;

    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");

    this.map = MapInitializer.getMap("startMap");

    this.coolguy = new Entity(14*32, 35*32, this.canvas.width/2, this.canvas.height/2, 32, 32, 5);

    // The tick when system was loaded
    this.loadedTick = null;
}

/**
 * Returns true if system is loaded
 */
Game.prototype.isLoaded = function() {
    if (this.map.isLoaded() && this.coolguy.isLoaded()) {
        if (this.loadedTick === null) {
            this.loadedTick = this.tickCounter;
        }

        return true;
    }

    console.log("Not loaded tick!");

    return false;
}

Game.prototype.startGame = function() {
    require("./listeners.js").addListeners(this);

    // Start game!
    setInterval(frame.bind(this), 1000/this.framerate);

    function frame() {
        this.tickCounter += 1;

        update();
        render();
    }

    let update = () => {
        // Do not update while system is loading
        if (!this.isLoaded()) {
            return;
        }

        // Update coolguy
        this.coolguy.update(this);

        // Update map
        this.map.update(this);

        // if cool guy has entered a new grid -> check for events on that grid
        if (this.coolguy.newGrid) {
            this._checkEvents(this.coolguy.col, this.coolguy.row);

            this.coolguy.newGrid = false;
        }
    }

    let render = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render black screen while system is loading
        if (!this.isLoaded()) {
            this.context.beginPath();
            this.context.fillStyle = "rgb(0, 0, 0)";
            this.context.fillRect(0, 0, 10000, 10000);
            this.context.stroke();

            return;
        }

        this.map.renderLayer1(this.context);

        this.map.renderTiles(this.context);

        this.coolguy.render(this.context);

        this.map.renderLayer2(this.context);

        this.map.render(this.context);

        // If system was recently loaded -> tone black screen
        if (this.tickCounter - this.loadedTick < 30) {
            this.context.beginPath();
            this.context.fillStyle = "rgba(0, 0, 0, " + (1 - (this.tickCounter - this.loadedTick)/30) + ")";
            this.context.fillRect(0, 0, 10000, 10000);
            this.context.stroke();
        }
    }
};

Game.prototype._checkEvents = function(col, row) {
    // get event on position
    let event = this.map.getEvent(col, row);

    // if there is no event -> exit
    if (typeof event !== "object") {
        return;
    }

    // if event id is 2 -> change map! teleport!
    if (event.id === 2) {
        this.loadedTick = null;

        this.map.destroy();

        this.map = MapInitializer.getMap(event.data.mapName);

        this.coolguy.x = event.data.spawnX;
        this.coolguy.y = event.data.spawnY;

        return;
    }

    // if event id is 3 -> grass!
    if (event.id === 3) {
        // let image = new Image();
        // image.src = "img/grass.png";
        // this.context.drawImage(image, col*32, row*32);
        // this.map.renderTile(this.context, col*32, row*32);
        this.coolguy.isInGrass = true;

        console.log("grass!");

        return;
    }
}

module.exports = Game;

},{"./Entity.js":1,"./MapInitializer.js":4,"./listeners.js":7}],3:[function(require,module,exports){
function Map(x, y, collisionMap, gridSize, layer1Src, layer2Src, audioSrc, tiles) {
    this.x = x;
    this.y = y;

    this.collisionMap = collisionMap;

    this.gridSize = gridSize;

    // this.isLoading = true;

    this.tickCounter = 0;

    this.loadCounter = 0;

    this.loadCounterFinish = 3;

    function loadEvent() {this.loadCounter += 1;}

    this.layer1Image = new Image();
    this.layer1Image.addEventListener("load", loadEvent.bind(this));
    this.layer1Image.src = layer1Src;

    this.layer2Image = new Image();
    this.layer2Image.addEventListener("load", loadEvent.bind(this));
    this.layer2Image.src = layer2Src;

    this.audio = new Audio(audioSrc);
    this.audio.addEventListener("loadeddata", loadEvent.bind(this));
    this.audio.loop = true;
    this.audio.play();

    this.tiles = tiles;
}

/**
 * Returns true if map has been loaded
 */
Map.prototype.isLoaded = function() {
    if (this.loadCounter === this.loadCounterFinish) {
        return true;
    }

    return false;
}

Map.prototype.attachEvent = function(col, row, event) {
    this.collisionMap[row][col] = event;
}

Map.prototype.getEvent = function(col, row) {
    return this.collisionMap[row][col];
}

Map.prototype.update = function(game) {
    this.tickCounter += 1;

    // Update map position
    this.x = game.coolguy.mapX - game.coolguy.x;
    this.y = game.coolguy.mapY - game.coolguy.y;

    for (let i = 0; i < this.tiles.length; i++) {
        this.tiles[i].update(game);
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

},{}],4:[function(require,module,exports){
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

},{"./Map.js":3,"./Tile.js":5}],5:[function(require,module,exports){
function Tile(renderCol, renderRow, renderWidth, renderHeight, spriteCol, spriteRow, tileWidth, tileHeight, offset, numberOfFrames, imageSrc) {
    // new Tile(
    //     14, // column where to render
    //     30, // row where to render
    //     32, // render width
    //     32, // render height
    //     1,  // col of tile in spirte
    //     3,  // row of tile in sprite
    //     16, // width of tile in sprite
    //     16, // height of tile in sprite
    //     96, // width of a sprite
    //     128,// height of a sprite
    //     "img/Sea.png" // sprite or sprites src
    // )
    this.renderCol = renderCol;
    this.renderRow = renderRow;

    this.renderWidth = renderWidth;
    this.renderHeight = renderHeight;

    this.spriteCol = spriteCol;
    this.spriteRow = spriteRow;

    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    
    this.offset = offset;

    this.numberOfFrames = numberOfFrames;

    // Initialize sprite
    function loadEvent() {this.loadCounter += 1;}

    this.loadCoutner = 0;

    this.loadCounterFinish = 1;

    this.image = new Image();
    this.image.addEventListener("load", loadEvent.bind(this));
    this.image.src = imageSrc;

    // Animation
    this.animationCounter = 0;

    this.spriteOffset = 0;
}

/**
 * Returns true if tile has been loaded
 */
Map.prototype.isLoaded = function() {
    if (this.loadCounter === this.loadCounterFinish) {
        return true;
    }

    return false;
}

Tile.prototype.update = function(game) {
    if (game.tickCounter % 7 === 0) {
        this.animationCounter += 1;

        this.spriteOffset = this.offset * (this.animationCounter % this.numberOfFrames);
    }
}

Tile.prototype.render = function(context, mapX, mapY) {
    let xInImage = this.spriteCol * this.tileWidth + this.spriteOffset;
    let yInImage = this.spriteRow * this.tileHeight;

    let renderX = this.renderCol * 32; // Assuming game tile width is 32
    let renderY = this.renderRow * 32; // Assuming game tile height is 32

    context.drawImage(this.image, xInImage, yInImage, this.tileWidth, this.tileHeight, mapX + renderX, mapY + renderY, this.renderWidth, this.renderHeight);
}

module.exports = Tile;

},{}],6:[function(require,module,exports){
let Game = require("./Game.js");

// node_modules/.bin/browserify source/js/app.js > debug/js/bundle.js

window.addEventListener("load", function() {
    let game = new Game();

    game.startGame();
});

},{"./Game.js":2}],7:[function(require,module,exports){
function addListeners(game) {
    game.listeners = {};

    game.canvas.addEventListener("mousedown", function(event) {
        game.listeners.isMousedown = true;

        game.listeners.mousePositionX = event.clientX;
        game.listeners.mousePositionY = event.clientY;
    });

    game.canvas.addEventListener("mousemove", function(event) {
        game.listeners.isMousemove = true;

        game.mousePositionX = event.clientX;
        game.mousePositionY = event.clientY;
    });

    game.canvas.addEventListener("mouseup", function(event) {
        game.listeners.isMousedown = false;
        game.listeners.isMousemove = false;
    });

    game.canvas.addEventListener("keydown", function(event) {
        console.log("keydown");
    });
}

module.exports = {
    addListeners: addListeners
}

},{}]},{},[6]);
