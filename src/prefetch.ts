const prefetched = new Set<string>();

/** Paths are relative to `import.meta.env.BASE_URL` (e.g. `/Portfolio/` on GitHub Pages). */
const CASE_STUDY_STYLES = [
  'src/styles/site.css',
  'src/styles/case-study.css',
  'src/styles/view-transitions.css',
].map((path) => `${import.meta.env.BASE_URL}${path}`);

function prefetchHref(href: string): void {
  if (prefetched.has(href)) return;
  const existing = document.querySelector(`link[rel="prefetch"][href="${href}"]`);
  if (existing) {
    prefetched.add(href);
    return;
  }
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
  prefetched.add(href);
}

function prefetchCaseStudy(href: string): void {
  prefetchHref(href);
  if (!import.meta.env.DEV || !href.includes('work/')) return;
  CASE_STUDY_STYLES.forEach(prefetchHref);
}

export function initPrefetch(): void {
  document.querySelectorAll<HTMLAnchorElement>('.tile[href]').forEach((tile) => {
    const href = tile.getAttribute('href');
    if (!href) return;

    const once = (): void => {
      prefetchCaseStudy(href);
    };

    tile.addEventListener('mouseenter', once, { once: true });
    tile.addEventListener('focusin', once, { once: true });
    tile.addEventListener('touchstart', once, { once: true, passive: true });
  });
}
