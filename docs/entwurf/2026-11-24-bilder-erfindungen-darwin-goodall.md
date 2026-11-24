# Bildvorschläge: 3 Erfindungen, Darwin, Goodall (24.11.2026)

Helfer: `bild-recherche` (Bilder-Strang, BACKLOG Phase 1, Punkt 26). Der Helfer hat nichts geändert. **Noch nichts davon ist eingebaut.** Alle fünf Vorschläge sind freie Originale, ein KI-Bild ist nicht nötig. Format von `scripts/foto-einbau.mjs`; Felder wie `original_*`, `risiken`, `alternative` sind Notizen. Vor dem Einbau `node scripts/foto-einbau.mjs <datei> --nur-pruefen`.

## Prüftiefe (ehrlich)

- Gelesen auf der Commons-Dateiseite: bei allen fünf Hauptvorschlägen Urheber, Lizenz, Größe und Datum (API `extmetadata`) und der Wikitext (Lizenzbaustein, Quelle, Autor, Kategorien); ebenso bei den Alternativen Goodall HK und Darwin Elliott & Fry 1881 sowie dem Original `File:Charles Darwin by Barraud c1881.jpg` (nur Wikitext des Zuschnitts).
- Bilder nur als Vorschau mit 800 bis 960 px angesehen, nicht in voller Größe; keine Randprüfung auf Wasserzeichen am Original.
- Nicht geöffnet: Smithsonian-Objektseite (HTTP 403), Flickr (Prusa), Gallica (Barraud), NPG-Seite.
- Nur aus der Trefferliste: Seismometer Lick Observatory, `Historischer Seismograph.jpg`, `3D printing in action at -wimbledon.jpg`, `3D printing in progress.jpg`.
- Die API bremste stark; alle Anfragen einzeln mit `WunderKompass-Bildeinbau/1.0 (https://wunderkompass.vercel.app)`.
- Alle fünf Foto-IDs sind frei (nicht in `app/world-photos.json`, nicht in `tests/fixtures/stable-ids.json`).

## Empfehlung (Kurzfassung)

| Karte | Vorschlag | Breite | Lizenz | Einbau |
|---|---|---|---|---|
| `invention-3d-printing` | Prusa i3 druckt eine Vase | 2448 | CC BY 2.0 | ja, mit Zuschnitt (Aufschrift „PRUSA“ prüfen) |
| `invention-seismograph` | Seismogramm-Trommel, Weston Observatory | 4032 | CC BY-SA 3.0 | ja |
| `invention-sewing-machine` | Howes Patentmodell 1846 | 3090 | gemeinfrei (PD-USGov) | ja, vorher Smithsonian-Rechte prüfen |
| `person-charles_darwin` | Barraud-Porträt um 1881, Zuschnitt ohne Karton | 1372 | gemeinfrei | ja |
| `person-jane_goodall` | Porträt Paris 2010 | 4256 | CC BY-SA 4.0 | ja |

Die drei Erfindungsfotos stammen aus `docs/entwurf/2026-11-21-bilder-zeitreise-erfindungen.md` (Karten 22 bis 24), hier neu geprüft; beim Seismografen ersetzt durch ein deutlicheres Foto.

## 1. 3D-Drucker (`invention-3d-printing`)

```json
{
  "karte": "invention-3d-printing",
  "foto_id": "prusa-i3-3d-printer",
  "commons_datei": "File:Prusa i3 - RepRap 3D printer printing.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Prusa_i3_-_RepRap_3D_printer_printing.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/6/6c/Prusa_i3_-_RepRap_3D_printer_printing.jpg",
  "original_breite": 2448,
  "original_hoehe": 3264,
  "author": "John Abella (Flickr jabella, Foto vom 14.07.2013)",
  "license": "CC BY 2.0",
  "license_url": "https://creativecommons.org/licenses/by/2.0/",
  "label": "Foto",
  "fit": "cover",
  "focus": "50% 55%",
  "caption": "Ein 3D-Drucker baut Schicht für Schicht eine Vase aus orangem Kunststoff.",
  "alt_de": "Ein 3D-Drucker druckt eine orange Vase. Von einem Knäuel läuft ein oranger Kunststofffaden zum Druckkopf. Die Vase steht auf der blauen Bauplatte."
}
```

- Passt: echter Drucker mitten im Druck (Faden, Druckkopf, Schichten, Bauplatte), scharf, nichts Verstörendes.
- Risiken: Schriftzug „PRUSA“ und kleiner Warnaufkleber am oberen Rahmen (Markenzeichen am Gerät, kein Wasserzeichen); `focus` 55 % lässt ihn im Querstreifen voraussichtlich weg, nicht gerendert, mit `--vorschau` prüfen, sonst Alternative. Das Bild zeigt das Fadenverfahren; die Unterschrift nennt nur „Faden“. Namensnennung nötig (Urheber, CC BY 2.0 mit Link, Quelle, Verkleinerung und Zuschnitt). FlickreviewR bestanden am 01.10.2019; Flickr-Seite nicht geöffnet.
- Alternative: `File:3D printing in action at -wimbledon.jpg` (CC BY 2.0, Mark Crawley, 3264×2448), quer, aber starker Filter und gut sichtbarer Schriftzug „Ultimaker“ (nur Trefferliste). Verworfen: `3D Printing.jpg` (Wasserzeichen „tarom“, Minion-Figur), `3D printing in progress.jpg` (nur Druckkopf, „Ultimaker“).

