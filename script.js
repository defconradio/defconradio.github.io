/**
 * Personal Site - 1-Item Carousel & Navigation Controller
 * Lightweight vanilla JavaScript
 */

(function () {
  'use strict';

  // Elements
  const track = document.getElementById('carouselTrack');
  const items = Array.from(document.querySelectorAll('.carousel-item'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const counterCurrent = document.getElementById('counterCurrent');
  const counterTotal = document.getElementById('counterTotal');
  const dotsWrapper = document.getElementById('dotsWrapper');
  const navButtons = Array.from(document.querySelectorAll('.nav-btn[data-slide]'));
  const toast = document.getElementById('toast');

  if (!track || items.length === 0) return;

  let currentIndex = 0;
  const total = items.length;

  // Set total count
  if (counterTotal) {
    counterTotal.textContent = String(total).padStart(2, '0');
  }

  // Create indicator dots dynamically if wrapper exists
  if (dotsWrapper) {
    dotsWrapper.innerHTML = '';
    items.forEach((item, index) => {
      const dot = document.createElement('button');
      dot.className = `dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsWrapper.appendChild(dot);
    });
  }

  const dots = dotsWrapper ? Array.from(dotsWrapper.querySelectorAll('.dot')) : [];

  // Hide or disable controls if only 1 slide exists
  if (total <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (dotsWrapper) dotsWrapper.style.display = 'none';
  }

  /**
   * Navigate to target slide index
   */
  function goToSlide(index, updateHash = true) {
    if (index < 0) index = 0;
    if (index >= total) index = total - 1;

    currentIndex = index;

    // Apply translation (each item is 100% width)
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update counter
    if (counterCurrent) {
      counterCurrent.textContent = String(currentIndex + 1).padStart(2, '0');
    }

    // Update prev/next buttons
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === total - 1;

    // Update dot indicators
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });

    // Update nav tabs
    navButtons.forEach((btn) => {
      const targetIndex = parseInt(btn.dataset.slide, 10);
      btn.classList.toggle('active', targetIndex === currentIndex);
    });

    // Update URL hash for direct bookmarking/sharing
    const activeSlide = items[currentIndex];
    if (updateHash && activeSlide && activeSlide.id) {
      history.replaceState(null, '', `#${activeSlide.id}`);
    }

    // Scroll active slide content to top on navigation
    if (activeSlide) {
      activeSlide.scrollTop = 0;
    }
  }

  // Next / Prev listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  }

  // Nav buttons click
  navButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const slideIndex = parseInt(btn.dataset.slide, 10);
      if (!isNaN(slideIndex)) {
        goToSlide(slideIndex);
      }
    });
  });

  // Keyboard navigation: Left & Right arrows
  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      if (currentIndex < total - 1) {
        goToSlide(currentIndex + 1);
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      if (currentIndex > 0) {
        goToSlide(currentIndex - 1);
      }
    } else if (e.key === 'Home') {
      goToSlide(0);
    } else if (e.key === 'End') {
      goToSlide(total - 1);
    }
  });

  // Touch Swipe for mobile phones
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const swipeThreshold = 45;

  const carouselViewport = document.querySelector('.carousel-viewport');
  if (carouselViewport) {
    carouselViewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    carouselViewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipeGesture();
    }, { passive: true });
  }

  function handleSwipeGesture() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Only trigger if horizontal swipe is significantly greater than vertical scroll
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
      if (deltaX < 0) {
        // Swiped left -> Go Next
        if (currentIndex < total - 1) goToSlide(currentIndex + 1);
      } else {
        // Swiped right -> Go Prev
        if (currentIndex > 0) goToSlide(currentIndex - 1);
      }
    }
  }

  // Parse URL hash on initial load
  function initFromHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const matchIndex = items.findIndex((item) => item.id === hash);
      if (matchIndex !== -1) {
        goToSlide(matchIndex, false);
        return;
      }
    }
    goToSlide(0, false);
  }

  initFromHash();

  window.addEventListener('hashchange', () => {
    initFromHash();
  });

  // Copy to clipboard helper
  window.copyText = function (text, message = 'Copied to clipboard') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(message);
      }).catch(() => {
        fallbackCopy(text, message);
      });
    } else {
      fallbackCopy(text, message);
    }
  };

  function fallbackCopy(text, message) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast(message);
    } catch (err) {
      console.error('Could not copy', err);
    }
    document.body.removeChild(textarea);
  }

  let toastTimeout;
  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }
})();
