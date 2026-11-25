# Stilproben für das neue Design (25.11.2026)

Entwurf, noch nicht freigegeben. Wunsch des Nutzers: „schön modern stylish“, „beim Design sei kreativ“.
Zwei Richtungen (A, B), gezeigt an drei Seiten (Start, Wissenskarte, Spiel), je auf Handy und Rechner; nach den Prüfungen dazu die Mischung C.
Es sind **statische Muster** mit echten Inhalten und Fotos der Seite, keine fertige App: Nichts ist anklickbar, es gibt keinen Pass und keine Logik.

## Ansehen und neu bauen

- Seiten: `docs/entwurf/2026-11-25-stilproben/index.html` (lokal im Browser öffnen), dazu `a-start.html`, `a-karte.html`, `a-spiel.html`, dieselben mit `b-` und `c-`, dazu `c-spiel-falsch.html`.
- Neu bauen: `node docs/entwurf/2026-11-25-stilproben/bauen.mjs` (schreibt die HTML-Seiten aus `a.css`, `b.css`, `c.css`, `icons.json` und den echten Daten aus `app/world-photos.json`).
- Aufnahmen: `node docs/entwurf/2026-11-25-stilproben/aufnahmen.mjs 1 320,390,768,1280,1440` und `… aufnahmen.mjs 2` (2-fach für Vergleichsbilder), dann `node docs/entwurf/2026-11-25-stilproben/vergleich.mjs` (Vergleich A neben B und Übersichten von C). Einzelne Seiten: `NUR=c-start,c-spiel node … aufnahmen.mjs …`. Alles landet in `.qa-output/stilproben/` (nicht in Git). Das Aufnahme-Skript meldet, wenn eine Seite breiter als der Bildschirm ist (Stand jetzt: keine).
- Schriften liegen mit Lizenz in `schriften/` (alle SIL Open Font License), Symbole aus Lucide (ISC-Lizenz) in `icons.json`. Kein neues Paket, nichts Bezahltes.

## Gemeinsame Grundlage beider Proben

- Gleicher Inhalt: Startseite mit Tagesfrage (Kaiserpinguine), Route und sechs Welten, Wissenskarte „Afrikanischer Savannenelefant“ mit „Kurz erklärt“, „Rate mal!“, „Stimmt das?“, Steckbrief und „Dazu passt“, Spiel „Kreuz und quer“ (Mond-Frage, Stufe Entdecker, drei Antworten), dazu eine Karte ohne Foto als Beispiel.
- Fließtext in **Andika** (vom SIL für Leseanfänger gemacht: eindeutiges a, l, I, 1).
- Keine automatische Silbentrennung (`hyphens: manual`), nur ein weiches Trennzeichen in langen Wörtern wie „Kaiser­pinguine“. Leseanfänger stolpern sonst über „sei-nem“.
- Tippflächen mindestens 48 px, sichtbarer Fokus, `prefers-reduced-motion` wird beachtet.
- Keine Großbuchstaben-Etiketten, keine Schreibmaschinen-Schrift, keine Pfeile an Knöpfen.
- Weltfarben nur als helle Tönung mit dunkler Schrift oder hinter weißen Symbolen (Kontrast).
- Bildnachweise wie auf der echten Seite unter jedem Foto.
- Getestet in 320, 390, 768, 1280 und 1440 px.

## A „Kartenwerk“

**Idee:** WunderKompass als Entdecker-Atlas. Die Marke steckt im Namen: Kompass, Karten, Routen, Stecknadeln, der Globus.

