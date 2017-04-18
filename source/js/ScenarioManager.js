function ScenarioManager() {
    this.activeScenario = null;

    this.tick = null;

    this.endTick = null;
}

// Initialize/reset properties and play a scenario
ScenarioManager.prototype.playScenario = function(scenarioName) {
    // Do not start a new scenario if there already is an active scenario playing
    if (this.activeScenario !== null) {
        return;
    }

    this.activeScenario = scenarioName;

    this.tick = 0;

    if (this.activeScenario === "battleIntro") {
        this.endTick = 100;
    }
}

ScenarioManager.prototype.endScenario = function() {
    this.activeScenario = null;
}

ScenarioManager.prototype.isPlaying = function() {
    if (this.activeScenario !== null) {
        return true;
    }

    return false;
}

ScenarioManager.prototype.createBattleIntro = function() {
    this.game.coolguy.x = 100;
    this.game.coolguy.y = 100;
}

ScenarioManager.prototype.update = function(game) {
    // Do not update if there is no active scenario
    if (this.activeScenario === null) {
        return;
    }

    // If at the end of the scenario -> end the active scenario
    if (this.tick === this.endTick) {
        this.activeScenario = null;

        return;
    }

    this.tick += 1;

    if (this.activeScenario === "battleIntro") {
        console.log(this.tick);

        if (this.tick === this.endTick) {
            game.startBattle("xD");
        }
    }
}

ScenarioManager.prototype.render = function(context) {
    if (this.activeScenario === "battleIntro") {

    }
}

module.exports = ScenarioManager;
