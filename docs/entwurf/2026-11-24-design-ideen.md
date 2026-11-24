# Ideen für ein modernes, einheitliches Design (24.11.2026)

Helfer: `ideen-scout`, Auftrag nach der Frage des Nutzers „schön modern stylish“. Grundlage für die zwei Stilproben (Design-Schritt, BACKLOG). Bericht unverändert; Bewertung durch Claude folgt mit dem Design-Entwurf.

## Ideen-Scout: Design-Richtungen für WunderKompass (24.11.2026)

**Ehrliche Vorbemerkung zur Quellenlage.**
- Ich habe `VISION.md` und Phase-1-Entwurf 6.1 bis 6.4 gelesen.
- Mein Werkzeug liefert nur Text und Struktur der Seiten, keine gerenderten Bilder, Farben oder Schriften.
- Gesichert aus dem Seitenaufbau:
  - Planet Schule: gleiche Kartenform (Bild oben, fetter Titel, kurze Zeile) und zwei feste Bildformate, 1:1 für Fächer und 16:9 für Spiele und Videos.
  - Sendung mit der Maus: einheitliche Vorschaubilder gleicher Größe und eine große Bildkachel vor kleineren.
  - NatGeo Kids: Karten mit Bild, kleiner Kategorie-Marke und fettem Titel; dazu reine Textlisten für Nebensächliches.
  - Toca Boca: sehr große, zerschnittene Überschriften und Figuren-Illustration.
  - Khan Academy Kids und das Naturkundemuseum London lieferten nichts (Fehler und 404).
- Alle Aussagen zu Farben, Rundungen und Bewegung unten sind meine Einschätzung aus Kenntnis der Angebote, nicht frisch geprüft. Vor einer Entscheidung sollten der Nutzer oder `design-pruefer` die Seiten im Browser ansehen.

### A. Angebote, was davon übertragbar ist

