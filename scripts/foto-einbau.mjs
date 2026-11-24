// Bilder-Strang (BACKLOG Phase 1, Punkt 26): baut freigegebene Bildvorschläge der `bild-recherche` ein.
// Ablauf und Vorschlagsformat: docs/entwurf/2026-11-24-bilder-strang-plan.md. Prüfregeln: scripts/foto-regeln.mjs.
//
// Aufruf:
//   node scripts/foto-einbau.mjs <vorschlaege.json> --nur-pruefen      Lizenz, Urheber und Breite bei Commons prüfen
//   node scripts/foto-einbau.mjs <vorschlaege.json> --vorschau <ordner> zusätzlich Kartenköpfe als Bilder zum Ansehen
//   node scripts/foto-einbau.mjs <vorschlaege.json>                    einbauen
//
// Einbauen heißt: Bild laden, als WebP in bis zu drei Breiten speichern (nie hochskaliert, beschnitten nur mit
// Feld zuschnitt), Eintrag in app/world-photos.json, Feld image der Karte in app/world-catalog.json, Kennwort in
// app/kern/karte/foto-kennwoerter.json. Danach erzeugt scripts/export-content.mjs die abgeleiteten Listen
// (Foto-Index, Bildnachweis-Liste, Startseiten-Index, Exporte).
// Neue Foto-IDs kommen von selbst in tests/fixtures/stable-ids.json (Familie photos, wächst nur). Ein Foto, das
// nach dem Einbau auf keiner Karte und keinem Naturort mehr steht, kommt in tests/fixtures/ersetzte-fotos.json:
// Sein Nachweis bleibt, damit die ID nie wiederverwendet wird.
// Sicherheit: Alle Bilddateien entstehen erst im Arbeitsordner und kommen nur nach public/, wenn jeder Schritt
// eines Vorschlags geklappt hat. Alte Dateien werden erst nach einem erfolgreichen Export gelöscht.
// Geladene Originale bleiben in .qa-output/foto-cache/, damit ein zweiter Lauf Commons nicht noch einmal fragt.

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync, spawnSync} from 'node:child_process';
import {pruefeVorschlag, vergleicheCommons, zielBreiten, LABEL_IM_BESTAND, ORDNER_JE_WELT} from './foto-regeln.mjs';
// Dieselbe Hilfe wie für die Tests: App-Dateien laden JSON ohne Import-Attribut. So kommt das Kennwort aus
// derselben Regel wie auf der Karte (fotoKennwort in app/kern/karte/karten-daten.ts).
import './test-runtime.mjs';
const {fotoKennwort} = await import('../app/kern/karte/karten-daten.ts');

const FOTOS_DATEI = 'app/world-photos.json';
const KATALOG_DATEI = 'app/world-catalog.json';
const KENNWORT_DATEI = 'app/kern/karte/foto-kennwoerter.json';
const STABIL_DATEI = 'tests/fixtures/stable-ids.json';
const ERSETZT_DATEI = 'tests/fixtures/ersetzte-fotos.json';
const NATUR_FOTOS_DATEI = 'app/nature-photo-candidates.json';
const NATUR_ORTE_DATEI = 'app/nature-new-places.json';
const CACHE = '.qa-output/foto-cache';
// Eine der festen Vorschaubreiten von Commons; reicht für 960 px.
const LADEBREITE = 1280;
const QUALITAET = '78';
const PAUSE_MS = 1500;
// Wikimedia verlangt einen erkennbaren Client; keine persönlichen Daten.
const KENNUNG = 'WunderKompass-Bildeinbau/1.0 (https://wunderkompass.vercel.app)';
// So groß ist der Kartenkopf (app/kern/karte/karte.css: 260 px hoch) auf dem Handy und am Rechner.
const KOPF_FORMATE = [{name: 'handy', breite: 320, hoehe: 260}, {name: 'rechner', breite: 700, hoehe: 260}];

