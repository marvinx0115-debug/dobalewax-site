/**
 * DobaleWax — Main JavaScript
 * Navigation, Scroll Effects, FAQ, Form
 */

(function () {
  'use strict';

  // ── NAVBAR SCROLL ──────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  let ticking = false;

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  // ── MOBILE NAV ─────────────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ── SMOOTH SCROLL (polyfill for CSS scroll-behavior) ────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    });
  });

  // ── SCROLL REVEAL ───────────────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.gallery-item, .fabric-card, .step, .about-text, .about-visual, .faq-item'
  );

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up', 'visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(function (el) {
    el.classList.add('fade-up');
    revealObserver.observe(el);
  });

  // ── FAQ ACCORDION ───────────────────────────────────────────
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      document.querySelectorAll('.faq-q').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.hidden = true;
      });
      // Toggle current
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.hidden = false;
      }
    });
  });

  // ── ORDER FORM ──────────────────────────────────────────────
  const orderForm = document.getElementById('orderForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (orderForm) {
    // Client-side validation
    orderForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic required check
      const required = orderForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#C4532A';
          field.style.boxShadow = '0 0 0 3px rgba(196,83,42,.2)';
          valid = false;
        } else {
          field.style.borderColor = '';
          field.style.boxShadow = '';
        }
      });

      // Email validation
      const emailField = orderForm.querySelector('#email');
      if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
          emailField.style.borderColor = '#C4532A';
          emailField.style.boxShadow = '0 0 0 3px rgba(196,83,42,.2)';
          valid = false;
        }
      }

      if (!valid) {
        // Scroll to first invalid
        const firstInvalid = orderForm.querySelector('[style*="border-color: rgb(196"]');
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Show loading
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Collect form data
      const formData = new FormData(orderForm);
      const data = Object.fromEntries(formData.entries());

      // Log for development (replace with real endpoint)
      console.log('Order submitted:', data);

      // Simulate network delay
      setTimeout(function () {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        orderForm.hidden = true;
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1500);
    });

    // Clear error state on input
    orderForm.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        field.style.borderColor = '';
        field.style.boxShadow = '';
      });
    });
  }

  // ── COUNTER ANIMATION (stats) ───────────────────────────────
  function animateCounter(el, target, suffix) {
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);
      el.textContent = current + (suffix || '');
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + (suffix || '');
      }
    }
    requestAnimationFrame(update);
  }

  const statObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const num = parseInt(text, 10);
        if (!isNaN(num)) {
          const suffix = text.replace(String(num), '');
          animateCounter(el, num, suffix);
        }
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.astat-n').forEach(function (el) {
    statObserver.observe(el);
  });

  // ── PARALLAX ON HERO SWATCH ────────────────────────────────
  const heroCard = document.querySelector('.hero-card');
  if (heroCard) {
    window.addEventListener('mousemove', function (e) {
      const rect = heroCard.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;
      const tiltX = dy * -8;
      const tiltY = dx * 8;
      heroCard.style.transform = 'perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) scale(1.02)';
    });
    window.addEventListener('mouseleave', function () {
      heroCard.style.transform = 'rotate(-2deg)';
    });
  }

  // ── ACTIVE NAV LINK HIGHLIGHT ──────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', function () {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;
    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinksAll.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });

})();
