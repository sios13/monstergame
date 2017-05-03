const Entity = require("./Entity.js");
const MapManager = require("./MapManager.js");
const Battle = require("./Battle.js");
const Loader = require("./Loader.js");

function Game() {
    this.now = null;
    this.deltaTime = 0;
    this.last = Date.now();
    this.step = 1/30;

    // Initialize serivce
    this.service = {};

    this.service.tick = 0;

    this.service.state = "loading";

    // Loading
    // Load resources to service.resouces
    this.loader = new Loader(this.service, {});
    // Initialize world state
    this.loader.load(function() {
        this.service.coolguy = new Entity(this.service, {
            x: 14*32,                       // x position on map
            y: 35*32,                       // y position on map
            canvasX: 512,                   // x position on canvas
            canvasY: 384,                   // y position on canvas
            collisionSquare: 20,            // width and height of collision square
            renderWidth: 32,                // render width
            renderHeight: 48,               // render height
            speed: 4                        // speed
        });

        this.service.mapManager = new MapManager(this.service, {});

        this.service.map = this.service.mapManager.getMap("startMap");

        this.service.state = "world";
    });

    // Battle

    // World

    // Loading properties
    this.service.loadCanvas = document.querySelector(".loadCanvas");
    this.service.loadContext = this.service.loadCanvas.getContext("2d");

    // Battle properties
    this.service.battleCanvas = document.querySelector(".battleCanvas");
    this.service.battleContext = this.service.battleCanvas.getContext("2d");

    // World properties
    this.service.worldCanvas = document.querySelector(".worldCanvas");
    this.service.worldContext = this.service.worldCanvas.getContext("2d");

    require("./listeners.js").addListeners(this.service);

    this.startGame();

    // The tick when system was loaded
    // this.loadedTick = null;
}

Game.prototype.setState = function(state) {
    if (this.state = "world") {
        this.map = this.mapManager.getMap("startMap");
    }
    this.state = state;
}

Game.prototype.startGame = function() {
    function frame() {
        this.now = Date.now();

        this.deltaTime = this.deltaTime + Math.min(1, (this.now - this.last) / 1000);

        while(this.deltaTime > this.step) {
            this.deltaTime = this.deltaTime - this.step;
            this.update();
            this.render();
        }

        this.last = this.now;

        requestAnimationFrame(frame.bind(this));
    }

    // Start game!
    requestAnimationFrame(frame.bind(this));
};

Game.prototype.update = function() {
    this.service.tick += 1;

    // Do not update while system is loading
    // if (!this.isLoaded()) {return;}

    if (this.service.state === "loading") {
        // Update resorce loader
        this.loader.update();
    }

    if (this.service.state === "battle") {
        // Update battle
        this.battle.update();
    }

    if (this.service.state === "world") {
        // Update coolguy
        this.service.coolguy.update();

        // Update map
        this.service.map.update();
    }

    this.service.listeners.click = false;
    this.service.listeners.mouseup = false;
}

Game.prototype.render = function() {
    // Render 'loading screen' while system is loading
    // if (!this.isLoaded()) {
    //     this.context.beginPath();

    //     this.context.font = "26px Georgia";
    //     this.context.fillStyle = "#DDDDDD";
    //     this.context.fillText("Loading!", this.canvas.width/2 - 50, this.canvas.height/2 - 10);

    //     // this.context.stroke();

    //     return;
    // }

    if (this.state === "loading") {
        this.resourceLoader.render(this.loadContext);
    }

    if (this.state === "battle") {
        let context = this.battleContext;

        context.clearRect(0, 0, this.battleCanvas.width, this.battleCanvas.height);

        this.battle.render(context);
    }

    if (this.state === "world") {
        let context = this.worldContext;

        context.clearRect(0, 0, this.worldCanvas.width, this.worldCanvas.height);

        this.map.renderLayer1(context);

        this.map.renderTiles(context);

        this.coolguy.render(context);

        this.map.renderLayer2(context);

        this.map.render(context);
    }

    // If system was recently loaded -> tone from black screen to game
    // if (this.tickCounter - this.loadedTick < 20) {
    //     this.context.beginPath();
    //     this.context.fillStyle = "rgba(0, 0, 0, " + (1 - (this.tickCounter - this.loadedTick)/20) + ")";
    //     this.context.fillRect(0, 0, 2000, 2000);
    //     this.context.stroke();
    // }
}

Game.prototype.event = function(event) {
    // Walking!
    if (event.id === 1) {
        this.coolguy.state = "walking";

        return;
    }

    // Change map!
    if (event.id === 2) {
        this.loadedTick = null;

        this.map.destroy();

        this.map = MapInitializer.getMap(event.data.mapName);

        this.coolguy.x = event.data.spawnX;
        this.coolguy.y = event.data.spawnY;

        return;
    }

    // Grass!
    if (event.id === 3) {
        this.coolguy.state = "grass";

        event.data.tile.pause = false;

        this.startBattle();

        return;
    }

    // Water!
    if (event.id === 4) {
        this.coolguy.state = "water";

        return;
    }
}

// Game.prototype.startBattle = function(settings) {
//     this.map.audio.pause();

//     this.battle = new Battle(settings);

//     this.state = "battle";

//     // this.canvas = this.battleCanvas;
//     // this.context = this.battleContext;

//     this.worldCanvas.style.zIndex = 1;
//     this.battleCanvas.style.zIndex = 2;
// }

// Game.prototype.endBattle = function() {
//     this.battle.audio.pause();

//     this.map.audio.play();

//     this.battle = null;

//     this.state = "world";

//     // this.canvas = this.worldCanvas;
//     // this.context = this.worldContext;

//     this.worldCanvas.style.zIndex = 2;
//     this.battleCanvas.style.zIndex = 1;
// }

module.exports = Game;
