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

    this.conversation = new Conversation(this.service, {
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

    this.choosebgTile = this.service.resources.getTile("battleChoosebg", 554, 768 - 192 + 5, 474, 192 - 10);
    this.choosebgTile.alpha = 0;

    this.fightbtnTile = this.service.resources.getTile("battleFightbtn", 590, 768 - 192 + 31, 200, 65);
    this.fightbtnTile.alpha = 0;

    this.bagbtnTile = this.service.resources.getTile("battleBagbtn", 790, 768 - 192 + 31, 200, 65);
    this.bagbtnTile.alpha = 0;

    this.pokemonbtnTile = this.service.resources.getTile("battlePokemonbtn", 590, 768 - 192 + 65 + 31, 200, 65);
    this.pokemonbtnTile.alpha = 0;

    this.runbtnTile = this.service.resources.getTile("battleRunbtn", 790, 768 - 192 + 65 + 31, 200, 65);
    this.runbtnTile.alpha = 0;

    this.attack1Tile = this.service.resources.getTile("battleAttackbtn", 10, 768 - 192 + 10, 338, 76);
    this.attack1Tile.alpha = 0;

    this.attack2Tile = this.service.resources.getTile("battleAttackbtn", 338 + 20, 768 - 192 + 10, 338, 76);
    this.attack2Tile.alpha = 0;

    this.attack3Tile = this.service.resources.getTile("battleAttackbtn", 10, 768 - 96 + 10, 338, 76);
    this.attack3Tile.alpha = 0;

    this.attack4Tile = this.service.resources.getTile("battleAttackbtn", 338 + 20, 768 - 96 + 10, 338, 76);
    this.attack4Tile.alpha = 0;
}

Battle.prototype._scenarioIntro1 = function(tick) {
    // Transition!
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

        this.bottombarTile.alpha = 1;

        this.conversation.hidden = false;
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

        this.service.ScenarioManager.removeScenario(this._scenarioIntro1);
    }
}

Battle.prototype._scenarioIntro2 = function(tick) {
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
            this.state = "choose";
        }.bind(this));

        this.service.ScenarioManager.removeScenario(this._scenarioIntro2);
    }
}

Battle.prototype._scenarioPlayerMonsterAttack = function(tick) {
    // 
    if (tick > 0 && tick < 8) {
        this.playerMonsterTile.renderX += 40;
        this.playerMonsterTile.renderY -= 20;
    }
    if (tick > 8 && tick < 16) {
        this.playerMonsterTile.renderX -= 40;
        this.playerMonsterTile.renderY += 20;
    }

    // Opponent blink
    if (tick === 8) {
        this.opponentMonsterTile.alpha = 0;
    }
    if (tick === 10) {
        this.opponentMonsterTile.alpha = 1;
    }
    if (tick === 12) {
        this.opponentMonsterTile.alpha = 0;
    }
    if (tick === 14) {
        this.opponentMonsterTile.alpha = 1;
    }

    // Exit scenario
    if (tick === 18) {
        this.service.ScenarioManager.removeScenario(this._scenarioPlayerMonsterAttack);
    }
}

Battle.prototype._normalState = function() {
    this.fightbtnTile.setFrame(0);
    this.bagbtnTile.setFrame(0);
    this.pokemonbtnTile.setFrame(0);
    this.runbtnTile.setFrame(0);

    this.choosebgTile.alpha = 0;
    this.fightbtnTile.alpha = 0;
    this.bagbtnTile.alpha = 0;
    this.pokemonbtnTile.alpha = 0;
    this.runbtnTile.alpha = 0;

    this.attack1Tile.setFrame(0);
    this.attack2Tile.setFrame(0);
    this.attack3Tile.setFrame(0);
    this.attack4Tile.setFrame(0);

    this.attack1Tile.alpha = 0;
    this.attack2Tile.alpha = 0;
    this.attack3Tile.alpha = 0;
    this.attack4Tile.alpha = 0;
}

Battle.prototype._choose = function() {
    this.choosebgTile.alpha = 1;
    this.fightbtnTile.alpha = 1;
    this.bagbtnTile.alpha = 1;
    this.pokemonbtnTile.alpha = 1;
    this.runbtnTile.alpha = 1;

    if (this.fightbtnTile.pointerInside()) {
        this.fightbtnTile.setFrame(1);

        if (this.service.listeners.click) {
            this.state = "chooseattack";
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
            this.state = "chooserun";
        }
    }
}

Battle.prototype._chooseAttack = function() {
    this.attack1Tile.alpha = 1;
    this.attack2Tile.alpha = 1;
    this.attack3Tile.alpha = 1;
    this.attack4Tile.alpha = 1;

    if (this.attack1Tile.pointerInside()) {
        this.attack1Tile.setFrame(1);

        if (this.service.listeners.click) {
            console.log("attack1!");
            this.service.ScenarioManager.addScenario(this._scenarioPlayerMonsterAttack.bind(this));
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

            this.state = "choose";
        }
    }
}

Battle.prototype.update = function() {
    this.tick += 1;

    this._normalState();

    if (this.tick === 1) {
        this.service.ScenarioManager.addScenario(this._scenarioIntro1.bind(this));
    }

    if (this.tick === 182) {
        this.conversation.enqueue("Go! " + this.playerMonster.name + "!+", function() {
            this.service.ScenarioManager.addScenario(this._scenarioIntro2.bind(this));
        }.bind(this));
    }

    if (this.state === "choose") {
        this._choose();
    }

    if (this.state === "chooseattack") {
        this._chooseAttack();
    }

    if (this.state === "chooserun") {
        this.service.events.push(function() {
            this.service.battleCanvas.style.zIndex = 0;
            this.service.worldCanvas.style.zIndex = 1;

            this.service.battle.audio.pause();

            this.service.map.audio.volume = 0;
            this.service.playAudio(this.service.map.audio);

            this.service.state = "world";
        });
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

    this.bottombarTile.render(context);

    this.conversation.render(context);

    this.choosebgTile.render(context);

    this.fightbtnTile.render(context);
    
    this.bagbtnTile.render(context);

    this.pokemonbtnTile.render(context);
    
    this.runbtnTile.render(context);

    this.attack1Tile.render(context);

    this.attack2Tile.render(context);

    this.attack3Tile.render(context);

    this.attack4Tile.render(context);
}

module.exports = Battle;
