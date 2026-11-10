export function initArchDiagrams(): void {
  try {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const figs = document.querySelectorAll<HTMLElement>('figure.arch');
    if (!figs.length || !('IntersectionObserver' in window)) return;

    figs.forEach((f) => f.classList.add('arch-armed'));

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add('is-in');
              io.unobserve(e.target);
            }
          }
        },
        { threshold: 0.2 },
      );
      figs.forEach((f) => io.observe(f));
    };

    const hook = window.__portfolioOnPageReveal;
    if (typeof hook === 'function') hook(start);
    else start();
    setTimeout(start, 1500);
  } catch {
    document.querySelectorAll('figure.arch').forEach((f) => f.classList.remove('arch-armed'));
  }
}
