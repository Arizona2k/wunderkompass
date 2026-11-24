# CLAUDE.md – Arbeitshandbuch für WunderKompass

Stand: 24.11.2026. Kurz, verbindlich, auf Deutsch. Bei Widerspruch gilt eine spätere ausdrückliche Weisung des Nutzers im Chat.

## Das Projekt in fünf Sätzen

WunderKompass ist eine kostenlose Lernseite zum Entdecken: Tiere, Natur, Erde, Weltall, Menschen, Erfindungen und Geschichte.
Kinder lernen mit Wissenskarten, einem 3D-Globus, kleinen Spielen, Mitmach-Laboren und Lernreisen.
Der Fortschritt liegt nur im Browser, im „Entdeckerpass“; es gibt kein Konto und keine Cloud.
Die Seite läuft auf Handy, Tablet und Rechner und funktioniert nach einmaliger Vorbereitung auch offline.
Seit dem 21.11.2026 entwickelt Claude die Seite weiter (Weg C: neuer kindgerechter Kern, Bewährtes zieht um).

**Zielgruppe:** Kinder von 5 bis 10 Jahren, selten 12 bis 14. Meistens mit einem Elternteil, ab etwa 8 auch allein.
Daraus folgt: kurze Sätze, große Bilder, große Tippflächen, schnell etwas tun können. Vertiefung für Große ist freiwillig.

## Feste Regeln

- **Kostenlos.** Keine bezahlten Dienste, Abos, Testzugänge oder Upgrades, auch nicht für Hosting, Builds, Bilder oder Audio. Kostenlose Konten nur nach Erklärung und OK des Nutzers.
- **Kein Bestandsschutz** (Nutzer, 21.11.2026). Nichts bleibt, nur weil es es schon gibt. Inhalte, Spiele, Labore, Reisen, Design und Code werden geändert, ersetzt oder gestrichen, wenn es für Kinder besser ist. Das gilt auch fürs Arbeiten (Nutzer, 23.11.2026): Tests, Werkzeuge, Unterlagen, Pakete und alte Dateien, die uns langsamer, unsauberer oder umständlicher machen, werden vereinfacht oder entfernt. Geschützt ist nur, was Kindern sonst verloren ginge: ihr Fortschritt im Pass und ihre Links (nächster Punkt).
- **Wachsen lassen** (Nutzer, 21.11.2026). Claude erweitert, verbessert und verknüpft die Seite von sich aus immer weiter, in Teilabschnitten. Ein Pilot ist der Anfang, nicht das Ende: Was sich bewährt, wird Schritt für Schritt auf alle Karten, Welten, Spiele, Labore und Reisen ausgedehnt, und der nächste Schritt wird ohne Aufforderung vorgeschlagen und angegangen. Claude bleibt dabei kritisch, auch gegenüber eigenen Ideen und denen des Nutzers, nennt Schwächen offen und empfiehlt eine Lösung. Qualität geht vor Menge: Quellen, Prüfung, Entwurf und Freigabe je Phase gelten weiter.
- **Einheitlich und stimmig, überall** (Nutzer, 24.11.2026: „Lass mich das nicht jedes Mal sagen“). Bei jeder sichtbaren Änderung prüft Claude auch die verwandten Seiten und Bereiche: gleiche Bausteine für gleiche Dinge, Bilder einheitlich in Größe, Ausschnitt, Rahmen und Qualität. Ein vorhandenes Bild ist nicht automatisch ein passendes oder schönes. Was nicht passt, kommt in denselben PR oder mit Grund ins BACKLOG.
- **Qualitätsmaßstab für Altes, Neues und Künftiges** (Nutzer, 24.11.2026). Erkenntnisgewinn vor Menge; lieber zeigen, ausprobieren, vermuten und prüfen als lange lesen; Inhalte fachlich echt verknüpfen; was sich bewährt, auf alle vergleichbaren Bereiche übertragen; Bestehendes regelmäßig hinterfragen; Aufwand, Token, Testdauer und Nutzen abwägen; weniger Bürokratie, mehr Lernspaß. Vorschläge von außen prüft Claude kritisch am Code und gegen das BACKLOG, bevor etwas umgesetzt wird (Beispiel: [Bewertung zweier Analysen](docs/entwurf/2026-11-24-analysen-bewertung.md)).
- **Kompatibilität.** Karten-, Fragen-, Kapitel-, Spiel-, Labor-, Missions- und Reise-IDs werden nie umbenannt und nie für etwas anderes wiederverwendet. Fällt ein Inhalt weg, führen seine alten Links an einen sinnvollen Ort, und Pass-Einträge dazu gehen nicht verloren. Hash-Links (`#world/...`, `#journeys/...`) funktionieren weiter. Alte Links (auch `#news/...`) werden aufgefangen.
- **Ein Lernspeicher.** Der Pass ist der einzige Speicher: Schema 3, App-ID `earth-explorer`, Schlüssel `erde-entdecken:save:v3`, Altpass `erde-entdecken:forscherpass:v2`, IndexedDB `earth-explorer`. Wer daran etwas ändert, belegt mit Altpass, Import/Export, Reload und Fehlerfall, dass nichts verloren geht.
- **Daten.** Keine echten Pass-Dateien, Notizen, persönlichen Daten oder Zugangsdaten ins Repository. Nur ausgedachte Testpässe.
- **Bilder.** Nur mit geklärten Rechten und vollständigem Bildnachweis (Urheber, Lizenz, Quelle). Vorhandene Nachweise bleiben.
  - Zuerst freie Originale: Fotos und historische Abbildungen (z. B. Wikimedia Commons) nach Prüfung von Lizenz und Namensnennung.
  - Nur wenn es kein passendes Original gibt: gekennzeichnete eigene Illustration oder kostenloses KI-Bild, sichtbar als solches benannt.
  - Echte Menschen nie als foto-ähnliches KI-Bild. Rekonstruktionen (z. B. Dinosaurier) heißen auch so.
  - **Immer zuerst Originalfotos** (Nutzer, 24.11.2026): Wo heute ein KI-Bild oder eine KI-gestützte Zeichnung statt eines Fotos steht (Stand 24.11.2026: 24 Tierkarten, 3 Erfindungen, Personen ohne Foto), kommt ein freies Original, sobald es eines gibt. KI nur, wenn es nachweislich kein freies Original gibt. Erklärende Schaubilder (z. B. Wasserkreislauf) sind kein Fotoersatz. Bilder kommen über den Bilder-Strang (`BACKLOG.md`, Phase 1, Punkt 26).