- Farben: Papier `#EDF1EA` (helles Grüngrau), Fläche Weiß, Tinte `#15314A` (Nachtblau), Wasser `#1F6FA8`, Kompassnadel `#D93A2B` (Rot, nur als Markierung), Wald `#2E7A55`.
- Weltfarben gedämpft wie auf einer Landkarte: Tiere Grün, Zeit Braun, Köpfe Violett, Erfindungen Ocker, Bauwerke Schiefer, Wissen Blau.
- Schrift: Überschriften in **Bricolage Grotesque** (kräftig, etwas eigenwillig), Text in Andika.
- Der eine besondere Moment: eine **Kompassrose** an der Ecke des Fotos. Ihre Nadel zeigt auf die Stecknadel des Fundorts und pendelt beim Öffnen einmal ein (ohne Bewegung, wenn das Gerät „weniger Bewegung“ will).
- Höhenlinien im Kopf der Startseite, die Lernroute als gestrichelter Weg mit Haltepunkten, die rote Nadelspitze markiert den aktiven Menüpunkt und den aktuellen Schritt.
- Stärken: eigenständig und unverwechselbar, passt zum Namen und zum Globus; ruhig, gut lesbar, wirkt für 10- bis 14-Jährige nicht kindisch.
- Schwächen: für 5-Jährige etwas ernst; die Freude muss aus Fotos, Rose und Rückmeldungen kommen. Die Rose braucht je Bildausschnitt einen guten Platz (auf dem Handy saß sie zuerst auf dem Pinguinschnabel, jetzt kleiner und höher).

## B „Sammelheft“

**Idee:** Ein Forscher-Heft zum Sammeln: Karopapier, Aufkleber, Stempel.

- Farben: Heft `#F7FAFF` mit blauem 24-px-Karo, Tinte `#1B2550`, Orange `#FF7A1A` als Markenfarbe und Hauptknopf, Richtig-Grün `#1F9D55`.
- Weltfarben kräftig und bunt: Grün, Gelb, Pink, Violett, Rot, Blau.
- Schrift: Überschriften in **Grandstander** (rund, verspielt), Text in Andika.
- Der besondere Moment: der **„Richtig!“-Stempel**, der auf die richtige Antwort gedrückt wird (für Bildschirmleser steht dort zusätzlich unsichtbar „Richtig!“).
- Fotos als leicht schräge Aufkleber, Welten als bunte Kacheln mit rundem Foto-Sticker und weißem Etikett, dicke Knöpfe mit dunklem Rand und Schatten.
- Stärken: sofort fröhlich, die Kleinen fühlen sich angesprochen; Sammeln passt zum Entdeckerpass.
- Schwächen: Grandstanders „u“ sieht spitz wie ein „v“ aus („Natvr“): für Leseanfänger ein echtes Risiko; Ausweg wäre Andika fett auch für Überschriften. Der Stil liegt nah am Trend „Neo-Brutalismus“ (dicke Ränder, harte Schatten) und kann schnell austauschbar wirken. Für 12- bis 14-Jährige eher zu kindlich.

## Kritischer Blick (eigene Prüfung, noch keine Helferprüfung)

- Beide Proben vermeiden die üblichen Muster generierter Seiten (cremefarbener Grund mit Serifen und Terrakotta, schwarzer Grund mit Neongrün, gleiche Karten mit grauem Schatten, Großbuchstaben-Etiketten, Pfeile an Knöpfen).
- B ist dem Neo-Brutalismus näher als A irgendeinem Trend.
- Ausgegraute Antworten nach dem Antworten haben wenig Kontrast; das ist für „schon beantwortet“ üblich, wird aber vom `design-pruefer` noch bewertet.
- Offen: Wie wirken beide in Bewegung (Kartenwechsel, Antwort tippen)? Das zeigen statische Muster nicht.

## Ergebnis der Prüfungen (25.11.2026)

- Berichte: [Design-Prüfung](2026-11-25-stilproben-designpruefung.md) (`design-pruefer`), [Spieltest](2026-11-25-stilproben-spieltest.md) (`spieltester`, kein Kindertest).
- Beide stützen A als Grundlage mit Welt-Kacheln und Stempel aus B. Der Spieltest sieht B für eine Sechsjährige vorn (Foto-Kacheln, dicke Knöpfe), A für einen Zehnjährigen (Route, ruhig, nicht kindisch).
- Sofort behoben in A und B: Kompassrose auf dem Rechner beschnitten (A), Symbol über dem Text der Wissenskarten-Kachel (B).
- Richtige Korrektur an meiner Empfehlung: `VISION.md` verlangt Akzente in **Orange und Petrol**; A hatte keines von beiden, mein Vorschlag „Hauptknopf Tinte“ widersprach dem.
- Grandstander fällt weg (u wie v, im Bild bestätigt).

