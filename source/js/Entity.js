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
    sprites.src = "img/character7.png";

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
