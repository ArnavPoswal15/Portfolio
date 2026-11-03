export const SCROLL_TARGET_KEY = 'portfolio:scrollTarget';
export const WORK_SCROLL_Y_KEY = 'portfolio:workScrollY';
export const WORK_NAV_OFFSET = 52;

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

export function markScrollTargetWork(): void {
  sessionStorage.setItem(SCROLL_TARGET_KEY, 'work');
  const work = document.getElementById('work');
  if (!work) return;
  const y = Math.max(
    0,
    Math.round(work.getBoundingClientRect().top + window.scrollY - WORK_NAV_OFFSET),
  );
  sessionStorage.setItem(WORK_SCROLL_Y_KEY, String(y));
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
      markScrollTargetWork();
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

export function initScrollRestore(
  scrollToElement: ScrollFn,
  opts?: { pageRevealDone?: boolean; onRestoreComplete?: () => void },
): void {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  document.querySelectorAll<HTMLAnchorElement>('.tile[href]').forEach((tile) => {
    tile.addEventListener('click', markScrollTargetWork);
  });

  bindScrollTargetLinks();

  const scrollToWork = (options?: ScrollOptions): void => {
    const work = document.getElementById('work');
    if (work) scrollToElement(work, options);
  };

  let restored = false;

  const readTargetY = (work: HTMLElement): number | null => {
    const saved = sessionStorage.getItem(WORK_SCROLL_Y_KEY);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!Number.isNaN(parsed)) return Math.max(0, parsed);
    }
    if (work.offsetTop <= WORK_NAV_OFFSET) return null;
    return Math.max(0, work.offsetTop - WORK_NAV_OFFSET);
  };

  const performRestore = (): void => {
    if (restored || !wantsWorkSection()) return;

    const work = document.getElementById('work');
    if (!work) {
      restored = true;
      sessionStorage.removeItem(SCROLL_TARGET_KEY);
      sessionStorage.removeItem(WORK_SCROLL_Y_KEY);
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

      const targetY = readTargetY(work);
      if (targetY === null) {
        requestAnimationFrame(attempt);
        return;
      }

      restored = true;
      const hadSavedY = sessionStorage.getItem(WORK_SCROLL_Y_KEY) !== null;
      sessionStorage.removeItem(SCROLL_TARGET_KEY);
      sessionStorage.removeItem(WORK_SCROLL_Y_KEY);
      clearWorkHash();

      const alreadyThere = Math.abs(window.scrollY - targetY) <= 8;

      if (alreadyThere) {
        finish();
        return;
      }

      requestAnimationFrame(() => {
        scrollToWork({
          targetY,
          immediate: reduceMotion || hadSavedY,
          duration:
            reduceMotion || hadSavedY ? undefined : RESTORE_SCROLL_DURATION,
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
