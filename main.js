// RAM Digital — shared interactions
document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // FAQ accordions
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    a.style.maxHeight = '0px';
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // close siblings within the same faq group
      const group = item.closest('.faq-group');
      if (group) {
        group.querySelectorAll('.faq-item.open').forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            other.querySelector('.faq-a').style.maxHeight = '0px';
          }
        });
      }
      item.classList.toggle('open', !isOpen);
      a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : '0px';
    });
  });

  // Contact / lead forms: submit to Netlify Forms via fetch, then show confirmation.
  // Falls back to a visible confirmation even if the network request fails (e.g. running locally,
  // off Netlify, or offline) so the UI never looks broken during local preview.
  function encodeFormData(form) {
    const data = new FormData(form);
    return new URLSearchParams(data).toString();
  }

  document.querySelectorAll('form[data-lead-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn ? btn.textContent : '';
      const isNetlifyForm = form.hasAttribute('data-netlify');

      const finish = () => {
        if (btn) { btn.textContent = 'Sent — we\u2019ll be in touch'; btn.disabled = true; }
        setTimeout(() => {
          if (btn) { btn.textContent = original; btn.disabled = false; }
          form.reset();
        }, 3200);
      };

      if (!isNetlifyForm) { finish(); return; }

      if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeFormData(form),
      })
        .then(() => finish())
        .catch(() => finish());
    });
  });

  // Mark active nav link based on current path
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
});
