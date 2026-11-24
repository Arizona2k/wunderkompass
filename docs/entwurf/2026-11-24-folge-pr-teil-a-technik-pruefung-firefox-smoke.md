# Technik-Prüfung: Firefox-Fund im Rauchtest (Folge-PR Teil A, PR #108)

Stand: 24.11.2026. Auftrag nach CLAUDE.md („Nach jedem spät gefundenen Fehler … läuft der `technik-pruefer`, bevor die Korrektur gemeldet wird“). Geprüft: Commit `47b1c1f` (Korrektur in `tests/browser/smoke.mjs`), Fund in der Engine-Schnellprüfung Firefox, Lauf 45348967989 auf `ca23028`. Der Helfer hat keinen Browser gestartet (in seiner Umgebung fehlten die Playwright-Browser); alles ist aus Code, Unterlagen und CI-Protokollen gelesen.

## Bericht des technik-pruefer (unverändert)

**Ergebnis:** Deine Ursache stimmt und ist gut belegt. Die Korrektur schwächt die Prüfung nicht ab. Es gibt keinen Befund, der vor dem Merge geändert werden muss. Dazu kommen ein Rest-Risiko in `backup` (Firefox, CI-Satz) und die Frage, warum es erst jetzt auffiel: Der Fall ist nicht neu, sondern der vierte Treffer.

Ich habe keinen Browser gestartet, weil hier keine Playwright-Browser installiert sind (`~/.cache/ms-playwright` fehlt). Alles unten ist aus dem Code, den Unterlagen und den CI-Protokollen gelesen. Ich habe nichts selbst nachgestellt.

### Zu 1 und 2: Ursache und Abschwächung

**Ursache stimmt.**
- `app/discovery-selection.ts:22-27`: Bei `reload` und `back_forward` kommt die Auswahl aus `sessionStorage`. Das Riff-Paar bleibt also über das Neuladen gleich.
- Das Foto war im ersten Dokument geladen. Beim Einhängen nach der Umleitung `#news/…` → `#home` fragt Firefox nach, ob seine Kopie noch gilt, und bricht die Nachfrage selbst ab.
- Die Regel (Fall 2) in `scripts/browser-errors.mjs:57-66` fragt die Seite per `page.evaluate` ab. Wechselt die Seite (hier `smoke.mjs:55`) vorher die Ansicht, ist das `<img>` ausgehängt und `zeigtFertigesBild` liefert false. Damit bleibt der Abbruch ein Fehler. Die 33 ms aus deiner Zeitlinie passen dazu.
- Der Rauchtest war genau an dieser Stelle ungewöhnlich: Die Startseite wird erst nach dem Neuladen durch die Umleitung eingehängt. In den anderen Suiten gibt `ready` (Pass-Knopf aktiv) meist etwas Luft.

Kleine Ungenauigkeit in Kommentar und Entscheidungsliste: `page.goto(base + '#news/…')` nach `reload()` ist nur ein Hash-Wechsel im selben Dokument, kein zweites Neuladen. Die Erklärung bleibt richtig, der Satz „lädt die Seite neu“ ist aber missverständlich (`smoke.mjs:43-50`).

**Keine Abschwächung.**
- `scripts/browser-errors.mjs` ist im Commit unverändert (Diff enthält nur `tests/browser/*`, `BACKLOG.md` und die `docs/entwurf`-Dateien).
- `ctx.report` ist dasselbe Objekt, das `monitor` beschreibt (`tests/browser/run.mjs:116-122`). `browserErrorsSettled` wartet also wirklich auf die offenen Entscheidungen.
- Ein Foto, das abbricht und danach nicht erscheint, bleibt rot. Dafür sorgen die Gegenproben aus Punkt 13 der Arbeitssystem-Liste.
- Verloren geht nur, dass `smoke` genau diese Stelle nicht mehr „zu schnell verlassen“ übt. Das ist kein App-Fehler, und `no-news` arbeitet nach demselben Muster (`ladeanfragen` vor jedem Seitenwechsel: `no-news.mjs:31,34,37`).

Eine Einschränkung zum Beleg: „12 von 12 grün“ steht gegen „2 von 6 rot“ davor. Das ist statistisch deutlich, aber klein. Den echten Beweis liefert der Firefox-Lauf der CI. Lauf 45353338295 (Commit 90b80ab, enthält den Fix) war bei meiner Prüfung noch `in_progress`. Ich habe sein Ergebnis nicht gesehen.

### Zu 3: Gleiches Muster in anderen Suiten

Alle `reload`/`goto` in den CI-Satz-Suiten habe ich einzeln angesehen. Die Frage war: Wird die Startseite neu eingehängt und gleich wieder verlassen, ohne `ladeanfragen` oder `browserErrorsSettled`?

