// Ensure video plays under strict file:/// and browser autoplay policies
document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('bg-video');
  if (video) {
    video.muted = true;
    video.play().catch((err) => {
      console.warn('Autoplay waiting for user interaction:', err);
    });
  }
});