| Angebot | Modern und einheitlich durch | Passt zu uns | Passt nicht |
|---|---|---|---|
| Planet Schule, https://www.planet-schule.de/ | Immer gleiche Karte, feste Formate 1:1 und 16:9, klare Überschriftenfolge | Ja: ein Format je Baustein ist genau Regel 1 | Nüchtern, Filter-Panel ist für Lehrer gebaut |
| Sendung mit der Maus, https://www.wdrmaus.de/ | Gleich große Vorschaubilder, große Aufmacher-Kachel, Figuren als Wiedererkennung | Ja: eine große Kachel vor kleinen; Wiedererkennung durch das Kompasszeichen | Viele Menüebenen; eigene Figuren dürfen wir nicht nachbauen |
| NatGeo Kids, https://kids.nationalgeographic.com/ | Foto-Karten mit Kategorie-Marke, Spiele und Videos als Aufmacher | Ja: Marke auf der Kachel (z. B. „Tier“) hilft Lesern, die noch nicht lesen | Werbeflächen und gelber Rahmen wirken unruhig; dichte Listen |
| Toca Boca, https://tocaboca.com/ | Riesige Schrift, bunte Flächen, Figuren | Nur der Mut zu großen, kurzen Überschriften | Für Spiel-Welten, nicht für echte Fotos; Werbeabzeichen („10 % off“) meiden |
| Duolingo / ABC, https://www.duolingo.com/ | Aus Kenntnis: eine Hauptfarbe, dicke runde Knöpfe mit „Kante“ unten, ruhige Rückmeldung | Knopfform (dick, gut tippbar) | Streaks, Punkte, Jubel: unsere Vision verbietet das |
| Khan Academy Kids, https://learn.khanacademy.org/khan-academy-kids/ | Aus Kenntnis: Figuren und weiche Flächen, große Symbole als Navigation | Große Symbole für Leseanfänger | Figur als Führung; ist im BACKLOG zurückgestellt |
| Naturkundemuseen (z. B. https://www.nhm.ac.uk/, https://www.si.edu/kids) | Aus Kenntnis: Foto zuerst, viel Weiß, Objektfotos freigestellt oder randvoll | Ja: unser Kern, Inhalt trägt die Farbe | Oft für Erwachsene geschrieben, kleine Schrift |
| Apple- und Produktseiten (in der VISION genannt) | Viel Raum, ein Bild je Aussage, ruhige Typo | Abstand, Ruhe | Zu kühl und zu erwachsen, wenn man sie pur übernimmt |

### B. Zwei Stilrichtungen für die Stilproben

Beide bleiben bei Nunito, hellem Grund, Petrol und Orange, ohne Dunkelmodus und mit Tippflächen ab 48 px. Sie unterscheiden sich in der Form und in der Frage, wer „spricht“: das Foto oder die Fläche.

**Stil 1: „Museumsfoto“** (ruhig, bildstark, erwachsenentauglich)
- **Farben als Rolle:** warmes Weiß (`#FAF8F3`) fast überall. Petrol nur für Links, Fokus und Auswahl. Orange nur für den einen Hauptknopf je Bildschirm. Weltfarben nur als dünner Streifen oder Marke, nicht als Fläche.
- **Bilder:** Foto randvoll, Ecken 16 px, kein Rahmen und kein Schatten. Die Bildunterschrift steht darunter, klein und grau.
- **Kacheln:** Bild oben (4:3), Titel darunter auf Weiß, Kante nur durch einen sehr weichen Schatten.
- **Knöpfe:** flache, volle Pillenform. Antwortknöpfe weiß mit 2-px-Rand in Petrol; nach der Auswahl wird die Fläche gefüllt.
- **Überschriften:** Nunito 800, groß, linksbündig, Frage als Überschrift. Wenig Farbe in der Schrift.
- **Hintergrund:** einfarbig, keine Muster.
- **Bewegung:** nur der vorgesehene Glanz-Schimmer und ein sanftes Einblenden. Sonst ruhig.
- **Vorbilder:** Naturkundemuseen, Apple-/Google-Store-Produktseiten (in VISION genannt), Planet Schule für die Kartenordnung.
- **Stärke:** Echte Fotos sehen wertig aus, auch wenn sie unterschiedlich gut sind. Das passt zu unserer Wissensseite.
- **Schwäche:** Es wirkt auf Fünfjährige weniger „spielerisch“. Leseanfänger brauchen mehr Symbole.

**Stil 2: „Bunte Kacheln“** (spielerisch, farbstark, kinderfreundlicher)
- **Farben als Rolle:** Jede Welt hat eine kräftige Farbfläche (Tiere grün, Weltall tiefblau, Erfindungen gelb und so weiter) als Kachel- und Titelband. Petrol bleibt die Marke. Orange bleibt der Hauptknopf.
- **Bilder:** Foto im Rahmen auf der Weltfarbe, Ecken 24 px, 4 px Weißrand, leichter „Aufkleber“-Schatten. Das macht auch schwächere Fotos einheitlich.
- **Kacheln:** Farbfläche mit großem Weltsymbol (eigener Code) und das Foto als Rundung darauf. Die Kachel ist knapp 1:1 und hat dicke Rundungen.
- **Knöpfe:** dick, 3D-Kante unten (zwei Töne), gedrückt sinkt die Kante ab (wie bei Duolingo als Prinzip, Form selbst gebaut).
- **Überschriften:** Nunito 850, sehr groß und kurz, in Weltfarbe oder Weiß auf Farbband; wenige Wörter pro Zeile.
- **Hintergrund:** warmes Weiß; je Welt eine zarte Tönung; hinter Kopfbereichen große, weiche Formen (Wellen, Kreise) in Weltfarbe, per CSS/SVG.
- **Bewegung:** Schimmer plus kleines „Hüpfen“ der Kachel beim Antippen (150 ms), sanftes Wackeln nach richtiger Antwort. Alles aus bei „Bewegung reduzieren“.
- **Vorbilder:** Toca Boca (Mut zu großer Schrift und Farbe), Sendung mit der Maus (Wiedererkennung), Duolingo (Knopfform), NatGeo Kids (Kategorie-Marke).
- **Stärke:** Kinder erkennen Welten und Bereiche an der Farbe, auch ohne zu lesen. Einheitlich auch bei ungleichen Fotos.
- **Schwäche:** Kann schnell bunt und unruhig wirken. Es braucht strenge Disziplin: je Bildschirm eine Weltfarbe und höchstens zwei Farben insgesamt.

**Empfehlung:** Stil 1 als Grundgerüst, aus Stil 2 nur die Weltfarbe als Wiedererkennung und die dicke Knopfform übernehmen. Auf den Stilproben sollten die Unterschiede groß und eindeutig sein, damit der Nutzer wirklich wählt.

### C. Die 10 wichtigsten Regeln für Einheitlichkeit

1. **Ein Seitenverhältnis je Baustein, nie gemischt.**
   - Kachel: 4:3.
   - Kartenaufmacher: 16:9 (Handy darf 3:2).
   - Liste und „Dazu passt“: 1:1 oder 4:3, aber überall gleich.
   - Sammlung und Spiele-Vorschau: 1:1.
   - Maße stehen im CSS (`aspect-ratio`), nicht im Bild. So gibt es keine Sprünge und keinen CLS.
2. **Gleicher Ausschnitt-Grundsatz:** `object-fit: cover` mit gespeichertem Blickpunkt je Foto (`object-position`, z. B. Auge oder Gesicht). Köpfe und Tiere werden nie abgeschnitten. Der Punkt steht in `world-photos.json`.
3. **Ein Rahmen für alle Bilder:** gleiche Eckenrundung je Größenklasse (klein 12 px, mittel 16 px, groß 24 px). Gleicher Schatten, nie ein Mix aus Rand, Schatten und randlos.
4. **Eine Bildqualität und ein Format:** WebP in 320/640/960 px, mit `srcset`. Keine Bilder unter 640 px Breite als Aufmacher. Ein Foto, das nicht reicht, wird ersetzt oder kommt nur klein vor.
5. **Fotos und Zeichnungen werden nie in derselben Reihe gemischt, ohne Kennwort.** Die Marke („Foto“, „Zeichnung“, „KI-Bild“, „Rekonstruktion“) sitzt immer an derselben Stelle (unten links auf dem Bild), gleiche Größe und Schrift.
6. **Ersatzbild ist gestaltet, nie grau:** Die Motivkachel (Weltfarbe, großes Symbol) hat dasselbe Format und dieselben Rundungen wie ein Foto. Man erkennt den Unterschied, aber es wirkt absichtlich.
7. **Ein Satz Knöpfe für alles:** Hauptknopf (Orange, eine Stelle je Bildschirm), Zweitknopf (Rand Petrol), Textknopf. Gleiche Höhe (min. 48 px), gleiche Rundung in Karten, Spielen, Laboren, Reisen, Globus und Pass.
8. **Eine Abstands-Skala** (z. B. 4/8/12/16/24/32/48) als CSS-Variablen. Keine freien Zahlen. Gleiche Seitenränder (16 px Handy, 24 px Tablet) und gleiche Abstände zwischen Kacheln.
9. **Eine Typo-Stufen-Leiter** (z. B. 14/18/22/28/36), Überschriften immer Nunito 800, Text 500, nie freie Größen in einzelnen Bereichen. Fragen sind Überschriften.
10. **Ein Farb-Vertrag:** Jede Farbe hat genau eine Rolle (Text, Fläche, Link/Fokus, Hauptknopf, Weltfarbe). Neue Bereiche (Globus, Pass, Labore) nutzen dieselben Variablen und bringen keine eigene Palette mit. Die Weltfarbe zieht sich über Kachel, Kartenkopf, „Dazu passt“ und Sammlung durch, damit Verbindungen sichtbar sind (Ziel 6).

**Weitere Anregungen:**
- Icons aus einem einzigen Satz (ein Strichstärke, ein Stil), selbst gezeichnet als SVG oder aus einer frei lizenzierten Sammlung mit Nachweis.
- Ein „Bilder-Test-Blatt“ (eine Seite mit je 10 Fotos in jedem Baustein) bei 320/390/768/1280, bevor Stile gewählt werden. So sieht man sofort, ob schlechte Fotos auffallen.

### D. Was man vermeiden sollte

- **Mehr als zwei bis drei Farben je Bildschirm** und Verläufe in Regenbogenfarben (wirkt wie Werbung für Süßigkeiten).
- **Punkte, Sterne, Flammen, Zähler, „Dir fehlen noch 3!“, Dauerjubel, Konfetti** (verboten durch VISION; wirkt wie ein Glücksspiel).
- **Schimmer auf allem, Dauer-Animationen, hüpfende Figuren, automatisch laufende Karussells.** Der Schimmer läuft einmal und nur auf der angetippten Kachel.
- **Gemischte Bildstile:** Foto neben Cartoon neben KI-Bild in einer Reihe; verschiedene Rahmen, Rundungen und Schatten.
- **Schlagschatten mit harter Kante, Glaseffekt (Blur) über Text, Neon, Schriften mit Konturen.** Das wirkt billig und kostet auf alten Handys Leistung.
- **Werbe-Optik:** Abzeichen („NEU!“, „Top“), blinkende Knöpfe, große Banner, Pop-ups, Kategorie-Marken in Signalfarben.
- **Zu kleine Schrift als Lösung** und Text über Fotos ohne ruhigen Grund (Foto bleibt Foto, Text darunter oder auf eigener Fläche).
- **Zu viele Kästen mit Rand statt Weißraum und Trennlinien** (steht schon in VISION).
- **Fremde Schriften, Icon-Fonts oder Bilder ohne freie Lizenz** und alles, was Cloud-Dienste lädt (Google Fonts live, CDN): offline und kostenlos heißt alles lokal.
- **Nachbau fremder Figuren oder Spiele-Looks** (Maus, Duolingo-Eule, Toca-Figuren): nur Prinzipien.

### E. Was an der Grundlage altbacken wirken könnte

- **Warmes Weiß + Petrol + Orange** ist sicher, aber auch sehr „freundlich-neutral“. Es wirkt erst „stylish“ durch Mut bei Größe (Überschriften, Bilder) und durch eine klare Weltfarbe, nicht durch eine weitere Grundfarbe.
- **„Glanz-Schimmer“** ist ein Stil von ca. 2010 und kann schnell billig wirken. Er sollte klein, einmalig und ausschaltbar bleiben; bei Stil 1 ruhig ganz weglassen und stattdessen leichtes Anheben der Kachel beim Antippen.
- **Weiche Schatten überall** wirken heute eher beliebig. Entweder konsequent (Stil 1: ein Schatten) oder durch Rand/Kante ersetzen (Stil 2).
- **Tippfläche 48 px und Rundung 16–24 px** sind richtig. Für Fünfjährige sind die wichtigsten Knöpfe eher 56–64 px.
- **Sechs gleiche Navigations-Symbole in der unteren Leiste** werden schnell grau. Mit Weltfarbe je Bereich oder mit einem kräftigeren aktiven Zustand wirkt es einheitlicher und lesbarer.

Geänderte Dateien: keine. Alles ist als Antwort geliefert.
