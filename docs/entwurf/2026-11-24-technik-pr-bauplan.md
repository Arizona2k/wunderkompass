# Bauplan: Technik-PR nach den Analysen (Stand 24.11.2026, nur gelesen, nichts geändert)

Helfer: technik-pruefer (sonnet / high), 24.11.2026. Nur gelesen, nichts geändert. Grundlage für den Technik-PR (BACKLOG „Technik-PR nach den Analysen“).

**Ergebnis:** Alle drei Punkte sind klein und in einem PR machbar. Eine Annahme der Aufgabe stimmt nicht: Pinnen ändert im Lockfile doch 9 Zeilen (Punkt 3). Die Speicher-Wiederholung hat eine Falle: Das Debounce darf die Wiederholung nicht aushungern (Punkt 1). Gelaufen sind nur `tests/progress.test.mjs` und `tests/pass-spielstaende.test.mjs` (27 Tests grün, vor jeder Änderung). Kein Build, kein Browser, kein Install.

Reihenfolge der Commits: (a) Punkt 3, unabhängig. (b) Punkt 1 mit Test. (c) Punkt 2 mit Test.

---

## Punkt 1: Speicher-Wiederholung und `emit` (`app/local-progress-store.ts`)

**Heute:**
- `emit` (Z. 18) baut immer ein neues Zustandsobjekt `{...state,...patch}` und ruft alle Listener. `useSyncExternalStore` sieht darum jedes Mal eine Änderung.
- `schedule` (Z. 44) setzt immer 200 ms.
- `flush` (Z. 45–71): Der `catch` (Z. 66–67) macht `emit({storage,available})`, setzt aber `dirty` nicht zurück. Das `finally` (Z. 69) ruft bei `dirty&&!readOnly` wieder `schedule()`. Bei dauerhaft kaputter IndexedDB entsteht so eine Endlosschleife: alle 200 ms ein `writeJournal`, ein `indexedDB.open` und ein Render.
- Weitere `schedule()`-Aufrufe: Z. 77 (`update`), Z. 101 (`start`), Z. 102–103 (Nachricht von einem anderen Tab).
- `flush` direkt aufgerufen: `pagehide` und `visibilitychange` hidden (Z. 105–106) und `LearningOffline onBeforeReload={local.flush}` (`app/earth-explorer.tsx:341`). Diese Aufrufe fragen den Timer nicht und müssen sofort versuchen. Das bleibt so.

**Kleinste saubere Änderung:**
1. `emit` mit Vergleich: Läuft nur, wenn mindestens ein Feld aus `patch` per `Object.is` vom Stand abweicht. Sonst `return`. Das beendet die Render-Schleife. Primitive (`storage`, `available`, `notice`) werden dedupliziert. `save` ist fast immer ein neues Objekt, das emittiert weiterhin. Keine inhaltliche Prüfung von `save` einbauen.
2. Zähler `failures`, Leiter `delay()` = `failures ? Math.min(30_000, 1000*2**(failures-1)) : 200`:
   - Im `catch` nur bei echtem Fehler `failures++`, also bei `tick===generation&&!readOnly`. Das ist derselbe Zweig wie Z. 67.
   - Bei Erfolg (Z. 64) `failures=0`. Auch in `replace()` (Z. 82) und `protect()` auf 0.
   - `schedule()` benutzt `delay()`.
3. **Falle:** `update()` ruft `schedule()` und damit `clearTimeout`. Bei Fehlern und laufendem Spiel würden Änderungen im Abstand unter der Pause den Wiederholungs-Timer immer wieder verschieben, und er liefe nie. Darum in `schedule`: Ist `failures>0` und schon ein Timer geplant, nichts neu setzen. Dafür ein Flag `pending`, das der Timer-Callback löscht.
4. Die Obergrenze 30 s statt der 60 s aus der Analyse. Der Pass steckt im Journal (localStorage, synchron je Änderung, Z. 77). Die Lücke betrifft nur den Fall „localStorage voll und IndexedDB flackert“. Dort hilft `pagehide`/hidden-`flush`.
5. `visibilitychange` sichtbar: bei `dirty` `failures=0` und `schedule()`.
6. Das `online`-Ereignis aus der Analyse weglassen: IndexedDB-Fehler haben nichts mit dem Netz zu tun.