- **Git.** `main` nie direkt ändern. Kein Force-Push. Arbeit auf `claude/...`, PR nur nach `test-live`. Dazu spult Claude den festen Branch `vorschau` vor (Abschnitt Vercel; OK des Nutzers, 24.11.2026); er wird nie gemergt. Gemergt wird regulär nach grüner CI und erst nach „ok“ des Nutzers im Chat. Auto-Merge ist auf GitHub aktiv (seit 21.11.2026): Nach dem „ok“ darf Claude ihn für den PR einschalten; GitHub merged dann erst bei grüner CI. GitHub wartet dabei nur auf Pflicht-Checks: Auto-Merge darum erst einschalten, wenn auch die „Engine-Schnellprüfung“ grün ist.
- **Test-Seite und Vorschau** (Nutzer, 24.11.2026: „jeder benutzt aktuell nur die Test-Seite“). Die Test-Seite (aus `test-live`) ist die Seite, die alle benutzen. Die Vorschau (aus `vorschau`) zeigt dem Nutzer eine sichtbare Änderung vor dem Merge auf seinen Geräten. `wunderkompass.vercel.app` (aus `main`) ist ein älterer Stand und wird zurzeit nicht genutzt. Vercel baut darum nur `test-live` und `vorschau` (`vercel.json`, `git.deploymentEnabled`). Arbeits-Branches (`claude/...`) und `main` bekommen keinen Build, so bleibt das Tageslimit des kostenlosen Plans frei. Soll `main` wieder genutzt werden: erst `"main": true` in `vercel.json` ergänzen.
- **Ehrlichkeit.** Keine Prüfung behaupten, die nicht stattfand. Keine erfundenen Studien, Kindertests oder Lernwirkungen. Teilprüfungen heißen Teilprüfungen.
- **Datenschutz.** Name und E-Mail des Nutzers gehen nie an externe Dienste, auch nicht in Anfragen oder Commits.
- **Inhalte.** Wichtige Aussagen brauchen eine geprüfte Quelle. Verbindungen zwischen Themen müssen fachlich echt sein (Ziel 6). Keine Nachrichten; der News-Bereich bleibt entfernt.
- **Neue Pakete:** nur kostenlos, mit passender Lizenz, exakt gepinnt. pnpm nimmt nur Versionen an, die mindestens 7 Tage alt sind (`minimumReleaseAge`).

