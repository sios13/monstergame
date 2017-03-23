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

    this.image = this.idleImage;
}

Entity.prototype.update = function(game) {
    if (game.listeners.isMousedown) {
        let deltaX = game.mousePositionX - this.x - this.width/2;
        let deltaY = game.mousePositionY - this.y - this.height/2;

        let distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

        if (distance < 5) {
            return;
        }

        console.log("Delta X: " + deltaX);
        console.log("Delta Y: " + deltaY);
        console.log("Distance: " + distance);
        console.log("Speed: " + this.speed);
        console.log("-----------------");

        this.x += (deltaX/distance*this.speed);
        this.y += (deltaY/distance*this.speed);

        /**
         * Animation
         */
        let index = Math.floor((game.frame % 80)/10);

        console.log(index);

        this.image = this.runningImages[index];

        return;
    }

    this.image = this.idleImage;
}

Entity.prototype.render = function(context) {
    context.drawImage(this.image, this.x, this.y);
}

module.exports = Entity;
