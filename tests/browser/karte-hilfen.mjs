// Gemeinsame Handgriffe auf der Wissenskarte (app/kern/karte) für alle Suiten.
// Die Karte hat aufklappbare Bereiche, die zu Beginn zu sind: „Ausprobieren“, „Mehr erfahren“ und
// „Für Erwachsene“. „Ausprobieren“ lädt seine Bausteine erst beim ersten Öffnen (eigenes Skript);
// deshalb wartet ausprobieren() auf sie.
// `scope` ist die Seite oder ein Locator (z. B. die eingebettete Karte einer Lernroute).
//
// Kartenfragen und „Ganz einfach“ gibt es nur über diese Datei (Wächter in tests/browser-suites.test.mjs).
// Grund: Welche Frage „Rate mal!“ zeigt und wo „Ganz einfach“ steht, entscheidet die App, und das ändert sich
// (Zusatzfragen nach einer richtigen Antwort, später die Stufen). In Teil B beantworteten rund zehn Suiten die
// Hauptfrage mit eigenem Code und fielen nacheinander in langen Läufen auf. Hier wird nur an einer Stelle angepasst.

import assert from 'node:assert/strict';
import KATALOG from '../../app/world-catalog.json' with {type: 'json'};
import VERBINDUNGEN from '../../app/world-connections.json' with {type: 'json'};
import HINWEISBANK from '../../app/challenge-hints.json' with {type: 'json'};
// karten-daten.ts lädt JSON ohne Importattribut; das ergänzen die Lade-Hooks.
await import('../../scripts/test-runtime.mjs');
const {kartenFragen} = await import('../../app/kern/karte/karten-daten.ts');

const TITEL = new Map(KATALOG.map(t => [t.id, t.title]));

export const KARTE = '.wissenskarte';

