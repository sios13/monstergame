const Tile = require("./Tile.js");

function ResourceLoader() {
    this.tick = 0;
    
    this.flash = new Tile({
        renderWidth: 1024,
        renderHeight: 768,
        tileWidth: 1024,
        tileHeight: 768,
        alpha: 0,
        src: "img/battle/flash.png"
    });
    this.flash.alpha = 0;

    let loadEvent = new function(event, test) {

    }

    let images = [
        "img/character7_walking.png"
    ];

    for (let i = 0; i < images.length; i++) {
        let src = images[i];
        images[i] = new Image();
        images[i].addEventListener("load", loadEvent);
        images[i].src = src;
    }

    console.log(images);

    localStorage.setItem("images", images);
}

ResourceLoader.prototype.update = function(game) {
    this.tick += 1;

    if (this.tick === 30) {
        game.setState("world");
    }
}

ResourceLoader.prototype.render = function(context) {

}

module.exports = ResourceLoader;
