import { initAnimations } from './animations';
import { initPrefetch } from './prefetch';
import { initCopyEmail } from './ui/copy-email';

document.querySelectorAll('[data-split]').forEach((el) => {
  const text = el.textContent?.trim() ?? '';
  el.innerHTML = text
    .split(/\s+/)
    .map((w) => `<span class="w">${w}</span>`)
    .join(' ');
});

initAnimations();
initPrefetch();
initCopyEmail();