// Mit touch tippt der Test wie ein Finger (die Seite braucht dafür einen Kontext mit hasTouch).
export async function aufklappen(details, {touch = false} = {}) {
  await details.waitFor();
  const summary = details.locator(':scope>summary');
  if (!await details.evaluate(element => element.open)) await (touch ? summary.tap() : summary.click());
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
  if (t.learning) await (await ganzEinfach(karte, t)).waitFor();
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

// „Ganz einfach“ (learning.starter) an seinem Ort, aufgeklappt und sichtbar. Bei Karten mit Häppchen sind die Häppchen
// die einfache Fassung; der Satz steht dann oben in „Ausprobieren“ und nicht in „Kurz erklärt“ (große Prüfung, Aufgabe 13).
// Ohne Häppchen steht er in „Kurz erklärt“ (dort ggf. in einem aufklappbaren Bereich).
// Immer geprüft: Der Satz steht genau einmal auf der Karte; in „Ausprobieren“ ist er erst nach dem Öffnen zu sehen,
// dann aber ohne auf die Bausteine zu warten (`sofort`: binnen 2 Sekunden).
export async function ganzEinfach(karte, t, {sofort = false, touch = false} = {}) {
  assert.ok(t.learning?.starter, t.id + ': die Karte hat kein „Ganz einfach“');
  const kurz = karte.locator('.world-short');
  const imKurz = kurz.getByText(t.learning.starter, {exact: true});
  const genauEinmal = async () => assert.equal(await karte.getByText(t.learning.starter, {exact: true}).count(), 1, t.id + ': „Ganz einfach“ steht genau einmal auf der Karte');
  if (!t.chapters) {
    for (const details of await kurz.locator('details').all()) await aufklappen(details, {touch});
    await imKurz.waitFor({state: 'visible'});
    await genauEinmal();
    return imKurz;
  }
  const bereich = karte.locator('details.wissenskarte-ausprobieren').first();
  const satz = bereich.locator('.wissenskarte-ausprobieren-einstieg').getByText(t.learning.starter, {exact: true});
  await bereich.waitFor();
  if (!await bereich.evaluate(element => element.open)) assert.equal(await satz.isVisible(), false, t.id + ': „Ganz einfach“ ist erst nach dem Öffnen von „Ausprobieren“ zu sehen');
  await aufklappen(bereich, {touch});
  await satz.waitFor({state: 'visible', ...(sofort ? {timeout: 2000} : {})});
  assert.equal(await imKurz.count(), 0, t.id + ': „Ganz einfach“ steht nicht in „Kurz erklärt“');
  await genauEinmal();
  return satz;
}

// ---- „Rate mal!“ ----
// Tests sagen nicht selbst voraus, welche Frage kommt; sie lesen sie an der Karte ab (angezeigteFrage).
// Wer eine bestimmte Frage prüfen will (z. B. die Hauptfrage im frischen Pass), nimmt hauptfrage(t) und
// prüft mit angezeigteFrage, dass die Karte genau sie zeigt.

// Für getByText in `has`: Der innere Locator muss von der Seite kommen, nicht vom äußeren Locator.
const seite = scope => (typeof scope.page === 'function' ? scope.page() : scope);

// Alle Fragen einer Karte wie in der App (kartenFragen): Hauptfrage zuerst, dann die Zusatzfragen.
// Jede hat id, reviewId, answerKey (Schlüssel im Spielstand), question {prompt, answers, correct, why}, hints
// und (nur die Hauptfrage, wenn vorhanden) wrongReasons.
export const fragenDerKarte = t => kartenFragen(t, HINWEISBANK);
export const hauptfrage = t => fragenDerKarte(t)[0];
export const zusatzfragen = t => fragenDerKarte(t).slice(1);
export const richtigeAntwort = frage => frage.question.answers[frage.question.correct];
export const falscheAntworten = frage => frage.question.answers.filter((_, i) => i !== frage.question.correct);

// Satz nach einer falschen Antwort, wenn die Frage keinen eigenen „warum nicht“-Satz hat (rate-mal.tsx).
export const NICHT_PASSEND = 'Lies unten unter „Kurz erklärt“ nach.';
export const rateMal = scope => scope.locator('section.rate-mal');
export const antwortKnopf = (scope, antwort) => rateMal(scope).locator('.quiz-answer').filter({has: seite(scope).getByText(antwort, {exact: true})});

// Die Frage, die „Rate mal!“ gerade zeigt (aria-labelledby="rate-mal-<Fragen-ID>"), als Eintrag aus fragenDerKarte.
// Vorher die Karte abwarten (karteDa), sonst steht womöglich noch die vorige da.
export async function angezeigteFrage(scope, t) {
  const bereich = rateMal(scope);
  await bereich.waitFor();
  const id = (await bereich.getAttribute('aria-labelledby'))?.replace(/^rate-mal-/, '');
  const frage = fragenDerKarte(t).find(f => f.id === id);
  assert.ok(frage, t.id + ': „Rate mal!“ zeigt keine Frage dieser Karte (' + id + ')');
  await bereich.locator('.rate-mal-frage').getByText(frage.question.prompt, {exact: true}).waitFor();
  return frage;
}

// Prüft, dass die Karte genau diese Frage zeigt (z. B. die Hauptfrage im frischen Pass), und gibt sie zurück.
export async function zeigtFrage(scope, t, erwartet) {
  const frage = await angezeigteFrage(scope, t);
  assert.equal(frage.id, erwartet.id, t.id + ': „Rate mal!“ zeigt ' + frage.id + ' statt ' + erwartet.id);
  return frage;
}

// Der Knopf mit der richtigen Antwort auf die angezeigte Frage. Für Suiten, die selbst klicken, tippen oder Enter drücken.
export async function richtigerKnopf(scope, t) {
  const frage = await angezeigteFrage(scope, t);
  return {frage, knopf: antwortKnopf(scope, richtigeAntwort(frage))};
}

// Die angezeigte Frage richtig beantworten; wartet auf die Erklärung und gibt die Frage zurück.
export async function antworteRichtig(scope, t, {tippen = false} = {}) {
  const {frage, knopf} = await richtigerKnopf(scope, t);
  await (tippen ? knopf.tap() : knopf.click());
  await rateMal(scope).getByText(frage.question.why, {exact: true}).waitFor();
  return frage;
}

// Die angezeigte Frage so durchspielen, wie ein Kind es kann: Hinweis öffnen, jede falsche Antwort tippen
// (je ihr Satz „warum nicht“ oder „Noch nicht ganz …“, nie die Lösung), dann die richtige mit Erklärung.
// Ist sie schon richtig beantwortet: beantwortet 'lassen' prüft nur die Erklärung, 'neu' tippt zuerst „Noch einmal raten“.
export async function frageDurchspielen(scope, t, {beantwortet = 'lassen', hinweis = true} = {}) {
  const frage = await angezeigteFrage(scope, t);
  const bereich = rateMal(scope);
  const q = frage.question;
  const richtig = antwortKnopf(scope, richtigeAntwort(frage));
  if (await richtig.isDisabled()) {
    if (beantwortet === 'lassen') {
      await bereich.getByText(q.why, {exact: true}).waitFor();
      return frage;
    }
    await bereich.getByRole('button', {name: 'Noch einmal raten', exact: true}).click();
  }
  if (hinweis) {
    const hilfe = bereich.locator('.world-game-hint');
    if (!await hilfe.evaluate(e => e.open)) await hilfe.locator(':scope > summary').click();
    await hilfe.getByText(frage.hints[0], {exact: true}).waitFor();
  }
  for (const [i, antwort] of q.answers.entries()) {
    if (i === q.correct) continue;
    await antwortKnopf(scope, antwort).click();
    await bereich.getByText('Noch nicht ganz. Versuch es noch einmal!', {exact: true}).waitFor();
    await bereich.getByText(frage.wrongReasons?.[i] ?? NICHT_PASSEND, {exact: true}).waitFor();
    assert.equal(await bereich.getByText(q.why, {exact: true}).count(), 0, frage.id + ': eine falsche Antwort zeigt keine Lösung');
  }
  await richtig.click();
  await bereich.getByText(q.why, {exact: true}).waitFor();
  assert.equal(await richtig.isDisabled(), true, frage.id + ': nach der richtigen Antwort sind die Knöpfe gesperrt');
  return frage;
}
