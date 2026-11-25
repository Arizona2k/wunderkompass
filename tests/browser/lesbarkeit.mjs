// Lesbar und bedienbar für Kinder (Entwurf Phase 1, Gestaltung): Tippflächen mindestens 48 × 48 px,
// kleinster Text 14 px, Kontrast AA, Aufklapper sind schon zugeklappt als aufklappbar erkennbar,
// und „Größere Schrift“ im Pass macht Text größer, nie kleiner.
// Gemessen wird im Browser. `bereich` ist ein Locator, z. B. die Wissenskarte oder ein Reisekapitel.
import assert from 'node:assert/strict';

// Das Zeichen einer summary: das eingebaute Dreieck (display:list-item mit Markierung) oder ein eigenes
// Zeichen als ::after (mindestens 8 × 8 px). Bei einem eigenen Zeichen gehört seine Drehung dazu: Daran sieht
// man, ob der Bereich offen ist. Leer heißt: kein Zeichen, die summary sieht aus wie eine Überschrift.
export const aufklappZeichen = summary => summary.evaluate(element => {
  const stil = getComputedStyle(element);
  if (stil.display === 'list-item' && stil.listStyleType !== 'none') return 'eingebaut';
  const nach = getComputedStyle(element, '::after');
  const sichtbar = nach.content !== 'none' && nach.content !== 'normal' && nach.display !== 'none' && nach.visibility !== 'hidden';
  return sichtbar && parseFloat(nach.width) >= 8 && parseFloat(nach.height) >= 8 ? 'eigen ' + nach.transform : '';
});

// Jede sichtbare summary im Bereich hat ein Zeichen zum Aufklappen.
export async function aufklapperErkennbar(bereich) {
  const ohne = [];
  for (const summary of await bereich.locator('summary:visible').all()) {
    if (!await aufklappZeichen(summary)) ohne.push((await summary.textContent()).trim());
  }
  assert.deepEqual(ohne, [], 'Aufklapper ohne Zeichen zum Aufklappen');
}

// Öffnet den Aufklapper; ein eigenes Zeichen sieht danach anders aus als zugeklappt.
export async function zeichenZeigtOffen(details) {
  const summary = details.locator(':scope > summary');
  const zu = await aufklappZeichen(summary);
  await summary.click();
  await details.evaluate(element => { if (!element.open) throw Error('nicht aufgeklappt: ' + element.querySelector('summary').textContent); });
  const auf = await aufklappZeichen(summary);
  if (zu.startsWith('eigen')) assert.notEqual(auf, zu, 'Das Zeichen zeigt, dass „' + (await summary.textContent()).trim() + '“ offen ist');
}

// Sichtbare Knöpfe und Aufklapper sind mindestens 48 × 48 px groß (Inhalt geschlossener Aufklapper zählt nicht).
export async function tippflaechen48(bereich, auswahl = 'button, summary') {
  const zuKlein = await bereich.locator(auswahl).evaluateAll(elemente => elemente.flatMap(element => {
    const rahmen = element.getBoundingClientRect();
    if (!rahmen.width && !rahmen.height) return [];
    if (element.checkVisibility && !element.checkVisibility({visibilityProperty: true, opacityProperty: true})) return [];
    if (rahmen.width >= 47.5 && rahmen.height >= 47.5) return [];
    return [(element.textContent.trim() || element.getAttribute('aria-label') || element.tagName) + ' ' + Math.round(rahmen.width) + '×' + Math.round(rahmen.height)];
  }));
  assert.deepEqual(zuKlein, [], 'Tippflächen unter 48 × 48 px');
}

// Kein sichtbarer Text ist kleiner als 14 px. Zeichnungen (SVG) skalieren und zählen hier nicht.
export async function schrift14(bereich) {
  const zuKlein = await bereich.evaluate(wurzel => {
    const funde = [];
    const gang = document.createTreeWalker(wurzel, NodeFilter.SHOW_TEXT);
    while (gang.nextNode()) {
      const element = gang.currentNode.parentElement;
      if (!gang.currentNode.textContent.trim() || element.closest('svg')) continue;
      const zu = element.closest('details:not([open])');
      if (zu && !zu.querySelector(':scope > summary')?.contains(element)) continue;
      const rahmen = element.getBoundingClientRect();
      if (rahmen.width <= 2 || rahmen.height <= 2) continue;
      if (element.checkVisibility && !element.checkVisibility({visibilityProperty: true, opacityProperty: true})) continue;
      const groesse = parseFloat(getComputedStyle(element).fontSize);
      if (groesse < 13.95) funde.push(gang.currentNode.textContent.trim().slice(0, 40) + ' ' + groesse + 'px');
    }
    return funde;
  });
  assert.deepEqual(zuKlein, [], 'Text unter 14 px');
}

