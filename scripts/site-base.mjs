/** Build-time base path; must match Vite `base` and page generator `SITE_BASE`. */
export function siteBase() {
  let base = process.env.SITE_BASE?.trim() || '/Portfolio/';
  if (!base.startsWith('/')) base = `/${base}`;
  if (!base.endsWith('/')) base = `${base}/`;
  return base;
}