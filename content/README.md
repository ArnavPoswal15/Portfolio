# Content (copy & case studies)

Edit files here, then run `npm run dev` or `npm run build`. HTML under `index.html` and `work/*.html` is **generated** — do not edit those by hand.

| File | What to change |
|------|----------------|
| [`site.ts`](site.ts) | Name, nav, hero, statement, about cards, contact email/socials, footer |
| [`work.ts`](work.ts) | Work grid tiles (slugs, blurbs, links, tile colors `t1`/`t2`/`t3`, view-transition names) |
| [`case-studies/orderflow.ts`](case-studies/orderflow.ts) | OrderFlow case study sections |
| [`case-studies/focusfleet.ts`](case-studies/focusfleet.ts) | FocusFleet case study sections |
| [`case-studies/*/assets/*.svg`](case-studies/) | Architecture diagrams referenced by `figure` sections |

## Section types (case studies)

Sections in each case study file are a typed array:

| `type` | Fields |
|--------|--------|
| `prose` | `heading`, `paragraphs[]` (HTML allowed) |
| `figure` | `svgPath`, `caption` |
| `gallery` | `heading`, `rows[]` with `shots[]` and optional `layout: 'pair'` |
| `specs` | `rows[]` with `heading`, `body` |
| `results` | `heading`, `metric`, `paragraphs[]`, optional `noteLine` |
| `retro` | `heading`, `items[]` |

Gallery shots live under `public/work/<slug>/`. Run `npm run optimize:images` (part of `prebuild`) to refresh WebP variants used in `<picture>` markup.

## Adding a third project

1. Add PNGs under `public/work/<slug>/`.
2. Add `content/case-studies/<slug>.ts` + optional SVG assets.
3. Add a linked entry in `content/work.ts`.
4. Run `npm run generate:pages` (or `npm run dev`).

Nav, footer, lightbox, and home tile markup update automatically.
