function ScenarioManager() {
    this.isPlaying = false;
}

ScenarioManager.prototype.battleIntro = function(game) {
    console.log(game.battle.player.image);
}

module.exports = ScenarioManager;
