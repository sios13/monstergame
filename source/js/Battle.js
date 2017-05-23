const Tile = require("./Tile.js");
const Conversation = require("./Conversation.js");

function Battle(service, settings) {
    this.service = service;
    this.tick = 0;

    this.state = "";

    this.playerMonster = this.service.resources.monsters.find( monster => monster.name === this.service.save.monsters[0].name );
    this.playerMonster.tileBack.renderX = 86;
    this.playerMonster.tileBack.renderY = 768 - 340 - 192 + 60;

    this.opponentMonster = settings.opponent;

    this.audio = this.service.resources.audios.find(audio => audio.getAttribute("src") === "audio/pkmn-fajt.mp3");
    this.audio.volume = 1;
    this.audio.currentTime = 0;
    this.audio.loop = true;
    this.audio.play();

    this.conversation = new Conversation(this.service, {state: "battle"});

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

    this.messagebgTile = this.service.resources.getTile("battleMessagebg", 0, 768 - 192, 1028, 192);
    this.messagebgTile.alpha = 0;

    this.comandbgTile = this.service.resources.getTile("battleCommandbg", 0, 768 - 192, 1028, 192);
    this.comandbgTile.alpha = 0;

    this.fightbgTile = this.service.resources.getTile("battleFightbg", 0, 768 - 192, 1028, 192);
    this.fightbgTile.alpha = 0;

    this.fightbtnTile = this.service.resources.getTile("battleCommandBtns(0,0)", 514, 768 - 192 + 12, 252, 88);
    this.fightbtnTile.alpha = 0;

    this.bagbtnTile = this.service.resources.getTile("battleCommandBtns(0,2)", 766, 768 - 192 + 12, 252, 88);
    this.bagbtnTile.alpha = 0;

    this.pokemonbtnTile = this.service.resources.getTile("battleCommandBtns(0,1)", 514, 768 - 192 + 88 + 12, 252, 88);
    this.pokemonbtnTile.alpha = 0;

    this.runbtnTile = this.service.resources.getTile("battleCommandBtns(0,3)", 766, 768 - 192 + 88 + 12, 252, 88);
    this.runbtnTile.alpha = 0;

    this.attack1Tile = this.service.resources.getTile("battleFightBtns(0,0)", 8, 768 - 192 + 12, 382, 88);
    this.attack1Tile.alpha = 0;

    this.attack2Tile = this.service.resources.getTile("battleFightBtns(0,1)", 8 + 382, 768 - 192 + 12, 382, 88);
    this.attack2Tile.alpha = 0;

    this.attack3Tile = this.service.resources.getTile("battleFightBtns(0,2)", 8, 768 - 192 + 12 + 88, 382, 88);
    this.attack3Tile.alpha = 0;

    this.attack4Tile = this.service.resources.getTile("battleFightBtns(0,3)", 8 + 382, 768 - 192 + 12 + 88, 382, 88);
    this.attack4Tile.alpha = 0;

    this.attackBackTile = this.service.resources.getTile("battleBackBtn", 778, 768 - 192 + 12, 240, 175);
    this.attackBackTile.alpha = 0;
}

Battle.prototype._scenarioBattleIntroPart1 = function(tick) {
    // Transition!
    if (tick > 180) {return;}

    if (tick >= 0 && tick < 5) {
        this.flashTile.alpha += 0.20;
    }
    if (tick >= 5 && tick < 10) {
        this.flashTile.alpha -= 0.20;
    }

    if (tick >= 10 && tick < 15) {
        this.flashTile.alpha += 0.20;
    }
    if (tick >= 15 && tick < 20) {
        this.flashTile.alpha -= 0.20;
    }

    if (tick >= 20 && tick < 25) {
        this.flashTile.alpha += 0.20;
    }
    if (tick >= 25 && tick < 30) {
        this.flashTile.alpha -= 0.20;
    }

    if (tick >= 30 && tick < 35) {
        this.flashTile.alpha += 0.20;
    }
    if (tick >= 35 && tick < 40) {
        this.flashTile.alpha -= 0.20;
    }
    if (tick >= 60 && tick < 70) {
        this.flashTile.alpha += 0.10;
    }

    // Transition is over -> set starting positions
    if (tick === 105) {
        this.backgroundTile.alpha = 1;

        this.messagebgTile.alpha = 1;
    }

    if (tick > 105 && tick < 175) {
        this.playerTile.renderX -= 15;
        this.playerbaseTile.renderX -= 15;

        this.opponentMonsterTile.renderX += 15;
        this.opponentbaseTile.renderX += 15;
    }

    if (tick === 180) {
        this.opponentMonsterTile.pause = false;
        this.opponentMonster.cry.play();

        this.conversation.enqueue("Wild " + this.opponentMonster.name + " appeared!+", undefined);
        this.conversation.next();

        this.service.ScenarioManager.removeScenario(this._scenarioBattleIntroPart1);
    }
}

