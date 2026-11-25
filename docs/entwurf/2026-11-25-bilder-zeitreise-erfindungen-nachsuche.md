# Bildkandidaten Zeitreise und Erfindungen, Nachsuche (25.11.2026)

Helfer: `bild-recherche` (sonnet/medium), 25.11.2026. Kandidaten, teilgeprüft (Commons-API und 480-px-Vorschau); vor dem Einbau volle Größe und `foto-einbau.mjs --nur-pruefen`.

Es wurden keine Dateien im Repository geändert. Ich habe nur im Scratchpad gearbeitet.

## Ausgangslage und Auswahl

In `app/world-catalog.json` und `app/world-photos.json` ist der Stand:
- Von 34 Zeitreise-Karten und 24 Erfindungs-Karten haben nur 3 ein Foto: `history-fire` (CC BY-SA 4.0, 960 px), `invention-compass` und `invention-bicycle`. Alle drei sind schon im Bündel (`docs/bilder/buendel-*.json`).
- Alle anderen Karten haben im Feld `image` keinen Eintrag, also kein Foto. Eine KI-Zeichnung steht nur bei `invention-3d-printing`, `invention-seismograph` und `invention-sewing-machine` (`public/inventions/*-ai.webp`).
- Zusätzlich liegen schon Vorschläge vor und werden hier nicht wiederholt: `invention-3d-printing`, `invention-seismograph`, `invention-sewing-machine` und `invention-airplane` (`docs/entwurf/2026-11-24-bilder-erfindungen-darwin-goodall.md` und `docs/entwurf/2026-11-24-bilder-offene-fragen.md`). Ebenso `history-fire`, `invention-compass`, `invention-bicycle`.

Auswahl der 12 Karten (wichtigste zuerst):
- Zuerst die Karten, die in `app/journey-links.ts` von den Lernreisen aus verlinkt sind: `history-apollo11`, `invention-rocket`, `invention-satellite`.
- Dann die Karten mit den meisten Verbindungen in `app/world-connections.json`: `history-writing`, `invention-printing`, `invention-telescope`, `invention-computer`, `history-timbuktu`.
- Dazu `history-pyramids`, `history-printing`, `history-stone_tools`, `invention-car`.
- Die Auswahl nach Startfragen habe ich nicht geprüft. Ich habe `app/kern/karte/rate-mal.tsx` nicht ausgewertet, die Rangfolge beruht nur auf Lernreisen und Verbindungen.

## Prüftiefe (ehrlich)

- Lizenz, Urheber, Größe und Wikitext (Lizenzbaustein, Quelle, Urheber) habe ich je Datei über die Commons-API gelesen. Das ist der Quelltext der Dateiseite. Die gerenderte HTML-Seite habe ich nicht geöffnet.
- Jedes Bild habe ich als 480-px-Vorschau angesehen, nicht in voller Größe. Ränder, Wasserzeichen und Schärfe im Detail sind deshalb nicht geprüft.
- Die Ausschnitt-Hinweise unten sind aus den Vorschauen geschätzt, nicht gerendert. Prozentwerte beziehen sich auf das Originalbild (x von links, y von oben). Vor dem Einbau `--vorschau` benutzen.
- Externe Quellen (Flickr, Smithsonian, NASA-Seiten) habe ich nicht geöffnet.
- Die API bremste (HTTP 429 einmal). Ich habe die Abfragen mit Pausen gebündelt, User-Agent `WunderKompass-Bildeinbau/1.0`.
- Alle Hauptkandidaten sind mindestens 960 px breit. Nichts muss hochskaliert werden.

## Tabelle je Karte

Alle Dateiseiten haben die Adresse `https://commons.wikimedia.org/wiki/File:` plus Dateiname mit `_` statt Leerzeichen. Heutiges Bild ist bei allen 12 Karten: keins.

### 1. `history-apollo11` (Lernreise)
- **Kandidat:** `File:Aldrin Apollo 11.jpg`
- **Urheber, Lizenz:** Neil A. Armstrong / NASA, gemeinfrei (PD-USGov-NASA)
- **Breite:** 2700 x 2700, 20.07.1969
- **Ausschnitt:** quadratisch, Astronaut bei x 18 bis 67 %, y 3 bis 85 %.
  - 4:3: `focus 50% 30%` (Füße gehen verloren).
  - 16:9: `focus 50% 20%` (Kopf bis Hüfte).
