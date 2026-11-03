export const SCROLL_TARGET_KEY = 'portfolio:scrollTarget';
export const WORK_SCROLL_Y_KEY = 'portfolio:workScrollY';
export const WORK_TILE_KEY = 'portfolio:workTile';
export const WORK_NAV_OFFSET = 52;

export type WorkTileId = 'orderflow' | 'focusfleet';

export type ScrollOptions = {
  immediate?: boolean;
  onDone?: () => void;
  duration?: number;
  easing?: (time: number) => number;
  /** Absolute scroll Y; avoids getBoundingClientRect during view transitions. */
  targetY?: number;
};

/** Align with ::view-transition-group duration so Lenis keeps moving through the morph. */
const RESTORE_SCROLL_DURATION = 0.55;

type ScrollFn = (el: HTMLElement, options?: ScrollOptions) => void;

declare global {
  interface Window {
    __portfolioOnPageReveal?: (fn: () => void) => void;
  }
}

export function getWorkTileElement(id: WorkTileId): HTMLElement | null {
  if (id === 'orderflow') {
    return document.querySelector('a.tile.t1[href*="orderflow"]');
  }
  return document.querySelector('a.tile.t2[href*="focusfleet"]');
}

function parseWorkTileId(value: string | null): WorkTileId | undefined {
  if (value === 'orderflow' || value === 'focusfleet') return value;
  return undefined;
}

function workTileIdFromHref(href: string): WorkTileId | undefined {
  if (href.includes('orderflow')) return 'orderflow';
  if (href.includes('focusfleet')) return 'focusfleet';
  return undefined;
}

function yForScrollAnchor(el: HTMLElement): number {
  return Math.max(
    0,
    Math.round(el.getBoundingClientRect().top + window.scrollY - WORK_NAV_OFFSET),
  );
}

export function markScrollTargetWork(tileId?: WorkTileId): void {
  sessionStorage.setItem(SCROLL_TARGET_KEY, 'work');

  if (tileId) {
    sessionStorage.setItem(WORK_TILE_KEY, tileId);
    const tile = getWorkTileElement(tileId);
    if (tile) {
      sessionStorage.setItem(WORK_SCROLL_Y_KEY, String(yForScrollAnchor(tile)));
    }
    return;
  }

  sessionStorage.removeItem(WORK_TILE_KEY);
  const work = document.getElementById('work');
  if (!work) return;
  sessionStorage.setItem(WORK_SCROLL_Y_KEY, String(yForScrollAnchor(work)));
}

export function wantsWorkSection(): boolean {
  return (
    sessionStorage.getItem(SCROLL_TARGET_KEY) === 'work' ||
    location.hash === '#work'
  );
}

/** Runs on pagereveal (parallel with view transition when supported). */
export function afterPageReveal(run: () => void): void {
  if (window.__portfolioOnPageReveal) {
    window.__portfolioOnPageReveal(run);
    return;
  }

  if ('onpagereveal' in window) {
    window.addEventListener(
      'pagereveal',
      (event: PageRevealEvent) => {
        run();
        const finished = event.viewTransition?.finished;
        if (finished) void finished.catch(() => {});
      },
      { once: true },
    );
    return;
  }

  run();
}

/** Case-study “Back to work” / nav — session flag only, no #work in the URL (avoids native hash scroll). */
export function bindScrollTargetLinks(scope: ParentNode = document): void {
  scope.querySelectorAll<HTMLAnchorElement>('a[data-scroll-target="work"]').forEach((link) => {
    link.addEventListener('click', () => {
      const tileId = parseWorkTileId(link.getAttribute('data-scroll-target-tile'));
      markScrollTargetWork(tileId);
    });
  });

  scope.querySelectorAll<HTMLAnchorElement>('a[href*="#work"]').forEach((link) => {
    link.addEventListener('click', () => {
      markScrollTargetWork();
      const href = link.getAttribute('href');
      if (!href || href === '#work') return;
      if (!href.includes('index.html')) return;
      link.setAttribute('href', href.split('#')[0]);
    });
  });
}