## Befehle

Im Cloud-Container zuerst: `export PATH=/opt/node24/bin:$PATH` (dort ist sonst Node 22 aktiv). Node 24, pnpm 11.25.0.

| Befehl | Was er tut |
|---|---|
| `pnpm install --frozen-lockfile` | Pakete genau nach Lockfile |
| `pnpm run dev` | Entwicklungsserver (Offline-Vorbereitung ist dort aus) |
| `pnpm run build` | Produktionsbuild nach `dist/` plus Größenbudget (`performance-budgets.json`) |
| `pnpm run start` | `dist/` lokal ansehen, meist `http://127.0.0.1:4173` |
| `pnpm run typecheck` / `pnpm run lint` | Typen und Lint |
| `pnpm test` | Unit-Tests (`tests/*.test.mjs`, Node-Testrunner) |
| `pnpm run test:smoke` | Rauchtest im Browser: 360 px (Touch) und 1440 px, Bilder in `.qa-output/browser/` |
| `pnpm run test:browser` | CI-Satz: Pass, Sicherung, Offline, alte Links, Sonnensystem-Beschriftung, Tempo (zwei Suiten parallel); `-- --browser firefox` oder `webkit` |
| `pnpm run test:browser:webkit` | WebKit-Kurzprüfung: `offline-cold` und `backup` in WebKit (Safari), bei jedem PR |
| `pnpm run test:full` | Große Prüfung, am Ende einer Phase; `-- --browser firefox` oder `webkit` oder `all` |
| `pnpm run check` | Die ganze Prüfkette: typecheck, lint, test, build, test:browser, test:browser:webkit |
| `pnpm run export:data` | Inhaltsexporte nach `exports/content` (noch in Git, weil Browser-Tests sie lesen; Ablösung im BACKLOG) |

Browser-Runner direkt: `node tests/browser/run.mjs --suite smoke|ci|full [--browser chromium|firefox|webkit|all] [--jobs N] [--base URL] [--shard GRUPPE] [suitenamen]`.
`--base` prüft eine laufende Adresse (z. B. die Test-Seite). `QA_DIST=<ordner>` prüft einen anderen Build. `QA_FRAME_DELAY_MS=150` lässt jedes Bild der Seite 150 ms später kommen (Stresslauf, Schritt in `/pruefen`). `--shard` wählt eine Gruppe der Vollprüfung aus `tests/browser/shards.mjs`. Jeder Lauf schreibt die Dauer je Suite nach `.qa-output/browser/zeiten-*.json`.
**Seitenwechsel im Test** (seit 24.11.2026): `reload`, `goto` und `close` warten von selbst, bis die Seite nichts mehr lädt (`scripts/seitenwechsel.mjs`; die Wartezeit steht im Log unter „Wartehilfe vor Seitenwechseln“). Vor einem Wechsel innerhalb der App (Klick auf einen Bereich, `goBack`, Hash-Wechsel) wartet ein Test selbst mit `ladeanfragen` (`tests/browser/harness.mjs`). Einen echten Mausklick auf etwas, das nachgeladene Teile noch verschieben können (vor allem den Fuß der Startseite), macht ein Test mit `klickNachRuhe`: Playwright prüft das Ziel nur beim Drücken, rutscht es bis zum Loslassen weg, verpufft der Klick still.
**Playwright** (das Browser-Testwerkzeug) ist immer auf der neuesten Version, die mindestens 7 Tage alt ist (Wunsch des Nutzers, 21.11.2026). `/weiter` prüft das bei jedem Einstieg; ein Update ist ein eigener kleiner Commit mit `pnpm run check`.
Die passenden Browser holt `pnpm exec playwright install --with-deps chromium firefox webkit`: im Start-Skript der Cloud-Umgebung „wunderkompass“, direkt nach einem Playwright-Update oder wenn sie im Container fehlen, sonst nicht. Dann laufen Chromium, Firefox und WebKit auch im Container. Die CI prüft zusätzlich alle drei (Job „Vollprüfung“, bei PRs nach `main` oder von Hand; je Browser in Gruppen aus `tests/browser/shards.mjs`, alle gleichzeitig, Zeiten als Artefakt).

