# Bewertung zweier weitergeleiteter Analysen (24.11.2026)

Der Nutzer hat am 24.11.2026 abends zwei Analysen weitergeleitet („unabhängige GitHub-Analyse“ und „Ergänzende Analyse“, Stand test-live). Sie sind ausdrücklich keine nachgewiesenen Fehler; der Nutzer bittet um kritische Prüfung: „wir wollen es verbessern, nicht verschlechtern“. Diese Datei hält fest, was Claude daraus macht. Teil 1 ist Claudes erste Bewertung; Teil 2 ergänzt die Nachprüfung der technischen Behauptungen am Code durch den `technik-pruefer`.

## Teil 1: Erste Bewertung (Claude)

**Übernehmen (passt und fehlt noch):**
- *Einheitlicher Qualitätsmaßstab für alles* und *Bewährtes übertragen*: steht im Kern schon in „Kein Bestandsschutz“ und „Wachsen lassen“; kurz und ohne neue Bürokratie als eine Regel in `CLAUDE.md` ergänzt („Qualitätsmaßstab für Altes, Neues und Künftiges“), dazu die Regel „Einheitlich und stimmig, überall“ (Wunsch des Nutzers am selben Abend).
- *Unterlagen schlanker*: berechtigt. `STATUS.md` ist über die vereinbarten 60 Zeilen hinausgewachsen (lange Absätze je PR), `BACKLOG.md` hat viele erledigte Punkte. Vorschlag: beim nächsten Phasenschritt erledigte Punkte in eine Archivdatei verschieben und STATUS je PR auf zwei Zeilen kürzen (Messung durch `technik-pruefer`, Teil 2).
- *Technische Behauptungen* (Importgrenzen, Zeitzone, Speicherversuche, Sicherheitsheader, Offline-Speicher, Versionen): werden am Code nachgeprüft (Teil 2), erst dann umgesetzt.
- *Echte Kinder testen*: deckt sich mit der bestehenden Regel „echte Kinder bleiben die wichtigste Rückmeldung“. Konkreter Vorschlag an den Nutzer: nach jedem sichtbaren PR eine Frage an ein Kind (z. B. „Was war zu leicht, was zu schwer?“), Antwort kurz im Chat; Claude trägt sie ein.

**Schon geplant (Doppelungen, keine neue Aufgabe):**
- Abenteuerrouten über Welten → Lernrouten gibt es; Urzeit-Welt mit Dinosauriern und Fossilien ist im Katalog 2027 (Phase 3).
- Vermuten, ausprobieren, schließen → Teil C, Aufgabe 13 (Labore: erst ausprobieren, dann Frage; Experte mit Vermutung und Begründung).
- Neue 3D-Modelle nur mit echtem Lernnutzen → Phase 4, Punkt „3D-Modelle“ sagt genau das.
- Wissensdetektiv / Rätselgeschichten → Phase 2, „Knobelfälle und Schätzfragen“ (Detektivfälle mit Hinweisen aus drei Karten).
- Größere Dateien modularisieren „bei ohnehin anstehenden Änderungen“ → so arbeiten wir; konkrete Reihenfolge nach Teil 2.

**Vorsicht oder nicht jetzt:**
- *Lernerfolg messen* über „Verständnis und Übertragung“: ohne Konto und ohne Daten nur indirekt möglich (Experten-Fragen sind genau solche Übertragungsaufgaben). Kein Tracking, keine Auswertung über Kinder – das widerspräche der Datenschutz-Linie.
- *Innenwelten, Größenvergleich, Zeitmaschine, „Was wäre, wenn?“, Erfinderwerkstatt*: gute Richtungen, aber jede ist ein großes Vorhaben mit Inhalten, Bildern und Prüfungen. Erst nach Phase 1; ins BACKLOG (Ideen-Sammlung), je mit kritischem Blick auf Lernwert gegen Aufwand. Der Größenvergleich wurde in Teil A schon einmal bewusst gestrichen (Entscheidung zu Teil A); vor einer Neuauflage den Grund nachlesen.
- *„Automatisiert erkennen, wo Inhalte fehlen“*: teilweise schon da (Linkwächter, Inhaltswächter, Ratemuster-Test, Foto-Inventur). Ein weiterer Wächter lohnt nur, wo er etwas findet, das Kinder merken.

