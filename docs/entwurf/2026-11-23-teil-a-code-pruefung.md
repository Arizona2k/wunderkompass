# Code-Prüfung Teil A (code-pruefer, 23.11.2026)

**Ergebnis:** Teil A ist mit Änderungen bereit. Ich habe keinen Befund gefunden, durch den im Pass etwas verloren geht. Zwei Logik- bzw. Bedienfehler sollten vor dem PR behoben werden, und HEAD ist im Moment rot.

Geprüft habe ich `git diff origin/test-live...HEAD` bis Commit `033084c`. Während meiner Prüfung kamen `2ca1133` und `033084c` dazu.

## Befunde

### Kritisch
Keine.

### Wichtig

**1. Die Vorschläge zählen auch Antworten auf leichtere Fragen.**
- Wo: `app/kern/stufen-vorschlag.tsx:13-19`, `app/kern/karte/rate-mal.tsx:73`, `app/kern/karte/wissenskarte.tsx:190`.
- Was passiert: `merke(frage.id, korrekt)` zählt jede erste Antwort für die *gewählte* Stufe, egal welche Stufe die Frage hat. Auf 192 von 204 Karten gibt es nur die Entdecker-Hauptfrage, und `fragenFuerStufe` zeigt auf Profi auch leichtere Fragen.
- Fall 1: Ein Profi-Kind beantwortet die Hauptfragen von drei Karten ohne Profi-Frage richtig. Es bekommt „Das war leicht für dich. Willst du Experte probieren?“, obwohl es nur Entdecker-Fragen gespielt hat.
- Fall 2: Ein Profi-Kind beantwortet zwei Entdecker-Hauptfragen falsch. Es bekommt „Willst du eine Stufe leichter spielen?“, obwohl die Karte schon „Du spielst Entdecker“ sagt.
- Altpässe mit „Knifflig“ starten auf Profi. Für sie ist das also der Normalfall.
- Lücke in den Tests: `tests/stufen-vorschlag.test.mjs` prüft das nicht. `ZWEI_AUF_PROFI` in `tests/browser/karte-stufen.mjs` lässt Entdecker-Fragen ausdrücklich zu.
- Vorschlag: `onAntwort` bekommt `frage.level` mit. `mitErsterAntwort` zählt nur bei `level === stufe`; leichtere Fragen bleiben neutral. Dazu ein Unit-Test für genau diesen Fall.

**2. Nach einem Stufenwechsel auf der Karte geht der Tastaturfokus verloren.**
- Wo: `app/kern/stufen-wahl.tsx:22-26`, `app/kern/karte/wissenskarte.tsx:180` und `:191-197`.
- Was passiert:
  - `StufenWahl` steckt im `kopf` von `RateMal`, und `RateMal` hat `key={frage.id}`.
  - Wechselt die Stufe, wählt die Karte eine neue Frage. Dabei wird `RateMal` mit der Stufenwahl komplett neu aufgebaut.
  - Das `requestAnimationFrame(() => aendern.current?.focus())` gehört zur alten Instanz. Ihr Ref ist dann `null`, und der Fokus landet auf `body`.
  - Dasselbe passiert bei „Ja, … probieren“, „Nein, ich bleibe“ und „Zu schwer? Zurück zu Entdecker“: Der Knopf verschwindet, und niemand setzt den Fokus neu.
- Fall: Tastatur oder Screenreader, Karte mit Profi-Frage, „Ändern“ → „Profi“. Der Fokus ist weg, und das Kind muss von oben neu tabben.
- Lücke in den Tests: Der Fokus wird nur im Pass-Fenster geprüft (`tests/browser/pass-spielstaende.mjs:132-153`). Dort wird nichts neu aufgebaut.
- Vorschlag: `StufenWahl` außerhalb des Schlüssels rendern, oder nach dem Wechsel den neuen „Rate mal!“-Bereich bzw. „Ändern“ fokussieren. Dazu ein Fokus-Check in `karte-stufen.mjs`.

**3. HEAD ist rot.**
- `pnpm test` ergibt 432 von 433. Rot ist „‚Ganz einfach‘ steht nicht noch einmal wörtlich auf der Karte“ (`tests/karten-inhalt.test.mjs:173`).
- `033084c` hat die Ausnahmeliste entfernt. Die 24 Tierkarten haben im Katalog aber noch denselben Satz in Einleitung und „Ganz einfach“.
- Auch die 67 neuen „Ganz einfach“-Sätze sind noch nicht im Katalog: Lernhilfen bei 107 Karten vorher wie nachher, kein Satz geändert.
- Vorschlag: kein PR, bevor der Katalog-Commit da ist. Ist `033084c` schon gepusht, wird die CI rot.

