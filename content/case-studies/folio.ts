import type { CaseStudyContent } from '../types';

export const folioCaseStudy: CaseStudyContent = {
  slug: 'folio',
  title: 'Folio',
  description:
    'Folio: a book-like digital journal with GSAP page curls, Apple Pencil drawing, cross-device Firestore sync, and server-gated Groq Whisper dictation with Gemini fallback. Live on Google AI Studio.',
  introLede:
    'A journal meant to feel like opening a hardbound book—3D cover, drag-to-fold page curls, a pullable bookmark ribbon—where you can type, sketch with pressure-sensitive ink, or dictate. Guest mode keeps everything on-device; Google Sign-In syncs prose, drawings, and spreads across phones and tablets.',
  stackLine:
    'React 19, TypeScript, Vite, Tailwind CSS, GSAP, Express, Firebase Auth & Firestore, Groq Whisper, Google GenAI · <a href="https://github.com/ArnavPoswal15/FOLIO">GitHub</a> · <a href="https://folio-journal-book.ai.studio/">live app</a>',
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
        'Most notes apps look like dashboards. I wanted a journal that rewards slowing down: a hardbound cover you open, spreads you turn by dragging a corner, and paper you can switch between ruled, dotted, or blank—with prose ink, a font picker, and a stylus layer when you want to sketch margins instead of type.',
        'That surface has to coexist with real product plumbing. Entries should work offline as a guest, merge cleanly when you sign in with Google and pick up on another device, export to CSV for backup, and support fast voice dictation without exposing API keys in the browser or letting one user burn through transcription quota.',
      ],
    },
    {
      type: 'prose',
      heading: 'Book UX',
      paragraphs: [
        '<strong>PageCurlStage</strong> drives the experience: book phases (<code>closed</code> → <code>opening</code> → <code>open</code>), GSAP timelines for the cover and cast shadows, spine-clamped geometry from <code>pageCurlGeometry.ts</code>, and a bookmark ribbon with pull resistance and spring bounce. Desktop shows two-page spreads; portrait mobile uses a single page with a landscape nudge.',
        'Each spread holds typed bodies, serialized stylus strokes per page (<code>leftInk</code> / <code>rightInk</code>), paper style, ink color, and an optional context note. Welcome content explains guest vs cross-device sync; the closed cover shows the journal date before you open.',
      ],
    },
    {
      type: 'prose',
      heading: 'Drawing and input',
      paragraphs: [
        'An ink canvas sits above the ruled sheet: pen, fountain pen, and highlighter with pressure-aware width, stroke and barrel erasers, undo/redo, and a toolbar for brush color and weight. Apple Pencil, touch, and mouse are distinguished via pointer types; palm rejection keeps stylus strokes from triggering page curls unless you explicitly enable finger drawing.',
        'Overflow prose flows onto the next page or continuation spread when a side fills up, so long entries do not fight the fixed sheet height. High-frequency ink and curl updates run through refs where possible so the book does not re-render at 60fps.',
      ],
    },
    {
      type: 'figure',
      svgPath: 'content/case-studies/folio/assets/arch.svg',
      caption:
        'Guest mode writes spreads (prose + ink) to <code>localStorage</code> immediately. Signed-in users mirror the same document shape under <code>/users/{uid}/spreads</code> in Firestore with real-time listeners and debounced writes. Voice hits <code>POST /api/transcribe</code> on the Express host behind Firebase ID tokens—Groq Whisper primary, Gemini fallback, keys server-side only.',
    },
    {
      type: 'gallery',
      heading: 'In the browser',
      rows: [
        {
          shots: [
            {
              src: 'folio/cover-closed.png',
              width: 1920,
              height: 1096,
              alt: 'Closed Folio journal cover on a desk surface with Open prompt',
              caption:
                'Closed book—open the cover; sign in from the desk or welcome spread to sync across devices.',
              ariaLabel: 'Open image: closed journal cover',
              layout: 'hero',
              fetchPriority: 'high',
            },
          ],
        },
        {
          shots: [
            {
              src: 'folio/welcome-spread.png',
              width: 1920,
              height: 1087,
              alt: 'Welcome spread with guest and Google sign-in options',
              caption:
                'Welcome spread—guest mode on this device, or Google Sign-In for a synced journal everywhere.',
              ariaLabel: 'Open image: welcome spread',
              layout: 'wide',
              loading: 'lazy',
            },
          ],
        },
        {
          layout: 'pair',
          shots: [
            {
              src: 'folio/dark-mode-spread.png',
              width: 3004,
              height: 1726,
              alt: 'Folio journal spread in dark mode with dotted paper, Draw and Record controls, and light/dark toggle',
              caption:
                'Evening desk—charcoal paper, dotted ruling, Draw and Record on the spread, theme toggle in the corner.',
              ariaLabel: 'Open image: dark mode journal spread',
              layout: 'wide',
              loading: 'lazy',
            },
            {
              src: 'folio/settings-menu.png',
              width: 3004,
              height: 1726,
              alt: 'Folio spread with entries menu open showing font picker, export, and Account and Sync',
              caption:
                'Page menu—font styles, new page, entries index, CSV export, and Account & Sync for cross-device journals.',
              ariaLabel: 'Open image: settings and sync menu',
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
          body: '<code>useJournalStore</code> and <code>useJournalSync</code> keep spreads in a reducer—bodies, ink payloads, navigation, overflow continuations—and reconcile with Firestore via snapshots, batched uploads, and debounced writes when signed in. UI surfaces <code>syncing</code> / <code>synced</code> / <code>error</code> with retry; guest arrays in <code>localStorage</code> merge into the cloud profile on first sign-in without dropping in-progress text or strokes.',
        },
        {
          heading: 'Ink canvas',
          body: '<code>useInkCanvas</code> renders DPR-aware strokes from compact serialized ink on each spread side; <code>useInkWorkspace</code> owns toolbar state, touch-draw toggle, and undo stacks. Drawing arms only when the toolbar is open (except Apple Pencil paths), and page curl ignores touch while stylus drawing is active.',
        },
        {
          heading: 'Firestore rules',
          body: 'Owner-only reads and writes on <code>/users/{userId}</code> and nested spreads—field length caps and immutable <code>userId</code> on each spread match <code>firestore.rules</code> and the blueprint JSON in the repo.',
        },
        {
          heading: 'Voice pipeline',
          body: '<code>useVoiceRecorder</code> shows a live level meter, applies client-side silence gating, and uploads compressed audio by default (mono WAV boost when the mic is quiet). The client sends a Firebase bearer token; <code>server.ts</code> verifies Google certs, enforces per-IP and per-user rate limits, daily audio budgets, payload and WAV duration checks, then calls Groq <code>whisper-large-v3-turbo</code> with Gemini fallback. Structured logs record outcome and duration—never raw audio or transcript text.',
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
        'The <a href="https://folio-journal-book.ai.studio/">hosted build</a> matches <a href="https://github.com/ArnavPoswal15/FOLIO">GitHub</a> at <code>v1.1.0</code>: open the cover, sketch or type on a spread, flip pages with the curl or ribbon, and—when signed in—see entries sync across devices while dictation runs through the guarded API. Voice requires Google Sign-In for quotas; guests still get writing, drawing, styling, and CSV export locally.',
      ],
      noteLine:
        'No synthetic engagement metrics on this page—the proof is the interactive book, ink layer, and the transcription guardrails documented in the repo README.',
    },
    {
      type: 'retro',
      heading: 'What I’d change next',
      items: [
        'Back rate limits and daily quotas with Redis or Firestore when running multiple Cloud Run instances—today counters are in-process.',
        'Add collaborative or shared journals only if privacy rules can stay strict; current schema is single-owner by design.',
        'Capture a short screen recording of a page turn for the repo README; portfolio gallery uses static PNGs at full resolution.',
        'Broaden automated tests around merge-on-sign-in, ink round-trips, and conflict ordering via <code>clientUpdatedAt</code>.',
      ],
    },
  ],
};