## Teil 2: Nachprüfung am Code (`technik-pruefer`)

Helfer: `technik-pruefer`, 24.11.2026 abends. Geprüft: die acht technischen Behauptungen der zweiten Analyse am Code. Nichts geändert. Bericht unverändert gesichert; Claudes Folgerungen stehen in Teil 3.

**Ergebnis:** Von den acht Behauptungen stimmen fünf ganz oder teilweise. Zwei davon sind wirkliche Schwächen im Code: ein Speicher-Wiederholungslauf ohne Ende (Punkt 2) und Importgrenzen, die nicht zusammenpassen (Punkt 1). Zeitzonen (3), große Dateien (7) und der Unterlagenumfang (8) sind weniger dringend. Punkt 6 (Pinning) ist ein Regelverstoß, aber ohne Folge für die Läufe. Für Kinder und ihre Daten gibt es nichts Dringendes. Keine Datei geändert, keine Builds oder Tests gestartet.

Was ich nur gelesen und nicht ausprobiert habe, steht unter „Nicht geprüft“. Ausgeführt habe ich nur lesende Befehle: `pnpm outdated`, `pnpm audit --prod`, `gh run list` und `gh run view`, eine kleine Größenrechnung mit node und die vorhandene Funktion `offlineAssetMetrics` auf das vorhandene `dist/`.

### 1. Importgrenzen des Passes: stimmt teilweise
**Beleg:**
- `app/progress-panel.tsx:14` lehnt Dateien über 2 600 000 **Bytes** ab (`f.size`).
- `app/local-progress-store.ts:110` lehnt `raw.length > 2_000_000` **Zeichen** ab, aber erst beim Bestätigen.
- Eine Datei zwischen 2,0 und 2,6 Millionen Zeichen besteht also die Auswahl und die Prüfung. Das Kind sieht den Bestätigungsdialog und erst nach „Wiederherstellen“ den Fehler „Die Datei ist zu groß“ (`restoreError`). Der aktuelle Pass bleibt unverändert, es geht nichts verloren.
- Für das Fenster 2,0 bis 2,6 MB gibt es keinen Test. `tests/browser/backup.mjs:63` prüft nur 2 600 001 Bytes.
- Der Export (`backup()`, `local-progress-store.ts:111`) hat keine Obergrenze. Er schreibt mit `JSON.stringify(...,null,2)` eingerückt, was in meiner Beispielrechnung rund 40 % größer ist als kompakt (34,9 KB gegen 24,9 KB).
- Theoretisch kann der Pass viel größer werden: `gameSessions` erlaubt 2000 Einträge zu je 400 000 Zeichen (`progress-storage.ts:53`), `favoritePlaces` 1000 Einträge, `review` 2000, `notes` 100 zu je 1000 Zeichen.

**Realistische Größe:**
- Es gibt heute 204 Karten, 31 Spiele, 16 Reisen und 11 Labore, also etwa 262 mögliche Spielstände.
- Bei der Testform aus `tests/pass-spielstaende.test.mjs` sind das rund 25 KB kompakt und 35 KB eingerückt.
- Echte Spielstände sind größer, ich schätze auf 0,2 bis 0,6 MB für ein Kind, das alles geöffnet hat. Das ist geschätzt, nicht gemessen.
- Eine selbst erzeugte Sicherung wird also heute praktisch nie über 2 MB kommen. Mit Phase 2 und 3 (mehr Karten, `progress-storage.ts:50` rechnet selbst mit „mehr“) und Notizen mit vielen Umlauten wächst der Abstand aber.
- Grenzfall: Eine Datei mit vielen Umlauten kann über 2 600 000 Bytes liegen und unter 2 000 000 Zeichen. Dann lehnt die Oberfläche sie ab, obwohl der Speicher sie nähme.

**Wirkung:** Kein Datenverlust und heute fast nie auslösbar. Die Fehlermeldung kommt aber an der falschen Stelle, und wächst der Pass weiter, könnte eine eigene Sicherung später nicht mehr zurückspielbar sein. Das wäre dann ein stiller Verlust der Rettungsmöglichkeit.

