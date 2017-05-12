module.exports = {
    pauseAudio: function(audio) {
        let fadeAudio1 = setInterval(function() {
            if (audio.volume <= 0.010) {
                audio.pause();

                clearInterval(fadeAudio1);

                return;
            }

            audio.volume -= 0.010;
        }, 10);
    },
    playAudio: function(audio) {
        audio.play();

        let fadeAudio2 = setInterval(function() {
            if (audio.volume >= 0.990) {
                clearInterval(fadeAudio2);

                return;
            }

            audio.volume += 0.010;
        }, 25);
    }
};
