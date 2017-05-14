const Tile = require("./Tile.js");
const Conversation = require("./Conversation.js");

function Battle(service, settings) {
    this.service = service;
    this.tick = -1;

    this.state = "intro1";

    this.playerMonster = this.service.resources.monsters.find( monster => monster.name === this.service.save.monsters[0].name );
    this.playerMonster.tileBack.renderX = 86;
    this.playerMonster.tileBack.renderY = 768 - 340 - 192 + 60;

    this.opponentMonster = settings.opponent;

    this.audio = this.service.resources.audios.find(audio => audio.getAttribute("src") === "audio/pkmn-fajt.mp3");
    this.audio.volume = 1;
    this.audio.currentTime = 0;
    this.audio.loop = true;
    this.audio.play();

    console.log(this.audio);

    this.conversation = new Conversation(service, {
        backgroundSrc: "img/conversation/background_battle.png",
        hidden: true,
        nextable: false
    });

    this.flashTile = this.service.resources.getTile("flash", 0, 0, 1024, 768);
    this.flashTile.alpha = 0;

    this.backgroundTile = this.service.resources.getTile("battleBgForestEve", 0, 0, 1024, 768);
    this.backgroundTile.alpha = 0;

    this.playerbaseTile = this.service.resources.getTile("battlePlayerbase", 1024, 768 - 192 - 64, 512, 64);

    this.playerTile = this.service.resources.getTile("battlePlayer", 1024 + 170, 768 - 192 - 230, 230, 230);

    this.playerMonsterTile = this.playerMonster.tileBack;
    this.playerMonsterTile.alpha = 0;

    this.opponentMonsterTile = this.opponentMonster.tileFront;
    this.opponentMonsterTile.renderX = 0 - 256 - this.opponentMonsterTile.renderWidth/2;
    // this.opponentMonster.tileFront.renderY = 80;

    this.opponentbaseTile = this.service.resources.getTile("battleOpponentbase", -512, 200, 512, 256);

    this.ballTile = this.service.resources.getTile("battleBall", 0, 410, 48, 48);
    this.ballTile.alpha = 0;

    this.bottombarTile = this.service.resources.getTile("battleBottombar", 0, 768 - 192, 1028, 192);
    this.bottombarTile.alpha = 0;

    this.fightbtnTile = this.service.resources.getTile("battleFightbtn", 514, 768 - 192 + 10, 256, 92);
    this.fightbtnTile.alpha = 0;
    
    this.bagbtnTile = this.service.resources.getTile("battleBagbtn", 770, 768 - 192 + 10, 256, 92);
    this.bagbtnTile.alpha = 0;

    this.pokemonbtnTile = this.service.resources.getTile("battlePokemonbtn", 514, 768 - 192 + 92, 256, 92);
    this.pokemonbtnTile.alpha = 0;

    this.runbtnTile = this.service.resources.getTile("battleRunbtn", 770, 768 - 192 + 92, 256, 92);
    this.runbtnTile.alpha = 0;
}

Battle.prototype._playIntro1 = function() {
    if (this.tick >= 0 && this.tick < 5) {
        this.flashTile.alpha += 0.20;
    }
    if (this.tick >= 5 && this.tick < 10) {
        this.flashTile.alpha -= 0.20;
    }

    if (this.tick >= 10 && this.tick < 15) {
        this.flashTile.alpha += 0.20;
    }
    if (this.tick >= 15 && this.tick < 20) {
        this.flashTile.alpha -= 0.20;
    }

    if (this.tick >= 20 && this.tick < 25) {
        this.flashTile.alpha += 0.20;
    }
    if (this.tick >= 25 && this.tick < 30) {
        this.flashTile.alpha -= 0.20;
    }

    if (this.tick >= 30 && this.tick < 35) {
        this.flashTile.alpha += 0.20;
    }
    if (this.tick >= 35 && this.tick < 40) {
        this.flashTile.alpha -= 0.20;
    }

    if (this.tick >= 60 && this.tick < 70) {
        this.flashTile.alpha += 0.10;
    }

    // Transition is over -> set starting positions
    if (this.tick === 105) {
        this.backgroundTile.alpha = 1;

        this.bottombarTile.alpha = 1;

        this.conversation.hidden = false;

        this.fightbtnTile.alpha = 1;
        this.bagbtnTile.alpha = 1;
        this.pokemonbtnTile.alpha = 1;
        this.runbtnTile.alpha = 1;
    }

    if (this.tick > 105 && this.tick < 175) {
        this.playerTile.renderX -= 15;
        this.playerbaseTile.renderX -= 15;

        this.opponentMonsterTile.renderX += 15;
        this.opponentbaseTile.renderX += 15;
    }

    if (this.tick === 180) {
        this.opponentMonsterTile.pause = false;
        this.opponentMonster.cry.play();

        this.conversation.addText("A wild " + this.opponentMonster.name + " appeared!+");
        this.conversation.nextable = true;
        this.conversation.next();
        this.conversation.addCallable(function() {
            this.tick = -1;
            this.state = "intro2";
            this.conversation.addText("Go " + this.playerMonster.name + "!+");
            this.conversation.nextable = false;
        }.bind(this));
    }
}