**Empfehlung (klein, Priorität bald, aber nicht eilig):**
- Eine gemeinsame Konstante, in einer Einheit.
- Das Limit im Speicher auf den Wert der Oberfläche anheben oder entfernen. Die Struktur-Grenzen schützen schon vor unsinnigen Dateien.
- Beim Export mit derselben Konstante prüfen und bei Überschreitung warnen oder kompakt schreiben.
- Einen Test für 2,0 bis 2,6 MB ergänzen.
- Die Pass-Regel in `CLAUDE.md` verlangt dafür einen Beleg mit Import/Export/Reload.

localStorage-Hinweis: Browser zählen dort etwa 5 MB in UTF-16, also rund 2,6 Millionen Zeichen. Das ist vermutlich der Ursprung der 2,6. Ein größerer Pass fällt beim Journal still auf IndexedDB zurück (`writeJournal` gibt `false` zurück). Das ist abgefangen und getestet (`tests/browser/storage-feedback.mjs`).

### 2. Speicherfehler, dauernde Wiederholung: stimmt
**Beleg:** In `app/local-progress-store.ts` setzt der `catch` von `flush` (Zeile ca. 59) `dirty` nicht zurück. Danach steht im `finally`: `if(dirty&&!readOnly)schedule()`, und `schedule` ruft nach 200 ms wieder `flush`. `database()` setzt bei Fehler `connection=null` und versucht beim nächsten Mal alles neu (`progress-storage.ts`, `database()`).

**Ablauf bei dauerhaft kaputter IndexedDB** (nicht verfügbar, Kontingent voll, Browser verweigert):
- Alle 200 ms läuft `writeJournal` (JSON lesen und neu schreiben) und ein neuer `indexedDB.open`.
- Danach folgt ein `emit({storage,available})`. `emit` erzeugt immer ein neues Zustandsobjekt (`state={...state,...patch}`). `useSyncExternalStore` meldet darum jedes Mal eine Änderung, und die große Komponente `EarthExplorer` rendert etwa fünfmal pro Sekunde neu.
- Die Schleife endet nie, solange die Seite offen ist, auch wenn das Journal in localStorage längst gespeichert ist (`localOK`).

**Wirkung:** Kein Datenverlust. Laufende CPU-Last und Akku auf Handy und Tablet, vor allem bei IndexedDB-Sperre oder vollem Speicher. Das ist ein seltener, aber realer Fall (z. B. Browser mit blockiertem Webspeicher). Gelesen, nicht gemessen. Das Verhalten steht nirgends im BACKLOG.

**Empfehlung (klein bis mittel, Priorität bald):**
- Ein begrenzter Wiederholungsmechanismus mit wachsender Pause (z. B. 1, 2, 4 … höchstens 60 s) statt der festen 200 ms.
- `emit` nur, wenn sich `storage` oder `available` wirklich ändern.
- Zusätzlich beim Zurückkehren in den Vordergrund (`visibilitychange`) und bei `online` neu versuchen.
- Ein Unit-Test mit künstlichem Fehler: Die Zahl der Versuche in 5 s bleibt klein, und der Pass bleibt im Journal erhalten.

### 3. Zeitzonen: stimmt teilweise (Wirkung sehr klein)
**Beleg:**
- „Heute“ für Wiederholungen ist überall UTC: `app/kern/auswahl.ts:31`, `app/kern/wiederholen.ts:5`, `app/kern/wiederholung.ts:8`, `app/earth-explorer.tsx:221` und `:225`, `app/kern/stufe.ts:33`, `app/world-game-runde.ts:98`.
- `app/use-local-progress.ts:21` (`review`) mischt: Es addiert die Tage lokal (`date.setDate(date.getDate()+n)`) und schneidet dann UTC ab (`toISOString().slice(0,10)`).
- `nachgebessert` rechnet dagegen mit `setUTCDate`.
- Die „Entdeckung des Tages“ läuft nach lokaler Mitternacht (`app/discovery-selection.ts:39` und `:65`). Auch das ist uneinheitlich, betrifft aber nicht die Wiederholungen.
- `dailyDay` (`earth-explorer.tsx:221`) wird nur beim Laden berechnet. Bleibt die Seite über UTC-Mitternacht offen, gilt der alte Tag, bis neu geladen wird.

