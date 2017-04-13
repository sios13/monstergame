(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const Tile = require("./Tile.js");

function Battle(settings) {
    this.tick = 0;

    this.screenWidth = 1024;
    this.screenHeight = 768;

    this.background = new Tile({
        renderWidth: this.screenWidth,
        renderHeight: this.screenHeight,
        tileWidth: 512,
        tileHeight: 288,
        src: "img/battle/battlebgForestEve.png"
    });

    this.player = {
        name: "player",
        image: new Tile({
            renderX: 1024 + 512/2 - 350/2,
            renderY: 280,
            renderWidth: 350,
            renderHeight: 350,
            spriteCol: 0,
            spriteRow: 0,
            tileWidth: 108,
            tileHeight: 108,
            offset: 108,
            numberOfFrames: 87,
            updateFrequency: 1,
            src: "img/battle/player_monster.png",
            loop: false,
            pause: true
        }),
        base_image: new Tile({
            renderX: 1024,
            renderY: this.screenHeight - 192 - 64,
            renderWidth: 512,
            renderHeight: 64,
            tileWidth: 408,
            tileHeight: 64,
            src: "img/battle/playerbaseFieldGrassEve.png"
        })
    };

    this.enemy = {
        name: "HEJ",
        image: new Tile({
            renderX: 0 - 512/2 - 350/2,
            renderY: 75,
            renderWidth: 350,
            renderHeight: 350,
            spriteCol: 0,
            spriteRow: 0,
            tileWidth: 85,
            tileHeight: 85,
            offset: 85,
            numberOfFrames: 25,
            updateFrequency: 1,
            src: "img/battle/enemy_monster.png",
            loop: false,
            pause: true
        }),
        base_image: new Tile({
            renderX: 0 - 512,
            renderY: 200,
            renderWidth: 512,
            renderHeight: 256,
            tileWidth: 256,
            tileHeight: 128,
            src: "img/battle/enemybaseFieldGrassEve.png"
        })
    };

    this.bottombar = new Tile({renderX: 0, renderY: this.screenHeight - 192, renderWidth: 1028, renderHeight: 192, tileWidth: 512, tileHeight: 96, src: "img/battle/bottombar.png"});

    this.textbox = new Tile({renderX: 10, renderY: this.screenHeight - 192 + 10, renderWidth: 481, renderHeight: 176, tileWidth: 244, tileHeight: 88, src: "img/battle/textbox.png"});

    this.fightbtn = new Tile({
        renderX: this.screenWidth/2 - 10,
        renderY: this.screenHeight - 192 + 10,
        renderWidth: 256,
        renderHeight: 92,
        tileWidth: 130,
        tileHeight: 46,
        offset: 130,
        numberOfFrames: 2,
        src: "img/battle/fightbtn.png",
        loop: false,
        pause: true
    });

    this.bagbtn = new Tile({
        renderX: this.screenWidth/2 - 10 + 256,
        renderY: this.screenHeight - 192 + 10,
        renderWidth: 256,
        renderHeight: 92,
        tileWidth: 130,
        tileHeight: 46,
        offset: 130,
        numberOfFrames: 2,
        src: "img/battle/bagbtn.png",
        loop: false,
        pause: true
    });

    this.pokemonbtn = new Tile({
        renderX: this.screenWidth/2 - 10,
        renderY: this.screenHeight - 192 + 10 + 92 - 8,
        renderWidth: 256,
        renderHeight: 92,
        tileWidth: 130,
        tileHeight: 46,
        offset: 130,
        numberOfFrames: 2,
        src: "img/battle/pokemonbtn.png",
        loop: false,
        pause: true
    });

    this.runbtn = new Tile({
        renderX: this.screenWidth/2 - 10 + 256,
        renderY: this.screenHeight - 192 + 10 + 92 - 8,
        renderWidth: 256,
        renderHeight: 92,
        tileWidth: 130,
        tileHeight: 46,
        offset: 130,
        numberOfFrames: 2,
        src: "img/battle/runbtn.png",
        loop: false,
        pause: true
    });
}

Battle.prototype._intro = function() {
    // if intro is over -> exit
    if (this.tick > 500) {
        return;
    }

    if (this.tick < 70) {
        this.player.image.renderX -= 15;
        this.player.base_image.renderX -= 15;

        this.enemy.image.renderX += 15;
        this.enemy.base_image.renderX += 15;
    }

    if (this.tick === 75) {
        this.player.image.pause = false;
        this.enemy.image.pause = false;
    }

    if (this.tick === 200) {
    }

    if (this.tick === 300) {
        // game.endBattle();
    }
}

Battle.prototype._mouseEvents = function(game) {
    let isInsideBox = function(x1, y1, x2, y2) {
        let x = game.listeners.mousePositionX;
        let y = game.listeners.mousePositionY;

        if (x > x1 && y > y1 && x < x2 && y < y2) {
            return true;
        }

        return false;
    }

    this.fightbtn.setFrame(0);
    this.bagbtn.setFrame(0);
    this.pokemonbtn.setFrame(0);
    this.runbtn.setFrame(0);

    if (isInsideBox(this.fightbtn.renderX, this.fightbtn.renderY, this.fightbtn.renderX + this.fightbtn.renderWidth, this.fightbtn.renderY + this.fightbtn.renderHeight)) {
        this.fightbtn.setFrame(1);

        if (game.listeners.click === true) {
            console.log("fight");
        }
    }

    if (isInsideBox(this.bagbtn.renderX, this.bagbtn.renderY, this.bagbtn.renderX + this.bagbtn.renderWidth, this.bagbtn.renderY + this.bagbtn.renderHeight)) {
        this.bagbtn.setFrame(1);

        if (game.listeners.click === true) {
            console.log("bag");
        }
    }

    if (isInsideBox(this.pokemonbtn.renderX, this.pokemonbtn.renderY, this.pokemonbtn.renderX + this.pokemonbtn.renderWidth, this.pokemonbtn.renderY + this.pokemonbtn.renderHeight)) {
        this.pokemonbtn.setFrame(1);

        if (game.listeners.click === true) {
            console.log("pokemon");
        }
    }

    if (isInsideBox(this.runbtn.renderX, this.runbtn.renderY, this.runbtn.renderX + this.runbtn.renderWidth, this.runbtn.renderY + this.runbtn.renderHeight)) {
        this.runbtn.setFrame(1);

        if (game.listeners.click === true) {
            console.log("run");

            game.endBattle();
        }
    }
}

Battle.prototype.update = function(game) {
    this.tick += 1;

    this._intro();

    this.player.image.update(game);
    this.enemy.image.update(game);

    this._mouseEvents(game);
}

Battle.prototype.render = function(context) {
    this.background.render(context);

    // Enemy
    this.enemy.base_image.render(context);
    this.enemy.image.render(context);

    // Player
    this.player.base_image.render(context);
    this.player.image.render(context);

    // Bottom bar
    this.bottombar.render(context);

    this.textbox.render(context);

    this.fightbtn.render(context);
    this.bagbtn.render(context);
    this.pokemonbtn.render(context);
    this.runbtn.render(context);
}

module.exports = Battle;

},{"./Tile.js":6}],2:[function(require,module,exports){
const TileManager = require("./TileManager.js");

function Entity(settings) {
    this.x = settings.x;
    this.y = settings.y;

    this.canvasX = settings.canvasX;
    this.canvasY = settings.canvasY;

    this.collisionSquare = settings.collisionSquare;

    // this.renderWidth = settings.renderWidth;
    // this.renderHeight = settings.renderHeight;

    this.speed = settings.speed;

    this.direction = null;

    this.state = "walking";

    this.col = Math.floor(this.x / 32);
    this.row = Math.floor(this.y / 32);

    this.speedX = null;
    this.speedY = null;

    this.newGrid = false;

    let tileManager = new TileManager();

    tileManager.addSettings({
        identifier: "playerWalk",
        src: "img/character_walking.png",
        renderWidth: settings.renderWidth,
        renderHeight: settings.renderHeight,
        tileWidth: 32,
        tileHeight: 48,
        offset: 32,
        numberOfFrames: 4,
        updateFrequency: 7
    });

    tileManager.addSettings({
        identifier: "playerWater",
        src: "img/character_water.png",
        renderWidth: 64,
        renderHeight: 64,
        tileWidth: 64,
        tileHeight: 64,
        offset: 64,
        numberOfFrames: 4,
        updateFrequency: 7
    });

    tileManager.addSettings({
        identifier: "playerGrass",
        src: "img/character_grass.png",
        renderWidth: settings.renderWidth,
        renderHeight: settings.renderHeight,
        tileWidth: 32,
        tileHeight: 48,
        offset: 32,
        numberOfFrames: 4,
        updateFrequency: 7
    });

    // left, up, right, down
    this.walkTiles = [
        tileManager.getTile("playerWalk", this.canvasX/32, this.canvasY/32, 0, 1),
        tileManager.getTile("playerWalk", this.canvasX/32, this.canvasY/32, 0, 3),
        tileManager.getTile("playerWalk", this.canvasX/32, this.canvasY/32, 0, 2),
        tileManager.getTile(
            "playerWalk",       // identifier
            this.canvasX/32,    // column where to render
            this.canvasY/32,    // row where to render
            0,                  // column of tile in sprite
            0                   // row of tile in sprite
        )
    ];

    this.waterTiles = [
        tileManager.getTile("playerWater", this.canvasX/32, this.canvasY/32, 0, 1),
        tileManager.getTile("playerWater", this.canvasX/32, this.canvasY/32, 0, 3),
        tileManager.getTile("playerWater", this.canvasX/32, this.canvasY/32, 0, 2),
        tileManager.getTile("playerWater", this.canvasX/32, this.canvasY/32, 0, 0),
    ];

    this.grassTiles = [
        tileManager.getTile("playerGrass", this.canvasX/32, this.canvasY/32, 0, 1),
        tileManager.getTile("playerGrass", this.canvasX/32, this.canvasY/32, 0, 3),
        tileManager.getTile("playerGrass", this.canvasX/32, this.canvasY/32, 0, 2),
        tileManager.getTile("playerGrass", this.canvasX/32, this.canvasY/32, 0, 0),
    ];

    this.activeTile = this.walkTiles[3];

    // Get all tiles from tile manager to easily check if all tiles have been loaded
    this.allTiles = tileManager.getAllTiles();
}

/**
 * Returns true if entity has been loaded
 */
Entity.prototype.isLoaded = function() {
    for (let i = 0; i < this.allTiles.length; i++) {
        if (this.allTiles[i].isLoaded() === false) {
            return false;
        }
    }

    return true;
}

Entity.prototype._setSpeed = function(game) {
    let deltaX = game.listeners.mousePositionX - (this.canvasX + this.collisionSquare / 2);
    let deltaY = game.listeners.mousePositionY - (this.canvasY + this.collisionSquare / 2);

    let distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

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

    let squareSize = this.collisionSquare;

    let collisionPoints = [
        [x, y],                         // Top left
        [x+squareSize, y],              // Top right
        [x, y+squareSize],              // Bottom left
        [x+squareSize, y+squareSize],   // Bottom right
        [x+squareSize/2, y],            // Top
        [x+squareSize, y+squareSize/2], // Right
        [x+squareSize/2, y+squareSize], // Bottom
        [x, y+squareSize/2]             // Left
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

/**
 * Updates the col and row position
 * Sets newGrid to true if entering a new grid
 */
Entity.prototype._checkGrid = function(game) {
    let oldColumn = this.col;
    let oldRow = this.row;

    let x = this.x + this.collisionSquare / 2;
    let y = this.y + this.collisionSquare / 2;

    let newColumn = Math.floor((x + this.speedX) / game.map.gridSize);
    let newRow = Math.floor((y + this.speedY) / game.map.gridSize);

    if (oldColumn !== newColumn || oldRow !== newRow) {
        this.newGrid = true;

        this.col = newColumn;
        this.row = newRow;
    }
}

Entity.prototype._checkEvents = function(game) {
    // Only check for events if entered a new grid
    if (this.newGrid === false) {
        return;
    }

    this.newGrid = false;

    // State is 'walking' by default
    this.state = "walking";

    // Get event on position
    let event = game.map.getEvent(this.col, this.row);

    // If there is no event -> exit
    if (typeof event !== "object") {
        return;
    }

    // Change map
    if (event.id === 2) {return game.changeMap(event);}

    // Grass!
    if (event.id === 3) {
        event.data.tile.pause = false;

        this.state = "grass";

        return;
    }

    // Water!
    if (event.id === 4) {return this.state = "water";}
}

Entity.prototype._setActiveTile = function() {
    if (this.direction === "left")
    {
        if (this.state === "walking")
        {
            this.activeTile = this.walkTiles[0];
        }
        else if (this.state === "grass")
        {
            this.activeTile = this.grassTiles[0];
        }
        else if (this.state === "water")
        {
            this.activeTile = this.waterTiles[0];
        }
    }
    else if (this.direction === "up")
    {
        if (this.state === "walking")
        {
            this.activeTile = this.walkTiles[1];
        }
        else if (this.state === "grass")
        {
            this.activeTile = this.grassTiles[1];
        }
        else if (this.state === "water")
        {
            this.activeTile = this.waterTiles[1];
        }
    }
    else if (this.direction === "right")
    {
        if (this.state === "walking")
        {
            this.activeTile = this.walkTiles[2];
        }
        else if (this.state === "grass")
        {
            this.activeTile = this.grassTiles[2];
        }
        else if (this.state === "water")
        {
            this.activeTile = this.waterTiles[2];
        }
    }
    else if (this.direction === "down")
    {
        if (this.state === "walking")
        {
            this.activeTile = this.walkTiles[3];
        }
        else if (this.state === "grass")
        {
            this.activeTile = this.grassTiles[3];
        }
        else if (this.state === "water")
        {
            this.activeTile = this.waterTiles[3];
        }
    }
}

Entity.prototype.update = function(game) {
    if (game.listeners.mousedown) {
        if (this.state === "grass") {
            game.event("grass");
        }

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

        // Check for events
        this._checkEvents(game);

        // Set the active tile depending on direction and events
        this._setActiveTile();

        // Update tile animation
        this.activeTile.update(game);

        return;
    }

    // Reset the animation of the tile
    this.activeTile.setFrame(0);
}

Entity.prototype.render = function(context) {
    // Make sure collision square always is in center of entity!
    // Render width and render height should always be > collision square !!
    let renderOffsetX = (this.activeTile.renderWidth - this.collisionSquare) / 2;
    let renderOffsetY = (this.activeTile.renderHeight - this.collisionSquare);

    this.activeTile.render(context, 0 - renderOffsetX, 0 - renderOffsetY);

    // context.beginPath();
    // context.rect(this.canvasX, this.canvasY, this.collisionSquare, this.collisionSquare);
    // context.stroke();
}

module.exports = Entity;

},{"./TileManager.js":7}],3:[function(require,module,exports){
const Entity = require("./Entity.js");
const MapInitializer = require("./MapInitializer.js");
const Battle = require("./Battle.js");

function Game() {
    this.tickCounter = 0;
    this.framerate = 30;

    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");

    this.map = MapInitializer.getMap("startMap");

    this.coolguy = new Entity({
        x: 14*32,                       // x position on map
        y: 35*32,                       // y position on map
        canvasX: this.canvas.width/2,   // x position on canvas
        canvasY: this.canvas.height/2,  // y position on canvas
        collisionSquare: 20,            // width and height of collision square
        renderWidth: 32,                // render width
        renderHeight: 48,               // render height
        speed: 4                        // speed
    });

    // The tick when system was loaded
    this.loadedTick = null;

    this.battle = null;
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
        if (this.battle !== null) {
            this.battle.update(this);
        } else {
            // Do not update while system is loading
            if (!this.isLoaded()) {
                return;
            }

            // Update coolguy
            this.coolguy.update(this);

            // Update map
            this.map.update(this);
        }

        this.listeners.click = false;
        this.listeners.mouseup = false;
    }

    let render = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.battle !== null) {
            return this.battle.render(this.context);
        }

        // Render 'loading screen' while system is loading
        if (!this.isLoaded()) {
            this.context.beginPath();

            this.context.fillStyle = "rgb(0, 0, 0)";
            this.context.fillRect(0, 0, 10000, 10000);

            this.context.font = "26px Georgia";
            this.context.fillStyle = "#DDDDDD";
            this.context.fillText("Loading!", this.canvas.width/2 - 50, this.canvas.height/2 - 10);

            this.context.stroke();

            return;
        }

        this.map.renderLayer1(this.context);

        this.map.renderTiles(this.context);

        this.coolguy.render(this.context);

        this.map.renderLayer2(this.context);

        this.map.render(this.context);

        // If system was recently loaded -> tone from black screen to game
        if (this.tickCounter - this.loadedTick < 20) {
            this.context.beginPath();
            this.context.fillStyle = "rgba(0, 0, 0, " + (1 - (this.tickCounter - this.loadedTick)/20) + ")";
            this.context.fillRect(0, 0, 10000, 10000);
            this.context.stroke();
        }
    }
};

Game.prototype.event = function(eventname) {
    if (eventname === "grass") {
        this.startBattle("xD");
    }
}

Game.prototype.changeMap = function(event) {
    this.loadedTick = null;

    this.map.destroy();

    this.map = MapInitializer.getMap(event.data.mapName);

    this.coolguy.x = event.data.spawnX;
    this.coolguy.y = event.data.spawnY;
}

Game.prototype.startBattle = function(settings) {
    this.battle = new Battle(settings);
}

Game.prototype.endBattle = function() {
    this.battle = null;
}

module.exports = Game;

},{"./Battle.js":1,"./Entity.js":2,"./MapInitializer.js":5,"./listeners.js":9}],4:[function(require,module,exports){
function Map(x, y, collisionMap, gridSize, layer1Src, layer2Src, audioSrc, tiles) {
    this.x = x;
    this.y = y;

    this.collisionMap = collisionMap;

    this.gridSize = gridSize;

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
    // If the two map layers and audio has been loaded
    if (this.loadCounter === this.loadCounterFinish) {
        for (let i = 0; i < this.tiles.length; i++) {

            // Return false if a tile has not been loaded
            if (this.tiles[i].image.complete === false) {
                return false;
            }
        }

        // If all tiles also has been loaded
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
    this.x = game.coolguy.canvasX - game.coolguy.x;
    this.y = game.coolguy.canvasY - game.coolguy.y;

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

},{}],5:[function(require,module,exports){
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

},{"./Map.js":4,"./TileManager.js":7}],6:[function(require,module,exports){
function Tile(settings) {
    this.renderCol = settings.renderCol ? settings.renderCol : 0;
    this.renderRow = settings.renderRow ? settings.renderRow : 0;

    this.renderX = settings.renderX ? settings.renderX : 0;
    this.renderY = settings.renderY ? settings.renderY : 0;

    this.renderWidth = settings.renderWidth;
    this.renderHeight = settings.renderHeight;

    this.spriteCol = settings.spriteCol ? settings.spriteCol : 0;
    this.spriteRow = settings.spriteRow ? settings.spriteRow : 0;

    this.tileWidth = settings.tileWidth;
    this.tileHeight = settings.tileHeight;

    this.offset = settings.offset ? settings.offset : 0;

    this.numberOfFrames = settings.numberOfFrames ? settings.numberOfFrames : 1;

    this.updateFrequency = settings.updateFrequency ? settings.updateFrequency : null;

    this.image = new Image();
    this.image.src = settings.src;

    this.loop = settings.loop === undefined ? true : settings.loop;
    // this.loop = true;

    this.pause = settings.pause === undefined ? false : settings.pause;
    // this.pause = false;

    // Animation
    this.animationCounter = 0;

    this.spriteOffset = 0;
}

/**
 * Returns true if tile has been loaded
 */
Tile.prototype.isLoaded = function() {
    if (this.loadCounter === this.loadCounterFinish) {
        return true;
    }

    return false;
}

Tile.prototype.setFrame = function(framenumber) {
    this.animationCounter = framenumber;
    this.spriteOffset = framenumber * this.offset;
}

Tile.prototype.update = function(game) {
    // Dont update if animation is paused
    if (this.pause === true) {
        return;
    }

    // No need to update if only one frame!
    if (this.numberOfFrames === 1) {
        return;
    }

    if (game.tickCounter % this.updateFrequency === 0) {
        this.animationCounter += 1;

        this.spriteOffset = this.offset * (this.animationCounter % this.numberOfFrames);

        // If no looping and at the first frame of the animation -> pause animation
        if (this.loop === false && this.animationCounter % this.numberOfFrames === 0) {
            this.pause = true;
        }
    }
}

Tile.prototype.render = function(context, mapX, mapY) {
    mapX = mapX ? mapX : 0;
    mapY = mapY ? mapY : 0;

    let xInImage = this.spriteCol * this.tileWidth + this.spriteOffset;
    let yInImage = this.spriteRow * this.tileHeight;

    let renderX = this.renderCol ? this.renderCol * 32 : this.renderX;
    let renderY = this.renderRow ? this.renderRow * 32 : this.renderY;

    context.drawImage(
        this.image,
        xInImage,
        yInImage,
        this.tileWidth,
        this.tileHeight,
        mapX + renderX,
        mapY + renderY,
        this.renderWidth,
        this.renderHeight
    );
    
}

module.exports = Tile;

},{}],7:[function(require,module,exports){
const Tile = require("./Tile.js");

function TileManager(settings) {
    this.tilesSettings = [];

    this.addSettings(settings);

    this.tiles = [];
}

/**
 * Return all initialized tiles
 */
TileManager.prototype.getAllTiles = function() {
    return this.tiles;
}

TileManager.prototype.addSettings = function(settings) {
    if (settings === undefined) {
        return;
    }

    /**
     * If adding settings as array
     */
    if (Array.isArray(settings))
    {
        this.tilesSettings = this.tilesSettings.concat(settings);
    }
    else
    {
        this.tilesSettings.push(settings);
    }
}

/**
 * Initialize and return a tile
 * All initialized tiles are also saved in the tile manager!
 */
TileManager.prototype.getTile = function(identifier, renderCol, renderRow, spriteCol, spriteRow) {
    let settings = this.tilesSettings.find(x => x.identifier === identifier);

    let tile = new Tile({
        renderCol: renderCol,                       // col where to render
        renderRow: renderRow,                       // row where to render
        renderWidth: settings.renderWidth,          // render width
        renderHeight: settings.renderHeight,        // render height
        spriteCol: spriteCol,                       // col of tile in spirte
        spriteRow: spriteRow,                       // row of tile in sprite
        tileWidth: settings.tileWidth,              // width of tile in sprite
        tileHeight: settings.tileHeight,            // height of tile in sprite
        offset: settings.offset,                    // offset length
        numberOfFrames: settings.numberOfFrames,    // number of frames
        updateFrequency: settings.updateFrequency,  // specifies how often to update (5 is every fifth tick, 2 is every other tick, 1 is every tick etc...)
        src: settings.src,                          // sprite or sprites src
        loop: settings.loop,                        // loop
        pause: settings.pause                       // pause
    });

    // All initialized tiles are also saved in the tile manager
    this.tiles.push(tile);

    return tile;
}

module.exports = TileManager;

},{"./Tile.js":6}],8:[function(require,module,exports){
let Game = require("./Game.js");

// node_modules/.bin/browserify source/js/app.js > debug/js/bundle.js

window.addEventListener("load", function() {
    let game = new Game();

    game.startGame();
});

},{"./Game.js":3}],9:[function(require,module,exports){
function addListeners(game) {
    game.listeners = {};

    game.canvas.addEventListener("click", function(event) {
        game.listeners.click = true;
    });

    game.canvas.addEventListener("mousedown", function(event) {
        game.listeners.mousedown = true;

        let canvasRect = game.canvas.getBoundingClientRect();

        game.listeners.mousePositionX = canvasRect.left*-1 + event.pageX;
        game.listeners.mousePositionY = canvasRect.top*-1 + event.pageY;
    });

    game.canvas.addEventListener("mousemove", function(event) {
        game.listeners.mousemove = true;

        let canvasRect = game.canvas.getBoundingClientRect();

        game.listeners.mousePositionX = canvasRect.left*-1 + event.pageX;
        game.listeners.mousePositionY = canvasRect.top*-1 + event.pageY;
    });

    window.addEventListener("mouseup", function(event) {
        game.listeners.mouseup = true;

        game.listeners.mousedown = false;
        game.listeners.mousemove = false;
    });

    game.canvas.addEventListener("keydown", function(event) {
        console.log("keydown");
    });
}

module.exports = {
    addListeners: addListeners
}

},{}]},{},[8]);
