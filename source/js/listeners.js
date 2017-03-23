function addListeners(game) {
    game.listeners = {};

    game.canvas.addEventListener("mousedown", function(e) {
        game.listeners.isMousedown = true;

        game.listeners.mousePositionX = window.event.clientX;
        game.listeners.mousePositionY = window.event.clientY;
    });

    game.canvas.addEventListener("mousemove", function(e) {
        game.listeners.isMousemove = true;

        game.mousePositionX = window.event.clientX;
        game.mousePositionY = window.event.clientY;
    });

    game.canvas.addEventListener("mouseup", function(e) {
        game.listeners.isMousedown = false;
        game.listeners.isMousemove = false;
    });

    game.canvas.addEventListener("keydown", function(e) {
        console.log("keydown");
    });
}

module.exports = {
    addListeners: addListeners
}
