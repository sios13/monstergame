(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const Tile = require("./Tile.js");
const Conversation = require("./Conversation.js");

function Battle(service, settings) {
    this.service = service;

    this.tick = 0;

    this.state = "";

    this.type = settings.type;

    let index = 0;
    for (let i = 0; i < this.service.resources.monsters.length; i++) {
        if (this.service.resources.monsters[i].name === this.service.save.monsters[0].name) {
            index = i;
            break;
        }
    }
    this.playerMonster = this.service.resources.getMonster(index);
    this.playerMonster.strength = 7;

    // Read from save file
    this.playerMonster.level = this.service.save.monsters[0].level;
    this.playerMonster.baseHP = this.playerMonster.maxHP;
    for (let i = 0; i < this.playerMonster.level - 1; i++) {
        this.playerMonster.maxHP += 1 + 0.10 * this.playerMonster.baseHP;
    }
    this.playerMonster.maxHP = Math.floor(this.playerMonster.maxHP);
    this.playerMonster.HP = this.service.save.monsters[0].HP ? this.service.save.monsters[0].HP : this.playerMonster.maxHP;

    this.playerMonster.tileBack.renderX = 86;
    this.playerMonster.tileBack.renderY = 768 - 340 - 192 + 60;

    this.opponentMonster = settings.opponent;
    this.opponentMonster.level = settings.opponentLevel;
    this.opponentMonster.baseHP = this.opponentMonster.maxHP;
    for (let i = 0; i < this.opponentMonster.level - 1; i++) {
        this.opponentMonster.maxHP += 1 + 0.10 * this.opponentMonster.baseHP;
    }
    this.opponentMonster.maxHP = Math.floor(this.opponentMonster.maxHP);
    this.opponentMonster.HP = this.opponentMonster.maxHP;

    this.audio = this.service.resources.audios.find(audio => audio.getAttribute("src") === "audio/pkmn-fajt.mp3");
    this.audio.volume = 1;
    this.audio.currentTime = 0;
    this.audio.loop = true;
    this.audio.play();

    this.conversation = new Conversation(this.service, {state: "battle"});

    this.flashTile = this.service.resources.getTile("flash", 0, 0, 1024, 768);
    this.flashTile.alpha = 0;

    this.backgroundTile = this.service.resources.getTile("battleBgField", 0, 0, 1024, 768);
    this.backgroundTile.alpha = 0;

    this.playerbaseTile = this.service.resources.getTile("battlePlayerbaseField", 1024, 768 - 192 - 64, 512, 64);

    this.playerTile = this.service.resources.getTile("battlePlayer", 1024 + 170, 768 - 192 - 230, 230, 230);

    this.playerMonsterTile = this.playerMonster.tileBack;
    this.playerMonsterTile.alpha = 0;

    this.playerBoxTile = this.service.resources.getTile("battlePlayerBox", 1024 - 393 - 70, 430, 393, 93);
    this.playerBoxTile.alpha = 0;

    this.opponentbaseTile = this.service.resources.getTile("battleOpponentbaseField", -512, 200, 512, 256);

    this.opponentMonsterTile = this.opponentMonster.tileFront;
    this.opponentMonsterTile.renderX = 0 - 256 - this.opponentMonsterTile.renderWidth/2;

    this.opponentBoxTile = this.service.resources.getTile("battleOpponentBox", 70, 100, 393, 93);
    this.opponentBoxTile.alpha = 0;

    this.ballTile = this.service.resources.getTile("battleBall", 0, 410, 48, 48);
    this.ballTile.alpha = 0;

    this.messagebgTile = this.service.resources.getTile("battleMessagebg", 0, 768 - 192, 1024, 192);
    this.messagebgTile.alpha = 0;

    this.comandbgTile = this.service.resources.getTile("battleCommandbg", 0, 768 - 192, 1024, 192);
    this.comandbgTile.alpha = 0;

    this.fightbgTile = this.service.resources.getTile("battleFightbg", 0, 768 - 192, 1024, 192);
    this.fightbgTile.alpha = 0;

    this.fightbtnTile = this.service.resources.getTile("battleCommandBtns(0,0)", 512, 768 - 192 + 12, 252, 88);
    this.fightbtnTile.alpha = 0;

    this.bagbtnTile = this.service.resources.getTile("battleCommandBtns(0,2)", 766, 768 - 192 + 12, 252, 88);
    this.bagbtnTile.alpha = 0;

    this.pokemonbtnTile = this.service.resources.getTile("battleCommandBtns(0,1)", 512, 768 - 192 + 88 + 12, 252, 88);
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

        this.opponentBoxTile.alpha = 1;

        if (this.type === "snorlax") {
            this.conversation.enqueue("Snorlax is+blocking the road...", undefined);
            this.conversation.enqueue("Kill him!!+", undefined);
        } else {
            this.conversation.enqueue("Wild " + this.opponentMonster.name + " appeared!+", undefined);
        }
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
        // Play open pokeball sound
        this.service.resources.audios.find(audio => audio.getAttribute("src") === "audio/OpenPokeball.wav").play();

        this.playerMonsterTile.alpha = 1;
        this.playerMonsterTile.pause = false;

        // Player monster cry!
        this.playerMonster.cry.play();

        this.playerBoxTile.alpha = 1;

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

    // Damage!
    if (tick === 38) {
        this.opponentMonster.HP -= Math.floor(this.playerMonster.strength * Math.pow(1.15, this.playerMonster.level-1));

        if (this.opponentMonster.HP < 0) {this.opponentMonster.HP = 0;}

        // Play damage sound!
        this.service.resources.audios.find(audio => audio.getAttribute("src") === "audio/normaldamage.wav").play();
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
        if (this.opponentMonster.HP > 0) {
            this.conversation.enqueue("Enemy " + this.opponentMonster.name + "+used TACKLE!", function() {
                this.service.ScenarioManager.addScenario(this._scenarioOpponentMonsterTackle.bind(this));
            }.bind(this));
        } else {
            this.conversation.enqueue("Enemy " + this.opponentMonster.name + "+fainted!", function() {
                this.service.ScenarioManager.addScenario(this._scenarioOpponentMonsterFaint.bind(this));
            }.bind(this));
        }

        this.service.ScenarioManager.removeScenario(this._scenarioPlayerMonsterTackle);
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

    // Damage!
    if (tick === 38) {
        this.playerMonster.HP -= Math.floor(this.opponentMonster.strength * Math.pow(1.15, this.opponentMonster.level-1));

        if (this.playerMonster.HP < 0) {this.playerMonster.HP = 0;}

        // Play damage sound!
        this.service.resources.audios.find(audio => audio.getAttribute("src") === "audio/normaldamage.wav").play();
    }

    // Blink!
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
        if (this.playerMonster.HP > 0) {
            this.conversation.enqueue("What will+" + this.playerMonster.name + " do?", function() {
                this.state = "command";
            }.bind(this));
        } else {
            this.conversation.enqueue(this.playerMonster.name + "+fainted!", function() {
                this.service.ScenarioManager.addScenario(this._scenarioPlayerMonsterFaint.bind(this));
            }.bind(this));
        }

        this.service.ScenarioManager.removeScenario(this._scenarioOpponentMonsterTackle);
    }
}

Battle.prototype._scenarioPlayerMonsterHeal = function(tick) {
    if (tick === 1) {
        this.playerMonster.HP = Math.floor(this.playerMonster.HP + this.playerMonster.maxHP * 0.7);

        if (this.playerMonster.HP > this.playerMonster.maxHP) {
            this.playerMonster.HP = this.playerMonster.maxHP;
        }

        this.service.resources.audios.find(audio => audio.getAttribute("src") === "audio/Refresh.mp3").play();
    }

    if (tick === 40) {
        this.conversation.enqueue("Enemy " + this.opponentMonster.name + "+used TACKLE!", function() {
            this.service.ScenarioManager.addScenario(this._scenarioOpponentMonsterTackle.bind(this));
        }.bind(this));

        this.service.ScenarioManager.removeScenario(this._scenarioPlayerMonsterHeal);
    }
}

Battle.prototype._scenarioPlayerMonsterFaint = function(tick) {
    if (tick > 30) {return;}

    if (tick === 1) {
        this.service.resources.audios.find(audio => audio.getAttribute("src") === "audio/faint.wav").play();
    }

    if (tick > 0 && tick < 20) {
        this.playerMonsterTile.renderY += 10;
        this.playerMonsterTile.tileHeight -= 10;
    }

    if (tick === 30) {
        // Game over :(
        this.service.save.monsters[0].level = 1;
        this.service.save.monsters[0].maxHP = null;
        this.service.save.monsters[0].HP = null;

        this.playerMonster.level = 1;
        this.conversation.enqueue("Game over! :'(+" + this.playerMonster.name + " is now lvl " + this.service.save.monsters[0].level + ".", undefined);
        this.conversation.enqueue("", function() {
            this.service.setState("world");
        }.bind(this));

        this.service.ScenarioManager.removeScenario(this._scenarioPlayerMonsterFaint);
    }
}

Battle.prototype._scenarioOpponentMonsterFaint = function(tick) {
    if (tick > 30) {return;}

    if (tick === 1) {
        this.service.resources.audios.find(audio => audio.getAttribute("src") === "audio/faint.wav").play();
    }

    if (tick > 0 && tick < 20) {
        this.opponentMonsterTile.renderY += 10;
        this.opponentMonsterTile.tileHeight -= 10;
    }

    if (tick === 30) {
        if (this.playerMonster.level - this.opponentMonster.level < 1) {
            this.conversation.enqueue(this.playerMonster.name + " reached lvl " + (this.playerMonster.level + 1) + "!+Yaaaaaaaay!", function() {
                // Play new level sound!
                this.service.resources.audios.find(audio => audio.getAttribute("src") === "audio/expfull.wav").play();

                // Update player monster (for visual)
                this.playerMonster.level += 1;
                this.playerMonster.HP += Math.floor(1 + 0.10 * this.playerMonster.baseHP);
                this.playerMonster.maxHP += Math.floor(1 + 0.10 * this.playerMonster.baseHP);

                // Update save file according to player monster
                this.service.save.monsters[0].level = this.playerMonster.level;
                this.service.save.monsters[0].HP = this.playerMonster.HP;
                this.service.save.monsters[0].maxHP = this.playerMonster.maxHP;
            }.bind(this));
        } else {
            this.conversation.enqueue("No experience gained! :(+", undefined);
        }

        if (this.type === "snorlax") {
            this.service.save.snorlaxDefeated = true;

            // Move snorlax
            let snorlaxTile = this.service.map.tiles[this.service.map.tiles.length-1];
            snorlaxTile.renderX = 42*32;
            snorlaxTile.renderY = 26*32;
            snorlaxTile.renderWidth = 32;
            snorlaxTile.renderHeight = 32;

            // Remove snorlax battle events
            this.service.map.collisionMap[32][50] = function() {this.service.coolguy.setState("walking")};
            this.service.map.collisionMap[33][50] = function() {this.service.coolguy.setState("walking")};

            this.conversation.enqueue("Contragutaltions!+Snorlax has been defeated!", undefined);
            this.conversation.enqueue("Thanks for playing :)+", undefined);
        }

        this.conversation.enqueue("", function() {
            this.service.setState("world");
        }.bind(this));

        this.service.ScenarioManager.removeScenario(this._scenarioOpponentMonsterFaint);
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
            this.state = "";
            this.conversation.enqueue("You do not own a bag!+", undefined);
            this.conversation.enqueue("What will+" + this.playerMonster.name + " do?", function() {
                this.state = "command";
            }.bind(this));
        }
    }

    if (this.pokemonbtnTile.pointerInside()) {
        this.pokemonbtnTile.setFrame(1);

        if (this.service.listeners.click === true) {
            console.log("pokemon");
            this.state = "";
            this.conversation.enqueue("Your monster's name is:+" + this.playerMonster.name, undefined);
            this.conversation.enqueue("What will+" + this.playerMonster.name + " do?", function() {
                this.state = "command";
            }.bind(this));
        }
    }

    if (this.runbtnTile.pointerInside()) {
        this.runbtnTile.setFrame(1);

        if (this.service.listeners.click === true) {
            this.state = "";

            if (this.opponentMonster.level > this.playerMonster.level) {
                this.conversation.enqueue("Can not escape+from a higher level monster!", undefined);
                this.conversation.enqueue("What will+" + this.playerMonster.name + " do?", function() {
                    this.state = "command";
                }.bind(this));
            } else {
                this.conversation.enqueue("Got away safely!+", undefined);
                this.conversation.enqueue("", function() {
                    this.service.events.push(function() {
                        this.service.setState("world");
                    });
                }.bind(this));

                // Play flee sound!
                this.service.resources.audios.find(audio => audio.getAttribute("src") === "audio/Flee.wav").play();
            }
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
            this.conversation.enqueue(this.playerMonster.name + "+used TACKLE!", function() {
                this.service.ScenarioManager.addScenario(this._scenarioPlayerMonsterTackle.bind(this));
            }.bind(this));
            // this.conversation.next();
        }
    }

    if (this.attack2Tile.pointerInside()) {
        this.attack2Tile.setFrame(1);

        if (this.service.listeners.click) {
            this.state = "";
            this.conversation.enqueue(this.playerMonster.name + "+used HEAL!", function() {
                this.service.ScenarioManager.addScenario(this._scenarioPlayerMonsterHeal.bind(this));
            }.bind(this));
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

    this.opponentBoxTile.render(context);

    // If box is visible -> also display name, lvl, hp
    if (this.opponentBoxTile.alpha === 1) {
        context.save();

        context.font = "28px 'ConversationFont'";
        context.fillStyle = "rgba(0,0,0,0.8)";

        context.fillText(this.opponentMonster.name, 85, 148);
        context.font = "20px 'ConversationFont'";
        context.fillText("Lvl:" + this.opponentMonster.level, 85, 180);
        context.fillText(this.opponentMonster.HP + "/" + this.opponentMonster.maxHP, 270, 180);

        context.restore();
    }

    this.playerbaseTile.render(context);

    this.playerMonsterTile.render(context);

    this.playerTile.render(context);

    this.playerBoxTile.render(context);

    // If box is visible -> also display name, lvl, hp
    if (this.playerBoxTile.alpha === 1) {
        context.save();

        context.font = "28px 'ConversationFont'";
        context.fillStyle = "rgba(0,0,0,0.8)";

        context.fillText(this.playerMonster.name, this.playerBoxTile.renderX + 50, this.playerBoxTile.renderY + 48);
        context.font = "20px 'ConversationFont'";
        context.fillText("Lvl:" + this.playerMonster.level, this.playerBoxTile.renderX + 50, this.playerBoxTile.renderY + 80);
        context.fillText(this.playerMonster.HP + "/" + this.playerMonster.maxHP, this.playerBoxTile.renderX + 235, this.playerBoxTile.renderY + 80);

        context.restore();
    }

    this.ballTile.render(context);

    this.messagebgTile.render(context);

    this.comandbgTile.render(context);

    this.conversation.render(context);

    this.fightbgTile.render(context);

    if (this.state === "command") {
        this.fightbtnTile.render(context);
        
        this.bagbtnTile.render(context);

        this.pokemonbtnTile.render(context);
        
        this.runbtnTile.render(context);
    }

    if (this.state === "fight") {
        context.save();
        context.font = "28px 'ConversationFont'";
        context.fillStyle = "rgba(0,0,0,0.8)";

        this.attack1Tile.render(context);
        context.fillText("Tackle", this.attack1Tile.renderX + 60, this.attack1Tile.renderY + 55);

        this.attack2Tile.render(context);
        context.fillText("Heal", this.attack2Tile.renderX + 60, this.attack2Tile.renderY + 55);

        context.restore();

        // this.attack3Tile.render(context);

        // this.attack4Tile.render(context);

        this.attackBackTile.render(context);
    }
}

module.exports = Battle;

},{"./Conversation.js":2,"./Tile.js":10}],2:[function(require,module,exports){
const Tile = require("./Tile.js");

function Conversation(service, settings) {
    this.service = service;

    if (settings.state === "battle") {
        this.backgroundTile = this.service.resources.getTile("conversationBattleBg", 0, 768 - 192, 1024, 192);
    } else {
        this.backgroundTile = this.service.resources.getTile("conversationBg", 0, 768 - 192, 1024, 192);
    }

    this.arrowTile = this.service.resources.getTile("conversationArrow", 880, 768 - 192 + 50, 56, 80);
    this.arrowTile.alpha = 0;

    this.texts = ["+"];

    this.callables = [undefined];

    this.line1 = "";
    this.line2 = "";

    this.nextable = true;
}

/**
 * Add a text and callable to the conversation queue
 */
Conversation.prototype.enqueue = function(text, callable) {
    this.texts.push(text);

    this.callables.push(callable);
}

/**
 * Starts displaying the first text and callable in the queue
 */
Conversation.prototype.next = function() {
    // Remove the currently active
    this.texts.shift();
    this.callables.shift();

    // Call the callable
    if (this.callables[0] !== undefined) {
        this.callables[0]();
    }

    // Reset the lines
    this.line1 = "";
    this.line2 = "";
}

/**
 * Updates text 'animation' and determines if is typing
 */
Conversation.prototype._updateText = function() {
    let text = this.texts[0];

    if (text === undefined) {
        return;
    }

    // If the lines do not equal the currently active text -> add one new letter to a line
    if (this.line1 + "+" + this.line2 !== text) {
        // this.typing = true;

        // Determine what line to update
        let index = text.indexOf("+");

        if (text.substring(0, index) !== this.line1) {
            this.line1 += text[this.line1.length];
        } else {
            this.line2 += text[this.line1.length + this.line2.length + 1];
        }

        if (this.line1 + "+" + this.line2 !== text) {
            this.nextable = false;
        }
    }
}

Conversation.prototype.update = function() {
    this.nextable = true;

    this._updateText();

    // If there is no next -> make conversaiton not nextable
    if (this.texts[1] === undefined) {
        this.nextable = false;
    }

    this.arrowTile.update();

    if (this.nextable === true) {
        this.arrowTile.alpha = 1;
    } else {
        this.arrowTile.alpha = 0;
    }

    // If clicked at conversation bar
    if (this.nextable === true && this.service.listeners.click && this.backgroundTile.pointerInside()) {
        this.next();
    }
}

Conversation.prototype.render = function(context) {
    this.backgroundTile.render(context);

    this.arrowTile.render(context);

    context.save();

    context.font = "30px 'ConversationFont'";
    context.fillStyle = "rgba(0,0,0,0.7)";
    context.shadowColor = "rgba(0,0,0,0.2)";
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 3;
    context.shadowBlur = 3;

    context.fillText(this.line1, 70, 662);

    context.fillText(this.line2, 70, 717);

    context.restore();
}

module.exports = Conversation;

},{"./Tile.js":10}],3:[function(require,module,exports){
function Entity(service, settings) {
    this.service = service;

    this.x = 60*32;
    this.y = 72*32;

    this.collisionSquare = 20;

    this.speed = 4;

    this.direction = 3;

    this.state = "walking";

    this.col = Math.floor(this.x / 32);
    this.row = Math.floor(this.y / 32);

    this.speedX = 0;
    this.speedY = 0;

    this.stop = false;

    // left, up, right, down
    this.walkTiles = [
        this.service.resources.getTile("playerWalk(0,1)", 0, 0, 32, 48),
        this.service.resources.getTile("playerWalk(0,3)", 0, 0, 32, 48),
        this.service.resources.getTile("playerWalk(0,2)", 0, 0, 32, 48),
        this.service.resources.getTile("playerWalk(0,0)", 0, 0, 32, 48)
    ];
    this.grassTiles = [
        this.service.resources.getTile("playerGrass(0,1)", 0, 0, 32, 48),
        this.service.resources.getTile("playerGrass(0,3)", 0, 0, 32, 48),
        this.service.resources.getTile("playerGrass(0,2)", 0, 0, 32, 48),
        this.service.resources.getTile("playerGrass(0,0)", 0, 0, 32, 48)
    ];
    this.waterTiles = [
        this.service.resources.getTile("playerWater(0,1)", 0, 0, 64, 64),
        this.service.resources.getTile("playerWater(0,3)", 0, 0, 64, 64),
        this.service.resources.getTile("playerWater(0,2)", 0, 0, 64, 64),
        this.service.resources.getTile("playerWater(0,0)", 0, 0, 64, 64)
    ];

    this.activeTiles = this.walkTiles;

    this.activeTile = this.walkTiles[3];

    // Make sure collision square always is in center of entity!
    // Render width and render height should always be > collision square !!
    this.renderX = this.service.worldCanvas.width/2 - (this.activeTile.renderWidth - this.collisionSquare) / 2;
    this.renderY = this.service.worldCanvas.height/2 - (this.activeTile.renderHeight - this.collisionSquare);
    
    this.canvasX = 512; // x position on canvas
    this.canvasY = 384; // y position on canvas
}

Entity.prototype._setSpeed = function() {
    let deltaX = this.service.listeners.mousePositionX - (this.canvasX + this.collisionSquare / 2);
    let deltaY = this.service.listeners.mousePositionY - (this.canvasY + this.collisionSquare / 2);

    let distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

    this.speedX = deltaX/distance*this.speed;
    this.speedY = deltaY/distance*this.speed;
}

/**
 * Sets the direction
 * 0 = left, 1 = up, 2 = right, 3 = down
 */
Entity.prototype._setDirection = function() {
    let radians = Math.atan2(this.speedY, this.speedX);

    let degrees = radians * (180 / Math.PI);

    if (degrees < -135 || degrees > 135) {
        this.direction = 0;
        // this.direction = "left";
    } else if (degrees < -45) {
        this.direction = 1;
        // this.direction = "up";
    } else if (degrees < 45) {
        this.direction = 2;
        // this.direction = "right";
    } else if (degrees < 135) {
        this.direction = 3;
        // this.direction = "down";
    }
}

Entity.prototype._detectCollision = function() {
    let x = this.x;
    let y = this.y;

    let squareSize = this.collisionSquare;

    let collisionPoints = [
        [x, y],                         // Top left
        [x+squareSize, y],              // Top right
        [x, y+squareSize],              // Bottom left
        [x+squareSize, y+squareSize],   // Bottom right
        [x+squareSize/2, y],            // Top
        [x+squareSize, y+squareSize/2], // Right
        [x+squareSize/2, y+squareSize], // Bottom
        [x, y+squareSize/2]             // Left
    ];

    // Iterate the collision points
    for (let i = 0; i < collisionPoints.length; i++) {
        let pointX = collisionPoints[i][0];
        let pointY = collisionPoints[i][1];

        let oldColumn = Math.floor(pointX / this.service.map.gridSize);
        let oldRow = Math.floor(pointY / this.service.map.gridSize);

        let newColumn = Math.floor((pointX+this.speedX) / this.service.map.gridSize);
        let newRow = Math.floor((pointY+this.speedY) / this.service.map.gridSize);

        // If collision point is trying to enter a disallowed grid
        if (this.service.map.collisionMap[newRow][newColumn] === 1) {
            // If trying to enter new column and row at the same time
            if (newColumn !== oldColumn && newRow !== oldRow) {
                // Trust that another collision point will find the collision
                continue;
            }

            // If trying to enter a new column
            if (newColumn !== oldColumn) {
                this.speedX = 0;
            }

            // If trying to enter a new row
            if (newRow !== oldRow) {
                this.speedY = 0;
            }
        }
    }
}

Entity.prototype.setState = function(state) {
    if (state === "walking") {
        this.activeTiles = this.walkTiles;
    }

    if (state === "grass") {
        this.activeTiles = this.grassTiles;
    }

    if (state === "water") {
        this.activeTiles = this.waterTiles;
    }

    this.state = state;

    this.renderX = this.service.worldCanvas.width/2 - (this.activeTiles[0].renderWidth - this.collisionSquare) / 2;
    this.renderY = this.service.worldCanvas.height/2 - (this.activeTiles[0].renderHeight - this.collisionSquare);

    console.log(this.state);
}

Entity.prototype.update = function() {

    this.activeTile = this.activeTiles[this.direction];

    if (this.service.listeners.mousedown)
    {
        // Use the mouse position to determine the entity speed (speedX speedY)
        this._setSpeed();

        // Use the speed to determine the direction
        this._setDirection();

        // Detect collision.
        // If collision is detected -> set the speed to 0
        this._detectCollision();

        if (this.stop === true) {
            this.speedX = 0;
            this.speedY = 0;
        }

        // Finally, add the speed to the position
        this.x += this.speedX;
        this.y += this.speedY;

        // Update grid position
        let oldCol = this.col;
        let oldRow = this.row;

        this.col = Math.floor((this.x + this.collisionSquare / 2 + this.speedX) / this.service.map.gridSize);
        this.row = Math.floor((this.y + this.collisionSquare / 2 + this.speedY) / this.service.map.gridSize);

        // If entering a new grid -> push the new grid event to service.events
        if (this.col !== oldCol || this.row !== oldRow) {
            let event = this.service.map.getEvent(this.col, this.row);

            this.service.events.push(event);
        }

        // Update tile animation (walking animation etc...)
        this.activeTile.update();

        return;
    }

    // Reset the animation of the tile
    this.activeTile.setFrame(0);
}

Entity.prototype.render = function() {
    this.activeTile.render(this.service.worldContext, this.renderX, this.renderY);

    // this.service.worldContext.beginPath();
    // this.service.worldContext.rect(this.canvasX, this.canvasY, this.collisionSquare, this.collisionSquare);
    // this.service.worldContext.stroke();
}

module.exports = Entity;

},{}],4:[function(require,module,exports){
const Entity = require("./Entity.js");
const MapManager = require("./MapManager.js");
const Battle = require("./Battle.js");
const Loader = require("./Loader.js");
const ScenarioManager = require("./ScenarioManager.js");

Function.prototype.bindArgs = function(...boundArgs)
{
    let context = this;
    return function(...args) { return context.call(this, ...boundArgs, ...args); };
};

function Game() {
    this.now = null;
    this.deltaTime = 0;
    this.last = Date.now();
    this.step = 1/30;

    /**
     * Initialize service
     */
    this.service = require("./InitializeService.js")();
    this.service.setState.bind(this);

    // Load save file
    this.service.save = require("./resources/savefile.json");

    this.service.tick = 0;

    this.service.state = "";

    this.service.events = [];

    this.service.ScenarioManager = new ScenarioManager(this.service, {});

    // Load resources to service.resouces
    this.loader = new Loader(this.service, {});
    // Initialize world state
    this.service.events.push(function() {
        this.loader.load(
            undefined,
            function() {
                this.service.coolguy = new Entity(this.service, {});

                this.service.mapManager = new MapManager(this.service, {});

                this.service.map = this.service.mapManager.getMap("startMap");

                this.service.state = "world";
            },
            function() {
                this.service.map.audio.volume = 0;

                this.service.playAudio(this.service.map.audio);
            }
        );
    });

    // Loading properties
    this.service.loadCanvas = document.querySelector(".loadCanvas");
    this.service.loadContext = this.service.loadCanvas.getContext("2d");

    // Battle properties
    this.service.battleCanvas = document.querySelector(".battleCanvas");
    this.service.battleContext = this.service.battleCanvas.getContext("2d");

    // World properties
    this.service.worldCanvas = document.querySelector(".worldCanvas");
    this.service.worldContext = this.service.worldCanvas.getContext("2d");

    require("./listeners.js").addListeners(this.service);

    this.startGame();
}

Game.prototype.startGame = function() {
    function frame() {
        this.now = Date.now();

        this.deltaTime = this.deltaTime + Math.min(1, (this.now - this.last) / 1000);

        while(this.deltaTime > this.step) {
            this.deltaTime = this.deltaTime - this.step;
            this.update();
        }

        this.last = this.now;

        this.render();

        requestAnimationFrame(frame.bind(this));
    }

    // Start game!
    requestAnimationFrame(frame.bind(this));
};

Game.prototype.update = function() {
    this.service.tick += 1;

    // Update loader
    this.loader.update();

    // Check for events in service.events
    this.checkEvents();

    if (this.service.state === "loading") {
    }

    if (this.service.state === "battle") {
        // Update battle
        this.service.battle.update();
    }

    if (this.service.state === "world") {
        // Update coolguy
        this.service.coolguy.update();

        // Update map
        this.service.map.update();
    }

    this.service.ScenarioManager.update();

    this.service.listeners.click = false;
    this.service.listeners.mouseup = false;

    // Set mouse pointer image
    // if (this.service.listeners.mousedown === true) {
    //     document.body.style.cursor = "";
    //     document.body.style.cursor = "url(img/boxpoint2.png), default";
    // } else {
    //     document.body.style.cursor = "";
    //     document.body.style.cursor = "url(img/boxpoint1.png), default";
    // }
}

Game.prototype.render = function() {
    this.loader.render();

    if (this.service.state === "battle") {
        let context = this.service.battleContext;

        context.clearRect(0, 0, this.service.battleCanvas.width, this.service.battleCanvas.height);

        this.service.battle.render();
    }

    if (this.service.state === "world") {
        let context = this.service.worldContext;

        context.clearRect(0, 0, this.service.worldCanvas.width, this.service.worldCanvas.height);

        this.service.map.renderLayer1();

        this.service.coolguy.render();

        this.service.map.renderLayer2();
    }
}

/**
 * Iterates and executes all events in service.events
 */
Game.prototype.checkEvents = function() {
    // Do not check for events if there are no events!
    if (this.service.events.length === 0) {
        return;
    }
    
    for (let i = 0; i < this.service.events.length; i++) {
        let event = this.service.events[i];

        event.call(this);
    }

    // All events have been checked -> make the events array empty
    this.service.events = [];
}

module.exports = Game;

},{"./Battle.js":1,"./Entity.js":3,"./InitializeService.js":5,"./Loader.js":6,"./MapManager.js":8,"./ScenarioManager.js":9,"./listeners.js":12,"./resources/savefile.json":14}],5:[function(require,module,exports){
module.exports = function() {
    let service = {};

    // Add some nice functions to the service
    service.setState = function(state) {
        if (state === "world") {
            service.battleCanvas.style.zIndex = 0;
            service.worldCanvas.style.zIndex = 1;

            service.pauseAudio(service.battle.audio);
            // service.battle.audio.pause();

            service.map.audio.volume = 0;
            service.playAudio(service.map.audio);

            service.state = "world";
        }
    }

    service.pauseAudio = function(audio) {
        let fadeAudio = setInterval(function() {
            if (audio.volume <= 0.010) {
                audio.volume = 0;

                audio.pause();

                clearInterval(fadeAudio);

                return;
            }

            audio.volume -= 0.010;
        }, 10);
    }

    service.playAudio = function(audio) {
        audio.play();

        let fadeAudio = setInterval(function() {
            if (audio.volume >= 0.990) {
                audio.volume = 1;

                clearInterval(fadeAudio);

                return;
            }

            audio.volume += 0.010;
        }, 30);
    }

    return service;
};

},{}],6:[function(require,module,exports){
const Tile = require("./Tile.js");

function Loader(service, settings)
{
    this.service = service;

    this.service.resources = {};

    this.service.resources.getTile = function(tilename, renderX, renderY, renderWidth, renderHeight) {
        // Get the tile template
        let tileOrig = this.tiles.find(tile => tile.name === tilename);

        // Copy the template
        let tile = tileOrig.copy();

        // Add properties to the template
        tile.service = this.service;

        tile.renderX = renderX;
        tile.renderY = renderY;

        tile.renderWidth = renderWidth;
        tile.renderHeight = renderHeight;

        return tile;
    }.bind(this);

    this.service.resources.getMonster = function(index) {
        // let index = this.service.tick % this.service.resources.monsters.length;

        let monsterTemplate = this.service.resources.monsters[index];

        let monster = {};

        monster.id = monsterTemplate.id;
        monster.name = monsterTemplate.name;
        monster.HP = monsterTemplate.maxHP;
        monster.maxHP = monsterTemplate.maxHP;
        monster.strength = monsterTemplate.strength;
        monster.tileFront = monsterTemplate.tileFront.copy();
        monster.tileBack = monsterTemplate.tileBack.copy();
        monster.cry = monsterTemplate.cry;

        return monster;
    }.bind(this);

    this.loadTick = 0;

    this.loading = false;

    this.alpha = 0;

    this.loadCallable1 = null;
    this.loadCallable2 = null;
    this.loadCallable3 = null;

    this.loadedImages = 0;
    this.nrOfImages = 0;

    this.tiles = [];

    /**
     * Create the tiles
     */
    this._createTiles();

    /**
     * Add the images to the tiles
     */
    this._loadImages();

    this._loadAudios();
}

Loader.prototype._createTiles = function() {
    /**
     * Sprites
     * (Sprite has many tiles)
     */
    // Takes a sprite and return tiles
    let spriteToTiles = function(sprite) {
        let tiles = [];

        for (let y = 0; y < sprite.spriteHeight/sprite.tileHeight; y++) {
            for (let x = 0; x < sprite.spriteWidth/sprite.tileWidth; x++) {
                let settings = Object.assign({}, sprite, {
                    name: sprite.name + "(" + x + "," + y + ")",
                    spriteCol: x,
                    spriteRow: y
                });

                let tile = new Tile(undefined, settings);

                tiles.push(tile);
            }
        }

        return tiles;
    }.bind(this);

    let sprites = require("./resources/sprites.json");

    for (let i = 0; i < sprites.length; i++) {
        let tiles = spriteToTiles(sprites[i]);

        this.tiles.push(...tiles);
    }

    /**
     * Tiles
     */
    let tiles = require("./resources/tiles.json");

    for (let i = 0; i < tiles.length; i++) {
        let settings = tiles[i];

        this.tiles.push(new Tile(undefined, settings));
    }

    /**
     * Monster tiles
     */
    let monsters = require("./resources/monsters.json");

    for (let i = 0; i < monsters.length; i++) {
        monsters[i].tileFront = new Tile(undefined, monsters[i].tileFront);
        monsters[i].tileBack = new Tile(undefined, monsters[i].tileBack);
    }

    this.service.resources.monsters = monsters;
}

/**
 * Iterate all tiles and load their image srcs
 */
Loader.prototype._loadImages = function() {
    // Create a unique array of all image srcs used in the game
    let imagesSrc = [];

    for (let i = 0; i < this.tiles.length; i++) {
        let tile = this.tiles[i];

        if (tile.image === "-") {continue;}

        imagesSrc.push(tile.src);
    }

    for (let i = 0; i < this.service.resources.monsters.length; i++) {
        let monster = this.service.resources.monsters[i];

        imagesSrc.push(monster.tileFront.src);
        imagesSrc.push(monster.tileBack.src);
    }

    imagesSrc = [...new Set(imagesSrc)];

    this.nrOfImages = imagesSrc.length;

    // Create an image element for every src
    for (let i = 0; i < imagesSrc.length; i++) {
        let imageSrc = imagesSrc[i];

        let image = new Image();

        // When the image has finished loading...
        image.addEventListener("load", function(event) {
            this.loadedImages += 1;

            let img = event.target;

            // ...add the image element to all tiles with the same src
            for (let i = 0; i < this.tiles.length; i++) {
                let tile = this.tiles[i];

                if (tile.src === img.getAttribute("src")) {
                    tile.image = img;
                }
            }

            for (let i = 0; i < this.service.resources.monsters.length; i++) {
                let monster = this.service.resources.monsters[i];

                if (monster.tileFront.src === img.getAttribute("src")) {
                    monster.tileFront.image = img;
                }

                if (monster.tileBack.src === img.getAttribute("src")) {
                    monster.tileBack.image = img;
                }
            }
        }.bind(this));

        image.src = imageSrc;
    }
}

Loader.prototype._loadAudios = function() {
    // Array of all audio src used in the game
    let audiosSrc = [
        "audio/music1.mp3",
        "audio/music2.mp3",
        "audio/pkmn-fajt.mp3",
        "audio/normaldamage.wav",
        "audio/faint.wav",
        "audio/Refresh.mp3",
        "audio/expfull.wav",
        "audio/Flee.wav",
        "audio/OpenPokeball.wav"
    ];

    // Make an audio element for every audio src
    let audios = [];

    for (let i = 0; i < audiosSrc.length; i++) {
        let audio = new Audio(audiosSrc[i]);

        audio.setAttribute("preload", "auto");

        audios.push(audio);
    }

    // Save all audios to the service
    this.service.resources.audios = audios;

    /**
     * Monsters
     */
    // Iterate the monsters and create audio elements
    for (let i = 0; i < this.service.resources.monsters.length; i++) {
        let monster = this.service.resources.monsters[i];

        if (monster.crySrc !== undefined) {
            monster.cry = new Audio(monster.crySrc);
        }
    }
}

/**
 * Starts a new loading
 */
Loader.prototype.load = function(callable1, callable2, callable3)
{
    this.service.loadCanvas.style.zIndex = 1;

    this.loadTick = -1;

    this.loading = true;

    this.alpha = 0;

    this.loadCallable1 = callable1;
    this.loadCallable2 = callable2;
    this.loadCallable3 = callable3;

    if (this.loadCallable1 !== undefined) {
        this.service.events.push(this.loadCallable1);

        this.loadCallable1 = undefined;
    }
}

Loader.prototype.update = function()
{
    this.loadTick += 1;

    if (this.loadTick > 10 && this.loading === false && this.alpha <= 0) {
        this.alpha = 0;

        if (this.loadCallable3 !== undefined) {
            this.service.events.push(this.loadCallable3);

            this.loadCallable3 = undefined;
        }

        this.service.loadCanvas.style.zIndex = -1;

        return;
    }

    if (this.loadTick < 10) {
        this.alpha += 0.1;

        return;
    }

    if (this.loadTick === 10) {

        this.alpha = 2;

        return;
    }

    if (this.loadTick > 10 && this.loading === true) {
        let loading = false;

        for (let i = 0; i < this.tiles.length; i++) {
            let tile = this.tiles[i];

            if (tile.image === "-") {
                continue;
            }

            if (tile.image === undefined || tile.image.complete === false || tile.image.naturalHeight === 0) {
                loading = true;

                break;
            }
        }

        this.loading = loading;

        // If all images have finished loading
        if (this.loading === false) {
            if (this.loadCallable2 !== undefined) {
                this.service.events.push(this.loadCallable2);

                this.loadCallable2 = undefined;
            }
        }

        return;
    }

    if (this.loadTick > 10 && this.loading === false) {
        this.alpha -= 0.1;

        return;
    }
}

Loader.prototype.render = function()
{
    let context = this.service.loadContext;

    context.clearRect(0, 0, this.service.loadCanvas.width, this.service.loadCanvas.height);

    context.beginPath();

    context.fillStyle = "rgba(0, 0, 0, " + this.alpha + ")";
    context.fillRect(0, 0, this.service.loadCanvas.width, this.service.loadCanvas.height);
    context.stroke();

    context.font = "26px Georgia";
    context.fillStyle = "rgba(255, 255, 255, " + this.alpha + ")";
    context.fillText("" + this.loadedImages + "/" + this.nrOfImages, context.canvas.width/2 - 50, context.canvas.height/2 - 10);
}

module.exports = Loader;

},{"./Tile.js":10,"./resources/monsters.json":13,"./resources/sprites.json":15,"./resources/tiles.json":16}],7:[function(require,module,exports){
function Map(service, settings) {
    this.service = service;

    this.x = settings.x ? settings.x : 0;
    this.y = settings.y ? settings.y : 0;

    this.collisionMap = settings.collisionMap;

    this.gridSize = settings.gridSize ? settings.gridSize : 32;

    this.layer1Tile = settings.layer1Tile;

    this.layer2Tile = settings.layer2Tile;

    this.audio = settings.audio;
    this.audio.loop = true;
    // this.audio.play();

    this.tiles = settings.tiles;
}

Map.prototype.attachEvent = function(col, row, event) {
    this.collisionMap[row][col] = event;
}

Map.prototype.getEvent = function(col, row) {
    return this.collisionMap[row][col];
}

Map.prototype.update = function() {
    // Update map position
    this.x = this.service.coolguy.canvasX - this.service.coolguy.x;
    this.y = this.service.coolguy.canvasY - this.service.coolguy.y;

    for (let i = 0; i < this.tiles.length; i++) {
        this.tiles[i].update();
    }
}

Map.prototype.renderLayer1 = function() {
    let context = this.service.worldContext;

    this.layer1Tile.render(context, this.x, this.y);

    /**
     * Render tiles!
     */
    for (let i = 0; i < this.tiles.length; i++) {
        this.tiles[i].render(context, this.x, this.y);
    }
}

Map.prototype.renderLayer2 = function() {
    let context = this.service.worldContext;

    if (this.layer2Tile !== undefined) {
        this.layer2Tile.render(context, this.x, this.y);
    }

    /**
     * Render squares!
     */
    for (let y = 0; y < this.collisionMap.length; y++) {
        for (let x = 0; x < this.collisionMap[y].length; x++) {
            if (this.collisionMap[y][x] !== 0) {
                // context.beginPath();
                // context.rect(this.x + x*32, this.y + y*32, 32, 32);
                // context.stroke();
            }
        }
    }
}

module.exports = Map;

},{}],8:[function(require,module,exports){
const Map = require("./Map.js");
const Tile = require("./Tile.js");
const Battle = require("./Battle.js");

function MapManager(service, {}) {
    this.service = service;

    // Some nice events
    this.normalEvent = function() {
        this.service.coolguy.setState("walking");
    };
    this.waterEvent = function() {
        this.service.coolguy.setState("water");
    };
    this.grassEvent = function(type) {
        this.service.coolguy.setState("grass");

        if (type === "snorlax") {
            let monsterLevel = 10;

            snorlax = this.service.resources.getMonster(4);
            snorlax.maxHP = 35;
            snorlax.strength = 5;

            this.service.battle = new Battle(this.service, {opponent: snorlax, opponentLevel: monsterLevel, type: "snorlax"});

            // Switch state
            this.service.state = "battle";

            this.service.map.audio.pause();
            this.service.map.audio.volume = 0;

            this.service.worldCanvas.style.zIndex = -1;
            this.service.battleCanvas.style.zIndex = 1;
        } else {
            // if (true) {
            // if (false) {
            if (this.service.tick % 10 === 0) {
                // Get a "random" mosnter
                let min = 0;
                let max = this.service.resources.monsters.length;
                let monster = this.service.resources.getMonster(Math.floor(Math.random() * (max - min)) + min);

                // Set mosnter level depending on type
                let monsterLevel;

                if (type === "easy") {
                    monsterLevel = 4;
                } else if (type === "hard") {
                    monsterLevel = 8;
                } else if (type === "very hard") {
                    monsterLevel = 15;
                }

                // Create the battle
                this.service.battle = new Battle(this.service, {opponent: monster, opponentLevel: monsterLevel});

                // Switch state
                this.service.state = "battle";

                this.service.map.audio.pause();
                this.service.map.audio.volume = 0;

                this.service.worldCanvas.style.zIndex = -1;
                this.service.battleCanvas.style.zIndex = 1;
            }
        }
    };
    this.newMapEvent = function(newMapName, newX, newY) {
        this.loader.load(
            function() {
                this.service.pauseAudio(this.service.map.audio);

                this.service.coolguy.stop = true;
            },
            function() {
                this.service.map = this.service.mapManager.getMap(newMapName);

                this.service.coolguy.x = newX * 32;
                this.service.coolguy.y = newY * 32;
            },
            function() {
                this.service.map.audio.volume = 0;

                this.service.playAudio(this.service.map.audio);

                this.service.coolguy.stop = false;
            }
        );
    };
}

MapManager.prototype.getMap = function(mapName) {
    if (mapName === "startMap") {
        return this.createStartMap();
    }

    if (mapName === "pokecenter") {
        return this.createPokecenterMap();
    }
}

/**
 * Creates and returns a start map
 */
MapManager.prototype.createStartMap = function() {
    let collisionMap = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,4,4,4,4,4,4,1,1,1,1,0,0,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,4,4,4,4,1,1,1,1,0,0,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,4,4,0,0,0,0,0,0,0,0,0,4,4,4,4,4,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,4,4,4,4,1,1,1,1,1,1,1,1,4,4,4,4,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,4,4,4,4,4,4,4,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,4,4,4,4,0,0,0,0,0,0,4,4,4,4,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,4,4,4,4,4,4,4,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,1,1,1,1,1,1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,6,6,6,6,2,2,2,2,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,6,6,6,6,2,2,2,2,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,6,6,6,6,2,2,2,2,2,2,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,6,6,6,2,2,2,2,2,2,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,0,6,6,2,2,2,2,2,2,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,1,1,1,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,11,1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,3,3,3,0,0,0,0,0,0,0,0,3,3,3,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,3,3,3,3,0,0,0,0,0,0,3,3,3,3,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,3,3,3,3,3,3,0,0,0,0,0,0,3,3,3,3,3,3,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,3,3,3,3,3,0,0,0,0,0,0,0,3,3,3,3,3,3,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,3,3,0,0,1,1,1,1,1,1,1,3,3,3,3,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1,1,3,3,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,3,3,3,3,3,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,3,3,3,3,3,3,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,3,3,3,3,3,3,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,3,3,0,0,0,0,1,1,1,1,3,3,3,3,3,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,3,3,3,3,3,0,0,0,0,0,0,0,1,1,3,3,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,3,3,3,3,3,3,0,0,0,0,0,0,1,1,3,3,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,3,3,3,3,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,3,3,3,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,2,2,2,2,2,2,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,2,2,2,2,2,2,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    let layer1Tile = this.service.resources.getTile("map1layer1", 0, 0, 3200, 3200);

    let layer2Tile = this.service.resources.getTile("map1layer2", 0, 0, 3200, 3200);

    let audio = this.service.resources.audios.find(audio => audio.getAttribute("src") === "audio/music1.mp3");

    let snorlaxTile = this.service.resources.getMonster(4).tileFront;
    snorlaxTile.pause = false;
    snorlaxTile.loop = true;
    snorlaxTile.renderX = 48*32;
    snorlaxTile.renderY = 31*32;
    snorlaxTile.renderWidth = 96;
    snorlaxTile.renderHeight = 96;
    let tiles = [
        // this.service.resources.getTile("grass", 8*32, 30*29, 32, 32),
        // this.service.resources.getTile("grass", 9*32, 30*29, 32, 32),
        // this.service.resources.getTile("grass", 10*32, 30*29, 32, 32),
        // this.service.resources.getTile("grass", 11*32, 30*29, 32, 32),
        // this.service.resources.getTile("grass", 8*32, 31*29, 32, 32),
        // this.service.resources.getTile("grass", 9*32, 31*29, 32, 32),
        // this.service.resources.getTile("grass", 10*32, 31*29, 32, 32),
        // this.service.resources.getTile("grass", 11*32, 31*29, 32, 32),
        // this.service.resources.getTile("grass", 8*32, 32*29, 32, 32),
        // this.service.resources.getTile("grass", 9*32, 32*29, 32, 32),
        // this.service.resources.getTile("grass", 10*32, 32*29, 32, 32),
        // this.service.resources.getTile("grass", 11*32, 32*29, 32, 32),
        // this.service.resources.getTile("grass", 9*32, 33*29, 32, 32),
        // this.service.resources.getTile("grass", 10*32, 33*29, 32, 32),
        // this.service.resources.getTile("grass", 11*32, 33*29, 32, 32),

        this.service.resources.getTile("sea(0,2)", 58*32, 82*32, 32, 32),
        this.service.resources.getTile("sea(1,2)", 59*32, 82*32, 32, 32),
        this.service.resources.getTile("sea(2,2)", 60*32, 82*32, 32, 32),
        this.service.resources.getTile("sea(3,2)", 61*32, 82*32, 32, 32),
        this.service.resources.getTile("sea(4,2)", 62*32, 82*32, 32, 32),
        this.service.resources.getTile("sea(5,2)", 63*32, 82*32, 32, 32),
        this.service.resources.getTile("sea(0,3)", 58*32, 83*32, 32, 32),
        this.service.resources.getTile("sea(1,3)", 59*32, 83*32, 32, 32),
        this.service.resources.getTile("sea(2,3)", 60*32, 83*32, 32, 32),
        this.service.resources.getTile("sea(3,3)", 61*32, 83*32, 32, 32),
        this.service.resources.getTile("sea(4,3)", 62*32, 83*32, 32, 32),
        this.service.resources.getTile("sea(5,3)", 63*32, 83*32, 32, 32),
        this.service.resources.getTile("sea(0,4)", 58*32, 84*32, 32, 32),
        this.service.resources.getTile("sea(1,4)", 59*32, 84*32, 32, 32),
        this.service.resources.getTile("sea(2,4)", 60*32, 84*32, 32, 32),
        this.service.resources.getTile("sea(3,4)", 61*32, 84*32, 32, 32),
        this.service.resources.getTile("sea(4,4)", 62*32, 84*32, 32, 32),
        this.service.resources.getTile("sea(5,4)", 63*32, 84*32, 32, 32),
        this.service.resources.getTile("sea(0,5)", 58*32, 85*32, 32, 32),
        this.service.resources.getTile("sea(1,5)", 59*32, 85*32, 32, 32),
        this.service.resources.getTile("sea(2,5)", 60*32, 85*32, 32, 32),
        this.service.resources.getTile("sea(3,5)", 61*32, 85*32, 32, 32),
        this.service.resources.getTile("sea(4,5)", 62*32, 85*32, 32, 32),
        this.service.resources.getTile("sea(5,5)", 63*32, 85*32, 32, 32),
        this.service.resources.getTile("sea(0,6)", 58*32, 86*32, 32, 32),
        this.service.resources.getTile("sea(1,6)", 59*32, 86*32, 32, 32),
        this.service.resources.getTile("sea(2,6)", 60*32, 86*32, 32, 32),
        this.service.resources.getTile("sea(3,6)", 61*32, 86*32, 32, 32),
        this.service.resources.getTile("sea(4,6)", 62*32, 86*32, 32, 32),
        this.service.resources.getTile("sea(5,6)", 63*32, 86*32, 32, 32),
        this.service.resources.getTile("sea(0,7)", 58*32, 87*32, 32, 32),
        this.service.resources.getTile("sea(1,7)", 59*32, 87*32, 32, 32),
        this.service.resources.getTile("sea(2,7)", 60*32, 87*32, 32, 32),
        this.service.resources.getTile("sea(3,7)", 61*32, 87*32, 32, 32),
        this.service.resources.getTile("sea(4,7)", 62*32, 87*32, 32, 32),
        this.service.resources.getTile("sea(5,7)", 63*32, 87*32, 32, 32),

        this.service.resources.getTile("flower1", 50*32, 70*32, 32, 32),
        this.service.resources.getTile("flower1", 51*32, 71*32, 32, 32),
        this.service.resources.getTile("flower1", 50*32, 72*32, 32, 32),
        this.service.resources.getTile("flower1", 53*32, 72*32, 32, 32),
        this.service.resources.getTile("flower1", 53*32, 79*32, 32, 32),
        this.service.resources.getTile("flower1", 54*32, 79*32, 32, 32),
        this.service.resources.getTile("flower1", 55*32, 79*32, 32, 32),
        this.service.resources.getTile("flower1", 53*32, 80*32, 32, 32),
        this.service.resources.getTile("flower1", 54*32, 80*32, 32, 32),
        this.service.resources.getTile("flower1", 55*32, 80*32, 32, 32),
        this.service.resources.getTile("flower1", 69*32, 69*32, 32, 32),
        this.service.resources.getTile("flower1", 68*32, 70*32, 32, 32),
        this.service.resources.getTile("flower1", 69*32, 71*32, 32, 32),
        this.service.resources.getTile("flower1", 68*32, 72*32, 32, 32),
        this.service.resources.getTile("flower1", 66*32, 72*32, 32, 32),

        this.service.resources.getTile("flower1", 60*32, 32*32, 32, 32),
        this.service.resources.getTile("flower1", 59*32, 31*32, 32, 32),
        this.service.resources.getTile("flower1", 61*32, 30*32, 32, 32),
        this.service.resources.getTile("flower1", 52*32, 30*32, 32, 32),
        this.service.resources.getTile("flower1", 53*32, 29*32, 32, 32),
        this.service.resources.getTile("flower1", 52*32, 28*32, 32, 32),
        this.service.resources.getTile("flower1", 53*32, 27*32, 32, 32),

        this.service.resources.getTile("flower1", 33*32, 26*32, 32, 32),
        this.service.resources.getTile("flower1", 32*32, 27*32, 32, 32),
        this.service.resources.getTile("flower1", 33*32, 28*32, 32, 32),

        snorlaxTile
    ];

    if (this.service.save.snorlaxDefeated === true) {
        // Move snorlax
        let snorlaxTile = tiles[tiles.length-1];
        snorlaxTile.renderX = 42*32;
        snorlaxTile.renderY = 26*32;
        snorlaxTile.renderWidth = 32;
        snorlaxTile.renderHeight = 32;

        // Remove snorlax battle events
        collisionMap[32][50] = 0;
        collisionMap[33][50] = 0;
    }

    let map = new Map(this.service, {
        x: 0,
        y: 0,
        collisionMap: collisionMap,
        layer1Tile: layer1Tile,
        layer2Tile: layer2Tile,
        audio: audio,
        tiles: tiles
    });

    // Attach map events!
    for (let y = 0; y < collisionMap.length; y++) {
        for (let x = 0; x < collisionMap[y].length; x++) {
            // Normal state!
            if (collisionMap[y][x] === 0) {
                map.attachEvent(x, y, this.normalEvent);
            }

            // Water! Swim!
            if (collisionMap[y][x] === 2) {
                map.attachEvent(x, y, this.waterEvent);
            }

            // Easy grass!
            if (collisionMap[y][x] === 3) {
                map.attachEvent(x, y, this.grassEvent.bindArgs("easy"));
            }

            // Hard grass!
            if (collisionMap[y][x] === 4) {
                map.attachEvent(x, y, this.grassEvent.bindArgs("hard"));
            }

            // Snorlax!
            if (collisionMap[y][x] === 5) {
                map.attachEvent(x, y, this.grassEvent.bindArgs("snorlax"));
            }

            // Very hard grass!
            if (collisionMap[y][x] === 6) {
                map.attachEvent(x, y, this.grassEvent.bindArgs("very hard"));
            }

            // Teleport!
            if (collisionMap[y][x] === 7) {
                map.attachEvent(x, y, this.newMapEvent.bindArgs("house1Map", 5, 5));
            }

            // Teleport!
            if (collisionMap[y][x] === 11) {
                map.attachEvent(x, y, this.newMapEvent.bindArgs("pokecenter", 8, 9));
            }
        }
    }

    return map;
}

MapManager.prototype.createPokecenterMap = function() {
    let x = 0;
    let y = 0;

    let collisionMap = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,0,0,0,1,0,0,0,1,1],
        [1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    let layer1Tile = this.service.resources.getTile("pokecenter_layer1", 0, 0, 3200, 3200);

    let layer2Tile = this.service.resources.getTile("pokecenter_layer2", 0, 0, 3200, 3200);

    let audio = this.service.resources.audios.find(audio => audio.getAttribute("src") === "audio/music2.mp3");

    let tiles = [];

    let map = new Map(this.service, {
        x: 0,
        y: 0,
        collisionMap: collisionMap,
        layer1Tile: layer1Tile,
        layer2Tile: layer2Tile,
        audio: audio,
        tiles: tiles
    });

    for (let y = 0; y < collisionMap.length; y++) {
        for (let x = 0; x < collisionMap[y].length; x++) {
            // Normal state!
            if (collisionMap[y][x] === 0) {
                map.attachEvent(x, y, this.normalEvent);
            }

            // Teleport!
            if (collisionMap[y][x] === 2) {
                map.attachEvent(x, y, this.newMapEvent.bindArgs("startMap", 56, 39));
            }
        }
    }

    return map;
}

module.exports = MapManager;

},{"./Battle.js":1,"./Map.js":7,"./Tile.js":10}],9:[function(require,module,exports){
function ScenarioManager(service, settings) {
    this.service = service;

    this.scenarios = [];

    this.scenariosTicks = [];
}

ScenarioManager.prototype.addScenario = function(scenario) {
    this.scenarios.push(scenario);

    this.scenariosTicks.push(-1);
}

ScenarioManager.prototype.removeScenario = function(scenario) {
    this.scenarios.shift();

    this.scenariosTicks.shift();
}

ScenarioManager.prototype.update = function() {
    for (let i = 0; i < this.scenarios.length; i++) {
        this.scenariosTicks[i] += 1;

        this.scenarios[i](this.scenariosTicks[i]);
    }
}

// ScenarioManager.prototype.render = function() {}

module.exports = ScenarioManager;

},{}],10:[function(require,module,exports){
function Tile(service, settings) {
    this.service = service;

    this.name = settings.name ? settings.name : "tilename";

    this.image = settings.image;

    this.src = settings.src;

    // if (this.src === null) {this.image === "no image!";}

    this.tileWidth = settings.tileWidth ? settings.tileWidth : 0;
    this.tileHeight = settings.tileHeight ? settings.tileHeight : 0;

    this.spriteWidth = settings.spriteWidth ? settings.spriteWidth : this.tileWidth;
    this.spriteHeight = settings.spriteHeight ? settings.spriteHeight : this.tileHeight;

    this.renderWidth = settings.renderWidth ? settings.renderWidth : this.tileWidth;
    this.renderHeight = settings.renderHeight ? settings.renderHeight : this.tileHeight;

    this.spriteCol = settings.spriteCol ? settings.spriteCol : 0;
    this.spriteRow = settings.spriteRow ? settings.spriteRow : 0;

    this.numberOfFrames = settings.numberOfFrames ? settings.numberOfFrames : 1;

    this.updateFrequency = settings.updateFrequency ? settings.updateFrequency : null;

    this.loop = settings.loop === undefined ? true : settings.loop;

    this.pause = settings.pause === undefined ? false : settings.pause;

    this.alpha = settings.alpha ? settings.alpha : 1;

    this.renderX = settings.renderX ? settings.renderX : 0;
    this.renderY = settings.renderY ? settings.renderY : 0;

    // Animation
    this.animationCounter = 0;

    this.spriteOffset = 0;

    // 
    this.tick = 0;
}

Tile.prototype.pointerInside = function() {
    let x = this.service.listeners.mousePositionX;
    let y = this.service.listeners.mousePositionY;

    return x > this.renderX && y > this.renderY && x < (this.renderX + this.renderWidth) && y < (this.renderY + this.renderHeight);
}

Tile.prototype.setFrame = function(framenumber) {
    this.animationCounter = framenumber;
    this.spriteOffset = framenumber * this.spriteWidth;
}

Tile.prototype.copy = function() {
    let tileCopy = new Tile(this.service, {
        name: this.name,
        image: this.image,
        renderX: this.renderX,
        renderY: this.renderY,
        renderWidth: this.renderWidth,
        renderHeight: this.renderHeight,
        tileWidth: this.tileWidth,
        tileHeight: this.tileHeight,
        spriteWidth: this.spriteWidth,
        spriteHeight: this.spriteHeight,
        spriteCol: this.spriteCol,
        spriteRow: this.spriteRow,
        numberOfFrames: this.numberOfFrames,
        updateFrequency: this.updateFrequency,
        loop: this.loop,
        pause: this.pause,
        alpha: this.alpha
    });

    return tileCopy;
}

Tile.prototype.update = function() {
    this.tick += 1;

    // Dont update if animation is paused
    if (this.pause === true) {
        return;
    }

    // No need to update if only one frame!
    if (this.numberOfFrames === 1) {
        return;
    }

    if (this.tick % this.updateFrequency === 0) {
        this.animationCounter += 1;

        this.spriteOffset = this.spriteWidth * (this.animationCounter % this.numberOfFrames);

        // If no looping and at the first frame of the animation -> pause animation
        if (this.loop === false && this.animationCounter % this.numberOfFrames === 0) {
            this.pause = true;
        }
    }
}

Tile.prototype.render = function(context, rX, rY) {
    // Do not render if tile has no image
    if (this.image === undefined || this.image === "-") {
        // console.log("no image!");

        return;
    }

    rX = rX ? rX : 0;
    rY = rY ? rY : 0;

    let xInImage = this.spriteCol * this.tileWidth + this.spriteOffset;
    let yInImage = this.spriteRow * this.tileHeight;

    context.save();

    context.globalAlpha = this.alpha;

    context.drawImage(
        this.image,
        xInImage,
        yInImage,
        this.tileWidth,
        this.tileHeight,
        rX + this.renderX,
        rY + this.renderY,
        this.renderWidth,
        this.renderHeight
    );

    context.restore();
}

module.exports = Tile;

},{}],11:[function(require,module,exports){
let Game = require("./Game.js");

// node_modules/.bin/browserify source/js/app.js > debug/js/bundle.js

window.addEventListener("load", function() {
    let game = new Game();
});

},{"./Game.js":4}],12:[function(require,module,exports){
function addListeners(service) {
    service.listeners = {};

    let clickEvent = function(event) {
        event.preventDefault();

        service.listeners.click = true;
    }

    service.worldCanvas.addEventListener("click", clickEvent);
    service.battleCanvas.addEventListener("click", clickEvent);

    let mousedownEvent = function(event) {
        service.listeners.mousedown = true;

        let canvasRect = service.worldCanvas.getBoundingClientRect();

        service.listeners.mousePositionX = event.clientX - canvasRect.left;
        service.listeners.mousePositionY = event.clientY - canvasRect.top;
    }

    service.worldCanvas.addEventListener("mousedown", mousedownEvent);
    service.battleCanvas.addEventListener("mousedown", mousedownEvent);

    let mousemoveEvent = function(event) {
        event.preventDefault();

        service.listeners.mousemove = true;

        let canvasRect = service.worldCanvas.getBoundingClientRect();

        service.listeners.mousePositionX = event.clientX - canvasRect.left;
        service.listeners.mousePositionY = event.clientY - canvasRect.top;
    }

    service.worldCanvas.addEventListener("mousemove", mousemoveEvent);
    service.battleCanvas.addEventListener("mousemove", mousemoveEvent);

    window.addEventListener("mouseup", function(event) {
        service.listeners.mousedown = false;
        service.listeners.mousemove = false;
    });
}

module.exports = {
    addListeners: addListeners
}

},{}],13:[function(require,module,exports){
module.exports=[
    {
        "id": 1,
        "name": "BULBASAUR",
        "maxHP": 13,
        "strength": 3,
        "tileFront": {
            "src": "img/monsters/001_bulbasaur_front.png",
            "tileWidth": 38,
            "tileHeight": 38,
            "renderY": 130,
            "renderWidth": 200,
            "renderHeight": 200,
            "numberOfFrames": 99,
            "updateFrequency": 1,
            "loop": false,
            "pause": true
        },
        "tileBack": {
            "src": "img/monsters/001_bulbasaur_back.png",
            "tileWidth": 38,
            "tileHeight": 38,
            "renderWidth": 100,
            "renderHeight": 100,
            "numberOfFrames": 99,
            "updateFrequency": 1,
            "loop": false,
            "pause": true
        },
        "crySrc": "audio/monster/001Cry.wav",
        "moves": [
            {
                "name": "Tackle1"
            },
            {
                "name": "Tackle2"
            },
            {
                "name": "Tackle3"
            },
            {
                "name": "Tackle4"
            }
        ]
    },
    {
        "id": 25,
        "name": "PIKACHU",
        "maxHP": 16,
        "strength": 4,
        "tileFront": {
            "src": "img/monsters/025_pikachu_front.png",
            "tileWidth": 50,
            "tileHeight": 50,
            "renderY": 85,
            "renderWidth": 250,
            "renderHeight": 250,
            "numberOfFrames": 112,
            "updateFrequency": 1,
            "loop": false,
            "pause": true
        },
        "tileBack": {
            "src": "img/monsters/025_pikachu_back.png",
            "tileWidth": 47,
            "tileHeight": 47,
            "renderWidth": 300,
            "renderHeight": 300,
            "numberOfFrames": 113,
            "updateFrequency": 1,
            "loop": false,
            "pause": true
        },
        "crySrc": "audio/monster/025Cry.wav"
    },
    {
        "id": 93,
        "name": "HAUNTER",
        "maxHP": 12,
        "strength": 4,
        "tileFront": {
            "src": "img/monsters/093_haunter_front.png",
            "tileWidth": 85,
            "tileHeight": 85,
            "renderY": 80,
            "renderWidth": 350,
            "renderHeight": 350,
            "numberOfFrames": 25,
            "updateFrequency": 1,
            "loop": false,
            "pause": true
        },
        "tileBack": {
            "src": "img/monsters/093_haunter_back.png",
            "tileWidth": 85,
            "tileHeight": 85,
            "renderWidth": 350,
            "renderHeight": 350,
            "numberOfFrames": 25,
            "updateFrequency": 1,
            "loop": false,
            "pause": true
        },
        "crySrc": "audio/monster/093Cry.wav"
    },
    {
        "id": 130,
        "name": "GYARADOS",
        "maxHP": 13,
        "strength": 4,
        "tileFront": {
            "src": "img/monsters/130_gyarados_front.png",
            "tileWidth": 102,
            "tileHeight": 102,
            "renderY": 60,
            "renderWidth": 350,
            "renderHeight": 350,
            "numberOfFrames": 87,
            "updateFrequency": 1,
            "loop": false,
            "pause": true
        },
        "tileBack": {
            "src": "img/monsters/130_gyarados_back.png",
            "tileWidth": 108,
            "tileHeight": 108,
            "renderWidth": 350,
            "renderHeight": 350,
            "numberOfFrames": 87,
            "updateFrequency": 1,
            "loop": false,
            "pause": true
        },
        "crySrc": "audio/monster/130Cry.wav"
    },
    {
        "id": 143,
        "name": "SNORLAX",
        "maxHP": 17,
        "strength": 4,
        "tileFront": {
            "src": "img/monsters/143_snorlax_front.png",
            "tileWidth": 75,
            "tileHeight": 75,
            "renderY": 30,
            "renderWidth": 350,
            "renderHeight": 350,
            "numberOfFrames": 173,
            "updateFrequency": 1,
            "loop": false,
            "pause": true
        },
        "tileBack": {
            "src": "img/monsters/143_snorlax_back.png",
            "tileWidth": 75,
            "tileHeight": 75,
            "renderWidth": 350,
            "renderHeight": 350,
            "numberOfFrames": 173,
            "updateFrequency": 1,
            "loop": false,
            "pause": true
        },
        "crySrc": "audio/monster/143Cry.wav"
    }
]

},{}],14:[function(require,module,exports){
module.exports={
    "monsters": [
        {
            "name": "PIKACHU",
            "level": 1
        }
    ],
    "snorlaxDefeated": false
}

},{}],15:[function(require,module,exports){
module.exports=[
    {
        "name": "playerWalk",
        "src": "img/character_walking.png",
        "tileWidth": 32,
        "tileHeight": 48,
        "spriteWidth": 32,
        "spriteHeight": 192,
        "numberOfFrames": 4,
        "updateFrequency": 7
    },
    {
        "name": "playerWater",
        "src": "img/character_water.png",
        "tileWidth": 64,
        "tileHeight": 64,
        "spriteWidth": 64,
        "spriteHeight": 256,
        "numberOfFrames": 4,
        "updateFrequency": 7
    },
    {
        "name": "playerGrass",
        "src": "img/character_grass.png",
        "tileWidth": 32,
        "tileHeight": 48,
        "spriteWidth": 32,
        "spriteHeight": 192,
        "numberOfFrames": 4,
        "updateFrequency": 7
    },
    {
        "name": "sea",
        "src": "img/Sea.png",
        "tileWidth": 16,
        "tileHeight": 16,
        "spriteWidth": 96,
        "spriteHeight": 128,
        "numberOfFrames": 8,
        "updateFrequency": 7
    },
    {
        "name": "battleCommandBtns",
        "src": "img/battle/battleCommandButtons.png",
        "tileWidth": 130,
        "tileHeight": 46,
        "spriteWidth": 130,
        "spriteHeight": 414,
        "numberOfFrames": 2
    },
    {
        "name": "battleFightBtns",
        "src": "img/battle/battleFightButtons.png",
        "tileWidth": 192,
        "tileHeight": 46,
        "spriteWidth": 192,
        "spriteHeight": 874,
        "numberOfFrames": 2
    }
]

},{}],16:[function(require,module,exports){
module.exports=[
    {
        "name": "map1layer1",
        "src": "img/maps/map1layer1.png",
        "tileWidth": 3200,
        "tileHeight": 3200
    },
    {
        "name": "map1layer2",
        "src": "img/maps/map1layer2.png",
        "tileWidth": 3200,
        "tileHeight": 3200
    },
    {
        "name": "pokecenter_layer1",
        "src": "img/maps/pokecenter_layer1.png",
        "tileWidth": 3200,
        "tileHeight": 3200
    },
    {
        "name": "pokecenter_layer2",
        "src": "img/maps/pokecenter_layer2.png",
        "tileWidth": 3200,
        "tileHeight": 3200
    },
    {
        "name": "battleBall",
        "src": "img/battle/ball.png",
        "tileWidth": 32,
        "tileHeight": 32,
        "numberOfFrames": 4,
        "updateFrequency": 3
    },
    {
        "name": "battleOpponentbaseGrassEve",
        "src": "img/battle/enemybaseFieldGrassEve.png",
        "tileWidth": 256,
        "tileHeight": 128
    },
    {
        "name": "battlePlayerbaseGrassEve",
        "src": "img/battle/playerbaseFieldGrassEve.png",
        "tileWidth": 408,
        "tileHeight": 64
    },
    {
        "name": "battleOpponentbaseField",
        "src": "img/battle/enemybaseFieldGrass.png",
        "tileWidth": 256,
        "tileHeight": 128
    },
    {
        "name": "battlePlayerbaseField",
        "src": "img/battle/playerbaseFieldGrass.png",
        "tileWidth": 408,
        "tileHeight": 64
    },
    {
        "name": "battlePlayer",
        "src": "img/battle/player_back.png",
        "tileWidth": 128,
        "tileHeight": 128,
        "numberOfFrames": 5,
        "updateFrequency": 5,
        "loop": false,
        "pause": true
    },
    {
        "name": "battleBgForestEve",
        "src": "img/battle/battlebgForestEve.png",
        "tileWidth": 512,
        "tileHeight": 288
    },
    {
        "name": "battleBgField",
        "src": "img/battle/battlebgField.png",
        "tileWidth": 512,
        "tileHeight": 288
    },
    {
        "name": "flash",
        "src": "img/battle/flash.png",
        "tileWidth": 1024,
        "tileHeight": 768
    },
    {
        "name": "conversationBg",
        "src": "img/conversation/background_normal.png",
        "tileWidth": 512,
        "tileHeight": 96
    },
    {
        "name": "conversationBattleBg",
        "image": "-",
        // "src": "img/conversation/background_battle.png",
        "tileWidth": 512,
        "tileHeight": 96
    },
    {
        "name": "conversationArrow",
        "src": "img/conversation/arrow.png",
        "tileWidth": 28,
        "tileHeight": 40,
        "numberOfFrames": 8,
        "updateFrequency": 3,
        "loop": true,
        "pause": false
    },
    {
        "name": "grass",
        "src": "img/grass.png",
        "tileWidth": 16,
        "tileHeight": 16
    },
    {
        "name": "battleMessagebg",
        "src": "img/battle/battleMessagebg.png",
        "tileWidth": 512,
        "tileHeight": 96,
        "numberOfFrames": 2,
        "loop": false,
        "pause": true
    },
    {
        "name": "battleCommandbg",
        "src": "img/battle/battleCommandbg.png",
        "tileWidth": 512,
        "tileHeight": 96,
        "numberOfFrames": 2,
        "loop": false,
        "pause": true
    },
    {
        "name": "battleFightbg",
        "src": "img/battle/battleFightbg.png",
        "tileWidth": 512,
        "tileHeight": 96,
        "numberOfFrames": 2,
        "loop": false,
        "pause": true
    },
    {
        "name": "battleBackBtn",
        "src": "img/battle/backBtn.png",
        "tileWidth": 120,
        "tileHeight": 88
    },
    {
        "name": "battlePlayerBox",
        "src": "img/battle/battlePlayerBox.png",
        "tileWidth": 262,
        "tileHeight": 62
    },
    {
        "name": "battleOpponentBox",
        "src": "img/battle/battleOpponentBox.png",
        "tileWidth": 262,
        "tileHeight": 62
    },
    {
        "name": "flower1",
        "src": "img/Flowers1.png",
        "tileWidth": 32,
        "tileHeight": 32,
        "numberOfFrames": 4,
        "updateFrequency": 7,
        "loop": true,
        "pause": false
    },
    {
        "name": "flower2",
        "src": "img/Flowers2.png",
        "tileWidth": 32,
        "tileHeight": 32,
        "numberOfFrames": 4,
        "updateFrequency": 7,
        "loop": true,
        "pause": false
    }
]

},{}]},{},[11]);
