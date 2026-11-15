import type { CaseStudyContent } from '../types';

export const folioCaseStudy: CaseStudyContent = {
  slug: 'folio',
  title: 'Folio',
  description:
    'Folio: a book-like digital journal with GSAP page curls, guest localStorage, Firestore sync, and a hardened Express path for Gemini voice dictation. Live on Google AI Studio.',
  introLede:
    'A journaling app meant to feel like opening a notebook—closed cover, drag-to-turn spreads, ruled or dotted paper—while still handling sync, export, and server-side voice transcription with real quotas and auth.',
  stackLine:
    'React 19, TypeScript, Vite, Tailwind CSS, GSAP, Express, Firebase Auth & Firestore, Google GenAI · <a href="https://github.com/ArnavPoswal15/FOLIO">GitHub</a> · <a href="https://folio-journal-book.ai.studio/">live app</a>',
  githubUrl: 'https://github.com/ArnavPoswal15/FOLIO',
  extraFooterLinks: [
    {
      label: 'Try live app',
      href: 'https://folio-journal-book.ai.studio/',
    },
  ],
  nextProject: {
    slug: 'orderflow',
    title: 'OrderFlow',
    desc: 'Kafka saga checkout with zero overselling.',
  },
  sections: [
    {
      type: 'prose',
      heading: 'Problem',
      paragraphs: [
        'Most notes apps look like dashboards. I wanted a journal that rewards slowing down: a cover you click open, spreads you turn by dragging a corner, and paper you can switch between ruled, dotted, or blank—with ink that still feels like ink.',
        'That surface has to coexist with real product plumbing. Entries should work offline as a guest, merge cleanly when you sign in with Google, export to CSV for backup, and support voice dictation without leaving the API key in the browser or letting one user burn through Gemini quota.',
      ],
    },
    {
      type: 'prose',
      heading: 'Book UX',
      paragraphs: [
        '<strong>PageCurlStage</strong> drives the experience: book phases (<code>closed</code> → <code>opening</code> → <code>open</code>), GSAP timelines for the cover, and geometry from <code>pageCurlGeometry.ts</code> so drags and corner hovers fold a page believably on desktop spreads or a single mobile page.',
        'Each spread holds left and right bodies, a date line, optional context note, and per-spread <code>paperStyle</code> and <code>inkColor</code>. Welcome content explains guest vs signed-in sync; the closed cover shows the current journal date before you open.',
      ],
    },
    {
      type: 'figure',
      svgPath: 'content/case-studies/folio/assets/arch.svg',
      caption:
        'Guest mode writes to <code>localStorage</code> immediately. Signed-in users mirror spreads under <code>/users/{uid}/spreads</code> in Firestore. Voice hits <code>POST /api/transcribe</code> on the same Express server that ships the Vite build—Firebase ID token required, Gemini key server-side only.',
    },
    {
      type: 'gallery',
      heading: 'In the browser',
      rows: [
        {
          shots: [
            {
              src: 'folio/cover-closed.png',
              width: 2986,
              height: 1704,
              preferPng: true,
              alt: 'Closed Folio journal cover on a desk surface with Open prompt',
              caption: 'Closed book—click the cover to open; optional Google sign-in to sync.',
              ariaLabel: 'Open image: closed journal cover',
              layout: 'hero',
              fetchPriority: 'high',
            },
          ],
        },
        {
          layout: 'pair',
          shots: [
            {
              src: 'folio/welcome-spread.png',
              width: 2988,
              height: 1692,
              preferPng: true,
              alt: 'Welcome spread with guest and Google sign-in options',
              caption:
                'Welcome spread—try as guest (browser-only storage) or continue with Google.',
              ariaLabel: 'Open image: welcome spread',
              layout: 'wide',
              loading: 'lazy',
            },
            {
              src: 'folio/writing-spread.png',
              width: 2982,
              height: 1710,
              preferPng: true,
              alt: 'Open journal spread with ruled paper, ink picker, voice record, and entries menu',
              caption:
                'Writing spread—paper style, ink color, voice dictation, entries index, and CSV export.',
              ariaLabel: 'Open image: writing spread',
              layout: 'wide',
              loading: 'lazy',
            },
          ],
        },
      ],
    },
    {
      type: 'specs',
      rows: [
        {
          heading: 'State and sync',
          body: '<code>useJournalStore</code> keeps spreads in a reducer: update bodies, turn pages, create/delete spreads, and reconcile with Firestore via real-time listeners when signed in. Guest arrays in <code>localStorage</code> merge into the cloud profile on first successful sign-in without dropping in-progress text.',
        },
        {
          heading: 'Firestore rules',
          body: 'Owner-only reads and writes on <code>/users/{userId}</code> and nested spreads—field length caps and immutable <code>userId</code> on each spread match <code>firestore.rules</code> and the blueprint JSON in the repo.',
        },
        {
          heading: 'Voice pipeline',
          body: '<code>useVoiceRecorder</code> captures mono 16 kHz WAV in the browser. The client attaches a Firebase bearer token; <code>server.ts</code> verifies Google certs, enforces per-IP and per-user rate limits, daily audio budgets, WAV magic-byte and duration checks, then calls Gemini. Structured logs record outcome and duration—never raw audio or transcript text.',
        },
        {
          heading: 'Ship path',
          body: 'Production is a single <code>node:22-slim</code> container: <code>npm run build</code> for the SPA, <code>node server.ts</code> on port 8080 serving static assets and API routes—deployed today as the Google AI Studio live app linked above.',
        },
      ],
    },
    {
      type: 'results',
      heading: 'Proof',
      metric: 'Open the live journal',
      paragraphs: [
        'The <a href="https://folio-journal-book.ai.studio/">hosted build</a> is the same tree as <a href="https://github.com/ArnavPoswal15/FOLIO">GitHub</a>: open the cover, write on a spread, flip pages, and (when signed in) dictate into the page. Voice requires Google Sign-In so per-user quotas can apply; guests still get full writing, styling, and CSV export locally.',
      ],
      noteLine:
        'No synthetic engagement metrics on this page—the product proof is the interactive book UI and the documented transcription guardrails in the README.',
    },
    {
      type: 'retro',
      heading: 'What I’d change next',
      items: [
        'Back rate limits and daily quotas with Redis or Firestore when running multiple Cloud Run instances—today counters are in-process.',
        'Add collaborative or shared journals only if privacy rules can stay strict; current schema is single-owner by design.',
        'Capture a short screen recording of a page turn for the repo README; portfolio shots above are static PNGs at full resolution.',
        'Broaden automated tests around merge-on-sign-in and conflict ordering via <code>clientUpdatedAt</code>.',
      ],
    },
  ],
};