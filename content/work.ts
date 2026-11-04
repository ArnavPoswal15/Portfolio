import type { WorkEntry } from './types';

export const workEntries: WorkEntry[] = [
  {
    kind: 'link',
    slug: 'orderflow',
    title: 'OrderFlow',
    blurb:
      'An order platform built as three independent services that coordinate through Kafka. If a payment fails, stock is released and the customer is refunded automatically.',
    href: 'work/orderflow.html',
    tileVariant: 't1',
    viewTransitionName: 'orderflow',
    scrollTargetTile: 'orderflow',
    stmt: '50 orders. 1 unit of stock. <span>1 sold.</span>',
  },
  {
    kind: 'link',
    slug: 'focusfleet',
    title: 'FocusFleet',
    blurb:
      'Driver fatigue from a live camera—MediaPipe geometry, debounced drowsy states, session logs—rebuilt from Gradio into Next.js + FastAPI. Try it on Hugging Face.',
    href: 'work/focusfleet.html',
    tileVariant: 't2',
    viewTransitionName: 'focusfleet',
    scrollTargetTile: 'focusfleet',
    decorative: 'eye',
  },
  {
    kind: 'static',
    title: 'Fraud Detection',
    blurb:
      'A transformer-based system that reads context in text and speech to catch fraud. It beat the baseline model by 40%.',
    tileVariant: 't3',
    note: 'Fraud hides in how people phrase things, so the model learns from context.',
  },
];

export type WorkTileId = 'orderflow' | 'focusfleet';

export const linkedWorkSlugs: WorkTileId[] = ['orderflow', 'focusfleet'];

export function isWorkTileId(value: string | null | undefined): value is WorkTileId {
  return value === 'orderflow' || value === 'focusfleet';
}

export function workTileIdFromHref(href: string): WorkTileId | undefined {
  if (href.includes('orderflow')) return 'orderflow';
  if (href.includes('focusfleet')) return 'focusfleet';
  return undefined;
}

export function getLinkedWorkEntry(slug: WorkTileId) {
  const entry = workEntries.find((e) => e.kind === 'link' && e.slug === slug);
  if (entry?.kind === 'link') return entry;
  throw new Error(`Missing work entry for slug: ${slug}`);
}

export function caseStudyPrefetchHrefs(): string[] {
  return workEntries
    .filter((e): e is Extract<WorkEntry, { kind: 'link' }> => e.kind === 'link')
    .map((e) => e.href);
}
