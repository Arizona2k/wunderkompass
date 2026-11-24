# Offene Bildfragen: Mandela, Blauwal, Wright Flyer, Meitner (24.11.2026)

Helfer: `bild-recherche` (Nachsuche nach dem Bilder-Strang). Der Helfer hat nichts geändert. **Noch nichts davon ist eingebaut.** Einbau im nächsten Chat mit `scripts/foto-einbau.mjs` (Vorschläge unten sind fast im Format des Werkzeugs; Felder `original_*`, `risiken`, `alternative` sind nur Notizen).

**Prüftiefe (ehrlich):** Lizenzbausteine und Quellen las der Helfer im Wikitext der Commons-Dateiseiten (API, `prop=revisions`). Bilder nur als 960-px-Vorschau angesehen, nicht in voller Größe. Flickr-Seiten, die Bibliotheksseite des Bildarchivs Austria und das Smithsonian-3D-Portal wurden nicht geöffnet. Die Commons-API bremste stark (429, teils über 10 Minuten); alle Anfragen einzeln mit dem User-Agent `WunderKompass-Bildeinbau/1.0 (https://wunderkompass.vercel.app)`.

## Empfehlung von Claude für den Einbau

| Karte | Vorschlag | Empfehlung |
|---|---|---|
| `animal-blue-whale` | NOAA-Luftbild `anim1754`, gemeinfrei, 2600 px | **Einbauen.** Klare Verbesserung gegenüber dem 800-px-Ersatz, Art und Herkunft belegt. |
| `invention-airplane` | Smithsonian-Foto des echten Flyers von 1903, CC0, 8451 px | **Einbauen.** Herkunft ausdrücklich belegt. Bildunterschrift: „Das echte Flugzeug von 1903 im Museum“. |
| `person-lise_meitner` | USIA-Foto 1953 (ÖNB), gemeinfrei, 2058 px | **Einbauen, vorher die Bibliotheksseite öffnen** (USIA-Einstufung gegenprüfen). Sie ist dort allein und im Bildzentrum (Befund „Meitner Retina“ aus der Design-Prüfung erledigt sich damit). |
| `person-nelson_mandela` | `Nelson Mandela 1994.jpg`, CC BY-SA 2.0, 1500 px | **Noch nicht.** Herkunft hängt allein an der Flickr-Angabe (mittleres Restrisiko); Paket 2 hatte das Bild deshalb abgelehnt. Sicherer: das gemeinfreie Clinton-Foto mit Zuschnitt auf Mandela (Fassung aus Paket 2). Vor einer Entscheidung die Flickr-Seite öffnen; `fakten-pruefer` oder zweite `bild-recherche` gegenlesen lassen. |

Die Fotos kommen nur mit `fakten-pruefer` (Bildinhalt, Bildunterschrift) und `design-pruefer` (Wirkung bei 320 px, Hochformat mit `focus` oben) auf die Seite.

## 1. Nelson Mandela (`person-nelson_mandela`)

Ein Einzelporträt ab 960 px mit sauberer Lizenz gibt es, aber die Herkunft ist nicht an der Quelle belegt.

```json
{
  "karte": "person-nelson_mandela",
  "foto_id": "nelson-mandela-1994",
  "commons_datei": "File:Nelson Mandela 1994.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Nelson_Mandela_1994.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/0/02/Nelson_Mandela_1994.jpg",
  "original_breite": 1500,
  "original_hoehe": 1940,
  "author": "John Mathew Smith, Kingkongphoto & www.celebrity-photos.com (Laurel, Maryland, USA); Credit-Zeile im Wikitext: © copyright John Mathew Smith 2001",
  "license": "CC BY-SA 2.0",
  "license_url": "https://creativecommons.org/licenses/by-sa/2.0/",
  "alt_de": "Nelson Mandela schaut freundlich in die Kamera. Er hat graue, kurze Haare und trägt einen dunklen Anzug mit Krawatte."
}
```

