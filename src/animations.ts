import { eyeBlinkScrollTrigger } from './animations.config';
import {
  afterPageReveal,
  getWorkTileElement,
  initScrollRestore,
  shouldSkipHomeIntro,
  WORK_NAV_OFFSET,
  WORK_SCROLL_Y_KEY,
  yForScrollAnchor,
  type WorkTileId,
} from './scroll-restore';

function realignWorkScroll(
  scrollTo: (y: number) => void,
  tileId?: WorkTileId,
): void {
  const target =
    (tileId && getWorkTileElement(tileId)) || document.getElementById('work');
  if (!(target instanceof HTMLElement)) return;
  scrollTo(yForScrollAnchor(target));
}

async function mountScrollTriggers(
  gsap: typeof import('gsap').default,
  _ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger,
): Promise<void> {
  gsap.to('.hero-in', {
    scale: 0.92,
    opacity: 0,
    y: -40,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  gsap.fromTo(
    '.statement .w',
    { opacity: 0.2 },
    {
      opacity: 1,
      stagger: 0.1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.statement',
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.5,
      },
    },
  );

  const eye = eyeBlinkScrollTrigger();
  if (eye) {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: eye.tileSelector,
          start: 'top 65%',
          end: 'bottom 15%',
          scrub: true,
        },
      })
      .to(eye.eyeSelector, { scaleY: 0.06, ease: 'none' })
      .to(eye.eyeSelector, { scaleY: 1, ease: 'none' });
  }
}

async function mountMotion(pageRevealDone: boolean): Promise<void> {
  const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('lenis'),
  ]);

  const skipIntro = shouldSkipHomeIntro();

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ duration: 1.15 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => {
    lenis.raf(t * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  if (skipIntro) {
    const savedY = sessionStorage.getItem(WORK_SCROLL_Y_KEY);
    let y: number | null = null;
    if (savedY !== null) {
      const parsed = parseInt(savedY, 10);
      if (!Number.isNaN(parsed)) y = Math.max(0, parsed);
    }
    if (y === null) y = window.scrollY;
    lenis.scrollTo(y, { immediate: true, force: true });
  }

  initScrollRestore(
    (el, options) => {
      const target =
        options?.targetY ??
        el.getBoundingClientRect().top + window.scrollY - WORK_NAV_OFFSET;
      lenis.scrollTo(target, {
        immediate: options?.immediate ?? false,
        duration: options?.duration,
        easing: options?.easing,
        onComplete: options?.onDone,
        force: options?.targetY !== undefined,
      });
    },
    {
      pageRevealDone,
      onRestoreComplete: skipIntro
        ? ({ tileId }) => {
            void mountScrollTriggers(gsap, ScrollTrigger).then(() => {
              ScrollTrigger.refresh();
              realignWorkScroll(
                (y) => lenis.scrollTo(y, { immediate: true, force: true }),
                tileId,
              );
            });
          }
        : undefined,
    },
  );

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href) return;
      const target = document.querySelector(href);
      if (target instanceof HTMLElement) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -WORK_NAV_OFFSET });
      }
    });
  });

  if (!skipIntro) {
    gsap.from('.hero h1 .line>span', {
      yPercent: 115,
      duration: 1.3,
      stagger: 0.14,
      ease: 'expo.out',
    });
    gsap.from(['.hero .sub', '.hero .cta'], {
      opacity: 0,
      y: 16,
      duration: 1,
      delay: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
    });
    await mountScrollTriggers(gsap, ScrollTrigger);
  }
}

export function initAnimations(): void {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce) {
    initScrollRestore((el, options) => {
      const work = document.getElementById('work');
      const y =
        options?.targetY ??
        (work
          ? Math.max(0, work.offsetTop - WORK_NAV_OFFSET)
          : yForScrollAnchor(el));
      window.scrollTo(0, y);
      options?.onDone?.();
    });
    return;
  }

  if (shouldSkipHomeIntro()) {
    afterPageReveal(() => {
      void mountMotion(true);
    });
    return;
  }

  void mountMotion(false);
}
