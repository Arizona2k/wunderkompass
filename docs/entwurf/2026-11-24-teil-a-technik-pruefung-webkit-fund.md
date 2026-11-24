# Technik-Prüfung: später Fund in der CI (Engine-Schnellprüfung WebKit, `pass-spielstaende`)

Bericht des Helfers `technik-pruefer` vom 24.11.2026, wortgetreu gesichert. Auftrag: Nachprüfung nach dem dritten späten Fund in Teil A (CI-Lauf 45311674318 von PR #107, Commit `5ff3cec`; Korrektur in Commit `9b74f99`). Was daraus umgesetzt wurde, steht in der [Entscheidungsliste Teil A](2026-11-23-teilschritt-3-teil-a-entscheidungen.md), Abschnitt „Dritter später Fund“.

---

**Ergebnis:** Der Fund ist ein zeitabhängiger Fehler, den die Prüfkette nur zufällig sieht, und keine reine Abdeckungslücke. Ich sehe zwei kleine Maßnahmen (Test-Stresslauf mit verzögertem Bildaufbau, sofortiger Fokus an drei weiteren Stellen in `app/kern/`). Vor dem Merge von PR #107 würde ich nur den Test-Befund 2a und den App-Befund 3a erledigen. Ich habe nichts gebaut und nichts gestartet. Die CI-Angaben stammen aus `gh run view`.

## Befunde

### 1. Warum lokal grün, in der CI rot (Befund 1)

**Belege**
- `package.json:17-21`: `check` führt `test:browser` nur in Chromium aus (`--jobs 2`). `test:browser:webkit` führt in WebKit nur `offline-cold` und `backup` aus. `pass-spielstaende` mit `stufeImPass` (`tests/browser/suites.mjs:49`) läuft lokal in `check` also nur in Chromium.
- Den ganzen CI-Satz in Firefox und WebKit führt erst die Engine-Schnellprüfung aus (`.github/workflows/quality.yml:142-178`).
- Lauf 45311674318: Das Log zeigt `FAIL pass-spielstaende 3.5 s [webkit]`. Schritt „CI-Satz in webkit“ lief 02:36:01 bis 02:40:10 und dauerte damit gut 4 Minuten. Dieselbe Suite war in Firefox und in Chromium (Pflicht-Job) grün.
- Ihr eigener WebKit-Lauf (`engines-a16`) und die sechs Wiederholungen waren grün. Der Fehler braucht also einen späten Bildaufbau und trat im Container nie auf. Eine WebKit-Wiederholung lokal hätte ihn nicht verlässlich gefunden. Der Container hat wie die CI-Maschine 4 Kerne, die Last erklärt den Unterschied nicht.

**Einschätzung:** Die Engine-Schnellprüfung hat ihre Aufgabe erfüllt. Sie fing den Fehler im PR, bevor er in `test-live` landete, und kostete nur etwa 7 Minuten Wartezeit nach dem Push. Den ganzen CI-Satz in WebKit und Firefox in `check` zu holen, würde lokal rund 8 Minuten mehr kosten (nach dem CI-Lauf geschätzt, nicht gemessen). Ich würde das nicht empfehlen, weil es dieselbe Zufallslücke nicht schließt.

**Vorschlag (später, BACKLOG; klein, kostenlos, schwächt nichts ab):** Ein Stressmodus für den Bildaufbau, so wie Ihre Gegenprobe.
- In `tests/browser/run.mjs` gibt es schon einen Eingriff in `browser.newContext` (`dropIsMobile`, Zeile 96 und 161-171). Ein gleichartiger Eingriff könnte bei einer Umgebungsvariable (z. B. `QA_FRAME_DELAY_MS=150`) in jedem Kontext ein `addInitScript` setzen, das `requestAnimationFrame` verzögert. Dasselbe Skript steht dann auch den Suiten zur Verfügung, die ihre Kontexte selbst anlegen, wie `pass-spielstaende` in Zeile 85-91.
- Er läuft von Hand vor dem Phasenende (z. B. `QA_FRAME_DELAY_MS=150 node tests/browser/run.mjs --suite ci --browser webkit`) und ließe sich als Schritt in `/pruefen` aufnehmen. Alternativ läuft er als eigener, nicht verpflichtender Job über `workflow_dispatch`. Er findet die ganze Fehlerklasse „Zustand sofort abgefragt“, nicht nur diesen einen Fall.
- Zwei Punkte, die ich nicht geprüft habe: ob `smoke`-Bilder oder `performance` (Tempo) unter der Verzögerung anders ausfallen (diese beiden Suiten wohl auslassen), und ob einzelne Suiten mit der Verzögerung in Zeitgrenzen laufen.
- Frage an den Nutzer: Soll ein solcher Stresslauf als Schritt in `/pruefen` stehen?

### 2. Weitere Test-Stellen mit sofortiger Fokusabfrage (Befund 2)

In `git diff --stat origin/test-live...HEAD -- tests/browser` gibt es nur diese Stellen (alle anderen geänderten Suiten nutzen `waitForFunction` oder `fokusAuf`, z. B. `karte-stufen.mjs:43-49`, `:203`, `:210`, `wissenskarte.mjs:281`, `:309`, `:536`, `:567`):

- **a) `tests/browser/pass-spielstaende.mjs:153` (bald, vor dem Merge).** `aendern.evaluate(el => el === document.activeElement && el.matches(':focus-visible'))` kommt direkt nach `expectText('Stufe: Profi')`. Das ist dieselbe Race wie Zeile 145. Die App-Korrektur löst sie mit, weil der Fokus jetzt synchron gesetzt wird. Der Test selbst bleibt aber ein Momentbild.
  - Empfehlung: Zeilen 145 und 153 auf ein Warten umstellen, z. B. `page.waitForFunction` mit Meldung wie `fokusAuf` in `karte-stufen.mjs:43`. Das schwächt nichts ab: Die Prüfung bleibt, sie wartet nur auf das Ziel statt zu raten. `fokusAuf` aus `karte-stufen.mjs` könnte in `harness.mjs` wandern und von beiden Suiten genutzt werden.
