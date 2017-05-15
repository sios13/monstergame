(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const Tile = require("./Tile.js");
const Conversation = require("./Conversation.js");

function Battle(service, settings) {
    this.service = service;
    this.tick = -1;

    this.state = "intro1";

    this.playerMonster = this.service.resources.monsters.find( monster => monster.name === this.service.save.monsters[0].name );
    this.playerMonster.tileBack.renderX = 86;
    this.playerMonster.tileBack.renderY = 768 - 340 - 192 + 60;

    this.opponentMonster = settings.opponent;

    this.audio = this.service.resources.audios.find(audio => audio.getAttribute("src") === "audio/pkmn-fajt.mp3");
    this.audio.volume = 1;
    this.audio.currentTime = 0;
    this.audio.loop = true;
    this.audio.play();

    console.log(this.audio);

    this.conversation = new Conversation(service, {
        backgroundSrc: "img/conversation/background_battle.png",
        hidden: true,
        nextable: false
    });

    this.flashTile = this.service.resources.getTile("flash", 0, 0, 1024, 768);
    this.flashTile.alpha = 0;

    this.backgroundTile = this.service.resources.getTile("battleBgForestEve", 0, 0, 1024, 768);
    this.backgroundTile.alpha = 0;

    this.playerbaseTile = this.service.resources.getTile("battlePlayerbase", 1024, 768 - 192 - 64, 512, 64);

    this.playerTile = this.service.resources.getTile("battlePlayer", 1024 + 170, 768 - 192 - 230, 230, 230);

    this.playerMonsterTile = this.playerMonster.tileBack;
    this.playerMonsterTile.alpha = 0;

    this.opponentMonsterTile = this.opponentMonster.tileFront;
    this.opponentMonsterTile.renderX = 0 - 256 - this.opponentMonsterTile.renderWidth/2;
    // this.opponentMonster.tileFront.renderY = 80;

    this.opponentbaseTile = this.service.resources.getTile("battleOpponentbase", -512, 200, 512, 256);

    this.ballTile = this.service.resources.getTile("battleBall", 0, 410, 48, 48);
    this.ballTile.alpha = 0;

    this.bottombarTile = this.service.resources.getTile("battleBottombar", 0, 768 - 192, 1028, 192);
    this.bottombarTile.alpha = 0;

    this.fightbtnTile = this.service.resources.getTile("battleFightbtn", 514, 768 - 192 + 10, 256, 92);
    this.fightbtnTile.alpha = 0;

    this.bagbtnTile = this.service.resources.getTile("battleBagbtn", 770, 768 - 192 + 10, 256, 92);
    this.bagbtnTile.alpha = 0;

    this.pokemonbtnTile = this.service.resources.getTile("battlePokemonbtn", 514, 768 - 192 + 92, 256, 92);
    this.pokemonbtnTile.alpha = 0;

    this.runbtnTile = this.service.resources.getTile("battleRunbtn", 770, 768 - 192 + 92, 256, 92);
    this.runbtnTile.alpha = 0;

    this.attack1Tile = this.service.resources.getTile("battleAttackbtn", 0, 768 - 192, 338, 96);
    this.attack1Tile.alpha = 1;

    this.attack2Tile = this.service.resources.getTile("battleAttackbtn", 338, 768 - 192, 338, 96);
    this.attack2Tile.alpha = 0;

    this.attack3Tile = this.service.resources.getTile("battleAttackbtn", 0, 768 - 96, 338, 96);
    this.attack3Tile.alpha = 0;

    this.attack4Tile = this.service.resources.getTile("battleAttackbtn", 338, 768 - 96, 338, 96);
    this.attack4Tile.alpha = 0;
}

Battle.prototype._normalState = function() {
    this.fightbtnTile.setFrame(0);
    this.bagbtnTile.setFrame(0);
    this.pokemonbtnTile.setFrame(0);
    this.runbtnTile.setFrame(0);
}

Battle.prototype._playIntro1 = function() {
    if (this.tick >= 0 && this.tick < 5) {
        this.flashTile.alpha += 0.20;
    }
    if (this.tick >= 5 && this.tick < 10) {
        this.flashTile.alpha -= 0.20;
    }

    if (this.tick >= 10 && this.tick < 15) {
        this.flashTile.alpha += 0.20;
    }
    if (this.tick >= 15 && this.tick < 20) {
        this.flashTile.alpha -= 0.20;
    }

    if (this.tick >= 20 && this.tick < 25) {
        this.flashTile.alpha += 0.20;
    }
    if (this.tick >= 25 && this.tick < 30) {
        this.flashTile.alpha -= 0.20;
    }

    if (this.tick >= 30 && this.tick < 35) {
        this.flashTile.alpha += 0.20;
    }
    if (this.tick >= 35 && this.tick < 40) {
        this.flashTile.alpha -= 0.20;
    }

    if (this.tick >= 60 && this.tick < 70) {
        this.flashTile.alpha += 0.10;
    }

    // Transition is over -> set starting positions
    if (this.tick === 105) {
        this.backgroundTile.alpha = 1;

        this.bottombarTile.alpha = 1;

        this.conversation.hidden = false;
    }

    if (this.tick > 105 && this.tick < 175) {
        this.playerTile.renderX -= 15;
        this.playerbaseTile.renderX -= 15;

        this.opponentMonsterTile.renderX += 15;
        this.opponentbaseTile.renderX += 15;
    }

    if (this.tick === 180) {
        this.opponentMonsterTile.pause = false;
        this.opponentMonster.cry.play();

        this.conversation.addText("Wild " + this.opponentMonster.name + " appeared!+");
        this.conversation.nextable = true;
        this.conversation.next();
        this.conversation.addCallable(function() {
            this.tick = -1;
            this.state = "intro2";
            this.conversation.addText("Go! " + this.playerMonster.name + "!+");
            this.conversation.nextable = false;
        }.bind(this));
    }
}

Battle.prototype._playIntro2 = function() {
    if (this.tick === 0) {
        this.playerTile.pause = false;
    }

    if (this.tick > 0 && this.tick < 40) {
        this.playerTile.renderX -= 15;
    }

    if (this.tick === 10) {
        this.ballTile.renderX = 150;
    }

    if (this.tick > 10 && this.tick < 40) {
        this.ballTile.alpha = 1;
        this.ballTile.renderX += 5;
        this.ballTile.renderY += 2;
    }

    if (this.tick === 40) {
        this.playerMonsterTile.alpha = 1;
        this.playerMonsterTile.pause = false;
        this.playerMonster.cry.play();

        this.ballTile.alpha = 0;
    }

    if (this.tick === 60) {
        this.conversation.nextable = true;
        this.conversation.addText("What will+" + this.playerMonster.name + " do?");
        this.conversation.addCallable(function() {
            this.conversation.nextable = false;
            this._setState("choose");
        }.bind(this));
    }
}

Battle.prototype._setState = function(state) {
    if (state === "choose") {
        this.fightbtnTile.alpha = 1;
        this.bagbtnTile.alpha = 1;
        this.pokemonbtnTile.alpha = 1;
        this.runbtnTile.alpha = 1;

        this.state = "choose";
    }

    if (state === "chooseattack") {
        this.conversation.hidden = true;

        this.fightbtnTile.alpha = 0;
        this.bagbtnTile.alpha = 0;
        this.pokemonbtnTile.alpha = 0;
        this.runbtnTile.alpha = 0;

        this.attack1Tile.alpha = 1;
        this.attack2Tile.alpha = 1;
        this.attack3Tile.alpha = 1;
        this.attack4Tile.alpha = 1;

        this.state = "chooseattack";
    }
}

Battle.prototype._choose = function() {
    if (this.fightbtnTile.pointerInside()) {
        this.fightbtnTile.setFrame(1);

        if (this.service.listeners.click) {
            this._setState("chooseattack");
            // this.state = "chooseattack";

            // this.conversation.addText("haha+hahaha");
            // this.conversation.nextable = true;
            // this.conversation.next();
            // this.conversation.nextable = false;
        }
    }

    if (this.bagbtnTile.pointerInside()) {
        this.bagbtnTile.setFrame(1);

        if (this.service.listeners.click === true) {
            console.log("bag");
        }
    }

    if (this.pokemonbtnTile.pointerInside()) {
        this.pokemonbtnTile.setFrame(1);

        if (this.service.listeners.click === true) {
            console.log("pokemon");
        }
    }

    if (this.runbtnTile.pointerInside()) {
        this.runbtnTile.setFrame(1);

        if (this.service.listeners.click === true) {
            this.state = "chooserun";
        }
    }
}

Battle.prototype._chooseAttack = function() {
    if (this.attack1Tile.pointerInside()) {
        if (this.service.listeners.click) {
            console.log("hej!");
        }
    }

    // let isInsideBox = function(x1, y1, x2, y2) {
    //     let x = this.service.listeners.mousePositionX;
    //     let y = this.service.listeners.mousePositionY;

    //     if (x > x1 && y > y1 && x < x2 && y < y2) {
    //         return true;
    //     }

    //     return false;
    // }

    // let x = this.service.listeners.mousePositionX;
    // let y = this.service.listeners.mousePositionY;
}

Battle.prototype.update = function() {
    this.tick += 1;

    // normal state hehe
    this._normalState();

    /** 
     * Play a scene mby... ?
     */
    if (this.state === "intro1") {
        this._playIntro1();
    }

    if (this.state === "intro2") {
        this._playIntro2();
    }

    if (this.state === "choose") {
        this._choose();
    }

    if (this.state === "chooseattack") {
        this._chooseAttack();
    }

    if (this.state === "chooserun") {
        this.service.events.push(function() {
            this.service.battleCanvas.style.zIndex = 0;
            this.service.worldCanvas.style.zIndex = 1;

            this.service.battle.audio.pause();

            this.service.map.audio.volume = 0;
            this.service.playAudio(this.service.map.audio);

            this.service.state = "world";
        });
    }

    /**
     * Update tiles
     */
    this.ballTile.update();

    this.playerMonsterTile.update();

    this.playerTile.update();

    this.opponentMonsterTile.update();

    this.conversation.update();
}

Battle.prototype.render = function() {
    let context = this.service.battleContext;

    this.flashTile.render(context);

    this.backgroundTile.render(context);

    this.opponentbaseTile.render(context);

    this.opponentMonsterTile.render(context);

    this.playerbaseTile.render(context);

    this.playerMonsterTile.render(context);

    this.playerTile.render(context);

    this.ballTile.render(context);

    this.bottombarTile.render(context);

    this.conversation.render(context);

    this.fightbtnTile.render(context);
    
    this.bagbtnTile.render(context);

    this.pokemonbtnTile.render(context);
    
    this.runbtnTile.render(context);

    this.attack1Tile.render(context);

    this.attack2Tile.render(context);

    this.attack3Tile.render(context);

    this.attack4Tile.render(context);
}

module.exports = Battle;

},{"./Conversation.js":2,"./Tile.js":9}],2:[function(require,module,exports){
const Tile = require("./Tile.js");

function Conversation(service, settings) {
    this.service = service;

    this.backgroundTile = this.service.resources.getTile("conversationBg", 0, 768 - 180 - 5, 1024, 180);

    this.nextbtnTile = this.service.resources.getTile("conversationNextbtn", 840, 610, 120, 120);

    this.texts = ["+"];

    this.line1 = "";
    this.line2 = "";

    this.textsIndex = 0;

    this.callable = null;

    // Hides the covnversation, do not render the converation if true
    this.hidden = settings.hidden;

    this.typing = false;

    this.nextable = settings.nextable;
}

// Shows the next text
Conversation.prototype.next = function() {
    // Do not go to next text if current text is still typing
    if (this.typing === true || this.nextable === false) {
        return;
    }

    if (this.callable) {
        this.callable();
        this.callable = null;
    }

    // Do not allow to go to next if next text is undefined!
    if (this.texts[this.textsIndex + 1] !== undefined) {
        this.textsIndex += 1;
    }

    this.line1 = "";
    this.line2 = "";
}

Conversation.prototype.addText = function(text) {
    this.texts.push(text);
}

/**
 * Adds a callable to be called when next is called
 */
Conversation.prototype.addCallable = function(callable) {
    this.callable = callable;
}

/**
 * Updates text 'animation' and determines if is typing
 */
Conversation.prototype._updateText = function() {
    if (this.line1 + "+" + this.line2 !== this.texts[this.textsIndex]) {
        this.typing = true;

        let index = this.texts[this.textsIndex].indexOf("+");

        if (this.texts[this.textsIndex].substring(0, index) !== this.line1) {
            this.line1 += this.texts[this.textsIndex][this.line1.length];
        } else {
            this.line2 += this.texts[this.textsIndex][this.line1.length + this.line2.length + 1];
        }

        if (this.line1 + "+" + this.line2 === this.texts[this.textsIndex]) {
            this.typing = false;
        }
    }
}

Conversation.prototype.update = function() {
    this._updateText();

    if (this.typing === true || this.nextable === false) {
        this.nextbtnTile.setFrame(0);
    } else {
        this.nextbtnTile.setFrame(1);
    }

    let x = this.service.listeners.mousePositionX;
    let y = this.service.listeners.mousePositionY;

    // If clicked at conversation bar
    if (this.service.listeners.click && this.backgroundTile.pointerInside()) {
        this.next();
    }
}

Conversation.prototype.render = function(context) {
    // Do not render if conversation should be hidden
    if (this.hidden === true) {
        return;
    }

    this.backgroundTile.render(context);

    this.nextbtnTile.render(context);

    context.font = "30px 'Press Start 2P'";
    context.fillStyle = "rgba(0,0,0,0.8)";
    context.fillText(this.line1, 75, 660);

    context.font = "30px 'Press Start 2P'";
    context.fillStyle = "rgba(0,0,0,0.8)";
    context.fillText(this.line2, 75, 720);
}

module.exports = Conversation;

},{"./Tile.js":9}],3:[function(require,module,exports){
function Entity(service, settings) {
    this.service = service;

    this.x = 14*32;
    this.y = 35*32;

    this.collisionSquare = 20;

    this.speed = 4;

    this.direction = 3;

    this.state = "walking";

    this.col = Math.floor(this.x / 32);
    this.row = Math.floor(this.y / 32);

    this.speedX = 0;
    this.speedY = 0;

    this.stop = false;

    // left, up, right, down
    this.walkTiles = [
        this.service.resources.getTile("playerWalk(0,1)", 0, 0, 32, 48),
        this.service.resources.getTile("playerWalk(0,3)", 0, 0, 32, 48),
        this.service.resources.getTile("playerWalk(0,2)", 0, 0, 32, 48),
        this.service.resources.getTile("playerWalk(0,0)", 0, 0, 32, 48)
    ];
    this.grassTiles = [
        this.service.resources.getTile("playerGrass(0,1)", 0, 0, 32, 48),
        this.service.resources.getTile("playerGrass(0,3)", 0, 0, 32, 48),
        this.service.resources.getTile("playerGrass(0,2)", 0, 0, 32, 48),
        this.service.resources.getTile("playerGrass(0,0)", 0, 0, 32, 48)
    ];
    this.waterTiles = [
        this.service.resources.getTile("playerWater(0,1)", 0, 0, 64, 64),
        this.service.resources.getTile("playerWater(0,3)", 0, 0, 64, 64),
        this.service.resources.getTile("playerWater(0,2)", 0, 0, 64, 64),
        this.service.resources.getTile("playerWater(0,0)", 0, 0, 64, 64)
    ];

    this.activeTiles = this.walkTiles;

    this.activeTile = this.walkTiles[3];

    // Make sure collision square always is in center of entity!
    // Render width and render height should always be > collision square !!
    this.renderX = this.service.worldCanvas.width/2 - (this.activeTile.renderWidth - this.collisionSquare) / 2;
    this.renderY = this.service.worldCanvas.height/2 - (this.activeTile.renderHeight - this.collisionSquare);
    
    this.canvasX = 512; // x position on canvas
    this.canvasY = 384; // y position on canvas
}

Entity.prototype._setSpeed = function() {
    let deltaX = this.service.listeners.mousePositionX - (this.canvasX + this.collisionSquare / 2);
    let deltaY = this.service.listeners.mousePositionY - (this.canvasY + this.collisionSquare / 2);

    let distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

    this.speedX = deltaX/distance*this.speed;
    this.speedY = deltaY/distance*this.speed;
}

/**
 * Sets the direction
 * 0 = left, 1 = up, 2 = right, 3 = down
 */
Entity.prototype._setDirection = function() {
    let radians = Math.atan2(this.speedY, this.speedX);

    let degrees = radians * (180 / Math.PI);

    if (degrees < -135 || degrees > 135) {
        this.direction = 0;
        // this.direction = "left";
    } else if (degrees < -45) {
        this.direction = 1;
        // this.direction = "up";
    } else if (degrees < 45) {
        this.direction = 2;
        // this.direction = "right";
    } else if (degrees < 135) {
        this.direction = 3;
        // this.direction = "down";
    }
}

Entity.prototype._detectCollision = function() {
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

        let oldColumn = Math.floor(pointX / this.service.map.gridSize);
        let oldRow = Math.floor(pointY / this.service.map.gridSize);

        let newColumn = Math.floor((pointX+this.speedX) / this.service.map.gridSize);
        let newRow = Math.floor((pointY+this.speedY) / this.service.map.gridSize);

        // If collision point is trying to enter a disallowed grid
        if (this.service.map.collisionMap[newRow][newColumn] === 1) {
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

Entity.prototype.setState = function(state) {
    if (state === "walking") {
        this.activeTiles = this.walkTiles;
    }

    if (state === "grass") {
        this.activeTiles = this.grassTiles;
    }

    if (state === "water") {
        this.activeTiles = this.waterTiles;
    }

    this.state = state;

    this.renderX = this.service.worldCanvas.width/2 - (this.activeTiles[0].renderWidth - this.collisionSquare) / 2;
    this.renderY = this.service.worldCanvas.height/2 - (this.activeTiles[0].renderHeight - this.collisionSquare);

    console.log(this.state);
}

Entity.prototype.update = function() {

    this.activeTile = this.activeTiles[this.direction];

    if (this.service.listeners.mousedown)
    {
        // Use the mouse position to determine the entity speed (speedX speedY)
        this._setSpeed();

        // Use the speed to determine the direction
        this._setDirection();

        // Detect collision.
        // If collision is detected -> set the speed to 0
        this._detectCollision();

        if (this.stop === true) {
            this.speedX = 0;
            this.speedY = 0;
        }

        // Finally, add the speed to the position
        this.x += this.speedX;
        this.y += this.speedY;

        // Update grid position
        let oldCol = this.col;
        let oldRow = this.row;

        this.col = Math.floor((this.x + this.collisionSquare / 2 + this.speedX) / this.service.map.gridSize);
        this.row = Math.floor((this.y + this.collisionSquare / 2 + this.speedY) / this.service.map.gridSize);

        // If entering a new grid -> push the new grid event to service.events
        if (this.col !== oldCol || this.row !== oldRow) {
            let event = this.service.map.getEvent(this.col, this.row);

            this.service.events.push(event);
        }

        // Update tile animation (walking animation etc...)
        this.activeTile.update();

        return;
    }

    // Reset the animation of the tile
    this.activeTile.setFrame(0);
}

Entity.prototype.render = function() {
    this.activeTile.render(this.service.worldContext, this.renderX, this.renderY);

    // this.service.worldContext.beginPath();
    // this.service.worldContext.rect(this.canvasX, this.canvasY, this.collisionSquare, this.collisionSquare);
    // this.service.worldContext.stroke();
}

module.exports = Entity;

},{}],4:[function(require,module,exports){
const Entity = require("./Entity.js");
const MapManager = require("./MapManager.js");
const Battle = require("./Battle.js");
const Loader = require("./Loader.js");

Function.prototype.bindArgs = function(...boundArgs)
{
    let context = this;
    return function(...args) { return context.call(this, ...boundArgs, ...args); };
};

function Game() {
    this.now = null;
    this.deltaTime = 0;
    this.last = Date.now();
    this.step = 1/30;

    /**
     * Initialize service
     */
    this.service = require("./InitializeService.js")();

    // Load save file
    this.service.save = require("./resources/savefile.json");

    this.service.tick = 0;

    this.service.state = "";

    this.service.events = [];

    // Load resources to service.resouces
    this.loader = new Loader(this.service, {});
    // Initialize world state
    this.service.events.push(function() {
        this.loader.load(
            undefined,
            function() {
                this.service.coolguy = new Entity(this.service, {});

                this.service.mapManager = new MapManager(this.service, {});

                this.service.map = this.service.mapManager.getMap("startMap");

                this.service.state = "world";
            },
            function() {
                this.service.map.audio.volume = 0;

                this.service.playAudio(this.service.map.audio);
            }
        );
    });

    // Loading properties
    this.service.loadCanvas = document.querySelector(".loadCanvas");
    this.service.loadContext = this.service.loadCanvas.getContext("2d");

    // Battle properties
    this.service.battleCanvas = document.querySelector(".battleCanvas");
    this.service.battleContext = this.service.battleCanvas.getContext("2d");

    // World properties
    this.service.worldCanvas = document.querySelector(".worldCanvas");
    this.service.worldContext = this.service.worldCanvas.getContext("2d");

    require("./listeners.js").addListeners(this.service);

    this.startGame();
}

Game.prototype.startGame = function() {
    function frame() {
        this.now = Date.now();

        this.deltaTime = this.deltaTime + Math.min(1, (this.now - this.last) / 1000);

        while(this.deltaTime > this.step) {
            this.deltaTime = this.deltaTime - this.step;
            this.update();
        }

        this.last = this.now;

        this.render();

        requestAnimationFrame(frame.bind(this));
    }

    // Start game!
    requestAnimationFrame(frame.bind(this));
};

Game.prototype.update = function() {
    this.service.tick += 1;

    // Check for events in service.events
    this.checkEvents();

    // Update loader
    this.loader.update();

    if (this.service.state === "loading") {
    }

    if (this.service.state === "battle") {
        // Update battle
        this.service.battle.update();
    }

    if (this.service.state === "world") {
        // Update coolguy
        this.service.coolguy.update();

        // Update map
        this.service.map.update();
    }

    this.service.listeners.click = false;
    this.service.listeners.mouseup = false;
}

Game.prototype.render = function() {
    this.loader.render();

    if (this.service.state === "battle") {
        let context = this.service.battleContext;

        context.clearRect(0, 0, this.service.battleCanvas.width, this.service.battleCanvas.height);

        this.service.battle.render();
    }

    if (this.service.state === "world") {
        let context = this.service.worldContext;

        context.clearRect(0, 0, this.service.worldCanvas.width, this.service.worldCanvas.height);

        this.service.map.renderLayer1();

        this.service.coolguy.render();

        this.service.map.renderLayer2();
    }
}

/**
 * Iterates and executes all events in service.events
 */
Game.prototype.checkEvents = function() {
    // Do not check for events if there are no events!
    if (this.service.events.length === 0) {
        return;
    }
    
    for (let i = 0; i < this.service.events.length; i++) {
        let event = this.service.events[i];

        event.call(this);
    }

    // All events have been checked -> make the events array empty
    this.service.events = [];
}

module.exports = Game;

},{"./Battle.js":1,"./Entity.js":3,"./InitializeService.js":5,"./Loader.js":6,"./MapManager.js":8,"./listeners.js":11,"./resources/savefile.json":13}],5:[function(require,module,exports){
module.exports = function() {
    let service = {};

    // Add some nice functions to the service
    service.pauseAudio = function(audio) {
        let fadeAudio = setInterval(function() {
            if (audio.volume <= 0.010) {
                audio.volume = 0;

                audio.pause();

                clearInterval(fadeAudio);

                return;
            }

            audio.volume -= 0.010;
        }, 10);
    }

    service.playAudio = function(audio) {
        audio.play();

        let fadeAudio = setInterval(function() {
            if (audio.volume >= 0.990) {
                audio.volume = 1;

                clearInterval(fadeAudio);

                return;
            }

            audio.volume += 0.010;
        }, 30);
    }

    return service;
};

},{}],6:[function(require,module,exports){
const Tile = require("./Tile.js");

function Loader(service, settings)
{
    this.service = service;

    this.service.resources = {};
    // this.service.resources.tiles = [];
    // this.service.resources.monsters = [];

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
        "audio/pkmn-fajt.mp3"
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

},{"./Tile.js":9,"./resources/monsters.json":12,"./resources/sprites.json":14,"./resources/tiles.json":15}],7:[function(require,module,exports){
function Map(service, settings) {
    this.service = service;

    this.x = settings.x ? settings.x : 0;
    this.y = settings.y ? settings.y : 0;

    this.collisionMap = settings.collisionMap;

    this.gridSize = settings.gridSize ? settings.gridSize : 32;

    this.layer1Tile = settings.layer1Tile;

    this.layer2Tile = settings.layer2Tile;

    this.audio = settings.audio;
    this.audio.loop = true;
    // this.audio.play();

    this.tiles = settings.tiles;
}

Map.prototype.attachEvent = function(col, row, event) {
    this.collisionMap[row][col] = event;
}

Map.prototype.getEvent = function(col, row) {
    return this.collisionMap[row][col];
}

Map.prototype.update = function() {
    // Update map position
    this.x = this.service.coolguy.canvasX - this.service.coolguy.x;
    this.y = this.service.coolguy.canvasY - this.service.coolguy.y;

    for (let i = 0; i < this.tiles.length; i++) {
        this.tiles[i].update();
    }
}

Map.prototype.renderLayer1 = function() {
    let context = this.service.worldContext;

    this.layer1Tile.render(context, this.x, this.y);

    /**
     * Render tiles!
     */
    for (let i = 0; i < this.tiles.length; i++) {
        this.tiles[i].render(context, this.x, this.y);
    }
}

Map.prototype.renderLayer2 = function() {
    let context = this.service.worldContext;

    this.layer2Tile.render(context, this.x, this.y);

    /**
     * Render squares!
     */
    for (let y = 0; y < this.collisionMap.length; y++) {
        for (let x = 0; x < this.collisionMap[y].length; x++) {
            if (this.collisionMap[y][x] !== 0) {
                // context.beginPath();
                // context.rect(this.x + x*32, this.y + y*32, 32, 32);
                // context.stroke();
            }
        }
    }
}

module.exports = Map;

},{}],8:[function(require,module,exports){
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
                this.service.pauseAudio(this.service.map.audio);

                this.service.coolguy.stop = true;
            },
            function() {
                this.service.map = this.service.mapManager.getMap(newMapName);

                this.service.coolguy.x = newX * 32;
                this.service.coolguy.y = newY * 32;
            },
            function() {
                this.service.map.audio.volume = 0;

                this.service.playAudio(this.service.map.audio);

                this.service.coolguy.stop = false;
            }
        );
    };
    this.grassEvent = function() {
        this.service.coolguy.setState("grass");

        if (true) {
            this.service.state = "battle";

            this.service.map.audio.pause();
            this.service.map.audio.volume = 0;

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

    let layer1Tile = this.service.resources.getTile("map1layer1", 0, 0, 3200, 3200);

    let layer2Tile = this.service.resources.getTile("map1layer2", 0, 0, 3200, 3200);

    let audio = this.service.resources.audios.find(audio => audio.getAttribute("src") === "audio/music1.mp3");

    let tiles = [
        this.service.resources.getTile("grass", 8*32, 30*29, 32, 32),
        this.service.resources.getTile("grass", 9*32, 30*29, 32, 32),
        this.service.resources.getTile("grass", 10*32, 30*29, 32, 32),
        this.service.resources.getTile("grass", 11*32, 30*29, 32, 32),
        this.service.resources.getTile("grass", 8*32, 31*29, 32, 32),
        this.service.resources.getTile("grass", 9*32, 31*29, 32, 32),
        this.service.resources.getTile("grass", 10*32, 31*29, 32, 32),
        this.service.resources.getTile("grass", 11*32, 31*29, 32, 32),
        this.service.resources.getTile("grass", 8*32, 32*29, 32, 32),
        this.service.resources.getTile("grass", 9*32, 32*29, 32, 32),
        this.service.resources.getTile("grass", 10*32, 32*29, 32, 32),
        this.service.resources.getTile("grass", 11*32, 32*29, 32, 32),
        this.service.resources.getTile("grass", 9*32, 33*29, 32, 32),
        this.service.resources.getTile("grass", 10*32, 33*29, 32, 32),
        this.service.resources.getTile("grass", 11*32, 33*29, 32, 32),

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

    let layer1Tile = this.service.resources.getTile("house1layer1", 0, 0, 3200, 3200);(tile => tile.name === "house1layer1");

    let layer2Tile = this.service.resources.getTile("house1layer2", 0, 0, 3200, 3200);

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

},{"./Battle.js":1,"./Map.js":7,"./Tile.js":9}],9:[function(require,module,exports){
function Tile(service, settings) {
    this.service = service;

    this.name = settings.name ? settings.name : "tilename";

    this.image = settings.image;

    this.src = settings.src;

    this.tileWidth = settings.tileWidth ? settings.tileWidth : 0;
    this.tileHeight = settings.tileHeight ? settings.tileHeight : 0;

    this.spriteWidth = settings.spriteWidth ? settings.spriteWidth : this.tileWidth;
    this.spriteHeight = settings.spriteHeight ? settings.spriteHeight : this.tileHeight;

    this.renderWidth = settings.renderWidth ? settings.renderWidth : this.tileWidth;
    this.renderHeight = settings.renderHeight ? settings.renderHeight : this.tileHeight;

    this.spriteCol = settings.spriteCol ? settings.spriteCol : 0;
    this.spriteRow = settings.spriteRow ? settings.spriteRow : 0;

    this.numberOfFrames = settings.numberOfFrames ? settings.numberOfFrames : 1;

    this.updateFrequency = settings.updateFrequency ? settings.updateFrequency : null;

    this.loop = settings.loop === undefined ? true : settings.loop;

    this.pause = settings.pause === undefined ? false : settings.pause;

    this.alpha = settings.alpha ? settings.alpha : 1;

    this.renderX = settings.renderX ? settings.renderX : 0;
    this.renderY = settings.renderY ? settings.renderY : 0;

    // Animation
    this.animationCounter = 0;

    this.spriteOffset = 0;

    // 
    this.tick = 0;
}

Tile.prototype.pointerInside = function() {
    let x = this.service.listeners.mousePositionX;
    let y = this.service.listeners.mousePositionY;

    return x > this.renderX && y > this.renderY && x < (this.renderX + this.renderWidth) && y < (this.renderY + this.renderHeight);
}

Tile.prototype.setFrame = function(framenumber) {
    this.animationCounter = framenumber;
    this.spriteOffset = framenumber * this.spriteWidth;
}

Tile.prototype.copy = function() {
    let tileCopy = new Tile(this.service, {
        name: this.name,
        image: this.image,
        renderX: this.renderX,
        renderY: this.renderY,
        renderWidth: this.renderWidth,
        renderHeight: this.renderHeight,
        tileWidth: this.tileWidth,
        tileHeight: this.tileHeight,
        spriteWidth: this.spriteWidth,
        spriteHeight: this.spriteHeight,
        spriteCol: this.spriteCol,
        spriteRow: this.spriteRow,
        numberOfFrames: this.numberOfFrames,
        updateFrequency: this.updateFrequency,
        loop: this.loop,
        pause: this.pause,
        alpha: this.alpha
    });

    return tileCopy;
}

Tile.prototype.update = function() {
    this.tick += 1;

    // Dont update if animation is paused
    if (this.pause === true) {
        return;
    }

    // No need to update if only one frame!
    if (this.numberOfFrames === 1) {
        return;
    }

    if (this.tick % this.updateFrequency === 0) {
        this.animationCounter += 1;

        this.spriteOffset = this.spriteWidth * (this.animationCounter % this.numberOfFrames);

        // If no looping and at the first frame of the animation -> pause animation
        if (this.loop === false && this.animationCounter % this.numberOfFrames === 0) {
            this.pause = true;
        }
    }
}

Tile.prototype.render = function(context, rX, rY) {
    // Do not render if tile has no image
    if (this.image === undefined) {
        // console.log("no image!");

        return;
    }

    // mapX = mapX ? mapX : this.service.map.x;
    // mapY = mapY ? mapY : this.service.map.y;

    rX = rX ? rX : 0;
    rY = rY ? rY : 0;

    let xInImage = this.spriteCol * this.tileWidth + this.spriteOffset;
    let yInImage = this.spriteRow * this.tileHeight;

    context.save();

    context.globalAlpha = this.alpha;

    context.drawImage(
        // this.image ? this.image : this.placeholderImage,
        this.image,
        xInImage,
        yInImage,
        this.tileWidth,
        this.tileHeight,
        // mapX + this.renderX,
        // mapY + this.renderY,
        rX + this.renderX,
        rY + this.renderY,
        this.renderWidth,
        this.renderHeight
    );

    context.restore();
}

module.exports = Tile;

},{}],10:[function(require,module,exports){
let Game = require("./Game.js");

// node_modules/.bin/browserify source/js/app.js > debug/js/bundle.js

window.addEventListener("load", function() {
    let game = new Game();
});

},{"./Game.js":4}],11:[function(require,module,exports){
function addListeners(service) {
    service.listeners = {};

    let clickEvent = function(event) {
        service.listeners.click = true;
    }

    service.worldCanvas.addEventListener("click", clickEvent);
    service.battleCanvas.addEventListener("click", clickEvent);

    let mousedownEvent = function(event) {
        service.listeners.mousedown = true;

        let canvasRect = service.worldCanvas.getBoundingClientRect();

        service.listeners.mousePositionX = event.clientX - canvasRect.left;
        service.listeners.mousePositionY = event.clientY - canvasRect.top;
    }

    service.worldCanvas.addEventListener("mousedown", mousedownEvent);
    service.battleCanvas.addEventListener("mousedown", mousedownEvent);

    let mousemoveEvent = function(event) {
        event.preventDefault();
        service.listeners.mousemove = true;

        let canvasRect = service.worldCanvas.getBoundingClientRect();

        service.listeners.mousePositionX = event.clientX - canvasRect.left;
        service.listeners.mousePositionY = event.clientY - canvasRect.top;
    }

    service.worldCanvas.addEventListener("mousemove", mousemoveEvent);
    service.battleCanvas.addEventListener("mousemove", mousemoveEvent);

    window.addEventListener("mouseup", function(event) {
        service.listeners.mousedown = false;
        service.listeners.mousemove = false;
    });
}

module.exports = {
    addListeners: addListeners
}

},{}],12:[function(require,module,exports){
module.exports=[
    {
        "id": 1,
        "name": "BULBASAUR",
        "tileFront": {
            "src": "img/monsters/001_bulbasaur_front.png",
            "tileWidth": 38,
            "tileHeight": 38,
            "renderY": 130,
            "renderWidth": 200,
            "renderHeight": 200,
            "numberOfFrames": 99,
            "updateFrequency": 1,
            "loop": false,
            "pause": true
        },
        "tileBack": {
            "src": "img/monsters/001_bulbasaur_back.png",
            "tileWidth": 38,
            "tileHeight": 38,
            "renderWidth": 100,
            "renderHeight": 100,
            "numberOfFrames": 99,
            "updateFrequency": 1,
            "loop": false,
            "pause": true
        },
        "crySrc": "audio/monster/001Cry.wav",
        "moves": [
            {
                "name": "Tackle1"
            },
            {
                "name": "Tackle2"
            },
            {
                "name": "Tackle3"
            },
            {
                "name": "Tackle4"
            }
        ]
    },
    {
        "id": 93,
        "name": "HAUNTER",
        "tileFront": {
            "src": "img/monsters/093_haunter_front.png",
            "tileWidth": 85,
            "tileHeight": 85,
            "renderY": 80,
            "renderWidth": 350,
            "renderHeight": 350,
            "numberOfFrames": 25,
            "updateFrequency": 1,
            "loop": false,
            "pause": true
        },
        "tileBack": {
            "src": "img/monsters/093_haunter_back.png",
            "tileWidth": 85,
            "tileHeight": 85,
            "renderWidth": 350,
            "renderHeight": 350,
            "numberOfFrames": 25,
            "updateFrequency": 1,
            "loop": false,
            "pause": true
        },
        "crySrc": "audio/monster/093Cry.wav"
    },
    {
        "id": 130,
        "name": "GYARADOS",
        "tileFront": {
            "src": "img/monsters/130_gyarados_front.png",
            "tileWidth": 102,
            "tileHeight": 102,
            "renderY": 60,
            "renderWidth": 350,
            "renderHeight": 350,
            "numberOfFrames": 87,
            "updateFrequency": 1,
            "loop": false,
            "pause": true
        },
        "tileBack": {
            "src": "img/monsters/130_gyarados_back.png",
            "tileWidth": 108,
            "tileHeight": 108,
            "renderWidth": 350,
            "renderHeight": 350,
            "numberOfFrames": 87,
            "updateFrequency": 1,
            "loop": false,
            "pause": true
        },
        "crySrc": "audio/monster/130Cry.wav"
    }
]

},{}],13:[function(require,module,exports){
module.exports={
    "monsters": [
        {
            "name": "GYARADOS",
            "level": 100
        }
    ]
}

},{}],14:[function(require,module,exports){
module.exports=[
    {
        "name": "playerWalk",
        "src": "img/character7_walking.png",
        "tileWidth": 32,
        "tileHeight": 48,
        "spriteWidth": 32,
        "spriteHeight": 192,
        "numberOfFrames": 4,
        "updateFrequency": 7
    },
    {
        "name": "playerWater",
        "src": "img/character_water.png",
        "tileWidth": 64,
        "tileHeight": 64,
        "spriteWidth": 64,
        "spriteHeight": 256,
        "numberOfFrames": 4,
        "updateFrequency": 7
    },
    {
        "name": "playerGrass",
        "src": "img/character7_grass.png",
        "tileWidth": 32,
        "tileHeight": 48,
        "spriteWidth": 32,
        "spriteHeight": 192,
        "numberOfFrames": 4,
        "updateFrequency": 7
    },
    {
        "name": "sea",
        "src": "img/Sea.png",
        "tileWidth": 16,
        "tileHeight": 16,
        "spriteWidth": 96,
        "spriteHeight": 128,
        "numberOfFrames": 8,
        "updateFrequency": 7
    }
]

},{}],15:[function(require,module,exports){
module.exports=[
    {
        "name": "map1layer1",
        "src": "img/map1layer1.png",
        "tileWidth": 3200,
        "tileHeight": 3200
    },
    {
        "name": "map1layer2",
        "src": "img/map1layer2.png",
        "tileWidth": 3200,
        "tileHeight": 3200
    },
    {
        "name": "house1layer1",
        "src": "img/house1layer1.png",
        "tileWidth": 3200,
        "tileHeight": 3200
    },
    {
        "name": "house1layer2",
        "src": "img/house1layer2.png",
        "tileWidth": 3200,
        "tileHeight": 3200
    },
    {
        "name": "battleFightbtn",
        "src": "img/battle/fightbtn.png",
        "tileWidth": 130,
        "tileHeight": 46,
        "numberOfFrames": 2,
        "loop": false,
        "pause": true
    },
    {
        "name": "battleBagbtn",
        "src": "img/battle/bagbtn.png",
        "tileWidth": 130,
        "tileHeight": 46,
        "numberOfFrames": 2,
        "loop": false,
        "pause": true
    },
    {
        "name": "battlePokemonbtn",
        "src": "img/battle/pokemonbtn.png",
        "tileWidth": 130,
        "tileHeight": 46,
        "numberOfFrames": 2,
        "loop": false,
        "pause": true
    },
    {
        "name": "battleRunbtn",
        "src": "img/battle/runbtn.png",
        "tileWidth": 130,
        "tileHeight": 46,
        "numberOfFrames": 2,
        "loop": false,
        "pause": true
    },
    {
        "name": "battleBottombar",
        "src": "img/battle/bottombar.png",
        "tileWidth": 512,
        "tileHeight": 96
    },
    {
        "name": "battleBall",
        "src": "img/battle/ball.png",
        "tileWidth": 32,
        "tileHeight": 32,
        "numberOfFrames": 4,
        "updateFrequency": 3
    },
    {
        "name": "battleOpponentbase",
        "src": "img/battle/enemybaseFieldGrassEve.png",
        "tileWidth": 256,
        "tileHeight": 128
    },
    {
        "name": "battlePlayerbase",
        "src": "img/battle/playerbaseFieldGrassEve.png",
        "tileWidth": 408,
        "tileHeight": 64
    },
    {
        "name": "battlePlayer",
        "src": "img/battle/player_back.png",
        "tileWidth": 128,
        "tileHeight": 128,
        "numberOfFrames": 5,
        "updateFrequency": 5,
        "loop": false,
        "pause": true
    },
    {
        "name": "battleBgForestEve",
        "src": "img/battle/battlebgForestEve.png",
        "tileWidth": 512,
        "tileHeight": 288
    },
    {
        "name": "flash",
        "src": "img/battle/flash.png",
        "tileWidth": 1024,
        "tileHeight": 768
    },
    {
        "name": "conversationBg",
        "src": "img/conversation/background_battle.png",
        "tileWidth": 1028,
        "tileHeight": 179
    },
    {
        "name": "conversationNextbtn",
        "src": "img/conversation/nextBtn.png",
        "tileWidth": 120,
        "tileHeight": 120,
        "numberOfFrames": 2,
        "loop": false,
        "pause": true
    },
    {
        "name": "grass",
        "src": "img/grass2.png",
        "tileWidth": 16,
        "tileHeight": 16,
        "numberOfFrames": 2,
        "loop": false,
        "pause": true
    },
    {
        "name": "battleAttackbtn",
        "src": "img/grass2.png",
        "tileWidth": 16,
        "tileHeight": 16,
        "numberOfFrames": 2,
        "loop": false,
        "pause": true
    }
]

},{}]},{},[10]);
