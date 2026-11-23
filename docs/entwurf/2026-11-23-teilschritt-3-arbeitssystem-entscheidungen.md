# Teilschritt 3, Arbeitssystem: Entscheidungen und offene Kleinigkeiten

Stand: 23.11.2026. Diese Liste hält fest, was Claude am Anfang von Teilschritt 3 beim Arbeitssystem entschieden oder verschoben hat, damit der nächste Chat nichts neu ausdenken muss. Grundlage: [Technik-Prüfung](2026-11-23-technik-pruefung.md), Abschnitt „Einordnung durch Claude und Reihenfolge“.

## Umgesetzt

1. **Gemeinsame Test-Bausteine für die Karte und Wächter.** Fragen, „Ganz einfach“, „Ausprobieren“ und Häppchen prüfen alle Browser-Suiten nur noch über `tests/browser/karte-hilfen.mjs`. Ein Wächter in `tests/browser-suites.test.mjs` verbietet eigene Selektoren dafür in anderen Suiten.
2. **Vollprüfung in Gruppen.** `tests/browser/shards.mjs` legt je Browser Gruppen fest. Jeder Browser hat die Gruppe `rest`, in der alle übrigen Suiten laufen, auch neue. So fällt keine still weg; das prüft `tests/browser-shards.test.mjs`, auch gegen die Liste in `quality.yml`. `run.mjs` schreibt die Dauer je Suite nach `.qa-output/browser/zeiten-*.json`; die CI lädt sie als Artefakt hoch. Die Zeitgrenze je Job liegt bei 75 Minuten statt 180.
3. **Engine-Schnellprüfung.** Bei jedem PR läuft der CI-Satz auch in Firefox und WebKit (Job `engines` in `quality.yml`). Er ist **kein Pflicht-Check der Branch-Regel**: Ein hängender Browser-Download (wie in Lauf 257) soll keinen PR sperren. Ein roter Lauf wird trotzdem vor dem Merge geklärt (`CLAUDE.md`).
4. **CI-Satz ergänzt:** `solar-labels` (rund 50 s in Chromium) läuft jetzt in jedem PR.
5. **Doppelter Satz auf 21 Karten.** Die große Prüfung fand ihn erst in `core`. Bei 21 Wissenschaftskarten stand „Schon gewusst?“ wörtlich wie „Ganz einfach“. Den Satz hat Claude in den Daten gestrichen, statt eine App-Regel zu bauen, die Doppeltes versteckt. Der Inhaltstest prüft jetzt auch gegen „Ganz einfach“. Neue Überraschungssätze mit Quelle kommen spätestens mit der Wissenschaftswelt in Phase 3 (BACKLOG 17).
   - Kein Eintrag in „Was ist neu?“: Für Kinder kommt nichts Neues dazu, nur ein doppelter Satz fällt weg.
6. **Aufräumen:** alte Next-, Vinext- und shadcn-Reste entfernt (61 Dateien), dazu 14 ungenutzte Pakete (darunter `next` und `zod` mit den Sicherheitsmeldungen). Lint prüft jetzt alle Dateien (`eslint .`) statt einer Liste.
   - `eslint-config-next` bleibt vorerst: Die Lint-Regeln hängen daran, es braucht `next` nicht. Ablösung steht im BACKLOG.
7. **Datentest „Ganz einfach“ steht nicht doppelt auf der Karte** (`tests/karten-inhalt.test.mjs`). Der Browser-Test sieht nur die Karten, die eine Suite öffnet; der Datentest prüft alle Karten in Millisekunden. Er fand 24 Tierkarten, bei denen die Einleitung derselbe Satz ist. Sie stehen in einer Ausnahmeliste, die nur kürzer werden darf, und werden mit Entwurf Teilschritt 3, E12 (Aufgabe 6) umgeschrieben.
8. **Auto-Merge erst nach grüner Engine-Schnellprüfung** (`CLAUDE.md`, Abschnitt Git): GitHub wartet beim Auto-Merge nur auf Pflicht-Checks.

## Verschoben, mit Grund

- **`animals` und `core` mit einer Breite im CI-Satz: gestrichen.** Der `technik-pruefer` hat bestätigt, warum der doppelte Satz so spät auffiel: Nur `core` öffnete die Wissenschaftskarten. Der Datentest (Punkt 7) fängt diese Fehlerklasse billiger und vollständig ab. Eine Kurzfassung von `core` wäre eine zweite Liste von Ansichten, die gepflegt werden muss.
- **Gruppen neu ausgleichen und `journeys` teilen:** erst mit den Zeiten-Dateien des ersten CI-Laufs mit Gruppen (BACKLOG, „Vollprüfung dauert lange“).
- **`main` schützen:** Der Nutzer stellt die Regel auf GitHub ein (Entscheidung vom 23.11.2026). Am 23.11.2026 nachmittags galt `main` laut GitHub noch als ungeschützt. Claude prüft das beim nächsten Einstieg erneut.

## Für den nächsten Chat

- Entwurf und Plan für Teilschritt 3: [2026-11-23-phase-1-teilschritt-3.md](2026-11-23-phase-1-teilschritt-3.md), mit fünf Entscheidungen (D1 bis D5) für den Nutzer.
- Gebaut wird erst nach Freigabe, beginnend mit Teil A, Aufgabe 1.