function clearWorkHash(): void {
  if (location.hash !== '#work') return;
  history.replaceState(null, '', `${location.pathname}${location.search}`);
}

function clearRestoreSession(): void {
  sessionStorage.removeItem(SCROLL_TARGET_KEY);
  sessionStorage.removeItem(WORK_SCROLL_Y_KEY);
  sessionStorage.removeItem(WORK_TILE_KEY);
}

export function initScrollRestore(
  scrollToElement: ScrollFn,
  opts?: { pageRevealDone?: boolean; onRestoreComplete?: () => void },
): void {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  document.querySelectorAll<HTMLAnchorElement>('.tile[href]').forEach((tile) => {
    tile.addEventListener('click', () => {
      const href = tile.getAttribute('href') ?? '';
      markScrollTargetWork(workTileIdFromHref(href));
    });
  });

  bindScrollTargetLinks();

  const scrollToWork = (options?: ScrollOptions): void => {
    const work = document.getElementById('work');
    if (work) scrollToElement(work, options);
  };

  let restored = false;

  const readTargetY = (): number | null => {
    const saved = sessionStorage.getItem(WORK_SCROLL_Y_KEY);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!Number.isNaN(parsed)) return Math.max(0, parsed);
    }

    const tileId = parseWorkTileId(sessionStorage.getItem(WORK_TILE_KEY));
    if (tileId) {
      const tile = getWorkTileElement(tileId);
      const work = document.getElementById('work');
      if (!tile) return null;
      const y = yForScrollAnchor(tile);
      if (work) {
        const workY = yForScrollAnchor(work);
        if (y <= workY) return null;
      } else if (y <= WORK_NAV_OFFSET) {
        return null;
      }
      return y;
    }

    const work = document.getElementById('work');
    if (!work) return null;
    const y = yForScrollAnchor(work);
    if (y <= WORK_NAV_OFFSET) return null;
    return y;
  };

  const performRestore = (): void => {
    if (restored || !wantsWorkSection()) return;

    const work = document.getElementById('work');
    if (!work) {
      restored = true;
      clearRestoreSession();
      clearWorkHash();
      document.documentElement.classList.remove('land-on-work');
      opts?.onRestoreComplete?.();
      return;
    }

    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const finish = (): void => {
      document.documentElement.classList.remove('land-on-work');
      opts?.onRestoreComplete?.();
    };

    const attempt = (): void => {
      if (restored || !wantsWorkSection()) return;

      const targetY = readTargetY();
      if (targetY === null) {
        requestAnimationFrame(attempt);
        return;
      }

      restored = true;
      const hadSavedY = sessionStorage.getItem(WORK_SCROLL_Y_KEY) !== null;
      const hadWorkTile = sessionStorage.getItem(WORK_TILE_KEY) !== null;
      clearRestoreSession();
      clearWorkHash();

      const alreadyThere = Math.abs(window.scrollY - targetY) <= 8;

      if (alreadyThere) {
        finish();
        return;
      }

      const immediateRestore = reduceMotion || hadSavedY || hadWorkTile;

      requestAnimationFrame(() => {
        scrollToWork({
          targetY,
          immediate: immediateRestore,
          duration: immediateRestore ? undefined : RESTORE_SCROLL_DURATION,
          onDone: finish,
        });
      });
    };

    requestAnimationFrame(attempt);
  };

  const scheduleRestore = (): void => {
    if (!wantsWorkSection()) return;
    if (opts?.pageRevealDone) {
      performRestore();
      return;
    }
    afterPageReveal(performRestore);
  };

  scheduleRestore();

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      restored = false;
      scheduleRestore();
    }
  });
}

export function shouldSkipHomeIntro(): boolean {
  return wantsWorkSection();
}
