document.addEventListener('DOMContentLoaded', () => {
  // Scroll reveal
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  const onReveal = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-show');
        observer.unobserve(entry.target);
      }
    });
  };
  const revealObserver = new IntersectionObserver(onReveal, {
    root: null,
    threshold: 0.15
  });
  revealEls.forEach(el => revealObserver.observe(el));

  // Count up animation for stats
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  const animateCount = (el, to, duration = 1200) => {
    const from = 0;
    const start = performance.now();
    const format = (n) => {
      // Add simple formatting for larger numbers
      if (to >= 10000) return Math.round(n).toLocaleString();
      return Math.round(n).toString();
    };
    const frame = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);
      const current = from + (to - from) * eased;
      el.textContent = format(current);
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  const countEls = Array.from(document.querySelectorAll('.countup'));
  const onCount = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        animateCount(el, target);
        observer.unobserve(el);
      }
    });
  };
  const countObserver = new IntersectionObserver(onCount, {
    root: null,
    threshold: 0.4
  });
  countEls.forEach(el => countObserver.observe(el));

  // Login page interactions
  const pwdInput = document.getElementById('password');
  const toggleBtn = document.querySelector('.password-toggle');
  if (pwdInput && toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const showing = pwdInput.getAttribute('type') === 'text';
      pwdInput.setAttribute('type', showing ? 'password' : 'text');
      const icon = toggleBtn.querySelector('[data-feather]');
      if (icon) {
        icon.setAttribute('data-feather', showing ? 'eye' : 'eye-off');
        // Re-render icon
        if (window.feather) window.feather.replace();
      }
    });
  }

  // 3D tilt effect on login panel
  const panel = document.querySelector('.login-form-wrapper');
  const panelContainer = document.querySelector('.login-form-container');
  if (panel && panelContainer) {
    const maxTilt = 6; // degrees
    const damp = 12; // smoothing
    let rx = 0, ry = 0; // current rotation
    let animFrame;

    const update = () => {
      panel.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      animFrame = null;
    };

    const onMove = (e) => {
      const rect = panel.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const targetRy = Math.max(-1, Math.min(1, dx)) * maxTilt;
      const targetRx = Math.max(-1, Math.min(1, -dy)) * maxTilt;
      rx += (targetRx - rx) / damp;
      ry += (targetRy - ry) / damp;
      if (!animFrame) animFrame = requestAnimationFrame(update);
    };

    const reset = () => {
      rx = 0; ry = 0;
      panel.style.transform = '';
    };

    panelContainer.addEventListener('mousemove', onMove);
    panelContainer.addEventListener('mouseleave', reset);
  }

  // Ripple effect for buttons with [data-ripple]
  document.querySelectorAll('[data-ripple]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  // Simple client-side required validation and gentle shake
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      const user = document.getElementById('username');
      const pass = document.getElementById('password');
      let ok = true;
      [user, pass].forEach((el) => {
        if (!el || !el.value.trim()) {
          ok = false;
          const group = el.closest('.input-group');
          group?.classList.add('shake');
          setTimeout(() => group?.classList.remove('shake'), 400);
          el?.focus();
        }
      });
      if (!ok) e.preventDefault();
    });
  }
});