**Was ein Kind in Deutschland merkt:**
- Zwischen 0:00 und 1:00 Uhr (Winter) bzw. 0:00 und 2:00 Uhr (Sommer) zählt „heute“ noch als gestern.
- Eine richtig beantwortete Frage kommt in diesem Fenster einen Tag früher zurück. Fällige Fragen erscheinen erst ab 1 bzw. 2 Uhr nachts.
- Ein falsch beantwortete Frage bleibt wegen `!correct` immer wiederholbar.
- Kinder von 5 bis 10 Jahren sind um diese Zeit selten wach. Sonst sind Datum und Fälligkeit konsistent.
- Es entsteht nichts Falsches, nur ein verschobener Tageswechsel.
- Außerhalb Europas (Zielgruppe ist Deutschland) wäre der Versatz größer.

**Empfehlung (klein, Priorität niedrig):** Nur bei einer ohnehin anstehenden Änderung vereinheitlichen. Eine Hilfsfunktion „heute lokal“ als `YYYY-MM-DD` und überall dieselbe Rechnung nutzen. Das Pass-Format bleibt gleich (Datumstexte), alte `due`-Werte bleiben lesbar. Trotzdem Altpass- und Import-Beleg nach der Pass-Regel. Für `dailyDay` ein Neuberechnen bei `visibilitychange`.

### 4. Sicherheitsheader und Datenschutz: stimmt zur Hälfte
**Beleg:**
- `vercel.json` setzt nur `Cache-Control` für `/learning-worker.js` und `/index.html`.
- Es gibt keine CSP (auch kein `<meta>` in `index.html`) und keinen `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` oder `frame-ancestors`/`X-Frame-Options`.

**Datenschutz-Lage ist gut:**
- Die Suche nach `fetch(` in `app/`, `lib/`, `components/`, `build/` fand nur Zugriffe auf eigene Dateien: `app/journey-inquiry-data.ts:13`, `app/verified-content.mjs:10` und `build/learning-worker.js` (`fetch` auf eigene Pfade, `credentials:'omit'`).
- Keine Analyse- oder Fehlermeldedienste in `package.json` oder `app/`. Schrift lokal über `@fontsource-variable/nunito`. Bilder liegen in `public/`.
- Alle externen Verweise sind Links zum Anklicken. Von 19 `target="_blank"` haben alle `rel="noreferrer"` (51 Treffer insgesamt), und das schließt `noopener` ein.
- Die Seite sendet also nichts selbst nach draußen.

**Wirkung:** Gering. Ohne Header fehlt die Absicherung, falls später doch einmal eine Einbindung oder ein Eingabefeld Schaden machen könnte. Heute gibt es keinen konkreten Angriffsweg.

**Empfehlung (klein, Priorität niedrig bis mittel):**
- Zuerst die sicheren Header: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (keine Kamera, kein Mikrofon, keine Ortung), `frame-ancestors 'none'`.
- Die CSP als eigener Schritt (mittel): `default-src 'self'`, `style-src 'unsafe-inline'` (Inline-Stile), `img-src 'self' data: blob:`, `connect-src 'self'`, `worker-src 'self' blob:`, `manifest-src 'self'`. Sie ist riskant für den Service Worker, den Globus (Three.js, Canvas) und die Offline-Tests.
- Wichtig: Die Browser-Tests laufen gegen `vite preview` ohne die Header aus `vercel.json`. Eine CSP wäre dort ungetestet. Darum dieselben Header in `vite.config.ts` (`preview.headers`) setzen oder per Test gegen die Vorschau prüfen.
- Ich habe die CSP nicht ausprobiert.

### 5. Offline-Speicher: stimmt
**Beleg:**
- Die Offline-Liste hat 414 Dateien mit zusammen **30,4 MB** unkomprimiert (`offlineAssetMetrics` auf dem vorhandenen `dist/`). Der Rest des Builds bringt `dist/` auf 31 MB.
- Größte Dateien: `world.json` 1,7 MB, `globe-*.js` 1,6 MB, `photos/reef.jpg` 1,5 MB.
- Die Suche nach `navigator.storage`, `estimate`, `persist()` in `app/` und `build/` fand nichts. Es gibt keine Platzprüfung und keine Anzeige, auch nicht „persistent“ anfordern.
- Der Text in `app/learning-offline.tsx:90` nennt keine Größe.
- Bei einer Aktualisierung liegen alter und neuer Stand gleichzeitig im Cache. Der Worker legt auch unveränderte Dateien erneut an, der alte Cache wird erst nach der Aktivierung gelöscht (`build/learning-worker.js:95-100`). Spitze also etwa 60 MB. Das ist aus dem Code gelesen.
- Bei zu wenig Platz scheitert der Einbau sauber und räumt auf (`caches.delete(CACHE)`, Zeile 61). Das Kind sieht „Offline konnte nicht vollständig vorbereitet werden. Bitte online noch einmal versuchen.“ (`learning-offline.tsx`, `statechange`). Das trifft den Fall nicht, denn ein erneuter Versuch hilft bei vollem Speicher nicht. Ein Hinweis auf die Größe fehlt.

