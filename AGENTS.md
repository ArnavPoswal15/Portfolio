# Agent guide — Portfolio repo

Instructions for AI agents (and humans) working in this codebase. Read this before changing copy, HTML, scroll behavior, or the build.

## What this project is

Static personal portfolio: Vite multi-page app (MPA), TypeScript, GSAP + Lenis on the home page only, GitHub Pages with base path **`/Portfolio/`**.

- **Home:** animated scroll, work grid, about, contact.
- **Case studies:** static long-form pages under `work/` with screenshot lightbox.

## Design direction (Apple-inspired, not a clone)

Aim for **restrained, editorial polish**—smooth scroll, typography-led layout, glass nav—not a plugin-y “startup template.”

Techniques this site actually uses (keep the set small):

- **Glass / blur:** sticky nav via `backdrop-filter` (sparingly; it is not free on GPU).
- **Typography as hero:** large headlines, tight tracking, whitespace, light/dark via `prefers-color-scheme`.
- **Scroll-linked moments only where they earn it:** hero recedes on scroll; one pinned philosophy paragraph (word dim → bright); FocusFleet tile eye scrub—not effects on every block.
- **Bento work grid:** 28px-radius tiles with distinct treatments (dark / light / warm), not identical cards.
- **Easing:** site token `--ease: cubic-bezier(.28,.11,.32,1)` (Apple-adjacent).

Do **not** add frame-sequence canvas scrubbing, 3D hero sections, or new motion layers unless the user explicitly asks. GSAP + Lenis on **home only**; case studies stay static + lightbox.

**Fonts:** Do not ship SF Pro (licence). Stack uses **Inter** (Google Fonts) + `system-ui` / `-apple-system` so Apple devices still feel native.

## Anti–“AI slop” rules (copy and UI)

When editing [`content/`](content/) or styles, **do not** introduce generic template chrome:

| Avoid | Use instead |
|-------|-------------|
| All-caps tracked “eyebrow” labels above headings | Existing kickers like “Experience” only where already styled |
| “01 / 02 / 03” section numbering | Plain headings |
| “→” on buttons | Apple-style **›** on `.more` links (already in CSS) |
| Gradient-wash hero decoration, identical SaaS cards | Distinct tile visuals; one motion idea per section max |
| Fade-slide-up on every section | Hero load + statement pin + one tile gimmick |
| Hover lift/glow on every card | Restrained hovers already in CSS |

**Motion budget (home):** hero headline mask on load; hero `.hero-in` scrub; statement word reveal; FocusFleet eye blink. Do not add a fourth “signature” animation without removing or replacing one.

**Quality floor:** responsive layout, visible `:focus-visible`, `prefers-reduced-motion` honored (static content, no view transitions), core copy readable if JS fails.

## Copy and privacy (non-negotiable)

Edit these only in [`content/site.ts`](content/site.ts) / case study files—keep tone **plain and specific**, grounded in real work:

- **Headline:** “Thoughtful software. Obsessively crafted.”
- **Intro:** “I’m Arnav, a software engineer. I build backend platforms and put AI features into production.”
- **Never** put the **employer company name** on the site (user request).
- **No phone number** on the public page (spam). Email and socials only in contact.
- Do not highlight **IdleKiller** or similar repos that could hurt recruiting.
- Open product copy question: “vehicle-management platform” / “pet health platform” may identify the employer—change only if the user asks.

Metrics and project facts should match resume/GitHub, not invented numbers.

## Golden rules

