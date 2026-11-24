// Bilder-Strang (BACKLOG Phase 1, Punkt 26): reine Prüfregeln für Bildvorschläge, ohne Netz und ohne Dateien.
// scripts/foto-einbau.mjs nutzt sie; tests/foto-regeln.test.mjs prüft sie.

// Die Größen, in denen jedes Foto auf der Seite liegt (srcset in app/world-media.tsx).
export const BREITEN = [320, 640, 960];
// Schmalere Originale gehen nur mit Begründung (Feld mindestbreite_ok) und nie unter dieser Breite.
export const MINDESTBREITE = 640;

// Ordner unter public/world/ je Welt der Karte.
export const ORDNER_JE_WELT = {
  animals: 'animals', people: 'people', inventions: 'inventions',
  history: 'history', buildings: 'buildings', science: 'science',
};

// Feld label im Vorschlag → so steht es in app/world-photos.json. Das Kennwort auf der Karte
// leitet app/kern/karte/karten-daten.ts (fotoKennwort) daraus ab. Im Bestand heißt ein späteres Bildnis „Darstellung“.
export const LABEL_IM_BESTAND = {
  'Spätere Darstellung': 'Darstellung',
  'Darstellung': 'Darstellung',
  'Historischer Druck': 'Historischer Druck',
  'Gemälde': 'Gemälde',
  'Rekonstruktion': 'Rekonstruktion',
};

const PFLICHTFELDER = ['karte', 'foto_id', 'commons_datei', 'author', 'license', 'license_url', 'source_page_url', 'alt_de'];

// Prüft einen Vorschlag gegen den Bestand. Gibt die Karte zurück oder wirft einen Fehler mit Grund.
// Neue Bilder brauchen eine neue Foto-ID. Mit neu_export wird ein vorhandenes Foto aus demselben Original
// größer neu gebaut; die Foto-ID bleibt dann, denn es ist dasselbe Bild.
export function pruefeVorschlag(vorschlag, {fotos, katalog}) {
  for (const feld of PFLICHTFELDER) {
    if (typeof vorschlag[feld] !== 'string' || !vorschlag[feld].trim()) throw new Error(`Feld ${feld} fehlt`);
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(vorschlag.foto_id)) throw new Error('foto_id ist keine kurze Kebab-ID');
  if (vorschlag.label === 'KI-Bild') throw new Error('KI-Bilder kommen nicht über den Bilder-Strang');
  if (vorschlag.label != null && !Object.hasOwn(LABEL_IM_BESTAND, vorschlag.label)) throw new Error(`unbekanntes label „${vorschlag.label}“`);
  if (vorschlag.focus != null && !fokusGueltig(vorschlag.focus)) throw new Error(`focus „${vorschlag.focus}“ ist keine Angabe wie „50% 20%“`);
  if (vorschlag.zuschnitt != null) pruefeZuschnitt(vorschlag.zuschnitt);
  const karte = katalog.find(k => k.id === vorschlag.karte);
  if (!karte) throw new Error('Karte nicht im Katalog');
  if (!Object.hasOwn(ORDNER_JE_WELT, karte.category)) throw new Error(`kein Bildordner für Welt ${karte.category}`);
  if (commonsSeite(vorschlag.commons_datei) !== seitenName(vorschlag.source_page_url)) throw new Error('source_page_url passt nicht zu commons_datei');
  if (vorschlag.neu_export) {
    const alt = fotos[vorschlag.foto_id];
    if (!alt) throw new Error('neu_export braucht ein vorhandenes Foto mit dieser foto_id');
    if (karte.image !== vorschlag.foto_id) throw new Error('neu_export: die Karte zeigt dieses Foto nicht');
    if (seitenName(alt.source_page_url) !== seitenName(vorschlag.source_page_url)) throw new Error('neu_export nur aus demselben Original');
  } else if (Object.hasOwn(fotos, vorschlag.foto_id)) {
    throw new Error('foto_id gibt es schon; Foto-IDs werden nie wiederverwendet');
  }
  return karte;
}

