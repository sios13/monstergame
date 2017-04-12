const Tile = require("./Tile.js");

function Battle(settings) {
    this.tick = 0;

    this.screenWidth = 1024;
    this.screenHeight = 768;

    this.background = new Tile({
        renderWidth: this.screenWidth,
        renderHeight: this.screenHeight,
        tileWidth: 512,
        tileHeight: 288,
        src: "img/battle/battlebgForestEve.png"
    });

    this.player = {
        name: "player",
        x: 0,
        y: 100,
        image: new Tile({
            renderCol: 0,
            renderRow: 7,
            renderWidth: 350,
            renderHeight: 350,
            spriteCol: 0,
            spriteRow: 0,
            tileWidth: 108,
            tileHeight: 108,
            offset: 108,
            numberOfFrames: 87,
            updateFrequency: 1,
            src: "img/battle/player_monster.png",
            loop: false
        }),
        base_image: new Tile({
            renderWidth: 512,
            renderHeight: 64,
            tileWidth: 512,
            tileHeight: 64,
            src: "img/battle/playerbaseFieldGrassEve.png"
        })
    };

    this.enemy = {
        name: "HEJ",
        image: "img/battle/enemy.png",
        base_image: "img/battle/enemybaseField.png"
    };

    this.bottombar = new Tile({renderWidth: 1028, renderHeight: 192, tileWidth: 512, tileHeight: 96, src: "img/battle/bottombar.png"});

    this.fightbtn = new Tile({});
}

Battle.prototype._load = function() {

}

Battle.prototype.update = function(game) {
    this.tick += 1;

    this.player.image.update(game);

    if (this.tick === 200) {
        this.player.image.pause = false;
    }

    if (this.tick === 400) {
        game.endBattle();
    }
}

Battle.prototype.render = function(context) {
    this.background.render(context);

    this.player.base_image.render(context, this.player.x, this.screenHeight - 192 - 64);
    this.player.image.render(context, this.player.x + 512/2 - this.player.image.renderWidth/2, this.player.y);

    // context.drawImage(this.image, xInImage, yInImage, this.tileWidth, this.tileHeight, mapX + renderX, mapY + renderY, this.renderWidth, this.renderHeight);

    // Draw white box at bottom
    // context.beginPath();
    // context.fillStyle = "rgba(255, 255, 255, 0.7)";
    // context.fillRect(0, this.screenHeight - 175, this.screenWidth, 175);
    // context.stroke();

    // Bottom bar
    this.bottombar.render(context, 0, this.screenHeight - 192);
}

module.exports = Battle;
