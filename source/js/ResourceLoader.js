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
