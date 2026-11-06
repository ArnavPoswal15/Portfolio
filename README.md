# Portfolio

Personal site — Vite, TypeScript, GSAP + Lenis on the home page. Case studies are static HTML with a lightbox.

**Live:** [arnavposwal15.github.io/Portfolio](https://arnavposwal15.github.io/Portfolio/)

## Run locally

```bash
npm install
npm run dev
```


Open the URL Vite prints (base path `/Portfolio/`).

## Change copy

Edit [`content/`](content/README.md) (`site.ts`, `work.ts`, `case-studies/*.ts`), then:

```bash
npm run dev          # or: npm run generate:pages
```

Do not edit `index.html` or `work/*.html` by hand — they are generated.

## Build & deploy

```bash
npm run build
npm run preview
```

Output is `dist/`. GitHub Pages deploys via Actions on push to **`master`** ([workflow](.github/workflows/deploy-pages.yml)). Pages source: **GitHub Actions**.

## More

| Doc | For |
|-----|-----|
| [content/README.md](content/README.md) | Section types, new case study |
| [AGENTS.md](AGENTS.md) | Repo rules for contributors / AI |