CI (`.github/workflows/quality.yml`): Job **„Required quality checks“** (Name nicht ändern, die Branch-Regel verlangt ihn) läuft bei jedem PR. Dazu läuft bei jedem PR die **„Engine-Schnellprüfung“**: der CI-Satz in Firefox und WebKit (kein Pflicht-Check, aber ein roter Lauf wird vor dem Merge geklärt).

## Arbeitsablauf

Jede Phase und jeder größere Schritt:

1. **Entwurf** in `docs/entwurf/`, Freigabe durch den Nutzer.
2. **Plan** in kleinen Schritten.
3. **Bauen** auf dem Branch `claude/...`.
4. **Prüfen:** `pnpm run check` grün, dazu passende Helfer. Ändert sich etwas, das Tests voraussetzen (welche Frage eine Karte zeigt, wo ein Text steht, welche Verbindung es gibt), zuerst alle betroffenen Tests suchen, nach dem Wortlaut und nach dem Auslöser (Speicherschlüssel wie `gameSessions['topic:`, Funktionen wie `antwortReihe`), und in einem Durchgang anpassen, dann die betroffenen großen Suiten gleich laufen lassen, nicht erst am Phasenende (Wunsch des Nutzers, 23.11.2026; Auslöser seit 24.11.2026). Wer Kartentexte oder den Kartenaufbau ändert (`app/world-catalog.json`, `app/kern/karte/`, `app/kern/kern.css`), lässt danach erst `pnpm run check` und dann `node tests/browser/run.mjs --suite full core offline-cold-full` laufen (rund 18 Minuten): `core` prüft das Wissensbuch und die verbundenen Entdeckungen, `offline-cold-full` die Karten und Reisen offline; beides sieht sonst nur die Vollprüfung (Technik-Prüfung Teil A; `offline-cold-full` dazu seit 24.11.2026).
5. **Zeigen:** Screenshots (aus `pnpm run test:smoke` oder einer lokalen Vorschau), in einfachen Worten. Bei sichtbaren Änderungen dazu den geprüften Stand einmal auf die Vorschau bringen und den Link schicken (Abschnitt Vercel). Arbeits-Branches selbst haben keine Vercel-Vorschau.
6. **Freigabe:** PR nach `test-live`, PR-Link, Screenshots und bei sichtbaren Änderungen den Vorschau-Link schicken. Merge nach grüner CI und „ok“ im Chat. Danach mit `list_deployments` prüfen, ob die Test-Seite neu gebaut ist, und den Link schicken.
7. **Nachführen:** `STATUS.md`, `BACKLOG.md`, `CHANGELOG.md`. Sichtbare Änderungen bekommen einen kurzen, kindgerechten Eintrag in „Was ist neu?“ auf der Seite (Wunsch des Nutzers, 21.11.2026; ab Phase 1). Der CHANGELOG-Eintrag eines PR endet mit einer Zeile **Messwerte** (Wunsch des Nutzers, 24.11.2026): *Funde vor dem PR* (Fehler, die Helfer oder Prüfungen vor dem PR fanden, ohne reine Stilvorschläge), *späte Funde* (erst in der CI auf GitHub, der Vollprüfung, `test:full` oder nach dem Merge) und *Dauer* (Stunden vom Beginn der Arbeit bis zum Merge). So lässt sich mit Zahlen sagen, ob wir schneller werden und weniger spät finden.
8. **Phasenende:** `test:full` in Chromium, Firefox und WebKit, weil alle die Test-Seite benutzen. Lokal geht das mit `pnpm run test:full -- --browser all`. In der CI startet Claude den Job „Vollprüfung“ von Hand auf dem Branch (`workflow_dispatch`), denn ohne PR nach `main` läuft er nicht von selbst. Den PR `test-live` → `main` gibt es nur, wenn `main` wieder genutzt wird (nach Frage und OK).

Kleine Korrekturen brauchen keinen Entwurf, laufen aber durch Prüfen, Zeigen und Freigabe.

**Alle Wege prüfen** (Wunsch des Nutzers, 24.11.2026): Bevor Claude eine Änderung am Verhalten empfiehlt, sucht es alle Wege, die dorthin führen (Wissensbuch, Lernrouten, Zurück, Neuladen, Stufenwechsel, alte Links), und sagt in der Empfehlung, was auf jedem Weg passiert.

