/**
 * DEF CON Radio - Main Script
 * Minimal: Top-Right Radio Live Stream Controller with Live Track Ticker
 */

document.addEventListener('DOMContentLoaded', () => {
  initRadioPlayer();
});

/**
 * Real-time Live Radio Player with Track Metadata Ticker
 */
function initRadioPlayer() {
  const audio = document.getElementById('radioAudio');
  const playBtn = document.getElementById('radioPlayBtn');
  const playIcon = document.getElementById('radioPlayIcon');
  const trackInfo = document.getElementById('radioTrackInfo');
  const trackText = document.getElementById('radioTrackText');

  if (!audio || !playBtn || !playIcon) return;

  // Set default volume (0.2 from valentina)
  audio.volume = 0.2;
  audio.referrerPolicy = 'no-referrer';

  // Synphaera Radio (Space Music) from SomaFM (commented out):
  // const STREAM_URL = 'https://ice6.somafm.com/synphaera-128-mp3';
  // const TRACK_METADATA_URL = 'https://somafm.com/songs/synphaera.json';

  // DEF CON Radio, http://somafm.com/defcon.pls
  const STREAM_URL = 'https://ice6.somafm.com/defcon-128-mp3';
  const TRACK_METADATA_URL = 'https://somafm.com/songs/defcon.json';
  let pollTimer = null;

  async function fetchTrackInfo() {
    try {
      const res = await fetch(TRACK_METADATA_URL, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.songs && data.songs.length > 0) {
        const currentSong = data.songs[0];
        const title = currentSong.title ? currentSong.title.trim() : '';
        const artist = currentSong.artist ? currentSong.artist.trim() : '';
        const fullTrack = artist && title ? `${artist} — ${title}` : (title || artist);
        if (fullTrack && trackText) {
          if (trackText.textContent !== fullTrack) {
            trackText.textContent = fullTrack;
          }
          if (trackInfo) {
            trackInfo.classList.add('visible');
          }
        }
      }
    } catch (err) {
      console.warn('Could not fetch track metadata:', err);
    }
  }

  function startTrackPolling() {
    fetchTrackInfo();
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(fetchTrackInfo, 15000);
  }

  function stopTrackPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
    if (trackInfo) {
      trackInfo.classList.remove('visible');
    }
  }

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
          startTrackPolling();
        })
        .catch((err) => {
          // Autoplay blocked by browser policy until user gesture
          console.warn('Autoplay blocked, awaiting user click:', err);
          playBtn.classList.remove('playing');
          playIcon.textContent = '▶';
          stopTrackPolling();
        });
    }
  }

  function pauseStream() {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    playBtn.classList.remove('playing');
    playIcon.textContent = '▶';
    stopTrackPolling();
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
