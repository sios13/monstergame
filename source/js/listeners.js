function addListeners(game) {
    game.listeners = {};

    game.canvas.addEventListener("click", function(event) {
        game.listeners.click = true;
    });

    game.canvas.addEventListener("mousedown", function(event) {
        game.listeners.isMousedown = true;

        let canvasRect = game.canvas.getBoundingClientRect();

        game.listeners.mousePositionX = canvasRect.left*-1 + event.pageX;
        game.listeners.mousePositionY = canvasRect.top*-1 + event.pageY;
    });

    game.canvas.addEventListener("mousemove", function(event) {
        game.listeners.isMousemove = true;

        let canvasRect = game.canvas.getBoundingClientRect();

        game.listeners.mousePositionX = canvasRect.left*-1 + event.pageX;
        game.listeners.mousePositionY = canvasRect.top*-1 + event.pageY;
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