// Kontrast von Schrift und sichtbarem Hintergrund (WCAG 2.1). Ist der Hintergrund des Elements ganz oder teilweise
// durchsichtig (gesperrte Antworten im Design „Kompass“), zählt, was darunter liegt: Die Hintergründe der Vorfahren
// werden bis zum ersten deckenden übereinandergelegt. Vorher galt „durchsichtig“ als Schwarz (3,2:1 statt rund 6:1).
export const kontrast = element => element.evaluate(knoten => {
  const teile = farbe => { const [r, g, b, a = 1] = farbe.match(/[\d.]+/g).map(Number); return {r, g, b, a}; };
  const schichten = [];
  for (let k = knoten; k; k = k.parentElement) {
    const farbe = teile(getComputedStyle(k).backgroundColor);
    if (farbe.a > 0) schichten.push(farbe);
    if (farbe.a >= 1) break;
  }
  let grund = {r: 255, g: 255, b: 255};
  for (const s of schichten.reverse()) grund = {r: s.r * s.a + grund.r * (1 - s.a), g: s.g * s.a + grund.g * (1 - s.a), b: s.b * s.a + grund.b * (1 - s.a)};
  const leuchtdichte = ({r, g, b}) => {
    const [lr, lg, lb] = [r, g, b].map(wert => {
      const anteil = wert / 255;
      return anteil <= 0.03928 ? anteil / 12.92 : ((anteil + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
  };
  const [hell, dunkel] = [leuchtdichte(teile(getComputedStyle(knoten).color)), leuchtdichte(grund)].sort((a, b) => b - a);
  return (hell + 0.05) / (dunkel + 0.05);
});

// Mit „Größere Schrift“ (Klasse large-reading an .earth-app, wie die Pass-Einstellung) ist jede genannte Stelle
// größer als ohne. Danach gilt wieder die vorherige Einstellung.
export async function grosseSchriftWaechst(page, auswahlen) {
  const messen = () => page.evaluate(liste => liste.map(auswahl => {
    const element = document.querySelector(auswahl);
    return element ? parseFloat(getComputedStyle(element).fontSize) : null;
  }), auswahlen);
  const app = page.locator('.earth-app');
  const vorher = await app.evaluate(element => element.classList.contains('large-reading'));
  try {
    await app.evaluate(element => element.classList.remove('large-reading'));
    const normal = await messen();
    await app.evaluate(element => element.classList.add('large-reading'));
    const gross = await messen();
    auswahlen.forEach((auswahl, index) => {
      assert.ok(normal[index] !== null, 'nicht gefunden: ' + auswahl);
      assert.ok(gross[index] > normal[index], `„Größere Schrift“ macht ${auswahl} größer (${normal[index]} → ${gross[index]} px)`);
    });
  } finally {
    await app.evaluate((element, an) => element.classList.toggle('large-reading', an), vorher);
  }
}

// Was hervorstehen soll (z. B. die Frage), ist mit und ohne „Größere Schrift“ größer als der Text daneben.
export async function bleibtGroesser(page, paare) {
  const messen = () => page.evaluate(liste => liste.map(([gross, klein]) => [gross, klein].map(auswahl => {
    const element = document.querySelector(auswahl);
    return element ? parseFloat(getComputedStyle(element).fontSize) : null;
  })), paare);
  const app = page.locator('.earth-app');
  const vorher = await app.evaluate(element => element.classList.contains('large-reading'));
  try {
    for (const an of [false, true]) {
      await app.evaluate((element, schalter) => element.classList.toggle('large-reading', schalter), an);
      (await messen()).forEach(([gross, klein], index) => {
        assert.ok(gross !== null && klein !== null, 'nicht gefunden: ' + paare[index].join(' / '));
        assert.ok(gross > klein, `${paare[index][0]} ist größer als ${paare[index][1]}${an ? ' mit „Größerer Schrift“' : ''} (${gross} / ${klein} px)`);
      });
    }
  } finally {
    await app.evaluate((element, an) => element.classList.toggle('large-reading', an), vorher);
  }
}
