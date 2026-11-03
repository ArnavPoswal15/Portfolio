import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const defaultSrc = join(root, '..', 'order-platform', 'docs', 'assets');
const src = process.env.ORDERFLOW_ASSETS ?? defaultSrc;
const dest = join(root, 'public', 'work', 'orderflow');
const usingDefault = !process.env.ORDERFLOW_ASSETS;

const files = [
  'storefront.png',
  'order-timeline.png',
  'ops-flash-sale.png',
  'kibana-dashboard.png',
  'kibana-trace.png',
];

if (!existsSync(src)) {
  console.warn(`OrderFlow assets not found at ${src}; using committed files in public/.`);
  process.exit(0);
}

if (usingDefault) {
  console.warn(
    'OrderFlow sync: copying from sibling order-platform path. Set ORDERFLOW_ASSETS to override, or remove that repo to avoid accidental overwrites of public/work/orderflow/.',
  );
}

mkdirSync(dest, { recursive: true });
const copied = [];
for (const file of files) {
  const from = join(src, file);
  if (!existsSync(from)) {
    console.warn(`Missing ${from}, skipping.`);
    continue;
  }
  cpSync(from, join(dest, file));
  copied.push(file);
}
console.log(`Synced OrderFlow screenshots from ${src}`);
if (copied.length) {
  console.warn(`Overwrote in public/work/orderflow/: ${copied.join(', ')}`);
}
