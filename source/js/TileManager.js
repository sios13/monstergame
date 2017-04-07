const Tile = require("./Tile.js");

function TileManager(settings) {
    this.tilesSettings = settings.filter(function(s) {
        s.image = new Image();
        s.image.src = s.src;
        return s;
    });
}

TileManager.prototype.getTile = function(identifier, renderCol, renderRow, spriteCol, spriteRow) {
    let settings = this.tilesSettings.find(x => x.identifier === identifier);

    let tile = new Tile(
        renderCol,              // col where to render
        renderRow,              // row where to render
        settings.renderWidth,   // render width
        settings.renderHeight,  // render height
        spriteCol,              // col of tile in spirte
        spriteRow,              // row of tile in sprite
        settings.tileWidth,     // width of tile in sprite
        settings.tileHeight,    // height of tile in sprite
        settings.offset,        // offset length
        settings.ticks,         // number of frames
        settings.image          // sprite or sprites src
    );

    return tile;
}

module.exports = TileManager;
