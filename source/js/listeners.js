function addListeners(game) {
    game.listeners = {};

    let clickEvent = function(event) {
        game.listeners.click = true;
    }

    game.worldCanvas.addEventListener("click", clickEvent);
    game.battleCanvas.addEventListener("click", clickEvent);

    game.canvas.addEventListener("mousedown", function(event) {
        game.listeners.mousedown = true;

        let canvasRect = game.canvas.getBoundingClientRect();

        game.listeners.mousePositionX = event.clientX - canvasRect.left;
        game.listeners.mousePositionY = event.clientY - canvasRect.top;
    });

    let mousemoveEvent = function(event) {
        game.listeners.mousemove = true;

        let canvasRect = game.canvas.getBoundingClientRect();

        game.listeners.mousePositionX = event.clientX - canvasRect.left;
        game.listeners.mousePositionY = event.clientY - canvasRect.top;
    }

    game.worldCanvas.addEventListener("mousemove", mousemoveEvent);
    game.battleCanvas.addEventListener("mousemove", mousemoveEvent);

    window.addEventListener("mouseup", function(event) {
        game.listeners.mouseup = true;

        game.listeners.mousedown = false;
        game.listeners.mousemove = false;
    });
}

// function isInsideBox(x1, y1, x2, y2) {
//     let x = game.listeners.mousePositionX;
//     let y = game.listeners.mousePositionY;

//     if (x > x1 && y > y1 && x < x2 && y < y2) {
//         return true;
//     }

//     return false;
// }

module.exports = {
    addListeners: addListeners,
    // isInsideBox: isInsideBox
}
