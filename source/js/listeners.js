function addListeners(service) {
    service.listeners = {};

    let clickEvent = function(event) {
        service.listeners.click = true;
    }

    service.worldCanvas.addEventListener("click", clickEvent);
    service.battleCanvas.addEventListener("click", clickEvent);

    let mousedownEvent = function(event) {
        service.listeners.mousedown = true;

        let canvasRect = service.worldCanvas.getBoundingClientRect();

        service.listeners.mousePositionX = event.clientX - canvasRect.left;
        service.listeners.mousePositionY = event.clientY - canvasRect.top;
    }

    service.worldCanvas.addEventListener("mousedown", mousedownEvent);
    service.battleCanvas.addEventListener("mousedown", mousedownEvent);

    let mousemoveEvent = function(event) {
        service.listeners.mousemove = true;

        let canvasRect = service.worldCanvas.getBoundingClientRect();

        service.listeners.mousePositionX = event.clientX - canvasRect.left;
        service.listeners.mousePositionY = event.clientY - canvasRect.top;
    }

    service.worldCanvas.addEventListener("mousemove", mousemoveEvent);
    service.battleCanvas.addEventListener("mousemove", mousemoveEvent);

    window.addEventListener("mouseup", function(event) {
        service.listeners.mousedown = false;
        service.listeners.mousemove = false;
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
