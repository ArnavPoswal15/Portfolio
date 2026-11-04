import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../content/site.ts';
import { workEntries } from '../content/work.ts';
import { orderflowCaseStudy } from '../content/case-studies/orderflow.ts';
import { focusfleetCaseStudy } from '../content/case-studies/focusfleet.ts';
import {
  escapeHtml,
  renderCaseStudySections,
  renderNextProject,
} from './render-sections.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

/** Must match `base` in vite.config.ts */
const SITE_BASE = '/Portfolio/';
const FAVICON_V = '?v=4';

function readPartial(name) {
  return readFileSync(join(root, 'templates/partials', name), 'utf8');
}

function readTemplate(name) {
  return readFileSync(join(root, 'templates', name), 'utf8');
}

function apply(template, vars) {
  return Object.entries(vars).reduce(
    (html, [key, value]) => html.replaceAll(`{{${key}}}`, value ?? ''),
    template,
  );
}

function minifyCriticalCss(css) {
  return css.replace(/\s+/g, ' ').trim();
}

function renderClarityScript() {
  const id = (process.env.CLARITY_PROJECT_ID ?? site.clarityProjectId ?? '').trim();
  if (!id || !/^[a-z0-9]+$/i.test(id)) {
    return '';
  }
  return apply(readPartial('clarity.html'), { CLARITY_PROJECT_ID: id });
}

function renderHead({ title, description, stylesheets }) {
  const critical = minifyCriticalCss(
    readFileSync(join(root, 'src/styles/critical-inline.css'), 'utf8'),
  );
  const sheets = stylesheets.map((href) => `<link rel="stylesheet" href="${href}">`).join('\n');
  return apply(readPartial('head.html'), {
    TITLE: escapeHtml(title),
    DESCRIPTION: escapeHtml(description),
    BASE: SITE_BASE,
    FAVICON_V,
    CRITICAL_CSS: `<style>${critical}</style>`,
    STYLESHEETS: sheets,
    CLARITY_SCRIPT: renderClarityScript(),
  });
}

function renderHomeNav() {
  const items = site.nav
    .map((link) => `<li><a href="${link.href}">${escapeHtml(link.label)}</a></li>`)
    .join('\n      ');
  return apply(readPartial('nav.html'), {
    NAME_BLOCK: `<b>${escapeHtml(site.name)}</b>`,
    NAV_ITEMS: items,
  });
}

function renderCaseNav(scrollTargetTile) {
  const items = site.nav
    .map((link) => {
      if (link.href === '#work') {
        return `<li><a href="../index.html" data-scroll-target="work" data-scroll-target-tile="${scrollTargetTile}">${escapeHtml(link.label)}</a></li>`;
      }
      return `<li><a href="../index.html${link.href}">${escapeHtml(link.label)}</a></li>`;
    })
    .join('\n      ');
  return apply(readPartial('nav.html'), {
    NAME_BLOCK: `<a href="../index.html"><b>${escapeHtml(site.name)}</b></a>`,
    NAV_ITEMS: items,
  });
}

function renderWorkGrid() {
  return workEntries
    .map((entry) => {
      if (entry.kind === 'link') {
        const vt = entry.viewTransitionName
          ? ` style="view-transition-name: ${entry.viewTransitionName}"`
          : '';
        const decorative =
          entry.decorative === 'eye'
            ? '\n      <div class="eye" data-decorative="eye" aria-hidden="true"></div>'
            : '';
        const stmt = entry.stmt ? `\n      <p class="stmt">${entry.stmt}</p>` : '';
        return `<a class="tile ${entry.tileVariant}" href="${entry.href}" data-work-tile="${entry.slug}"${vt}>
      <div>
        <h3>${escapeHtml(entry.title)}</h3>
        <p>${escapeHtml(entry.blurb)}</p>
        <span class="more">Learn more</span>
      </div>${decorative}${stmt}
    </a>`;
      }
      return `<article class="tile ${entry.tileVariant}">
      <div>
        <h3>${escapeHtml(entry.title)}</h3>
        <p>${escapeHtml(entry.blurb)}</p>
      </div>
      <p class="note">${escapeHtml(entry.note)}</p>
    </article>`;
    })
    .join('\n    ');
}

