const Entity = require("./Entity.js");
const MapInitializer = require("./MapInitializer.js");

function Game() {
    this.tickCounter = 0;
    this.framerate = 30;

    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");

    this.map = MapInitializer.getMap("startMap");

    this.coolguy = new Entity(14*32, 35*32, this.canvas.width/2, this.canvas.height/2, 30, 30, 5);
}

Game.prototype.isLoading = function() {

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
        // Update coolguy
        this.coolguy.update(this);

        // Update map
        this.map.update(this);

        // if cool guy has entered a new grid -> check for events on that grid
        if (this.coolguy.newGrid) {
            this._checkEvents(Math.floor(this.coolguy.x/32), Math.floor(this.coolguy.y/32));

            this.coolguy.newGrid = false;
        }
    }

    let render = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.map.renderLayer1(this.context);

        this.map.renderTiles(this.context);

        this.coolguy.render(this.context);

        this.map.renderLayer2(this.context);

        this.map.render(this.context);
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
        console.log("hej!");

        return;
    }
}

module.exports = Game;
