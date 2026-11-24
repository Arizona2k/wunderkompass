# Bilder-Strang: Plan (24.11.2026)

Grundlage: Wunsch und Entscheidung des Nutzers vom 24.11.2026 (BACKLOG Phase 1, Punkt 26; `CLAUDE.md`, „Immer zuerst Originalfotos“). Kein neuer Helfer, sondern ein fester Ablauf. Dieser Plan hält fest, was der nächste Chat braucht, damit er nichts neu ausdenken muss.

## Ziel

Jede Karte zeigt ein echtes, freies Foto oder eine echte historische Abbildung, wenn es eines gibt. KI-Bilder bleiben nur, wo es nachweislich kein freies Original gibt. Der Ablauf läuft nebenher, während an Spielen, Inhalten und Design gearbeitet wird.

## Ablauf

1. **Warteliste** `docs/bilder/warteliste.md`: je Karte die ID, der Grund (falsches Foto, zu klein, KI-Bild statt Foto, kein Bild) und der Stand (offen, Kandidat da, eingebaut, kein freies Original).
2. **Suche:** `bild-recherche` bekommt Pakete von etwa 8 Karten (Regel „Helfer parallel nutzen“). Vorher prüfen, ob es in `docs/entwurf/` schon Kandidaten gibt. Höchstens zwei Pakete gleichzeitig, weil Commons sonst bremst.
3. **Ergebnis als Datei:** Jedes Paket landet sofort als Bericht in `docs/entwurf/` und dazu als Vorschlagsliste `docs/bilder/vorschlaege-<datum>-<paket>.json` (Format unten).
4. **Ansehen:** Claude öffnet jedes vorgeschlagene Bild groß (Vorschau von Commons) und streicht, was ein Kind nicht sofort erkennt.
5. **Einbauen:** `node scripts/foto-einbau.mjs docs/bilder/vorschlaege-….json --nur-pruefen`, dann ohne `--nur-pruefen`. Das Skript prüft Lizenz und Urheber noch einmal direkt bei Commons, baut die Bilder in 320, 640 und 960 Pixel Breite und trägt Nachweis, Kartenbild und Kennwort ein.
6. **Prüfen:** Bildunterschriften und Alt-Texte prüft die `kinder-redaktion`, Aussagen in Bildunterschriften der `fakten-pruefer`. Dazu `pnpm run check` und, weil sich Kartenbilder ändern, `node tests/browser/run.mjs --suite full core offline-cold-full`.
7. **Zeigen und Freigabe** wie immer (Vorschau, Screenshots, PR nach `test-live`). Ein PR je Bündel, nicht je Bild.

## Vorschlagsformat (JSON-Liste)

```json
[
  {
    "karte": "animal-orca",
    "foto_id": "orca-jumping",
    "commons_datei": "File:Killerwhales_jumping.jpg",
    "author": "Robert Pittman (NOAA)",
    "license": "Public domain",
    "license_url": "https://commons.wikimedia.org/wiki/File:Killerwhales_jumping.jpg",
    "source_page_url": "https://commons.wikimedia.org/wiki/File:Killerwhales_jumping.jpg",
    "alt_de": "Zwei schwarz-weiße Orcas springen gleichzeitig aus dem Meer."
  }
]
```

Wahlweise: `label` („Spätere Darstellung“, „Historischer Druck“, „Rekonstruktion“), `caption`, `fit` („contain“), `autor_abweichung_ok` (Begründung, falls der Urheber bei Commons anders geschrieben ist), `mindestbreite_ok` (Begründung, falls das Original schmaler als 960 px ist; siehe offene Punkte).

Neue Fotos bekommen immer eine **neue** Foto-ID. Alte Foto-IDs bleiben in `app/world-photos.json` stehen, auch wenn keine Karte sie mehr zeigt (Regel „IDs nie wiederverwenden“; prüfen, ob ein Test ungenutzte Einträge verbietet).

## Skript

