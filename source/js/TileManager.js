const Tile = require("./Tile.js");

function TileManager(settings) {
    this.tilesSettings = [];

    this.addSettings(settings);
}

TileManager.prototype.addSettings = function(settings) {
    if (settings === undefined) {
        return;
    }

    /**
     * If adding settings as array
     */
    if (Array.isArray(settings))
    {
        let temp = settings.filter(function(s) {
            s.image = new Image();
            s.image.src = s.src;
            return s;
        });

        this.tilesSettings = this.tilesSettings.concat(temp);
    }
    else
    {
        settings.image = new Image();
        settings.image.src = settings.src;

        this.tilesSettings.push(settings);
    }
}

TileManager.prototype.getTile = function(identifier, renderCol, renderRow, spriteCol, spriteRow) {
    let settings = this.tilesSettings.find(x => x.identifier === identifier);

    let tile = new Tile(
        renderCol,                  // col where to render
        renderRow,                  // row where to render
        settings.renderWidth,       // render width
        settings.renderHeight,      // render height
        spriteCol,                  // col of tile in spirte
        spriteRow,                  // row of tile in sprite
        settings.tileWidth,         // width of tile in sprite
        settings.tileHeight,        // height of tile in sprite
        settings.offset,            // offset length
        settings.numberOfFrames,    // number of frames
        settings.updateFrequency,   // specifies how often to update (5 is every fifth tick, 2 is every other tick, 1 is every tick etc...)
        settings.image              // sprite or sprites src
    );

    return tile;
}

module.exports = TileManager;
