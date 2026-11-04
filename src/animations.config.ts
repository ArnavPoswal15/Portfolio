import { workEntries } from '../content/work.ts';

export function eyeBlinkScrollTrigger() {
  const entry = workEntries.find(
    (e): e is Extract<(typeof workEntries)[number], { kind: 'link' }> =>
      e.kind === 'link' && e.decorative === 'eye',
  );
  if (!entry) return null;
  return {
    tileSelector: `[data-work-tile="${entry.slug}"]`,
    eyeSelector: `[data-work-tile="${entry.slug}"] [data-decorative="eye"]`,
  };
}