- **b) `tests/browser/pass-spielstaende.mjs:132` und `:149` (klein).** Das Ziel ist `useEffect([offen])` (`app/kern/stufen-wahl.tsx:25`), also ein Effekt nach einem Tipp oder Enter. Bei einem Klick zeigt React solche Effekte normalerweise sofort, auch Zeile 132 hat Screenshots dazwischen. Ich halte das Risiko für niedrig, belegt ist es nicht. Dieselbe Umstellung wie bei a) wäre ohne Mehraufwand möglich.
- **c) `tests/browser/research.mjs:83` (klein, nur Chromium, nur `full`).** `opener.evaluate(el => el === document.activeElement)` kommt direkt nach `waitFor({state:'hidden'})` des Dialogs. Die Zeile steht nicht im Diff von Teil A. Der Radix-Dialog gibt den Fokus beim Schließen zurück, vermutlich schon vor „hidden“. Bei Gelegenheit auf Warten umstellen, nicht dringend.
- `tests/browser/article-atlas.mjs:65` (prüft „Fokus ist nicht auf …“) und `:71` (Skip-Link-Enter, `app/earth-explorer.tsx:264`) sind in Ordnung. `animal-learning.mjs:273` und `journeys.mjs:267` stehen nicht in Ihrem Teil-A-Diff.

### 3. Fokus nur im nächsten Bild, obwohl der Knopf sofort verschwindet (Befund 3)

Gleiches Muster wie `waehle` in `app/kern/stufen-wahl.tsx:26-34`. Dort gilt es jetzt nicht mehr, es bleibt nur der Rückfall im Bildaufbau (Zeile 33), der eingeschränkt zu `fokusAufStufenWahl` (Zeile 17-19) passt.

