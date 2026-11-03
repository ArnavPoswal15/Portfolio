import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const dist = join(root, 'dist');
const assetsDir = join(dist, 'assets');

const cssFiles = readdirSync(assetsDir).filter((f) => /^case-study-.*\.css$/.test(f));
if (cssFiles.length === 0) {
  console.error('verify-build: no case-study-*.css in dist/assets');
  process.exit(1);
}

const css = cssFiles.map((f) => readFileSync(join(assetsDir, f), 'utf8')).join('\n');
if (!css.includes('.case-study .specs .row')) {
  console.error('verify-build: case-study CSS missing .case-study .specs .row rules');
  process.exit(1);
}

for (const page of ['orderflow.html', 'focusfleet.html']) {
  const html = readFileSync(join(dist, 'work', page), 'utf8');
  const hasModule =
    html.includes('type="module"') &&
    (html.includes('case-study-lightbox') || /assets\/[^"]+\.js/.test(html));
  if (!hasModule) {
    console.error(`verify-build: ${page} missing bundled lightbox module script`);
    process.exit(1);
  }
}

console.log('verify-build: OK');
