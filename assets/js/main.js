/**
 * Portfolio — Abhinav
 * main.js — All interactions, animations, and utilities
 *
 * Sections:
 *  1. Loader
 *  2. Custom Cursor
 *  3. Navigation (scroll spy, sticky, mobile drawer)
 *  4. Theme Toggle
 *  5. Typing Animation
 *  6. Scroll Reveal (IntersectionObserver)
 *  7. Skill Bars Animation
 *  8. Stats Counter
 *  9. Project Filtering
 * 10. Project Modal
 * 11. Contact Form (simulated)
 * 12. Back to Top
 * 13. Footer year
 * 14. Init
 */

'use strict';

/* ─── 0. Smooth Scroll (Lenis) ─────────────────────────────────────────── */
let lenis;
function initSmoothScroll() {
  if (typeof Lenis === 'undefined') return;
  
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  const hero = document.getElementById('hero');

  lenis.on('scroll', (e) => {
    if (hero) {
      const scrollY = e.scroll || window.scrollY;
      // Scroll the hero up at 40% of the normal scroll speed
      hero.style.transform = `translateY(${-scrollY * 0.4}px)`;
    }
  });

  requestAnimationFrame(raf);
}

/* ─── 1. Loader ─────────────────────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Hide loader after CSS animation (~1.3s) + small buffer
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Remove from DOM after transition so it doesn't block anything
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, 1400);
  });
}

/* ─── 3. Navigation ─────────────────────────────────────────────────────── */
function initNav() {
  const nav          = document.getElementById('nav');
  const navLinks     = document.querySelectorAll('.nav-link');
  const hamburger    = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay= document.getElementById('drawerOverlay');
  const mobileLinks  = document.querySelectorAll('.mobile-link');

  if (!nav) return;

  /* — Sticky scroll style — */
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on init

  /* — Scroll spy — */
  const sections = document.querySelectorAll('section[id]');

  const spyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, {
    rootMargin: `-${getNavHeight()}px 0px -60% 0px`,
    threshold: 0,
  });

  sections.forEach(s => spyObserver.observe(s));

  /* — Smooth scroll for all anchor links — */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      closeDrawer();
      
      if (lenis) {
        lenis.scrollTo(targetId, {
          offset: -getNavHeight(),
          duration: 1.5,
        });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* — Mobile drawer — */
  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeDrawer() : openDrawer();
  });

  drawerOverlay?.addEventListener('click', closeDrawer);
  mobileLinks.forEach(l => l.addEventListener('click', closeDrawer));

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDrawer();
  });
}

function getNavHeight() {
  return parseInt(getComputedStyle(document.documentElement)
    .getPropertyValue('--nav-h')) || 68;
}

/* ─── 4. Theme Toggle ───────────────────────────────────────────────────── */
function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  if (!btn) return;

  const STORAGE_KEY = 'portfolio-theme';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    
    // Swap theme icon
    if (icon) {
      icon.className = theme === 'light' ? 'ph ph-moon' : 'ph ph-sun';
    }

    // Swap nav logo
    const navLogo = document.getElementById('navLogo');
    if (navLogo) {
      navLogo.src = theme === 'light' ? 'assets/img/LightBG.svg' : 'assets/img/DarkBG.svg';
    }

    // Swap footer logo
    const footerLogo = document.getElementById('footerLogo');
    if (footerLogo) {
      footerLogo.src = theme === 'light' ? 'assets/img/LightBG.svg' : 'assets/img/DarkBG.svg';
    }
  }

  // Load saved or system preference
  const saved = localStorage.getItem(STORAGE_KEY);
  applyTheme(saved || (prefersDark.matches ? 'dark' : 'light'));

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Respond to system changes if user hasn't set a preference
  prefersDark.addEventListener('change', e => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

/* ─── 5. Typing Animation ───────────────────────────────────────────────── */
function initTyping() {
  const el = document.getElementById('typed-role');
  if (!el) return;

  const phrases = [
    'Full-stack Developer.',
    'AI Enthusiast.',
    'MCA Student.','MACE Kothamangalam.'
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let deleting    = false;
  let pauseTimer  = null;

  const TYPING_SPEED  = 65;   // ms per char when typing
  const DELETING_SPEED= 35;   // ms per char when deleting
  const PAUSE_AFTER   = 1800; // ms to hold completed phrase
  const PAUSE_BEFORE  = 400;  // ms before starting to type next phrase

  function tick() {
    const phrase = phrases[phraseIndex];

    if (!deleting) {
      // Type next character
      charIndex++;
      el.textContent = phrase.slice(0, charIndex);

      if (charIndex === phrase.length) {
        // Done typing — pause then delete
        pauseTimer = setTimeout(() => {
          deleting = true;
          tick();
        }, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPING_SPEED);
    } else {
      // Delete last character
      charIndex--;
      el.textContent = phrase.slice(0, charIndex);

      if (charIndex === 0) {
        // Done deleting — move to next phrase
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
      setTimeout(tick, DELETING_SPEED);
    }
  }

  // Start after a short delay so it feels natural after page load
  setTimeout(tick, 2200);
}

/* ─── 6. Scroll Reveal ──────────────────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!elements.length) return;

  // Use IntersectionObserver for perf — no scroll event polling
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once revealed, stop observing
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
  });

  elements.forEach(el => observer.observe(el));
}

/* ─── 7. Skill Bars ─────────────────────────────────────────────────────── */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.dataset.width || '0';
        // Small timeout so the reveal animation plays first
        setTimeout(() => {
          fill.style.width = width + '%';
        }, 200);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
}

/* ─── 8. Stats Counter ──────────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        animateCounter(el, 0, target, 1200);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el, from, to, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quart
    const eased    = 1 - Math.pow(1 - progress, 4);
    const value    = Math.round(from + (to - from) * eased);
    el.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = to; // ensure exact final value
    }
  }

  requestAnimationFrame(update);
}

/* ─── 9. Project Filtering ──────────────────────────────────────────────── */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          card.classList.remove('filtered-out');
          // Stagger the re-entrance
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });
}

