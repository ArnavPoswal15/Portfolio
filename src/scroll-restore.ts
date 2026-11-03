const SCROLL_TARGET_KEY = 'portfolio:scrollTarget';

type ScrollFn = (el: HTMLElement) => void;

export function initScrollRestore(scrollToElement: ScrollFn): void {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  document.querySelectorAll<HTMLAnchorElement>('.tile[href]').forEach((tile) => {
    tile.addEventListener('click', () => {
      sessionStorage.setItem(SCROLL_TARGET_KEY, 'work');
    });
  });

  const scrollToWork = (): void => {
    const work = document.getElementById('work');
    if (work) scrollToElement(work);
  };

  const restoreIfNeeded = (): void => {
    const target = sessionStorage.getItem(SCROLL_TARGET_KEY);
    if (target === 'work' || location.hash === '#work') {
      sessionStorage.removeItem(SCROLL_TARGET_KEY);
      requestAnimationFrame(() => {
        scrollToWork();
      });
    }
  };

  restoreIfNeeded();

  window.addEventListener('pageshow', (event) => {
    if (event.persisted || sessionStorage.getItem(SCROLL_TARGET_KEY) === 'work') {
      restoreIfNeeded();
    }
  });
}
