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
        this.service.resources.tiles.find(tile => tile.name === "playerWalk(0,1)"),
        this.service.resources.tiles.find(tile => tile.name === "playerWalk(0,3)"),
        this.service.resources.tiles.find(tile => tile.name === "playerWalk(0,2)"),
        this.service.resources.tiles.find(tile => tile.name === "playerWalk(0,0)")
    ];
    this.grassTiles = [
        this.service.resources.tiles.find(tile => tile.name === "playerGrass(0,1)"),
        this.service.resources.tiles.find(tile => tile.name === "playerGrass(0,3)"),
        this.service.resources.tiles.find(tile => tile.name === "playerGrass(0,2)"),
        this.service.resources.tiles.find(tile => tile.name === "playerGrass(0,0)")
    ];
    this.waterTiles = [
        this.service.resources.tiles.find(tile => tile.name === "playerWater(0,1)"),
        this.service.resources.tiles.find(tile => tile.name === "playerWater(0,3)"),
        this.service.resources.tiles.find(tile => tile.name === "playerWater(0,2)"),
        this.service.resources.tiles.find(tile => tile.name === "playerWater(0,0)")
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