## 2. Seismograf (`invention-seismograph`)

```json
{
  "karte": "invention-seismograph",
  "foto_id": "seismograph-weston-observatory",
  "commons_datei": "File:Seismogram at Weston Observatory.JPG",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Seismogram_at_Weston_Observatory.JPG",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/e/eb/Seismogram_at_Weston_Observatory.JPG",
  "original_breite": 4032,
  "original_hoehe": 3024,
  "author": "Z22 (Commons-Nutzer, eigenes Werk, Foto vom 24.06.2014)",
  "license": "CC BY-SA 3.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/3.0/",
  "label": "Foto",
  "fit": "cover",
  "focus": "50% 45%",
  "caption": "Ein Seismograf schreibt auf einer Papierwalze auf, wie der Boden zittert (Weston Observatory, USA).",
  "alt_de": "Eine große Papierwalze dreht sich in einem Messgerät. Ein dünner Stift schreibt viele wellige Linien auf das Papier. Die Zickzack-Linien zeigen, wie der Boden gezittert hat."
}
```

- Passt: echter Seismograf beim Aufzeichnen; die Karte erklärt genau diese Aufzeichnung. Scharf, hell, ohne Menschen, Marken oder Text.
- Risiken: modernes Gerät, die Feder des Modells auf der Karte sieht man nicht (Unterschrift sagt nur „schreibt auf“). CC BY-SA 3.0: Namensnennung, „gleiche Bedingungen“ gilt für die Bilddatei samt Zuschnitt und WebP. Urheber nur Commons-Benutzername „Z22“ (üblich, ausreichend).
- Alternativen: `File:Seismogram on historical seismometer at Institute of Geophysis of the Czech Academy of Science (12).jpg` (6000×4000, CC BY-SA 4.0, Petr Brož, 2018, weniger eindeutig); `File:Historischer Seismograph.jpg` (Schriftzug, Tastatur, schlechter). Verworfen: `Seismometer at Lick Observatory.JPG` (Schild, Glasreflexe).

## 3. Nähmaschine (`invention-sewing-machine`)

```json
{
  "karte": "invention-sewing-machine",
  "foto_id": "howe-sewing-machine-1846",
  "commons_datei": "File:1846 - Elias Howe Jr.'s Sewing Machine Patent Model, from the National Museum of American History - NMAH-DOR2010-0923-000001.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:1846_-_Elias_Howe_Jr.%27s_Sewing_Machine_Patent_Model,_from_the_National_Museum_of_American_History_-_NMAH-DOR2010-0923-000001.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/2/26/1846_-_Elias_Howe_Jr.%27s_Sewing_Machine_Patent_Model%2C_from_the_National_Museum_of_American_History_-_NMAH-DOR2010-0923-000001.jpg",
  "original_breite": 3090,
  "original_hoehe": 4652,
  "author": "Smithsonian Institution, National Museum of American History (Fotograf nicht genannt)",
  "license": "Gemeinfrei (Commons-Baustein PD-USGov)",
  "license_url": "https://creativecommons.org/publicdomain/mark/1.0/",
  "label": "Foto",
  "fit": "cover",
  "focus": "50% 38%",
  "caption": "Ein Patentmodell von Elias Howes Nähmaschine, 1846. Es steht heute im Museum.",
  "alt_de": "Ein altes Modell einer Nähmaschine auf einem Holzsockel. Links sitzt ein großes Rad mit weißem Griff zum Drehen. Rechts oben sitzen Nadel und Fadenrolle."
}
```

- Passt: genau das Gerät der Karte (Howe, Patent vom 10.09.1846, Nr. 4750); Rad mit Kurbel, Nadel, Fadenrolle gut erkennbar; neutraler Hintergrund.
- Risiken: Gemeinfreiheit nur über den Commons-Baustein PD-USGov und die Quellenangabe Smithsonian; die Smithsonian-Seite (`si.edu/object/…nmah_630930`) war nicht zugänglich (403). **Vor dem Einbau dort die Rechte lesen** (üblich ist CC0 für Open-Access-Bilder). Hochformat 1:1,5, `focus` 38 % nicht gerendert (`--vorschau`). Kleine Ziffern am Sockel („P 4750“, „T 6050“). Unterschrift sagt „Patentmodell“.
- Alternative: keine zweite geprüft.

## 4. Charles Darwin (`person-charles_darwin`, heute 630×885)

