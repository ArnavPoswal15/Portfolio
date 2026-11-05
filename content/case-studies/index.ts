import type { CaseStudyContent } from '../types';
import { fraudCallCaseStudy } from './fraud-call';
import { focusfleetCaseStudy } from './focusfleet';
import { orderflowCaseStudy } from './orderflow';

export { fraudCallCaseStudy, focusfleetCaseStudy, orderflowCaseStudy };

/** Canonical order for page generation and image optimization. */
export const allCaseStudies: CaseStudyContent[] = [
  orderflowCaseStudy,
  focusfleetCaseStudy,
  fraudCallCaseStudy,
];

/** Gallery `src` paths with `preferPng: true` — PNG-only in HTML; skip WebP in optimize-images. */
export function collectPreferPngGalleryPaths(studies: CaseStudyContent[]): Set<string> {
  const paths = new Set<string>();
  for (const study of studies) {
    for (const section of study.sections) {
      if (section.type !== 'gallery') continue;
      for (const row of section.rows) {
        for (const shot of row.shots) {
          if (shot.preferPng) paths.add(shot.src);
        }
      }
    }
  }
  return paths;
}
