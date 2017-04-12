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
        x: 1024,
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
            loop: false,
            pause: true
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

    this.textbox = new Tile({renderWidth: 481, renderHeight: 176, tileWidth: 244, tileHeight: 88, src: "img/battle/textbox.png"});

    this.fightbtn = new Tile({renderWidth: 256, renderHeight: 92, tileWidth: 130, tileHeight: 46, src: "img/battle/fightbtn.png"});

    this.bagbtn = new Tile({renderWidth: 256, renderHeight: 92, tileWidth: 130, tileHeight: 46, src: "img/battle/bagbtn.png"});

    this.pokemonbtn = new Tile({renderWidth: 256, renderHeight: 92, tileWidth: 130, tileHeight: 46, src: "img/battle/pokemonbtn.png"});

    this.runbtn = new Tile({renderWidth: 256, renderHeight: 92, tileWidth: 130, tileHeight: 46, src: "img/battle/runbtn.png"});
}

Battle.prototype._load = function() {

}

Battle.prototype._intro = function() {
    // if intro is over -> exit
    if (this.tick > 500) {
        return;
    }

    if (this.tick < 75) {
        this.player.x -= 14;
    }

    if (this.tick === 75) {
        this.player.image.pause = false;
    }

    if (this.tick === 200) {
    }

    if (this.tick === 300) {
        // game.endBattle();
    }
}

Battle.prototype._mouseEvents = function(game) {
    let x = game.listeners.mousePositionX;
    let y = game.listeners.mousePositionY;

    if (game.listeners.click === true && y > 600 && x > 600) {
        console.log("HEJ123");
    }
}

Battle.prototype.update = function(game) {
    this.tick += 1;

    this._intro();

    this.player.image.update(game);

    this._mouseEvents(game);
}

Battle.prototype.render = function(context) {
    this.background.render(context);

    // Player
    this.player.base_image.render(context, this.player.x, this.screenHeight - 192 - 64);
    this.player.image.render(context, this.player.x + 512/2 - this.player.image.renderWidth/2, this.player.y);

    // Bottom bar
    this.bottombar.render(context, 0, this.screenHeight - 192);

    this.textbox.render(context, 10, this.screenHeight - 192 + 10);

    this.fightbtn.render(context, this.screenWidth*0.5 - 10, this.screenHeight - 192 + 10);
    this.bagbtn.render(context, this.screenWidth*0.5 - 10 + 256, this.screenHeight - 192 + 10);
    this.pokemonbtn.render(context, this.screenWidth*0.5 - 10, this.screenHeight - 192 + 10 + 92 - 8);
    this.runbtn.render(context, this.screenWidth*0.5 - 10 + 256, this.screenHeight - 192 + 10 + 92 - 8);
}

module.exports = Battle;
