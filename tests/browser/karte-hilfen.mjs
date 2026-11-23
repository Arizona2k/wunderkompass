// Gemeinsame Handgriffe auf der Wissenskarte (app/kern/karte) für ältere Suiten.
// Die Karte hat aufklappbare Bereiche, die zu Beginn zu sind: „Ausprobieren“, „Mehr erfahren“ und
// „Für Erwachsene“. „Ausprobieren“ lädt seine Bausteine erst beim ersten Öffnen (eigenes Skript);
// deshalb wartet ausprobieren() auf sie.
// `scope` ist die Seite oder ein Locator (z. B. die eingebettete Karte einer Lernroute).

import assert from 'node:assert/strict';
import KATALOG from '../../app/world-catalog.json' with {type: 'json'};
import VERBINDUNGEN from '../../app/world-connections.json' with {type: 'json'};

const TITEL = new Map(KATALOG.map(t => [t.id, t.title]));

export const KARTE = '.wissenskarte';

export async function aufklappen(details) {
  await details.waitFor();
  if (!await details.evaluate(element => element.open)) await details.locator(':scope>summary').click();
  await details.locator(':scope>summary').evaluate(summary => {
    if (!summary.parentElement.open) throw Error('Bereich ist nicht aufgeklappt: ' + summary.textContent);
  });
}

export async function ausprobieren(scope) {
  const bereich = scope.locator('details.wissenskarte-ausprobieren').first();
  await aufklappen(bereich);
  await bereich.locator('.wissenskarte-bausteine').waitFor();
  return bereich;
}

// Wartet, bis die Karte `id` steht (an ihrem Titel).
export async function karteDa(scope, id) {
  assert.ok(TITEL.has(id), 'Karte unbekannt: ' + id);
  await scope.locator('#world-topic-title[aria-label="' + TITEL.get(id).replaceAll('"', '\\"') + '"]').waitFor();
}

// Nach einem Wechsel des Hashs: erst warten, bis die Karte `id` steht, dann „Ausprobieren“ öffnen.
// Sonst träfe der Klick womöglich noch die vorige Karte.
export async function ausprobierenAuf(scope, id) {
  await karteDa(scope, id);
  return ausprobieren(scope);
}

export async function mehrErfahren(scope) {
  const bereich = scope.locator('details.wissenskarte-mehr').first();
  await aufklappen(bereich);
  return bereich;
}

export async function fuerErwachsene(scope) {
  const bereich = scope.locator('details.wissenskarte-erwachsene').first();
  await aufklappen(bereich);
  return bereich;
}

// Hat die Karte „Ausprobieren“? Gleiche Bedingung wie app/kern/karte/karten-daten.ts (hatAusprobieren),
// hier am fertigen Bild abgelesen.
export async function hatAusprobieren(scope) {
  return await scope.locator('details.wissenskarte-ausprobieren').count() > 0;
}

// Der Satz „warum“ zu einer erklärten Verbindung: in „Dazu passt“ steht er in der Kachel,
// in „Mehr erfahren“ als Absatz unter dem Knopf (.connection-card).
export function verbindungsSatz(knopf) {
  return knopf.evaluate(element => element.classList.contains('dazu-passt-kachel')
    ? element.querySelector('.dazu-passt-text').textContent
    : element.closest('.connection-card').querySelector('p').textContent);
}

// Die Lesetexte einer Karte an ihren Orten: „Ganz einfach“ in „Kurz erklärt“ (bei Karten mit Häppchen oben in
// „Ausprobieren“), „Selbst beobachten“ und Mehr-Wissen in „Mehr erfahren“, Lernziel und Quellen unter „Für Erwachsene“.
// Hat eine Karte Lernhilfen (t.learning), müssen alle drei da sein.
export async function lesetexte(karte, t) {
  const kurz = karte.locator('.world-short');
  for (const details of await kurz.locator('details').all()) await aufklappen(details);
  if (t.learning) assert.ok(t.learning.starter && t.learning.observe && t.learning.benefit, t.id + ': Lernhilfen vollständig');
  if (t.learning) {
    // Mit Häppchen sind diese die einfache Fassung; „Ganz einfach“ steht dann oben in „Ausprobieren“ (große Prüfung, Aufgabe 13).
    const ort = t.chapters ? await ausprobieren(karte) : kurz;
    await ort.getByText(t.learning.starter, {exact: true}).waitFor();
    if (t.chapters) assert.equal(await kurz.getByText(t.learning.starter, {exact: true}).count(), 0, t.id + ': „Ganz einfach“ steht nicht in „Kurz erklärt“');
  }
  const mehr = await mehrErfahren(karte);
  if (t.learning) await mehr.getByText(t.learning.observe, {exact: true}).waitFor();
  for (const absatz of t.more) await mehr.getByText(absatz, {exact: true}).waitFor();
  const erwachsene = await fuerErwachsene(karte);
  if (t.learning) await erwachsene.getByText('Lernziel: ' + t.learning.benefit, {exact: true}).waitFor();
  for (const quelle of t.sources) assert.equal(await erwachsene.getByRole('link', {name: quelle.label, exact: true}).getAttribute('href'), quelle.url);
  return {kurz, mehr, erwachsene};
}

// Der Knopf zur erklärten Verbindung von Karte `vonId` nach Karte `zuId`. Die erste Verbindung einer Karte
// steht als Kachel in „Dazu passt“ (sichtbar), die übrigen in „Mehr erfahren“; das wird dann aufgeklappt.
// Beide Orte tragen denselben Schlüssel data-route-focus="world-connection-<von>-<zu>".
export async function verbindungsKnopf(scope, vonId, zuId) {
  await karteDa(scope, vonId);
  const knopf = scope.locator('[data-route-focus="world-connection-' + vonId + '-' + zuId + '"]');
  await knopf.waitFor({state: 'attached'});
  assert.equal(await knopf.count(), 1, 'genau ein Knopf für ' + vonId + ' > ' + zuId);
  if (!await knopf.evaluate(element => element.classList.contains('dazu-passt-kachel'))) await mehrErfahren(scope);
  return knopf;
}

// Erklärte Verbindungen (app/world-connections.json) als „von>zu“; nur sie haben auf der Karte einen Knopf.
export const ERKLAERTE_PAARE = new Set(VERBINDUNGEN.connections.flatMap(v => [v.fromId + '>' + v.toId, v.toId + '>' + v.fromId]));
