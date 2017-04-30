const Entity = require("./Entity.js");
const MapInitializer = require("./MapInitializer.js");
const Battle = require("./Battle.js");
const ResourceLoader = require("./ResourceLoader.js");

function Game() {
    this.now = null;
    this.deltaTime = 0;
    this.last = Date.now();
    this.step = 1/30;

    this.tickCounter = 0;

    this.state = "loading";

    // Loading properties
    this.loadCanvas = document.querySelector(".loadCanvas");
    this.loadContext = this.loadCanvas.getContext("2d");

    this.resourceLoader = new ResourceLoader();

    // Battle properties
    this.battleCanvas = document.querySelector(".battleCanvas");
    this.battleContext = this.battleCanvas.getContext("2d");

    this.battle = null;

    // World properties
    this.worldCanvas = document.querySelector(".worldCanvas");
    this.worldContext = this.worldCanvas.getContext("2d");

    this.map = MapInitializer.getMap("startMap");

    this.coolguy = new Entity({
        x: 14*32,                       // x position on map
        y: 35*32,                       // y position on map
        canvasX: 512,                   // x position on canvas
        canvasY: 384,                   // y position on canvas
        collisionSquare: 20,            // width and height of collision square
        renderWidth: 32,                // render width
        renderHeight: 48,               // render height
        speed: 4                        // speed
    });

    // The tick when system was loaded
    // this.loadedTick = null;
}

/**
 * Returns true if system is loaded
 */
// Game.prototype.isLoaded = function() {
//     if (this.map.isLoaded() && this.coolguy.isLoaded()) {
//         if (this.loadedTick === null) {
//             this.loadedTick = this.tickCounter;
//         }

//         return true;
//     }

//     console.log("Not loaded tick!");

//     return false;
// }

Game.prototype.startGame = function() {
    require("./listeners.js").addListeners(this);

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
    this.tickCounter += 1;

    // Do not update while system is loading
    // if (!this.isLoaded()) {return;}

    if (this.state === "loading") {
        // Update resorce loader
        this.resourceLoader.update(this);
    }

    if (this.state === "battle") {
        // Update battle
        this.battle.update(this);
    }

    if (this.state === "world") {
        // Update coolguy
        this.coolguy.update(this);

        // Update map
        this.map.update(this);
    }

    this.listeners.click = false;
    this.listeners.mouseup = false;
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

Game.prototype.setState = function(state) {
    this.state = state;
}

Game.prototype.startBattle = function(settings) {
    this.map.audio.pause();

    this.battle = new Battle(settings);

    this.state = "battle";

    // this.canvas = this.battleCanvas;
    // this.context = this.battleContext;

    this.worldCanvas.style.zIndex = 1;
    this.battleCanvas.style.zIndex = 2;
}

Game.prototype.endBattle = function() {
    this.battle.audio.pause();

    this.map.audio.play();

    this.battle = null;

    this.state = "world";

    // this.canvas = this.worldCanvas;
    // this.context = this.worldContext;

    this.worldCanvas.style.zIndex = 2;
    this.battleCanvas.style.zIndex = 1;
}

module.exports = Game;