const argumente = process.argv.slice(2);
const nurPruefen = argumente.includes('--nur-pruefen');
const vorschauOrdner = argumente.includes('--vorschau') ? argumente[argumente.indexOf('--vorschau') + 1] : null;
const eingabe = argumente.find((a, i) => !a.startsWith('--') && argumente[i - 1] !== '--vorschau');
if (!eingabe || (argumente.includes('--vorschau') && !vorschauOrdner)) {
  beenden('Aufruf: node scripts/foto-einbau.mjs <vorschlaege.json> [--nur-pruefen] [--vorschau <ordner>]');
}
const einbauen = !nurPruefen && !vorschauOrdner;

const fotos = leseJson(FOTOS_DATEI);
const katalog = leseJson(KATALOG_DATEI);
const kennwoerter = leseJson(KENNWORT_DATEI);
const alleVorschlaege = JSON.parse(fs.readFileSync(eingabe, 'utf8'));
// Ein Eintrag ohne foto_id (z. B. Tippfehler „fotoid“) wird gemeldet, nicht still übersprungen.
const ohneId = alleVorschlaege.filter(v => !v.foto_id);
const vorschlaege = alleVorschlaege.filter(v => v.foto_id).map(v => ergaenzeNeuExport(v));
const arbeitsordner = fs.mkdtempSync(path.join(os.tmpdir(), 'foto-einbau-'));
fs.mkdirSync(CACHE, {recursive: true});
if (vorschauOrdner) fs.mkdirSync(vorschauOrdner, {recursive: true});

const fertig = [];
const abgelehnt = ohneId.map(v => `${v.karte ?? '(ohne karte)'}: Eintrag ohne foto_id übersprungen`);
const alteDateien = [];
// Fertig gebaute Bilddateien: liegen im Arbeitsordner, kommen beim Einbauen nach public/.
const neueDateien = [];
// Foto-IDs, die eine Karte vor dem Einbau zeigte (Kandidaten für ersetzte-fotos.json).
const vorherGezeigt = new Set();

// 1. Regeln ohne Netz; eine Foto-ID darf auch innerhalb der Liste nur einmal vorkommen.
const geprueft = [];
const neueIds = new Set();
for (const vorschlag of vorschlaege) {
  try {
    const karte = pruefeVorschlag(vorschlag, {fotos, katalog});
    if (neueIds.has(vorschlag.foto_id)) throw new Error('foto_id steht doppelt in der Liste');
    neueIds.add(vorschlag.foto_id);
    geprueft.push({vorschlag, karte});
  } catch (fehler) {
    abgelehnt.push(`${vorschlag.karte} / ${vorschlag.foto_id}: ${fehler.message}`);
  }
}

// 2. Was Commons heute sagt, in einer Anfrage je 50 Dateien.
const commonsJeDatei = await commonsDaten(geprueft.map(g => g.vorschlag.commons_datei));
const tafel = [];
for (const {vorschlag, karte} of geprueft) {
  try {
    const commons = commonsJeDatei.get(vorschlag.commons_datei);
    if (!commons) throw new Error(`Datei bei Commons nicht gefunden: ${vorschlag.commons_datei}`);
    const breite = vorschlag.zuschnitt ? Math.floor(commons.breite * vorschlag.zuschnitt.breite) : commons.breite;
    vergleicheCommons(vorschlag, {...commons, breite});
    if (nurPruefen) {
      fertig.push(`${karte.id}: ${vorschlag.foto_id} (Lizenz ${commons.lizenz}, ${commons.breite} px, Urheber passt)`);
      continue;
    }
    const bild = await bildBauen(vorschlag, karte, commons);
    if (vorschauOrdner) {
      tafel.push(...kopfVorschau(vorschlag, bild));
      fertig.push(`${karte.id}: ${vorschlag.foto_id} (Vorschau ${bild.breiten.join('/')} px)`);
      continue;
    }
    const vorher = karte.image;
    const alt = fotos[vorschlag.foto_id];
    // Bei einem Neu-Export: altes src und alte Größen, soweit die neuen sie nicht überschreiben.
    const alteSrcs = alt ? [...new Set([alt.src, ...(alt.variants ?? []).map(v => v.src)].filter(Boolean))] : [];
    fotos[vorschlag.foto_id] = eintrag(vorschlag, bild);
    karte.image = vorschlag.foto_id;
    const kennwort = fotoKennwort(fotos[vorschlag.foto_id].label);
    if (kennwort) kennwoerter[vorschlag.foto_id] = kennwort;
    else delete kennwoerter[vorschlag.foto_id];
    for (const src of alteSrcs) if (!bild.varianten.some(v => v.src === src)) alteDateien.push(src);
    if (vorher && vorher !== vorschlag.foto_id) vorherGezeigt.add(vorher);
    neueDateien.push(...bild.ziele);
    fertig.push(`${karte.id}: ${vorschlag.foto_id}${vorschlag.neu_export ? ' (neu gebaut)' : vorher ? ` (ersetzt ${vorher})` : ''}`);
  } catch (fehler) {
    abgelehnt.push(`${vorschlag.karte} / ${vorschlag.foto_id}: ${fehler.message}`);
  }
}