## C „Kompass“ (Mischung, gebaut nach den Prüfungen)

Seiten `c-start.html`, `c-karte.html`, `c-spiel.html` (richtig) und `c-spiel-falsch.html` (noch nicht richtig, Verhalten wie in der App: weiterprobieren, „Nächste Aufgabe“ erst nach der richtigen Antwort, Wortlaut aus `app/kern/woerter.ts`).

- Grundlage A: Kartenpapier, Höhenlinien, Route, Kompassrose, Bricolage für Überschriften (Zeichenabstand jetzt −0,01 em statt −0,03 em, damit I und l nicht verschwimmen), Andika für Text.
- Farben nach `VISION.md`: **Petrol** `#0B6B73` für Hauptknopf, Wege, Links und Fokus (6,2:1 auf Weiß); **Orange** `#D9650A` nur als Grafik: Kompassnadel, aktueller Schritt, aktiver Menüpunkt (3,6:1). Rot `#B5462F` nur für „noch nicht richtig“, mit hellem Grund und Kreuz, nicht beschämend.
- Welt-Kacheln aus B, in der Sprache von A: Foto oben, Weltfarbe als helle Tönung, Symbol an der Bildkante, feine Ränder ohne harte Schatten. Weltfarben etwas kräftiger als in A. „Wissenschaft & Weltall“ hat noch kein freies Foto (auch in der App nicht): bis dahin ein gezeichnetes Mondphasen-Bild.
- Lichtschimmer beim Zeigen oder Antippen einer Welt-Kachel (`VISION.md`, „Glanz“); bei „Bewegung reduzieren“ aus.
- Stempel aus B, neu gedacht: fester Platz neben der grünen Rückmeldung, nie über Antworttext, deckend, Häkchen und „Gelöst!“ (die Zeile „Richtig!“ bleibt als Text daneben). Drückt sich einmal auf, bei „Bewegung reduzieren“ nicht.
- Korrekturen der Prüfer: Ränder von Bedienelementen 3,6:1 (`--rand`), schon beantwortete Antworten in fester Farbe mit gestricheltem Rand statt halb durchsichtig, alle Tippflächen mindestens 48 px (auch Textlinks, Logo, Pfad, Menü), „Andere Frage“ als Knopf, Fokus mit weißem Innenring, „Stufe Entdecker“ als schlichte Anzeige statt knopfartig, Fortschritt mit Häkchen und einer orangen Raute statt rotem Warndreieck, aktiver Menüpunkt unten mit Petrol-Hinterlegung, „Vorlesen“ auch an der Spielfrage, Stand „14 von 204 Karten entdeckt“ über der Route (Zahl im Muster ausgedacht), Bühne auf dem Tablet zweispaltig.
- Spiel auf dem Rechner wieder auf einem Bildschirm (gemessen bei 1280 × 800).

## Zu entscheiden

1. C „Kompass“ als Richtung für das neue Design? (Alternativen: A oder B pur.)
2. Ist der Stempel mit „Gelöst!“ der richtige Belohnungsmoment, oder soll er erst am Spielende kommen (in der App heißt der Abschluss schon „Spielstempel sammeln“)?

## Empfehlung

**C „Kompass“.** Sie nimmt die Stärke von A (eigenständig, ruhig, trägt bis 14), holt die Freude aus B (Foto-Kacheln, Stempel) und behebt alle Muss-Punkte der Design-Prüfung. Offen bleiben Dinge, die statische Muster nicht zeigen: Bewegung, Ton, echtes Antippen, echte Kinder.

## Danach

Nach der Wahl: Design-Entwurf für den Umbau in Schritten (zuerst Farben, Schriften und Bausteine im Kern `app/kern/`, dann Start, Karte, Spiele), jeder Schritt mit Vorschau und Freigabe. Vorher `design-pruefer` und `spieltester` noch einmal über C.
