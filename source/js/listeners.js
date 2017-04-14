function addListeners(game) {
    game.listeners = {};

    game.canvas.addEventListener("click", function(event) {
        game.listeners.click = true;
    });

    game.canvas.addEventListener("mousedown", function(event) {
        game.listeners.mousedown = true;

        let canvasRect = game.canvas.getBoundingClientRect();

        game.listeners.mousePositionX = event.clientX - canvasRect.left;
        game.listeners.mousePositionY = event.clientY - canvasRect.top;
    });

    game.canvas.addEventListener("mousemove", function(event) {
        game.listeners.mousemove = true;

        let canvasRect = game.canvas.getBoundingClientRect();

        game.listeners.mousePositionX = event.clientX - canvasRect.left;
        game.listeners.mousePositionY = event.clientY - canvasRect.top;
    });

    window.addEventListener("mouseup", function(event) {
        game.listeners.mouseup = true;

        game.listeners.mousedown = false;
        game.listeners.mousemove = false;
    });

    game.canvas.addEventListener("keydown", function(event) {
        console.log("keydown");
    });
}

module.exports = {
    addListeners: addListeners
}
