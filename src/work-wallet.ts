function prefersReducedMotion(): boolean {
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function modifiedClick(e: MouseEvent | PointerEvent): boolean {
  return (
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey ||
    ('button' in e && e.button > 0)
  );
}

export function initWorkWallet(): void {
  const stackEl = document.querySelector<HTMLElement>('.work #stack');
  const listEl = document.querySelector<HTMLElement>('.work #list');
  if (!stackEl || !listEl) return;
  const stack = stackEl;
  const list = listEl;

  const cards = [...stack.querySelectorAll<HTMLAnchorElement>('.card')];
  const links = [...list.querySelectorAll<HTMLAnchorElement>('a')];
  const reduce = prefersReducedMotion();

  let cur: number | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let entered = false;
  let fanning = false;
  let swiped = false;
  let touch = false;
  const was: boolean[] = [];
  let start: { x: number; y: number } | null = null;

  function num(prop: string): number {
    return parseFloat(getComputedStyle(stack!).getPropertyValue(prop)) || 0;
  }

  function face(card: HTMLAnchorElement): HTMLElement {
    return card.querySelector('.face')!;
  }

  function untilt(card: HTMLAnchorElement): void {
    const f = face(card);
    f.style.removeProperty('--rx');
    f.style.removeProperty('--ry');
  }

  function set(active: number | null): void {
    const reveal = num('--reveal');
    const peek = num('--peek');
    cards.forEach((card, i) => {
      let ty = 0;
      let sc = 1;
      let dl = 0;
      let op = 1;
      if (!entered) {
        ty = -i * peek;
        sc = 0.94;
        op = 0;
      } else if (active !== null) {
        if (i === active) {
          ty = -30;
          sc = 1.04;
        } else if (i > active) {
          ty = reveal;
          dl = (i - active - 1) * 22;
        } else {
          ty = -Math.max(0, 10 - (active - i - 1) * 5);
        }
      } else if (fanning) {
        dl = i * 70;
      }
      card.style.setProperty('--ty', `${ty}px`);
      card.style.setProperty('--sc', String(sc));
      card.style.setProperty('--op', String(op));
      card.style.transitionDelay = `${dl}ms`;
      card.classList.toggle('on', i === active);
      if (i !== active) untilt(card);
    });
    links.forEach((link, i) => {
      link.classList.toggle('on', i === active);
    });
    list.classList.toggle('has-active', active !== null);
    stack.classList.toggle('has-active', active !== null);
  }

  function want(active: number | null, delay?: number): void {
    clearTimeout(timer);
    if (active === cur) return;
    const go = (): void => {
      cur = active;
      set(active);
    };
    if (delay) timer = setTimeout(go, delay);
    else go();
  }

  function colorwayClass(card: HTMLAnchorElement): string {
    const match = card.className.match(/c-\w+/);
    return match?.[0] ?? '';
  }

  function openCard(i: number): void {
    const card = cards[i];
    const href = card.href;
    if (reduce) {
      location.href = href;
      return;
    }
    const rect = face(card).getBoundingClientRect();
    const veil = document.createElement('div');
    veil.className = `wallet-veil ${colorwayClass(card)}`;
    veil.style.cssText = `left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;border-radius:22px`;
    document.body.appendChild(veil);
    void veil.getBoundingClientRect();
    veil.style.left = '0px';
    veil.style.top = '0px';
    veil.style.width = '100vw';
    veil.style.height = '100vh';
    veil.style.borderRadius = '0px';
    setTimeout(() => {
      location.href = href;
    }, 520);
  }

  cards.forEach((card, i) => {
    card.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') want(i, 0);
    });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
      if (e.pointerType === 'mouse' && card.classList.contains('on')) {
        const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
        const f = face(card);
        f.style.setProperty('--rx', `${(-ny * 5).toFixed(2)}deg`);
        f.style.setProperty('--ry', `${(nx * 7).toFixed(2)}deg`);
      }
    });
    card.addEventListener('pointerleave', () => {
      untilt(card);
    });
    card.addEventListener('focus', () => {
      want(i, 0);
    });
    card.addEventListener('blur', () => {
      want(null, 0);
    });
    card.addEventListener('pointerdown', (e) => {
      touch = e.pointerType !== 'mouse';
      was[i] = cur === i;
    });
    card.addEventListener('click', (e) => {
      if (modifiedClick(e)) return;
      e.preventDefault();
      if (swiped) {
        swiped = false;
        return;
      }
      if (touch && !was[i]) {
        clearTimeout(timer);
        cur = i;
        set(i);
        return;
      }
      openCard(i);
    });
  });

  links.forEach((link, i) => {
    link.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') want(i, 0);
    });
    link.addEventListener('focus', () => {
      want(i, 0);
    });
    link.addEventListener('blur', () => {
      want(null, 0);
    });
    link.addEventListener('click', (e) => {
      if (modifiedClick(e)) return;
      e.preventDefault();
      openCard(i);
    });
  });

  stack.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'mouse') want(null, 70);
  });
  list.addEventListener('pointerleave', () => {
    want(null, 70);
  });

  stack.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') start = { x: e.clientX, y: e.clientY };
  });
  stack.addEventListener('pointerup', (e) => {
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      const n =
        cur === null
          ? 0
          : Math.max(0, Math.min(cards.length - 1, cur + (dx < 0 ? 1 : -1)));
      clearTimeout(timer);
      cur = n;
      set(n);
      swiped = true;
      setTimeout(() => {
        swiped = false;
      }, 350);
    }
  });

  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' || stack.contains(e.target as Node)) return;
    clearTimeout(timer);
    cur = null;
    set(null);
  });

  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      document.querySelectorAll('.wallet-veil').forEach((v) => {
        v.remove();
      });
      cur = null;
      set(null);
    }
  });

  function enter(): void {
    entered = true;
    fanning = true;
    set(cur);
    setTimeout(() => {
      fanning = false;
      cards.forEach((card) => {
        card.style.transitionDelay = '0ms';
      });
    }, 900);
  }

  set(null);
  if (reduce || !('IntersectionObserver' in window)) {
    entered = true;
    set(null);
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          io.disconnect();
          enter();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(stack);
  }
}