// Prüfregeln des Bilder-Strangs (scripts/foto-regeln.mjs): nur freie Lizenzen, nie eine Foto-ID doppelt,
// Urheber und Quelle passen zur Commons-Datei, nie hochskaliert.
import test from 'node:test';
import assert from 'node:assert/strict';
import {pruefeVorschlag, vergleicheCommons, lizenzArt, zielBreiten, fokusGueltig, pruefeZuschnitt, vereinfacht, pruefeLizenzLink} from '../scripts/foto-regeln.mjs';

const katalog = [
  {id: 'animal-orca', category: 'animals', image: 'orca'},
  {id: 'animal-okapi', category: 'animals'},
  {id: 'place-x', category: 'nature'},
];
const fotos = {orca: {id: 'orca', source_page_url: 'https://commons.wikimedia.org/wiki/File:Orca_breaching.jpg'}};
const bestand = {fotos, katalog};

function vorschlag(extra = {}) {
  return {
    karte: 'animal-okapi',
    foto_id: 'okapi',
    commons_datei: 'File:Okapi (Okapia johnstoni).jpg',
    author: 'Ji-Elle',
    license: 'CC BY-SA 4.0',
    license_url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source_page_url: 'https://commons.wikimedia.org/wiki/File:Okapi_(Okapia_johnstoni).jpg',
    alt_de: 'Ein Okapi steht im Wald.',
    ...extra,
  };
}

test('lizenzArt erkennt freie Lizenzen in allen Schreibweisen von Commons', () => {
  for (const name of ['CC BY-SA 4.0', 'cc-by-sa-4.0', 'CC BY-SA 4.0 International']) assert.equal(lizenzArt(name), 'cc by-sa 4.0', name);
  for (const name of ['CC BY 2.0', 'cc-by-2.0', 'CC_BY_2.0']) assert.equal(lizenzArt(name), 'cc by 2.0', name);
  for (const name of ['Public domain', 'PD-US-expired', 'Gemeinfrei', 'No restrictions']) assert.equal(lizenzArt(name), 'gemeinfrei', name);
  for (const name of ['CC0', 'CC0 1.0', 'Public Domain Dedication']) assert.equal(lizenzArt(name), 'cc0', name);
});

test('lizenzArt lehnt unfreie und unbekannte Lizenzen ab', () => {
  for (const name of ['CC BY-NC 4.0', 'CC BY-ND 2.0', 'CC BY-NC-SA 3.0', 'cc-by-nc-sa-2.0', 'Fair use', 'All rights reserved', 'GFDL', '', undefined]) {
    assert.equal(lizenzArt(name), null, String(name));
  }
});

test('pruefeVorschlag nimmt einen vollständigen Vorschlag an und gibt die Karte zurück', () => {
  assert.equal(pruefeVorschlag(vorschlag(), bestand).id, 'animal-okapi');
  assert.equal(pruefeVorschlag(vorschlag({label: 'Gemälde', focus: '50% 20%'}), bestand).id, 'animal-okapi');
  // Neu-Exporte übernehmen das Label „Foto“ aus dem Bestand.
  assert.equal(pruefeVorschlag(vorschlag({label: 'Foto'}), bestand).id, 'animal-okapi');
});

test('pruefeVorschlag lehnt fehlende Felder, unbekannte Karten und Welten ohne Bildordner ab', () => {
  assert.throws(() => pruefeVorschlag(vorschlag({author: ' '}), bestand), /Feld author fehlt/);
  assert.throws(() => pruefeVorschlag(vorschlag({alt_de: undefined}), bestand), /Feld alt_de fehlt/);
  assert.throws(() => pruefeVorschlag(vorschlag({karte: 'animal-gibt-es-nicht'}), bestand), /nicht im Katalog/);
  assert.throws(() => pruefeVorschlag(vorschlag({karte: 'place-x'}), bestand), /kein Bildordner/);
  assert.throws(() => pruefeVorschlag(vorschlag({foto_id: 'Okapi Foto'}), bestand), /Kebab-ID/);
});

