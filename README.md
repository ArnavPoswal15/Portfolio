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

Case study pages are static HTML with render-blocking CSS in `<head>` (plus a small inline critical block so nav/hero colors paint immediately). No JavaScript on case study routes.

## Production

```bash
npm run build
npm run preview
```

The build emits `dist/index.html` and `dist/work/orderflow.html`, `dist/work/focusfleet.html`. Deploy the `dist/` folder to any static host (Cloudflare Pages, Vercel, Netlify, etc.).

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
