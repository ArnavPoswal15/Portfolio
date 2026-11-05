# Content (copy & case studies)

Edit files here, then run `npm run dev` or `npm run build`. HTML under `index.html` and `work/*.html` is **generated** — do not edit those by hand.

| File | What to change |
|------|----------------|
| [`site.ts`](site.ts) | Name, nav, hero, statement, about cards, contact email/socials, footer, optional `clarityProjectId` ([Microsoft Clarity](https://clarity.microsoft.com/)) |
| [`work.ts`](work.ts) | Work grid tiles (slugs, blurbs, links, tile colors `t1`/`t2`/`t3`, view-transition names, optional link `note` / `stmt` / `decorative`) |
| [`case-studies/index.ts`](case-studies/index.ts) | Registry of all case studies (`allCaseStudies`) and shared `collectPreferPngGalleryPaths` for the build |
| [`case-studies/orderflow.ts`](case-studies/orderflow.ts) | OrderFlow case study sections |
| [`case-studies/focusfleet.ts`](case-studies/focusfleet.ts) | FocusFleet case study sections |
| [`case-studies/fraud-call.ts`](case-studies/fraud-call.ts) | Fraud Call Detection case study sections |
| [`case-studies/*/assets/*.svg`](case-studies/) | Architecture diagrams referenced by `figure` sections |

## Section types (case studies)

Sections in each case study file are a typed array:

| `type` | Fields |
|--------|--------|
| `prose` | `heading`, `paragraphs[]` (HTML allowed) |
| `figure` | `svgPath`, `caption` |
| `gallery` | `heading`, `rows[]` with `shots[]` and optional `layout: 'pair'`. Shot fields include `src`, dimensions, `alt`, `caption`, `ariaLabel`, optional layout/loading/fetchPriority, and optional **`preferPng: true`** (full-res PNG in gallery + lightbox; skips WebP in `optimize:images`) |
| `specs` | `rows[]` with `heading`, `body` |
| `results` | `heading`, `metric`, `paragraphs[]`, optional `noteLine` |
| `retro` | `heading`, `items[]` |

Gallery shots live under `public/work/<slug>/`. Run `npm run optimize:images` (part of `prebuild`) to refresh WebP variants in `image-manifest.json` for shots without `preferPng`; `preferPng: true` shots stay PNG-only.

## Microsoft Clarity

Set optional `clarityProjectId` in [`site.ts`](site.ts). At page generation, `scripts/generate-pages.mjs` injects the snippet from [`templates/partials/clarity.html`](../templates/partials/clarity.html) into the head partial when the ID is non-empty and alphanumeric. Override at build time with a non-empty `CLARITY_PROJECT_ID` env var (e.g. GitHub Actions secret). Invalid or empty IDs omit the script entirely.

## Adding a linked case study

1. Add PNGs under `public/work/<slug>/`.
2. Add `content/case-studies/<slug>.ts` + optional SVG assets.
3. Add a linked entry in `content/work.ts`.
4. Run `npm run generate:pages` (or `npm run dev`).

Nav, footer, lightbox, and home tile markup update automatically.