if (einbauen && fertig.length) {
  // Erst jetzt kommen die Bilder nach public/ (kopieren statt umbenennen: der Arbeitsordner kann auf einem
  // anderen Laufwerk liegen).
  for (const {datei, ziel} of neueDateien) {
    fs.mkdirSync(path.dirname(ziel), {recursive: true});
    fs.copyFileSync(datei, ziel, fs.constants.COPYFILE_EXCL);
  }
  schreibeJson(FOTOS_DATEI, fotos);
  schreibeJson(KATALOG_DATEI, katalog);
  schreibeJson(KENNWORT_DATEI, sortiert(kennwoerter));
  schreibeStabileFotoIds(Object.keys(fotos));
  schreibeErsetzteFotos([...vorherGezeigt].filter(id => Object.hasOwn(fotos, id) && !wirdGezeigt(id)));
  const export_ = spawnSync(process.execPath, ['scripts/export-content.mjs'], {stdio: 'inherit'});
  if (export_.status === 0) {
    for (const src of new Set(alteDateien)) entferneWennUnbenutzt(src);
  } else {
    abgelehnt.push('scripts/export-content.mjs ist fehlgeschlagen; alte Bilddateien sind noch da. Rückweg: '
      + '„git checkout -- app public exports tests/fixtures“, dann neue Bilddateien mit „git status“ finden und löschen.');
  }
}
if (vorschauOrdner && tafel.length) {
  execFileSync('montage', [...tafel, '-tile', '2x', '-geometry', '+6+6', '-background', '#ffffff', path.join(vorschauOrdner, 'tafel.jpg')]);
  console.log(`Vorschau: ${path.join(vorschauOrdner, 'tafel.jpg')} und Einzelbilder in ${vorschauOrdner}`);
}
fs.rmSync(arbeitsordner, {recursive: true, force: true});

console.log(`\n${nurPruefen ? 'Geprüft' : vorschauOrdner ? 'Vorschau' : 'Eingebaut'}: ${fertig.length}`);
for (const zeile of fertig) console.log('  ✔ ' + zeile);
console.log(`Nicht eingebaut: ${abgelehnt.length}`);
for (const zeile of abgelehnt) console.log('  ✖ ' + zeile);
if (abgelehnt.length) process.exitCode = 1;

// ---------- Vorschläge ----------