**Bestehende Tests, die das berühren:**
- Unit:
  - `tests/progress.test.mjs:23–39` und `tests/pass-spielstaende.test.mjs:52–70` rufen `store.start()`, `update`, `flush`. Sie nutzen einen Fake mit `window.addEventListener(){}` und `document.addEventListener(){}`. Ein zusätzlicher Listener ist unschädlich.
  - Der Normalpfad (200 ms, Erfolg) bleibt gleich.
- Browser:
  - `tests/browser/storage-feedback.mjs` (Teil von `backup`, CI-Satz): Fälle `denied` und `quota-and-idb-abort`. Er erwartet den Text „Dieser Browser erlaubt gerade kein Speichern …“ (`app/earth-explorer.tsx:344`). Der kommt weiter: `emit({storage:'session',available:false})` ändert beim ersten Fehler den Zustand.
  - `tests/browser/pass-spielstaende.mjs` ist das einzige weitere Browser-Modul, das IndexedDB anfasst.
  - Gesucht nach `indexedDB`, `IDBDatabase`, `QuotaExceeded`: nur diese beiden. Nach `retry`, `200 ms` und `visibilitychange` gibt es in den Tests keine Treffer.
  - Größenbudget: ein paar Zeilen im Entry-Bundle. `pnpm run build` meldet es.

**Neue Tests:**
- Neue Datei `tests/speicher-wiederholung.test.mjs`. Eigene Datei ist nötig, denn `progress-storage.ts` merkt sich die Datenbank-Verbindung pro Prozess (Kommentar in `tests/pass-spielstaende.test.mjs:12`).
- Fake wie in `progress.test.mjs:21–25`, aber `indexedDB.open` zählt Aufrufe und löst `onerror` aus. Zeit mit `mock.timers.enable({apis:['setTimeout']})` und `tick` (`mock` wird schon in `tests/browser-suites.test.mjs` benutzt). Zwischen den Ticks Promises leeren, etwa `await new Promise(r=>setImmediate(r))`.
- Fälle:
  1. Dauerhafter Fehler, 5 s künstliche Zeit: Zahl der `open`-Aufrufe und der Listener-Aufrufe ≤ etwa 8 (heute etwa 25). Weite Toleranz, damit nichts flackert.
  2. `getSnapshot()` bleibt zwischen zwei fehlgeschlagenen Flushes dieselbe Referenz (prüft `emit`).
  3. Pass bleibt erhalten: `JSON.parse(data.get(SAVE_KEY)).progress` enthält die Änderung. Ein neuer `createProgressStore()` über denselben Fake-localStorage liest sie (Reload).
  4. Altpass: Start mit `LEGACY_KEY` bei kaputter IndexedDB. Nach 5 s steht er im Journal, und ein Neustart des Stores sieht alles.
  5. Erholung: Fake schaltet auf „geht“. Nach höchstens 30 s künstlicher Zeit steht die Änderung in `persisted`. Danach ist `failures` zurück: Die nächste Änderung wird nach 200 ms gespeichert.
  6. Aushungern: Änderungen alle 500 ms über 10 s bei Fehler. Es gibt trotzdem Versuche, aber nur wenige.
  7. Newer-Pass-Schutz (`readOnly`) bleibt: kein Timer nach `protect()`.

---

## Punkt 2: Eine Importgrenze (`app/progress-panel.tsx:14`, `app/local-progress-store.ts:110–111`)

**Heute:**
- Auswahl: `f.size>2_600_000` (**Bytes**, `progress-panel.tsx:14`). Dann liest und prüft `choose()` die Datei strikt (`restoreSave(JSON.parse(raw),true)`).
- Bestätigen: `importSave` lehnt `raw.length>2_000_000` (**Zeichen**) ab (`local-progress-store.ts:110`). Der Fehler erscheint erst im Dialog.
- Export: `backup()` (Z. 111) ist `JSON.stringify(state.save,null,2)` ohne Grenze. Das ist etwa 40 % größer als kompakt (Zahl aus Teil 2 der Bewertung).
- Der Kommentar `app/progress-storage.ts:51–52` nennt „höchstens 2,6 MB“.

