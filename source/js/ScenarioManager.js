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
    // let index = -1;

    // console.log(this.scenarios[0].toString());

    // for (let i = 0; i < this.scenarios.length; i++) {
    //     if (this.scenarios[i].toString() === scenario.toString()) {
    //         index = i;
    //         break;
    //     }
    // }
    // // let index = this.scenarios.indexOf(scenario);
    // console.log(index);
    // this.scenarios.splice(index, 1);

    // this.scenariosTicks.splice(index, 1);
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
