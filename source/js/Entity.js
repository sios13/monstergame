const TileManager = require("./TileManager.js");

function Entity(settings) {
    this.x = settings.x;
    this.y = settings.y;

    this.canvasX = settings.canvasX;
    this.canvasY = settings.canvasY;

    this.collisionSquare = settings.collisionSquare;

    // this.renderWidth = settings.renderWidth;
    // this.renderHeight = settings.renderHeight;

    this.speed = settings.speed;

    this.direction = null;

    this.state = "walking";

    this.col = Math.floor(this.x / 32);
    this.row = Math.floor(this.y / 32);

    this.speedX = null;
    this.speedY = null;

    this.newGrid = false;

    let tileManager = new TileManager();

    tileManager.addSettings({
        identifier: "playerWalk",
        src: "img/character_walking.png",
        renderWidth: settings.renderWidth,
        renderHeight: settings.renderHeight,
        tileWidth: 32,
        tileHeight: 48,
        offset: 32,
        numberOfFrames: 4,
        updateFrequency: 7
    });

    tileManager.addSettings({
        identifier: "playerWater",
        src: "img/character_water.png",
        renderWidth: 64,
        renderHeight: 64,
        tileWidth: 64,
        tileHeight: 64,
        offset: 64,
        numberOfFrames: 4,
        updateFrequency: 7
    });

    tileManager.addSettings({
        identifier: "playerGrass",
        src: "img/character_grass.png",
        renderWidth: settings.renderWidth,
        renderHeight: settings.renderHeight,
        tileWidth: 32,
        tileHeight: 48,
        offset: 32,
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

    this.grassTiles = [
        tileManager.getTile("playerGrass", this.canvasX/32, this.canvasY/32, 0, 1),
        tileManager.getTile("playerGrass", this.canvasX/32, this.canvasY/32, 0, 3),
        tileManager.getTile("playerGrass", this.canvasX/32, this.canvasY/32, 0, 2),
        tileManager.getTile("playerGrass", this.canvasX/32, this.canvasY/32, 0, 0),
    ];

    this.activeTile = this.walkTiles[3];

    // Get all tiles from tile manager to easily check if all tiles have been loaded
    this.allTiles = tileManager.getAllTiles();
}

/**
 * Returns true if entity has been loaded
 */
Entity.prototype.isLoaded = function() {
    for (let i = 0; i < this.allTiles.length; i++) {
        if (this.allTiles[i].isLoaded() === false) {
            return false;
        }
    }

    return true;
}

Entity.prototype._setSpeed = function(game) {
    let deltaX = game.mousePositionX - (this.canvasX + this.activeTile.renderWidth / 2);
    let deltaY = game.mousePositionY - (this.canvasY + this.activeTile.renderHeight / 2);

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

    let x = this.x + this.collisionSquare / 2;
    let y = this.y + this.collisionSquare / 2;

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

    // State is 'walking' by default
    this.state = "walking";

    // Get event on position
    let event = game.map.getEvent(this.col, this.row);

    // If there is no event -> exit
    if (typeof event !== "object") {
        return;
    }

    // Change map
    if (event.id === 2) {return game.changeMap(event);}

    // Grass!
    if (event.id === 3) {
        event.data.tile.pause = false;

        this.state = "grass";

        return;
    }

    // Water!
    if (event.id === 4) {return this.state = "water";}
}

Entity.prototype._setActiveTile = function() {
    if (this.direction === "left")
    {
        if (this.state === "walking")
        {
            this.activeTile = this.walkTiles[0];
        }
        else if (this.state === "grass")
        {
            this.activeTile = this.grassTiles[0];
        }
        else if (this.state === "water")
        {
            this.activeTile = this.waterTiles[0];
        }
    }
    else if (this.direction === "up")
    {
        if (this.state === "walking")
        {
            this.activeTile = this.walkTiles[1];
        }
        else if (this.state === "grass")
        {
            this.activeTile = this.grassTiles[1];
        }
        else if (this.state === "water")
        {
            this.activeTile = this.waterTiles[1];
        }
    }
    else if (this.direction === "right")
    {
        if (this.state === "walking")
        {
            this.activeTile = this.walkTiles[2];
        }
        else if (this.state === "grass")
        {
            this.activeTile = this.grassTiles[2];
        }
        else if (this.state === "water")
        {
            this.activeTile = this.waterTiles[2];
        }
    }
    else if (this.direction === "down")
    {
        if (this.state === "walking")
        {
            this.activeTile = this.walkTiles[3];
        }
        else if (this.state === "grass")
        {
            this.activeTile = this.grassTiles[3];
        }
        else if (this.state === "water")
        {
            this.activeTile = this.waterTiles[3];
        }
    }
}

Entity.prototype.update = function(game) {
    if (game.listeners.isMousedown) {
        if (this.state === "grass") {
            game.startBattle("xD");
        }

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
    // Make sure collision square always is in center of entity!
    // Render width and render height should always be > collision square !!
    let renderOffsetX = (this.activeTile.renderWidth - this.collisionSquare) / 2;
    let renderOffsetY = (this.activeTile.renderHeight - this.collisionSquare);

    this.activeTile.render(context, 0 - renderOffsetX, 0 - renderOffsetY);

    // context.beginPath();
    // context.rect(this.canvasX, this.canvasY, this.collisionSquare, this.collisionSquare);
    // context.stroke();
}

module.exports = Entity;