- **Alt-Text:** Ein Astronaut im weißen Raumanzug steht auf dem grauen Mondboden. Im Visier spiegelt sich etwas.
- **Nachweis:** Neil A. Armstrong / NASA, 1969, gemeinfrei (Public Domain). Quelle: Wikimedia Commons, `File:Aldrin Apollo 11.jpg`. Verkleinert und zugeschnitten.
- **Hinweis:** Das ist der echte Buzz Aldrin, ein historisches Foto. Die Unterschrift sollte „Buzz Aldrin auf dem Mond, fotografiert von Neil Armstrong“ lauten, weil Armstrong selbst im Visier zu sehen ist.

### 2. `invention-rocket` (Lernreise)
- **Kandidat:** `File:Apollo 11 Launch2.jpg`
- **Urheber, Lizenz:** NASA, restauriert von Michel Vuijlsteke, gemeinfrei (PD-USGov-NASA)
- **Breite:** 2400 x 3000 (Hochformat), 16.07.1969
- **Ausschnitt:** Rakete bei x 42 bis 55 %, y 8 bis 60 %, Rauch links.
  - 4:3: `focus 45% 30%`.
  - 16:9: `focus 45% 28%` (zeigt Spitze bis Mitte der Rakete, ohne die Flamme).
- **Alt-Text:** Eine riesige weiße Rakete hebt vom Boden ab. Unten schießen Feuer und Rauch heraus. Der Himmel ist blau.
- **Nachweis:** NASA, restauriert von Michel Vuijlsteke, gemeinfrei (Public Domain). Quelle: Wikimedia Commons, `File:Apollo 11 Launch2.jpg`. Verkleinert und zugeschnitten.
- **Ersatz:** `File:Apollo 11 Saturn V lifting off on July 16, 1969.jpg` (NASA, gemeinfrei, 2280 x 2862, ähnliches Motiv).

### 3. `invention-satellite` (Lernreise)
- **Kandidat:** `File:Explorer 1 Model With Cutaway Showing Science Components.jpg`
- **Urheber, Lizenz:** NASA, gemeinfrei (PD-USGov-NASA)
- **Breite:** 1060 x 817 (nur knapp über 960; nie größer ausspielen)
- **Ausschnitt:** Satellit diagonal in der Mitte auf Schwarz.
  - 4:3 und 16:9: `focus 50% 50%` (Ränder sind nur Schwarz).
- **Alt-Text:** Ein schmaler, silberner Satellit mit dünnen Antennen auf schwarzem Hintergrund. Er ist aufgeschnitten.
- **Nachweis:** NASA, gemeinfrei (Public Domain). Quelle: Wikimedia Commons, Dateiname wie oben. Verkleinert und zugeschnitten.
- **Hinweis:** Es ist ein Modell, die Unterschrift muss „Modell“ nennen.
- **Ersatz:** `File:Sputnik asm.jpg`. Nachbau von Sputnik 1 im Museum, NSSDC / NASA, gemeinfrei, 1094 x 896. Als Motiv für Kinder erkennbarer, aber der Commons-Seite fehlt die abschließende Prüfung (Marker `PDreview`), also vor dem Einbau noch einmal prüfen.

### 4. `history-writing`
- **Kandidat:** `File:Cuneiform tablet- administrative account of barley distribution with cylinder seal impression of a male figure, hunting dogs, and boars MET DP297594.jpg`
- **Urheber, Lizenz:** Metropolitan Museum of Art, CC0 (Baustein `Cc-zero`). Auf der Seite ist kein Urheber eingetragen.
- **Breite:** 2000 x 1500
- **Ausschnitt:** Tafel klein in der Mitte (x 30 bis 77 %, y 25 bis 75 %) auf hellem Grund. 4:3 und 16:9: `focus 50% 50%`.
- **Alt-Text:** Eine kleine Tontafel mit eingedrückten Keilzeichen auf hellem Hintergrund. Sie stammt aus Sumer.
- **Nachweis:** The Metropolitan Museum of Art (Inv. 1988.433.1), CC0. Quelle: Wikimedia Commons, Dateiname wie oben. Verkleinert und zugeschnitten.
- **Schwäche:** Auf der Vorschau ist sie ein grauer Klumpen, die Keilschrift ist kaum zu erkennen. Das Bild taugt nur mit gutem Zuschnitt und Unterschrift.
- **Ersatz:** `File:Proto cuneiform tablet OIM A12259.jpg`, laut Bericht vom 21.11. nur 980 px breit, CC BY-SA 4.0 (Daderot, bearbeitet von Zunkir). Ich habe es diesmal nicht neu geprüft. Weitere Ansichten derselben Tafel: DP297595 bis DP297597.

