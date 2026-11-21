// Neuer Kern: Grundlage (Schrift, Farben, Fokus) und Hülle (Kopf, Leiste, Fuß).
// Läuft schmal mit Touch (320 × 568) und breit (1440 × 900).
import assert from 'node:assert/strict';
import {withPage} from './harness.mjs';

const SCHMAL = {width: 320, height: 568, touch: true};
const BREIT = {width: 1440, height: 900};

export async function kernHuelle(ctx) {
  for (const view of [SCHMAL, BREIT]) {
    await withPage(ctx, view, async page => {
      const width = view.width;
      await grundlage(page, width);
      await ruhigerFokus(page, width);
      ctx.report.checks.push(`Kern ${width}: Schrift Nunito, Grundfarbe, ruhiger Fokus auf Überschriften`);
    });
  }
  await withPage(ctx, BREIT, async page => {
    await tastaturFokus(page);
    ctx.report.checks.push('Kern 1440: sichtbarer Tastaturfokus in Petrol');
  });
}

// Die Seite nutzt Nunito, 18 px und den warmen Grundton.
async function grundlage(page, width) {
  const info = await page.evaluate(async () => {
    await document.fonts.ready;
    const style = getComputedStyle(document.body);
    return {
      nunito: [...document.fonts].some(face => face.family.replace(/["']/g, '') === 'Nunito Variable' && face.status === 'loaded'),
      fontSize: style.fontSize,
      background: style.backgroundColor,
      fontFamily: style.fontFamily,
    };
  });
  assert.ok(info.nunito, `grundlage ${width}: Schrift „Nunito Variable“ ist nicht geladen`);
  assert.equal(info.fontSize, '18px', `grundlage ${width}: Fließtext`);
  assert.equal(info.background, 'rgb(250, 248, 243)', `grundlage ${width}: Seitenhintergrund`);
  assert.match(info.fontFamily, /^"?Nunito Variable"?/, `grundlage ${width}: Schriftliste`);
}

// Springt das Programm auf eine Überschrift, zeigt sie keinen Rahmen –
// auch wenn der Link per Tastatur geöffnet wurde (dann gilt sonst :focus-visible).
async function ruhigerFokus(page, width) {
  const link = page.locator('footer').getByRole('link', {name: 'Was ist neu?', exact: true});
  await link.focus();
  await page.keyboard.press('Enter');
  const title = page.locator('#updates-title');
  await title.waitFor();
  await page.waitForFunction(() => document.activeElement?.id === 'updates-title', null, {polling: 100});
  const outline = await title.evaluate(el => getComputedStyle(el).outlineStyle);
  assert.equal(outline, 'none', `ruhigerFokus ${width}: Überschrift zeigt einen Fokusrahmen`);
}

// Wer mit der Tastatur arbeitet, sieht einen deutlichen Rahmen.
async function tastaturFokus(page) {
  const brand = page.getByRole('link', {name: 'WunderKompass – Startseite', exact: true});
  let found = false;
  for (let i = 0; i < 3 && !found; i += 1) {
    await page.keyboard.press('Tab');
    found = await brand.evaluate(el => el === document.activeElement);
  }
  assert.ok(found, 'tastaturFokus: Markenlink nach drei Tab-Drücken nicht erreicht');
  const ring = await brand.evaluate(el => {
    const style = getComputedStyle(el);
    return {style: style.outlineStyle, width: parseFloat(style.outlineWidth), color: style.outlineColor};
  });
  assert.equal(ring.style, 'solid', 'tastaturFokus: Rahmenart');
  assert.ok(ring.width >= 2, `tastaturFokus: Rahmen zu dünn (${ring.width} px)`);
  assert.equal(ring.color, 'rgb(14, 110, 114)', 'tastaturFokus: Rahmenfarbe');
}
