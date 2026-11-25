# Stilproben für das neue Design (25.11.2026)

Entwurf, noch nicht freigegeben. Wunsch des Nutzers: „schön modern stylish“, „beim Design sei kreativ“.
Zwei Richtungen, gezeigt an drei Seiten (Start, Wissenskarte, Spiel), je auf Handy und Rechner.
Es sind **statische Muster** mit echten Inhalten und Fotos der Seite, keine fertige App: Nichts ist anklickbar, es gibt keinen Pass und keine Logik.

## Ansehen und neu bauen

- Seiten: `docs/entwurf/2026-11-25-stilproben/index.html` (lokal im Browser öffnen), dazu `a-start.html`, `a-karte.html`, `a-spiel.html` und dieselben mit `b-`.
- Neu bauen: `node docs/entwurf/2026-11-25-stilproben/bauen.mjs` (schreibt die HTML-Seiten aus `a.css`, `b.css`, `icons.json` und den echten Daten aus `app/world-photos.json`).
- Aufnahmen: `node docs/entwurf/2026-11-25-stilproben/aufnahmen.mjs 1 320,390,768,1280,1440` und `… aufnahmen.mjs 2` (2-fach für Vergleichsbilder), dann `node docs/entwurf/2026-11-25-stilproben/vergleich.mjs`. Alles landet in `.qa-output/stilproben/` (nicht in Git). Das Aufnahme-Skript meldet, wenn eine Seite breiter als der Bildschirm ist (Stand jetzt: keine).
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

## Zu entscheiden

1. A, B oder eine Mischung?
2. Überschriftenschrift: Bricolage (A), Grandstander (B, mit „u“-Risiko) oder Andika fett überall?
3. Hauptknopf: dunkle Tinte (A) oder Orange als Markenfarbe (B)?

## Empfehlung (vorläufig, bis `design-pruefer` und `spieltester` berichtet haben)

**A „Kartenwerk“ als Grundlage**, weil es aus dem Namen WunderKompass und dem Globus kommt und für alle Altersstufen trägt.
Aus B dazunehmen: die **bunten Welt-Kacheln mit Foto** (mehr Farbe und Freude auf der Startseite) und den **Stempel-Moment** bei richtigen Antworten.
Überschriften in Bricolage, Hauptknopf in Tinte, Orange nicht als zweite Markenfarbe.

## Danach

Nach der Wahl: Design-Entwurf für den Umbau in Schritten (zuerst Bausteine und Farben im Kern `app/kern/`, dann Start, Karte, Spiele), jeder Schritt mit Vorschau und Freigabe.
