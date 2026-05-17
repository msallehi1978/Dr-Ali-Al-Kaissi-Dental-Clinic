/* ============================================================
   DR. ALI AL KAISSI DENTAL CLINIC — MAIN JS
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar ── */
  const navbar    = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu   = document.querySelector('.nav-menu');
  const isHero    = !!document.querySelector('.hero');

  function updateNavbar() {
    const scrolled = window.scrollY > 60;
    if (isHero) {
      navbar.classList.toggle('scrolled', scrolled);
      navbar.classList.toggle('transparent', !scrolled);
    } else {
      navbar.classList.add('scrolled');
      navbar.classList.remove('transparent');
    }
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ── Mobile menu ── */
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const open = navMenu.classList.toggle('open');
      this.setAttribute('aria-expanded', open);
      this.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  document.querySelectorAll('.nav-link, .nav-book').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
      if (navToggle) {
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', false);
      }
    });
  });

  /* ── Active nav link ── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Fade-up scroll reveal ── */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const fadeObserver = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); fadeObserver.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );
    fadeEls.forEach(el => fadeObserver.observe(el));
  }

  /* ── Counter animation ── */
  function animateCount(el) {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 2000;
    const start    = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(tick);
  }

  const counterEls = document.querySelectorAll('.stat-number[data-count]');
  if (counterEls.length) {
    const counterObserver = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting && !e.target.dataset.counted) {
          e.target.dataset.counted = '1';
          animateCount(e.target);
        }
      }),
      { threshold: 0.5 }
    );
    counterEls.forEach(el => counterObserver.observe(el));
  }

  /* ── Services sticky quick-nav ── */
  const servicesNav = document.querySelector('.services-nav');
  if (servicesNav) {
    const navLinks = servicesNav.querySelectorAll('.services-nav-link[href^="#"]');
    const sections = Array.from(navLinks)
      .map(l => document.querySelector(l.getAttribute('href')))
      .filter(Boolean);

    const secObserver = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const id = '#' + e.target.id;
            navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
          }
        });
      },
      { threshold: 0.25, rootMargin: '-80px 0px -50% 0px' }
    );
    sections.forEach(s => secObserver.observe(s));

    navLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          const offset = servicesNav.offsetHeight + navbar.offsetHeight;
          window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        }
      });
    });
  }

  /* ── Appointment form ── */
  const form = document.getElementById('appointmentForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        form.style.display = 'none';
        const success = document.getElementById('formSuccess');
        if (success) {
          success.classList.add('show');
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1200);
    });
  }

})();
