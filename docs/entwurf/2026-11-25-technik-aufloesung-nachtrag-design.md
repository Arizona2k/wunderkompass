# Design-Nachprüfung Technik-Auflösungen (25.11.2026)

Helfer: `design-pruefer` (sonnet / high), Screenshots des lokalen Builds. Entscheidungen dazu: [Nachtrag, Abschnitt 7](2026-11-25-technik-aufloesung-nachtrag-entwurf.md#7-entscheidungen).

**Nachprüfung Technik-Detektiv (Chromium, lokaler Build auf Port 4312, Teilprüfung)**

Die Bilder lagen nur im Arbeitsordner des Chats (nicht im Repository). Muster: `kamera-<Breite>[-gross]-richtig.png` und `-falsch.png`, dazu `phone-320-gross-richtig.png`, `auto-390/1280`, `liste-<Breite>.png`. Gemessen habe ich 320, 390, 768, 1280 und 1440 px, dazu 320 und 390 px mit großer Schrift.

**Muss**
- Keine.

**Soll**
1. **Spielkarte zeigt den neuen Text nicht (alle Breiten, `liste-320.png`, `liste-1280.png`):**
   - Die Kachel in der Spieleliste (`#games`) steht weiter auf „Probleme mit Erfindungen verbinden“.
   - Der neue Satz „Welche Erfindung hilft? Finde sie und erfahre, wie sie funktioniert.“ steht nur in `app/game-index.json` und `app/world-games.tsx` (Feld `text`). Zu sehen ist er allein als Vorschauzeile in der Suche.
   - Die Kachel liest das Feld `goal` aus `META['world:technology']` in `app/playground-catalog.ts`, Zeile 39.
   - Wenn die Kachel das neue Versprechen tragen soll, muss dort der Text angepasst werden. Wenn „Probleme mit Erfindungen verbinden“ so bleiben soll, ist alles in Ordnung.
   - Das ist eine Frage der Absicht, kein Darstellungsfehler.

**Kann**
2. **Einzelnes Wort in der dritten Zeile, 768, 1280 und 1440 px (`kamera-1280-richtig.png`):** Beim Kamera-Text steht „Foto.“ allein in der dritten Zeile. Beim Auto und Smartphone sind es 2 Zeilen, das passt. Eine Wortumbruch-Regel wie `text-wrap: pretty` würde das beruhigen. Eilig ist es nicht.
3. **Rechte Lücke, 1280 und 1440 px:** Der Absatz endet bei 650 px, der Kasten ist 1000 px breit, rechts bleiben 330 px frei (`kamera-1280-richtig.png`, `kamera-1440-falsch.png`). Das sieht ruhig aus und nicht wie ein Fehler. Die Knopfzeile bleibt links beim Text, und die Überschrift „Richtig!“ steht im Verhältnis stimmig dazu. Wer es kompakter will, könnte den Kasten selbst auf etwa 760 px begrenzen. Die anderen Elemente (Frage, Antworten, Tipp) bleiben dann breit. Ich würde es lassen.

**Antworten auf deine Fragen**
1. **Rückmeldekasten, Richtig und Falsch:**
   - **320 px:** Der Text hat bei 16 px etwa 6 Zeilen. Der Kasten ist 333 px hoch und endet vor der Leiste. „Erklärung vorlesen“ und „Nächste Aufgabe“ stehen untereinander, das ist sauber (`kamera-320-richtig.png`).
   - **320 px, große Schrift (18,4 px):** Der Text hat 7 Zeilen, der Kasten ist 393 px hoch. Alles liegt knapp über der Leiste (Kasten unten bei etwa 490 px, Leiste ab 504 px). Auch das Smartphone ist 7 Zeilen und passt (`kamera-320-gross-richtig.png`, `phone-320-gross-richtig.png`). Falsch: 5 Zeilen, ebenfalls sauber (`kamera-320-gross-falsch.png`).
   - **390 px:** Normal 5 Zeilen, mit großer Schrift 5 Zeilen. Der Kasten endet über der Leiste (`kamera-390-gross-richtig.png`). Auto: 4 Zeilen.
   - **768 px:** Der Absatz ist 650 px breit, rechts bleiben 52 px bis zum Kastenrand. Das wirkt wie ein normaler Rand, 65ch greift hier kaum (`kamera-768-richtig.png`).
   - **1280 und 1440 px:** Der Absatz hat 650 px, das sind etwa 75 bis 80 Zeichen je Zeile, vorher 110 bis 115. Das ist gut lesbar (`kamera-1280-richtig.png`, `kamera-1440-falsch.png`). Die neue Falsch-Zeile „… Passt das zu allem, was in der Aufgabe steht?“ umbricht auf 2 Zeilen, das ist gut.
   - Die 65ch-Grenze wächst mit großer Schrift mit. In 320 px mit großer Schrift greift sie nicht, weil die Breite dort die Grenze setzt.
2. **Spielkarte, 320 und 1280 px:**
   - Der alte Satz „Probleme mit Erfindungen verbinden“ ist in 320 px einzeilig, die Kachel ist 196 px hoch.
   - Sie ist damit genauso hoch wie „Wer war das?“ (196 px) und nie höher als ihre Nachbarn. In der Reihe zu dritt bei 1280 px (Wer war das? / Technik-Detektiv / Früher oder heute?) sind alle 196 px hoch. In 320 px mit großer Schrift sind es 247 px, wie die Nachbarn.
   - Der neue Text wird dort nicht angezeigt, siehe Soll 1. Den Umbruch des neuen Textes konnte ich deshalb nicht in der Kachel prüfen.
3. **Abgeschnitten oder hinter der Leiste:** Nein. Kein waagerechtes Scrollen in keiner Breite (docW gleich Viewport). Der Rückmeldekasten liegt in 320 und 390 px, normal und mit großer Schrift, vollständig über der Leiste. Das gilt auch für Knöpfe und Fokus.

**Was gut ist**
- Die Rückmeldung ist ruhig und gut lesbar.
- Die Auflösungen mit bis zu 180 Zeichen passen auf das Handy, auch mit großer Schrift.
- Die Knopfzeile bricht sauber um.
- Die Kacheln sind einheitlich hoch.

**Nicht geprüft:** Firefox und WebKit, echte Geräte, Bildschirmleser, Tastaturfokus und „Bewegung reduzieren“ (nicht Teil dieser Runde). Die Falsch-Rückmeldung habe ich nur für 3 Erfindungen gesehen, die Sätze der übrigen nicht.
