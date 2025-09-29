// Helper: select
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

// Loader hide on ready
window.addEventListener('load', () => {
  $('#loader')?.classList.add('hide');
});

// Mobile nav
const toggleBtn = $('.nav__toggle');
const navMenu = $('.nav__menu');
if (toggleBtn && navMenu) {
  toggleBtn.addEventListener('click', () => {
    const open = navMenu.style.display === 'flex';
    navMenu.style.display = open ? 'none' : 'flex';
    toggleBtn.setAttribute('aria-expanded', String(!open));
  });
  // Close on link click (mobile)
  navMenu.addEventListener('click', e => {
    if (e.target.matches('a')) {
      navMenu.style.display = 'none';
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// Smooth scroll (native CSS scroll-behavior works; this is for older browsers)
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = $(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', id);
    }
  });
});

// Year in footer
$('#year').textContent = new Date().getFullYear();

// Intersection Observer: reveal sections & animate bars/circles
const onReveal = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Animate progress bars inside this section
      $$('.bar__fill', entry.target).forEach(bar => {
        requestAnimationFrame(() => bar.classList.add('animate'));
      });

      // Animate circles
      $$('.circle', entry.target).forEach(circle => {
        const p = parseInt(circle.dataset.percent || '0', 10);
        // clamp 0..100
        const percent = Math.max(0, Math.min(100, p));
        // Use CSS custom property to drive conic-gradient
        let start = 0;
        const duration = 900; // ms
        const t0 = performance.now();
        const step = t => {
          const k = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - k, 3);
          const val = start + (percent * 3.6 - start) * eased;
          circle.style.setProperty('--value', `${val}deg`);
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });

      observer.unobserve(entry.target);
    }
  });
};
const observer = new IntersectionObserver(onReveal, { threshold: 0.15 });
$$('.reveal').forEach(el => observer.observe(el));

// Back-to-top keyboard focus ring improvement
$('.back-to-top')?.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    $('#home')?.scrollIntoView({ behavior: 'smooth' });
  }
});

// Demo form (no backend) — show a friendly message
const form = $('.contact__form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const msg = $('#message').value.trim();
    const note = $('.form__note');
    if (!name || !email || !msg) {
      note.textContent = 'Vui lòng điền đầy đủ thông tin.';
      note.style.color = '#b91c1c';
      return;
    }
    note.textContent = 'Cảm ơn bạn! Đây là bản demo, thông điệp chưa được gửi đi.';
    note.style.color = '#0f766e';
    form.reset();
  });
}

// Accessibility: close menu on outside click (mobile)
document.addEventListener('click', e => {
  if (!navMenu) return;
  const withinMenu = navMenu.contains(e.target);
  const withinBtn = toggleBtn && toggleBtn.contains(e.target);
  const isVisible = navMenu.style.display === 'flex';
  if (isVisible && !withinMenu && !withinBtn) {
    navMenu.style.display = 'none';
    toggleBtn.setAttribute('aria-expanded', 'false');
  }
});
