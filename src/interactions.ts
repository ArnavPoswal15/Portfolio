type ScrollSample = { y: number; velocity: number };

let navChromeBound = false;

function prefersReducedMotion(): boolean {
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isFinePointer(): boolean {
  return matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function getNav(): HTMLElement | null {
  const nav = document.querySelector('nav[aria-label="Primary"]');
  return nav instanceof HTMLElement ? nav : null;
}

function updateNavChrome(nav: HTMLElement, sample: ScrollSample): void {
  if (sample.y > 120 && sample.velocity > 0.12) {
    nav.classList.add('nav--hidden');
  }
  if (sample.velocity < -0.06 || sample.y < 72) {
    nav.classList.remove('nav--hidden');
  }
}

function bindNavChrome(onSample: (cb: (s: ScrollSample) => void) => void): void {
  if (navChromeBound || prefersReducedMotion()) return;
  const nav = getNav();
  if (!nav) return;
  navChromeBound = true;

  onSample((sample) => updateNavChrome(nav, sample));
}

export function bindNavChromeToWindow(): void {
  bindNavChrome((emit) => {
    let lastY = window.scrollY;
    let lastT = performance.now();
    const tick = (): void => {
      const y = window.scrollY;
      const t = performance.now();
      const dt = Math.max(16, t - lastT);
      const velocity = (y - lastY) / dt;
      emit({ y, velocity });
      lastY = y;
      lastT = t;
    };
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  });
}

export function bindNavChromeToLenis(
  lenis: {
    on: (
      event: 'scroll',
      cb: (data: { scroll: number; velocity: number }) => void,
    ) => void;
  },
): void {
  bindNavChrome((emit) => {
    lenis.on('scroll', ({ scroll, velocity }) => {
      emit({ y: scroll, velocity });
    });
  });
}

function initTilePress(): void {
  document.querySelectorAll<HTMLElement>('a.tile').forEach((tile) => {
    const press = (): void => {
      tile.classList.add('is-pressed');
    };
    const release = (): void => {
      tile.classList.remove('is-pressed');
    };

    tile.addEventListener('pointerdown', press);
    tile.addEventListener('pointerup', release);
    tile.addEventListener('pointercancel', release);
    tile.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse' && tile.classList.contains('is-pressed')) {
        release();
      }
    });
  });
}

function initTileTilt(): void {
  if (!isFinePointer() || prefersReducedMotion()) return;

  document.querySelectorAll<HTMLElement>('a.tile').forEach((tile) => {
    tile.classList.add('tile--tilt');
    let raf = 0;
    let targetRx = 0;
    let targetRy = 0;
    let currentRx = 0;
    let currentRy = 0;
    let lightX = 50;
    let lightY = 50;

    const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

    const apply = (): void => {
      currentRx = lerp(currentRx, targetRx, 0.12);
      currentRy = lerp(currentRy, targetRy, 0.12);
      tile.style.setProperty('--tile-rx', `${currentRx.toFixed(2)}deg`);
      tile.style.setProperty('--tile-ry', `${currentRy.toFixed(2)}deg`);
      tile.style.setProperty('--tile-light-x', `${lightX.toFixed(1)}%`);
      tile.style.setProperty('--tile-light-y', `${lightY.toFixed(1)}%`);
      const moving =
        Math.abs(currentRx - targetRx) > 0.02 ||
        Math.abs(currentRy - targetRy) > 0.02;
      if (moving) raf = requestAnimationFrame(apply);
      else raf = 0;
    };

    const schedule = (): void => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    tile.addEventListener('pointermove', (e) => {
      const rect = tile.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      targetRy = (x - 0.5) * 6;
      targetRx = (0.5 - y) * 6;
      lightX = x * 100;
      lightY = y * 100;
      tile.style.setProperty('--tile-specular', '0.14');
      schedule();
    });

    const reset = (): void => {
      targetRx = 0;
      targetRy = 0;
      tile.style.setProperty('--tile-specular', '0');
      schedule();
    };
    tile.addEventListener('pointerleave', reset);
  });
}

function initMagnetic(): void {
  if (!isFinePointer() || prefersReducedMotion()) return;

  const targets = document.querySelectorAll<HTMLElement>(
    '.pill, nav[aria-label="Primary"] ul a',
  );
  targets.forEach((el) => {
    el.classList.add('magnetic');
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let goalX = 0;
    let goalY = 0;

    const tick = (): void => {
      tx += (goalX - tx) * 0.18;
      ty += (goalY - ty) * 0.18;
      el.style.transform = `translate(${tx}px, ${ty}px)`;
      if (Math.hypot(goalX - tx, goalY - ty) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const move = (e: PointerEvent): void => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const radius = Math.max(rect.width, rect.height) * 1.8;
      if (dist > radius) {
        goalX = 0;
        goalY = 0;
      } else {
        const pull = 0.22 * (1 - dist / radius);
        goalX = dx * pull;
        goalY = dy * pull;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', () => {
      goalX = 0;
      goalY = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    });
  });
}

/** Home page: tiles, magnetic CTAs. Nav chrome is bound from animations (Lenis) or window. */
export function initInteractions(): void {
  if (prefersReducedMotion()) return;
  initTilePress();
  initTileTilt();
  initMagnetic();
}
