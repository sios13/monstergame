(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Entity(x, y, height, width, speed, direction) {
    this.x = x;
    this.y = y;

    this.height = height;
    this.width = width;

    this.speed = speed;
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

    this.triggerCollision = null;
}

Entity.prototype.update = function(game) {
    if (game.listeners.isMousedown) {

        let deltaX = game.mousePositionX - this.x - this.width/2;
        let deltaY = game.mousePositionY - this.y - this.height/2;

        let distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

        if (distance < 5) {
            return;
        }

        let speedX = deltaX/distance*this.speed;
        let speedY = deltaY/distance*this.speed;

        /**
         * Top left
         */
        let topLeftColBefore = Math.floor(this.x / 100);
        let topLeftColAfter = Math.floor((this.x+speedX) / 100);

        let topLeftRowBefore = Math.floor(this.y / 100);
        let topLeftRowAfter = Math.floor((this.y+speedY) / 100);

        // If entering a new column
        if (topLeftColBefore !== topLeftColAfter) {
            // If not allowed to enter new column
            if (game.collisionMap[topLeftRowAfter][topLeftColAfter] === 1) {
                // Go back
                this.x -= speedX;
            }
        }

        // If entering a new row
        if (topLeftRowBefore !== topLeftRowAfter) {
            // If not allowed to enter new row
            if (game.collisionMap[topLeftRowAfter][topLeftColAfter] === 1) {
                // Go back
                this.y -= speedY;
            }
        }

        /**
         * Top right
         */
        let topRightColBefore = Math.floor((this.x+96) / 100);
        let topRightColAfter = Math.floor((this.x+96+speedX) / 100);

        let topRightRowBefore = Math.floor(this.y / 100);
        let topRightRowAfter = Math.floor((this.y+speedY) / 100);

        // If entering a new column
        if (topRightColBefore !== topRightColAfter) {
            // If not allowed to enter new column
            if (game.collisionMap[topRightRowAfter][topRightColAfter] === 1) {
                // Go back
                this.x -= speedX;
            }
        }

        // If entering a new row
        if (topRightRowBefore !== topRightRowAfter) {
            // If not allowed to enter new row
            if (game.collisionMap[topRightRowAfter][topRightColAfter] === 1) {
                // Go back
                this.y -= speedY;
            }
        }

        /**
         * Bottom left
         */
        let bottomLeftColAfter = Math.floor((this.x+speedX) / 100);
        let bottomLeftColBefore = Math.floor(this.x / 100);

        let bottomLeftRowAfter = Math.floor((this.y+96+speedY) / 100);
        let bottomLeftRowBefore = Math.floor((this.y+96) / 100);

        // If entering a new column
        if (bottomLeftColBefore !== bottomLeftColAfter) {
            // If not allowed to enter new column
            if (game.collisionMap[bottomLeftRowAfter][bottomLeftColAfter] === 1) {
                // Go back
                this.x -= speedX;
            }
        }

        // If entering a new row
        if (bottomLeftRowBefore !== bottomLeftRowAfter) {
            // If not allowed to enter new row
            if (game.collisionMap[bottomLeftRowAfter][bottomLeftColAfter] === 1) {
                // Go back
                this.y -= speedY;
            }
        }

        /**
         * Bottom right
         */
        let bottomRightColBefore = Math.floor((this.x+96) / 100);
        let bottomRightColAfter = Math.floor((this.x+96+speedX) / 100);

        let bottomRightRowBefore = Math.floor((this.y+96) / 100);
        let bottomRightRowAfter = Math.floor((this.y+96+speedY) / 100);

        // If entering a new column
        if (bottomRightColBefore !== bottomRightColAfter) {
            // If not allowed to enter new column
            if (game.collisionMap[bottomRightRowAfter][bottomRightColAfter] === 1) {
                // Go back
                this.x -= speedX;
            }
        }

        // If entering a new row
        if (bottomRightRowBefore !== bottomRightRowAfter) {
            // If not allowed to enter new row
            if (game.collisionMap[bottomRightRowAfter][bottomRightColAfter] === 1) {
                // Go back
                this.y -= speedY;
            }
        }

/*        if (game.collisionMap[this.gridYAfter][this.gridXAfter] === 1) {
            console.log("Collision!");
            if (this.gridXBefore !== this.gridXAfter) {
                this.x -= speedX;
                console.log("It was X fault!");
            } else {
                this.y -= speedY;
                console.log("It was Y fault!");
            }
        }*/

        this.x += speedX;
        this.y += speedY;

        console.log("Delta X: " + deltaX);
        console.log("Delta Y: " + deltaY);
        console.log("Distance: " + distance);
        console.log("Speed: " + this.speed);
        console.log("-----------------");

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
        [0,0,0,0],
        [0,0,0,0]
    ];
}

Game.prototype.startGame = function() {
    require("./listeners.js").addListeners(this);

    let Entity = require("./Entity.js");

    let coolguy = new Entity(10, 10, 96, 96, 6);

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
                    this.context.rect(x*100, y*100, 100, 100);
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