- **a) `app/kern/karte/wissenskarte.tsx:201`, „Ja, Profi probieren“ (bald, vor dem Merge, klein).** `schliessen()` lässt den gedrückten Knopf sofort verschwinden. `fokusAufStufenWahl` setzt den Fokus erst per `requestAnimationFrame`. Bis dahin liegt er auf `<body>`, bei Bildschirmlesern ist das hörbar, mit der Karte als Dialog auch bei der Fokusfalle. Der Test ist sicher (`karte-stufen.mjs:119` wartet). Empfehlung: In `fokusAufStufenWahl` den Knopf zuerst sofort fokussieren, falls er schon da ist, und den Rückfall im nächsten Bild behalten. Die Reihenfolge im Aufruf (`schliessen(); a.onStufe?.(...); fokusAufStufenWahl(...)`) liefert noch den alten Knopf, wenn `fokusAufStufenWahl` vor `schliessen()` oder `onStufe` läuft. Dann ist die Funktion der einzige Ort für diese Regel.
- **b) `app/kern/karte/wissenskarte.tsx:202`, „Nein, ich bleibe“ (gleich wie a).** `schliessen()` entfernt den Knopf, der Fokus kommt erst im nächsten Bild auf `.rate-mal`. `rate-mal` hat `tabIndex={-1}` (`rate-mal.tsx:81`). Empfehlung: `artikel.current?.querySelector('.rate-mal')?.focus()` vor `schliessen()` aufrufen, den Rückfall in `requestAnimationFrame` behalten. Der Test `karte-stufen.mjs:124` wartet und bleibt grün.
- **c) `app/kern/karte/rate-mal.tsx:119-122`, „Noch einmal raten“ (später, BACKLOG).** `setAntwort(null)` entfernt die Rückmeldung samt Knopf, der Fokus kommt erst im Bildaufbau auf `.quiz-answer`. Hier hilft ein sofortiger Fokus auf die Karte nicht ganz: Die Antwortknöpfe sind bei `disabled={richtig}` vorher nicht fokussierbar. Empfehlung: Fokus sofort auf `bereich.current` setzen (Abschnitt, `tabIndex -1`), danach wie bisher im nächsten Bild auf die erste Antwort. Ein Test dafür fehlt: Die Suchtreffer zu „Noch einmal raten“ (z. B. `karte-hilfen.mjs:217`) klicken nur und prüfen den Fokus nicht.
- **d) `app/kern/karte/ordne-richtig.tsx:40-43` (kein Befund).** Der Knopf bleibt im Dokument, bekommt aber beim Verschieben eine neue Position (`key={teil}`); der Fokus wird im nächsten Bild zurückgeholt. Das ist eine kurze Lücke. Der Test wartet (`karte-stufen.mjs:203`, `:210`). Keine Änderung nötig.
- **e) `app/kern/neuigkeiten-ansicht.tsx:17-18`.** Zwei `requestAnimationFrame` hintereinander. Ich habe nicht geprüft, was dort der Auslöser ist. Nicht Teil von Teil A.

## Geprüft und in Ordnung

- `git diff` der Korrektur in `app/kern/stufen-wahl.tsx`: Sie ist in sich schlüssig. Der Fokus wird auf „Ändern“ gesetzt, solange „Zurück zu Entdecker“ noch da ist. Danach folgen `onStufe(neu)`, `setOffen(false)` und der Rückfall im nächsten Bild.
- Der Pfad Tastatur/`:focus-visible` (`pass-spielstaende.mjs:153`) bleibt mit dem sofortigen Fokus von einem fokussierten Knopf aus wohl erhalten. Das habe ich nicht ausgeführt.
- `.github/workflows/quality.yml`: Pflicht-Job 20 Minuten bei etwa 7 Minuten echter Dauer. Die Engine-Schnellprüfung hat 35 Minuten Grenze bei etwa 19 Minuten Dauer (Webkit), also genug Puffer.
- Die Suitennamen in `CLAUDE.md` (`pass-spielstaende` ist im CI-Satz, `test:browser:webkit` mit `offline-cold` und `backup`) passen zu `package.json:17-18` und `tests/browser/suites.mjs`.

## Nicht geprüft

- **Auffälliger Job „Engine-Schnellprüfung (webkit)“:** Der Schritt „Install webkit“ (`quality.yml:169-176`) dauerte 14 Minuten 40 Sekunden (02:21:21 bis 02:36:01), im Firefox-Job war der ganze Lauf in 7 Minuten fertig. Die Grenze für diesen Schritt liegt bei 20 Minuten, der Puffer bleibt knapp über einem Viertel. Das ist ein Kandidat für eine spätere Beobachtung, kein Befund für PR #107. Ich habe nicht untersucht, warum.
- Im WebKit-Log stehen drei sehr kurze Läufe: `offline-retention` 2,8 s, `reise-kapitel` 3,0 s, `people-learning` 2,9 s. Ob das gewollt ist (z. B. Aufgabe wird übersprungen) oder ob die Suiten dort früh aussteigen, habe ich nicht geprüft. Zum Vergleich fehlen mir Chromium-Zeiten.
- Ich habe nichts ausgeführt: weder den Stressmodus noch die Tests mit dem Fokus-Vorschlag. Alle Aussagen zu b) und c) im Befund 3 sind aus dem Code gelesen.
- Nicht verfügbar waren das Netz für `pnpm outdated`/`pnpm audit` und der Vercel-Zugang. Beides war für diese Frage nicht nötig und blieb ungeprüft.