### 5. `invention-printing`
- **Kandidat:** `File:Gutenberg press.png`
- **Urheber, Lizenz:** International Printing Museum, CC0 (Baustein `{{self|cc-zero}}`)
- **Breite:** 1874 x 2499 (Hochformat), Datum der Datei 29.07.2026
- **Ausschnitt:** freigestellt auf Weiß, Presse füllt x 8 bis 88 %, y 8 bis 97 %.
  - Beschneiden zu 4:3 oder 16:9 schneidet die Presse an. Besser `fit: contain` auf Weiß.
- **Alt-Text:** Ein Nachbau von Gutenbergs Druckerpresse aus hellem Holz. Rechts liegt ein Blatt Papier.
- **Nachweis:** International Printing Museum, Nachbau der Gutenberg-Presse, CC0. Quelle: Wikimedia Commons, `File:Gutenberg press.png`. Verkleinert.
- **Hinweis:** Es ist ein Nachbau. Die Dateiendung ist PNG und wird nach WebP gewandelt. Weißer Rand muss zum Kartenrahmen passen (Design-Prüfer).

### 6. `history-printing`
- **Kandidat:** `File:Bible de Gutenberg, copie de la BNF Res A71-(2).jpg`
- **Urheber, Lizenz:** Zythème, CC0
- **Breite:** 2400 x 1245, 16.07.2023
- **Ausschnitt:** aufgeschlagenes Buch über die ganze Breite (x 2 bis 98 %), schmal und quer.
  - 16:9: `focus 50% 50%` passt fast ohne Verlust.
  - 4:3 würde Seitenränder abschneiden, besser `fit: contain` oder `focus 50% 50%` mit Verlust links und rechts.
- **Alt-Text:** Eine aufgeschlagene Gutenberg-Bibel. Auf jeder Seite stehen zwei Spalten dichte Schrift, einzelne Buchstaben sind rot.
- **Nachweis:** Zythème, 2023, CC0. Quelle: Wikimedia Commons, `File:Bible de Gutenberg, copie de la BNF Res A71-(2).jpg`. Verkleinert und zugeschnitten.
- **Hinweis:** Es ist ein Exemplar der Nationalbibliothek Frankreichs, eine Kopie von Gutenbergs Bibel, Mainz um 1455.
- **Ersatz:** `File:Gutenberg Bible, New York Public Library, USA. Pic 01.jpg`. Joshua Keller, CC BY 2.0, 3504 x 2336, Namensnennung nötig. Bei Flickr nicht gegengeprüft.

### 7. `history-pyramids`
- **Kandidat:** `File:The Great Pyramid of Giza from southeast corner.JPG`
- **Urheber, Lizenz:** MusikAnimal, CC BY-SA 4.0 (Baustein `{{self|cc-by-sa-4.0}}`, Quality Image)
- **Breite:** 6000 x 4000, 17.05.2015
- **Ausschnitt:** Spitze bei x ~52 %, y ~15 %. Sichtbar sind Steinblöcke und blauer Himmel.
  - 4:3: `focus 50% 40%`.
  - 16:9: `focus 50% 45%`.
- **Alt-Text:** Die Cheops-Pyramide in Ägypten aus großen Steinblöcken ragt spitz in den blauen Himmel.
- **Nachweis:** MusikAnimal, CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). Quelle: Wikimedia Commons, `File:The Great Pyramid of Giza from southeast corner.JPG`. Verkleinert und zugeschnitten (Bearbeitung unter derselben Lizenz).
- **Ersatz:** `File:Giza Great Pyramid of Khufu (9793898043).jpg`. Gary Todd, CC0, 3849 x 2591, Dia von 2002.
- **Hinweis:** Keine Menschen, keine Marken im Vorschaubild.

