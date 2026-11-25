/**
 * DEF CON Radio - Main Script
 * Minimal: Top-Right Radio Live Stream Controller (from valentina)
 */

document.addEventListener('DOMContentLoaded', () => {
  initRadioPlayer();
});

/**
 * Real-time Live Radio Player (from valentina)
 */
function initRadioPlayer() {
  const audio = document.getElementById('radioAudio');
  const playBtn = document.getElementById('radioPlayBtn');
  const playIcon = document.getElementById('radioPlayIcon');

  if (!audio || !playBtn || !playIcon) return;

  // Set default volume (0.2 from valentina)
  audio.volume = 0.2;
  audio.referrerPolicy = 'no-referrer';

  // Synphaera Radio (Space Music) from SomaFM
  const STREAM_URL = 'https://ice6.somafm.com/synphaera-128-mp3';
  // MANGO radio stream (saved for later):
  // const STREAM_URL = 'https://stream.laut.fm/mangoradio';

  function playStream() {
    if (!audio.getAttribute('src')) {
      audio.src = STREAM_URL;
      audio.load();
    }
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          playBtn.classList.add('playing');
          playIcon.textContent = '❚❚';
        })
        .catch((err) => {
          // Autoplay blocked by browser policy until user gesture
          console.warn('Autoplay blocked, awaiting user click:', err);
          playBtn.classList.remove('playing');
          playIcon.textContent = '▶';
        });
    }
  }

  function pauseStream() {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    playBtn.classList.remove('playing');
    playIcon.textContent = '▶';
  }

  // Toggle button click
  playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused || !audio.getAttribute('src')) {
      playStream();
    } else {
      pauseStream();
    }
  });
}