1. **Copy lives in `content/`, not in HTML.** Edit [`content/site.ts`](content/site.ts), [`content/work.ts`](content/work.ts), or [`content/case-studies/*.ts`](content/case-studies/). Then regenerate pages (see below).
2. **Do not hand-edit generated output:** `index.html`, `work/*.html`, `public/page-bootstrap.js`, WebP files under `public/work/`, and `public/work/image-manifest.json` are build artifacts. Regenerate instead.
3. **Write once, reuse:** Shared chrome (nav, footer, head, lightbox) lives in [`templates/partials/`](templates/partials/). Case study body HTML comes from [`scripts/render-sections.mjs`](scripts/render-sections.mjs). Do not duplicate markup across pages.
4. **Scroll behavior has one authority:** [`src/scroll-restore.ts`](src/scroll-restore.ts) + early [`src/page-bootstrap.ts`](src/page-bootstrap.ts) (built to `public/page-bootstrap.js`). Do not add inline scroll scripts to HTML.
5. **Preserve tile-aware “back to work”:** Returning from a case study must scroll to the **same work tile** (OrderFlow vs FocusFleet) using session keys and `data-scroll-target-tile` / `data-work-tile`. Run scroll regression after changes (below).
6. **Minimize diff scope:** Match existing style; no drive-by refactors unrelated to the task.

## Repository map

| Area | Purpose |
|------|---------|
| [`content/`](content/) | Source of truth for all user-visible copy and case study structure |
| [`templates/`](templates/) | HTML shells and partials for page generation |
| [`scripts/generate-pages.mjs`](scripts/generate-pages.mjs) | Renders content + templates → `index.html`, `work/*.html` |
| [`scripts/render-sections.mjs`](scripts/render-sections.mjs) | Maps section types to HTML (prose, gallery, figure, etc.) |
| [`scripts/optimize-images.mjs`](scripts/optimize-images.mjs) | Sharp: WebP + 1200w variants + manifest |
| [`src/`](src/) | Runtime TS (animations, scroll, prefetch, lightbox, styles) |
| [`public/work/`](public/work/) | Screenshot PNGs (+ generated WebP) |
| [`public/favicon.png`](public/favicon.png), [`public/favicon-32.png`](public/favicon-32.png), [`public/apple-touch-icon.png`](public/apple-touch-icon.png) | Site icons (linked from `templates/partials/head.html`) |
| [`vite.config.ts`](vite.config.ts) | Main MPA build; `manualChunks` for gsap/lenis |
| [`vite.bootstrap.config.ts`](vite.bootstrap.config.ts) | Builds scroll IIFE only |

Details for editors: [`content/README.md`](content/README.md). Human setup: [`README.md`](README.md).

## Changing content

1. Edit the right `content/` file (see content README table).
2. Run **`npm run dev`** (runs `predev`: generate pages + bootstrap) or **`npm run generate:pages`** alone.
3. For new screenshots: add PNGs under `public/work/<slug>/`, then **`npm run build`** or **`npm run optimize:images`** so `<picture>` / WebP stay in sync.

### Adding a linked case study

1. `public/work/<slug>/` assets.
2. `content/case-studies/<slug>.ts` (+ optional `assets/*.svg`).
3. One entry in `content/work.ts` (`slug`, `href`, `tileVariant`, `viewTransitionName`, etc.).
4. Regenerate pages. No new nav/footer/lightbox files required.

### Section types

Defined in [`content/types.ts`](content/types.ts); rendered in `render-sections.mjs`. Add a new section type in **one** place (types + renderer + docs in `content/README.md`), not per HTML file.

## Build pipeline (order matters)

| Step | When | Command / script |
|------|------|------------------|
| OrderFlow PNG sync | `prebuild` only | `scripts/sync-orderflow-assets.mjs` (skips if sibling repo missing) |
| Image optimization | `prebuild` | `scripts/optimize-images.mjs` |
| HTML generation | `predev`, `prebuild` | `npm run generate:pages` (uses `tsx`) |
| Bootstrap IIFE | `predev`, `prebuild` | `npm run build:bootstrap` |
| Typecheck + Vite | `build` | `tsc && vite build` |
| Sanity check | `postbuild` | `scripts/verify-build.mjs` |

**Note:** Local `prebuild` may overwrite OrderFlow PNGs if `../order-platform/docs/assets` exists. Set `ORDERFLOW_ASSETS` to override.

## Runtime JavaScript conventions