**Tests.** Ein Test bleibt, wenn er schützt: (a) Pass und Speicher, (b) IDs, Hash-Links und alte Links, (c) Inhaltsintegrität, die Kinder merken (IDs, Verweise, Bilder, Bildnachweise), (d) genutzte App-Logik. Tests auf Nachweise, Berichte, alte Bytes oder wörtliche Alttexte gibt es nicht mehr. Keine Prüfung abschwächen, überspringen oder blind wiederholen.

**Im Chat immer Deutsch**, auch kurze Zwischenmeldungen und Beschreibungen von Befehlen (Wunsch des Nutzers, 21.11.2026).

**Berichte an den Nutzer** immer in dieser Form, kurz und ohne Fachjargon:

- Was ist fertig?
- Was kannst du dir ansehen (Link, Bild)?
- Was musst du entscheiden?
- Was kommt als Nächstes?

**Neuer Chat:** Am Ende jedes Teilschritts (nach dem Merge) und sobald ein Chat einmal automatisch zusammengefasst wurde, sagt Claude ausdrücklich, ob jetzt ein neuer Chat sinnvoll ist, und nennt die Startnachricht aus `STATUS.md`. Nie mitten in laufenden Prüfungen wechseln: Sie laufen im Container dieses Chats (Wunsch des Nutzers, 21.11.2026).

**Übergabe beim Chatwechsel** (Wunsch des Nutzers, 23.11.2026): Nichts geht verloren, und der neue Chat muss nichts neu ausdenken. Wünsche, Regeln und Ideen des Nutzers aus dem Chat kommen gleich ins Repository (Regeln in diese Datei, Ideen ins `BACKLOG.md` unter „Ideen-Sammlung“), nicht erst beim Wechsel. Vor der Ansage „Jetzt neuen Chat starten“: alles committet und gepusht (gemergt oder in einem offenen PR, keine nur lokalen Zweige); Entscheidungen und aufgeschobene Kleinigkeiten aus dem Arbeitsprotokoll (`.superpowers/`, nicht in Git) als Entscheidungsliste in `docs/entwurf/`; Helferberichte, Messwerte und Pläne, die der nächste Chat braucht, als Datei im Repository; `STATUS.md` nennt Stand, offene Fragen und den nächsten Schritt mit Fundstellen. Chatverlauf, Scratchpad, Nebenordner und Hintergrundprozesse gehen beim Wechsel verloren.

**Laufend sichern** (Wunsch des Nutzers, 23.11.2026): Das Nutzungslimit des Nutzers kann jederzeit erreicht sein; Claude sieht es nicht. Darum nach jedem Teilschritt einer Aufgabe committen und pushen (Zwischenstände ehrlich als solche benannt), Helferberichte sofort als Datei in `docs/entwurf/` sichern und `STATUS.md` bei jedem Meilenstein nachführen. So kann im selben oder in einem neuen Chat ohne Verlust weitergearbeitet werden. Nennt der Nutzer einen Stand (z. B. „90 %“), sofort alles sichern und kurz sagen, was als Nächstes käme.

**Commits:** `git -c user.name=Claude -c user.email=noreply@anthropic.com commit …`, deutsche Betreffzeile. Vor jedem Push `git diff --check` und Autor/Committer prüfen.

## Helfer (`.claude/agents/`)

Helfer melden nur Befunde oder liefern Entwürfe und ändern nichts. Claude entscheidet und setzt um. Wer einen Entwurf schreibt, prüft ihn nicht selbst.

**Neue Helfer** (Wunsch des Nutzers, 23.11.2026): Brauchen wir einen Helfer, um schneller, ordentlicher oder effizienter voranzukommen, schlägt Claude ihn mit Grund vor (und sagt auch, wovon er abrät); entschieden wird gemeinsam mit dem Nutzer.

