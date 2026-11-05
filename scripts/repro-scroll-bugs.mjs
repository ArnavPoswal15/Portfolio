/**
 * Playwright scroll regression (tile restore, back-to-work).
 * Usage:
 *   npm run preview
 *   BASE=http://127.0.0.1:4173/Portfolio/ npm run test:scroll
 *
 * Default BASE targets live GitHub Pages.
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'https://arnavposwal15.github.io/Portfolio/';
const NAV_OFFSET = 52;
/** Case study pages have large PNGs + third-party scripts; `load` can exceed Playwright defaults. */
const NAV_WAIT = { waitUntil: 'domcontentloaded' };

async function clickNav(page, selector, urlPattern) {
  await Promise.all([
    page.waitForURL(urlPattern, NAV_WAIT),
    page.click(selector, { noWaitAfter: true }),
  ]);
}

async function waitForScrollSettle(page, ms = 2500) {
  await page.waitForTimeout(ms);
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(500);
}

async function measureTiles(page) {
  return page.evaluate((navOffset) => {
    const t1 = document.querySelector('a.tile[data-work-tile="orderflow"]');
    const t2 = document.querySelector('a.tile[data-work-tile="focusfleet"]');
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

  await page.goto(`${BASE}index.html`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    const work = document.getElementById('work');
    if (work) {
      const y = work.getBoundingClientRect().top + window.scrollY - 52;
      window.scrollTo(0, Math.max(0, y));
    }
  });
  await waitForScrollSettle(page);
  results.beforeOrderFlowClick = await measureTiles(page);

  await clickNav(page, 'a.tile[data-work-tile="orderflow"]', /orderflow\.html/);
  results.onOrderFlowPage = { url: page.url() };

  await clickNav(page, 'a[data-scroll-target-tile="orderflow"]', /index\.html/);
  await waitForScrollSettle(page, 3200);
  results.orderFlowWorkNav = await measureTiles(page);

  await page.goto(`${BASE}index.html`, { waitUntil: 'domcontentloaded' });
  await waitForScrollSettle(page);
  await clickNav(page, 'a.tile[data-work-tile="orderflow"]', /orderflow\.html/);
  await waitForScrollSettle(page);

  await page.goto(`${BASE}index.html`, { waitUntil: 'domcontentloaded' });
  await waitForScrollSettle(page);
  await clickNav(page, 'a.tile[data-work-tile="focusfleet"]', /focusfleet\.html/);
  await waitForScrollSettle(page);

  const sessionBeforeBack = await page.evaluate(() => ({
    scrollTarget: sessionStorage.getItem('portfolio:scrollTarget'),
    workScrollY: sessionStorage.getItem('portfolio:workScrollY'),
    workTile: sessionStorage.getItem('portfolio:workTile'),
  }));

  await clickNav(page, 'a.more[data-scroll-target-tile="focusfleet"]', /index\.html/);
  await waitForScrollSettle(page, 3200);
  results.focusFleetBackToWork = await measureTiles(page);
  results.sessionBeforeBack = sessionBeforeBack;

  console.log(JSON.stringify(results, null, 2));

  const orderOk = results.orderFlowWorkNav?.alignedTile === 'orderflow';
  const focusOk = results.focusFleetBackToWork?.alignedTile === 'focusfleet';
  if (!orderOk || !focusOk) {
    console.error(
      `SCROLL_RESTORE: FAIL (orderflow=${results.orderFlowWorkNav?.alignedTile}, focusfleet=${results.focusFleetBackToWork?.alignedTile})`,
    );
    await browser.close();
    process.exit(1);
  }
  console.log('SCROLL_RESTORE: OK');

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
