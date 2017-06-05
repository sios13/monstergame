function addListeners(service) {
    service.listeners = {};

    let clickEvent = function(event) {
        if (event.which !== 1) {
            return;
        }

        event.preventDefault();

        service.listeners.click = true;
    }

    service.worldCanvas.addEventListener("click", clickEvent);
    service.battleCanvas.addEventListener("click", clickEvent);
    service.loadCanvas.addEventListener("click", clickEvent);

    let mousedownEvent = function(event) {
        if (event.which !== 1) {
            return;
        }

        service.listeners.mousedown = true;

        let canvasRect = service.worldCanvas.getBoundingClientRect();

        service.listeners.mousePositionX = event.clientX - canvasRect.left;
        service.listeners.mousePositionY = event.clientY - canvasRect.top;
    }

    service.worldCanvas.addEventListener("mousedown", mousedownEvent);
    service.battleCanvas.addEventListener("mousedown", mousedownEvent);
    service.loadCanvas.addEventListener("click", mousedownEvent);

    let mousemoveEvent = function(event) {
        event.preventDefault();

        service.listeners.mousemove = true;

        let canvasRect = service.worldCanvas.getBoundingClientRect();

        service.listeners.mousePositionX = event.clientX - canvasRect.left;
        service.listeners.mousePositionY = event.clientY - canvasRect.top;
    }

    service.worldCanvas.addEventListener("mousemove", mousemoveEvent);
    service.battleCanvas.addEventListener("mousemove", mousemoveEvent);
    service.loadCanvas.addEventListener("click", mousemoveEvent);

    window.addEventListener("mouseup", function(event) {
        service.listeners.mousedown = false;
        service.listeners.mousemove = false;
    });
}

module.exports = {
    addListeners: addListeners
}