/* ─── 10. Project Modal ─────────────────────────────────────────────────── */
function initProjectModal() {
  const modal     = document.getElementById('projectModal');
  const backdrop  = document.getElementById('modalBackdrop');
  const closeBtn  = document.getElementById('modalClose');
  const cards     = document.querySelectorAll('.project-card');
  if (!modal) return;

  // Modal content targets
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle    = document.getElementById('modalTitle');
  const modalDesc     = document.getElementById('modalDesc');
  const modalTags     = document.getElementById('modalTags');
  const modalLiveLink = document.getElementById('modalLiveLink');
  const modalGhLink   = document.getElementById('modalGhLink');

  function openModal(card) {
    // Populate modal from card data attributes
    const category = card.querySelector('.project-category')?.textContent || '';
    const title    = card.dataset.title || '';
    const desc     = card.dataset.desc  || '';
    const tags     = (card.dataset.tags || '').split(',').filter(Boolean);
    const liveLink = card.dataset.link   || '#';
    const ghLink   = card.dataset.github || '#';

    if (modalCategory) modalCategory.textContent = category;
    if (modalTitle)    modalTitle.textContent    = title;
    if (modalDesc)     modalDesc.textContent     = desc;

    if (modalTags) {
      modalTags.innerHTML = tags
        .map(t => `<span class="ttag">${t.trim()}</span>`)
        .join('');
    }

    if (modalLiveLink) {
      if (!liveLink || liveLink === '#' || liveLink === ghLink) {
        modalLiveLink.style.display = 'none';
      } else {
        modalLiveLink.style.display = 'inline-flex';
        modalLiveLink.href = liveLink;
      }
    }
    if (modalGhLink) modalGhLink.href   = ghLink;

    // Show modal
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    closeBtn?.focus();
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Open on card click/Enter
  cards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  // Close handlers
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });
}

/* ─── 11. Contact Form ──────────────────────────────────────────────────── */
function initContactForm() {
  const form      = document.getElementById('contactForm');
  const statusEl  = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Basic validation
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      showStatus('Please fill in all fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate sending (replace with your actual API endpoint)
    setSubmitting(true);

    try {
      await simulateSend({ name, email, subject, message });
      showStatus('Message sent! I\'ll get back to you soon.', 'success');
      form.reset();
    } catch (err) {
      showStatus('Something went wrong. Please try again or email me directly.', 'error');
    } finally {
      setSubmitting(false);
    }
  });

  function setSubmitting(loading) {
    if (!submitBtn) return;
    const label = submitBtn.querySelector('.btn-label');
    submitBtn.disabled = loading;
    if (label) {
      label.textContent = loading ? 'Sending…' : 'Send Message';
    }
  }

  function showStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className   = 'form-note ' + type;
    // Auto-clear after 6 seconds
    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className   = 'form-note';
    }, 6000);
  }

  // Simulates a network request — replace with real fetch() call
  function simulateSend(data) {
    console.log('Form data:', data); // For development
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Resolve 95% of the time to simulate success
        Math.random() > 0.05 ? resolve() : reject(new Error('Network error'));
      }, 1500);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Live input feedback — highlight border on focus/fill
  const inputs = form.querySelectorAll('.form-input, .form-textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.style.borderColor = input.value ? '' : '';
    });
  });
}

/* ─── 12. Back to Top ───────────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const SHOW_THRESHOLD = 400; // px scrolled before showing

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > SHOW_THRESHOLD);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─── 13. Footer Year ───────────────────────────────────────────────────── */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ─── 14. Parallax orbs (subtle, requestAnimationFrame) ─────────────────── */
function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  let scrollY = 0;

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        orbs.forEach((orb, i) => {
          const speed = (i + 1) * 0.03;
          orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ─── 15. Reduced motion respect ────────────────────────────────────────── */
function respectReducedMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable CSS animation-duration globally
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
      }
    `;
    document.head.appendChild(style);

    // Mark reveals as immediately visible
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
      .forEach(el => el.classList.add('visible'));
  }
}

/* ─── Init all ──────────────────────────────────────────────────────────── */
function init() {
  respectReducedMotion();
  initSmoothScroll();
  initLoader();
  initNav();
  initTheme();
  initTyping();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initProjectFilter();
  initProjectModal();
  initContactForm();
  initBackToTop();
  initFooterYear();
  initParallax();
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
