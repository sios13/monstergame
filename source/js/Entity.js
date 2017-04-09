const TileManager = require("./TileManager.js");

function Entity(settings) {
    this.x = settings.x;
    this.y = settings.y;

    this.canvasX = settings.canvasX;
    this.canvasY = settings.canvasY;

    this.collisionSquare = settings.collisionSquare;

    this.renderWidth = settings.renderWidth;
    this.renderHeight = settings.renderHeight;

    this.speed = settings.speed;

    // Set top left position of collision square
    // collision square should always be in middle of character
    // render width and render height should always be > collision square !!
    this.collisionSquareOffsetX = (this.renderWidth - this.collisionSquare) / 2;
    this.collisionSquareOffsetY = (this.renderHeight - this.collisionSquare);

    this.direction = null;

    this.col = Math.floor(this.x / 32);
    this.row = Math.floor(this.y / 32);

    this.speedX = null;
    this.speedY = null;

    this.newGrid = false;

    let tileManager = new TileManager();

    tileManager.addSettings({
        identifier: "playerWalk",
        src: "img/character8.png",
        renderWidth: this.renderWidth,
        renderHeight: this.renderHeight,
        tileWidth: 32,
        tileHeight: 48,
        offset: 32,
        numberOfFrames: 4,
        updateFrequency: 7
    });

    tileManager.addSettings({
        identifier: "playerWater",
        src: "img/character7.png",
        renderWidth: 64,
        renderHeight: 64,
        tileWidth: 64,
        tileHeight: 64,
        offset: 64,
        numberOfFrames: 4,
        updateFrequency: 7
    });

    // left, up, right, down
    this.walkTiles = [
        tileManager.getTile("playerWalk", this.canvasX/32, this.canvasY/32, 0, 1),
        tileManager.getTile("playerWalk", this.canvasX/32, this.canvasY/32, 0, 3),
        tileManager.getTile("playerWalk", this.canvasX/32, this.canvasY/32, 0, 2),
        tileManager.getTile(
            "playerWalk",       // identifier
            this.canvasX/32,    // column where to render
            this.canvasY/32,    // row where to render
            0,                  // column of tile in sprite
            0                   // row of tile in sprite
        )
    ];

    this.waterTiles = [
        tileManager.getTile("playerWater", this.canvasX/32, this.canvasY/32, 0, 1),
        tileManager.getTile("playerWater", this.canvasX/32, this.canvasY/32, 0, 3),
        tileManager.getTile("playerWater", this.canvasX/32, this.canvasY/32, 0, 2),
        tileManager.getTile("playerWater", this.canvasX/32, this.canvasY/32, 0, 0),
    ];

    this.activeTile = this.walkTiles[3];

    this.isInGrass = false;
    this.isInWater = false;
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
    let deltaX = game.mousePositionX - (this.canvasX + this.collisionSquareOffsetX + this.renderWidth/2);
    let deltaY = game.mousePositionY - (this.canvasY + this.collisionSquareOffsetY + this.renderHeight/2);

    let distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

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
    let x = this.x + this.collisionSquareOffsetX;
    let y = this.y + this.collisionSquareOffsetY;

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

/**
 * Updates the col and row position
 * Sets newGrid to true if entering a new grid
 */
Entity.prototype._checkGrid = function(game) {
    let oldColumn = this.col;
    let oldRow = this.row;

    let x = this.x + this.collisionSquareOffsetX + this.collisionSquare / 2;
    let y = this.y + this.collisionSquareOffsetY + this.collisionSquare / 2;

    let newColumn = Math.floor((x + this.speedX) / game.map.gridSize);
    let newRow = Math.floor((y + this.speedY) / game.map.gridSize);

    if (oldColumn !== newColumn || oldRow !== newRow) {
        this.newGrid = true;

        this.col = newColumn;
        this.row = newRow;
    }
}

Entity.prototype._checkEvents = function(game) {
    // Only check for events if entered a new grid
    if (this.newGrid === false) {
        return;
    }

    this.newGrid = false;

    // Reset event variables
    this.isInGrass = false;
    this.isInWater = false;

    // Get event on position
    let event = game.map.getEvent(this.col, this.row);

    // If there is no event -> exit
    if (typeof event !== "object") {
        return;
    }

    // Change map
    if (event.id === 2) {return game.changeMap(event);}

    // Grass!
    if (event.id === 3) {return this.isInGrass = true;}

    // Water!
    if (event.id === 4) {return this.isInWater = true;}
}

Entity.prototype._setActiveTile = function() {
    if (this.direction === "left")
    {
        if (this.isInGrass)
        {
            this.activeTile = this.grassTiles[0];
        }
        else if (this.isInWater)
        {
            this.activeTile = this.waterTiles[0];
        }
        else
        {
            this.activeTile = this.walkTiles[0];
        }
    }
    else if (this.direction === "up")
    {
        if (this.isInGrass)
        {
            this.activeTile = this.grassTiles[1];
        }
        else if (this.isInWater)
        {
            this.activeTile = this.waterTiles[1];
        }
        else
        {
            this.activeTile = this.walkTiles[1];
        }
    }
    else if (this.direction === "right")
    {
        if (this.isInGrass)
        {
            this.activeTile = this.grassTiles[2];
        }
        else if (this.isInWater)
        {
            this.activeTile = this.waterTiles[2];
        }
        else
        {
            this.activeTile = this.walkTiles[2];
        }
    }
    else if (this.direction === "down")
    {
        if (this.isInGrass)
        {
            this.activeTile = this.grassTiles[3];
        }
        else if (this.isInWater)
        {
            this.activeTile = this.waterTiles[3];
        }
        else
        {
            this.activeTile = this.walkTiles[3];
        }
    }
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

        // Check for events
        this._checkEvents(game);

        // Set the active tile depending on direction and events
        this._setActiveTile();

        // Update tile animation
        this.activeTile.update(game);

        return;
    }

    // Reset the animation of the tile
    this.activeTile.animationCounter = 0;
    this.activeTile.spriteOffset = 0;
}

Entity.prototype.render = function(context) {
    this.activeTile.render(context, 0, 0);

    // context.beginPath();
    // context.rect(this.canvasX + this.collisionSquareOffsetX, this.canvasY + this.collisionSquareOffsetY, this.collisionSquare, this.collisionSquare);
    // context.stroke();
}

module.exports = Entity;
