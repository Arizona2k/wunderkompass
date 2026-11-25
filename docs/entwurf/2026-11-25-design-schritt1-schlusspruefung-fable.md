# Schlussprüfung Design-Umbau Schritt 1 (PR #120), Fable

> Helferbericht (schluss-pruefer, Fable / high), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt. Geprüft auf cb01af3, Bericht um 19:27 deutscher Zeit fertig.

## 1. Ergebnis

**Bereit mit kleinen Punkten.** Pass, IDs, Links und Offline sind nicht berührt. Vor dem Merge sind aber eine CSS-Zeile, eine Testzeile und der PR-Text zu korrigieren, und `journeys` ist noch nicht grün belegt.

Geprüft habe ich auf cb01af3. Der PR-Kopf ist inzwischen `3875dff` (nur `STATUS.md`, 18:16 UTC gepusht).

## 2. Befunde

### Vor dem Merge beheben

**B1 – Doppeltes Kreuz bei „Stimmt das?“ (neu durch diesen PR).**
- Stelle: `/home/user/wunderkompass/app/kern/kern.css:159` setzt bei jeder falschen Antwort ein „✕“ per `::after`. `/home/user/wunderkompass/app/kern/karte/stimmt-das.tsx:44` zeichnet dort schon ein `<X>`-Symbol.
- Fall: Karte `#world/topic/animal-common-octopus`, „Stimmt“ tippen. Der Knopf zeigt ein dunkles ✕ und daneben ein rotes ✕. Gemessen auch bei `animal-polar-bear` und `history-apollo11`; betroffen sind die 12 Karten mit `claims`.
- Bild: `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/sp/stimmt-das-animal-common-octopus.png`
- Warum es keiner sah: Die Suite `wissenskarte` prüft nur den richtigen Knopf.
- Vorschlag: in `kern.css:159` die Ausnahme auf `:not(:has(.answer-state, svg))` erweitern, oder das `<X>` in `stimmt-das.tsx` streichen.

**B2 – Die Ansicht „Spiel“ der Kontrast-Suite ist kein Spiel.**
- Stelle: `/home/user/wunderkompass/tests/browser/kontrast.mjs:19` klickt die erste `.game-tile`. Das ist `classic:hunt`, und die führt nach `#globe`.
- Folge: Die Suite prüft 13 verschiedene Ansichten, den Globus doppelt und keinen Spielraum. Die Sicherung `geprueft > 20` merkt das nicht.
- Was dadurch durchrutscht: Im Foto-Spiel (`extra:photos`) hat die Bildzeile „Foto: NASA“ nur 4,03:1 (`#607981` auf `#EDF1EA`, 13 px; `/home/user/wunderkompass/app/globals.css:29`, `.chapter-photo figcaption`). Auf dem alten Papier waren es 4,35:1, also schon vorher zu wenig.
- Vorschlag: `klick: '[data-game-key="world:people"]'` wie in `kern-huelle`, und je Ansicht einen erwarteten Selektor prüfen (z. B. `.game-room`). Die Bildzeile auf `--kern-text-leise` setzen.

**B3 – PR-Text stimmt an fünf Stellen nicht** (`/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/pr-body-s1-final2.md`):
- **Zeile 31, „`journeys` grün“:** nicht belegt. Der letzte fertige Lauf ist rot: `/home/user/wunderkompass/.qa-output/browser/zeiten-full-chromium.json` (18:01:49) zeigt `components` 38,1 s bestanden, `journeys` 1760,7 s `bestanden: false`, zusammen 1799 s. Der neue Lauf (Start 18:02) lief um 18:25 noch.
  - Die Ursache ist nicht belegt. Das Fehlerbild `/home/user/wunderkompass/.qa-output/quality-failure-journey-engine-chromium-book-water-why-0-native200-drawing-320.png` zeigt eine normale Seite, und 1799 s sind fast genau 30 Minuten. Das spricht für eine Zeitgrenze, nicht für einen Fehler der Seite.
  - In der CI braucht `journeys` allein 2082 s (`tests/browser/shards.mjs:12`). Mit derselben Grenze bricht der neue Lauf gegen 18:32 wieder ab.
  - Vorschlag: Fehlermeldung des roten Laufs lesen, mit längerer Grenze starten, erst danach „grün“ schreiben (Regel: nicht blind wiederholen).