Battle.prototype._playIntro2 = function() {
    if (this.tick === 0) {
        this.playerTile.pause = false;
    }

    if (this.tick > 0 && this.tick < 40) {
        this.playerTile.renderX -= 15;
    }

    if (this.tick === 10) {
        this.ballTile.renderX = 150;
    }

    if (this.tick > 10 && this.tick < 40) {
        this.ballTile.alpha = 1;
        this.ballTile.renderX += 5;
        this.ballTile.renderY += 2;
    }

    if (this.tick === 40) {
        this.playerMonsterTile.alpha = 1;
        this.playerMonsterTile.pause = false;
        this.playerMonster.cry.play();

        this.ballTile.alpha = 0;
    }

    if (this.tick === 60) {
        this.conversation.nextable = true;
        this.conversation.addText("What will+" + this.playerMonster.name + " do?");
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
    }.bind(this);

    this.fightbtnTile.setFrame(0);
    this.bagbtnTile.setFrame(0);
    this.pokemonbtnTile.setFrame(0);
    this.runbtnTile.setFrame(0);

    if (isInsideBox(this.fightbtnTile.renderX, this.fightbtnTile.renderY, this.fightbtnTile.renderX + this.fightbtnTile.renderWidth, this.fightbtnTile.renderY + this.fightbtnTile.renderHeight)) {
        this.fightbtnTile.setFrame(1);

        if (this.service.listeners.click === true) {
            this.state = "choosefight";

            this.conversation.addText("haha+hahaha");
            this.conversation.nextable = true;
            this.conversation.next();
            this.conversation.nextable = false;
        }
    }

    if (isInsideBox(this.bagbtnTile.renderX, this.bagbtnTile.renderY, this.bagbtnTile.renderX + this.bagbtnTile.renderWidth, this.bagbtnTile.renderY + this.bagbtnTile.renderHeight)) {
        this.bagbtnTile.setFrame(1);

        if (this.service.listeners.click === true) {
            console.log("bag");
        }
    }

    if (isInsideBox(this.pokemonbtnTile.renderX, this.pokemonbtnTile.renderY, this.pokemonbtnTile.renderX + this.pokemonbtnTile.renderWidth, this.pokemonbtnTile.renderY + this.pokemonbtnTile.renderHeight)) {
        this.pokemonbtnTile.setFrame(1);

        if (this.service.listeners.click === true) {
            console.log("pokemon");
        }
    }

    if (isInsideBox(this.runbtnTile.renderX, this.runbtnTile.renderY, this.runbtnTile.renderX + this.runbtnTile.renderWidth, this.runbtnTile.renderY + this.runbtnTile.renderHeight)) {
        this.runbtnTile.setFrame(1);

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

    /** 
     * Play a state mby... ?
     */
    if (this.state === "intro1") {
        this._playIntro1();
    }

    if (this.state === "intro2") {
        this._playIntro2();

        this.ballTile.update();
    }

    if (this.state === "choose") {
        this._chooseMouseEvents();
    }

    if (this.state === "choosefight") {
        this._chooseFightMouseEvents();
    }

    if (this.state === "chooserun") {
        this.service.battleCanvas.style.zIndex = 0;
        this.service.worldCanvas.style.zIndex = 1;
        
        this.audio.pause();

        this.service.map.audio.volume = 0;
        this.service.playAudio(this.service.map.audio);

        this.service.state = "world";
    }

    this.playerMonsterTile.update();

    this.playerTile.update();

    this.opponentMonsterTile.update();

    this.conversation.update();

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

    this.flashTile.render(context);

    this.backgroundTile.render(context);

    this.opponentbaseTile.render(context);

    this.opponentMonsterTile.render(context);

    this.playerbaseTile.render(context);

    this.playerMonsterTile.render(context);

    this.playerTile.render(context);

    this.ballTile.render(context);

    this.bottombarTile.render(context);

    this.conversation.render(context);

    if (this.state === "choose") {
        this.fightbtnTile.render(context);
        
        this.bagbtnTile.render(context);

        this.pokemonbtnTile.render(context);
        
        this.runbtnTile.render(context);
    }
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