**Kleinste saubere Änderung:**
1. In `app/progress-storage.ts` (beide Dateien importieren schon daraus) eine Konstante `MAX_IMPORT_BYTES = 2_600_000`. Der Kommentar Z. 51–52 verweist darauf.
2. Panel Z. 14: `f.size>MAX_IMPORT_BYTES`.
3. Store Z. 110: `raw.length>MAX_IMPORT_BYTES`. Das ist nur ein Netz für Aufrufer ohne Oberfläche. Zeichen sind höchstens so groß wie Bytes, darum nimmt der Store alles, was die Oberfläche annimmt.
4. Wirkung: Der Store nimmt jetzt mehr an (2,0 bis 2,6 MB), lehnt also nichts Neues ab. Eine Datei mit vielen Umlauten und über 2,6 MB Bytes wird schon bei der Auswahl abgelehnt, nicht erst im Dialog. Der Text „Die Datei ist zu groß.“ bleibt gleich, denn `backup.mjs:63` erwartet `/zu groß/`.
5. Export: `backup()` nimmt die eingerückte Fassung. Ist ihre Byte-Länge größer als `MAX_IMPORT_BYTES`, nimmt es die kompakte (eine Zeile). Das gibt etwa 40 % Luft.
6. Ist selbst die kompakte Fassung zu groß, im Panel `download()` (Z. 13) nach dem Download eine Warnung statt „heruntergeladen“. Das Panel kennt `blob.size` schon. Der Text ist ein Kinder- und Eltern-Text und geht durch `kinder-redaktion`. Heute rein theoretisch, ein Pass hat nach Schätzung 0,2 bis 0,6 MB.

**Bestehende Tests:**
- `tests/browser/backup.mjs:63`: `future.json` und `large.json` (2 600 001 Bytes → `/zu groß/`, kein Dialog, Pass unverändert). Bleibt grün. Die Zahl dort als Literal lassen: Sie soll eine versehentliche Änderung der Konstante auffallen lassen.
- Weitere Importe über `setInputFiles`: `model-import-integrity.mjs` (über `backup`), `storage-feedback.mjs`, `people-learning.mjs:97`, `research-transfer.mjs:16`, `journey-transfer.mjs:13`. Alle klein.
- Unit: `tests/import-structure.test.mjs` und `tests/pass-spielstaende.test.mjs:21–35, 72–77` prüfen `restoreSave(…,true)`. Das ändert sich nicht.
- Nach `2_600_000`, `2_000_000`, `f.size`, `importSave` und `.backup(` gesucht: keine weiteren Treffer in Tests, `scripts/` oder `lib/`.

**Neue Tests:**
- Unit (Fake aus Punkt 1, z. B. in `tests/speicher-wiederholung.test.mjs` oder eigener Datei):
  - Gültiger Pass plus Leerzeichen-Auffüllung auf etwa 2,3 Mio. Zeichen. `importSave` klappt. Das ist ausgedacht aufgefüllt, kein echter Pass. Vorher schlug es fehl.
  - 2 600 001 Zeichen: wirft `zu groß`. Snapshot, Journal (`SAVE_KEY`) und `epoch` bleiben unverändert (Fehlerfall).
  - Export-Rundlauf: `restoreSave(JSON.parse(store.backup()),true)` ergibt denselben `progress` (Import/Export). Für einen Pass über der Grenze liefert `backup()` die kompakte Fassung unter dem Limit.
  - Der Fake aus `progress.test.mjs:21–25` und `pass-spielstaende.test.mjs:54–58` steht dann dreimal im Repo. Besser als kleine Hilfsdatei `tests/hilfen/fake-browser.mjs` (läuft nicht mit, `pnpm test` nimmt nur `tests/*.test.mjs`), und die zwei Altkopien darauf umstellen. Das ist optional und darf wegfallen.
- Browser: in `tests/browser/backup.mjs` direkt vor Z. 63 ein Fall „2,3 MB gültige Sicherung (aufgefüllt)“. Erwartet: Dialog öffnet, Wiederherstellen klappt, `favorites` stimmt. Das ist die Lücke aus Teil 2 (2,0 bis 2,6 MB, kein Test).

---

## Punkt 3: Neun `^` pinnen plus Wächter

**Die neun Pakete** (`package.json` Z. 26, 30, 31, 32, 34, 38, 42, 46, 56; `pnpm-lock.yaml` `specifier:` in Z. 28, 40, 43, 46, 52, 64, 71, 83, 113):