- **Zeile 30, „`wissenskarte` in WebKit, die läuft noch“:** Es läuft kein WebKit- oder Firefox-Prozess. Der letzte lokale Einzellauf (`zeiten-ci-firefox.json`, 17:14) liegt vor `6b12847` und cb01af3. Auf dem letzten Stand deckt das nur die Engine-Schnellprüfung auf GitHub ab; so sollte es im Text stehen.
- **Zeile 9, „Der Kasten nach einer Antwort ist weiß … überall gleich groß“:** stimmt im Quiz nicht (`#quiz`, Spiel `classic:quiz`). Gemessen: richtig `#EDF8F0` mit grüner Schrift, falsch `#FFF4E6` mit brauner Schrift, „Richtig!“ 16 px statt 20 px. Stellen: `/home/user/wunderkompass/app/globals.css:17` (`.feedback-correct`, `.feedback-learn`), `/home/user/wunderkompass/app/earth-explorer.tsx:308`. Steht nicht im BACKLOG. Entweder angleichen oder im Text und in BACKLOG Punkt 29 nennen.
- **Zeile 34, „14 Hauptansichten“:** siehe B2, es sind 13. Dasselbe steht im CHANGELOG.
- **Zeile 22, „letzter Stand cb01af3“:** Kopf ist `3875dff`. Die CI muss für diesen Commit grün sein.
- Es fehlt `kinder-redaktion` in der Helferliste (Zeile 23).

### Klein, im selben PR oder ins BACKLOG

- **B4:** `/home/user/wunderkompass/app/pass-atlas.css:84`: Der Bestätigungsknopf im Pass wird beim Darüberfahren altes Dunkelgrün (`#1d5143`). Diese Farbe hat der PR an drei anderen Stellen gelöscht. Vorschlag: `var(--kern-petrol-dunkel)`.
- **B5:** `/home/user/wunderkompass/CHANGELOG.md:22` sagt „bei 360 und 1280 px“. `kern-huelle` misst bei 320 (`tests/browser/kern-huelle.mjs:14`).
- **B6:** `/home/user/wunderkompass/STATUS.md:36` nennt `pnpm run check`, die großen Suiten, Vorschau und PR noch als offen. Das landet so auf `test-live`.

### BACKLOG: Lücken der Kontrast-Suite

Ja, sie kann grün sein, obwohl Schrift zu blass ist. Alle Stellen unten sind alt, nicht durch diesen PR entstanden.

- **Text auf Verläufen und Bildern:** axe meldet das als „incomplete“, die Suite zählt es nicht. Beispiel in einer geprüften Ansicht: Globus, „UNSER BLAUER PLANET“ (`.stage-kicker`, 11 px, `#6C9099`, `globals.css:17`), rund 3:1 auf dem hellen Verlauf.
- **Gesperrte Knöpfe** überspringt axe (`button:disabled`, Deckkraft 0,65):

  | Knopf | Kontrast |
  |---|---|
  | „Reihenfolge prüfen“ | 3,61:1 |
  | „Vorherige Seite“ | 3,52:1 |
  | „Vorheriges Kapitel“ (schon im BACKLOG) | 3,52:1 |

- **Platzhalter** prüft axe nicht: „Was interessiert dich?“ im Welten-Filter hat 50 % der Textfarbe, gerechnet rund 2,5:1.
- **Fehlende Ansichten:** Spielraum, Quiz, Weltliste (`#world/animals`), „Was ist neu?“, Erdschichten, Tag und Nacht, Pass, Suche, Zustand nach einer Antwort.
- **Dunkles Farbschema:** Das gibt es nicht. Mit `prefers-color-scheme: dark` gemessen: gleiche Farben. Kein Risiko.
- **App-Start:** `/home/user/wunderkompass/public/learning.webmanifest:9` hat `background_color #f4f8fa`, nicht das Papier `#EDF1EA`.

