/* ============================================
   FryCuisine — Homepage Scripts
   Hero slider + header scroll state + mobile nav + scroll reveal
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Hero Slider ---------- */
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('slider-dots');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  let current = slides.findIndex(s => s.classList.contains('is-active'));
  if (current === -1) current = 0;

  const AUTOPLAY_MS = 6400;
  let autoplayTimer = null;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === current ? ' is-active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i, true));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('.slider-dot'));

  function render() {
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
  }

  function goTo(index, userInitiated) {
    current = (index + slides.length) % slides.length;
    render();
    if (userInitiated) restartAutoplay();
  }

  function next() { goTo(current + 1); }
  function prevSlide() { goTo(current - 1); }

  prevBtn.addEventListener('click', () => goTo(current - 1, true));
  nextBtn.addEventListener('click', () => goTo(current + 1, true));

  function startAutoplay() {
    autoplayTimer = setInterval(next, AUTOPLAY_MS);
  }
  function restartAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  if (slides.length > 1) {
    render();
    startAutoplay();

    // Pause on hover/focus for accessibility
    const heroEl = document.getElementById('hero');
    heroEl.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    heroEl.addEventListener('mouseleave', startAutoplay);
  }

  /* Basic swipe support for touch devices */
  const sliderEl = document.getElementById('hero-slider');
  let touchStartX = 0;
  sliderEl.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  sliderEl.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) goTo(current + 1, true);
      else goTo(current - 1, true);
    }
  }, { passive: true });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Newsletter form (demo handler) ---------- */
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Subscribed ✓';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        this.reset();
      }, 2400);
    });
  }

});