**Befund A, CI-Satz, sollte bald (Rest-Risiko, nicht belegt):** `tests/browser/backup.mjs:37-41` (Suite `backup`, läuft bei jedem PR in der Engine-Schnellprüfung Firefox).
- Zwei Tabs im selben Kontext laden `goto(base)`, dann `p.reload(); ready(p)` ohne `ladeanfragen`.
- Danach folgt sofort `cycleVisitConvergence` (`backup.mjs:13-20`), das per `location.hash` zu einer Karte wechselt, also die Startseite verlässt.
- Die Auswahl bleibt nach dem Neuladen gleich. Ein Riff-Foto (3 von 19, rund 16 %) wäre schon geladen und würde nachgefragt.
- Es gibt etwas Luft bis zum Seitenwechsel. Die Startseite hängt bei Seitenstart ein und `ready` wartet, bis der Pass geladen ist. Der Abstand ist aber nicht belegt.
- Vorschlag: `const fertig = ladeanfragen(p)` vor dem Neuladen und `await fertig()` danach. Das ist ein Zweizeiler, wie in `smoke`.

**Kein Befund (angesehen):**
- Diese Suiten warten schon (`ladeanfragen`/`anfragenFertig`): `no-news`, `portable-flows` (Reload ist auf der Spielseite), `wissenskarte`, `kern-huelle`, `research-transfer`, `retained-answer-wording`, `animal-game-saves`, `habitat-answer-semantics`, `offline-cold`. Bei den letzten drei liegt der Reload außerdem auf der Spielseite, nicht auf der Startseite.
- `pass-spielstaende.mjs:67,163` laden neu, bleiben aber auf der Startseite. Das Foto bleibt eingehängt, Fall 2 greift.
- `journey-transfer`, `reise-kapitel`, `solar-labels` und `people-learning` landen nicht neu auf der Startseite.
- Die Vollprüfung hat keine Treffer. Dort liegen die Reloads auf Karten- und Reiseseiten (`animal-learning.mjs:154,225`, `engine-journeys.mjs:49`, `offline-resilience.mjs:119`). `offline-retention` hat keinen Monitor.
- Alle Chromium-only-Suiten sind egal, denn die Regel gibt es nur für Firefox.

**Warum nur das Riff-Foto?** Offen. Die Startseite zeigt immer ein Held-Foto über `WorldPhoto` (WebP), und viele Pfade zeigen weitere Fotos davon. Alle hängen beim Neuladen neu ein, bisher fiel aber nur `reef.jpg` auf (Läufe 249, 257, 262 und jetzt). Das Riff ist das einzige Foto, das `discovery-topic-media.tsx` als einfaches `<img src="/photos/reef.jpg" loading="lazy">` einbindet, ohne `srcset` und ohne WorldPhoto.
- Ich kann nicht sagen, ob die WebP-Fotos nicht nachfragen oder ob ihre Nachfrage anders ausgeht.
- Der Abbruch eines anderen Fotos (zum Beispiel `bee`) würde dasselbe Muster zeigen und wäre genauso selten.
- Vorschlag (Idee): Die Frage lässt sich billig klären, indem man in den CI-Protokollen der Firefox-Läufe nach „erwarteter Firefox-Bildabbruch (firefox-image-cache-copy)“ sucht. Ich habe 5 Firefox-Läufe vom 24.11. gegrept (45330432651, 45329320319, 45321910303, 45344729398, 45353338295 – Letzterer war noch nicht fertig, sein Protokoll damit unvollständig): Fall 2 griff nie. Fall 1 (`firefox-image-restart`) griff 2-mal, beide Male bei `/world/african-elephant.webp` (Lauf 45321910303). Die Datenlage ist dünn.

### Zu 4: Warum erst jetzt

**Der Fall ist nicht neu.**
- Es ist der vierte Treffer: Lauf 249 und 257 (`no-news`), Lauf 262 (`smoke` und `pass-spielstaende`) und jetzt 45348967989. Die Aussage „erst jetzt aufgefallen“ stimmt nur für diese Stelle in `smoke`.
- Beim ersten Mal wurde die Überwachung angepasst (Fall 2), nicht die Auswahl in den Tests. Die Überprüfung damals lief 15-mal grün, „das Riff-Foto kam zufällig nicht vor“. Dieser Beleg war schwach: Der Rauchtest öffnet pro Lauf zwei frische Kontexte, das sind 30 Ziehungen. Die Chance, dass keine das Riff zeigt, liegt bei rund 0,6 %. Dazu kommt, dass Firefox nur etwa jedes zweite Mal abbricht, dann sind es rund 8 %.
- Der Punkt-13-Nachweis „im Browser nachgestellt, Riff fest“ lief mit der Regel schon einmal 3 von 6 grün durch. Heute zeigte derselbe Ablauf ohne Warten 2 von 6 rot. Das passt zu einem Wettlauf (Regel gegen Seitenwechsel), nicht zu einem festen Fehler.