**Wirkung:** Gering für Kinder. 30 MB sind für Handys normal, aber auf alten Geräten und bei knappem Speicher ein Stolperstein ohne verständlichen Grund. Außerdem fehlt jeder Schutz gegen das Löschen durch den Browser.

**Empfehlung (klein, Priorität niedrig bis mittel):**
- Vor der Vorbereitung `navigator.storage.estimate()` lesen und bei weniger als etwa 120 MB frei vorwarnen.
- Den Fehlerfall `QuotaExceededError` getrennt ansprechen („Auf diesem Gerät ist nicht genug Platz“).
- Im Text „etwa 30 MB“ nennen (die Zahl aus dem Build, nicht von Hand).
- `navigator.storage.persist()` nach der erfolgreichen Vorbereitung anfragen.
- Alle Teile sind optional: Fehlt die Schnittstelle, läuft es wie bisher.

### 6. Abhängigkeiten: stimmt teilweise
**Beleg:**
- `package.json` hat neun Pakete mit `^`, obwohl `CLAUDE.md` „exakt gepinnt“ verlangt: `@base-ui/react ^1.7.0` (Zeile 20), `cmdk ^1.1.1`, `d3-geo ^3.1.1`, `lucide-react ^1.31.0`, `radix-ui ^1.6.7`, `three ^0.186.1`, `@types/d3-geo ^3.1.1`, `@types/three ^0.186.0` und `tw-animate-css ^1.4.0`.
- Das Lockfile hält die tatsächlichen Versionen (`pnpm outdated` zeigt als „Current“ genau die Zahlen aus der Datei, z. B. `three` 0.186.1). Mit `--frozen-lockfile` installieren CI und Container deshalb reproduzierbar.
- Das Risiko liegt bei einem späteren `pnpm add` oder `pnpm update`, die die Version frei verschieben.
- `pnpm-workspace.yaml`: `minimumReleaseAge: 10080` (genau 7 Tage) ist gesetzt. Zusätzlich `minimumReleaseAgeIgnoreMissingTime: false`, `trustLockfile: false`, `strictDepBuilds: true`.
- `pnpm audit --prod`: keine bekannten Schwachstellen.
- `pnpm outdated`: 14 Pakete mit neuerer Version, darunter `react` 19.2.8 → 19.3.1, `lucide-react` 1.31.0 → 1.74.0, `@base-ui/react` 1.7.0 → 1.9.0, `radix-ui` 1.6.7 → 1.8.1, `tailwindcss` und `@tailwindcss/postcss` 4.2.1 → 4.3.5, `motion` 14.4.0 → 14.14.0. Die Spalte „Latest“ beachtet das 7-Tage-Alter nicht.
- `playwright` 1.65.1 steht nicht in der Liste, ist also auf dem neuesten Stand.

**Empfehlung (klein, Priorität bald):** Die neun `^` auf die Lockfile-Versionen festschreiben. Das ändert keine installierte Version. Einen Wächter im Unit-Test ergänzen, der jede `^`/`~` in `package.json` ablehnt. Updates der Liste (v. a. React 19.3, Tailwind 4.3, `lucide-react`) als eigene kleine Commits mit `pnpm run check`, nur wenn sie mindestens 7 Tage alt sind (pnpm lehnt jüngere ab).

### 7. Große Dateien: stimmt teilweise
**Beleg (Größe und Zeilen):**

| Datei | Größe | Zeilen | Bemerkung |
|---|---|---|---|
| `app/earth-explorer.tsx` | 81 KB | 346 | eine Komponente `EarthExplorer` ab Zeile 86, längste Zeile 6163 Zeichen |
| `app/chapter-visual.tsx` | 86 KB | 248 | Zeilen 7 bis 106 sind Daten (`scenes`, Kindertexte im Code), die Komponente beginnt erst bei 107 |
| `app/globals.css` | 110 KB | 209 | längste Zeile 19 639 Zeichen, bindet 7 weitere CSS-Dateien ein |

