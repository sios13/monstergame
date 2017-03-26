function Game() {
    this.frame = 0;
    this.framerate = 30;

    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");

    this.collisionMap = [
        [0,0,0,0],
        [0,1,0,1,1],
        [0,1,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];

    this.gridSize = 50;
}

Game.prototype.startGame = function() {
    require("./listeners.js").addListeners(this);

    let Entity = require("./Entity.js");

    let coolguy = new Entity(110, 110, 80, 80, 6);

    // Start game!
    setInterval(frame.bind(this), 1000/this.framerate);

    function frame() {
        this.frame += 1;

        update();
        render();
    }

    let update = () => {
        coolguy.update(this);
    }

    let render = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        coolguy.render(this.context);

        for (let y = 0; y < this.collisionMap.length; y++) {
            for (let x = 0; x < this.collisionMap[y].length; x++) {
                if (this.collisionMap[y][x] === 1) {
                    this.context.beginPath();
                    this.context.rect(x*this.gridSize, y*this.gridSize, this.gridSize, this.gridSize);
                    this.context.stroke();
                }
            }
        }
    }
};

module.exports = Game;