Battle.prototype._scenarioBattleIntroPart2 = function(tick) {
    if (tick > 60) {return;}

    if (tick === 0) {
        this.playerTile.pause = false;
    }

    if (tick > 0 && tick < 40) {
        this.playerTile.renderX -= 15;
    }

    if (tick === 10) {
        this.ballTile.renderX = 150;
    }

    if (tick > 10 && tick < 40) {
        this.ballTile.alpha = 1;
        this.ballTile.renderX += 5;
        this.ballTile.renderY += 2;
    }

    if (tick === 40) {
        this.playerMonsterTile.alpha = 1;
        this.playerMonsterTile.pause = false;
        this.playerMonster.cry.play();

        this.ballTile.alpha = 0;
    }

    if (tick === 60) {
        this.conversation.enqueue("What will+" + this.playerMonster.name + " do?", function() {
            this.state = "command";
        }.bind(this));

        this.service.ScenarioManager.removeScenario(this._scenarioBattleIntroPart2);
    }
}

Battle.prototype._scenarioPlayerMonsterTackle = function(tick) {
    if (tick > 60) {return;}

    // 
    if (tick > 30 && tick < 38) {
        this.playerMonsterTile.renderX += 40;
        this.playerMonsterTile.renderY -= 20;
    }
    if (tick > 38 && tick < 46) {
        this.playerMonsterTile.renderX -= 40;
        this.playerMonsterTile.renderY += 20;
    }

    // Opponent blink
    if (tick === 38) {
        this.opponentMonsterTile.alpha = 0;
    }
    if (tick === 40) {
        this.opponentMonsterTile.alpha = 1;
    }
    if (tick === 42) {
        this.opponentMonsterTile.alpha = 0;
    }
    if (tick === 44) {
        this.opponentMonsterTile.alpha = 1;
    }

    // Exit scenario
    if (tick === 60) {
        this.service.ScenarioManager.removeScenario(this._scenarioPlayerMonsterTackle);

        this.conversation.enqueue(this.opponentMonster.name + " used+TACKLE!", function() {
            this.service.ScenarioManager.addScenario(this._scenarioOpponentMonsterTackle.bind(this));
        }.bind(this));
    }
}

Battle.prototype._scenarioOpponentMonsterTackle = function(tick) {
    if (tick > 60) {return;}

    // 
    if (tick > 30 && tick < 38) {
        this.opponentMonsterTile.renderX -= 40;
        this.opponentMonsterTile.renderY += 20;
    }
    if (tick > 38 && tick < 46) {
        this.opponentMonsterTile.renderX += 40;
        this.opponentMonsterTile.renderY -= 20;
    }

    // Opponent blink
    if (tick === 38) {
        this.playerMonsterTile.alpha = 0;
    }
    if (tick === 40) {
        this.playerMonsterTile.alpha = 1;
    }
    if (tick === 42) {
        this.playerMonsterTile.alpha = 0;
    }
    if (tick === 44) {
        this.playerMonsterTile.alpha = 1;
    }

    // Exit scenario
    if (tick === 60) {
        this.conversation.enqueue("What will+" + this.playerMonster.name + " do?", function() {
            this.state = "command";
        }.bind(this));

        this.service.ScenarioManager.removeScenario(this._scenarioOpponentMonsterTackle);
    }
}

Battle.prototype._baseState = function() {
    this.fightbtnTile.setFrame(0);
    this.bagbtnTile.setFrame(0);
    this.pokemonbtnTile.setFrame(0);
    this.runbtnTile.setFrame(0);

    this.comandbgTile.alpha = 0;
    this.fightbtnTile.alpha = 0;
    this.bagbtnTile.alpha = 0;
    this.pokemonbtnTile.alpha = 0;
    this.runbtnTile.alpha = 0;

    this.attack1Tile.setFrame(0);
    this.attack2Tile.setFrame(0);
    this.attack3Tile.setFrame(0);
    this.attack4Tile.setFrame(0);

    this.fightbgTile.alpha = 0;
    this.attack1Tile.alpha = 0;
    this.attack2Tile.alpha = 0;
    this.attack3Tile.alpha = 0;
    this.attack4Tile.alpha = 0;
    this.attackBackTile.alpha = 0;
}