**Helfer parallel nutzen** (Wunsch des Nutzers, 24.11.2026): gut, schnell und effizient arbeiten, weil neue Inhalte und ein neues Design kommen. Unabhängige Arbeiten gehen gleichzeitig an Hintergrund-Helfer (z. B. Bildsuche, Prüfungen, Entwürfe), Wartezeiten (Prüfkette, große Suiten, CI) werden damit gefüllt. Ein Helfer kann mehrmals gleichzeitig laufen: Große Aufgaben werden in Pakete geteilt (z. B. 8 Karten je Auftrag), statt Helfer doppelt anzulegen. Grenzen: Prüfung und Einbau (jede Fassung lesen drei Prüfer, Claude baut ein), das Nutzungslimit, Bremsen fremder Dienste (Wikimedia) und ein einheitlicher Ton. Vor jedem Auftrag in `docs/entwurf/` nachsehen, ob es schon einen Bericht gibt (z. B. Bildkandidaten), und darauf aufbauen. Ergebnisse sofort als Datei sichern.

**Helfer überall am Start** (Wunsch des Nutzers, 24.11.2026): Bei jedem Schritt, auch kleinen, fragt Claude: Welcher Helfer hilft hier? Wo es einen passenden gibt, arbeitet er mit: Ideen (`ideen-scout`), alle Kindertexte (`karten-autor`), Bilder (`bild-recherche`), Prüfungen (`fakten-pruefer`, `kinder-redaktion`, `stufen-pruefer`, `code-pruefer`, `design-pruefer`, `spieltester`), Arbeitssystem (`technik-pruefer`). Deckt kein Helfer eine Arbeit ab, schlägt Claude vor, einen zu erweitern oder neu anzulegen (Regel „Neue Helfer“). Claude sagt im Bericht, welche Helfer mitgearbeitet haben.

**Helfer müssen laufen** (Wunsch des Nutzers, 23.11.2026). Ein Chat liest Helfer und Kurzbefehle aus seinem Hauptordner; ein neuer Helfer erscheint erst, wenn er dort liegt (manchmal mit Verzögerung, sicher im nächsten Chat). Darum im Hauptordner arbeiten; ein Nebenordner nur kurz, danach den Hauptordner nachziehen. Fehlt ein Helfer aus `.claude/agents/` in der Helferliste des Chats (z. B. neu angelegt): trotzdem einsetzen, von Hand als `general-purpose` mit Modell und Stufe aus seiner Datei und seiner Anleitung als Auftrag, und es dem Nutzer sagen. Nie still weglassen. Nach jedem spät gefundenen Fehler (erst in der CI-Vollprüfung oder in `test:full`) läuft der `technik-pruefer`, bevor die Korrektur gemeldet wird.

| Helfer | Aufgabe | Modell / Stufe |
|---|---|---|
| `kinder-redaktion` | Texte für 5- bis 10-Jährige: Satzlänge, Fachwörter, Ton, Länge, Doppeltes, Mini-Fragen | opus / high |
| `fakten-pruefer` | Aussagen gegen Quellen, Zahlen, Einheiten, Aktualität | opus / high |
| `stufen-pruefer` | Schwierigkeit je Stufe (Entdecker, Profi, Experte): machbar für Kleine, fordernd für 10- bis 12-Jährige, keine Ratemuster (seit 23.11.2026) | opus / high |
| `karten-autor` | Schreibt Entwürfe für alle Kindertexte: Karteninhalte (Häppchen, „Stimmt das?“, Fragen je Stufe, Tipps, „warum nicht“, Verbindungssätze) und seit 24.11.2026 auch Spiele, Rätsel, Labore, Lernreisen, Missionen und „Was ist neu?“ (ein Schreib-Helfer für alles, damit der Ton einheitlich bleibt; mehr Tempo durch Pakete) mit Quelle je Aussage; prüft nicht selbst, danach prüfen `fakten-pruefer`, `kinder-redaktion`, `stufen-pruefer` unabhängig (seit 23.11.2026) | opus / high |
| `design-pruefer` | Screenshots in 320, 390, 768, 1280, 1440 px: Lesbarkeit, Kontrast, Fokus, Tippflächen, Abgeschnittenes, Bildwirkung | sonnet / high |
| `code-pruefer` | Änderungen auf Fehler, besonders Pass, IDs und Links | opus / high |
| `bild-recherche` | Freie Fotos suchen, Lizenz und Namensnennung prüfen, Nachweis vorbereiten | sonnet / medium |
| `ideen-scout` | Vergleichbare Angebote ansehen, Ideen als Vorschläge liefern | sonnet / medium |
| `technik-pruefer` | Arbeitssystem: späte Prüfungen, CI-Dauer, Unterlagen gegen Wirklichkeit, Pakete, Modellnamen, Vercel/GitHub | sonnet / high |
| `spieltester` | Benutzt die Seite im echten Browser in einer Rolle (Alter, Gerät) mit einem klaren Ziel, spielt bis zum Ende, meldet Sackgassen, Verwirrendes, Kaputtes, zu leicht oder zu schwer, mit Bildern. Kein Kindertest; echte Kinder bleiben die wichtigste Rückmeldung. Einsatz bei sichtbaren Änderungen vor dem PR und am Phasenende, nicht bei jeder Kleinigkeit (seit 24.11.2026, Pilot) | sonnet / high |

