const Scenario = require("./Scenario.js");

function Battle(settings) {
    this.tick = 0;

    this.enemy = {
        name: "HEJ",
        image: "src/hej.png"
    };
}

Battle.prototype.update = function(game) {
    this.tick += 1;

    if (this.tick === 30) {
        game.endBattle();
    }
}

Battle.prototype.render = function() {

}

module.exports = Battle;
