const Tile = require("./Tile.js");

function TileManager(settings) {
    this.tilesSettings = [];

    this.addSettings(settings);

    this.tiles = [];
}

/**
 * Return all initialized tiles
 */
TileManager.prototype.getAllTiles = function() {
    return this.tiles;
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
        this.tilesSettings = this.tilesSettings.concat(settings);
    }
    else
    {
        this.tilesSettings.push(settings);
    }
}

/**
 * Initialize and return a tile
 * All initialized tiles are also saved in the tile manager!
 */
TileManager.prototype.getTile = function(identifier, renderCol, renderRow, spriteCol, spriteRow) {
    let settings = this.tilesSettings.find(x => x.identifier === identifier);

    let tile = new Tile({
        renderCol: renderCol,                       // col where to render
        renderRow: renderRow,                       // row where to render
        renderWidth: settings.renderWidth,          // render width
        renderHeight: settings.renderHeight,        // render height
        spriteCol: spriteCol,                       // col of tile in spirte
        spriteRow: spriteRow,                       // row of tile in sprite
        tileWidth: settings.tileWidth,              // width of tile in sprite
        tileHeight: settings.tileHeight,            // height of tile in sprite
        offset: settings.offset,                    // offset length
        numberOfFrames: settings.numberOfFrames,    // number of frames
        updateFrequency: settings.updateFrequency,  // specifies how often to update (5 is every fifth tick, 2 is every other tick, 1 is every tick etc...)
        image: settings.image,
        // src: settings.src,                          // sprite or sprites src
        loop: settings.loop,                        // loop
        pause: settings.pause                       // pause
    });

    // All initialized tiles are also saved in the tile manager
    this.tiles.push(tile);

    return tile;
}

module.exports = TileManager;
