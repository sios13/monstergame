function addListeners(game) {
    game.listeners = {};

    game.canvas.addEventListener("click", function(event) {
        game.listeners.click = true;
    });

    game.canvas.addEventListener("mousedown", function(event) {
        game.listeners.isMousedown = true;

        game.listeners.mousePositionX = event.pageX;
        game.listeners.mousePositionY = event.pageY;
    });

    game.canvas.addEventListener("mousemove", function(event) {
        game.listeners.isMousemove = true;

        game.listeners.mousePositionX = event.pageX;
        game.listeners.mousePositionY = event.pageY;
    });

    window.addEventListener("mouseup", function(event) {
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
