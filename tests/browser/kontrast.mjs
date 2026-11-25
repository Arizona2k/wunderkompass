// Schriftkontrast auf ganzen Seiten (axe, nur die Regel color-contrast) in den Hauptansichten, 320 und 1280 px.
// Seit 25.11.2026 im CI-Satz: Das neue, dunklere Papier schob zehn alte Grautöne unter 4,5:1, und gemeldet haben
// es nur zwei Voll-Suiten, deren Ausschnitt zufällig dort lag (docs/entwurf/2026-11-25-spaeter-fund-kontrast.md).
// Geprüft wird jede Ansicht im Ausgangszustand mit allen Aufklappern offen. Zustände nach einer Antwort prüfen
// wissenskarte und spiel-fokus, den Fokusrahmen pass-atlas und kern-huelle. Nur Chromium: axe rechnet mit den
// berechneten Stilen, nicht mit dem gezeichneten Bild, das Ergebnis hängt also nicht an der Engine.
import assert from 'node:assert/strict';
import {ladeanfragen, ready} from './harness.mjs';
import {prepareAxe} from './axe-loader.mjs';

// klick: erst die Übersicht öffnen, dann das erste Element dieser Art antippen.
const ANSICHTEN = [
  {name: 'Start', hash: ''},
  {name: 'Welten', hash: '#world'},
  {name: 'Weltreise', hash: '#world', klick: '.world-trip'},
  {name: 'Karte mit Foto', hash: '#world/topic/animal-whale-shark'},
  {name: 'Karte Geschichte', hash: '#world/topic/history-pyramids'},
  {name: 'Spiele', hash: '#games'},
  {name: 'Spiel', hash: '#games', klick: '.game-tile'},
  {name: 'Labore', hash: '#labs'},
  {name: 'Labor', hash: '#labs/quake'},
  {name: 'Reisen', hash: '#journeys'},
  {name: 'Reise', hash: '#journeys/water'},
  {name: 'Wissensbuch', hash: '#book'},
  {name: 'Wort im Buch', hash: '#book/words/Meter'},
  {name: 'Globus', hash: '#globe'},
];
const BREITEN = [[320, 720, true], [1280, 900, false]];

async function pruefeAnsicht(ctx, context, view, width) {
  const page = await context.newPage();
  ctx.monitor(page);
  try {
    await page.goto(ctx.base + view.hash);
    await ready(page);
    await ladeanfragen(page)();
    if (view.klick) {
      const ziel = page.locator(view.klick).first();
      await ziel.waitFor();
      const fertig = ladeanfragen(page);
      await ziel.click();
      await fertig();
    }
    await page.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = true; }));
    await ladeanfragen(page)();
    await prepareAxe(page);
    const {geprueft, fehler} = await page.evaluate(async () => {
      const result = await window.axe.run(document, {runOnly: {type: 'rule', values: ['color-contrast']}});
      const knoten = list => list.reduce((n, rule) => n + rule.nodes.length, 0);
      return {
        geprueft: knoten(result.passes) + knoten(result.violations),
        fehler: result.violations.flatMap(rule => rule.nodes.map(node => {
          const data = node.any[0]?.data ?? {};
          const text = (document.querySelector(node.target[0])?.textContent ?? '').trim().slice(0, 40);
          return `${data.fgColor} auf ${data.bgColor} (${data.contrastRatio} < ${data.expectedContrastRatio}) bei ${node.target.join(' ')}: „${text}“`;
        })),
      };
    });
    // Ohne geprüfte Knoten wäre ein grüner Lauf leer (z. B. Seite nicht geladen).
    assert.ok(geprueft > 20, `${view.name} ${width} px: axe hat nur ${geprueft} Textstellen geprüft`);
    return {geprueft, fehler: fehler.map(f => `${view.name} ${width} px: ${f}`)};
  } finally {
    await page.close();
  }
}

// Sammelt die Funde aller Ansichten und meldet sie am Ende zusammen: So steht jede Farbe, die zu blass ist, in einem Lauf.
export async function kontrast(ctx) {
  const alle = [];
  for (const [width, height, touch] of BREITEN) {
    const context = await ctx.browser.newContext({viewport: {width, height}, reducedMotion: 'reduce', ...(touch ? {hasTouch: true, isMobile: true} : {})});
    try {
      let summe = 0;
      for (const view of ANSICHTEN) {
        const {geprueft, fehler} = await pruefeAnsicht(ctx, context, view, width);
        summe += geprueft;
        alle.push(...fehler);
      }
      ctx.report.checks.push(`Kontrast ${width} px: ${ANSICHTEN.length} Ansichten, ${summe} Textstellen geprüft`);
    } finally {
      await context.close();
    }
  }
  assert.deepEqual(alle, [], 'Schrift mit zu wenig Kontrast');
}
