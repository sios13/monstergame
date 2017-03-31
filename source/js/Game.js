const Entity = require("./Entity.js");
const MapInitializer = require("./MapInitializer.js");

function Game() {
    this.frame = 0;
    this.framerate = 30;

    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");

    this.map = MapInitializer.getMap("startMap");

    this.coolguy = new Entity(14*32, 35*32, this.canvas.width/2, this.canvas.height/2, 30, 30, 5);
}

Game.prototype.startGame = function() {
    require("./listeners.js").addListeners(this);

    // Start game!
    setInterval(frame.bind(this), 1000/this.framerate);

    function frame() {
        this.frame += 1;

        update();
        render();
    }

    let update = () => {
        // Update position and animation
        this.coolguy.update(this);

        // Check for events (depending on block)
        this._checkEvents();

        // Update map position
        this.map.x = this.coolguy.mapX - this.coolguy.x;
        this.map.y = this.coolguy.mapY - this.coolguy.y;
    }

    let render = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.map.renderLayer1(this.context);

        this.coolguy.render(this.context);

        this.map.renderLayer2(this.context);

        this.map.render(this.context);
    }
};

Game.prototype._checkEvents = function() {
    let col = this.coolguy.col;
    let row = this.coolguy.row;

    if (col === null || row === null) {
        return;
    }

    let event = this.map.getEvent(col, row);

    if (typeof event === "object" && event.id === 2) {
        this.map.destroy();

        // id:2 -> change map! teleport!
        this.map = MapInitializer.getMap(event.data.mapName);

        this.coolguy.x = event.data.spawnX;
        this.coolguy.y = event.data.spawnY;

        return;
    }
}

module.exports = Game;
