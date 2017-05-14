module.exports = function() {
    let service = {};

    // Add some nice functions to the service
    service.pauseAudio = function(audio) {
        let fadeAudio = setInterval(function() {
            if (audio.volume <= 0.010) {
                audio.volume = 0;

                audio.pause();

                clearInterval(fadeAudio);

                return;
            }

            audio.volume -= 0.010;
        }, 10);
    }

    service.playAudio = function(audio) {
        audio.play();

        let fadeAudio = setInterval(function() {
            if (audio.volume >= 0.990) {
                audio.volume = 1;

                clearInterval(fadeAudio);

                return;
            }

            audio.volume += 0.010;
        }, 30);
    }

    return service;
};