Es gibt größere Brocken in `app/`: `retained-answer-wording.mjs` 42 KB, `globe.tsx` 36 KB, `research-labs.tsx` 37 KB.

**Wirkung:** Zeilenweise Diffs und Reviews sind kaum möglich, Konflikte beim Zusammenführen wahrscheinlicher. Die Kindertexte in `chapter-visual.tsx` sind für `karten-autor` und die Prüfer schwer zu lesen. Das ist ein Komfort- und Fehlerrisiko, aber kein Fehler.

**Empfehlung („bei ohnehin anstehenden Änderungen“, mittel, Priorität niedrig):**
1. `chapter-visual.tsx`: die `scenes`-Daten (Zeilen 7 bis 106) in eine JSON-Datei mit gleichem Inhalt auslagern. Damit lesen und prüfen die Schreib- und Prüf-Helfer sie direkt. Das lohnt zuerst, weil es Kindertexte betrifft.
2. `earth-explorer.tsx`: die Quiz-Teile (`startQuiz`, `answerQuiz`, `nextQuestion`, `startReview`, Zeilen 206–208 und 230) in einen eigenen Hook. Danach Missionen (210–212), die Dialogsteuerung für Hilfe, Suche und Eltern (104–107) und die „Weiter entdecken“-Logik (`continueActivity`, 232). Die JSX-Teile je Modus zuletzt.
3. `globals.css`: zuerst die Zeilenumbrüche normalisieren (ein Regelblock pro Zeile) und die Datei nach Bereichen in bestehende Einzeldateien verteilen, nur bei Anlass.
- Beim Umzug von Pass- und Hash-Logik gilt die Regel zu Pass und alten Links (Beleg mit Altpass, Reload, `#world/...`). Alle drei Umbauten sind ohne Verhaltensänderung möglich, aber nicht kostenlos.
- Nicht jetzt als eigener Auftrag. Das passt zu „Kein Bestandsschutz“, nur wenn es das Arbeiten spürbar bremst.

### 8. Arbeitsweise und Unterlagen: stimmt teilweise
**Umfang:**

| Datei | Größe | Zeilen |
|---|---|---|
| `BACKLOG.md` | 135 KB | 395 |
| `CHANGELOG.md` | 39 KB | 204 |
| `CLAUDE.md` | 27 KB | 178 |
| `STATUS.md` | 20,6 KB | 59 |
| `docs/entwurf/` | 2,1 MB | 114 Dateien |
| `exports/` in Git | 16 MB | |

- `STATUS.md` hält die Zusage „unter 60 Zeilen“ nur nach Zeilenzahl (59). Fünf Zeilen haben über 1500 Zeichen (die längste 3438). Zeilen 7 bis 14 allein sind 10 KB, die Verlaufsliste „Fertig und in test-live“ mit PR-Nummern. Das ist doppelt zu `CHANGELOG.md` und BACKLOG.
- In `BACKLOG.md` macht „Phase 1“ allein 76 KB (Zeilen 7 bis 197) aus, „Technik und Prüfung“ 36 KB. Viele Punkte sind durchgestrichen („erledigt am …“) und ein Teil steht nur noch als Beleg da. Das ist das größte Aufräumpotenzial.
- `CLAUDE.md` ist mit 178 Zeilen noch lesbar (keine Zeile über 1000 Zeichen). Wiederholt sind: die Test-Seite/Vorschau-Regel (in „Feste Regeln“, „Vercel“ und „Arbeitsablauf“ Punkt 5 und 6), die Tageslimit-Erklärung (in `CLAUDE.md`, BACKLOG Punkt 28 und `docs/entwurf/2026-11-24-vercel-tageslimit.md`) und die Browser-Installation.
- `AGENTS.md` (1,9 KB) wiederholt Kurzregeln, hält aber nur auf `CLAUDE.md`. Kein Problem.

