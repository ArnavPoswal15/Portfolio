import {
  SCROLL_TARGET_KEY,
  WORK_SCROLL_Y_KEY,
  WORK_TILE_KEY,
  getWorkTileElement,
  yForScrollAnchor,
  isWorkTileId,
} from './scroll-restore';

(function bootstrapPage() {
  const queue: Array<() => void> = [];
  let revealDone = false;

  function flushRevealQueue() {
    if (revealDone) return;
    revealDone = true;
    queue.splice(0).forEach((fn) => {
      fn();
    });
  }

  window.__portfolioOnPageReveal = (fn: () => void) => {
    if (revealDone) fn();
    else queue.push(fn);
  };

  if ('onpagereveal' in window) {
    window.addEventListener(
      'pagereveal',
      (e: PageRevealEvent) => {
        flushRevealQueue();
        const vt = e.viewTransition;
        if (vt?.finished) void vt.finished.catch(() => {});
      },
      { once: true },
    );
  } else {
    flushRevealQueue();
  }

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  if (sessionStorage.getItem(SCROLL_TARGET_KEY) === 'work') {
    document.documentElement.classList.add('land-on-work');
    const savedY = sessionStorage.getItem(WORK_SCROLL_Y_KEY);
    if (savedY !== null) {
      const y = parseInt(savedY, 10);
      if (!Number.isNaN(y)) window.scrollTo(0, Math.max(0, y));
    }
  } else if (location.hash === '#work') {
    function scrollWork() {
      const w = document.getElementById('work');
      if (!w) return;
      window.scrollTo(0, yForScrollAnchor(w));
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', scrollWork, { once: true });
    } else {
      scrollWork();
    }
  }

  function tileFallbackScroll() {
    if (sessionStorage.getItem(SCROLL_TARGET_KEY) !== 'work') return;
    const tileIdRaw = sessionStorage.getItem(WORK_TILE_KEY);
    if (!isWorkTileId(tileIdRaw)) return;
    if (sessionStorage.getItem(WORK_SCROLL_Y_KEY) !== null) return;

    const work = document.getElementById('work');
    const tile = getWorkTileElement(tileIdRaw);
    if (!tile || !work) return;

    const workY = yForScrollAnchor(work);
    const y = yForScrollAnchor(tile);
    if (y <= workY) return;
    window.scrollTo(0, y);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tileFallbackScroll, { once: true });
  } else {
    tileFallbackScroll();
  }
})();

export {};
