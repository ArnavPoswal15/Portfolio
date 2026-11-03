import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initScrollRestore } from './scroll-restore';

export function initAnimations(): void {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce) {
    initScrollRestore((el) => {
      el.scrollIntoView({ block: 'start' });
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ duration: 1.15 });
  initScrollRestore((el) => {
    lenis.scrollTo(el, { offset: -52, immediate: true });
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => {
    lenis.raf(t * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href) return;
      const target = document.querySelector(href);
      if (target instanceof HTMLElement) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -52 });
      }
    });
  });

  /* One page-load moment: headline lines rise out of a mask. */
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

  /* The hero recedes as you leave it. */
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

  /* One scroll moment: a pinned statement that lights up word by word. */
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

  /* The eye closes as you scroll past, which is the thing FocusFleet detects. */
  gsap
    .timeline({
      scrollTrigger: {
        trigger: '.t2',
        start: 'top 65%',
        end: 'bottom 15%',
        scrub: true,
      },
    })
    .to('.eye', { scaleY: 0.06, ease: 'none' })
    .to('.eye', { scaleY: 1, ease: 'none' });
}