| Paket | package.json heute | im Lockfile (`version:`) | auch in `node_modules` |
|---|---|---|---|
| `@base-ui/react` | ^1.7.0 | 1.7.0 | ja |
| `cmdk` | ^1.1.1 | 1.1.1 | ja |
| `d3-geo` | ^3.1.1 | 3.1.1 | ja |
| `lucide-react` | ^1.31.0 | 1.31.0 | ja |
| `radix-ui` | ^1.6.7 | 1.6.7 | ja |
| `three` | ^0.186.1 | 0.186.1 | ja |
| `@types/d3-geo` | ^3.1.1 | 3.1.1 | nicht gesondert angesehen |
| `@types/three` | ^0.186.0 | 0.186.0 | ja |
| `tw-animate-css` | ^1.4.0 | 1.4.0 | ja |

**Korrektur zur Annahme:** Das Lockfile ändert sich doch. Es hält die Wunschangabe als `specifier: ^1.7.0` je Paket. `pnpm install --frozen-lockfile` (CI Z. 37, 102, 160) vergleicht diese mit `package.json` und bricht ab, wenn sie nicht passen. So kenne ich pnpm, ausprobiert habe ich es hier nicht. Nur die neun `specifier:`-Zeilen ändern sich, kein `version:`. `minimumReleaseAge` spielt keine Rolle, denn es wird nichts neu aufgelöst.

**Kleinste saubere Änderung:**
1. Neun `^` in `package.json` streichen.
2. Neun `specifier:`-Zeilen im Lockfile von Hand anpassen, oder `pnpm install --lockfile-only`. Danach muss `git diff pnpm-lock.yaml` genau 9 Zeilen zeigen. Jede andere Änderung heißt abbrechen und zurückdrehen.
3. Dann `pnpm install --frozen-lockfile`, das nichts ändern darf. Erst nach Ende der laufenden Prüfkette, denn es ist ein Install.
4. Wächter `tests/pakete.test.mjs`, etwa 10 Zeilen, läuft in `pnpm test`:
   - Liest `dependencies`, `devDependencies`, `optionalDependencies`. Jede Version muss exakt sein: `/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/`. Das ist strenger als „kein ^ oder ~“ und fängt auch `*`, `latest`, `>=`, `1.x`.
   - Die Meldung nennt das Paket.
   - Peer-Angaben bleiben außen vor. Ein Test gegen das Lockfile ist unnötig, `--frozen-lockfile` fängt es.
5. Optional, nicht geprüft: damit `pnpm add` künftig exakt schreibt, `saveExact: true` in `pnpm-workspace.yaml`. `pnpm config get save-exact` gibt `undefined`. Ob pnpm 11 den Schlüssel dort liest, habe ich nicht prüfen können. Der Wächter reicht.
6. Reste in `pnpm-workspace.yaml` (BACKLOG nennt „klären“): Es gibt eine frühere Entscheidung, dass `storeDir` bleibt (`docs/entwurf/2026-11-21-schritt-0-entscheidungen.md:46`). `.sites-runtime` steht in `.gitignore:34` und `eslint.config.mjs:12`. Vorschlag: nur den Kommentar in Z. 1 umformulieren. `storeDir` und `cacheDir` nicht anfassen, sonst ändert sich der Speicherort für die Installation.

**Nebenwirkung:** `build/learning-fingerprint.mjs` rechnet `package.json`, `pnpm-lock.yaml` und `pnpm-workspace.yaml` in die Offline-Kennung. Die Offline-Version ändert sich einmal, wie bei jeder App-Änderung. Kinder bekommen den normalen Aktualisieren-Hinweis, nichts geht verloren. Ein fest eingebauter Fingerabdruck steht in keinem Test (`tests/foundation.test.mjs` nutzt Temp-Ordner).

---

## Welche Suiten danach laufen

