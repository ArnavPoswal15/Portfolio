import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const workDir = join(root, 'public/work');
const manifest = {};
const tasks = [];

function walkPngs(dir, rel = '') {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const relPath = rel ? `${rel}/${name}` : name;
    if (statSync(full).isDirectory()) {
      if (name === 'node_modules') continue;
      walkPngs(full, relPath);
      continue;
    }
    if (extname(name).toLowerCase() !== '.png') continue;
    const key = relPath.replace(/\.png$/i, '');
    const base = basename(name, '.png');
    const outDir = dirname(full);
    const dirRel = dirname(relPath);
    const prefix = dirRel === '.' ? '' : `${dirRel}/`;
    const webpRel = `${prefix}${base}.webp`;
    const webp1200Rel = `${prefix}${base}-1200w.webp`;
    const webpFull = join(outDir, `${base}.webp`);
    const webp1200Full = join(outDir, `${base}-1200w.webp`);

    manifest[key] = { webp: webpRel, webp1200: webp1200Rel };

    tasks.push(sharp(full).webp({ quality: 82 }).toFile(webpFull));
    tasks.push(
      sharp(full)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(webp1200Full),
    );
  }
}

async function main() {
  walkPngs(workDir);
  await Promise.all(tasks);
  writeFileSync(join(workDir, 'image-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`optimize-images: ${tasks.length / 2} PNG(s) → WebP variants`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
