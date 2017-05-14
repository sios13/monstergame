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
    this.service = require("./InitializeService.js")();

    // Load save file
    this.service.save = require("./resources/savefile.json");

    this.service.tick = 0;

    this.service.state = "";

    this.service.events = [];

    // Load resources to service.resouces
    this.loader = new Loader(this.service, {});
    // Initialize world state
    this.service.events.push(function() {
        this.loader.load(
            undefined,
            function() {
                this.service.coolguy = new Entity(this.service, {});

                this.service.mapManager = new MapManager(this.service, {});

                this.service.map = this.service.mapManager.getMap("startMap");

                this.service.state = "world";
            },
            function() {
                this.service.map.audio.volume = 0;

                this.service.playAudio(this.service.map.audio);
            }
        );
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

Game.prototype.startGame = function() {
    function frame() {
        this.now = Date.now();

        this.deltaTime = this.deltaTime + Math.min(1, (this.now - this.last) / 1000);

        while(this.deltaTime > this.step) {
            this.deltaTime = this.deltaTime - this.step;
            this.update();
        }

        this.last = this.now;

        this.render();

        requestAnimationFrame(frame.bind(this));
    }

    // Start game!
    requestAnimationFrame(frame.bind(this));
};

Game.prototype.update = function() {
    this.service.tick += 1;

    // Check for events in service.events
    this.checkEvents();

    // Update loader
    this.loader.update();

    if (this.service.state === "loading") {
    }

    if (this.service.state === "battle") {
        // Update battle
        this.service.battle.update();
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
    this.loader.render();

    if (this.service.state === "battle") {
        let context = this.service.battleContext;

        context.clearRect(0, 0, this.service.battleCanvas.width, this.service.battleCanvas.height);

        this.service.battle.render();
    }

    if (this.service.state === "world") {
        let context = this.service.worldContext;

        context.clearRect(0, 0, this.service.worldCanvas.width, this.service.worldCanvas.height);

        this.service.map.renderLayer1();

        this.service.coolguy.render();

        this.service.map.renderLayer2();
    }
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