### 8. `history-stone_tools`
- **Kandidat:** `File:Olduvai stone chopping tool at British Museum.jpg`
- **Urheber, Lizenz:** BabelStone, CC BY-SA 3.0
- **Breite:** 4000 x 2248, 25.03.2012
- **Ausschnitt:** 16:9 schon passend. Stein bei x 25 bis 70 %, y 20 bis 95 %. 4:3: `focus 45% 55%`.
- **Alt-Text:** Ein grauer, rundlicher Stein in einer Museumsvitrine. Er wurde vor sehr langer Zeit als Werkzeug zugeschlagen.
- **Nachweis:** BabelStone, CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/). Quelle: Wikimedia Commons, `File:Olduvai stone chopping tool at British Museum.jpg`. Verkleinert und zugeschnitten.
- **Schwäche und fachlicher Hinweis:**
  - Die Vorschau zeigt einen grauen Stein, die Schlagkanten sind für Kinder schwer zu sehen.
  - Das Werkzeug ist 1,8 bis 2 Mio. Jahre alt (British Museum 1934,1214.1, Olduvai/Tansania), die Karte erzählt von Lomekwi. Die Unterschrift muss „ähnliches, jüngeres Werkzeug“ sagen.
- **Ersatz:** `File:Olduvai Chopper.JPG` (Archaeomoonwalker, CC BY 3.0, 3648 x 2736). Nur Beschreibung gelesen, Bild nicht angesehen.

### 9. `history-timbuktu`
- **Kandidat:** `File:Kitâb fî al-Falak Musa al-Kansûsi Mamma Haidara Library 2256 n01.jpg`
- **Urheber, Lizenz:**
  - Foto: Marie-Lan Nguyen (Commons-Nutzerin Jastrow), CC BY 4.0 (Baustein `photo license = {{self|Cc-by-4.0}}`).
  - Handschrift: gemeinfrei (`PD-old-100-1923`), kopiert von Musa al-Kansûsi, 1731.
- **Breite:** 6428 x 4289 (3:2), 01.07.2017
- **Ausschnitt:** zwei Seiten über fast die ganze Breite, y 5 bis 92 %.
  - 16:9: `focus 50% 45%`.
  - 4:3 verliert etwa 10 % an den Seiten, also ebenfalls `focus 50% 45%`.
- **Alt-Text:** Zwei Seiten einer alten Handschrift aus Westafrika. Sie sind mit arabischer Schrift und vielen Kreisen für den Himmel bedeckt.
- **Nachweis:** Foto: Marie-Lan Nguyen, CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Handschrift: Musa al-Kansûsi, 1731, Mamma Haidara Memorial Library, gemeinfrei. Quelle: Wikimedia Commons, Dateiname wie oben. Verkleinert und zugeschnitten.
- **Wichtig:** Die Dateiseite sagt, die Handschrift stamme aus **Gao** (Mali), liegt in der Mamma-Haidara-Bibliothek (Timbuktu) und wurde in **Paris** 2017 fotografiert. Die Unterschrift darf nicht „aus Timbuktu“ behaupten, sondern „aus Mali, aus einer Bibliothek in Timbuktu“. Der `fakten-pruefer` sollte das lesen.

### 10. `invention-telescope`
- **Kandidat:** `File:17th century telescopes in Galileo Museum 0640.jpg`
- **Urheber, Lizenz:** C messier, CC BY 4.0
- **Breite:** 4999 x 3749 (4:3), 09.10.2025 (Wiki Science Competition 2025)
- **Ausschnitt:** viele Rohre an der Wand, x 0 bis 100 %, y 5 bis 90 %.
  - 4:3 direkt nutzbar.
  - 16:9: `focus 50% 35%` (untere Linse geht verloren).
- **Alt-Text:** Mehrere alte Fernrohre aus Holz, Leder und Messing hängen an einer Wand im Museum.
- **Nachweis:** C messier, CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Quelle: Wikimedia Commons, `File:17th century telescopes in Galileo Museum 0640.jpg`. Verkleinert und zugeschnitten.
- **Hinweis:** Auf Galileo Museum (Florenz). Kein Mensch zu sehen, kein Text.

### 11. `invention-computer`
- **Kandidat:** `File:Z3 Deutsches Museum.JPG`
- **Urheber, Lizenz:** Venusianer (de.wikipedia), CC BY-SA 3.0
- **Breite:** 1600 x 1200 (4:3), 20.09.2006
- **Ausschnitt:** Schränke mit Schaltern füllen x 5 bis 95 %. 4:3 direkt. 16:9: `focus 50% 55%`.
- **Alt-Text:** Zwei hohe graue Schränke voller Schalter und Drähte stehen in einem Museum. Es ist der Nachbau eines der ersten Computer.
- **Nachweis:** Venusianer, CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/). Quelle: Wikimedia Commons, `File:Z3 Deutsches Museum.JPG`. Verkleinert und zugeschnitten.
- **Hinweis:** Nachbau der Zuse Z3 im Deutschen Museum, die Unterschrift muss „Nachbau“ sagen. Mit 1600 px das kleinste dieser Bilder, nur bis 960 px ausspielen.