**4. Die feste Liste gespeicherter Antworten schützt nur den alten Stand.**
- Wo: `tests/fixtures/gespeicherte-antworten.json` mit dem Stand vor Aufgabe 5, und `tests/gespeicherte-antworten.test.mjs:22-26`, das feste Zahlen prüft (204 / 30 / 42).
- Ab diesem PR können Kinder Antworten auf Fragen speichern, die die Liste nicht kennt:
  - die 12 neuen Zusatzfragen (`…:rate-3/4`),
  - die vierten Antworten,
  - alle 42 Challenge-Fragen auf der Karte, unter `topicAnswer:<challengeId>`.
- Fall: Wer später eine der neuen falschen Antworten ändert, merkt das in keinem Test. Das Kind sieht dann „Hier gibt es neue Antworten“, oder eine richtige Antwort zählt nicht mehr.
- Vorschlag: Beim Merge eine zweite, datierte Liste mit den heutigen Antwortsätzen ergänzen. Regel: „die Liste wächst nur“, wie bei `stable-ids.json`.

### Klein

5. **Alte Challenge-Runden zeigen die heutigen Tipps.** Bei den 24 umformulierten Fragen mit ganzer alter Frage (`beforePrompt`) kommen die Tipps aus der heutigen Fassung (`app/knowledge-challenge-game.tsx:13`, `app/retained-answer-wording.mjs:945-947`). In meinen Stichproben passen sie noch (Mondphasen, Gezeiten, Bronze). Es ist aber nicht abgesichert. Vorschlag: bei diesen Fragen alte Tipps mitspeichern, oder in der Runde keine Tipps zeigen.

6. **Die feste Mischung schützt den Pass nur bei Text-Listen.** `festGemischt` schreibt nur nichts, wenn `items` eine nicht leere Liste aus Texten ist. Fall: `items: []` oder eine Liste aus Zahlen. `compatible` lehnt ab (`app/game-state.ts:9`), und das Speichern beim Öffnen in `app/saved-games.tsx:24` überschreibt dann mit einer neuen Mischung. Das war schon vorher so, ist also nicht neu. Die Entscheidungsliste sollte es aber so eng formulieren.

7. **Veraltete Kommentare.**
   - `tests/karte-stufen.test.mjs`, Test „gueltigeReihe“: „die Karte mischt neu und speichert das“. Seit `festGemischt` falsch.
   - `app/kern/karte/ordne-richtig.tsx:4`: dort steht `{reihe, geloest}`, gespeichert wird `{reihe, geprueft}`. Bei Pass-Schlüsseln sollte der Kommentar stimmen.

8. **„Ordne richtig“, nur im Code gelesen, nicht im Browser geprüft.**
   - Wenn React beim Tausch den fokussierten Eintrag verschiebt, kann der Fokus verloren gehen.
   - Ganz oben oder unten wird der gedrückte Knopf `disabled`, und der Fokus fällt weg.
   - Die neue Position wird nicht angesagt.
   - Vorschlag: nach dem Verschieben den Knopf am neuen Platz fokussieren, dazu ein `aria-live`-Satz wie „‚…‘ steht jetzt an Platz 2“.

9. **`tests/browser/book-normalization.mjs:61` erlaubt jeden neuen Schlüssel.** Die Regel „Runde je Eintrag“ lässt beliebige neue Schlüssel zu. Vorschlag: nur die erwarteten Präfixe erlauben (`items:`, `topicAnswer:`, `claimWort:`, `ordnen:`). So bleibt die Prüfung fast so streng wie vorher.

10. **Ein Satz steht fest im Code statt in `WOERTER`.** In `app/world-games.tsx` (Flaggen) steht `'Noch nicht ganz. '+c.name+…'es noch einmal!'` direkt im Code.

