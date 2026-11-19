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
    wallet: {
      listLine: 'Three services coordinating through Kafka',
      cardDesc:
        'Three independent services coordinating through Kafka. Failed payments release stock and trigger refunds.',
      tags: ['Kafka', 'Microservices'],
      categoryLabel: 'Distributed systems',
      markLetter: 'O',
      colorway: 'c-graphite',
      cardSuffix: '0001',
    },
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
    wallet: {
      listLine: 'Driver fatigue detection from a live camera',
      cardDesc:
        'Driver fatigue detection from a live camera, rebuilt from a Gradio prototype into Next.js and FastAPI.',
      tags: ['Next.js', 'FastAPI', 'Vision'],
      categoryLabel: 'Computer vision',
      markLetter: 'F',
      colorway: 'c-blue',
      cardSuffix: '0002',
    },
  },
  {
    kind: 'link',
    slug: 'fraud-call',
    title: 'Fraud Detection',
    blurb:
      'A transformer-based system that reads context in text and speech to catch fraud. It reached about 95% accuracy on held-out call transcripts.',
    href: 'work/fraud-call.html',
    tileVariant: 't3',
    viewTransitionName: 'fraud-call',
    scrollTargetTile: 'fraud-call',
    wallet: {
      listLine: 'Transformer-based fraud detection on text and speech',
      cardDesc:
        'Transformer-based fraud detection across text and speech, about 95% accuracy on held-out transcripts.',
      tags: ['Transformers', 'NLP', 'Speech'],
      categoryLabel: 'NLP & speech',
      markLetter: 'D',
      colorway: 'c-red',
      cardSuffix: '0003',
    },
  },
  {
    kind: 'link',
    slug: 'folio',
    title: 'Folio',
    blurb:
      'A book-like journal—page curls, Apple Pencil ink, cross-device Firestore sync, and Groq-backed dictation. Live on Google AI Studio.',
    href: 'work/folio.html',
    tileVariant: 't4',
    viewTransitionName: 'folio',
    scrollTargetTile: 'folio',
    wallet: {
      listLine: 'A journal app with page curls and Apple Pencil ink',
      cardDesc:
        'A journal app with page curls, Apple Pencil ink, Firestore sync and Groq-backed dictation.',
      tags: ['Firestore', 'Groq', 'Apple Pencil'],
      categoryLabel: 'iPad journal app',
      markLetter: 'F',
      colorway: 'c-titanium',
      cardSuffix: '0004',
    },
  },
];

export type WorkTileId = 'orderflow' | 'focusfleet' | 'fraud-call' | 'folio';

export const linkedWorkSlugs: WorkTileId[] = [
  'orderflow',
  'focusfleet',
  'fraud-call',
  'folio',
];

export function isWorkTileId(value: string | null | undefined): value is WorkTileId {
  return (
    value === 'orderflow' ||
    value === 'focusfleet' ||
    value === 'fraud-call' ||
    value === 'folio'
  );
}

export function workTileIdFromHref(href: string): WorkTileId | undefined {
  if (href.includes('orderflow')) return 'orderflow';
  if (href.includes('focusfleet')) return 'focusfleet';
  if (href.includes('fraud-call')) return 'fraud-call';
  if (href.includes('folio')) return 'folio';
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