- **Risiken:** Quelle ist das Flickr-Konto kingkongphoto (`https://www.flickr.com/photos/kingkongphoto/5113183824/`). Aufnahme 4.10.1994 in Washington D.C. (Longworth-Gebäude), erste USA-Reise. Die Lizenz setzte der Flickr-Inhaber selbst; FlickreviewR bestätigte sie am 30.11.2018. Nicht belegt: ob der Flickr-Inhaber alle Rechte hatte (Flickr-Seite nicht geöffnet). Mittleres Restrisiko. CC BY-SA: Zuschnitt und WebP-Fassung als CC BY-SA 2.0 nennen (Urheber, Lizenz mit Link, Quelle, Hinweis auf Zuschnitt); gilt für die Bilddatei, nicht für die Seite. Bild scharf, Mandela allein, Hintergrund unscharf, keine Marken, kein Text. Hochformat: `focus` oben (Gesicht im oberen Drittel).
- **Alternativen:** Sicherste Wahl bleibt das gemeinfreie Clinton-Foto mit Zuschnitt (US-Regierungswerk, Fassung aus Paket 2). Geprüft und verworfen: Chatham-House-Foto (CC BY 2.0, 1122×1662; Mandela klein am Rednerpult, Zuschnitt nur etwa 500 px), `Defense.gov News Photo 000216-D-9880W-018.jpg` (gemeinfrei, Gruppe), `Visit of Nelson Mandela ... to the CEC.jpg` (CC BY 4.0, Delors im Bild), `Nelson Mandela-2008 (edit).jpg` (657 px, Menschen im Hintergrund), `Nelson Mandela in Haringey (June 1962).jpg` (PD-Begründung nur hergeleitet, 800 px), „Nelson Mandela, 2000 (x)“ (nur „No restrictions“, keine Lizenz), Europäisches Parlament 1990 (eigene Regel, keine CC-Lizenz), Agência Brasil 1998 (362 px). Kremlin.ru und GCIS nicht gefunden. Jahre 1994, 1995, 1999 und ab 2002 nicht vollständig durchgesehen (API-Bremse).

## 2. Blauwal (`animal-blue-whale`)

```json
{
  "karte": "animal-blue-whale",
  "foto_id": "blue-whale-aerial",
  "commons_datei": "File:Anim1754 - Flickr - NOAA Photo Library.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Anim1754_-_Flickr_-_NOAA_Photo_Library.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/1/1c/Anim1754_-_Flickr_-_NOAA_Photo_Library.jpg",
  "original_breite": 2600,
  "original_hoehe": 1800,
  "author": "NOAA Photo Library (US-Behörde NOAA, Flickr-Konto noaaphotolib)",
  "license": "Public domain (US-Regierungswerk, Commons-Baustein PD-USGov-NOAA)",
  "license_url": "https://creativecommons.org/publicdomain/mark/1.0/",
  "alt_de": "Ein riesiger Blauwal schwimmt im dunkelblauen Meer. Von oben sieht man seinen langen, schlanken Körper, die Schwanzflosse und eine Fontäne aus Wasserdampf."
}
```

- **Art geprüft:** Beschreibung „Balaenoptera musculus“, Commons-Kategorie „Balaenoptera musculus“, Quelle NOAA Photo Library (Flickr `noaaphotolib/5187320081`, Aufnahme 18.11.2010, FlickreviewR bestätigt). Ganzer Wal von oben mit Fluke und Blas.
- **Risiken:** Dunkles, kontrastarmes Luftbild, Tier diagonal. Im Querstreifen wird oben oder unten Meer abgeschnitten, der Wal liegt in der Mitte. Für Kinder gut erkennbar, nichts Verstörendes.
- **Alternativen:** `CINMS - Two Blue Whales Aerial Photo (27877575362).jpg` (gemeinfrei, 2700×1800, zwei Wale, heller), `CINMS - BlueWhales (30550423643).jpg` (gemeinfrei, 4928×3264, zwei Wale klein). Verworfen: `Bluewhale2 noaa.jpg` (nur Rücken frontal), `Bluewhale1 noaa crop.jpg` (wie das heutige Foto).

## 3. Wright Flyer (`invention-airplane`)

```json
{
  "karte": "invention-airplane",
  "foto_id": "wright-flyer-1903",
  "commons_datei": "File:NASM-NASM2022-00100A-000001 I 1903 Wright Flyer.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:NASM-NASM2022-00100A-000001_I_1903_Wright_Flyer.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/9/91/NASM-NASM2022-00100A-000001_I_1903_Wright_Flyer.jpg",
  "original_breite": 8451,
  "original_hoehe": 4532,
  "author": "Smithsonian 3D Digitization (Smithsonian photo by Jim Preston), National Air and Space Museum",
  "license": "CC0 1.0 (Commons-Baustein cc-zero)",
  "license_url": "https://creativecommons.org/publicdomain/zero/1.0/",
  "alt_de": "Das erste Flugzeug der Brüder Wright von 1903: zwei lange, helle Stoff-Flügel übereinander, dazwischen ein kleiner Motor und zwei Propeller, vor schwarzem Hintergrund."
}
```

