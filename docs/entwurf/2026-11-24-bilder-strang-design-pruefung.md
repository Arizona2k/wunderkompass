# Design-Prüfung der neuen Kartenbilder (Bilder-Strang, 24.11.2026)

Helfer: `design-pruefer` (sonnet / high). Geprüft: Bündel 3 bei 390 und 1440 px vollständig; dazu 320, 768
und 1280 px für Ibn al-Haytham, Mary Anning, Murasaki, Meitner, Fahrrad und Ibn Sina; Stichprobe früherer
Bündel (Orca, Schnabeltier, Okapi, Erdmännchen, Walross, Seepferdchen, Einstein, Gutenberg, Eiffelturm).
Chromium, Gerätefaktor 1, gegen den fertigen Build. Der Helfer hat nichts geändert.

**Blockierend:** keine.

## Wichtig
1. **Kennwort-Schild liegt über dem Bild** (Gutenberg, Ibn al-Haytham, Murasaki; Anning und Merian berühren
   die Kante). Die Pille sitzt bei `top:10px; left:10px`; schmale Hochformate mit `contain` beginnen nur 14 px
   unter dem Rand, die Pille ragt 40 bis 70 px ins Bild (Mütze, Kopf). Vorschlag: mehr Abstand oben bei
   `.media-contain` oder Pille aus dem Bild nehmen.
2. **768 px: Hochformat-Personen zu klein** (Ibn al-Haytham nur 176 × 232 px; Anning, Merian, Lehmann, Tagore;
   auch Meitner quer). Die Bildhöhe springt erst ab 900 px auf 360 px. Vorschlag: 360 px schon ab etwa 600 px.

## Kleinigkeiten
3. **Ibn Sina (cover):** dunkelgrüne Streifen links und rechts (Rand des Originalfotos). Vorschlag: im Original
   beschneiden (`object-position` hilft bei `cover` nicht).
4. **Fahrrad:** bei 320 und 390 px Pedale rechts angeschnitten; Kettenblatt und Kette (Thema der Bildunterschrift)
   ganz sichtbar. Unkritisch.
5. **Nachweis-Fachwörter in der Zeile unter dem Bild:** „Public Domain (PD-old-100 / PD-Art)“ (Murasaki),
   „(PD-Denmark50)“ (Lehmann), „(PD-old-100-1923)“ (Tagore). Vorschlag: in der Zeile nur „Public Domain“,
   die Einzelheiten im Block „Bildquelle & Bearbeitung“. Murasakis Zeile bricht bei 320 px auf drei Zeilen.
6. **Tippflächen:** Lizenz-Links in der Bildunterschrift 38 px hoch, „Original und Rechte“ 144 × 38 px
   (unter 44 px). „Bildquelle & Bearbeitung“ 48 px, in Ordnung.
7. **Kleiner Sprung beim Laden, nicht vom Bild:** Bildrahmen steht von Anfang an (kein grauer Platzhalter).
   Verschiebungen nach etwa 330 ms kommen von `wissenskarte-kopftext`, `rate-mal`, `learning-tabs`
   (Handy, Layout-Shift-Wert 0,10).
8. **Texte zu schwer (kein Bildthema):** Entdecker-Fragen bei Ibn Sina („Die lateinische Winchester-Handschrift
   wird ins 15. Jahrhundert datiert. Was bezeichnet diese Angabe?“), Octavia Butler („Welche Aussage ist durch
   diese Information gedeckt?“), Tagore, Murasaki. An `stufen-pruefer` und `kinder-redaktion`.

## Geprüft und gut (erhalten)
- Gesichter und Gegenstände in Bündel 3 überall ganz sichtbar (Meitner mit Hut gut erkennbar; Kompass mit Ring;
  Feuerwerkzeug vollständig, die Unterschrift erklärt es; Murasaki klein im breiten Rollbild, noch in Ordnung).
- Fester Bildrahmen in Weltfarbe, kein grauer Platzhalter, kein Sprung; `contain` bei Porträts und alten Drucken,
  `cover` bei Kompass, Fahrrad, Tieren.
- Ibn al-Haytham scharf (Datei 640 × 846, Anzeige höchstens 252 × 332); Meitner auf Retina leicht weich (Kleinigkeit).
- Bildunterschrift 16 px, Nachweis 15 px, Kontrast etwa 6:1; Kennwort-Pille guter Kontrast; kein waagerechtes Scrollen.
- Kennwörter „Gemälde“, „Spätere Darstellung“ klar und ehrlich.

## Nicht geprüft
Merian, Lehmann, Butler, Tagore bei 320, 768, 1280 px; echte Geräte und Retina; Tastatur, „Bewegung reduzieren“,
Bildschirmleser; Kacheln auf Listen- und Startseiten; Firefox, WebKit; Lizenzurteile; Tablet quer.

## Umsetzung (Claude, 24.11.2026)
- 1: Steht ein Kennwort auf dem Kartenbild, beginnt ein `contain`-Bild 46 px unter dem Rand (`app/kern/karte/karte.css`).
- 2: Bildhöhe 360 px schon ab 600 px Breite.
- 3 bis 8: ins BACKLOG (Punkt 26 und 27). 5 berührt die Browser-Tests, die den Lizenztext wörtlich suchen.