// Ein Neu-Export braucht nur foto_id, karte und neu_export: alles Übrige kommt aus dem vorhandenen Eintrag.
function ergaenzeNeuExport(vorschlag) {
  const alt = vorschlag.neu_export ? fotos[vorschlag.foto_id] : null;
  if (!alt) return vorschlag;
  const felder = ['author', 'license', 'license_url', 'source_page_url', 'alt_de', 'caption', 'fit', 'focus', 'label'];
  const vomBestand = Object.fromEntries(felder.filter(f => alt[f] != null).map(f => [f, alt[f]]));
  const seite = decodeURIComponent(new URL(alt.source_page_url).pathname.replace(/^\/wiki\//, ''));
  return {commons_datei: seite, ...vomBestand, ...vorschlag};
}

function eintrag(vorschlag, bild) {
  const groesste = bild.varianten.at(-1);
  const label = vorschlag.label ? LABEL_IM_BESTAND[vorschlag.label] : undefined;
  const ganz = {
    id: vorschlag.foto_id,
    src: groesste.src,
    author: vorschlag.author,
    license: vorschlag.license,
    license_url: vorschlag.license_url,
    source_page_url: vorschlag.source_page_url,
    alt_de: vorschlag.alt_de,
    caption: vorschlag.caption,
    width: groesste.width,
    height: bild.hoehe,
    transformations_de: bearbeitung(vorschlag, bild.breiten),
    fit: vorschlag.fit,
    focus: vorschlag.focus,
    label,
    variants: bild.varianten,
  };
  return Object.fromEntries(Object.entries(ganz).filter(([, wert]) => wert != null));
}

function bearbeitung(vorschlag, breiten) {
  const zahlen = breiten.length === 3 ? `${breiten[0]}, ${breiten[1]} und ${breiten[2]}` : `${breiten[0]} und ${breiten[1]}`;
  const ausschnitt = vorschlag.zuschnitt ? `Ausschnitt aus dem Original (${vorschlag.zuschnitt.grund}), dann ` : '';
  const rest = vorschlag.zuschnitt ? 'kein weiterer Beschnitt' : 'Bildinhalt nicht beschnitten';
  return `${ausschnitt}${ausschnitt ? 'p' : 'P'}roportional auf ${zahlen} Pixel Breite verkleinert und als WebP gespeichert; ${rest}, keine KI-Bildänderung.`;
}

// ---------- Commons ----------

async function commonsDaten(dateien) {
  const ergebnis = new Map();
  const einzeln = [...new Set(dateien)];
  for (let start = 0; start < einzeln.length; start += 50) {
    const gruppe = einzeln.slice(start, start + 50);
    const adresse = new URL('https://commons.wikimedia.org/w/api.php');
    adresse.search = new URLSearchParams({
      action: 'query', format: 'json', formatversion: '2', titles: gruppe.join('|'), prop: 'imageinfo',
      iiprop: 'url|size|extmetadata', iiurlwidth: String(LADEBREITE),
      iiextmetadatafilter: 'LicenseShortName|LicenseUrl|Artist|Credit',
    }).toString();
    const antwort = await holen(adresse, 'json');
    const umbenannt = new Map((antwort.query?.normalized ?? []).map(n => [n.from, n.to]));
    const seiten = new Map((antwort.query?.pages ?? []).map(s => [s.title, s]));
    for (const datei of gruppe) {
      const info = seiten.get(umbenannt.get(datei) ?? datei)?.imageinfo?.[0];
      if (!info) continue;
      const meta = info.extmetadata ?? {};
      ergebnis.set(datei, {
        lizenz: ohneHtml(meta.LicenseShortName?.value ?? ''),
        urheber: ohneHtml(meta.Artist?.value ?? meta.Credit?.value ?? ''),
        breite: info.width,
        hoehe: info.height,
        original: info.url,
        vorschau: info.thumburl ?? info.url,
      });
    }
  }
  return ergebnis;
}

function ohneHtml(text) {
  return String(text).replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/\s+/g, ' ').trim();
}

// Höflich laden: Pause vor jeder Anfrage, bei „zu viele Anfragen“ warten und bis zu fünfmal neu versuchen.
async function holen(adresse, art) {
  for (let versuch = 1; versuch <= 5; versuch++) {
    await warten(PAUSE_MS);
    const antwort = await fetch(adresse, {headers: {'User-Agent': KENNUNG, 'Api-User-Agent': KENNUNG}});
    if (antwort.status === 429 || antwort.status === 503) {
      const sekunden = Number(antwort.headers.get('retry-after')) || 20 * versuch;
      console.log(`  … Commons bittet um Pause, warte ${sekunden} s`);
      await warten(sekunden * 1000);
      continue;
    }
    if (!antwort.ok) throw new Error(`Commons antwortet ${antwort.status} für ${adresse}`);
    if (art === 'json') {
      const text = await antwort.text();
      if (/too many requests/i.test(text)) { await warten(20000 * versuch); continue; }
      return JSON.parse(text);
    }
    return Buffer.from(await antwort.arrayBuffer());
  }
  throw new Error(`Commons blieb überlastet: ${adresse}`);
}

function warten(ms) {
  return new Promise(fertig => setTimeout(fertig, ms));
}

// ---------- Bilder ----------

// Lädt das Bild (für einen Ausschnitt das Original), schneidet wenn verlangt zu und baut die WebP-Größen.
// Gebaut wird immer im Arbeitsordner; `ziele` sagt, wohin jede Datei beim Einbauen kommt. So bleibt nach einem
// Fehler nichts halb in public/ liegen.
async function bildBauen(vorschlag, karte, commons) {
  const adresse = vorschlag.zuschnitt ? commons.original : commons.vorschau;
  const cacheDatei = path.join(CACHE, vorschlag.foto_id + '-' + Buffer.from(adresse).toString('base64url').slice(-24) + path.extname(new URL(adresse).pathname));
  if (!fs.existsSync(cacheDatei)) fs.writeFileSync(cacheDatei, await holen(adresse, 'bytes'));
  // Erst drehen (Kameradaten), nach sRGB umrechnen und Metadaten entfernen, dann Größe messen.
  // Grenze: -colorspace rechnet z. B. CMYK und Graustufen um, ein eingebettetes Adobe-RGB-Profil aber nicht
  // (dafür bräuchte es eine sRGB-Profildatei, die im Container fehlt). Commons-Vorschaubilder sind schon sRGB;
  // bei einem Ausschnitt aus dem Original die Vorschau ansehen.
  const basis = path.join(arbeitsordner, vorschlag.foto_id + '-basis.png');
  execFileSync('convert', [cacheDatei + '[0]', '-auto-orient', '-colorspace', 'sRGB', '-strip', basis]);
  let [w, h] = masse(basis);
  if (vorschlag.zuschnitt) {
    const z = vorschlag.zuschnitt;
    const ausschnitt = `${Math.round(w * z.breite)}x${Math.round(h * z.hoehe)}+${Math.round(w * z.links)}+${Math.round(h * z.oben)}`;
    execFileSync('convert', [basis, '-crop', ausschnitt, '+repage', basis]);
    [w, h] = masse(basis);
  }
  const breiten = zielBreiten(Math.min(w, commons.breite), vorschlag.mindestbreite_ok).filter(b => b <= w);
  const ordner = ORDNER_JE_WELT[karte.category];
  const varianten = [];
  let hoehe;
  for (const breite of breiten) {
    const name = `${vorschlag.foto_id}-${breite}.webp`;
    const ziel = path.join('public/world', ordner, name);
    // Gleicher Name wie eine vorhandene Datei: auch bei einem zweiten Neu-Export desselben Fotos in derselben
    // Breite. Dann erst die alte Datei (und ihren Eintrag) von Hand klären.
    if (einbauen && fs.existsSync(ziel)) throw new Error(`Datei gibt es schon: ${ziel}`);
    const datei = path.join(arbeitsordner, name);
    // „>“ verkleinert nur, nie größer.
    execFileSync('convert', [basis, '-resize', `${breite}x>`, '-quality', QUALITAET, datei]);
    const [vw, vh] = masse(datei);
    if (vw !== breite) throw new Error(`${name} ist ${vw} statt ${breite} px breit`);
    varianten.push({src: `/world/${ordner}/${name}`, width: vw, datei, ziel});
    hoehe = vh;
  }
  return {
    breiten,
    hoehe,
    varianten: varianten.map(({src, width}) => ({src, width})),
    dateien: varianten.map(v => v.datei),
    ziele: varianten.map(({datei, ziel}) => ({datei, ziel})),
  };
}

// Zeigt, was der Kartenkopf (260 px hoch, object-fit: cover und focus) auf Handy und Rechner sichtbar lässt.
function kopfVorschau(vorschlag, bild) {
  const quelle = bild.dateien.at(-1);
  const [w, h] = masse(quelle);
  const [fx, fy] = (vorschlag.focus ?? '50% 50%').split(' ').map(p => Number.parseFloat(p) / 100);
  return KOPF_FORMATE.map(format => {
    const ziel = path.join(vorschauOrdner, `${vorschlag.foto_id}-${format.name}.jpg`);
    if (vorschlag.fit === 'contain') {
      execFileSync('convert', [quelle, '-resize', `${format.breite - 28}x${format.hoehe - 28}`, '-background', '#efedf9', '-gravity', 'center', '-extent', `${format.breite}x${format.hoehe}`, ziel]);
    } else {
      const massstab = Math.max(format.breite / w, format.hoehe / h);
      const sw = Math.round(w * massstab), sh = Math.round(h * massstab);
      const x = Math.round((sw - format.breite) * fx), y = Math.round((sh - format.hoehe) * fy);
      execFileSync('convert', [quelle, '-resize', `${sw}x${sh}!`, '-crop', `${format.breite}x${format.hoehe}+${x}+${y}`, '+repage', ziel]);
    }
    execFileSync('convert', [ziel, '-gravity', 'south', '-background', '#ffffff', '-splice', '0x22', '-pointsize', '14', '-annotate', '+0+3', `${vorschlag.foto_id} (${format.name})`, ziel]);
    return ziel;
  });
}

function masse(datei) {
  return execFileSync('identify', ['-format', '%w %h', datei + '[0]'], {encoding: 'utf8'}).trim().split(' ').map(Number);
}

// Löscht eine ersetzte Bilddatei nur, wenn sie außer in den Fotodaten und Exporten nirgends mehr steht.
function entferneWennUnbenutzt(src) {
  const treffer = spawnSync('git', ['grep', '-l', '-F', '--', src], {encoding: 'utf8'}).stdout.split('\n').filter(Boolean);
  const abgeleitet = [FOTOS_DATEI, 'public/world/photo-credits.json', 'app/world-index.json', 'app/world-photo-core.json'];
  const andere = treffer.filter(datei => !abgeleitet.includes(datei) && !datei.startsWith('exports/'));
  if (andere.length) {
    console.log(`  Alte Datei ${src} bleibt, sie steht noch in: ${andere.join(', ')}`);
    return;
  }
  fs.rmSync(path.join('public', src), {force: true});
  console.log(`  Alte Datei entfernt: ${src}`);
}

// ---------- Dateien ----------

// Steht ein Foto heute auf einer Karte oder einem Naturort? (Gleiche Regel wie tests/content-integrity.test.mjs.)
function wirdGezeigt(id) {
  const naturFotos = leseJson(NATUR_FOTOS_DATEI);
  const naturOrte = leseJson(NATUR_ORTE_DATEI);
  return katalog.some(k => k.image === id) || (Object.hasOwn(naturFotos, id) && naturOrte.some(ort => ort.id === id));
}

// Foto-IDs werden nie wiederverwendet: Die Familie photos in stable-ids.json wächst nur.
function schreibeStabileFotoIds(ids) {
  const stabil = leseJson(STABIL_DATEI);
  const bisher = stabil.photos ?? [];
  const neu = ids.filter(id => !bisher.includes(id));
  if (!neu.length) return;
  stabil.photos = [...bisher, ...neu];
  // Gleiches Format wie die Datei: eine Familie je Zeile.
  fs.writeFileSync(STABIL_DATEI, '{\n' + Object.entries(stabil).map(([k, v]) => '  ' + JSON.stringify(k) + ': ' + JSON.stringify(v)).join(',\n') + '\n}\n');
}

function schreibeErsetzteFotos(ids) {
  const bisher = leseJson(ERSETZT_DATEI);
  const neu = ids.filter(id => !bisher.includes(id));
  if (!neu.length) return;
  schreibeJson(ERSETZT_DATEI, [...bisher, ...neu]);
  console.log(`  Ersetzt (Nachweis bleibt, Foto wird nicht mehr gezeigt): ${neu.join(', ')}`);
}

function leseJson(datei) {
  return JSON.parse(fs.readFileSync(datei, 'utf8'));
}

function schreibeJson(datei, wert) {
  fs.writeFileSync(datei, JSON.stringify(wert, null, 2) + '\n');
}

function sortiert(objekt) {
  return Object.fromEntries(Object.entries(objekt).sort(([a], [b]) => a.localeCompare(b)));
}

function beenden(nachricht) {
  console.error(nachricht);
  process.exit(2);
}
