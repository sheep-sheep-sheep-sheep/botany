(function () {
    var audioContext;
    var isPlaying = false;
    var scheduler;
    var noteIndex = 0;
    var melody = [261.63, 329.63, 392.0, 349.23, 329.63, 293.66];

    function ensureContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContext;
    }

    function playNote(frequency, duration) {
        var context = ensureContext();
        var oscillator = context.createOscillator();
        var gainNode = context.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.value = frequency;

        gainNode.gain.setValueAtTime(0.0001, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start();
        oscillator.stop(context.currentTime + duration);
    }

    function startMusic() {
        var context = ensureContext();
        context.resume();
        if (isPlaying) {
            return;
        }

        isPlaying = true;
        document.body.classList.add('music-on');

        scheduler = window.setInterval(function () {
            playNote(melody[noteIndex], 0.45);
            noteIndex = (noteIndex + 1) % melody.length;
        }, 500);
    }

    function stopMusic() {
        if (!isPlaying) {
            return;
        }

        isPlaying = false;
        document.body.classList.remove('music-on');
        window.clearInterval(scheduler);
    }

    function buildToggle() {
        var button = document.createElement('button');
        button.className = 'music-toggle';
        button.type = 'button';
        button.textContent = '♪ Music';
        button.setAttribute('aria-label', 'Toggle background music');

        button.addEventListener('click', function () {
            if (isPlaying) {
                stopMusic();
            } else {
                startMusic();
            }
        });

        document.body.appendChild(button);
    }

    document.addEventListener('DOMContentLoaded', function () {
        buildToggle();
        startMusic();

        window.addEventListener('pointerdown', function initialStart() {
            startMusic();
            window.removeEventListener('pointerdown', initialStart);
        }, { once: true });
    });
})();
