(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector('#theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  const preferredTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  function setTheme(theme) {
    root.dataset.theme = theme;
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  }

  setTheme(storedTheme || preferredTheme);
  themeToggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
  });

  document.querySelectorAll('[data-dialog-open]').forEach((trigger) => {
    trigger.addEventListener('click', () => document.getElementById(trigger.dataset.dialogOpen)?.showModal());
  });

  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      const rect = dialog.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!inside) dialog.close();
    });
  });

  const copyButton = document.querySelector('[data-copy-email]');
  copyButton?.addEventListener('click', async () => {
    const status = copyButton.parentElement.querySelector('.status');
    try {
      await navigator.clipboard.writeText(copyButton.dataset.copyEmail);
      status.textContent = 'Email address copied.';
    } catch {
      status.textContent = 'Copy unavailable. Select the address above.';
    }
  });

  const imageDialog = document.querySelector('#image-dialog');
  const imagePreview = imageDialog.querySelector('img');
  document.querySelectorAll('[data-gallery-src]').forEach((item) => {
    item.addEventListener('click', () => {
      imagePreview.src = item.dataset.gallerySrc;
      imagePreview.alt = item.querySelector('img').alt;
      imageDialog.showModal();
    });
  });

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const targets = document.querySelectorAll('.publication, .record, .service-list > div, .gallery-item');
    targets.forEach((item) => item.classList.add('reveal'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    targets.forEach((item) => observer.observe(item));
  }
})();
