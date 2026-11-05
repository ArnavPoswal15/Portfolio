import { bindNavChromeToWindow } from './interactions';
import { bindScrollTargetLinks } from './scroll-restore';

bindScrollTargetLinks();
bindNavChromeToWindow();

const box = document.getElementById('lightbox');
const stage = document.getElementById('lb-stage');
const img = document.getElementById('lb-img');
const cap = document.getElementById('lb-cap');
const closeBtn = box?.querySelector('.lb-close');
const main = document.querySelector('main');
const nav = document.querySelector('nav[aria-label="Primary"]');

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (
  box instanceof HTMLElement &&
  stage instanceof HTMLElement &&
  img instanceof HTMLImageElement &&
  cap instanceof HTMLElement &&
  closeBtn instanceof HTMLButtonElement
) {
  const lightbox = box;
  const lbStage = stage;
  const lbImg = img;
  const lbCap = cap;
  const lbClose = closeBtn;

  const shots = [...document.querySelectorAll<HTMLButtonElement>('.shot-btn')];
  let shotIndex = 0;
  let lastFocus: HTMLElement | null = null;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;

  let scale = 1;
  let panX = 0;
  let panY = 0;
  let dragX = 0;
  let dragY = 0;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let activePointer: number | null = null;
  let pinchStartDist = 0;
  let pinchStartScale = 1;
  let lastTap = 0;

  const pageChrome = [main, nav].filter(
    (el): el is HTMLElement => el instanceof HTMLElement,
  );

  function setPageHidden(hidden: boolean): void {
    for (const el of pageChrome) {
      el.setAttribute('aria-hidden', hidden ? 'true' : 'false');
    }
  }

  function applyTransform(): void {
    lbStage.style.transform = `translate3d(${dragX + panX}px, ${dragY + panY}px, 0) scale(${scale})`;
    lightbox.style.opacity = String(
      Math.max(0.35, 1 - Math.max(0, dragY) / (window.innerHeight * 0.45)),
    );
  }

  function resetGestureState(): void {
    scale = 1;
    panX = 0;
    panY = 0;
    dragX = 0;
    dragY = 0;
    lbStage.style.transform = '';
    lightbox.style.opacity = '';
    lightbox.classList.remove('is-dragging', 'is-zoomed');
  }

  function loadShot(index: number): void {
    const btn = shots[index];
    if (!btn) return;
    const shotImg = btn.querySelector('img');
    const figure = btn.closest('figure');
    const figcaption = figure?.querySelector('figcaption');
    if (!(shotImg instanceof HTMLImageElement) || !figcaption) return;

    lbImg.src = shotImg.currentSrc || shotImg.src;
    lbImg.alt = shotImg.alt;
    lbCap.textContent = figcaption.textContent;
    shotIndex = index;
    resetGestureState();
  }

  function openBox(btn: HTMLButtonElement): void {
    const idx = shots.indexOf(btn);
    if (idx < 0) return;

    if (closeTimer !== undefined) {
      clearTimeout(closeTimer);
      closeTimer = undefined;
    }

    loadShot(idx);
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
    resetGestureState();
    closeTimer = setTimeout(() => {
      lightbox.hidden = true;
      closeTimer = undefined;
    }, 350);
    document.body.style.overflow = '';
    setPageHidden(false);
    lastFocus?.focus();
  }

  function springBack(): void {
    if (reduceMotion) {
      dragX = 0;
      dragY = 0;
      applyTransform();
      lightbox.classList.remove('is-dragging');
      return;
    }
    const startX = dragX;
    const startY = dragY;
    const start = performance.now();
    const duration = 380;
    const ease = (t: number): number => 1 - (1 - t) ** 3;

    const frame = (now: number): void => {
      const t = Math.min(1, (now - start) / duration);
      dragX = startX * (1 - ease(t));
      dragY = startY * (1 - ease(t));
      applyTransform();
      if (t < 1) requestAnimationFrame(frame);
      else {
        dragX = 0;
        dragY = 0;
        lightbox.classList.remove('is-dragging');
        lightbox.style.opacity = '';
      }
    };
    requestAnimationFrame(frame);
  }

  function goRelative(delta: number): void {
    if (shots.length < 2) return;
    let next = shotIndex + delta;
    if (next < 0) next = 0;
    if (next >= shots.length) next = shots.length - 1;
    if (next === shotIndex) {
      springBack();
      return;
    }
    loadShot(next);
  }

  shots.forEach((b) => {
    b.addEventListener('click', () => openBox(b));
  });

  lbClose.addEventListener('click', closeBox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox && scale === 1) closeBox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeBox();
    if (e.key === 'ArrowLeft') goRelative(-1);
    if (e.key === 'ArrowRight') goRelative(1);
  });

  lbStage.addEventListener('dblclick', (e) => {
    if (reduceMotion) return;
    e.preventDefault();
    if (scale > 1) {
      scale = 1;
      panX = 0;
      panY = 0;
      lightbox.classList.remove('is-zoomed');
    } else {
      scale = 2;
      lightbox.classList.add('is-zoomed');
    }
    applyTransform();
  });

  lbStage.addEventListener(
    'pointerdown',
    (e) => {
      if (e.button !== 0) return;
      const now = performance.now();
      if (now - lastTap < 320 && scale === 1) {
        scale = 2;
        lightbox.classList.add('is-zoomed');
        applyTransform();
        lastTap = 0;
        return;
      }
      lastTap = now;

      activePointer = e.pointerId;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      lbStage.setPointerCapture(e.pointerId);
      lightbox.classList.add('is-dragging');
    },
    { passive: true },
  );

  lbStage.addEventListener('pointermove', (e) => {
    if (activePointer !== e.pointerId) return;

    if (e.pointerType === 'touch' && e.isPrimary && e.buttons === 0 && scale > 1) {
      return;
    }

    const dx = e.clientX - pointerStartX;
    const dy = e.clientY - pointerStartY;

    if (scale > 1) {
      panX = dx;
      panY = dy;
      applyTransform();
      return;
    }

    dragX = dx;
    dragY = Math.max(0, dy);
    applyTransform();
  });

  lbStage.addEventListener('pointerup', (e) => {
    if (activePointer !== e.pointerId) return;
    activePointer = null;
    lbStage.releasePointerCapture(e.pointerId);

    const dx = e.clientX - pointerStartX;
    const dy = e.clientY - pointerStartY;

    if (scale > 1) {
      lightbox.classList.remove('is-dragging');
      return;
    }

    const dismiss =
      dy > Math.min(160, window.innerHeight * 0.18) ||
      (dy > 60 && dy > Math.abs(dx) * 1.2);
    if (dismiss) {
      closeBox();
      return;
    }

    if (Math.abs(dx) > 72 && Math.abs(dx) > Math.abs(dy)) {
      goRelative(dx < 0 ? 1 : -1);
      lightbox.classList.remove('is-dragging');
      return;
    }

    springBack();
  });

  lbStage.addEventListener('pointercancel', () => {
    activePointer = null;
    springBack();
  });

  lbStage.addEventListener(
    'wheel',
    (e) => {
      if (lightbox.hidden || reduceMotion) return;
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const next = scale + (e.deltaY < 0 ? 0.12 : -0.12);
        scale = Math.min(3, Math.max(1, next));
        lightbox.classList.toggle('is-zoomed', scale > 1);
        applyTransform();
      }
    },
    { passive: false },
  );

  lbStage.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length === 2 && !reduceMotion) {
        const [a, b] = e.touches;
        pinchStartDist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        pinchStartScale = scale;
      }
    },
    { passive: true },
  );

  lbStage.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length !== 2 || reduceMotion) return;
      const [a, b] = e.touches;
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      if (pinchStartDist <= 0) return;
      scale = Math.min(3, Math.max(1, (pinchStartScale * dist) / pinchStartDist));
      lightbox.classList.toggle('is-zoomed', scale > 1);
      lightbox.classList.add('is-dragging');
      applyTransform();
    },
    { passive: true },
  );

  lbStage.addEventListener('touchend', () => {
    pinchStartDist = 0;
    if (scale <= 1.05) {
      scale = 1;
      lightbox.classList.remove('is-zoomed');
      applyTransform();
    }
  });
}