- `fable` (stärkstes Modell) nur gezielt für große Abschlussprüfungen am Phasenende.
- `haiku` für einfache Massenprüfungen, z. B. alle Karten auf kaputte Verweise.
- **Vorübergehende Modell-Ausnahmen** (z. B. Kontingent eines Modells erschöpft) stehen mit Enddatum in `STATUS.md`. Ist das Datum vorbei: wieder das Modell aus dieser Liste nehmen, den Eintrag löschen, dem Nutzer kurz Bescheid sagen. `/weiter` prüft das bei jedem Einstieg.

**Modell-Stand** (für den Vergleich in `/weiter`): 21.11.2026: Fable 5.2, Opus 5.5, Sonnet 5.5, Haiku 5.5.

## Kurzbefehle (`.claude/skills/`)

- `/weiter` – Wiedereinstieg: Branch prüfen (auf `main` → zu `test-live` wechseln), `CLAUDE.md` und `STATUS.md` lesen, Git-Stand prüfen, Modell-Check, nächsten Schritt nennen.
- `/pruefen` – vor einer Übergabe: Prüfkette, passende Helfer, ehrlicher Sammelbericht.

## Wo was liegt

| Ort | Inhalt |
|---|---|
| `app/` | Die App (React 19, Vite 8, Tailwind 4): Ansichten, Inhalte als JSON/TS, Pass, Service Worker; der neue Kern in `app/kern/` (Karte in `karte/`, Stufe in `stufe.ts`) |
| `app/world-catalog.json` | Alle Wissenskarten; Fotos und Nachweise in `app/world-photos.json` |
| `components/`, `lib/` | Gemeinsame UI-Bausteine und Hilfen |
| `public/` | Bilder, Fotos (WebP in 320/640/960), Karten, statische Dateien |
| `build/` | Vite-Plugins: Build-Kennung, Offline-Liste, Worker |
| `scripts/` | `export-content.mjs` (Exporte und Inhaltsprüfung), Größenbudget, Test-Laufzeit, `antworten-stand.mjs` (datierte Antwortliste, vor jedem Merge, der neue Antworten bringt) |
| `tests/*.test.mjs` | Unit-Tests; `tests/fixtures/` feste Altstände für Kompatibilität (z. B. `stable-ids.json`; `gespeicherte-antworten*.json`: Antworten, die Kinder gespeichert haben können, die Listen wachsen nur) |
| `tests/browser/` | Browser-Runner (`run.mjs`, `suites.mjs`, `harness.mjs`) und Suiten |
| `content/research/` | Quellen und Daten, die die App liest |
| `docs/entwurf/` | Entwürfe und Pläne je Phase |
| `docs/archiv/` | Originalaufträge des Nutzers und die alte AGENTS.md |
| `STATUS.md`, `BACKLOG.md`, `VISION.md`, `CHANGELOG.md` | Stand, Aufgaben, Produktziele, Verlauf |

Der alte Stand mit allen Berichten liegt in Commit `b53f75f` (Historie von `test-live`).

## Vercel

