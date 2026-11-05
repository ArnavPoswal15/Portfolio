import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const manifestPath = join(root, 'public/work/image-manifest.json');

let manifest = {};
if (existsSync(manifestPath)) {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
}

/** @param {string} text */
export function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * @param {import('../content/types.ts').GalleryShot} shot
 * @param {string} [basePath] relative prefix for img src (e.g. '' for work/*.html)
 */
export function renderGalleryImage(shot, basePath = '') {
  const src = `${basePath}${shot.src}`;
  const key = shot.src.replace(/\.png$/i, '');
  const entry = manifest[key];
  const figureClass =
    shot.layout === 'hero' ? 'shot shot--hero' : shot.layout === 'wide' ? 'shot shot--wide' : 'shot';
  const loading =
    shot.fetchPriority === 'high' ? '' : shot.loading === 'lazy' || !shot.fetchPriority ? ' loading="lazy"' : '';
  const fetchPriority = shot.fetchPriority === 'high' ? ' fetchpriority="high"' : '';
  const decoding = ' decoding="async"';

  let imgInner;
  if (!shot.preferPng && (entry?.webp || entry?.webp1200)) {
    const sources = [];
    if (entry.webp1200) {
      sources.push(
        `<source type="image/webp" srcset="${basePath}${entry.webp1200}" media="(min-width: 800px)">`,
      );
    }
    if (entry.webp) {
      sources.push(`<source type="image/webp" srcset="${basePath}${entry.webp}">`);
    }
    imgInner = `<picture>${sources.join('')}<img src="${src}" width="${shot.width}" height="${shot.height}" alt="${escapeHtml(shot.alt)}"${loading}${fetchPriority}${decoding}></picture>`;
  } else {
    imgInner = `<img src="${src}" width="${shot.width}" height="${shot.height}" alt="${escapeHtml(shot.alt)}"${loading}${fetchPriority}${decoding}>`;
  }

  return `<figure class="${figureClass}">
        <button class="shot-btn" type="button" aria-label="${escapeHtml(shot.ariaLabel)}">
          ${imgInner}
          <span class="shot-hint" aria-hidden="true">⤢</span>
        </button>
        <figcaption>${shot.caption}</figcaption>
      </figure>`;
}

/**
 * @param {import('../content/types.ts').CaseStudySection[]} sections
 */
export function renderCaseStudySections(sections) {
  return sections
    .map((section) => {
      switch (section.type) {
        case 'prose':
          return `<section>
      <h2>${escapeHtml(section.heading)}</h2>
${section.paragraphs.map((p) => `      <p>${p}</p>`).join('\n')}
    </section>`;
        case 'figure': {
          const svg = readFileSync(join(root, section.svgPath), 'utf8').trim();
          return `<figure class="arch">
      ${svg}
      <figcaption>${section.caption}</figcaption>
    </figure>`;
        }
        case 'gallery': {
          const rowsHtml = section.rows
            .map((row) => {
              const shots = row.shots.map((shot) => renderGalleryImage(shot)).join('\n      ');
              if (row.shots.length === 1 && (row.shots[0].layout === 'hero' || row.shots[0].layout === 'wide')) {
                return `      ${shots}`;
              }
              const gridClass =
                row.layout === 'pair' ? 'shots-grid shots-grid--pair' : 'shots-grid';
              return `      <div class="${gridClass}">
        ${shots}
      </div>`;
            })
            .join('\n');
          return `<section class="shots" aria-label="Screenshots">
      <h2>${escapeHtml(section.heading)}</h2>
${rowsHtml}
    </section>`;
        }
        case 'specs':
          return `<section class="specs">
${section.rows
  .map(
    (row) => `      <article class="row">
        <h3>${escapeHtml(row.heading)}</h3>
        <p>${row.body}</p>
      </article>`,
  )
  .join('\n')}
    </section>`;
        case 'results':
          return `<section class="results">
      <h2>${escapeHtml(section.heading)}</h2>
      <div class="callout">
        <p class="metric">${section.metric}</p>
${section.paragraphs.map((p) => `        <p>${p}</p>`).join('\n')}
        ${section.noteLine ? `<p class="note-line">${section.noteLine}</p>` : ''}
      </div>
    </section>`;
        case 'retro':
          return `<section class="retro">
      <h2>${escapeHtml(section.heading)}</h2>
      <ul>
${section.items.map((item) => `        <li>${escapeHtml(item)}</li>`).join('\n')}
      </ul>
    </section>`;
        default:
          return '';
      }
    })
    .join('\n\n    ');
}

/**
 * @param {{ slug: string; title: string; desc: string }} next
 */
export function renderNextProject(next) {
  return `<section class="next-project" aria-label="Next project">
      <p class="next-label">Next project</p>
      <a class="next-link" href="${escapeHtml(next.slug)}.html">
        <span class="next-title">${escapeHtml(next.title)}</span>
        <span class="next-desc">${escapeHtml(next.desc)}</span>
        <span class="more">Learn more</span>
      </a>
    </section>`;
}