function renderAbout() {
  return site.about.cards
    .map((card) => {
      if ('skills' in card) {
        return `<article class="about-card">
        <p class="about-kicker">${escapeHtml(card.kicker)}</p>
        <dl class="about-skill-spec">
${card.skills
  .map(
    (s) => `          <div>
            <dt>${escapeHtml(s.term)}</dt>
            <dd>${escapeHtml(s.detail)}</dd>
          </div>`,
  )
  .join('\n')}
        </dl>
      </article>`;
      }
      if ('figures' in card && card.figures) {
        return `<article class="about-card">
        <p class="about-kicker">${escapeHtml(card.kicker)}</p>
        <p class="about-lead">${escapeHtml(card.lead)}</p>
        <ul class="about-figures" aria-label="Selected impact">
${card.figures
  .map(
    (f) => `          <li>
            <p class="about-figure-val">${escapeHtml(f.value)}</p>
            <p class="about-figure-cap">${escapeHtml(f.caption)}</p>
          </li>`,
  )
  .join('\n')}
        </ul>
        <p class="about-body">${escapeHtml(card.body)}</p>
      </article>`;
      }
      const figureBlock =
        'figureValue' in card && card.figureValue
          ? `\n        <p class="about-figure-val about-figure-val--tight">${escapeHtml(card.figureValue)}</p>
        <p class="about-figure-cap">${escapeHtml(card.figureCaption ?? '')}</p>`
          : '';
      return `<article class="about-card">
        <p class="about-kicker">${escapeHtml(card.kicker)}</p>
        <p class="about-lead">${escapeHtml(card.lead)}</p>${figureBlock}
        <p class="about-body">${escapeHtml(card.body)}</p>
      </article>`;
    })
    .join('\n\n      ');
}

function renderHomeMain() {
  return `<main>
<section class="hero" id="top">
  <div class="wrap hero-in">
    <h1>
      <span class="line"><span>${escapeHtml(site.hero.lines[0])}</span></span>
      <span class="line muted"><span>${escapeHtml(site.hero.lines[1])}</span></span>
    </h1>
    <p class="sub">${escapeHtml(site.hero.sub)}</p>
    <div class="cta">
      <a class="pill" href="${site.hero.ctaPrimary.href}">${escapeHtml(site.hero.ctaPrimary.label)}</a>
      <a class="more" href="${site.hero.ctaSecondary.href}">${escapeHtml(site.hero.ctaSecondary.label)}</a>
    </div>
  </div>
</section>

<section class="statement" aria-label="Philosophy">
  <div class="wrap">
    <p data-split>${escapeHtml(site.statement)}</p>
  </div>
</section>

<section class="work" id="work">
  <div class="wrap">
    <h2>${escapeHtml(site.workSection.heading)}</h2>
    <p class="lead">${escapeHtml(site.workSection.lead)}</p>
  </div>
  <div class="grid">
    ${renderWorkGrid()}
  </div>
</section>

<section class="about" id="about">
  <div class="wrap">
    <h2>${escapeHtml(site.about.heading)}</h2>
    <div class="about-grid">
      ${renderAbout()}
    </div>
  </div>
</section>

<section class="contact" id="contact">
  <div class="wrap contact-inner">
    <h2>${escapeHtml(site.contact.heading)}</h2>
    <p class="contact-sub">${escapeHtml(site.contact.sub)}</p>

    <div class="mail-row">
      <a class="mail" href="mailto:${escapeHtml(site.contact.email)}" data-email="${escapeHtml(site.contact.email)}">${escapeHtml(site.contact.email)}</a>
      <button class="copy" type="button" id="copyMail" data-copy-label="${escapeHtml(site.contact.copyLabel)}">${escapeHtml(site.contact.copyLabel)}</button>
    </div>

    <div class="cta">
${site.contact.socials
  .map((s) => {
    const external = s.external !== false && /^https?:\/\//.test(s.href);
    const target = external ? ' target="_blank" rel="noopener"' : '';
    const download = s.download
      ? ` download="${escapeHtml(s.download)}"`
      : '';
    return `      <a class="more" href="${escapeHtml(s.href)}"${target}${download}>${escapeHtml(s.label)}</a>`;
  })
  .join('\n')}
    </div>
  </div>
</section>
</main>`;
}