- `scripts/foto-regeln.mjs`: reine Prüfregeln ohne Netz und ohne Dateien, damit sie einen Unit-Test bekommen: `pruefeVorschlag(vorschlag, {fotos, katalog})`, `lizenzArt(name)`, `vergleicheLizenz(vorschlag, commons)`, `vereinfacht(text)`.
- `tests/foto-regeln.test.mjs`: erlaubt sind gemeinfrei, CC0, CC BY und CC BY-SA in allen Schreibweisen von Commons (z. B. „CC BY-SA 4.0“, „cc-by-sa-4.0“, „Public domain“); abgelehnt werden NC, ND, unbekannte Lizenzen, abweichende Lizenzen, vergebene Foto-IDs, unbekannte Karten, das Label „KI-Bild“, eine `source_page_url`, die nicht zur Datei passt, und ein abweichender Urheber ohne Begründung.
- `scripts/foto-einbau.mjs`: Commons-Abfrage, Laden, Umwandeln, Schreiben. Generischer User-Agent `WunderKompass-Bildeinbau/1.0 (https://wunderkompass.vercel.app)`, nie Name oder E-Mail des Nutzers. Pause von 1,5 s vor jeder Anfrage; bei „zu viele Anfragen“ (429, 503 oder der Text „too many requests“) warten und bis zu fünfmal neu versuchen.
- Der Entwurf liegt unten im Anhang. Er wurde noch nicht ausgeführt.

## Reihenfolge

1. **Klar unbrauchbare Fotos** ([Foto-Inventur](2026-11-24-foto-inventur.md)): Orca (Ersatz `File:Killerwhales_jumping.jpg`), Blauwal (Ersatz `File:Blue_Whale_001_noaa_body_color.jpg`, nur 800 px breit). Dazu größere Neu-Exporte aus denselben Originalen: Karl Benz, Bertha Benz und Einstein auf 960 px, Wangari Maathai (742), al-Chwarizmi (735), Gutenberg (650), Darwin (630), Jane Goodall (617). Ausschnitt: Kaiserpinguin und Eiffelturm verlieren bei 600 bis 899 px Kopf bzw. Spitze; erst `object-position` je Foto prüfen (neues wahlweises Feld, z. B. `focus`), sonst Querformat-Foto suchen.
2. **24 Tiere mit KI-Bild**, dann **3 Erfindungen** und **11 Personen** ohne Foto (Kandidaten der zwei Hintergrund-Pakete vom 24.11.2026, Berichte in `docs/entwurf/2026-11-24-bilder-paket-*.md`).
3. **Zeitreise und Erfindungen ohne Bild** ([Kandidaten vom 21.11.2026](2026-11-21-bilder-zeitreise-erfindungen.md); 48 von 58 Karten haben Kandidaten). Vor dem Einbau Lizenz auf der Dateiseite bestätigen (macht das Skript), Bild groß ansehen, Bildunterschriften prüfen lassen.
4. **Bauwerke und Wissenschaft** in Phase 3.

Schwache, aber richtige Fotos (Dromedar, Krake, Rotes Riesenkänguru, Jocelyn Bell Burnell) und die Nachweis-Lücken (NPS-Einzelseiten, `PHOTOS` in `app/learning-media.ts` ohne Lizenzfeld, Alt-Text der Reise „Wetter“) kommen in die Warteliste, aber nach Punkt 2.

## Offene Punkte für den Bau

- **Schmalere Originale:** Der Blauwal-Ersatz ist 800 px breit. Vorschlag: `mindestbreite_ok` mit Begründung erlaubt Originale ab 640 px; dann entstehen nur die Größen bis zur Originalbreite (320, 640, 800), nie hochskaliert. Prüfen, ob `app/world-media.tsx` mit einer Variante von 800 statt 960 klarkommt.
- **Karten mit Zeichnung:** Bekommt eine Tierkarte ein Foto, zeigt der Kartenkopf das Foto statt der Zeichnung (`bildArt` in `app/kern/karte/karten-daten.ts`). Vorher alle Tests suchen, die bei diesen Karten eine Zeichnung erwarten (nach Karten-ID, `bildArt`, `hasTopicIllustration`). Ob die Merkmalszeichnung weiter unten auf der Karte bleibt, wird je Karte entschieden.
- **Offline-Paket:** `build/learning-assets.mjs` nimmt jedes WebP in die Offline-Liste. 24 Tiere mit drei Größen machen das Offline-Paket um geschätzt 2 bis 3 MB größer. Es gibt dafür kein Budget in `performance-budgets.json`; nach dem ersten Bündel messen und dem Nutzer sagen.
- **Kennwörter:** `app/kern/karte/foto-kennwoerter.json` muss genau zu `app/world-photos.json` passen (Test in `tests/wissenskarte.test.mjs`).
- **Abgeleitete Listen:** danach `node scripts/export-content.mjs` (Foto-Index, Kern-Fotos, Integrität).

## Anhang: Entwurf `scripts/foto-einbau.mjs`

Noch nicht in Regeln und Einbau geteilt (siehe „Skript“).

