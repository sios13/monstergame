module.exports = {
    pauseAudio: function(audio) {
        let fadeAudio1 = setInterval(function() {
            if (audio.volume <= 0.025) {
                audio.pause();

                clearInterval(fadeAudio1);

                return;
            }

            audio.volume -= 0.025;
        }, 25);
    },
    playAudio: function(audio) {
        audio.play();

        let fadeAudio2 = setInterval(function() {
            if (audio.volume >= 0.975) {
                clearInterval(fadeAudio2);

                return;
            }

            audio.volume += 0.025;
        }, 25);
    }
};