function wrapLayout({ head, nav, main, footer, afterFooter, moduleScript }) {
  return apply(readTemplate('layout.html'), {
    HEAD: head,
    NAV: nav,
    MAIN: main,
    FOOTER: footer,
    AFTER_FOOTER: afterFooter,
    MODULE_SCRIPT: moduleScript,
  });
}

function writePage(relPath, html) {
  const out = join(root, relPath);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html, 'utf8');
  console.log(`generate-pages: wrote ${relPath}`);
}

// Case study intro lede is first paragraph of Problem section - already in sections; duplicate stack line only at top
function renderCaseStudyMain(study) {
  const sectionsHtml = renderCaseStudySections(study.sections);
  const nextHtml = renderNextProject(study.nextProject);
  const heroClass = study.heroTheme === 'dark' ? 'cs-hero--dark' : 'cs-hero--light';

  return `<main class="case-study">
  <header class="cs-hero ${heroClass}">
    <div class="wrap cs-hero-in">
      <h1>${escapeHtml(study.title)}</h1>
    </div>
  </header>
  <div class="wrap">
    <p class="case-intro lede">${study.introLede}</p>
    <p class="case-intro stack">${study.stackLine}</p>

    ${sectionsHtml}

    ${nextHtml}

  </div>
</main>`;
}

function generateHome() {
  const html = wrapLayout({
    head: renderHead({
      title: site.homeTitle,
      description: site.metaDescription,
      stylesheets: ['/src/styles/index.css', '/src/styles/view-transitions.css'],
    }),
    nav: renderHomeNav(),
    main: renderHomeMain(),
    footer: `<footer>\n${readPartial('footer-meta.html')
      .replace('{{COPYRIGHT}}', escapeHtml(site.footer.copyright))
      .replace('{{TAGLINE}}', escapeHtml(site.footer.tagline))}\n</footer>`,
    afterFooter: '',
    moduleScript: '<script type="module" src="/src/main.ts"></script>',
  });
  writePage('index.html', html);
}

function generateCaseStudy(study) {
  const footerLinks = [
    `<a class="more" href="../index.html" data-scroll-target="work" data-scroll-target-tile="${study.slug}">Back to work</a>`,
  ];
  if (study.githubUrl) {
    const label = study.slug === 'orderflow' ? 'View on GitHub' : 'Source on GitHub';
    footerLinks.push(
      `<a class="more" href="${study.githubUrl}" target="_blank" rel="noopener">${label}</a>`,
    );
  }
  for (const link of study.extraFooterLinks ?? []) {
    footerLinks.push(
      `<a class="more" href="${link.href}" target="_blank" rel="noopener">${escapeHtml(link.label)}</a>`,
    );
  }

  const footer = `<footer>
${apply(readPartial('footer-case-actions.html'), { CASE_LINKS: footerLinks.join('\n        ') })}
${readPartial('footer-meta.html')
  .replace('{{COPYRIGHT}}', escapeHtml(site.footer.copyright))
  .replace('{{TAGLINE}}', escapeHtml(site.footer.tagline))}
</footer>`;

  const html = wrapLayout({
    head: renderHead({
      title: site.titleTemplate(`${study.title} – Case study`),
      description: study.description,
      stylesheets: [
        '/src/styles/site.css',
        '/src/styles/case-study.css',
        '/src/styles/view-transitions.css',
      ],
    }),
    nav: renderCaseNav(study.slug),
    main: renderCaseStudyMain(study),
    footer,
    afterFooter: readPartial('lightbox.html'),
    moduleScript: '<script type="module" src="/src/case-study-lightbox.ts"></script>',
  });

  writePage(`work/${study.slug}.html`, html);
}

generateHome();
for (const study of [orderflowCaseStudy, focusfleetCaseStudy]) {
  generateCaseStudy(study);
}