- `pnpm run check`. Darin laufen schon `backup` (mit `storage-feedback`, Import und Altpass-Reload), `pass-spielstaende`, `pass-atlas`, `offline-cold` und `journey-transfer` in Chromium, dazu `backup` und `offline-cold` in WebKit.
- Zusätzlich lokal in Firefox: `node tests/browser/run.mjs --suite ci --browser firefox backup pass-spielstaende`. In der CI läuft das ohnehin als Engine-Schnellprüfung. Auto-Merge erst einschalten, wenn die grün ist (Regel in `CLAUDE.md`).
- Große Suiten (`core`, `journeys`, `offline-cold-full`): nicht nötig. Im Normalpfad ändert sich nichts, und der Fehlerpfad ist nur in `backup` getestet. Wer sicher gehen will: `playground`, weil dort viel gespeichert und neu geladen wird. Das Phasenende deckt den Rest.
- `pnpm run check` darf erst starten, wenn die laufende Prüfkette auf `dist/` fertig ist.

## Nachführen

- `BACKLOG.md` Eintrag „Technik-PR nach den Analysen“ abhaken. Die „später bei Anlass“-Punkte bleiben stehen.
- `STATUS.md` und `CHANGELOG.md` mit Messwerte-Zeile.
- Ein Eintrag in „Was ist neu?“ ist nicht nötig, denn für Kinder ändert sich nichts Sichtbares. Das ist nur eine Einschätzung, die Regel in `CLAUDE.md` sagt „sichtbare Änderungen“.

## Risiken: was auf keinen Fall passieren darf

1. **Pass-Verlust im Fehlerfall:** Die Wiederholung darf nur später versuchen, nie aufgeben. `dirty` bleibt bei Fehlern `true`, das Journal wird weiter bei jeder Änderung synchron geschrieben, und `pagehide`/hidden-`flush` bleiben ohne Wartezeit. Test 3 bis 5 zu Punkt 1 decken das ab.
2. **Dedupe darf `restoreRevision` und `notice` nicht verschlucken.** Beide ändern sich, also emittiert `emit`. Der Pfad `protect()` (neuerer Pass, „bleibt unverändert erhalten“) muss weiter die Meldung zeigen. Ein Test dafür ist sinnvoll.
3. **Debounce-Aushungern** (Punkt 1, Nr. 3): Ohne das Flag wird bei laufenden Änderungen und Fehlern nie wiederholt.
4. **Importgrenze:** Das Limit darf nie sinken. Heute akzeptierte Dateien bis 2,0 MB müssen weiter gehen. Die Änderung hebt das Limit im Store nur an.
5. **Export darf nie still eine nicht wiederherstellbare Datei liefern:** darum die kompakte Fassung und die Warnung.
6. **Lockfile:** Es dürfen sich nur 9 `specifier:`-Zeilen ändern. Sonst stimmt etwas nicht, und es bleibt beim alten Stand. Kein `pnpm update`, keine Versionssprünge. Playwright steht unverändert auf 1.65.1. Nachfolgende Updates (React 19.3, Tailwind 4.3, `lucide-react` und andere) bleiben eigene Commits.
7. **Fehlerfall im PR:** Schlägt `pnpm run check` oder der Firefox-Lauf fehl, nicht abschwächen und nicht wiederholen. Den Commit zurückdrehen und die Ursache klären. Wird etwas spät gefunden (CI statt `check`), danach `technik-pruefer`.

## Nicht geprüft

- Kein Lauf von Build, Browser-Suiten oder `pnpm install`, wie vorgegeben.
- Das Verhalten von `pnpm install --frozen-lockfile` bei geänderten Specifiern ist aus pnpm-Kenntnis geschlossen, nicht ausprobiert.
- `saveExact` in pnpm 11 nicht geprüft.
- Echte Pass-Größen und das Verhalten realer Browser bei kaputter IndexedDB nicht gemessen. Die Fehlerschleife kommt aus dem Code, nicht aus einem Lauf.
- `BACKLOG.md` und `CHANGELOG.md` haben schon ungespeicherte Änderungen im Arbeitsbaum (unabhängig von diesem PR).

Wichtigste Dateien:
- `/home/user/wunderkompass/app/local-progress-store.ts`
- `/home/user/wunderkompass/app/progress-panel.tsx`
- `/home/user/wunderkompass/app/progress-storage.ts`
- `/home/user/wunderkompass/package.json`
- `/home/user/wunderkompass/pnpm-lock.yaml`
- `/home/user/wunderkompass/tests/browser/backup.mjs`
- `/home/user/wunderkompass/tests/browser/storage-feedback.mjs`
- `/home/user/wunderkompass/tests/progress.test.mjs`
- `/home/user/wunderkompass/tests/pass-spielstaende.test.mjs`