**Was früher fangen würde:** ein fester Startwert für das Zufallspaar.
- Dein Probeskript (`Math.random = () => 0.35`) macht genau das. Es liegt in `.qa-output/` und damit nicht in Git. Das ist der eigentliche Verlust: Die Probe, die den Fund belegt hat, kann der nächste Chat nicht nutzen.
- Vorschlag (Idee, klein): Das als Schalter in `tests/browser/stresslauf.mjs` und `tests/browser/run.mjs` aufnehmen, ähnlich `QA_FRAME_DELAY_MS`. Ein Beispiel wäre `QA_STARTPAAR=0.35` mit `addInitScript` auf jedem Kontext.
- Als Schritt in `/pruefen` und als CI-Lauf von `smoke`, `no-news`, `backup` und `pass-spielstaende` in Firefox mit festem Riff: rund 2 Minuten zusätzlich, nur Firefox.
- Zu beachten: `Math.random` wird auch andernorts benutzt (Memory-Mischen). Besser nur für die ersten Ziehungen, die der Entdeckungs-Auswahl, oder mit einem eigenen Schalter in `discovery-selection.ts` (App-Änderung, nur für Tests, würde ich vermeiden).
- Alle 19 Pfade in jedem Browser einmal: Das Einhängen aller Pfade prüft `home` schon (`tests/browser/discovery-central.mjs:168-189`), aber nur in Chromium und nur in der Vollprüfung. Eine Schleife über 19 Kontexte in Firefox und WebKit kostet grob 19 × 3 s ≈ 1 Minute je Browser. Sie würde nicht nur dieses Muster fangen, sondern auch ein kaputtes Foto im Pfad. Der Nutzen ist größer als beim festen Riff-Wert, aber auch aufwendiger.

### Zu 5: Unterlagen

Die Entscheidungsliste, der Nachtrag im BACKLOG und `smoke.mjs` stimmen mit dem Code überein.
- Geprüft: Lauf-ID, Commit `ca23028`, Pfade, `ladeanfragen` an den Stellen von `no-news`, der Verweis auf Punkt 13 der Arbeitssystem-Liste (`docs/entwurf/2026-11-23-teilschritt-3-arbeitssystem-entscheidungen.md:34`).
- Das Wort „Entdeckungspaar“ ist unscharf: `discovery-selection.ts` zieht Held (`heroId`) und Pfad (`trailId`) getrennt. Das Riff gehört nur zum Pfad, 3 von 19 Pfaden. Die Rechnung stimmt trotzdem.
- „Die früheren 15 grünen Wiederholungen hatten es zufällig nicht“ in der Entscheidungsliste ist als Erklärung zu knapp (siehe Zu 4). Ich würde ergänzen: Fall 2 entscheidet sich nur, wenn Firefox abbricht, und das tat es in etwa jedem zweiten Riff-Besuch.

### Befunde (Gewicht, Vorschlag)

| # | Befund | Fundstelle | Gewicht | Vorschlag |
|---|---|---|---|---|
| 1 | `backup` lädt neu und verlässt die Startseite sofort, ohne zu warten (Firefox, CI-Satz) | `tests/browser/backup.mjs:37-41` | sollte bald (nicht vor dem Merge) | `ladeanfragen` vor dem Neuladen, `await fertig()` danach |
| 2 | Die Probe mit festem Riff-Wert liegt nur in `.qa-output/` | `.qa-output/smoke-probe.mjs` | sollte bald | Als Schalter `QA_STARTPAAR` in `run.mjs` und `stresslauf.mjs`, Schritt in `/pruefen` für Firefox |
| 3 | Es ist der 4. Treffer desselben Musters; Gegenmittel waren jedes Mal einzeln (Regel, dann Test) | BACKLOG „Firefox lädt manche Fotos doppelt“ | Idee | Wächter in `tests/browser-suites.test.mjs`: Jede Suite, die `page.reload()` ruft, braucht `ladeanfragen`. Ausnahmen mit Begründung. Dann entfällt der Hinweis „wer einen neuen Test schreibt…“, den niemand prüft |
| 4 | Warum nur `reef.jpg` abbricht, ist offen (WebP-Fotos der Startseite nicht beobachtet) | `app/discovery-topic-media.tsx` gegen `app/world-media.tsx:40` | Idee | In künftigen Firefox-CI-Protokollen nach „firefox-image-cache-copy“ sehen. Die Zahl der Treffer und die Adressen in den Bericht oder ins BACKLOG schreiben |
| 5 | Formulierung „Entdeckungspaar“ und „lädt die Seite neu“ | `docs/entwurf/…teil-a-entscheidungen.md` (letzter Abschnitt), `smoke.mjs:46-50` | klein | „Pfad“ statt „Paar“; „Umleitung auf die Startseite im selben Dokument“; die 15-Läufe-Erklärung wie oben ergänzen |

**Nicht geprüft:**
- Lauf 45353338295 (Commit 90b80ab) war bei Abschluss noch in Arbeit. Ob die Fix-CI grün ist, weiß ich nicht.
- Ich habe nichts im Browser nachgemessen, weder die Probe noch Befund 1. Die Einschätzung zu `backup` und zu den WebP-Fotos ist eine Lesart des Codes.
- Vercel, Branch-Regeln und die Paket-Prüfung (`pnpm outdated`/`audit`) habe ich für diesen Auftrag nicht angesehen.

## Was daraus wurde (Claude, 24.11.2026)

Wird nach der Probe zu Befund 1 ergänzt.
