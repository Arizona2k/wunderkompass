# Technik-PR: Code-Prüfung

Helfer: code-pruefer (opus / high), 25.11.2026. Nur Befunde, ändert nichts.

Ergebnis: 0 Muss, 1 Soll, 4 Kann. Der PR ist mit kleinen Änderungen bereit. Ich habe keinen Weg gefunden, auf dem ein Pass-Stand verloren geht.

**Soll**

1. `app/local-progress-store.ts:20` und `:55`: Die lange Pause gilt auch dann, wenn zusätzlich das Journal fehlschlägt (`localOK=false`, Zustand `storage:'session'`).
   - Fall: localStorage ist voll oder gesperrt (z. B. Safari privat), und IndexedDB fällt kurz aus. Der Pass liegt dann nur noch im Arbeitsspeicher.
   - Nach 5 Fehlern wartet der Store bis zu 30 s. Erholt sich die Datenbank in dieser Zeit und das Kind schließt den Tab, bleibt nur der `pagehide`-Flush. Ob dessen Transaktion beim Schließen noch fertig wird, ist nicht sicher.
   - Vorher gab es nach 200 ms einen neuen Versuch, das Fenster ohne Speicherung war also viel kürzer.
   - Vorschlag: Wenn `writeJournal()` fehlschlug, die Pause deckeln (z. B. höchstens 2 s) oder die alten 200 ms behalten. Die lange Pause dann nur, solange das Journal sicher ist.

**Kann**

1. `app/progress-storage.ts:129-135`, ein Altfehler, nicht neu: `database()` merkt sich die Verbindung auch dann, wenn der Browser sie später schließt (WebKit nach längerer Zeit im Hintergrund).
   - `db.transaction` wirft dann bei jedem Versuch. Der Store „erholt“ sich bis zum Neuladen nie; die neue Pause macht das nur seltener.
   - Daten gehen nicht verloren: Das Journal ist da, und beim nächsten Start gewinnt es über `updatedAt` (Zeile 111).
   - Vorschlag fürs BACKLOG: Bei einem Fehler beim Schreiben `connection=null` setzen.
2. `app/local-progress-store.ts:45`: Ersetzt ein anderer Tab den Pass (Wiederherstellen oder Zurücksetzen), setzt `receive` den Fehlerzähler `failures` nicht zurück.
   - Folge: Der Tab wartet bis zu 30 s, obwohl die Datenbank offensichtlich wieder geht. Die Daten sind dabei im Journal, also kein Verlust.
3. `tests/pakete.test.mjs:12`: Der Wächter prüft nur `dependencies`, `devDependencies` und `optionalDependencies`.
   - `overrides` in `pnpm-workspace.yaml` und `peerDependencies` sieht er nicht. Die Overrides sind heute alle exakt.
   - Er fängt ^, ~, *, latest, >=, 1.x, Bereiche, `workspace:`, `npm:`, `file:` und Git-Adressen. Er ist strenger als npm (lehnt auch `v1.2.3` und `=1.2.3` ab), das schadet nicht.
4. Lücken in den Tests:
   - `tests/browser/backup.mjs:57` prüft die Dateiauswahl nur mit 2 600 001 Bytes (abgelehnt). Dass genau 2 600 000 Bytes noch angenommen werden, prüft nur der Unit-Test für den Store, nicht `f.size` im Panel.
   - Der neue Zweig beim Zurückkehren in den Tab (`visibilitychange`, sichtbar → Zähler zurück, neuer Versuch nach 200 ms; Zeile 118) hat keinen Unit-Test.

**Geprüft und in Ordnung**

- **Pakete (94aedc4):** Alle neun gepinnten Versionen sind genau die, die das Lockfile vorher auflöste. Im Lockfile änderte sich nur die `specifier`-Zeile, keine `version:`-Zeile.
- **Kein Verlust beim Speichern:**
  - Jede Änderung steht weiter sofort im Journal (`update` → `writeJournal`).
  - `replace` und `protect` beenden die geplante Wiederholung (`stop()`) und setzen den Zähler zurück.
  - Ein Flush aus `pagehide` oder beim Verlassen des Tabs umgeht die Pause. Gelingt er, sorgt `failures=0` im `finally` wieder für 200 ms.
  - Es gibt keinen Zustand, in dem `pending=true` ohne Timer bleibt. Die Pause wächst nur bis 30 s (auch bei `2**n` → Infinity).
  - Ein laufender Flush und ein Timer verdoppeln sich nicht (`flushing`).
  - Zweiter Tab über BroadcastChannel und storage-Event: Eine Änderung verschiebt die Wiederholung nicht.
- **`emit` mit `Object.is`:** Alle Pfade, die den Pass ändern, liefern ein neues Objekt (`update`, `mergeSaves` per Spread). `mergeSaves` gibt nur dann `local` (= `state.save`) zurück, wenn sich nichts ändert, und dann ist Weglassen richtig. `restoreRevision` steigt immer. Den Pass ändert nirgends etwas direkt im Objekt; ein Callback, der das Objekt selbst verändert, bricht schon vorher an Zeile 86 ab, wie bisher. Ich habe keinen Fall gefunden, in dem eine echte Änderung verschluckt wird.
- **Grenze (e569629):** `File.text()` liest UTF-8 und entfernt das BOM. Jedes Zeichen braucht 1 bis 4 Bytes und ergibt 1 bis 2 UTF-16-Einheiten, Emoji also 2 Einheiten auf 4 Bytes. Ungültige Bytes werden je zu einem U+FFFD. Damit gilt `raw.length ≤ f.size` immer. `importSave` hat nur einen Aufrufer (`progress-panel.tsx` → `onImport`).
- **Export:** `backup()` misst UTF-8-Bytes, genau wie `blob.size`. Jeder Export, den der Import ablehnen würde, löst die Warnung aus.
- **Ablehnung:** Bei Ablehnung bleibt der Pass unverändert, denn die Prüfung kommt vor `replace` (Unit-Test prüft Zustand, Journal und `epoch`).
- **Browser-Test:** Er bleibt aussagekräftig. Abbrechen mit der Originaldatei, Bestätigen mit der auf 2,3 MB aufgefüllten gültigen Datei, danach dieselben Erwartungen in beiden Tabs. `fs` ist importiert, `file` ist der Pfad der heruntergeladenen Sicherung.
- **Unit-Tests:** Die drei Dateien laufen grün (11 von 11) mit `node --import ./scripts/test-runtime.mjs --test`. Der Test „Laufende Änderungen …“ würde fehlschlagen, wenn man die Sperre in `schedule` entfernt. Der Test zur dauerhaft kaputten Datenbank würde ohne die `Object.is`-Prüfung an der Zahl der Meldungen fehlschlagen.

**Nicht geprüft**

- Browser-Suiten: nicht gestartet, wie gewünscht.
- `pnpm run typecheck` und `pnpm run lint`: nicht ausgeführt, die Prüfkette läuft parallel.
- Ob `pagehide`-Transaktionen in echten Browsern fertig werden: nicht gemessen.

Dateien:
- /home/user/wunderkompass/app/local-progress-store.ts
- /home/user/wunderkompass/app/progress-storage.ts
- /home/user/wunderkompass/app/progress-panel.tsx
- /home/user/wunderkompass/tests/pakete.test.mjs
- /home/user/wunderkompass/tests/speicher-wiederholung.test.mjs
- /home/user/wunderkompass/tests/pass-import-grenze.test.mjs
- /home/user/wunderkompass/tests/browser/backup.mjs
