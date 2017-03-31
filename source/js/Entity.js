function Entity(x, y, mapX, mapY, width, height, speed, direction) {
    this.x = x;
    this.y = y;

    this.mapX = mapX;
    this.mapY = mapY;

    this.width = width;
    this.height = height;

    this.speed = speed;

    this.speedX = null;
    this.speedY = null;

    this.col = null;
    this.row = null;

    this.direction = direction;

    this.moveAnimationCounter = 0;

    let sprites = new Image();
    sprites.src = "img/characters.png";

    this.sprite = {
        img: sprites,   // Specifies the image, canvas, or video element to use
        sx: 4*16,       // Optional. The x coordinate where to start clipping
        sy: 0,          // Optional. The y coordinate where to start clipping
        swidth: 16,     // Optional. The width of the clipped image
        sheight: 16,    // Optional. The height of the clipped image
    }
}

Entity.prototype._detectCollision = function(game) {
    let x = this.x;
    let y = this.y;

    let collisionPoints = [
        [x, y],                           // Top left
        [x+this.width, y],                // Top right
        [x, y+this.height],               // Bottom left
        [x+this.width, y+this.height],    // Bottom right
        [x+this.width/2, y],              // Top
        [x+this.width, y+this.height/2],  // Right
        [x+this.width/2, y+this.height],  // Bottom
        [x, y+this.height/2]              // Left
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

Entity.prototype.update = function(game) {
    if (game.listeners.isMousedown) {
        let deltaX = game.mousePositionX - this.mapX - this.width/2;
        let deltaY = game.mousePositionY - this.mapY - this.height/2;

        let distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

        if (distance < 5) {
            return;
        }

        this.speedX = deltaX/distance*this.speed;
        this.speedY = deltaY/distance*this.speed;

        this._setDirection();

        this._detectCollision(game);

        this.col = Math.floor((this.x+this.width/2) / game.map.gridSize);
        this.row = Math.floor((this.y+this.height/2) / game.map.gridSize);

        this.x += this.speedX;
        this.y += this.speedY;

        // Animation
        if (game.frame % 5 === 0) {
            this.moveAnimationCounter += 1;
        }

        this.sprite.sx = (3 + this.moveAnimationCounter % 3) * 16 + 3;

        if (this.direction === "up") {
            this.sprite.sy = 3*16;
        } else if (this.direction === "right") {
            this.sprite.sy = 2*16;
        } else if (this.direction === "down") {
            this.sprite.sy = 0*16;
        } else if (this.direction === "left") {
            this.sprite.sy = 1*16;
        }

        return;
    }

    this.sprite.sx = 4 * 16 + 3;
}

Entity.prototype.render = function(context) {
    context.drawImage(this.sprite.img, this.sprite.sx, this.sprite.sy, this.sprite.swidth - 6, this.sprite.sheight, this.mapX, this.mapY-20, this.width, this.height+20);

    // context.beginPath();
    // context.rect(this.mapX, this.mapY, this.width, this.height);
    // context.stroke();
}

module.exports = Entity;
