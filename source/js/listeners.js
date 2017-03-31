function addListeners(game) {
    game.listeners = {};

    game.canvas.addEventListener("mousedown", function(event) {
        game.listeners.isMousedown = true;

        game.listeners.mousePositionX = event.clientX;
        game.listeners.mousePositionY = event.clientY;
    });

    game.canvas.addEventListener("mousemove", function(event) {
        game.listeners.isMousemove = true;

        game.mousePositionX = event.clientX;
        game.mousePositionY = event.clientY;
    });

    game.canvas.addEventListener("mouseup", function(event) {
        game.listeners.isMousedown = false;
        game.listeners.isMousemove = false;
    });

    game.canvas.addEventListener("keydown", function(event) {
        console.log("keydown");
    });
}

module.exports = {
    addListeners: addListeners
}
