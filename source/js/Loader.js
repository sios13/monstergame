const Tile = require("./Tile.js");

function Loader(service, settings)
{
    this.service = service;
    
    this.tick = 0;

    this.endTick = null;

    this.loadEssentialCounter = 0;

    this.images = [
        "img/character7_walking.png"
    ];

    this.loadEssentialResources();
}

Loader.prototype.loadEssentialResources = function() {
    for (let i = 0; i < this.images.length; i++) {
        let src = this.images[i];
        this.images[i] = new Image();
        this.images[i].addEventListener("load", function() {
            this.loadEssentialCounter += 1;
        }.bind(this));
        this.images[i].src = src;
    }

    this.service.resources = {};

    this.service.resources.images = this.images;
}

/**
 * Starts a new loading
 */
Loader.prototype.load = function(callable)
{
    this.tick = 0;

    this.endTick = null;

    this.loadCallable = callable;
}

Loader.prototype.update = function()
{
    this.tick += 1;

    // Do not update while essential resources is loading
    if (this.loadEssentialCounter !== this.images.length) {
        return;
    }

    // If 30 ticks have passed since loading started -> call the callable
    if (this.tick === 30) {
        this.loadCallable();

        this.endTick = this.tick + 10 + 30;
    }
}

Loader.prototype.render = function(context)
{
    context.beginPath();

    context.fillStyle = "rgba(0, 0, 0, " + this.tick + ")";
    context.fillRect(0, 0, 2000, 2000);
    context.stroke();

    context.font = "26px Georgia";
    context.fillStyle = "#DDDDDD";
    context.fillText("Loading!", context.canvas.width/2 - 50, context.canvas.height/2 - 10);
}

module.exports = Loader;