test('pruefeVorschlag verwendet nie eine vergebene Foto-ID wieder', () => {
  assert.throws(() => pruefeVorschlag(vorschlag({karte: 'animal-orca', foto_id: 'orca', commons_datei: 'File:Killerwhales_jumping.jpg', source_page_url: 'https://commons.wikimedia.org/wiki/File:Killerwhales_jumping.jpg'}), bestand), /nie wiederverwendet/);
});

test('pruefeVorschlag erlaubt neu_export nur für dasselbe Original auf derselben Karte', () => {
  const neu = {karte: 'animal-orca', foto_id: 'orca', neu_export: true, commons_datei: 'File:Orca breaching.jpg', source_page_url: 'https://commons.wikimedia.org/wiki/File:Orca_breaching.jpg'};
  assert.equal(pruefeVorschlag(vorschlag(neu), bestand).id, 'animal-orca');
  assert.throws(() => pruefeVorschlag(vorschlag({...neu, commons_datei: 'File:Anderes.jpg', source_page_url: 'https://commons.wikimedia.org/wiki/File:Anderes.jpg'}), bestand), /demselben Original/);
  assert.throws(() => pruefeVorschlag(vorschlag({...neu, karte: 'animal-okapi'}), bestand), /zeigt dieses Foto nicht/);
  assert.throws(() => pruefeVorschlag(vorschlag({neu_export: true}), bestand), /vorhandenes Foto/);
});

test('pruefeVorschlag lehnt KI-Bilder, unbekannte Labels und eine fremde Quellseite ab', () => {
  assert.throws(() => pruefeVorschlag(vorschlag({label: 'KI-Bild'}), bestand), /KI-Bilder/);
  assert.throws(() => pruefeVorschlag(vorschlag({label: 'Schnappschuss'}), bestand), /unbekanntes label/);
  assert.throws(() => pruefeVorschlag(vorschlag({source_page_url: 'https://commons.wikimedia.org/wiki/File:Anderes.jpg'}), bestand), /passt nicht/);
  // Prozent-kodierte Seitennamen sind dieselbe Seite.
  assert.equal(pruefeVorschlag(vorschlag({source_page_url: 'https://commons.wikimedia.org/wiki/File:Okapi_%28Okapia_johnstoni%29.jpg'}), bestand).id, 'animal-okapi');
});

test('vergleicheCommons verlangt gleiche Lizenz, passenden Urheber und genug Breite', () => {
  const commons = {lizenz: 'CC BY-SA 4.0', urheber: 'Ji-Elle (own work)', breite: 3000};
  assert.doesNotThrow(() => vergleicheCommons(vorschlag(), commons));
  assert.throws(() => vergleicheCommons(vorschlag(), {...commons, lizenz: 'CC BY 4.0'}), /Lizenz weicht ab/);
  assert.throws(() => vergleicheCommons(vorschlag(), {...commons, lizenz: 'CC BY-NC 4.0'}), /bei Commons nicht erlaubt/);
  assert.throws(() => vergleicheCommons(vorschlag({license: 'Fair use'}), commons), /im Vorschlag nicht erlaubt/);
  assert.throws(() => vergleicheCommons(vorschlag(), {...commons, urheber: 'Jemand anderes'}), /Urheber weicht ab/);
  assert.doesNotThrow(() => vergleicheCommons(vorschlag({autor_abweichung_ok: 'Commons nennt das Museum'}), {...commons, urheber: 'Jemand anderes'}));
  assert.throws(() => vergleicheCommons(vorschlag(), {...commons, breite: 800}), /nur 800 px/);
  // Urheber zählt nur als ganze Wörter: ein kurzer Name passt nicht in einen längeren.
  assert.throws(() => vergleicheCommons(vorschlag({author: 'Ann'}), {...commons, urheber: 'Joanne Smith'}), /Urheber weicht ab/);
  assert.doesNotThrow(() => vergleicheCommons(vorschlag({author: 'Joanne Smith'}), {...commons, urheber: 'Photo: Joanne Smith, 2019'}));
});

