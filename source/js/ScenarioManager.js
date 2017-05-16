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
    let index = this.scenarios.indexOf(scenario);
    this.scenarios.splice(index, 1);

    this.scenariosTicks.splice(index, 1);
    console.log(this.scenarios.length);
}

ScenarioManager.prototype.update = function() {

    for (let i = 0; i < this.scenarios.length; i++) {
        this.scenariosTicks[i] += 1;

        this.scenarios[i](this.scenariosTicks[i]);
    }
}

// ScenarioManager.prototype.render = function() {

// }

module.exports = ScenarioManager;