- **Home entry:** [`src/main.ts`](src/main.ts) — word split, animations, prefetch, copy-email.
- **Early scroll / view transitions:** [`public/page-bootstrap.js`](public/page-bootstrap.js) from `page-bootstrap.ts` — must stay small and synchronous in `<head>`.
- **Scroll restore:** [`src/scroll-restore.ts`](src/scroll-restore.ts) — session keys (`portfolio:scrollTarget`, `portfolio:workScrollY`, `portfolio:workTile`), `getWorkTileElement()` uses **`a.tile[data-work-tile="…"]`**. Tile IDs should match [`content/work.ts`](content/work.ts) slugs.
- **Animations:** [`src/animations.ts`](src/animations.ts) — dynamic `import()` of gsap/lenis; config in [`src/animations.config.ts`](src/animations.config.ts) from `content/work.ts` (eye blink uses `[data-decorative="eye"]`).
- **Prefetch:** [`src/prefetch.ts`](src/prefetch.ts) — case study hrefs from `content/work.ts`.
- **Case studies only:** [`src/case-study-lightbox.ts`](src/case-study-lightbox.ts) — keep single shared module.

Do not reintroduce `public/portfolio-page.js` or duplicate selector strings like `a.tile.t1[href*="orderflow"]` outside tests; prefer `data-work-tile` and shared content exports.

## CSS and view transitions

- Design tokens: [`src/styles/tokens.css`](src/styles/tokens.css). Critical paint CSS: [`src/styles/critical-inline.css`](src/styles/critical-inline.css) (injected via template).
- Home bundle: [`src/styles/index.css`](src/styles/index.css). Case studies: `site.css` + `case-study.css`.
- View transition duration: [`src/styles/view-transitions.css`](src/styles/view-transitions.css) (0.55s — keep aligned with scroll restore duration in `scroll-restore.ts`).
- `view-transition-name` on tiles/heroes comes from **`content/work.ts`** / case study meta at generate time.

Respect **`prefers-reduced-motion`**: view transitions disabled in CSS; scroll restore uses immediate scroll when reduced motion is on.

## Testing and verification

After scroll, template, or bootstrap changes:

```bash
npm run build
npm run preview
BASE=http://127.0.0.1:4173/Portfolio/ npm run test:scroll
```

(`npx playwright install chromium` once.) Default `test:scroll` targets production GitHub Pages if `BASE` is unset.

Always ensure **`npm run build`** ends with **`verify-build: OK`**.

## Git and deploy

- Commit generated HTML, `public/page-bootstrap.js`, WebP variants, and `image-manifest.json` so GitHub Pages CI/deploy does not require extra local steps.
- Deploy artifact: **`dist/`** with base `/Portfolio/`.
- Use conventional commits when asked to commit (`feat:`, `fix:`, `docs:`, `chore:`, etc.).

## Common mistakes to avoid

| Mistake | Instead |
|---------|---------|
| Edit `index.html` / `work/*.html` directly | Edit `content/` + run `generate:pages` |
| Hardcode email or slugs in `main.ts` | Use `data-email` from generator / `content/site.ts` |
| New inline `<script>` for scroll | Extend `page-bootstrap.ts` or `scroll-restore.ts` |
| Copy-paste nav/footer into a new case study | Add content file + `work.ts` entry; regenerate |
| Skip `optimize:images` after new PNGs | Run `prebuild` or `optimize:images` |
| Force-push the default branch (`master`) | Never unless user explicitly requests |

## Optional follow-ups (not required for every change)

- Self-host Inter (`@fontsource/inter`) instead of Google Fonts (plan Tier C).
- Pretty URL redirects — see [`README.md`](README.md).

When in doubt, read [`content/README.md`](content/README.md) and run a full **`npm run build`**.

## Reference links (design research)

Lenis + GSAP sync pattern lives in [`src/animations.ts`](src/animations.ts). GSAP 3.13+ plugins are free for commercial use. For deeper Apple-style techniques (canvas sequences, R3F), see Web docs—**out of scope** unless requested.
