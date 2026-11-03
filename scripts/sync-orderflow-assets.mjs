import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src =
  process.env.ORDERFLOW_ASSETS ??
  join(root, '..', 'order-platform', 'docs', 'assets');
const dest = join(root, 'public', 'work', 'orderflow');

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

mkdirSync(dest, { recursive: true });
for (const file of files) {
  const from = join(src, file);
  if (!existsSync(from)) {
    console.warn(`Missing ${from}, skipping.`);
    continue;
  }
  cpSync(from, join(dest, file));
}
console.log(`Synced OrderFlow screenshots from ${src}`);
