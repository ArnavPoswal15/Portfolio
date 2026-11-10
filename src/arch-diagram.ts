/**
 * One-shot architecture diagram draw-in, once per page load.
 * A reload plays it again. Does not use sessionStorage.
 * No-op when the page has no figure.arch or the user prefers reduced motion.
 */
const REVEAL_FALLBACK_MS = 1500;
const VISIBLE_RATIO = 0.35;

export function initArchDiagrams(): void {
  try {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const figs = [...document.querySelectorAll<HTMLElement>('figure.arch')];
    if (!figs.length) return;

    // Fallback if generated HTML predates the inline arm script (see render-sections.mjs).
    figs.forEach((fig) => {
      if (!fig.classList.contains('arch-armed')) fig.classList.add('arch-armed');
    });

    let started = false;
    let fallback = 0;

    const markIn = (fig: HTMLElement) => {
      // Two frames so the armed (hidden) state is painted before the draw-in.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fig.classList.add('is-in');
        });
      });
    };

    const start = () => {
      if (started) return;
      started = true;
      window.clearTimeout(fallback);

      if (!('IntersectionObserver' in window)) {
        figs.forEach(markIn);
        return;
      }

      const pending = new Set<Element>(figs);
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.intersectionRatio < VISIBLE_RATIO) continue;
            markIn(entry.target as HTMLElement);
            io.unobserve(entry.target);
            pending.delete(entry.target);
          }
          if (pending.size === 0) io.disconnect();
        },
        { threshold: VISIBLE_RATIO },
      );
      figs.forEach((fig) => io.observe(fig));
    };

    // If the reveal hook never fires, still show the diagram.
    fallback = window.setTimeout(start, REVEAL_FALLBACK_MS);

    const hook = window.__portfolioOnPageReveal;
    if (typeof hook === 'function') {
      hook(() => {
        window.clearTimeout(fallback);
        start();
      });
    } else {
      window.clearTimeout(fallback);
      start();
    }
  } catch {
    document.querySelectorAll('figure.arch').forEach((fig) => {
      fig.classList.remove('arch-armed');
    });
  }
}
