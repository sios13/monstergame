const Tile = require("./Tile.js");
const Conversation = require("./Conversation.js");

function Battle(settings) {
    this.tick = -1;

    this.state = "intro1";

    this.screenWidth = 1024;
    this.screenHeight = 768;

    this.audio = new Audio("audio/pkmn-fajt.mp3");
    this.audio.loop = true;
    this.audio.play();

    this.conversation = new Conversation({
        backgroundSrc: "img/conversation/background_battle.png",
        hidden: true,
        nextable: false
    });
    
    this.flash = new Tile({
        renderWidth: 1024,
        renderHeight: 768,
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
        audio: new Audio("audio/monster/130Cry.wav"),
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
            renderX: 512/2 - 350/2,
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
            src: "img/battle/player_monster_shiny.png",
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
    this.player.monster_tile.alpha = 0;

    this.enemy = {
        name: "HEJ",
        audio: new Audio("audio/monster/093Cry.wav"),
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

    // this.textbox = new Tile({renderX: -10000, renderY: this.screenHeight - 192 + 10, renderWidth: 481, renderHeight: 176, tileWidth: 244, tileHeight: 88, src: "img/battle/textbox.png"});

    this.fightbtn = new Tile({
        renderX: 514,
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
        renderX: 770,
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
        renderX: 514,
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
        renderX: 770,
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

Battle.prototype._playIntro1 = function() {
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

    if (this.tick >= 30 && this.tick < 35) {
        this.flash.alpha += 0.20;
    }
    if (this.tick >= 35 && this.tick < 40) {
        this.flash.alpha -= 0.20;
    }

    if (this.tick >= 60 && this.tick < 70) {
        this.flash.alpha += 0.10;
    }

    // Transition is over -> set starting positions
    if (this.tick === 105) {
        this.background.renderX = 0;

        this.bottombar.renderX = 0;

        this.conversation.hidden = false;

        // this.textbox.renderX = 10;

        this.fightbtn.renderX = this.screenWidth/2 - 10;
        this.bagbtn.renderX = this.screenWidth/2 - 10 + 256;
        this.pokemonbtn.renderX = this.screenWidth/2 - 10;
        this.runbtn.renderX = this.screenWidth/2 - 10 + 256;
    }

    if (this.tick > 105 && this.tick < 175) {
        this.player.player_tile.renderX -= 15;
        this.player.base_tile.renderX -= 15;

        this.enemy.monster_tile.renderX += 15;
        this.enemy.base_tile.renderX += 15;
    }

    if (this.tick === 180) {
        this.enemy.monster_tile.pause = false;
        this.enemy.audio.play();

        this.conversation.addText("A wild monster appeared!+");
        this.conversation.nextable = true;
        this.conversation.next();
        this.conversation.addCallable(function() {
            this.tick = -1;
            this.state = "intro2";
            this.conversation.addText("Go hehehehehe!+");
            this.conversation.nextable = false;
        }.bind(this));
    }
}

Battle.prototype._playIntro2 = function() {
    switch (this.tick) {
        case 0:
            
            break;
        case 
    
        default:
            break;
    }
    if (this.tick === 0) {
        this.player.player_tile.pause = false;
    }

    if (this.tick > 0 && this.tick < 40) {
        this.player.player_tile.renderX -= 15;
    }

    if (this.tick === 10) {
        this.ball.renderX = 150;
    }

    if (this.tick > 10 && this.tick < 40) {
        this.ball.renderX += 5;
        this.ball.renderY += 2;
    }

    if (this.tick === 40) {
        this.player.monster_tile.pause = false;
        this.player.monster_tile.alpha = 1;
        this.player.audio.play();

        this.ball.renderX = -500;
    }

    if (this.tick === 60) {
        this.conversation.nextable = true;
        this.conversation.addText("What will+hehehe do?");
        this.conversation.addCallable(function() {
            this.conversation.nextable = false;
            this.state = "choose";
        }.bind(this));
    }
}

Battle.prototype._chooseMouseEvents = function(game) {
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
            this.state = "choosefight";

            this.conversation.addText("+");
            this.conversation.nextable = true;
            this.conversation.next();
            this.conversation.nextable = false;
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
            this.state = "chooserun";
        }
    }
}

Battle.prototype._chooseFightMouseEvents = function(game) {
    let isInsideBox = function(x1, y1, x2, y2) {
        let x = game.listeners.mousePositionX;
        let y = game.listeners.mousePositionY;

        if (x > x1 && y > y1 && x < x2 && y < y2) {
            return true;
        }

        return false;
    }

    let x = game.listeners.mousePositionX;
    let y = game.listeners.mousePositionY;
}

Battle.prototype.update = function(game) {
    this.tick += 1;

    if (this.state === "intro1") {
        this._playIntro1();
    }

    if (this.state === "intro2") {
        this._playIntro2();

        this.ball.update(game);
    }

    if (this.state === "choose") {
        this._chooseMouseEvents(game);
    }

    if (this.state === "choosefight") {
        this._chooseFightMouseEvents(game);
    }

    if (this.state === "chooserun") {
        game.endBattle();
    }

    this.player.monster_tile.update(game);
    this.player.player_tile.update(game);

    this.enemy.monster_tile.update(game);

    this.conversation.update(game);
}

Battle.prototype.render = function(context) {
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

    // this.textbox.render(context);

    this.conversation.render(context);

    if (this.state === "choose") {
        this.fightbtn.render(context);
        this.bagbtn.render(context);
        this.pokemonbtn.render(context);
        this.runbtn.render(context);
    }
}

module.exports = Battle;