// Vergleicht den Vorschlag mit dem, was Commons heute sagt: Lizenz, Breite, Urheber.
export function vergleicheCommons(vorschlag, commons) {
  const commonsLizenz = lizenzArt(commons.lizenz);
  if (!commonsLizenz) throw new Error(`Lizenz bei Commons nicht erlaubt: „${commons.lizenz}“`);
  const vorgeschlagen = lizenzArt(vorschlag.license);
  if (!vorgeschlagen) throw new Error(`Lizenz im Vorschlag nicht erlaubt: „${vorschlag.license}“`);
  if (commonsLizenz !== vorgeschlagen) throw new Error(`Lizenz weicht ab: Vorschlag „${vorschlag.license}“, Commons „${commons.lizenz}“`);
  zielBreiten(commons.breite, vorschlag.mindestbreite_ok);
  const autor = vereinfacht(vorschlag.author);
  const commonsAutor = vereinfacht(commons.urheber);
  const passt = autor && commonsAutor && (commonsAutor.includes(autor) || autor.includes(commonsAutor));
  if (!passt && !vorschlag.autor_abweichung_ok) {
    throw new Error(`Urheber weicht ab: Vorschlag „${vorschlag.author}“, Commons „${commons.urheber}“ (sonst autor_abweichung_ok mit Begründung)`);
  }
}

// Die Breiten, in denen ein Foto gebaut wird. Nie hochskalieren: Ein schmaleres Original (ab 640 px, nur mit
// Begründung) endet bei seiner eigenen Breite, z. B. 320, 640, 800.
export function zielBreiten(originalBreite, mindestbreiteOk) {
  if (originalBreite >= BREITEN.at(-1)) return [...BREITEN];
  if (!mindestbreiteOk) throw new Error(`Original nur ${originalBreite} px breit (mindestens ${BREITEN.at(-1)}, sonst mindestbreite_ok mit Begründung)`);
  if (originalBreite < MINDESTBREITE) throw new Error(`Original nur ${originalBreite} px breit, zu klein auch mit mindestbreite_ok (mindestens ${MINDESTBREITE})`);
  return originalBreite === MINDESTBREITE ? [320, MINDESTBREITE] : [320, MINDESTBREITE, originalBreite];
}

// Ordnet einen Lizenznamen einer erlaubten Art zu, z. B. „cc by-sa 4.0“ oder „gemeinfrei“; sonst null.
export function lizenzArt(name) {
  const text = String(name ?? '').toLowerCase().replace(/[_\s]+/g, ' ').trim();
  if (!text) return null;
  if (/\b(nc|nd)\b|non-?commercial|no ?deriv/.test(text)) return null;
  if (/^cc0\b|^cc zero|public domain dedication/.test(text)) return 'cc0';
  const cc = text.match(/^cc[ -]by(-sa)?[ -]?(\d(?:\.\d)?)/);
  if (cc) return `cc by${cc[1] ?? ''} ${cc[2]}`;
  if (/^(public domain|gemeinfrei|pd\b|pd-)|^no restrictions/.test(text)) return 'gemeinfrei';
  return null;
}

// Kleinbuchstaben ohne Akzente und Satzzeichen, damit „Ji-Elle“ und „ji elle“ gleich sind.
export function vereinfacht(text) {
  return String(text ?? '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

// CSS object-position wie „50% 20%“: wo im Bild der wichtige Teil liegt, wenn der Kartenkopf zuschneidet.
export function fokusGueltig(fokus) {
  const teile = String(fokus).match(/^(\d{1,3})% (\d{1,3})%$/);
  return Boolean(teile) && Number(teile[1]) <= 100 && Number(teile[2]) <= 100;
}

// Ein Ausschnitt aus dem Original in Anteilen (0 bis 1), z. B. {links: 0.3, oben: 0, breite: 0.4, hoehe: 1}.
export function pruefeZuschnitt(z) {
  const felder = ['links', 'oben', 'breite', 'hoehe'];
  if (!z || typeof z !== 'object' || !felder.every(f => typeof z[f] === 'number' && z[f] >= 0 && z[f] <= 1)) {
    throw new Error('zuschnitt braucht links, oben, breite und hoehe als Anteile zwischen 0 und 1');
  }
  if (z.breite === 0 || z.hoehe === 0 || z.links + z.breite > 1.0001 || z.oben + z.hoehe > 1.0001) throw new Error('zuschnitt liegt nicht ganz im Bild');
}

function commonsSeite(datei) {
  return datei.trim().replaceAll(' ', '_');
}

function seitenName(adresse) {
  const pfad = new URL(adresse).pathname;
  if (!pfad.startsWith('/wiki/')) return '';
  return decodeURIComponent(pfad.slice('/wiki/'.length)).replaceAll(' ', '_');
}