- Team `team_ZoDaUGD4xeLiekVnSQ4oD2aE`, Projekt `prj_ZY036iUMf0CKLgb4h9ywyGBTUHRI` (Git-Anbindung; gebaut werden nur `test-live` und `vorschau`, siehe `vercel.json`).
- Kostenloser Plan: höchstens 100 Deployments in 24 Stunden (gleitendes Fenster, abgebrochene Builds zählen mit; [Bericht](docs/entwurf/2026-11-24-vercel-tageslimit.md)). Ist das Limit erreicht, geht der Merge trotzdem (Vercel ist kein Pflicht-Check). Die Test-Seite zieht dann erst mit dem nächsten Merge nach `test-live` nach.
- **Tageslimit, ohne dass etwas verloren geht** (Wunsch des Nutzers, 24.11.2026). Gebaut werden nur Merges nach `test-live` und Vorschau-Runden, das sind weit unter 100 am Tag. Gezählt oder auf den nächsten Tag verschoben wird nichts. Jeder Build von `test-live` baut den ganzen Stand von `test-live`, ein gesperrter Merge ist darum im nächsten Build mit drin.
  - Nach jedem Merge prüft Claude mit `list_deployments` (Branch `test-live`), ob der Merge-Commit `READY` ist.
  - Wenn nicht: In `STATUS.md` unter „Adressen“ steht dann „Test-Seite noch auf Stand `<sha>`“, und der Nutzer erfährt es im Bericht.
  - `/weiter` prüft bei jedem Einstieg, ob der neueste Commit auf `test-live` gebaut ist. Nachgezogen wird mit dem nächsten Merge. Keine Deployments von Hand: Will der Nutzer den Stand sofort, klickt er selbst in Vercel auf „Redeploy“.
- **Vorschau** (Branch `vorschau`, OK des Nutzers, 24.11.2026): nur bei sichtbaren Änderungen und erst, wenn `pnpm run check` grün ist, einmal je Runde (vor dem PR-Link, nach größeren Korrekturen noch einmal). Unterlagen, Tests und Werkzeuge kommen nicht auf die Vorschau.
  - So, ohne Force-Push und immer als neuer Commit mit genau den Dateien von `HEAD` (Nachricht deutsch, mit der kurzen SHA von `HEAD` und den üblichen Abschlusszeilen). Ein neuer Commit muss es sein: Bei der Probe am 24.11.2026 baute Vercel einen Commit, der schon auf `claude/...` lag, auf `vorschau` nicht; der neue Commit aus diesem Befehl wurde sofort gebaut. Die `&&` sind wichtig: Schlägt ein Teil fehl, wird nichts gepusht (ein leerer Wert vor `:refs/heads/vorschau` würde den Branch löschen).
    ```bash
    git fetch origin vorschau && V=$(git -c user.name=Claude -c user.email=noreply@anthropic.com commit-tree 'HEAD^{tree}' -p origin/vorschau -m "Vorschau: <Thema>, Stand $(git rev-parse --short HEAD)" -m '<Abschlusszeilen>') && git push origin "$V":refs/heads/vorschau
    ```
  - Fehlt `vorschau` auf GitHub (der Fetch meldet einen Fehler), einmal mit `-p HEAD` statt `-p origin/vorschau` anlegen. `vorschau` ist nur zum Anzeigen da: nie als Basis nehmen, nie mergen.
  - Gebaut wird nur, wenn `vercel.json` im gezeigten Stand `"vorschau": true` enthält (seit `3b85f24`). Fehlt es, erst `test-live` in den Arbeitsbranch holen.
  - Es gibt nur eine Vorschau: Die neueste Runde ersetzt die vorige, auch die eines anderen Chats.
  - Danach mit `list_deployments` (Branch `vorschau`) warten, bis der Stand `READY` ist, dann den Link schicken.
  - Die Vorschau hat eine andere Adresse als die Test-Seite und darum einen eigenen Entdeckerpass (je Gerät). Was dort gesammelt wird, bleibt dort. Dem Nutzer beim Link sagen: nur zum Ansehen, nicht an Kinder weitergeben; Kinder benutzen die Test-Seite.
  - Ist das Tageslimit erreicht, reichen Screenshots. Die Vorschau zieht mit der nächsten Runde nach.
- Status über das Vercel-MCP (`list_deployments`), keine Deployments von Hand.
- Feste Adressen: Testseite (`test-live`) https://wunderkompass-git-c76589-interaktive-wissens-und-lernplattform.vercel.app/, Vorschau (`vorschau`) https://wunderkompass-git-f420d3-interaktive-wissens-und-lernplattform.vercel.app/, älterer Stand (`main`, zurzeit nicht genutzt und nicht gebaut) https://wunderkompass.vercel.app/.

## Neue Sitzung

Der Standardbranch auf GitHub ist seit 21.11.2026 `test-live`; neue Sitzungen starten damit auf dem aktuellen Stand. `main` ist ein älterer Stand und wird zurzeit nicht genutzt. Die Startnachricht zum Kopieren steht in `STATUS.md` („Neuer Chat: Startnachricht“); ihre Branch-Zeilen sind nur noch eine Sicherung.