test('pruefeLizenzLink verlangt einen Lizenz-Link, der zur Lizenz passt', () => {
  assert.doesNotThrow(() => pruefeLizenzLink('CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/deed.en'));
  assert.doesNotThrow(() => pruefeLizenzLink('CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0/'));
  assert.doesNotThrow(() => pruefeLizenzLink('CC0 1.0', 'https://creativecommons.org/publicdomain/zero/1.0/deed.en'));
  assert.doesNotThrow(() => pruefeLizenzLink('Public Domain', 'https://creativecommons.org/publicdomain/mark/1.0/'));
  assert.throws(() => pruefeLizenzLink('CC BY-SA 4.0', 'https://creativecommons.org/licenses/by/4.0/'), /passt nicht/);
  assert.throws(() => pruefeLizenzLink('CC BY 4.0', 'https://creativecommons.org/licenses/by/3.0/'), /passt nicht/);
  assert.doesNotThrow(() => pruefeLizenzLink('CC BY-SA 3.0', 'https://creativecommons.org/licenses/by-sa/3.0'));
  assert.doesNotThrow(() => pruefeLizenzLink('Public Domain · US-Regierungswerk (NPS)', 'https://www.nps.gov/aboutus/disclaimer.htm'));
  assert.throws(() => pruefeLizenzLink('CC BY 4.0', 'https://creativecommons.org/licenses/by/4.01/'), /passt nicht/);
  assert.throws(() => pruefeLizenzLink('Public Domain', 'http://example.org/pd'), /passt nicht/);
  // pruefeVorschlag prüft den Link gleich mit.
  assert.throws(() => pruefeVorschlag(vorschlag({license_url: 'https://creativecommons.org/licenses/by/4.0/'}), bestand), /license_url passt nicht/);
});

test('zielBreiten skaliert nie hoch und lässt schmale Originale nur mit Begründung zu', () => {
  assert.deepEqual(zielBreiten(4000), [320, 640, 960]);
  assert.deepEqual(zielBreiten(960), [320, 640, 960]);
  assert.throws(() => zielBreiten(800), /mindestbreite_ok/);
  assert.deepEqual(zielBreiten(800, 'NOAA-Bild, kein größeres freies Original'), [320, 640, 800]);
  assert.deepEqual(zielBreiten(640, 'Begründung'), [320, 640]);
  // Eine dritte Größe kaum breiter als 640 wäre fast dieselbe Datei.
  assert.deepEqual(zielBreiten(650, 'Begründung'), [320, 640]);
  assert.deepEqual(zielBreiten(735, 'Begründung'), [320, 640]);
  assert.deepEqual(zielBreiten(736, 'Begründung'), [320, 640, 736]);
  assert.throws(() => zielBreiten(600, 'Begründung'), /zu klein/);
});

test('fokusGueltig und pruefeZuschnitt nehmen nur sinnvolle Angaben an', () => {
  assert.equal(fokusGueltig('50% 20%'), true);
  assert.equal(fokusGueltig('0% 100%'), true);
  for (const falsch of ['center', '50%', '120% 10%', '50% 20% ', '50px 20px']) assert.equal(fokusGueltig(falsch), false, falsch);
  assert.doesNotThrow(() => pruefeZuschnitt({links: 0.3, oben: 0, breite: 0.4, hoehe: 1}));
  assert.throws(() => pruefeZuschnitt({links: 0.7, oben: 0, breite: 0.4, hoehe: 1}), /nicht ganz im Bild/);
  assert.throws(() => pruefeZuschnitt({links: 0.3, oben: 0, breite: 0, hoehe: 1}), /nicht ganz im Bild/);
  assert.throws(() => pruefeZuschnitt({links: 0.3, oben: 0, breite: 0.4}), /Anteile/);
});

test('vereinfacht macht Schreibweisen von Namen vergleichbar', () => {
  assert.equal(vereinfacht('Ji-Elle'), 'ji elle');
  assert.equal(vereinfacht('José Reynaldo da Fonseca'), 'jose reynaldo da fonseca');
});