## 3. Fragen

- **„Go“ des Nutzers:** `STATUS.md` (Commit `3875dff`) sagt „weiter erst nach dem Go des Nutzers“. Der PR-Text sagt „Nichts zu entscheiden“ und will bei grüner CI mergen. Liegt das Go vor? Sonst Auto-Merge nicht einschalten.
- **Links im PR-Text:** Relative Links (`docs/entwurf/…`) löst GitHub in PR-Beschreibungen meines Wissens nicht auf. Klären: einen Link in der Vorschau des PR anklicken; sonst volle Adressen nehmen.
- **Modellnamen:** Meine Prüfliste verlangt „keine Modellnamen in Commits“. Alle 25 Commits tragen die übliche Zeile `Co-Authored-By: Claude Opus 5.5`, wie die 35 letzten auf `test-live`. Ich werte das als Übung, nicht als Befund. Soll die Prüfliste angepasst werden?
- **„Am alten Stand ist die Suite rot“** (PR-Text Zeile 34): nicht nachgestellt; dafür müsste man `4f9f4fe` bauen.

## 4. Geprüft und in Ordnung

- **Diff:** alle 34 CSS-Dateien regelweise alt gegen neu gelesen, dazu `neuigkeiten.ts`, `index.html` und die 6 Testdateien. Unterlagen überflogen.
- **Pass, IDs, Links, Offline:** nicht berührt. Geändert sind nur CSS, ein neuer Neuigkeiten-Eintrag `neue-farben` (die ID wird nirgends gespeichert), die Seitenbeschreibung und Tests. Keine Pakete, keine Bilder, keine Workflow-Änderung.
- **Tests:** nichts abgeschwächt. `karte-stufen` prüft die neue Farbe, die Kontrasthilfe in `lesbarkeit.mjs` rechnet jetzt richtig.
- **Farbwerte nachgerechnet:**

  | Paar | Kontrast |
  |---|---|
  | Weiß auf Blaugrün | 6,24 |
  | Blaugrün auf Papier | 5,46 |
  | Tinte auf Papier | 11,70 |
  | leise Tinte auf Papier | 5,81 |
  | Kreuz auf Rot-zart | 4,51 |

- **Reste:** Außerhalb des Kerns gibt es keine Regel mehr, die Farbe oder Schrift von Haupt-, Neben-, Vorlese-, Antwort- oder Wahlknöpfen überschreibt, nur Mindesthöhen ab 48 px. Außer den Resten im BACKLOG gibt es keine eigenen Fokusrahmen mehr.
- **Eigene axe-Läufe** (Chromium, auf dem Build von 17:47, je 1280 und 320 px): die 14 Suiten-Ansichten, alle 31 Spiele am Anfang und nach der ersten Antwort, 5 Karten nach Antworten, 6 Weltlisten, `#updates`, `#layers`, `#day`, `#quiz`, Reisekapitel vor und nach Antwort, Pass (auch mit großer Schrift), Suche. Außer den genannten Stellen 0 Befunde.
- **Neuigkeit:** Der Text stimmt mit dem Bau überein.
- **Autor und Committer:** in allen Commits `Claude <noreply@anthropic.com>`; keine persönlichen Daten im Diff.

## 5. Nicht geprüft

- Stand der CI auf GitHub für cb01af3 und `3875dff` (nicht abgefragt).
- Firefox und WebKit selbst.
- Darüberfahren und Fokus per Messung (nur die Token-Paare gerechnet).
- 768 px, Bilder aller Seiten und die Vorschau auf Vercel.
- Inhalt der Tier-Unterlagen in `docs/entwurf/`.
- Ausgang des laufenden `journeys`-Laufs.
