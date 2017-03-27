function Entity(x, y, width, height, speed, direction) {
    this.x = x;
    this.y = y;

    this.width = width;
    this.height = height;

    this.speed = speed;

    this.speedX = null;
    this.speedY = null;

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

        // If collision point is trying to enter a disallowed grid
        if (game.collisionMap[newRow][newColumn] === 1) {
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
        let deltaX = game.mousePositionX - this.x - this.width/2;
        let deltaY = game.mousePositionY - this.y - this.height/2;

        let distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

        if (distance < 5) {
            return;
        }

        this.speedX = deltaX/distance*this.speed;
        this.speedY = deltaY/distance*this.speed;

        this._setDirection();

        this._detectCollision(game);

        this.x += this.speedX;
        this.y += this.speedY;

        // Animation
        if (game.frame % 5 === 0) {
            this.moveAnimationCounter += 1;
        }

        this.sprite.sx = (3 + this.moveAnimationCounter % 3) * 16;

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

    this.sprite.sx = 4 * 16;
}

Entity.prototype.render = function(context) {
    context.drawImage(this.sprite.img, this.sprite.sx, this.sprite.sy, this.sprite.swidth, this.sprite.sheight, this.x, this.y, this.width, this.height);

    // context.beginPath();
    // context.rect(this.x, this.y, this.width, this.height);
    // context.stroke();
}

module.exports = Entity;