## Die drei geänderten Testregeln
- **`book-normalization` (Runde je Eintrag):** Sauber begründet. Jeder alte Wert wird weiter genau verglichen; erlaubt sind nur neue Schlüssel. Besser mit der Präfix-Liste aus Befund 9.
- **`retained-answer-wording` (gemischte Reihe):** Sauber. Geprüft werden dieselbe Menge, dieselbe Reihe nach dem Neuladen und dass die Reihe im Pass unverändert bleibt („interpretation never overwrites original import evidence“). Dass die Mischung meist von der Datenreihenfolge abweicht, prüft der Unit-Test.
- **`karte-hilfen` / `lesetexte` („Selbst beobachten“ und Lernziel freiwillig):** Begründet. Was da ist, wird weiter am richtigen Ort geprüft. Heute haben noch alle 107 Karten beide Felder. Es gibt aber keinen Datentest, der eine versehentliche Löschung oder einen leeren Text fängt. Vorschlag: in `kartenFeldFehler` die Regel „wenn vorhanden, dann nicht leer“.

## Geprüft und in Ordnung
- **Stufe im Pass** (`app/kern/stufe.ts`, `use-local-progress.ts`, `progress-storage.ts`):
  - Ohne eigene Wahl gilt die alte Quiz-Stufe; ein kaputter Eintrag zählt wie ein fehlender.
  - `settings.difficulty` bleibt unverändert im Pass.
  - Dieselbe Stufe noch einmal wählen schreibt nichts, und `lastActivity` bleibt.
  - Bei mehr als 2000 Spielständen bleibt `kern:stufe` erhalten.
  - Altpass v2, Import/Export, Neuladen, zwei Tabs und Fehlerfall sind getestet (`tests/pass-spielstaende.test.mjs`).
  - Eine angefangene Quizrunde mit „Einfach“ läuft mit ihrer Stufe weiter (`earth-explorer.tsx:164`).
- **IDs:**
  - `stable-ids.json` ist nur gewachsen: 12 Zusatzfragen und `history-stone_tools:ordnen-1`.
  - Ruhende Fragen bleiben in den Daten: 3 Challenge-Fragen und `person-jane_goodall:rate-2`.
  - Eine Challenge-Frage kollidiert mit keiner Karten-ID, und es gibt keine doppelten IDs.
  - `world-index`- und `game-index`-IDs sind unverändert; Hash-Routen sind nicht berührt.
- **Wissens-Challenge:**
  - `createChallenge` lässt ruhende Fragen weg; `restoreChallenge` findet sie weiter.
  - Mehrere frühere Antwortsätze je Frage und die alte Frage über `beforePrompt` werden richtig aufgelöst.
  - Neue Bedingung: Die richtige Antwort muss gleich bleiben.
- **Fragenauswahl:** `ersteFrage`, `fragenFuerStufe` (stabile Sortierung), `stufenHinweis`, `gueltigeReihe`/`festGemischt` und „Noch eine Frage“ in der Liste der Stufe.
- **Wiederholung:** „Noch einmal raten“ gibt es nur nach einer richtigen Antwort, die Frage ist dann nicht fällig. Richtig nach falsch in derselben Runde bessert nach.
- **Neue Bausteine:** „Fast richtig“ speichert getrennt (`claimWort:`). „Ordne richtig“ erscheint erst ab seiner Stufe.
- **Läufe:** `pnpm run typecheck` und `pnpm run lint` grün, `pnpm test` 432/433 (siehe Befund 3).

## Nicht geprüft
- Browser-Suiten (`test:browser`, `karte-stufen`, `pass-spielstaende`) und WebKit/Firefox.
- CSS und Darstellung bei 320 px, `prefers-reduced-motion` der neuen Bausteine.
- Die Inhalts-JSONs (`world-catalog.json`, `challenge-hints.json`, `exports/`), wie gewünscht.
- Offline-Paket und Build.
- Der Fokus bei „Ordne richtig“ im echten Browser.

Wichtige Dateien:
- /home/user/wunderkompass/app/kern/stufen-vorschlag.tsx
- /home/user/wunderkompass/app/kern/stufen-wahl.tsx
- /home/user/wunderkompass/app/kern/karte/wissenskarte.tsx
- /home/user/wunderkompass/app/kern/karte/rate-mal.tsx
- /home/user/wunderkompass/app/kern/karte/ordne-richtig.tsx
- /home/user/wunderkompass/app/retained-answer-wording.mjs
- /home/user/wunderkompass/tests/gespeicherte-antworten.test.mjs
- /home/user/wunderkompass/tests/karten-inhalt.test.mjs
- /home/user/wunderkompass/tests/browser/book-normalization.mjs