Battle.prototype._commandState = function() {
    this.comandbgTile.alpha = 1;
    this.fightbtnTile.alpha = 1;
    this.bagbtnTile.alpha = 1;
    this.pokemonbtnTile.alpha = 1;
    this.runbtnTile.alpha = 1;

    if (this.fightbtnTile.pointerInside()) {
        this.fightbtnTile.setFrame(1);

        if (this.service.listeners.click) {
            this.service.events.push(function() {
                this.service.battle.state = "fight";
            });
        }
    }

    if (this.bagbtnTile.pointerInside()) {
        this.bagbtnTile.setFrame(1);

        if (this.service.listeners.click === true) {
            console.log("bag");
        }
    }

    if (this.pokemonbtnTile.pointerInside()) {
        this.pokemonbtnTile.setFrame(1);

        if (this.service.listeners.click === true) {
            console.log("pokemon");
        }
    }

    if (this.runbtnTile.pointerInside()) {
        this.runbtnTile.setFrame(1);

        if (this.service.listeners.click === true) {
            this.service.events.push(function() {
            this.service.battleCanvas.style.zIndex = 0;
            this.service.worldCanvas.style.zIndex = 1;

            this.service.battle.audio.pause();

            this.service.map.audio.volume = 0;
            this.service.playAudio(this.service.map.audio);

            this.service.state = "world";
        });
        }
    }
}

Battle.prototype._fightState = function() {
    this.fightbgTile.alpha = 1;
    this.attack1Tile.alpha = 1;
    this.attack2Tile.alpha = 1;
    this.attack3Tile.alpha = 1;
    this.attack4Tile.alpha = 1;
    this.attackBackTile.alpha = 1;

    if (this.attack1Tile.pointerInside()) {
        this.attack1Tile.setFrame(1);

        if (this.service.listeners.click) {
            console.log("attack1!");
            this.state = "";
            this.conversation.enqueue(this.playerMonster.name + " used+TACKLE!", function() {
                this.service.ScenarioManager.addScenario(this._scenarioPlayerMonsterTackle.bind(this));
            }.bind(this));
            // this.conversation.next();
        }
    }

    if (this.attack2Tile.pointerInside()) {
        this.attack2Tile.setFrame(1);

        if (this.service.listeners.click) {
            console.log("attack2!");
        }
    }

    if (this.attack3Tile.pointerInside()) {
        this.attack3Tile.setFrame(1);

        if (this.service.listeners.click) {
            console.log("attack3!");
        }
    }

    if (this.attack4Tile.pointerInside()) {
        this.attack4Tile.setFrame(1);

        if (this.service.listeners.click) {
            console.log("attack4!");
        }
    }

    if (this.attackBackTile.pointerInside()) {
        if (this.service.listeners.click) {
            this.state = "command";
        }
    }
}

Battle.prototype._attackState = function() {
    this.service.ScenarioManager.addScenario(this._scenarioPlayerMonsterTackle.bind(this));
}

Battle.prototype.update = function() {
    this.tick += 1;

    this._baseState();

    if (this.tick === 1) {
        this.service.ScenarioManager.addScenario(this._scenarioBattleIntroPart1.bind(this));
    }

    if (this.tick === 182) {
        this.conversation.enqueue("Go! " + this.playerMonster.name + "!+", function() {
            this.service.ScenarioManager.addScenario(this._scenarioBattleIntroPart2.bind(this));
        }.bind(this));
    }

    if (this.state === "command") {
        this._commandState();
    }

    if (this.state === "fight") {
        this._fightState();
    }

    if (this.state === "attack") {
        this._attackState();
    }

    /**
     * Update tiles
     */
    this.ballTile.update();

    this.playerMonsterTile.update();

    this.playerTile.update();

    this.opponentMonsterTile.update();

    this.conversation.update();
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

    this.messagebgTile.render(context);

    this.comandbgTile.render(context);

    this.fightbgTile.render(context);

    this.conversation.render(context);

    if (this.state === "command") {
        this.fightbtnTile.render(context);
        
        this.bagbtnTile.render(context);

        this.pokemonbtnTile.render(context);
        
        this.runbtnTile.render(context);
    }

    if (this.state === "fight") {
        this.attack1Tile.render(context);

        this.attack2Tile.render(context);

        this.attack3Tile.render(context);

        this.attack4Tile.render(context);

        this.attackBackTile.render(context);
    }
}

module.exports = Battle;