```json
{
  "karte": "person-charles_darwin",
  "foto_id": "charles-darwin-barraud-1881",
  "commons_datei": "File:Charles Darwin by Barraud c1881-crop.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Charles_Darwin_by_Barraud_c1881-crop.jpg",
  "original_url": "(Adresse aus der API-Antwort holen: Commons-Seite der Datei)",
  "original_breite": 1372,
  "original_hoehe": 2124,
  "author": "Herbert Rose Barraud (1845–1896); Zuschnitt und Retusche durch Commons-Nutzer Scewing",
  "license": "Gemeinfrei (Commons-Baustein PD-old)",
  "license_url": "https://creativecommons.org/publicdomain/mark/1.0/",
  "label": "Foto",
  "fit": "cover",
  "focus": "50% 22%",
  "caption": "Charles Darwin auf einem Foto von Herbert Rose Barraud, um 1881.",
  "alt_de": "Charles Darwin als alter Mann mit sehr langem, weißem Bart und freundlich-ernstem Blick, auf einem braunen, alten Foto."
}
```

- Passt: dasselbe Barraud-Foto wie im Bestand, aber 1372 statt 630 px und ohne Kartonrand; Quelle Albumin-Kartenfoto aus Gallica (BnF), Wikitext verweist auch auf die National Portrait Gallery.
- Risiken: **retuschiert** („Cropped, removed artifacts, adjusted exposure“, Scewing); Nachweis und `transformations_de` müssen das nennen. Kategorie „Images from Gallica to be checked“ am Original; Foto um 1881, Barraud gestorben 1896, also gemeinfrei (PD-old); Risiko nur bei der Quellenprüfung. Hochformat, `focus` oben.
- Alternative: `File:Charles Darwin in 1881.jpg` (3000×2021, quer, Darwin mit Hut an efeubewachsener Säule), aber Quelle nur ThoughtCo, Urheber „Elliott & Fry“ schwach belegt (PD-old-auto). Nicht nehmen: `File:Charles Darwin by Barraud c1881.jpg` (Karton, Stempel). Ungeprüft: `Charles Darwin 1880.jpg`, `Darwin restored2.jpg` (stark restauriert).

## 5. Jane Goodall (`person-jane_goodall`, heute 617×898)

Das heutige Foto ist ein Ausschnitt aus einer Gruppenaufnahme des US-Außenministeriums (`Jane Goodall 2015.jpg`, auf Commons nur 617×898); größer gibt es es nicht. Darum ein neues Foto mit neuer ID.

```json
{
  "karte": "person-jane_goodall",
  "foto_id": "jane-goodall-2010",
  "commons_datei": "File:Jane Goodall 2010.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Jane_Goodall_2010.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/9/99/Jane_Goodall_2010.jpg",
  "original_breite": 4256,
  "original_hoehe": 2832,
  "author": "Nicolas Richoffer (eigenes Werk, Paris, 22.06.2010)",
  "license": "CC BY-SA 4.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/4.0/",
  "label": "Foto",
  "fit": "cover",
  "focus": "50% 40%",
  "caption": "Jane Goodall bei einem Besuch in Paris, 2010.",
  "alt_de": "Jane Goodall, eine ältere Frau mit grauen, zurückgebundenen Haaren, lächelt freundlich in die Kamera. Sie trägt einen blauen Rollkragen."
}
```

- Passt: großes, scharfes Porträt, freundlich, ruhiger Hintergrund, quer.
- Risiken: Foto von 2010 (nicht aus der Gombe-Zeit), Unterschrift sagt nur „Paris, 2010“. CC BY-SA 4.0, „eigenes Werk“ nicht gegengeprüft, Feld `permission` leer. Sehr enger Ausschnitt, am Rechner nur Gesicht ohne Kontext.
- Alternativen: `File:Jane Goodall HK.jpg` (1536×2048, CC BY 2.5, Hongkong 2007, mit Stoffäffchen „Mr. H“, kindgerecht, aber Hochformat und Datum widersprüchlich); `File:Johanna lohr jane-goodall.jpg` (3178×4649, CC BY-SA 4.0, Studioporträt, Wikitext nicht gelesen). Verworfen: TEDGlobal 2007 (930 px), US-Mission-Uganda 2022 (unter 1500 px, Gruppen).

## Hinweise für den Einbau

- `app/device-illustrations.json`: Einträge `invention-3d-printing`, `invention-seismograph`, `invention-sewing-machine` zeigen die KI-Bilder; beim Einbau prüfen, ob sie entfernt werden müssen, und `public/inventions/*-ai.webp` aufräumen (IDs bleiben).
- Darwin und Goodall: Die alten Fotos `charles-darwin` und `jane-goodall` bleiben im Nachweis (das Werkzeug legt sie in `tests/fixtures/ersetzte-fotos.json`).
- Prüfer: Bildinhalt und Unterschriften `fakten-pruefer` (Darwin Retusche, Howe-Datum, Weston „USA“), Wirkung bei 320 px `design-pruefer` (`focus` bei Howe, Prusa, Goodall).
- Nicht geprüft: Flickr-Seite (Prusa), Gallica-Seite (Barraud), Smithsonian-Objektseite, Originale in voller Größe.
