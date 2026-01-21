// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function() {
      siteNav.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Close nav when clicking a link
    siteNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        siteNav.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  // Header scroll effect
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
    } else {
      header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
  });

  // Lightbox Gallery
  initLightbox();
});

function initLightbox() {
  const gallery = document.querySelector('.photo-gallery');
  if (!gallery) return;

  const photos = gallery.querySelectorAll('.photo-item');
  if (photos.length === 0) return;

  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  // Create lightbox elements
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-overlay"></div>
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-prev" aria-label="Previous">&lsaquo;</button>
      <button class="lightbox-next" aria-label="Next">&rsaquo;</button>
      <div class="lightbox-image-container">
        <img class="lightbox-image" src="" alt="">
      </div>
      <div class="lightbox-counter"></div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const overlay = lightbox.querySelector('.lightbox-overlay');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const image = lightbox.querySelector('.lightbox-image');
  const counter = lightbox.querySelector('.lightbox-counter');
  const imageContainer = lightbox.querySelector('.lightbox-image-container');

  // Get all image sources
  const imageSources = Array.from(photos).map(photo => {
    const img = photo.querySelector('img');
    return {
      src: img.src,
      alt: img.alt
    };
  });

  function openLightbox(index) {
    currentIndex = index;
    updateImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateImage() {
    image.src = imageSources[currentIndex].src;
    image.alt = imageSources[currentIndex].alt;
    counter.textContent = `${currentIndex + 1} / ${imageSources.length}`;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
    updateImage();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % imageSources.length;
    updateImage();
  }

  // Click handlers for gallery photos
  photos.forEach((photo, index) => {
    photo.style.cursor = 'pointer';
    photo.addEventListener('click', function(e) {
      e.preventDefault();
      openLightbox(index);
    });
  });

  // Lightbox controls
  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;

    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPrev();
        break;
      case 'ArrowRight':
        showNext();
        break;
    }
  });

  // Touch/swipe support
  imageContainer.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  imageContainer.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        showNext(); // Swipe left = next
      } else {
        showPrev(); // Swipe right = prev
      }
    }
  }
}
