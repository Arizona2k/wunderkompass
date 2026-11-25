# Technik-PR: Code-Nachprüfung

Helfer: code-pruefer (opus / high), 25.11.2026. Nur Befunde, ändert nichts.

**Ergebnis:** Bereit mit einer kleinen Änderung: 0 Muss, 1 Soll, 2 Kann. Ich habe keinen Weg gefunden, auf dem ein Pass-Stand verloren geht oder ein neuerer Pass überschrieben wird. Allerdings hält `journalSafe` sein Versprechen („höchstens 2 s“) nicht in jedem Pfad.

## Soll

1. **`app/local-progress-store.ts:90` (zusammen mit `:56` und `:80`): Die 2-s-Grenze greift nicht, wenn das Journal erst während einer schon laufenden langen Pause ausfällt.**
   - `journalSafe` wird nur im `catch` von `flush` gesetzt (Zeile 80). Ein Pfad bleibt offen:
     - `update` merkt den Journal-Fehler (`ok=false`).
     - `schedule()` kehrt dann sofort zurück, weil `failures>0&&pending` gilt.
     - Der schon geplante 30-s-Timer bleibt stehen.
   - Fall:
     - IndexedDB fällt aus, das Journal geht noch.
     - Nach 5 Fehlern läuft die 30-s-Pause.
     - Jetzt wird localStorage voll, und das Kind tippt etwas an.
   - Folge: Der Pass liegt bis zu ~30 s nur im Arbeitsspeicher. Das ist dasselbe Risiko wie im alten Soll 1, aber nur einmal pro Fehlerserie.
   - Nachgemessen mit einem Wegwerf-Test in einer Kopie im Scratchpad (nicht im Repo): Bis zum nächsten Versuch vergingen **29 200 ms**, mit `storage:'session'` und `available:false`.
   - Vorschlag: Nur beim Wechsel von „Journal sicher“ zu „Journal kaputt“ einmal neu planen. Dann verschiebt eine laufende Änderung den Timer nicht immer wieder.
     ```ts
     const ok=writeJournal();
     if(!ok){emit({available:state.storage==='database'});if(journalSafe&&failures>0){journalSafe=false;stop();}}
     schedule();
     ```
     Dazu einen Unit-Test nach dem gleichen Muster: 32 s warten, dann `journalVoll=true` und `update`. Danach muss innerhalb von ≤2 s ein Versuch kommen.

## Kann

1. **`app/progress-storage.ts:133` und `:137`: `connection=null` prüft nicht, ob noch die eigene Verbindung gemerkt ist.**
   - Erster Fall:
     - Zwei Aufrufe halten noch die alte, geschlossene `db1`, z. B. ein Flush aus `pagehide` und ein `replace`.
     - Der erste wirft in `transaktion`. Danach öffnet ein dritter Aufruf schon `P2/db2`.
     - Jetzt wirft auch der zweite Aufruf mit `db1` und setzt `connection=null`. Damit ist `P2` vergessen.
   - Zweiter Fall: Ebenso kann ein spätes `onclose` von `db1` die neue Verbindung löschen, nachdem `transaktion` sie schon neu geöffnet hat.
   - Folge: `db2` bleibt offen, ohne dass jemand sie nutzt. Beim nächsten Aufruf wird ein drittes Mal geöffnet.
   - Kein Datenverlust, und ein Versions-Upgrade wird nicht blockiert, denn `db2` hat weiter `onversionchange → close()`. Timer im Store verdoppeln sich nicht, denn `flushing` und `pending` hängen nicht an der Verbindung.
   - Doppelt ausgelöst wird nichts: `onclose` feuert laut Spezifikation nur bei einem erzwungenen Schließen, nicht nach `db.close()` aus `onversionchange`.
   - Vorschlag: Die geöffnete `db` mit merken, z. B. `let current:IDBDatabase|null`, und nur dann zurücksetzen, wenn sie noch die aktuelle ist: `if(current===db){connection=null;current=null;}` (in `transaktion` und `onclose`). Darf auch ins BACKLOG.
2. **`tests/speicher-wiederholung.test.mjs:196-211`: Der `onclose`-Zweig ist nicht getestet.**
   - Der Test bildet nur „`db.transaction` wirft“ nach. Die Attrappe ruft nie `db.onclose` auf.
   - Die Zeile ist trivial, darum nur Kann. Ein Zweizeiler würde reichen: `db.onclose?.()`, danach muss `oeffnungen` steigen.

