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
});
