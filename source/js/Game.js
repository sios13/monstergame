const Entity = require("./Entity.js");
const MapManager = require("./MapManager.js");
const Battle = require("./Battle.js");
const Loader = require("./Loader.js");

Function.prototype.bindArgs = function(...boundArgs)
{
    let context = this;
    return function(...args) { return context.call(this, ...boundArgs, ...args); };
};

function Game() {
    this.now = null;
    this.deltaTime = 0;
    this.last = Date.now();
    this.step = 1/30;

    /**
     * Initialize service
     */
    this.service = {};

    this.service.util = require("./NiceFunctions.js");

    this.service.tick = 0;

    this.service.state = "loading";

    this.service.events = [];

    // Load resources to service.resouces
    this.loader = new Loader(this.service, {});
    // Initialize world state
    this.service.events.push(function() {
        this.loader.load(function() {
            this.service.coolguy = new Entity(this.service, {});

            this.service.mapManager = new MapManager(this.service, {});

            this.service.map = this.service.mapManager.getMap("startMap");

            this.service.state = "world";

            // this.service.battle = new Battle(this.service, {});
        });
    });

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
}

// Game.prototype.setState = function(state) {
//     if (this.state = "world") {
//         this.map = this.mapManager.getMap("startMap");
//     }
//     this.state = state;
// }

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

    // console.log(this.service.state);

    // Check for events in service.events
    this.checkEvents();

    // Update resorce loader
    this.loader.update();

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

    this.loader.render();

    if (this.state === "battle") {
        let context = this.battleContext;

        context.clearRect(0, 0, this.battleCanvas.width, this.battleCanvas.height);

        this.battle.render();
    }

    if (this.service.state === "world") {
        let context = this.service.worldContext;

        context.clearRect(0, 0, this.service.worldCanvas.width, this.service.worldCanvas.height);

        this.service.map.renderLayer1();

        this.service.coolguy.render();

        this.service.map.renderLayer2();
    }

    // If system was recently loaded -> tone from black screen to game
    // if (this.tickCounter - this.loadedTick < 20) {
    //     this.context.beginPath();
    //     this.context.fillStyle = "rgba(0, 0, 0, " + (1 - (this.tickCounter - this.loadedTick)/20) + ")";
    //     this.context.fillRect(0, 0, 2000, 2000);
    //     this.context.stroke();
    // }
}

/**
 * Iterates and executes all events in service.events
 */
Game.prototype.checkEvents = function() {
    // Do not check for events if there are no events!
    if (this.service.events.length === 0) {
        return;
    }
    
    for (let i = 0; i < this.service.events.length; i++) {
        let event = this.service.events[i];

        event.call(this);
    }

    // All events have been checked -> make the events array empty
    this.service.events = [];
}

module.exports = Game;