- **Herkunft:** Commons-Beschreibung: „Photography for a condition report on the 1903 Wright Flyer A19610048000 in the Wright Brothers Gallery 209 … at the Smithsonian's National Air and Space Museum in Washington, DC, January 5, 2022. (Smithsonian photo by Jim Preston)“. Quelle 3d.si.edu.
- **Risiken:** Museumsfoto von 2022, kein historisches Foto von 1903 (Bildunterschrift entsprechend). Offen: ob der schwarze Hintergrund eine Studioaufnahme oder ein Ausschnitt aus der 3D-Digitalisierung ist (Beschreibung sagt „Photography“). Seitenverhältnis 1,86:1, passt zum Kartenkopf. Keine Menschen, kein Text, keine Marken.
- **Zur alten Frage (Highsmith-Foto):** sehr wahrscheinlich der Original-Flyer, aber nur indirekt belegt (Commons-Kategorie „Wright Flyer at the National Air and Space Museum“, LOC-Titel ohne Jahr). Gary-Todd-Fotos (CC0, 3888×2592) zeigen den Flyer echt, aber dunkel und mit Besuchern.

## 4. Lise Meitner (`person-lise_meitner`)

```json
{
  "karte": "person-lise_meitner",
  "foto_id": "lise-meitner-1953",
  "commons_datei": "File:Lise Meitner (1878–1968) 1953 OeNB USIS 2955727.jpg",
  "source_page_url": "https://commons.wikimedia.org/wiki/File:Lise_Meitner_(1878%E2%80%931968)_1953_OeNB_USIS_2955727.jpg",
  "original_url": "https://upload.wikimedia.org/wikipedia/commons/c/cd/Lise_Meitner_%281878%E2%80%931968%29_1953_OeNB_USIS_2955727.jpg",
  "original_breite": 2058,
  "original_hoehe": 2502,
  "author": "Fotograf im Auftrag der United States Information Agency (Pictorial Section, Information Services Branch); Archiv: Österreichische Nationalbibliothek, Bildarchiv Austria (Signatur US 11.031 C)",
  "license": "Gemeinfrei (US-Regierungswerk, Commons-Baustein PD-USGov-USIA)",
  "license_url": "https://creativecommons.org/publicdomain/mark/1.0/",
  "alt_de": "Lise Meitner, eine ältere Frau mit Mütze und dunklem Mantel, lacht freundlich in die Kamera und hält ihre Handschuhe in den Händen."
}
```

- **Risiken:** Aufnahme 1953 am Flughafen Wien (Meitner 74 Jahre). Quelle `https://www.bildarchivaustria.at/Pages/ImageDetail.aspx?p_iBildID=2955727` nicht geöffnet; Lizenz stützt sich auf die Commons-Einstufung „USIA-Auftragsfoto = Regierungswerk“. Geringes bis mittleres Restrisiko. Fotograf unbekannt, als „Fotograf im Auftrag der USIA“ nennen. Hochformat 1:1,2, `focus` oben. Rechts unten ein angeschnittener Blumenstrauß, harmlos. Schwarz-weiß, scharf.
- **Alternativen:** `Lise Meitner NatGeo.jpg` (Harris & Ewing, um 1960, nur „keine bekannten Einschränkungen“), `Lise Meitner signed.jpg` (1916, PD-old-70, Fotograf unbekannt, schwächere Kette), IAEA-Foto aus Paket 2 (CC BY-SA 2.0, Meitner nicht im Bildzentrum) als Rückfallebene.

## Nicht geprüft

- Flickr-Seiten (kingkongphoto, NOAA, Chatham House), Bildarchiv Austria, 3d.si.edu nicht geöffnet; gestützt auf Commons-Wikitext und FlickreviewR.
- Originaldateien nicht in voller Größe angesehen (keine Detailprüfung auf Schärfe oder Wasserzeichen am Rand).
- Kremlin.ru, GCIS, Bundesarchiv und Agência Brasil (außer der 362-px-Datei) nicht eigens durchsucht.
