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
        image: new Tile({
            renderX: 1024 + 512/2 - 350/2,
            renderY: 280,
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
            renderX: 1024,
            renderY: this.screenHeight - 192 - 64,
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

    this.bottombar = new Tile({renderX: 0, renderY: this.screenHeight - 192, renderWidth: 1028, renderHeight: 192, tileWidth: 512, tileHeight: 96, src: "img/battle/bottombar.png"});

    this.textbox = new Tile({renderX: 10, renderY: this.screenHeight - 192 + 10, renderWidth: 481, renderHeight: 176, tileWidth: 244, tileHeight: 88, src: "img/battle/textbox.png"});

    this.fightbtn = new Tile({renderX: this.screenWidth/2 - 10, renderY: this.screenHeight - 192 + 10, renderWidth: 256, renderHeight: 92, tileWidth: 130, tileHeight: 46, src: "img/battle/fightbtn.png"});

    this.bagbtn = new Tile({renderX: this.screenWidth/2 - 10 + 256, renderY: this.screenHeight - 192 + 10, renderWidth: 256, renderHeight: 92, tileWidth: 130, tileHeight: 46, src: "img/battle/bagbtn.png"});

    this.pokemonbtn = new Tile({renderX: this.screenWidth/2 - 10, renderY: this.screenHeight - 192 + 10 + 92 - 8, renderWidth: 256, renderHeight: 92, tileWidth: 130, tileHeight: 46, src: "img/battle/pokemonbtn.png"});

    this.runbtn = new Tile({renderX: this.screenWidth/2 - 10 + 256, renderY: this.screenHeight - 192 + 10 + 92 - 8, renderWidth: 256, renderHeight: 92, tileWidth: 130, tileHeight: 46, src: "img/battle/runbtn.png"});
}

Battle.prototype._intro = function() {
    // if intro is over -> exit
    if (this.tick > 500) {
        return;
    }

    if (this.tick < 75) {
        this.player.image.renderX -= 14;
        this.player.base_image.renderX -= 14;
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
    let isInsideBox = function(x1, y1, x2, y2) {
        let x = game.listeners.mousePositionX;
        let y = game.listeners.mousePositionY;

        if (x > x1 && y > y1 && x < x2 && y < y2) {
            return true;
        }

        return false;
    }

    if (game.listeners.click === true) {
        if (isInsideBox(this.fightbtn.renderX, this.fightbtn.renderY, this.fightbtn.renderX + this.fightbtn.renderWidth, this.fightbtn.renderY + this.fightbtn.renderHeight)) {
            console.log("fight");
        }
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
    this.player.base_image.render(context);
    this.player.image.render(context);

    // Bottom bar
    this.bottombar.render(context);

    this.textbox.render(context);

    this.fightbtn.render(context);
    this.bagbtn.render(context);
    this.pokemonbtn.render(context);
    this.runbtn.render(context);
}

module.exports = Battle;
