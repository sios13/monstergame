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

        this.gridXBefore = Math.floor(this.x / 100);
        this.gridYBefore = Math.floor(this.y / 100);

        this.x += speedX;
        this.y += speedY;

        this.gridXAfter = Math.floor(this.x / 100);
        this.gridYAfter = Math.floor(this.y / 100);

        console.log("gridXBefore: " + this.gridXBefore);
        console.log("gridYBefore: " + this.gridYBefore);
        console.log("gridXAfter: " + this.gridXAfter);
        console.log("gridYAfter: " + this.gridYAfter);

        // If entering a new column
        if (this.gridXBefore !== this.gridXAfter) {
            // If not allowed to enter new column
            if (game.collisionMap[this.gridYAfter][this.gridXAfter] === 1) {
                // Go back
                this.x -= speedX;
            }
        }

        // If entering a new row
        if (this.gridYBefore !== this.gridYAfter) {
            // If not allowed to enter new row
            if (game.collisionMap[this.gridYAfter][this.gridXAfter] === 1) {
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

        console.log("Delta X: " + deltaX);
        console.log("Delta Y: " + deltaY);
        console.log("Distance: " + distance);
        console.log("Speed: " + this.speed);
        console.log("GridX: " + this.gridX);
        console.log("GridY: " + this.gridY);
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
}

module.exports = Entity;