## Geprüft und in Ordnung

- **Gegenproben**, gelaufen in Kopien unter `/tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/` (Repo unverändert):
  - Ohne `connection=null` in `transaktion` scheitert genau „Schließt der Browser die Verbindung …“.
  - Ohne `journalSafe=localOK` scheitert genau „Ist auch der Browser-Speicher voll …“ (`Versuche in 30 s: 5`).
  - Ohne den `visibilitychange`-Zweig (`failures=0;stop();schedule()`) scheitert genau „Zurück im Tab …“.
  - Alle drei Tests sind also aussagekräftig.
- **Unit-Tests:** `tests/speicher-wiederholung.test.mjs` und `tests/pass-import-grenze.test.mjs` laufen grün, 13 von 13.
- **`journalSafe` in den übrigen Pfaden:**
  - Nach `replace`, `protect`, `receive` (bei Ersetzen) und nach erfolgreichem Flush ist `failures=0`. Dann gilt `delay()=200`, ein veralteter `journalSafe`-Wert spielt keine Rolle.
  - Beim nächsten Fehler wird `journalSafe` neu gesetzt.
  - Ein veralteter Wert `false` führt nur zu häufigeren Versuchen, nie zu Verlust.
  - Offen bleibt nur der Fall unter Soll 1.
- **`receive` mit `failures=0;stop()`** (Zeile 46):
  - `stop()` beendet nur einen Timer, dessen Flush wegen `dirty=false` ohnehin nichts täte.
  - Ein laufender Flush bricht über `tick!==generation` ab, und sein `finally` plant nichts neu, weil `dirty=false` ist.
  - Kein neuer Weg, auf dem ein Schreibvorgang verloren geht. Der Merge-Pfad selbst ist unverändert.
- **`transaktion`:**
  - Der Store nutzt die Hilfe in Flush (Zeile 66) und `replace` (Zeile 99), `readDatabase` und `writeDatabase` nutzen sie auch.
  - Wirft sie, landet `replace` im `catch`. Danach greifen `requireDurable` und das Journal wie bisher.
  - Im Flush zählt `failures++`, der nächste Versuch öffnet neu.
  - Vor einer Wiederherstellung steht das Journal schon (Zeile 97). Bei `requireDurable` meldet der Store ehrlich einen Fehler.
- **Kein Überschreiben eines neueren Passes:** Die `future()`-Prüfung vor dem `put` und `protect()` sind unverändert. Das Neuöffnen ändert nichts an der Reihenfolge Lesen, Prüfen, Schreiben in derselben Transaktion.
- **Meldungen in `app/progress-panel.tsx:13-14` und `local-progress-store.ts:124`:**
  - Die Aussage „Dein Pass … bleibt, wie er ist“ stimmt, denn die Größenprüfung kommt vor `replace`.
  - „Beginne deinen Pass … nicht neu“ passt zum Knopf „Pass neu beginnen“.
  - Der Browser-Test sucht weiter nach `/zu groß/`, das passt zum neuen Text.
- **`tests/browser/backup.mjs:66`:**
  - Genau 2 600 000 Bytes: `f.size>MAX` ist falsch, und `raw.length ≤ f.size`, also nehmen Panel und Store die Datei an.
  - 2 600 001 Bytes werden weiter abgelehnt (Zeile 63). Die Grenze ist damit von beiden Seiten geprüft.
  - Nur gelesen, nicht gestartet.

## Nicht geprüft

- Browser-Suiten (wie gewünscht), darum auch nicht das echte `onclose`- und `InvalidStateError`-Verhalten in WebKit.
- `pnpm run typecheck` und `pnpm run lint`: Die Prüfkette läuft parallel.
- `pnpm-workspace.yaml` und die Berichtsdateien der Commits (nicht in `app/` oder `tests/`).

Dateien:
- /home/user/wunderkompass/app/local-progress-store.ts
- /home/user/wunderkompass/app/progress-storage.ts
- /home/user/wunderkompass/app/progress-panel.tsx
- /home/user/wunderkompass/tests/speicher-wiederholung.test.mjs
- /home/user/wunderkompass/tests/browser/backup.mjs