**Zeiten:**
- CI, gemessen mit `gh run view`: Der Job „Required quality checks“ brauchte in den beiden letzten erfolgreichen Läufen 8,1 und 7,9 Minuten (Zeitgrenze 20, Puffer rund 60 %). Die Engine-Schnellprüfung 6,5 bis 7,3 Minuten (Grenze 35). Das zählt als Obergrenze für `pnpm run check`, weil Installation und Browser-Einrichtung dabei sind.
- Für `pnpm run check` lokal sind keine Zeiten festgehalten: Es gibt `zeiten-*.json` nur für Browser-Läufe, nicht für typecheck, lint, test oder build.
- Die vorhandene `.qa-output/browser/zeiten-full-chromium.json` ist ein Teillauf (5 Suiten, 455,7 s, `backup`, `core`, `playground`, `offline-cold` mit `bestanden: false`, `playground` 0 s). Er taugt nicht als Zeitmessung und scheint abgebrochen zu sein. Ich habe nichts daraus gefolgert.
- Die Vollprüfung lief nacheinander in Chromium rund 102 Minuten, jetzt in Gruppen; die längste (`journeys`) rund 35 Minuten gegen die Grenze von 75. Laut `CLAUDE.md` brauchen `core` und `offline-cold-full` rund 18 Minuten vor dem PR bei Kartenänderungen. Die Zahlen stammen aus `BACKLOG.md:299` und `.github/workflows/quality.yml:72`, nicht aus eigener Messung.

**Doppelarbeit:**
- WebKit `offline-cold` und `backup` laufen im Pflicht-Job und noch einmal in der Engine-Schnellprüfung WebKit (BACKLOG sieht das Entfallen vor, sobald die Engine-Prüfung Pflicht wird).
- Zum Phasenende läuft `test:full` in drei Browsern, die Karten-Suiten `core` und `offline-cold-full` schon vorher von Hand. Das ist gewollt.
- Fortschritt, PR-Verlauf und Messwerte stehen in STATUS, CHANGELOG und BACKLOG.

**Aufräumvorschlag (mittel, Priorität bald, spart Lesezeit bei jedem Einstieg):**
1. In `STATUS.md` die PR-Verlaufszeilen (7 bis 14) auf je einen Satz plus Link kürzen. Verlauf gehört in den `CHANGELOG`.
2. In `BACKLOG.md` erledigte (durchgestrichene) Punkte nach `docs/archiv/BACKLOG-erledigt-2026-11-24.md` verschieben. Im BACKLOG bleibt je Punkt eine Zeile mit gleicher Nummer und Link („erledigt, siehe Archiv“). Die Nummern bleiben, weil `tests/`, Code-Kommentare und Berichte sie nennen (z. B. „BACKLOG 18“ in `tests/pass-spielstaende.test.mjs`). So geht keine ID, kein Pass und kein alter Link verloren. Ich schätze, dass die Datei dadurch um ein Drittel bis die Hälfte kürzer wird. Das ist nicht gemessen.
3. Die Vercel-Regeln einmal in `CLAUDE.md` („Vercel“) führen und in „Feste Regeln“ und „Arbeitsablauf“ nur darauf verweisen.
4. Für `pnpm run check` eine Zeitausgabe je Schritt aufzeichnen (wie bei den Browser-Läufen), damit der Puffer gegen die Zeitgrenze belegbar bleibt.

### Zusätzlich aufgefallen
- `pnpm-workspace.yaml:1` enthält die Kommentarzeile „Copied Sites are standalone projects…“ und `storeDir`/`cacheDir` mit `${SITES_PNPM_SHARED_STORE:-.sites-runtime/pnpm-store}`. Das sieht nach Resten einer anderen Umgebung aus. Ich habe nicht geprüft, ob der Nutzer das braucht. Eine Klärung wäre klein.
- `STATUS.md` „Vorübergehende Modell-Ausnahmen: Keine“. Das passt zu den `model:`/`effort:`-Zeilen in `.claude/agents/*.md` und zur Helfer-Tabelle in `CLAUDE.md` (alle 10 Helfer stimmen).

### Geprüft und in Ordnung
- Pass-Prüfung beim Import (`importProgress`, `restoreSave`) lehnt unvollständige oder fremde Dateien ab und ändert den aktuellen Pass dann nicht.
- Speicherfehler-Pfade (verweigerter Speicher, volles Kontingent, IndexedDB-Abbruch) sind im Browser-Test `tests/browser/storage-feedback.mjs` abgedeckt und zeigen dem Kind einen Hinweis.
- Offline-Einbau ist atomar (bei Fehler wird der neue Cache gelöscht) und prüft jede Datei gegen Größe und Prüfsumme.
- Keine Daten gehen an externe Dienste (siehe Punkt 4). `pnpm audit --prod` ohne Funde. `minimumReleaseAge` gesetzt. Playwright aktuell.
- CI-Zeitgrenzen: Pflicht-Job 20 Minuten bei etwa 8 Minuten Laufzeit, Engine-Schnellprüfung 35 Minuten bei etwa 7 Minuten, ausreichender Puffer.

