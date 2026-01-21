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

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
    } else {
      header.style.boxShadow = 'none';
    }
  });

  // Lightbox Gallery
  initLightbox();
});

function initLightbox() {
  const gallery = document.querySelector('.photo-gallery');
  if (!gallery) return;

  // Don't create duplicate if lightbox already exists (from inline script)
  if (document.getElementById('lightbox')) return;

  const photos = Array.from(gallery.querySelectorAll('.photo-item'));
  if (photos.length === 0) return;

  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  // Get all image sources
  const imageSources = photos.map(function(photo) {
    const img = photo.querySelector('img');
    return {
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt') || ''
    };
  });

  // Create lightbox elements
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML =
    '<div class="lightbox-overlay"></div>' +
    '<div class="lightbox-content">' +
      '<button class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button class="lightbox-prev" aria-label="Previous">&#8249;</button>' +
      '<button class="lightbox-next" aria-label="Next">&#8250;</button>' +
      '<div class="lightbox-image-container">' +
        '<img class="lightbox-image" src="" alt="">' +
      '</div>' +
      '<div class="lightbox-counter"></div>' +
    '</div>';
  document.body.appendChild(lightbox);

  const overlay = lightbox.querySelector('.lightbox-overlay');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const image = lightbox.querySelector('.lightbox-image');
  const counter = lightbox.querySelector('.lightbox-counter');
  const imageContainer = lightbox.querySelector('.lightbox-image-container');

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
    image.setAttribute('src', imageSources[currentIndex].src);
    image.setAttribute('alt', imageSources[currentIndex].alt);
    counter.textContent = (currentIndex + 1) + ' / ' + imageSources.length;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
    updateImage();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % imageSources.length;
    updateImage();
  }

  // Click handlers for gallery photos - attach to both figure and img
  photos.forEach(function(photo, index) {
    photo.style.cursor = 'pointer';

    photo.addEventListener('click', function(e) {
      e.stopPropagation();
      openLightbox(index);
    });
  });

  // Lightbox controls
  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeLightbox();
  });

  overlay.addEventListener('click', closeLightbox);

  prevBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    showPrev();
  });

  nextBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    showNext();
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    } else if (e.key === 'ArrowRight') {
      showNext();
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
    var swipeThreshold = 50;
    var diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        showNext();
      } else {
        showPrev();
      }
    }
  }
}
