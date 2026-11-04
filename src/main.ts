import { initAnimations } from './animations';
import { initPrefetch } from './prefetch';

document.querySelectorAll('[data-split]').forEach((el) => {
  const text = el.textContent?.trim() ?? '';
  el.innerHTML = text
    .split(/\s+/)
    .map((w) => `<span class="w">${w}</span>`)
    .join(' ');
});

initAnimations();
initPrefetch();

const copyMail = document.getElementById('copyMail');
if (copyMail) {
  copyMail.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    try {
      await navigator.clipboard.writeText('poswalarnav37@gmail.com');
      btn.textContent = 'Copied';
      window.setTimeout(() => {
        btn.textContent = 'Copy';
      }, 1800);
    } catch {
      btn.textContent = 'Press Ctrl+C';
    }
  });
}
