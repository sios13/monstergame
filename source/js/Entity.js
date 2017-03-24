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

        this.x += speedX;
        this.y += speedY;

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
