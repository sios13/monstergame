window.addEventListener("load", function() {
    let canvas = document.querySelector("canvas");
    let context = canvas.getContext("2d");

    setInterval(frame, 1000/10);

    // GAME
    let isMousedown = false;
    let isMousemove = false;

    let x = 0.0;
    let y = 0.0;

    let mousePositionX = 0;
    let mousePositionY = 0;

    function frame() {
        update();
        render();
    }

    function update() {
        if (isMousedown) {
/*            console.log("Mouse X: " + mousePositionX);
            console.log("Mouse Y: " + mousePositionY);*/

            let deltaX = mousePositionX / (mousePositionX+mousePositionY);
            let deltaY = mousePositionY / (mousePositionX+mousePositionY);

            let multiplier = 10.0;

            deltaX *= multiplier;
            deltaY *= multiplier;

            if ((x - mousePositionX) > 0) {
                deltaX *= -1;
            }

            if ((y - mousePositionY) > 0) {
                deltaY *= -1;
            }

            console.log("Delta X: " + deltaX);
            console.log("Delta Y: " + deltaY);

            x += deltaX;
            y += deltaY;
        }
    }

    function render() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        context.beginPath();
        context.rect(x,y,150,100);
        context.stroke();
        context.closePath();
    }

    canvas.addEventListener("mousedown", function(e) {
        isMousedown = true;

        mousePositionX = window.event.clientX;
        mousePositionY = window.event.clientY;
    });

    canvas.addEventListener("mousemove", function(e) {
/*        isMousemove = true;

        mousePositionX = window.event.clientX;
        mousePositionY = window.event.clientY;*/
    });

    canvas.addEventListener("mouseup", function(e) {
        isMousedown = false;
        isMousemove = false;
    });

    canvas.addEventListener("keydown", function(e) {
        alert("mousedown");
    });
/*
    context.fillStyle = "black";

    // Start render loop
    frames = 0;
    startTime = performance.now();
    tick();

    function tick(ms) {
        // Clear canvas before rendering
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate framerate
        let time = (ms - startTime)/1000;
        let fps = frames++/time;
        console.log(startTime);

        // Output framerate to canvas
        context.font = "36px Georgia";
        context.fillText(fps, 200, 200);

        // Request next frame
        requestAnimationFrame(tick);
    }*/
});
