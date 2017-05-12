const Tile = require("./Tile.js");
const Conversation = require("./Conversation.js");

function Battle(service, settings) {
    this.service = service;
    // this.tick = -1;

    this.state = "intro1";

    this.opponent = settings.opponent;

    // this.screenWidth = 1024;
    // this.screenHeight = 768;

    // this.audio = new Audio("audio/pkmn-fajt.mp3");
    // this.audio.loop = true;
    // this.audio.play();

    // this.conversation = new Conversation({
    //     backgroundSrc: "img/conversation/background_battle.png",
    //     hidden: true,
    //     nextable: false
    // });

    this.flashTile = this.service.resources.getTile("flash", 0, 0, 1024, 768);
    this.flashTile.alpha = 0;

    this.backgroundTile = this.service.resources.getTile("battleBgForestEve", 0, 0, 1024, 768);

    this.playerTile = this.service.resources.getTile("battlePlayer", 1024 + 170, 768 - 192 - 230, 230, 230);

    this.playerbaseTile = this.service.resources.getTile("battlePlayerbase", 1024, 768 - 192 - 64, 512, 64);

    this.opponentbaseTile = this.service.resources.getTile("battleOpponentbase", -512, 200, 512, 256);

    this.ballTile = this.service.resources.getTile("battleBall", 0, 410, 48, 48);

    this.bottombarTile = this.service.resources.getTile("battleBottombar", 0, 768 - 192, 1028, 192);

    this.fightbtnTile = this.service.resources.getTile("battleFightbtn", 514, 768 - 192 + 10, 256, 92);
    
    this.bagbtnTile = this.service.resources.getTile("battleBagbtn", 770, 768 - 192 + 10, 256, 92);

    this.pokemonbtnTile = this.service.resources.getTile("battlePokemonbtn", 514, 768 - 192 + 92, 256, 92);
    
    this.runbtnTile = this.service.resources.getTile("battleRunbtn", 770, 768 - 192 + 92, 256, 92);

    console.log(this.runbtnTile);
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

Battle.prototype._chooseMouseEvents = function() {
    let isInsideBox = function(x1, y1, x2, y2) {
        let x = this.service.listeners.mousePositionX;
        let y = this.service.listeners.mousePositionY;

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

        if (this.service.listeners.click === true) {
            this.state = "choosefight";

            this.conversation.addText("+");
            this.conversation.nextable = true;
            this.conversation.next();
            this.conversation.nextable = false;
        }
    }

    if (isInsideBox(this.bagbtn.renderX, this.bagbtn.renderY, this.bagbtn.renderX + this.bagbtn.renderWidth, this.bagbtn.renderY + this.bagbtn.renderHeight)) {
        this.bagbtn.setFrame(1);

        if (this.service.listeners.click === true) {
            console.log("bag");
        }
    }

    if (isInsideBox(this.pokemonbtn.renderX, this.pokemonbtn.renderY, this.pokemonbtn.renderX + this.pokemonbtn.renderWidth, this.pokemonbtn.renderY + this.pokemonbtn.renderHeight)) {
        this.pokemonbtn.setFrame(1);

        if (this.service.listeners.click === true) {
            console.log("pokemon");
        }
    }

    if (isInsideBox(this.runbtn.renderX, this.runbtn.renderY, this.runbtn.renderX + this.runbtn.renderWidth, this.runbtn.renderY + this.runbtn.renderHeight)) {
        this.runbtn.setFrame(1);

        if (this.service.listeners.click === true) {
            this.state = "chooserun";
        }
    }
}

Battle.prototype._chooseFightMouseEvents = function() {
    let isInsideBox = function(x1, y1, x2, y2) {
        let x = this.service.listeners.mousePositionX;
        let y = this.service.listeners.mousePositionY;

        if (x > x1 && y > y1 && x < x2 && y < y2) {
            return true;
        }

        return false;
    }

    let x = this.service.listeners.mousePositionX;
    let y = this.service.listeners.mousePositionY;
}

Battle.prototype.update = function(ame) {
    this.tick += 1;

    // if (this.state === "intro1") {
    //     this._playIntro1();
    // }

    // if (this.state === "intro2") {
    //     this._playIntro2();

    //     this.ball.update();
    // }

    // if (this.state === "choose") {
    //     this._chooseMouseEvents();
    // }

    // if (this.state === "choosefight") {
    //     this._chooseFightMouseEvents();
    // }

    // if (this.state === "chooserun") {
        
    // }

    // this.player.monster_tile.update();
    // this.player.player_tile.update();

    // this.enemy.monster_tile.update();

    // this.conversation.update();
}

Battle.prototype.render = function() {
    let context = this.service.battleContext;

    this.runbtnTile.render(context);
    // this.flash.render(context);

    // this.background.render(context);

    // // Enemy
    // this.enemy.base_tile.render(context);
    // this.enemy.monster_tile.render(context);

    // // Ball
    // this.ball.render(context);

    // // Player
    // this.player.base_tile.render(context);
    // this.player.player_tile.render(context);
    // this.player.monster_tile.render(context);

    // // Bottom bar
    // this.bottombar.render(context);

    // // this.textbox.render(context);

    // this.conversation.render(context);

    // if (this.state === "choose") {
    //     this.fightbtn.render(context);
    //     this.bagbtn.render(context);
    //     this.pokemonbtn.render(context);
    //     this.runbtn.render(context);
    // }
}

module.exports = Battle;
