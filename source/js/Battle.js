const Tile = require("./Tile.js");

function Battle(settings) {
    this.tick = -1;

    this.screenWidth = 1024;
    this.screenHeight = 768;

    // this.state = "transition";
    
    this.flash = new Tile({
        renderWidth: this.screenWidth,
        renderHeight: this.screenHeight,
        tileWidth: 1024,
        tileHeight: 768,
        alpha: 0,
        src: "img/battle/flash.png"
    });
    this.flash.alpha = 0;

    this.background = new Tile({
        renderX: -10000,
        renderY: 0,
        renderWidth: this.screenWidth,
        renderHeight: this.screenHeight,
        tileWidth: 512,
        tileHeight: 288,
        src: "img/battle/battlebgForestEve.png"
    });

    this.player = {
        name: "player",
        player_tile: new Tile({
            renderX: 1024 + 170,
            renderY: 768 - 192 - 230,
            renderWidth: 230,
            renderHeight: 230,
            spriteCol: 0,
            spriteRow: 0,
            tileWidth: 128,
            tileHeight: 128,
            offset: 128,
            numberOfFrames: 5,
            updateFrequency: 5,
            src: "img/battle/player_back.png",
            loop: false,
            pause: true
        }),
        monster_tile: new Tile({
            // renderX: 1024 + 512/2 - 350/2,
            renderX: -500,
            renderY: 310,
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
        base_tile: new Tile({
            renderX: 1024,
            renderY: this.screenHeight - 192 - 64,
            renderWidth: 512,
            renderHeight: 64,
            tileWidth: 408,
            tileHeight: 64,
            src: "img/battle/playerbaseFieldGrassEve.png"
        })
    };

    this.enemy = {
        name: "HEJ",
        monster_tile: new Tile({
            renderX: 0 - 512/2 - 350/2,
            renderY: 75,
            renderWidth: 350,
            renderHeight: 350,
            spriteCol: 0,
            spriteRow: 0,
            tileWidth: 85,
            tileHeight: 85,
            offset: 85,
            numberOfFrames: 25,
            updateFrequency: 1,
            src: "img/battle/enemy_monster.png",
            loop: false,
            pause: true
        }),
        base_tile: new Tile({
            renderX: 0 - 512,
            renderY: 200,
            renderWidth: 512,
            renderHeight: 256,
            tileWidth: 256,
            tileHeight: 128,
            src: "img/battle/enemybaseFieldGrassEve.png"
        })
    };

    this.ball = new Tile({
        renderX: -500,
        renderY: 410,
        renderWidth: 48,
        renderHeight: 48,
        spriteCol: 0,
        spriteRow: 0,
        tileWidth: 32,
        tileHeight: 32,
        offset: 32,
        numberOfFrames: 4,
        updateFrequency: 3,
        src: "img/battle/ball.png",
        loop: true,
        pause: false
    });

    this.bottombar = new Tile({renderX: -10000, renderY: this.screenHeight - 192, renderWidth: 1028, renderHeight: 192, tileWidth: 512, tileHeight: 96, src: "img/battle/bottombar.png"});

    this.textbox = new Tile({renderX: -10000, renderY: this.screenHeight - 192 + 10, renderWidth: 481, renderHeight: 176, tileWidth: 244, tileHeight: 88, src: "img/battle/textbox.png"});

    this.fightbtn = new Tile({
        renderX: -10000,
        renderY: this.screenHeight - 192 + 10,
        renderWidth: 256,
        renderHeight: 92,
        tileWidth: 130,
        tileHeight: 46,
        offset: 130,
        numberOfFrames: 2,
        src: "img/battle/fightbtn.png",
        loop: false,
        pause: true
    });

    this.bagbtn = new Tile({
        renderX: -10000,
        renderY: this.screenHeight - 192 + 10,
        renderWidth: 256,
        renderHeight: 92,
        tileWidth: 130,
        tileHeight: 46,
        offset: 130,
        numberOfFrames: 2,
        src: "img/battle/bagbtn.png",
        loop: false,
        pause: true
    });

    this.pokemonbtn = new Tile({
        renderX: -10000,
        renderY: this.screenHeight - 192 + 10 + 92 - 8,
        renderWidth: 256,
        renderHeight: 92,
        tileWidth: 130,
        tileHeight: 46,
        offset: 130,
        numberOfFrames: 2,
        src: "img/battle/pokemonbtn.png",
        loop: false,
        pause: true
    });

    this.runbtn = new Tile({
        renderX: -10000,
        renderY: this.screenHeight - 192 + 10 + 92 - 8,
        renderWidth: 256,
        renderHeight: 92,
        tileWidth: 130,
        tileHeight: 46,
        offset: 130,
        numberOfFrames: 2,
        src: "img/battle/runbtn.png",
        loop: false,
        pause: true
    });
}

Battle.prototype._playIntro = function() {
    // if (this.tick === 0) {console.log(this.flash.alpha);this.flash.alpha = 0;}

    if (this.tick >= 0 && this.tick < 5) {
        this.flash.alpha += 0.20;
    }
    if (this.tick >= 5 && this.tick < 10) {
        this.flash.alpha -= 0.20;
    }

    if (this.tick >= 10 && this.tick < 15) {
        this.flash.alpha += 0.20;
    }
    if (this.tick >= 15 && this.tick < 20) {
        this.flash.alpha -= 0.20;
    }

    if (this.tick >= 20 && this.tick < 25) {
        this.flash.alpha += 0.20;
    }
    if (this.tick >= 25 && this.tick < 30) {
        this.flash.alpha -= 0.20;
    }

    if (this.tick >= 45 && this.tick < 70) {
        this.flash.alpha += 0.10;
    }

    // Transition is over -> set starting positions
    if (this.tick === 90) {
        this.background.renderX = 0;

        this.bottombar.renderX = 0;
        this.textbox.renderX = 10;

        this.fightbtn.renderX = this.screenWidth/2 - 10;
        this.bagbtn.renderX = this.screenWidth/2 - 10 + 256;
        this.pokemonbtn.renderX = this.screenWidth/2 - 10;
        this.runbtn.renderX = this.screenWidth/2 - 10 + 256;
    }

    if (this.tick > 90 && this.tick < 160) {
        this.player.player_tile.renderX -= 15;
        this.player.base_tile.renderX -= 15;

        this.enemy.monster_tile.renderX += 15;
        this.enemy.base_tile.renderX += 15;
    }

    if (this.tick === 165) {
        this.enemy.monster_tile.pause = false;
    }

    if (this.tick === 200) {
        this.player.player_tile.pause = false;
    }

    if (this.tick > 200 && this.tick < 240) {
        this.player.player_tile.renderX -= 15;
    }

    if (this.tick === 210) {
        this.ball.renderX = 150;
    }

    if (this.tick > 210 && this.tick < 240) {
        this.ball.renderX += 5;
        this.ball.renderY += 2;
    }

    if (this.tick === 240) {
        this.ball.renderX = -500;
        this.player.monster_tile.renderX = 512/2 - 350/2;
        this.player.monster_tile.pause = false;
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

    this.fightbtn.setFrame(0);
    this.bagbtn.setFrame(0);
    this.pokemonbtn.setFrame(0);
    this.runbtn.setFrame(0);

    if (isInsideBox(this.fightbtn.renderX, this.fightbtn.renderY, this.fightbtn.renderX + this.fightbtn.renderWidth, this.fightbtn.renderY + this.fightbtn.renderHeight)) {
        this.fightbtn.setFrame(1);

        if (game.listeners.click === true) {
            console.log("fight");
        }
    }

    if (isInsideBox(this.bagbtn.renderX, this.bagbtn.renderY, this.bagbtn.renderX + this.bagbtn.renderWidth, this.bagbtn.renderY + this.bagbtn.renderHeight)) {
        this.bagbtn.setFrame(1);

        if (game.listeners.click === true) {
            console.log("bag");
        }
    }

    if (isInsideBox(this.pokemonbtn.renderX, this.pokemonbtn.renderY, this.pokemonbtn.renderX + this.pokemonbtn.renderWidth, this.pokemonbtn.renderY + this.pokemonbtn.renderHeight)) {
        this.pokemonbtn.setFrame(1);

        if (game.listeners.click === true) {
            console.log("pokemon");
        }
    }

    if (isInsideBox(this.runbtn.renderX, this.runbtn.renderY, this.runbtn.renderX + this.runbtn.renderWidth, this.runbtn.renderY + this.runbtn.renderHeight)) {
        this.runbtn.setFrame(1);

        if (game.listeners.click === true) {
            console.log("run");

            game.endBattle();
        }
    }
}

Battle.prototype.update = function(game) {
    this.tick += 1;

    if (this.tick < 300) {
        this._playIntro();
    }

    if (this.tick < 100) {
        this.state = "transition";
    } else {
        this.state = "battle";
    }

    this.player.monster_tile.update(game);
    this.player.player_tile.update(game);

    this.enemy.monster_tile.update(game);

    this.ball.update(game);

    this._mouseEvents(game);
}

Battle.prototype.render = function(context) {
    // if (this.state === "transition") {

    //     return;
    // }

    // if (this.state === "battle") {
        this.flash.render(context);

        this.background.render(context);

        // Enemy
        this.enemy.base_tile.render(context);
        this.enemy.monster_tile.render(context);

        // Ball
        this.ball.render(context);

        // Player
        this.player.base_tile.render(context);
        this.player.player_tile.render(context);
        this.player.monster_tile.render(context);

        // Bottom bar
        this.bottombar.render(context);

        this.textbox.render(context);

        this.fightbtn.render(context);
        this.bagbtn.render(context);
        this.pokemonbtn.render(context);
        this.runbtn.render(context);

        // return;
    // }
}

module.exports = Battle;
