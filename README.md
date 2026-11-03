# Arnav Poswal – Portfolio

Static portfolio built with Vite, TypeScript, GSAP, and Lenis.

## Setup

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## Pages

| URL | Entry |
|-----|--------|
| `/` | `index.html` — home (Lenis + GSAP) |
| `/work/orderflow.html` | OrderFlow case study |
| `/work/focusfleet.html` | FocusFleet case study |

Case study pages are static HTML with render-blocking CSS in `<head>` (plus a small inline critical block so nav/hero colors paint immediately). Screenshot lightbox uses a small bundled module on case study routes only.

### OrderFlow screenshot sync

`npm run prebuild` runs `scripts/sync-orderflow-assets.mjs`. If `../order-platform/docs/assets` exists locally, it **overwrites** `public/work/orderflow/*.png`. Set `ORDERFLOW_ASSETS` to a different folder, or remove the sibling repo, to avoid accidental overwrites. CI skips sync when that path is missing and uses committed assets in `public/`.

## Production

```bash
npm run build
npm run preview
```

The build emits `dist/index.html` and `dist/work/orderflow.html`, `dist/work/focusfleet.html`. Deploy the `dist/` folder to any static host (Cloudflare Pages, Vercel, Netlify, etc.).

OrderFlow screenshot PNGs can be refreshed from a sibling checkout with `npm run sync:orderflow`; set `ORDERFLOW_ASSETS` to override the default source directory (see `scripts/sync-orderflow-assets.mjs`).

### Pretty URLs (optional)

Vite serves case studies at `work/orderflow.html`. On production you can redirect clean paths to those files, for example:

**Cloudflare Pages** (`public/_redirects` or dashboard):

```
/orderflow   /work/orderflow.html   200
/focusfleet  /work/focusfleet.html  200
```

**Vercel** (`vercel.json`):

```json
{ "redirects": [
  { "source": "/orderflow", "destination": "/work/orderflow.html", "permanent": false },
  { "source": "/focusfleet", "destination": "/work/focusfleet.html", "permanent": false }
]}
```

Trailing-slash variants (`/work/orderflow/`) can use the same pattern with your host’s trailing-slash rules if you want directory-style URLs.