```js
// Bilder-Strang (BACKLOG Phase 1, Punkt 26): baut freigegebene Bildvorschläge der `bild-recherche` ein.
//
// Aufruf:  node scripts/foto-einbau.mjs <vorschlaege.json> [--nur-pruefen]
//
// Je Vorschlag:
//   1. Lizenz und Urheber bei Wikimedia Commons nachsehen und mit dem Vorschlag vergleichen.
//      Erlaubt sind nur gemeinfrei, CC0, CC BY und CC BY-SA. Passt etwas nicht, bleibt der Vorschlag draußen.
//   2. (nicht mit --nur-pruefen) Bild laden, als WebP in 320, 640 und 960 Pixel Breite speichern
//      (nie hochskalieren, nichts beschneiden), Eintrag in app/world-photos.json, Feld `image` der Karte
//      in app/world-catalog.json, Kennwort in app/kern/karte/foto-kennwoerter.json.
//   3. Danach die abgeleiteten Listen neu erzeugen (scripts/export-content.mjs).
//
// Das Skript ändert nur Bilder und Bilddaten. Claude sieht jedes Bild vor dem Einbau an (Entscheidung des Nutzers).

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync, spawnSync} from 'node:child_process';

const WURZEL = process.cwd();
const FOTOS_DATEI = 'app/world-photos.json';
const KATALOG_DATEI = 'app/world-catalog.json';
const KENNWORT_DATEI = 'app/kern/karte/foto-kennwoerter.json';
const BREITEN = [320, 640, 960];
const LADEBREITE = 1280;
const QUALITAET = '78';
const PAUSE_MS = 1500;
// Wikimedia verlangt einen erkennbaren Client; keine persönlichen Daten.
const KENNUNG = 'WunderKompass-Bildeinbau/1.0 (https://wunderkompass.vercel.app)';

// Ordner unter public/world/ je Welt der Karte.
const ORDNER_JE_WELT = {
  animals: 'animals', people: 'people', inventions: 'inventions',
  history: 'history', buildings: 'buildings', science: 'science',
};

// Wie in app/kern/karte/karten-daten.ts (fotoKennwort): Feld label → Kennwort auf der Karte.
const KENNWORT_JE_LABEL = {
  'KI-Bild': 'KI-Bild',
  'Rekonstruktion': 'Rekonstruktion',
  'Spätere Darstellung': 'Spätere Darstellung',
  'Darstellung': 'Spätere Darstellung',
  'Historischer Druck': 'Historischer Druck',
};

const TRANSFORMATION = 'Proportional verkleinert (320, 640 und 960 Pixel breit) und als WebP komprimiert; '
  + 'Bildinhalt nicht beschnitten, keine KI-Bildänderung.';

// ---------- Ablauf ----------

const argumente = process.argv.slice(2);
const nurPruefen = argumente.includes('--nur-pruefen');
const eingabe = argumente.find(a => !a.startsWith('--'));
if (!eingabe) beenden('Aufruf: node scripts/foto-einbau.mjs <vorschlaege.json> [--nur-pruefen]');

const vorschlaege = JSON.parse(fs.readFileSync(eingabe, 'utf8')).filter(v => v.foto_id);
const fotos = leseJson(FOTOS_DATEI);
const katalog = leseJson(KATALOG_DATEI);
const kennwoerter = leseJson(KENNWORT_DATEI);
const arbeitsordner = fs.mkdtempSync(path.join(os.tmpdir(), 'foto-einbau-'));

const eingebaut = [];
const abgelehnt = [];
for (const vorschlag of vorschlaege) {
  try {
    const karte = pruefeVorschlag(vorschlag);
    const commons = await commonsDaten(vorschlag.commons_datei);
    vergleicheLizenz(vorschlag, commons);
    if (!nurPruefen) {
      const eintrag = await bildEinbauen(vorschlag, karte, commons);
      fotos[vorschlag.foto_id] = eintrag;
      const vorher = karte.image;
      karte.image = vorschlag.foto_id;
      const kennwort = KENNWORT_JE_LABEL[vorschlag.label];
      if (kennwort) kennwoerter[vorschlag.foto_id] = kennwort;
      eingebaut.push(`${karte.id}: ${vorschlag.foto_id}${vorher ? ` (ersetzt ${vorher})` : ''}`);
    } else {
      eingebaut.push(`${karte.id}: ${vorschlag.foto_id} (Lizenz und Urheber passen)`);
    }
  } catch (fehler) {
    abgelehnt.push(`${vorschlag.karte} / ${vorschlag.foto_id}: ${fehler.message}`);
  }
}

if (!nurPruefen && eingebaut.length) {
  schreibeJson(FOTOS_DATEI, fotos);
  schreibeJson(KATALOG_DATEI, katalog);
  schreibeJson(KENNWORT_DATEI, sortiert(kennwoerter));
  const export_ = spawnSync('node', ['scripts/export-content.mjs'], {stdio: 'inherit'});
  if (export_.status !== 0) abgelehnt.push('scripts/export-content.mjs ist fehlgeschlagen; Daten von Hand prüfen.');
}
fs.rmSync(arbeitsordner, {recursive: true, force: true});

console.log(`\n${nurPruefen ? 'Geprüft' : 'Eingebaut'}: ${eingebaut.length}`);
for (const zeile of eingebaut) console.log('  ✔ ' + zeile);
console.log(`Nicht eingebaut: ${abgelehnt.length}`);
for (const zeile of abgelehnt) console.log('  ✖ ' + zeile);
if (abgelehnt.length) process.exitCode = 1;

// ---------- Prüfen ----------

function pruefeVorschlag(vorschlag) {
  for (const feld of ['karte', 'foto_id', 'commons_datei', 'author', 'license', 'license_url', 'source_page_url', 'alt_de']) {
    if (!vorschlag[feld]) throw new Error(`Feld ${feld} fehlt`);
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(vorschlag.foto_id)) throw new Error('foto_id ist keine kurze Kebab-ID');
  if (Object.hasOwn(fotos, vorschlag.foto_id)) throw new Error('foto_id gibt es schon; Foto-IDs werden nie wiederverwendet');
  if (vorschlag.label && !KENNWORT_JE_LABEL[vorschlag.label]) throw new Error(`unbekanntes label „${vorschlag.label}“`);
  if (vorschlag.label === 'KI-Bild') throw new Error('KI-Bilder kommen nicht über den Bilder-Strang');
  const karte = katalog.find(k => k.id === vorschlag.karte);
  if (!karte) throw new Error('Karte nicht im Katalog');
  if (!ORDNER_JE_WELT[karte.category]) throw new Error(`kein Bildordner für Welt ${karte.category}`);
  const erwarteteSeite = 'https://commons.wikimedia.org/wiki/' + vorschlag.commons_datei.replaceAll(' ', '_');
  if (decodeURIComponent(vorschlag.source_page_url) !== erwarteteSeite) throw new Error('source_page_url passt nicht zu commons_datei');
  return karte;
}

function vergleicheLizenz(vorschlag, commons) {
  const commonsLizenz = lizenzArt(commons.lizenz);
  if (!commonsLizenz) throw new Error(`Lizenz bei Commons nicht erlaubt: „${commons.lizenz}“`);
  const vorgeschlagen = lizenzArt(vorschlag.license);
  if (!vorgeschlagen) throw new Error(`Lizenz im Vorschlag nicht erlaubt: „${vorschlag.license}“`);
  if (commonsLizenz !== vorgeschlagen) throw new Error(`Lizenz weicht ab: Vorschlag „${vorschlag.license}“, Commons „${commons.lizenz}“`);
  if (commons.breite < BREITEN.at(-1)) throw new Error(`Original nur ${commons.breite} px breit (mindestens ${BREITEN.at(-1)})`);
  const autor = vereinfacht(vorschlag.author);
  const commonsAutor = vereinfacht(commons.urheber);
  const passt = autor && commonsAutor && (commonsAutor.includes(autor) || autor.includes(commonsAutor));
  if (!passt && !vorschlag.autor_abweichung_ok) {
    throw new Error(`Urheber weicht ab: Vorschlag „${vorschlag.author}“, Commons „${commons.urheber}“ (sonst autor_abweichung_ok mit Begründung)`);
  }
}

// Ordnet einen Lizenznamen einer erlaubten Art zu, z. B. „cc by-sa 4.0“ oder „gemeinfrei“; sonst null.
function lizenzArt(name) {
  const text = String(name ?? '').toLowerCase().replace(/\s+/g, ' ').trim();
  if (/\b(nc|nd)\b|non-?commercial|no ?deriv/.test(text)) return null;
  if (/^cc0\b|public domain dedication|cc zero/.test(text)) return 'cc0';
  const cc = text.match(/^cc[ -]by(-sa)?[ -]?(\d(\.\d)?)/);
  if (cc) return `cc by${cc[1] ?? ''} ${cc[2]}`;
  if (/public domain|gemeinfrei|^pd\b|^pd-|no restrictions/.test(text)) return 'gemeinfrei';
  return null;
}

function vereinfacht(text) {
  return String(text ?? '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

// ---------- Commons ----------

async function commonsDaten(datei) {
  const adresse = new URL('https://commons.wikimedia.org/w/api.php');
  adresse.search = new URLSearchParams({
    action: 'query', format: 'json', titles: datei, prop: 'imageinfo',
    iiprop: 'url|size|extmetadata', iiurlwidth: String(LADEBREITE),
    iiextmetadatafilter: 'LicenseShortName|LicenseUrl|Artist|Credit',
  }).toString();
  const antwort = await holen(adresse, 'json');
  const seite = Object.values(antwort.query?.pages ?? {})[0];
  const info = seite?.imageinfo?.[0];
  if (!info) throw new Error(`Datei bei Commons nicht gefunden: ${datei}`);
  const meta = info.extmetadata ?? {};
  return {
    lizenz: meta.LicenseShortName?.value ?? '',
    lizenzUrl: meta.LicenseUrl?.value ?? '',
    urheber: ohneHtml(meta.Artist?.value ?? meta.Credit?.value ?? ''),
    breite: info.width,
    hoehe: info.height,
    ladeAdresse: info.thumburl ?? info.url,
  };
}

function ohneHtml(text) {
  return text.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/\s+/g, ' ').trim();
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
      if (text.includes('too many requests')) { await warten(20000 * versuch); continue; }
      return JSON.parse(text);
    }
    return Buffer.from(await antwort.arrayBuffer());
  }
  throw new Error(`Commons blieb überlastet: ${adresse}`);
}

function warten(ms) {
  return new Promise(fertig => setTimeout(fertig, ms));
}

// ---------- Einbauen ----------

async function bildEinbauen(vorschlag, karte, commons) {
  const roh = path.join(arbeitsordner, vorschlag.foto_id + '.bild');
  fs.writeFileSync(roh, await holen(commons.ladeAdresse, 'bytes'));
  const ordner = ORDNER_JE_WELT[karte.category];
  fs.mkdirSync(path.join(WURZEL, 'public/world', ordner), {recursive: true});
  const varianten = [];
  let groesste;
  for (const breite of BREITEN) {
    const pfad = `/world/${ordner}/${vorschlag.foto_id}-${breite}.webp`;
    const ziel = path.join(WURZEL, 'public', pfad);
    if (fs.existsSync(ziel)) throw new Error(`Datei gibt es schon: ${pfad}`);
    // „>“ verkleinert nur, nie größer; -auto-orient dreht nach den Kameradaten, -strip entfernt Metadaten.
    execFileSync('convert', [roh, '-auto-orient', '-strip', '-resize', `${breite}x>`, '-quality', QUALITAET, ziel]);
    const [w, h] = execFileSync('identify', ['-format', '%w %h', ziel], {encoding: 'utf8'}).split(' ').map(Number);
    varianten.push({src: pfad, width: w});
    groesste = {pfad, w, h};
  }
  const eintrag = {
    id: vorschlag.foto_id,
    author: vorschlag.author,
    license: vorschlag.license,
    license_url: vorschlag.license_url,
    source_page_url: vorschlag.source_page_url,
    alt_de: vorschlag.alt_de,
    width: groesste.w,
    height: groesste.h,
    src: groesste.pfad,
    variants: varianten,
    transformations_de: TRANSFORMATION,
  };
  if (vorschlag.caption) eintrag.caption = vorschlag.caption;
  if (vorschlag.fit) eintrag.fit = vorschlag.fit;
  if (vorschlag.label) eintrag.label = vorschlag.label;
  return eintrag;
}

// ---------- Dateien ----------

function leseJson(datei) {
  return JSON.parse(fs.readFileSync(path.join(WURZEL, datei), 'utf8'));
}

function schreibeJson(datei, wert) {
  const pfad = path.join(WURZEL, datei);
  const mitZeilenende = fs.readFileSync(pfad, 'utf8').endsWith('\n');
  fs.writeFileSync(pfad, JSON.stringify(wert, null, 2) + (mitZeilenende ? '\n' : ''));
}

function sortiert(objekt) {
  return Object.fromEntries(Object.entries(objekt).sort(([a], [b]) => a.localeCompare(b)));
}

function beenden(nachricht) {
  console.error(nachricht);
  process.exit(2);
}
```
