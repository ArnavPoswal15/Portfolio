import type { CaseStudyContent } from '../types';

export const focusfleetCaseStudy: CaseStudyContent = {
  slug: 'focusfleet',
  title: 'FocusFleet',
  description:
    'FocusFleet: real-time driver drowsiness monitoring with MediaPipe, a debounced state machine, and optional Keras—Next.js and FastAPI product rebuilt from an earlier Gradio app. Live demo on Hugging Face.',
  introLede:
    'Real-time driver fatigue monitoring for fleet-style demos: a webcam feed runs through computer vision, surfaces clear active → warning → drowsy states, and logs sessions for drivers and admins—not a one-off script, but a full web product.',
  heroTheme: 'light',
  stackLine:
    'Python, FastAPI, Next.js, MediaPipe Face Mesh, OpenCV, optional Keras, SQLite, Docker · <a href="https://github.com/ArnavPoswal15/FocusFleet">GitHub</a> · <a href="https://huggingface.co/spaces/ArnavPoswal15/FocusFleet">live demo</a>',
  githubUrl: 'https://github.com/ArnavPoswal15/FocusFleet',
  extraFooterLinks: [
    {
      label: 'Live demo (HF Space)',
      href: 'https://huggingface.co/spaces/ArnavPoswal15/FocusFleet',
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
        'Drowsiness shows up in the face before it shows up in telematics. A useful system has to react on live video, explain itself on screen, and avoid crying wolf—one blink should not trigger a fleet alert.',
        'I also wanted something you could hand to a recruiter or teammate cold: register, open monitoring, see annotated frames and status, and (for admins) skim session history. That meant growing past a desktop or Gradio prototype into a static Next.js UI, a FastAPI backend, and one shared <code>focusfleet/</code> detection package used everywhere.',
      ],
    },
    {
      type: 'prose',
      heading: 'From Gradio to Next.js',
      paragraphs: [
        'The project started as a CustomTkinter desktop app and a Gradio Space—fast for tuning MediaPipe thresholds and trying the Keras classifier on uploads. The product path today is different: <strong>Next.js</strong> for login, dashboard, live monitoring, analytics, and admin; <strong>FastAPI</strong> for auth, sessions, and analytics; the same CV core behind both.',
        'Production ships as one Docker container (Hugging Face Space on port 7860): Uvicorn serves the exported Next build and the API on the same origin. Locally, Next dev on port 3000 proxies REST to FastAPI on 8000. Optional <code>web/main.py</code> Gradio entry remains for CV-only experiments without the full stack.',
      ],
    },
    {
      type: 'figure',
      svgPath: 'content/case-studies/focusfleet/assets/arch.svg',
      caption:
        'Live monitoring: login → start a session → stream camera frames over WebSocket → receive JSON status and annotated JPEGs. Detection and logging live in <code>focusfleet/</code>; the API wires them to the UI.',
    },
    {
      type: 'gallery',
      heading: 'In the browser',
      rows: [
        {
          shots: [
            {
              src: 'focusfleet/monitoring.png',
              width: 2626,
              height: 1334,
              alt: 'Live monitoring with webcam preview, face overlay, EAR readout, and focused status',
              caption:
                'Live video and debounced states—focused, warning, and drowsy on every frame.',
              ariaLabel: 'Open image: live monitoring',
              layout: 'hero',
              fetchPriority: 'high',
            },
          ],
        },
        {
          shots: [
            {
              src: 'focusfleet/admin-overview.png',
              width: 2676,
              height: 832,
              alt: 'Fleet admin overview with driver and session counts across the fleet',
              caption:
                'Fleet-wide counts—drivers, sessions, and safety events after admin sign-in.',
              ariaLabel: 'Open image: fleet admin overview',
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
          heading: 'What the model stack is',
          body: '<strong>MediaPipe Face Mesh</strong> finds facial landmarks on each frame. <strong>Eye aspect ratio (EAR)</strong> and mouth opening catch low lids and yawns; drivers can tune the EAR threshold in the UI. An optional <strong>Keras</strong> file (<code>driver_drowsiness_model.keras</code>) loads when present—face crops resized to 224×224—for a secondary CNN check (including static image classification). The legacy desktop README describes a MobileNetV2-style classifier as validation on top of geometry; the current monorepo README documents the artifact and pipeline, not a training notebook, dataset splits, or held-out accuracy.',
        },
        {
          heading: 'Debouncing and alerts',
          body: 'Per-frame geometry is noisy, so <code>process_frame</code> feeds a small state machine: sustained low EAR or yawn promotes <strong>warning</strong>, then <strong>drowsy</strong> only after about two seconds of continuous signal; losing the face is tracked separately. Alert audio fires only after impairment lasts longer (configurable, default eight seconds), so brief glances do not blast the speaker. Session logs record state transitions instead of every frame.',
        },
        {
          heading: 'Live monitoring path',
          body: 'After sign-in, the driver starts a session with REST, then sends JPEG frames on <code>/ws/monitoring/{session_id}</code>. Each frame runs through shared detection; the client gets status JSON and an annotated frame. Stopping the session finalizes log files the dashboard and admin views can read.',
        },
      ],
    },
    {
      type: 'results',
      heading: 'Proof',
      metric: 'Try it in the browser',
      paragraphs: [
        'The public demo runs on a Hugging Face Docker Space—same codebase as <a href="https://github.com/ArnavPoswal15/FocusFleet">GitHub</a>: register as a driver, open monitoring, and watch states change with your camera. Admins get a fleet-oriented overview and log access after sign-in.',
      ],
      noteLine:
        '<a href="https://huggingface.co/spaces/ArnavPoswal15/FocusFleet">huggingface.co/spaces/ArnavPoswal15/FocusFleet</a> · The repo describes features and architecture; it does not publish a fixed FPS target or test-set accuracy, so this page does not claim those numbers.',
    },
    {
      type: 'retro',
      heading: 'What I’d change next',
      items: [
        'Replace placeholder analytics charts with daily aggregates once enough sessions exist in demo data.',
        'Benchmark WebSocket round-trip latency on Space hardware and expand negative testing (glasses, low light, profile angles).',
        'Publish or link proper training notes for the Keras artifact if the CNN stays in the cascade—today only the weights path and inference code are in-tree.',
        'Keep Gradio as a CV sandbox so Next + FastAPI remains the single product surface.',
      ],
    },
  ],
};