### 12. `invention-car`
- **Kandidat:** `File:Benz Patent-Motorwagen Nummer 1 (D.M. Verkehrszentrum).jpg`
- **Urheber, Lizenz:** User:Mattes, gemeinfrei (Baustein `PD-self`, Eigenes Werk)
- **Breite:** 3072 x 2304 (4:3), 25.10.2009
- **Ausschnitt:** Auto rechts in Glasvitrine bei x 45 bis 90 %, y 10 bis 95 %.
  - 4:3: `focus 65% 55%`.
  - 16:9: `focus 70% 55%` (schneidet Vitrinenrand ab).
- **Alt-Text:** Ein sehr frühes Auto mit drei großen Rädern und einer Sitzbank steht in einer Glasvitrine im Museum.
- **Nachweis:** Mattes, gemeinfrei (Public Domain, Eigenes Werk). Quelle: Wikimedia Commons, `File:Benz Patent-Motorwagen Nummer 1 (D.M. Verkehrszentrum).jpg`. Verkleinert und zugeschnitten.
- **Hinweis:**
  - Laut Dateiseite ein Nachbau von 1903 mit Originalteilen von 1886, im Deutschen Museum.
  - Glasreflexe und Beschriftungstafel sichtbar.
  - Im Hintergrund stehen weitere Fahrzeuge.

## Offene Fragen

1. **Karten ohne Bild bleiben ohne Kandidat** (und ohne Suche heute), weil das Limit von 12 gilt: `history-medieval_cities`, `history-voyages1492`, `history-steam`, `history-railway`, `history-electric_light`, `history-flight`, die Erste-Weltkrieg-bis-ISS-Gruppe, `history-maya`, `history-greece`, `history-rome`, `history-khipu`, `history-mohenjo-daro`, `invention-light`, `invention-railway`, `invention-phone`, `invention-internet`, `invention-smartphone`, `invention-camera`, `invention-microscope` und weitere. Kandidaten stehen im Bericht vom 21.11.2026 und sind dort nur teilgeprüft. Soll ich im nächsten Paket weitermachen?
2. **Doppelte Motive:** `history-flight` und `invention-airplane` haben das gleiche Thema. `invention-airplane` hat laut Bericht vom 24.11. schon einen eigenen Vorschlag (Smithsonian-Foto des Flyers), `history-flight` soll das Originalfoto von 1903 (`First flight2.jpg`) bekommen. Die beiden dürfen nicht dasselbe Foto zeigen.
3. **Schwache Motive:** `history-stone_tools` und `history-writing` sind richtig, aber im Kleinen wenig eindrucksvoll. Soll ich gezielt nach besseren Fotos suchen, oder ist ein schlichtes, korrektes Museumsfoto genug?
4. **Quadrat- und Hochformat:** Bei Aldrin (1:1), Apollo-Launch (4:5), Gutenberg-Presse (3:4) muss der Kartenkopf mit `focus` oder `contain` umgehen. Das braucht den `design-pruefer` bei 320 px.
5. **Schon belegte Foto-IDs:** Neue IDs vergeben, z. B. `aldrin-apollo-11`, `apollo-11-launch`, `explorer-1-model`, `sumerian-barley-tablet`, `gutenberg-press-replica`, `gutenberg-bible-bnf`, `great-pyramid-southeast`, `olduvai-chopper-bm`, `kitab-fi-al-falak`, `galileo-museum-telescopes`, `z3-replica`, `benz-patent-motorwagen`. Ob sie frei sind, habe ich nicht gegen `app/world-photos.json` geprüft.
6. **Vor dem Einbau noch nötig:** Bilder in voller Größe ansehen. `node scripts/foto-einbau.mjs <datei> --nur-pruefen` laufen lassen. Unterschriften vom `fakten-pruefer` (Timbuktu/Gao, Z3-Nachbau, Benz-Nachbau, Olduvai-Alter, Aldrin/Armstrong) und `kinder-redaktion` prüfen lassen.

Dateien: `/home/user/wunderkompass/app/world-catalog.json`, `/home/user/wunderkompass/app/world-photos.json`, `/home/user/wunderkompass/app/journey-links.ts`, `/home/user/wunderkompass/docs/entwurf/2026-11-21-bilder-zeitreise-erfindungen.md`.
