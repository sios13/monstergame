(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Entity(x, y, height, width, speed, direction) {
    this.x = x;
    this.y = y;

    this.height = height;
    this.width = width;

    this.speed = speed;

    this.speedX = null;
    this.speedY = null;

    this.direction = direction;

    this.idleImage = new Image();
    this.idleImage.src = "img/idle001.png";

    this.runningImages = [];
    for (let i = 0; i < 8; i++) {
        this.runningImages[i] = new Image();
        this.runningImages[i].src = "img/run00" + (i + 1) + ".png";
    }
    this.moveAnimationCounter = 0;

    this.image = this.idleImage;
}

Entity.prototype._detectCollision = function(game) {
    let collisionPoints = [
        [this.x, this.y],                           // Top left
        [this.x+this.width, this.y],                // Top right
        [this.x, this.y+this.height],               // Bottom left
        [this.x+this.width, this.y+this.height],    // Bottom right
        [this.x+this.width/2, this.y],              // Top
        [this.x+this.width, this.y+this.height/2],  // Right
        [this.x+this.width/2, this.y+this.height],  // Bottom
        [this.x, this.y+this.height/2]              // Left
    ];

    // Iterate the collision points
    for (let i = 0; i < collisionPoints.length; i++) {
        let x = collisionPoints[i][0];
        let y = collisionPoints[i][1];

        let oldColumn = Math.floor(x / game.gridSize);
        let oldRow = Math.floor(y / game.gridSize);

        let newColumn = Math.floor((x+this.speedX) / game.gridSize);
        let newRow = Math.floor((y+this.speedY) / game.gridSize);

        // If collision point is not allowed to enter new grid
        if (game.collisionMap[newRow][newColumn] === 1) {
            // If trying to enter new column and row at the same time
            if (oldColumn !== newColumn && oldRow !== newRow) {
                // Trust that another collision point will find the collision
                continue;
            }

            // If trying to enter new column
            if (oldColumn !== newColumn) {
                this.speedX = 0;
            }

            // If trying to enter new row
            if (oldRow !== newRow) {
                this.speedY = 0;
            }
        }
    }
}

Entity.prototype.update = function(game) {
    if (game.listeners.isMousedown) {
        let deltaX = game.mousePositionX - this.x - this.width/2;
        let deltaY = game.mousePositionY - this.y - this.height/2;

        let distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

        if (distance < 5) {
            return;
        }

        this.speedX = deltaX/distance*this.speed;
        this.speedY = deltaY/distance*this.speed;

        this._detectCollision(game);

        this.x += this.speedX;
        this.y += this.speedY;

        // console.log("Delta X: " + deltaX);
        // console.log("Delta Y: " + deltaY);
        // console.log("Distance: " + distance);
        // console.log("Speed: " + this.speed);
        // console.log("-----------------");

        /**
         * Animation
         */
        if (game.frame % 3 === 0) {
            this.moveAnimationCounter += 1;
        }

        this.image = this.runningImages[this.moveAnimationCounter % 8];

        return;
    }

    this.image = this.idleImage;
}

Entity.prototype.render = function(context) {
    context.drawImage(this.image, this.x, this.y);

    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.stroke();
}

module.exports = Entity;

},{}],2:[function(require,module,exports){
function Game() {
    this.frame = 0;
    this.framerate = 30;

    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");

    this.collisionMap = [
        [0,0,0,0],
        [0,1,0,1,1],
        [0,1,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];

    this.gridSize = 50;
}

Game.prototype.startGame = function() {
    require("./listeners.js").addListeners(this);

    let Entity = require("./Entity.js");

    let coolguy = new Entity(110, 110, 80, 80, 6);

    // Start game!
    setInterval(frame.bind(this), 1000/this.framerate);

    function frame() {
        this.frame += 1;

        update();
        render();
    }

    let update = () => {
        coolguy.update(this);
    }

    let render = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        coolguy.render(this.context);

        for (let y = 0; y < this.collisionMap.length; y++) {
            for (let x = 0; x < this.collisionMap[y].length; x++) {
                if (this.collisionMap[y][x] === 1) {
                    this.context.beginPath();
                    this.context.rect(x*this.gridSize, y*this.gridSize, this.gridSize, this.gridSize);
                    this.context.stroke();
                }
            }
        }
    }
};

module.exports = Game;

},{"./Entity.js":1,"./listeners.js":4}],3:[function(require,module,exports){
let Game = require("./Game.js");

// node_modules/.bin/browserify source/js/app.js > debug/js/bundle.js

window.addEventListener("load", function() {
    let game = new Game();

    game.startGame();
});

},{"./Game.js":2}],4:[function(require,module,exports){
function addListeners(game) {
    game.listeners = {};

    game.canvas.addEventListener("mousedown", function(e) {
        game.listeners.isMousedown = true;

        game.listeners.mousePositionX = window.event.clientX;
        game.listeners.mousePositionY = window.event.clientY;
    });

    game.canvas.addEventListener("mousemove", function(e) {
        game.listeners.isMousemove = true;

        game.mousePositionX = window.event.clientX;
        game.mousePositionY = window.event.clientY;
    });

    game.canvas.addEventListener("mouseup", function(e) {
        game.listeners.isMousedown = false;
        game.listeners.isMousemove = false;
    });

    game.canvas.addEventListener("keydown", function(e) {
        console.log("keydown");
    });
}

module.exports = {
    addListeners: addListeners
}

},{}]},{},[3]);
