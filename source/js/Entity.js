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
