import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

mkdirSync('./screenshots', { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3322', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// 1. Hero — top of page
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await page.screenshot({ path: './screenshots/01-hero.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
console.log('✓ hero');

// Helper: screenshot a section by id
async function shotSection(id, filename, extraPad = 40) {
  const box = await page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: el.scrollHeight };
  }, id);
  if (!box) { console.error('section not found:', id); return; }
  await page.evaluate((top) => window.scrollTo(0, top - 80), box.top);
  await page.waitForTimeout(400);
  const vp = await page.evaluate((id) => {
    const el = document.getElementById(id);
    const r = el.getBoundingClientRect();
    return { y: r.top, h: r.height };
  }, id);
  const clipY = Math.max(0, vp.y - extraPad / 2);
  const clipH = Math.min(900, vp.h + extraPad);
  await page.screenshot({ path: filename, clip: { x: 0, y: clipY, width: 1440, height: clipH } });
}

// Helper: screenshot a section by index (for sections without an id)
async function shotSectionByIndex(idx, filename) {
  const box = await page.evaluate((i) => {
    const sections = document.querySelectorAll('section');
    const el = sections[i];
    if (!el) return null;
    el.scrollIntoView({ block: 'start' });
    const r = el.getBoundingClientRect();
    return { top: window.scrollY + r.top, scrollHeight: el.scrollHeight };
  }, idx);
  if (!box) { console.error('section index not found:', idx); return; }
  await page.waitForTimeout(400);
  const vp = await page.evaluate((i) => {
    const el = document.querySelectorAll('section')[i];
    const r = el.getBoundingClientRect();
    return { y: r.top, h: el.scrollHeight };
  }, idx);
  const clipY = Math.max(0, vp.y - 20);
  const clipH = Math.min(vp.h + 40, 900 - clipY);
  await page.screenshot({ path: filename, clip: { x: 0, y: clipY, width: 1440, height: Math.max(100, clipH) } });
}

// 2. Problems
await shotSection('problemas', './screenshots/02-problems.png', 80);
console.log('✓ problems');

// 3. Table (section index 3 — no id)
await shotSectionByIndex(3, './screenshots/03-table.png');
console.log('✓ table');

// 4. Guarantee
await shotSection('garantia', './screenshots/04-guarantee.png', 80);
console.log('✓ guarantee');

// 5. Form
await shotSection('contacto', './screenshots/05-form.png', 80);
console.log('✓ form');

await browser.close();
console.log('ALL DONE');