### Nicht geprüft
- Kein Lauf von `pnpm run check`, den Browser-Suiten oder `test:full`. Alle Aussagen zu Dauer und Schleifenverhalten stammen aus dem Code, den CI-Läufen und den Unterlagen, nicht aus eigener Messung.
- Die Schleife aus Punkt 2 und das Neurendern fünfmal pro Sekunde habe ich nicht im Browser nachgestellt. Die Folgerung ergibt sich aus dem Code.
- Echte Pass-Größen und das Wachstum mit Phase 2 und 3: Ich habe nur mit einem ausgedachten Pass gerechnet.
- Vercel-Einstellungen, Branch-Regeln und die tatsächlich ausgelieferten Header der Test-Seite (kein Zugang zu Live-Antworten). Nur `vercel.json` gelesen.
- Browser-Speichergrenzen (localStorage-Kontingent, IndexedDB bei Safari im privaten Modus) stammen aus meinem Wissen, nicht aus einer Messung hier.

Wichtigste Dateien:
- `/home/user/wunderkompass/app/local-progress-store.ts`
- `/home/user/wunderkompass/app/progress-panel.tsx`
- `/home/user/wunderkompass/app/progress-storage.ts`
- `/home/user/wunderkompass/app/use-local-progress.ts`
- `/home/user/wunderkompass/vercel.json`
- `/home/user/wunderkompass/package.json`
- `/home/user/wunderkompass/build/learning-worker.js`
- `/home/user/wunderkompass/app/learning-offline.tsx`
- `/home/user/wunderkompass/BACKLOG.md`
- `/home/user/wunderkompass/STATUS.md`

## Teil 3: Folgerungen (Claude)

Der Bericht bestätigt zwei echte Schwächen, aber nichts Eiliges für Kinder und ihre Daten. Daraus folgt ein kleiner **Technik-PR direkt nach PR 2** (BACKLOG, Technik und Prüfung, „Technik-PR nach den Analysen“):

1. **Speicher-Wiederholung mit wachsender Pause** (Punkt 2): echter Fehler, kostet Akku auf Handy und Tablet. Kleine Änderung, Unit-Test mit künstlichem Fehler.
2. **Eine Importgrenze in einer Einheit** (Punkt 1): im selben PR, weil dieselben Dateien und derselbe Pass-Beleg (Altpass, Import/Export, Reload, Fehlerfall) nötig sind. Test für 2,0 bis 2,6 MB.
3. **Pakete exakt pinnen** (Punkt 6): Die neun `^` auf die Lockfile-Versionen setzen, ändert keine installierte Version. Dazu ein Wächter-Test.

Erst bei Anlass, ins BACKLOG statt jetzt:

- **Offline-Platz** (Punkt 5): Größe nennen, Platz vorher prüfen, eigener Text bei vollem Speicher. Passt zum Design-Schritt, weil sich dort der Offline-Text ändert.
- **Sicherheitsheader** (Punkt 4): erst die harmlosen Header; eine CSP nur mit Test gegen die Vorschau.
- **Zeitzonen** (Punkt 3): nur bei einer ohnehin anstehenden Änderung an den Wiederholungen.
- **Große Dateien** (Punkt 7): `chapter-visual.tsx`-Texte als JSON, sobald die Texte dort angefasst werden; `earth-explorer.tsx` aufteilen, wenn der Design-Schritt sie ohnehin umbaut.

**Unterlagen** (Punkt 8): Zustimmung. `STATUS.md` wird beim nächsten Nachführen auf einen Satz je PR gekürzt, weil das bei jedem Einstieg Lesezeit spart. Die erledigten BACKLOG-Punkte ziehen einmal ins Archiv; Nummer und Verweis bleiben stehen. Die Reste in `pnpm-workspace.yaml` (Punkt „Zusätzlich aufgefallen“) prüft Claude im Technik-PR.
