const Entity = require("./Entity.js");
const MapInitializer = require("./MapInitializer.js");

function Game() {
    this.tickCounter = 0;
    this.framerate = 30;

    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");

    this.map = MapInitializer.getMap("startMap");

    this.coolguy = new Entity(14*32, 35*32, this.canvas.width/2, this.canvas.height/2, 30, 38, 5);

    // The tick when system was loaded
    this.loadedTick = null;
}

/**
 * Returns true if system is loaded
 */
Game.prototype.isLoaded = function() {
    if (this.map.isLoaded() && this.coolguy.isLoaded()) {
        if (this.loadedTick === null) {
            this.loadedTick = this.tickCounter;
        }

        return true;
    }

    return false;
}

Game.prototype.startGame = function() {
    require("./listeners.js").addListeners(this);

    // Start game!
    setInterval(frame.bind(this), 1000/this.framerate);

    function frame() {
        this.tickCounter += 1;

        update();
        render();
    }

    let update = () => {
        // Do not update while system is loading
        if (!this.isLoaded()) {
            return;
        }

        // Update coolguy
        this.coolguy.update(this);

        // Update map
        this.map.update(this);

        // if cool guy has entered a new grid -> check for events on that grid
        if (this.coolguy.newGrid) {
            this._checkEvents(this.coolguy.col, this.coolguy.row);

            this.coolguy.newGrid = false;
        }
    }

    let render = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render black screen while system is loading
        if (!this.isLoaded()) {
            this.context.beginPath();
            this.context.fillStyle = "rgb(0, 0, 0)";
            this.context.fillRect(0, 0, 10000, 10000);
            this.context.stroke();

            return;
        }

        this.map.renderLayer1(this.context);

        this.map.renderTiles(this.context);

        this.coolguy.render(this.context);

        this.map.renderLayer2(this.context);

        this.map.render(this.context);

        // If system was recently loaded -> tone black screen
        if (this.tickCounter - this.loadedTick < 30) {
            this.context.beginPath();
            this.context.fillStyle = "rgba(0, 0, 0, " + (1 - (this.tickCounter - this.loadedTick)/30) + ")";
            this.context.fillRect(0, 0, 10000, 10000);
            this.context.stroke();
        }
    }
};

Game.prototype._checkEvents = function(col, row) {
    // get event on position
    let event = this.map.getEvent(col, row);

    // if there is no event -> exit
    if (typeof event !== "object") {
        return;
    }

    // if event id is 2 -> change map! teleport!
    if (event.id === 2) {
        this.loadedTick = null;

        this.map.destroy();

        this.map = MapInitializer.getMap(event.data.mapName);

        this.coolguy.x = event.data.spawnX;
        this.coolguy.y = event.data.spawnY;

        return;
    }

    // if event id is 3 -> grass!
    if (event.id === 3) {
        // let image = new Image();
        // image.src = "img/grass.png";
        // this.context.drawImage(image, col*32, row*32);
        // this.map.renderTile(this.context, col*32, row*32);
        this.coolguy.isInGrass = true;

        console.log("grass!");

        return;
    }
}

module.exports = Game;
