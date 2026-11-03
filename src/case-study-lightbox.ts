import { bindScrollTargetLinks } from './scroll-restore';

bindScrollTargetLinks();

const box = document.getElementById('lightbox');
const img = document.getElementById('lb-img');
const cap = document.getElementById('lb-cap');
const closeBtn = box?.querySelector('.lb-close');
const main = document.querySelector('main');
const nav = document.querySelector('nav');

if (
  box instanceof HTMLElement &&
  img instanceof HTMLImageElement &&
  cap instanceof HTMLElement &&
  closeBtn instanceof HTMLButtonElement
) {
  const lightbox = box;
  const lbImg = img;
  const lbCap = cap;
  const lbClose = closeBtn;

  lightbox.setAttribute('aria-describedby', 'lb-cap');

  let lastFocus: HTMLElement | null = null;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;

  const pageChrome = [main, nav].filter(
    (el): el is HTMLElement => el instanceof HTMLElement,
  );

  function setPageHidden(hidden: boolean): void {
    for (const el of pageChrome) {
      el.setAttribute('aria-hidden', hidden ? 'true' : 'false');
    }
  }

  function openBox(btn: HTMLButtonElement): void {
    const shotImg = btn.querySelector('img');
    const figure = btn.closest('figure');
    const figcaption = figure?.querySelector('figcaption');
    if (!(shotImg instanceof HTMLImageElement) || !figcaption) return;

    if (closeTimer !== undefined) {
      clearTimeout(closeTimer);
      closeTimer = undefined;
    }

    lbImg.src = shotImg.currentSrc || shotImg.src;
    lbImg.alt = shotImg.alt;
    lbCap.textContent = figcaption.textContent;
    lastFocus = btn;
    lightbox.hidden = false;
    setPageHidden(true);
    requestAnimationFrame(() => lightbox.classList.add('open'));
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeBox(): void {
    if (closeTimer !== undefined) clearTimeout(closeTimer);
    lightbox.classList.remove('open');
    closeTimer = setTimeout(() => {
      lightbox.hidden = true;
      closeTimer = undefined;
    }, 350);
    document.body.style.overflow = '';
    setPageHidden(false);
    lastFocus?.focus();
  }

  document.querySelectorAll<HTMLButtonElement>('.shot-btn').forEach((b) => {
    b.addEventListener('click', () => openBox(b));
  });

  lbClose.addEventListener('click', closeBox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeBox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) closeBox();
  });
}
