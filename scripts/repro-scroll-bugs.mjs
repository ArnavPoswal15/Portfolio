/**
 * One-off Playwright repro against live GitHub Pages.
 * Usage: npx playwright install chromium && node scripts/repro-scroll-bugs.mjs
 */
import { chromium } from 'playwright';

const BASE = 'https://arnavposwal15.github.io/Portfolio/';
const NAV_OFFSET = 52;

async function waitForScrollSettle(page, ms = 2500) {
  await page.waitForTimeout(ms);
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(500);
}

async function measureTiles(page) {
  return page.evaluate((navOffset) => {
    const t1 = document.querySelector('a.tile.t1[href*="orderflow"]');
    const t2 = document.querySelector('a.tile.t2[href*="focusfleet"]');
    const work = document.getElementById('work');
    const statement = document.querySelector('.statement');
    const rect = (el) =>
      el
        ? {
            top: Math.round(el.getBoundingClientRect().top),
            bottom: Math.round(el.getBoundingClientRect().bottom),
          }
        : null;
    return {
      scrollY: Math.round(window.scrollY),
      url: location.href,
      session: {
        scrollTarget: sessionStorage.getItem('portfolio:scrollTarget'),
        workScrollY: sessionStorage.getItem('portfolio:workScrollY'),
        workTile: sessionStorage.getItem('portfolio:workTile'),
      },
      work: rect(work),
      statement: rect(statement),
      t1: rect(t1),
      t2: rect(t2),
      alignedTile:
        t1 && Math.abs(t1.getBoundingClientRect().top - navOffset) < 40
          ? 'orderflow'
          : t2 && Math.abs(t2.getBoundingClientRect().top - navOffset) < 40
            ? 'focusfleet'
            : 'none',
      statementInView:
        statement &&
        statement.getBoundingClientRect().top < window.innerHeight * 0.5 &&
        statement.getBoundingClientRect().bottom > navOffset,
    };
  }, NAV_OFFSET);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  const results = {};

  // Test A: scroll to work, click OrderFlow tile
  await page.goto(`${BASE}index.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const work = document.getElementById('work');
    if (work) {
      const y = work.getBoundingClientRect().top + window.scrollY - 52;
      window.scrollTo(0, Math.max(0, y));
    }
  });
  await waitForScrollSettle(page);
  results.beforeOrderFlowClick = await measureTiles(page);

  await page.click('a.tile.t1[href*="orderflow"]');
  await page.waitForURL(/orderflow\.html/);
  results.onOrderFlowPage = { url: page.url() };

  // Work nav from OrderFlow case study
  await page.click('a[data-scroll-target-tile="orderflow"]');
  await page.waitForURL(/index\.html/);
  await waitForScrollSettle(page);
  results.orderFlowWorkNav = await measureTiles(page);

  // Test B: FocusFleet back to work (fresh session path)
  await page.goto(`${BASE}index.html`, { waitUntil: 'networkidle' });
  await waitForScrollSettle(page);
  await page.click('a.tile.t1[href*="orderflow"]');
  await page.waitForURL(/orderflow\.html/);
  await waitForScrollSettle(page);

  await page.goto(`${BASE}index.html`, { waitUntil: 'networkidle' });
  await waitForScrollSettle(page);
  await page.click('a.tile.t2[href*="focusfleet"]');
  await page.waitForURL(/focusfleet\.html/);
  await waitForScrollSettle(page);

  const sessionBeforeBack = await page.evaluate(() => ({
    scrollTarget: sessionStorage.getItem('portfolio:scrollTarget'),
    workScrollY: sessionStorage.getItem('portfolio:workScrollY'),
    workTile: sessionStorage.getItem('portfolio:workTile'),
  }));

  await page.click('a.more[data-scroll-target-tile="focusfleet"]');
  await page.waitForURL(/index\.html/);
  await waitForScrollSettle(page);
  results.focusFleetBackToWork = await measureTiles(page);
  results.sessionBeforeBack = sessionBeforeBack;

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
