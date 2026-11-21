# WunderKompass – Neuausrichtung (Weg C) und Schritt 0 „Großputz & Arbeitsweise“

Stand: 21.11.2026 · Status: **Freigegeben vom Nutzer am 21.11.2026** · Bauplan: [`2026-11-21-schritt-0-plan.md`](2026-11-21-schritt-0-plan.md)

Dieser Entwurf hat zwei Teile. Teil 1 beschreibt die Gesamtrichtung, auf die wir uns geeinigt haben. Teil 2 beschreibt Schritt 0 so genau, dass man ihn ohne Rückfragen planen und bauen kann. Jede spätere Phase bekommt ihren eigenen Entwurf und ihre eigene Freigabe.

---

## Teil 1 – Gesamtrichtung

### Warum

WunderKompass soll eine Lernseite sein, die man Freunden schicken kann, damit sie mit ihren Kindern entdecken und lernen. Die bisherige Seite (mit ChatGPT/Codex gebaut) hat viele Inhalte und einige wertvolle Teile, zum Beispiel den 3D-Globus, Spiele und Labore. Es gibt aber drei Probleme:

- **Für Kinder nicht passend genug.** Sprache, Länge und Aufbau sind oft wie ein Fachlexikon. Es gibt doppelte Fakten, Fachwörter und englische Bildnachweise. Die Wissenskarten sind auf dem Handy sehr lang.
- **Schwer weiterzuentwickeln.** Ein großer Teil der Arbeit ging in Nachweis- und Prozessbürokratie. Dazu gehören 12 MB Vergleichsdateien, 9 MB Prüfberichte als JSON, Release-Sperren und eine CI, die drei Browser vollständig durchtestet. Teile des Codes stehen in Zeilen mit bis zu 6.000 Zeichen.
- **Die Arbeitsregeln passen nicht mehr.** Die alte AGENTS.md ist für Codex-Durchläufe mit Leases und einem Betriebsende am 16.11.2026 geschrieben. Dieses Datum ist vorbei.

### Für wen

- **Hauptsächlich Kinder von 5 bis 10 Jahren**, selten 12 bis 14.
- **Meistens zusammen mit einem Elternteil**, ab etwa 8 Jahren auch allein.
- Daraus folgt: kurze Sätze, große Bilder, große Tippflächen, wenig Lesen bis zur ersten Handlung. Für Eltern gibt es eine freiwillige Vertiefung („Mehr für Große“). Altersangaben dienen nur der Orientierung und werden nicht abgefragt.

### Die drei Wege, die wir betrachtet haben

| Weg | Was | Vorteil | Nachteil |
|---|---|---|---|
| A – Ausbessern | Bestehende Seite Stück für Stück reparieren | Nichts geht verloren | Bürokratie und schwer wartbarer Code bleiben, jede Änderung bleibt teuer |
| B – Komplett neu | Alles neu bauen | Saubere Basis | Globus, Spiele und Labore müssten neu entstehen. Das dauert sehr lange und hat ein hohes Risiko |
| **C – Neuer Kern, Bewährtes umziehen** ✅ | Kern neu und kindgerecht (Startseite, Navigation, Themenwelten, Wissenskarte, Design). Globus, Spiele und Labore bleiben und ziehen einzeln um. Inhalte ziehen Welt für Welt um, zuerst die Tiere. | Schnell sichtbare Verbesserung, teure Teile bleiben erhalten | Eine Zeit lang leben alter und neuer Teil nebeneinander |

**Gewählt: Weg C** (Entscheidung des Nutzers am 21.11.2026).

### Phasen

| Phase | Inhalt | Für Kinder sichtbar? |
|---|---|---|
| **0 – Großputz & Arbeitsweise** | Ballast entfernen, schlanke Prüfungen, neue kurze Unterlagen, Helfer einrichten | **Nein**, die Seite bleibt gleich |
| 1 – Neuer Kern | Design-System, neue Startseite, Navigation, Themenwelt-Seite, neue Wissenskarte, zuerst für das Handy | Ja |
| 2 – Tierwelt | Erste Welt komplett neu: kindgerechte Texte, geprüfte Fakten, Fotos mit Rechten, kleine Aufgaben | Ja |
| 3 – Weitere Welten | Welt für Welt nach dem Tierwelt-Muster | Ja |
| 4 – Globus, Spiele, Labore | Einzeln in den neuen Kern übernehmen und dabei verbessern | Ja |

Die Reihenfolge ab Phase 2 kann sich ändern, wenn der Nutzer das möchte oder Ideen dazukommen. Dann wird das BACKLOG angepasst.

### Ziele

1. Kinder finden in wenigen Sekunden etwas Spannendes und können sofort etwas tun: schauen, tippen, raten.
2. Inhalte stimmen fachlich und sind kindgerecht. Jede wichtige Aussage hat eine geprüfte Quelle.
3. Die Seite funktioniert gut auf dem Handy (ab 320 px Breite), auf dem Tablet und am Rechner, auch offline.
4. Weiterentwickeln ist billig. Kleine Schritte, schnelle Prüfungen und eine Vorschau für jeden Schritt.
5. Der Nutzer versteht jederzeit, was passiert, und entscheidet bei wichtigen Punkten mit.
6. **Alles hängt zusammen** (Wunsch des Nutzers, 21.11.2026). Jedes Thema führt zu sinnvoll verwandten Themen, Orten, Spielen und Experimenten, damit Kinder Zusammenhänge entdecken. Ein Beispiel für so einen Weg: Elefant → Savanne → Ort auf dem Globus → Wasser und Trockenzeit → kleines Spiel. Die Verbindungen müssen fachlich echt sein, keine Zufallsempfehlungen. Heute wirken viele Verknüpfungen zufällig, zum Beispiel Elefant → Honigbiene oder Großer Panda.

Neue Welten, Themen, Spiele und andere Ideen sind ausdrücklich erwünscht. Claude entscheidet darüber, sammelt sie im BACKLOG (mit Hilfe des `ideen-scout`) und baut sie in passende Phasen ein. Wichtige Richtungswechsel zeigt Claude vorher dem Nutzer.

### Nicht-Ziele (jetzt nicht)

- Kein Konto- oder Anmeldesystem, keine Cloud-Speicherung von Kinderdaten.
- Keine KI-Funktionen in der Seite selbst (kein Chatbot für Kinder).
- Keine getrennten Seiten nach Alter.
- Keine neue Programmiersprache und kein neues Framework. React, Vite und Tailwind bleiben.

### Anti-Ziele (wäre ein Fehlschlag, auch wenn es technisch läuft)

- Kinder verlieren ihren Fortschritt im Entdeckerpass.
- Alte Links von Freunden führen ins Leere.
- Es entstehen Kosten.
- Prozessarbeit wächst wieder schneller als das Produkt.
- Kinder sehen halbfertige oder kaputte Zustände.

### Feste Regeln (gelten in allen Phasen)

- **Kostenlos.** Keine kostenpflichtigen Dienste, Abos, Testzugänge oder Upgrades. Das gilt auch für Hosting, Builds, Bilder und Audio.
- **Kompatibilität.** Karten-, Fragen-, Kapitel-, Spiel- und Reise-IDs bleiben gleich. Die Hash-Links (`#world/...`) funktionieren weiter. Der Pass (Schema 3, `earth-explorer`, Schlüssel `erde-entdecken:save:v3`, IndexedDB `earth-explorer`) bleibt der einzige Lernspeicher. Wer den Speicher ändert, muss mit Altdaten, Import/Export und Reload zeigen, dass nichts verloren geht.
- **Daten.** Keine echten Pass-Dateien, Notizen, persönlichen Daten oder Zugangsdaten ins Repository. Nur ausgedachte Testpässe.
- **Bilder.** Nur mit geklärten Rechten und korrektem Bildnachweis. Vorhandene Nachweise bleiben erhalten.
- **Git.** `main` wird nie direkt geändert. Kein Force-Push auf `test-live` oder `main`. Gemergt wird nur über einen PR, nach grüner Prüfung und nach Freigabe des Nutzers. Claude darf PRs nach `test-live` selbst öffnen, gemergt wird aber erst nach einem „ok“ des Nutzers im Chat (Nutzerentscheidung 21.11.2026).
- **Zwei Adressen** (Nutzerentscheidung 21.11.2026):
  - **Hauptadresse `wunderkompass.vercel.app`** (aus `main`): Diesen Link bekommen Freunde und Kinder. Er wird nur nach einer fertigen Phase und nach OK des Nutzers erneuert, über einen PR von `test-live` nach `main`. Kinder sehen so nie halbfertige Zwischenstände.
  - **Test-Adresse** (aus `test-live`): Unsere Arbeitsfläche. Dort darf zwischen zwei Phasen auch Unfertiges stehen.
  - Alte Links von Freunden müssen auf beiden Adressen funktionieren.
- **Ehrlichkeit.** Keine Prüfung behaupten, die nicht stattgefunden hat. Keine erfundenen Studien, Kindertests oder Lernwirkungen.
- **Datenschutz.** Name und E-Mail des Nutzers gehen nie an externe Dienste.

### Was aus den alten Regeln wird

Der Nutzer hat am 21.11.2026 entschieden: Claude übernimmt die Entwicklung, ist frei in Gestaltung, Inhalten, Reihenfolge und Unterlagen und darf die Unterlagen ändern. Die alte AGENTS.md sieht selbst vor, dass spätere ausdrückliche Nutzerweisungen Vorrang haben. Deshalb gilt:

- **Bleibt** (als „Feste Regeln“ oben): Kompatibilität, Datenschutz, Bildrechte, Git-Schutz, Kostenfreiheit, Ehrlichkeit.
- **Entfällt**:
  - Codex-Leases und Reservierungen, Betriebsende 16.11.2026
  - Pflicht zur „Mindestverdopplung“ der Inhalte
  - Nachweisbindung jedes Prüflaufs an Quell-Hashes
  - Drei-Browser-Vollpipeline vor jedem Schritt
  - Release-Sperren und -Genehmigungen, Prüfung der Auslieferungsbytes
  - Pflicht-Prüfberichte als JSON
- Die Originalaufträge des Nutzers (`content/auftrag-2026-10-13/`) bleiben zum Nachlesen erhalten (siehe Schritt 0). Gute Ideen daraus übernehmen wir ins neue BACKLOG.

---

## Teil 2 – Schritt 0 „Großputz & Arbeitsweise“

### Ziel

Am Ende von Schritt 0:

- **sieht die Seite für Kinder exakt gleich aus und funktioniert gleich**,
- ist das Repository deutlich kleiner und übersichtlich,
- laufen die Prüfungen in wenigen Minuten statt in einer langen Drei-Browser-Pipeline,
- gibt es kurze, verständliche Unterlagen,
- sind die Helfer eingerichtet, sodass Phase 1 sauber starten kann.

### Ausgangslage (gemessen am 21.11.2026)

- Arbeitslinie ist `test-live`, Stand `b53f75f`. `main` ist eine ältere, abgezweigte Linie (Stand 9.10.2026). Sie enthält nur 10 eigene Prozess-Commits und nichts für Kinder.
- Typprüfung, Lint und `pnpm test` (572 Tests) sind auf `b53f75f` grün.
- Große Ballastposten:

  | Posten | Größe |
  |---|---|
  | `exports/content` | 16 MB |
  | `tests/fixtures` (Vorgänger-Vergleichsdateien) | 12 MB |
  | `content/editorial-reviews.json` | 9,2 MB |
  | `.github/actions/upload-review-parts` | 4,4 MB |
  | weitere `content/*-review.*` und `excellence-baseline.json` | ca. 3 MB |
  | `tsconfig.tsbuildinfo` (erzeugte Datei) | 0,7 MB |

- 131 Unit-Testdateien und 130 Browser-Testdateien, viele davon prüfen Nachweise statt Verhalten.
- Vercel baut Vorschauen für alle Branches außer `codex/**`. `claude/**`-Branches sollten also schon Vorschau-Links bekommen. Das wird beim ersten Push geprüft.
- **Offener Codex-PR #95** („WK-053“, Branch `codex/wunderkompass-history-evidence-2026-11-08`, Head `7e00bd0`): acht neue Geschichtsthemen (Kilwa, Angkor, Caral, Nalanda, Hattuscha, Rosetta, Çatalhöyük, Cahokia) und acht vertiefte Artikel. Basis ist genau `b53f75f`. Er umfasst 150 Dateien und +168.000 Zeilen, größtenteils Nachweisdateien. Die letzte Pflichtprüfung vom 12.11. ist rot, weil ein Browser-Test in eine Zeitüberschreitung lief.
- Auf GitHub liegen außerdem viele alte Branches (107 bereits gemergte, 122 `codex/*`) und der alte Entwurfs-PR #27.

### 0.1 Sicherung vor dem Aufräumen

- Ein Git-Tag `archiv/vor-neuausrichtung-2026-11-21` auf `b53f75f` wird angelegt und gepusht. Damit bleibt der komplette alte Stand mit allen Berichten und Tests jederzeit abrufbar, ohne dass er im Arbeitsbaum liegt.
- Der Tag gilt als Sicherungsbasis. Er wird nicht gelöscht.
- **PR #95** (Nutzerentscheidung 21.11.2026: „Sichern, später kindgerecht übernehmen“):
  - Ein zweiter Tag `archiv/pr95-geschichte-2026-11-21` kommt auf den PR-Head `7e00bd0`.
  - Ins BACKLOG kommt ein eigener Eintrag: Die acht Themen und die acht Vertiefungen werden übernommen, wenn die Geschichtswelt umzieht (Phase 3). Vorher prüfen `kinder-redaktion` und `fakten-pruefer` sie. Geklärte Fotos und Bildnachweise aus dem PR werden weiterverwendet.
  - Der PR wird nicht gemergt. Er bleibt offen, bis der Nutzer ihn schließen möchte. Sein Branch wird nicht gelöscht.
  - Die Arbeitslinie bleibt bei 204 Themen.

### 0.2 Was entfernt wird

Grundregel: Vor jedem Löschen wird geprüft, ob App, Build, `public/` oder eine verbleibende Prüfung die Datei direkt oder indirekt braucht (Suche nach Importen und Lesezugriffen). Was gebraucht wird oder unklar bleibt, bleibt erst einmal liegen und wird im STATUS notiert.

| Bereich | Entfernen | Bemerkung |
|---|---|---|
| Vergleichs- und Nachweisdaten | `tests/fixtures/*-predecessor*`, `tests/*-reference.mjs`, `content/*-review.json/.md`, `content/editorial-reviews.json`, `content/excellence-baseline.json` | **Achtung:** `app/update-history.ts` importiert `content/update-history-evidence.json`. Diese Datei bleibt in Schritt 0 unverändert, weil sie in der App angezeigt wird. |
| Export-Kopie | `exports/content` | Nur entfernen, wenn nichts außer `verify` sie liest. Das Export-Skript kann sie bei Bedarf neu erzeugen. |
| Release-Maschinerie | `scripts/release/*`, `scripts/handoff.mjs`, `scripts/review-evidence.mjs`, `scripts/quality-evidence.mjs`, `scripts/test-selection.mjs`, `scripts/measure-build.mjs`, `tests/release/`, `.github/actions/upload-review-parts`, Workflow `test-release.yml` | Vorher prüfen, dass Vercel unabhängig davon baut (Git-Integration). |
| Prozess-Tests | Unit- und Browser-Tests, die nur Nachweisdateien, Berichte, historische Bytes oder eingefrorene Alttexte prüfen | Eingefrorene Alttexte würden ab Phase 2 jede Textverbesserung blockieren |
| Erzeugte Dateien | `tsconfig.tsbuildinfo` | In `.gitignore` aufnehmen |
| Alte Prozessunterlagen | `MASTER-AUDIT.md`, `WORLD-AUDIT.md`, `QA.md`, `PRUEFBERICHT.md`, `INVENTAR.md`, `TEST-LIVE.md`, `PROJECT_STATE.md`, `QUALITY.md`, `MIGRATION.md`, `DEPENDENCIES.md` | Bleiben im Archiv-Tag. Noch Gültiges wandert knapp in die neuen Unterlagen. |
| Altes Paket für Prüfwerkzeuge | `qa/` | Nur wenn der neue Rauchtest ohne es auskommt |

**Nicht** entfernt werden:

- alles unter `app/`, `components/`, `lib/`, `public/` und `vendor/`
- Inhaltsquellen wie `app/world-catalog.json`, `content/research/` und Bildnachweise
- `vercel.json` und der Service Worker

### 0.3 Was als Prüfung bleibt oder neu entsteht

Ein Test bleibt, wenn er eines davon schützt:

- **a)** Pass und Speicher (Schema 3, Altpass v2, Import/Export, Reload, Fehlerfälle)
- **b)** IDs, Hash-Links und Weiterleitungen alter Links
- **c)** Inhaltsintegrität, die Kinder merken würden: eindeutige IDs, Verweise zeigen auf existierende Karten, Bilder existieren, jedes Foto hat einen Nachweis
- **d)** App-Logik, die noch verwendet wird, zum Beispiel Spiele-Logik oder Suche

Ein Test fliegt, wenn er nur Nachweise, Berichte, historische Bytes oder wörtliche Alttexte prüft.

Neue schlanke Prüfkette (lokal und in der CI gleich):

1. `pnpm install --frozen-lockfile`
2. `pnpm run typecheck`
3. `pnpm run lint` (Lint-Liste an die verbleibenden Skripte angepasst)
4. `pnpm test`: verbleibende Unit-Tests
5. `pnpm run build`, inklusive bestehendem Größenbudget, sofern es nicht an gelöschten Dateien hängt
6. `pnpm run test:smoke`: **neuer kleiner Browser-Rauchtest** in Chromium, je einmal Handy (360 px) und Desktop:
   - Startseite lädt ohne Konsolenfehler
   - eine Themenwelt öffnet sich
   - eine Wissenskarte öffnet sich per Hash-Link
   - ein Eintrag im Pass wird gespeichert und übersteht einen Reload
   - ein alter Link wird korrekt aufgefangen

**Die 130 vorhandenen Browser-Tests** (meine Entscheidung nach der Gegenlese). Heute laufen sie über `tests/browser/quality-runner.mjs`. Dieser Runner hängt an Skripten, die entfernt werden (`handoff.mjs`, `quality-evidence.mjs`, `scripts/release/*`). Deshalb gilt:

- **Pass, Sicherung, Altpass, Offline und alte Links** (Regeln a und b): Diese Browser-Tests ziehen auf einen schlanken neuen Runner um und laufen bei jedem PR in Chromium mit. Heute sind das etwa zehn Dateien, zum Beispiel `backup`, `legacy-games`, `offline*`, `storage-feedback`, `animal-game-saves` und `pass-atlas`. Dazu kommen die vorhandenen Unit-Tests zum Speicher, etwa `progress.test.mjs` und die `*-transfer-compatibility`-Tests. Sie bleiben ohnehin.
- **Übrige Browser-Tests mit noch genutzter App-Logik** (Regel d): Sie kommen in die Sammlung `pnpm run test:full`. Diese läuft am Ende jeder Phase, und dann auch in Firefox und WebKit.
- **Aufwendige Fälle:** Tests, die sich nur mit großem Aufwand vom alten Runner lösen lassen, bleiben im Archiv-Tag. Sie werden im STATUS aufgelistet. Wenn die betroffene Welt umzieht, entsteht für sie ein neuer, passender Test.
- **Alter Runner:** Er wird mit seinen Prozess-Abhängigkeiten entfernt.
- **Zeitgrenze:** Kommt die CI damit über 10 Minuten, wandern die langsamsten Tests aus Regel d in `test:full`. Die Pass-Tests bleiben immer in der CI.

CI (`quality.yml`):

- Der Job-Name **„Required quality checks“ bleibt exakt gleich**, weil die GitHub-Regel für `test-live` ihn verlangt.
- Nur Chromium, Ziel unter 10 Minuten.
- Firefox und WebKit prüfen wir gezielt vor großen Übergaben (Ende einer Phase, `test:full`), nicht bei jedem Schritt.

**Nachweis, dass sich für Kinder nichts ändert:**

- Die App-Dateien in `dist/` (JS, CSS, HTML, `public/`-Kopien) werden vor und nach dem Aufräumen gebaut und verglichen. Erlaubte Unterschiede gibt es nur bei der Build-Kennung. Für den Vergleich wird sie vorher in beiden Ständen durch einen Platzhalter ersetzt.
- Die Build-Kennung ändert sich zwangsläufig, denn `build/learning-fingerprint.mjs` rechnet `package.json` und `pnpm-lock.yaml` mit ein. Folge: Wer die Seite offline gespeichert hat, sieht nach dem Merge einmal „Neue Version laden“. Das ist gewollt und harmlos, der Pass bleibt erhalten. Der Nutzer erfährt das im Bericht.
- Zusätzlich gibt es Screenshots von Startseite, Themenwelt und Wissenskarte (Handy und Desktop), vorher und nachher.

### 0.4 Neue Unterlagen

Kurz, auf Deutsch, für Menschen lesbar:

| Datei | Inhalt | Ziel-Länge |
|---|---|---|
| `CLAUDE.md` | Arbeitshandbuch für Claude: Projekt in 5 Sätzen, Zielgruppe, feste Regeln, Befehle, Arbeitsablauf, Helfer und Modelle, wie berichtet wird | ca. 150 Zeilen |
| `AGENTS.md` | Kurzfassung der festen Regeln mit Verweis auf `CLAUDE.md`, für andere KI-Werkzeuge. Die alte Fassung kommt ins Archiv. | unter 40 Zeilen |
| `README.md` | Was ist WunderKompass, wie startet man es lokal, wo ist was | kurz |
| `VISION.md` | Zielgruppe, Ton, Gestaltungslinie (hell, bildstark, Orange und Petrol als Akzente, Kompass-Identität), die sechs Hauptbereiche | ca. 60 Zeilen |
| `BACKLOG.md` | Eine priorisierte Liste: Phase 1 im Detail, später grob, Ideen-Sammlung. Produktrelevante offene Punkte aus dem alten Backlog werden übernommen, nicht alle 498 Zeilen. | so kurz wie möglich |
| `STATUS.md` (ersetzt PROJECT_STATE) | Wo stehen wir, was ist der nächste Schritt, offene Fragen an den Nutzer | unter 60 Zeilen |
| `CHANGELOG.md` | Neu begonnen mit „21.11.2026 Neuausrichtung“, in einfachen Worten. Die alte Chronik bleibt im Archiv-Tag. | wächst mit |
| `docs/archiv/` | Die Originalaufträge des Nutzers (bisher `content/auftrag-2026-10-13/`) und die alte AGENTS.md, damit man sie ohne Git nachlesen kann | – |
| `docs/entwurf/` | Entwürfe wie dieser, je Phase einer | – |

Die **Produktchronik in der App** (Update-Verlauf, den Kinder und Eltern sehen) bleibt in Schritt 0 unverändert. In Phase 1 entscheiden wir, wie sie weitergeht.

### 0.5 Arbeitsablauf (steht danach in CLAUDE.md)

Jede Phase und jeder größere Schritt läuft so:

1. **Entwurf** in `docs/entwurf/`, mit Freigabe durch den Nutzer
2. **Plan** in kleinen Schritten
3. **Bauen** auf dem Branch `claude/...`
4. **Prüfen**: Prüfkette grün, dazu passende Helfer (siehe 0.6)
5. **Zeigen**: Vercel-Vorschau-Link und Screenshots an den Nutzer, in einfachen Worten
6. **Freigabe:** Claude öffnet den PR nach `test-live` und schickt Vorschau-Link und PR-Link. Gemergt wird regulär nach grüner CI und erst nach einem „ok“ des Nutzers im Chat.
7. STATUS, BACKLOG und CHANGELOG nachführen
8. **Für Freunde veröffentlichen** (nur am Ende einer Phase): Claude fragt den Nutzer. Nach seinem OK geht ein PR von `test-live` nach `main`, erst dann ändert sich die Hauptadresse. Vorher wird die Phase einmal komplett geprüft, mit `test:full` in Chromium, Firefox und WebKit. Beim ersten Mal kommen die 10 alten Probe-Commits auf `main` regulär mit herein. Sie enthalten nur Vercel- und Rechte-Proben, Release-Tests und 7 Zeilen in `vercel.json`, keine App-Inhalte. Wie genau, wird vor dem ersten Mal geplant, ohne Force-Push.

Kleine Korrekturen (Tippfehler, eindeutige Fehler) brauchen keinen eigenen Entwurf, laufen aber durch Prüfen, Zeigen und Freigabe.

**Berichte an den Nutzer** folgen immer derselben Form, mit kurzen Sätzen und ohne Fachjargon:

- Was ist fertig?
- Was kannst du dir ansehen (Link, Bild)?
- Was musst du entscheiden?
- Was kommt als Nächstes?

### 0.6 Helfer (`.claude/agents/`)

Jeder Helfer ist eine kurze Datei mit Aufgabe, Prüfliste und Antwortformat. Die Helfer melden nur Befunde und ändern nichts. Claude entscheidet und setzt um. Modell und Denkstufe stehen im Frontmatter (`model`, `effort`). Das ist laut offizieller Claude-Code-Doku so vorgesehen.

| Helfer | Aufgabe | Modell / Stufe | Warum |
|---|---|---|---|
| `kinder-redaktion` | Texte für 5- bis 10-Jährige prüfen und Vorschläge machen: Satzlänge, Fachwörter, Ton, Länge, „Mehr für Große“ | `opus` / `high` | Gute Kindersprache braucht Fingerspitzengefühl |
| `fakten-pruefer` | Aussagen gegen Quellen prüfen (Web), Zahlen, Einheiten und Aktualität | `opus` / `high` | Fehler hier wären am schlimmsten |
| `design-pruefer` | Screenshots in 320, 390, 768 und 1280 px prüfen: Lesbarkeit, Kontrast, Tippflächen, abgeschnittene Inhalte, Bildwirkung | `sonnet` / `high` | Klare Prüfliste, braucht Bildverständnis |
| `code-pruefer` | Änderungen auf Fehler prüfen, besonders Pass-Kompatibilität, IDs und Links | `opus` / `high` | Schützt Kinderfortschritt |
| `bild-recherche` | Freie Fotos suchen (Wikimedia Commons u. a.), Lizenz und Namensnennung prüfen, Nachweis vorbereiten | `sonnet` / `medium` | Klare Regeln, viel Suche |
| `ideen-scout` | Vergleichbare Lernangebote ansehen, Ideen sammeln und als Vorschläge ins BACKLOG schreiben | `sonnet` / `medium` | Sammeln statt entscheiden |

- **Fable 5.2** (stärkstes Modell) ist kein Standard. Es wird gezielt für große Abschlussprüfungen am Ende einer Phase eingesetzt (Alias `fable`).
- **Haiku 5.5** dient für einfache Massenprüfungen nach Bedarf, zum Beispiel 204 Karten auf kaputte Verweise durchsehen.
- Alles läuft über das vorhandene Claude-Abo, ohne zusätzliche Kosten.

### 0.7 Kurzbefehle (`.claude/skills/`)

| Befehl | Was passiert |
|---|---|
| `/weiter` | Wiedereinstieg in einer neuen Sitzung:<br>• `CLAUDE.md` und `STATUS.md` lesen, Git-Stand prüfen<br>• **Modell-Check**: Gibt es neuere Claude-Modelle als in `CLAUDE.md` notiert? Wenn ja, dem Nutzer einen Wechsel vorschlagen<br>• dann den nächsten Schritt in einfachen Worten nennen |
| `/pruefen` | Vor einer Übergabe:<br>• komplette Prüfkette laufen lassen<br>• passende Helfer je nach Änderung (Text, Design, Code, Bilder) beauftragen<br>• Ergebnisse gesammelt und ehrlich berichten |

**Modell-Stand in CLAUDE.md** (zum Vergleichen):

- 21.11.2026: Fable 5.2, Opus 5.5, Sonnet 5.5, Haiku 5.5

### 0.8 Was der Nutzer in Schritt 0 sieht

- Die Kinderseite ändert sich nicht.
- Der Nutzer bekommt:
  - eine kurze Zusammenfassung, was entfernt wurde und wie viel kleiner das Repository ist
  - den Vergleich vorher/nachher (gleiche Seite, Screenshots)
  - die neuen Unterlagen zum Querlesen
  - den PR-Link

### 0.9 Fertig, wenn

- [ ] Beide Archiv-Tags existieren auf GitHub (`archiv/vor-neuausrichtung-2026-11-21`, `archiv/pr95-geschichte-2026-11-21`)
- [ ] BACKLOG-Eintrag für die acht Geschichtsthemen aus PR #95 vorhanden
- [ ] Ballast entfernt, nichts davon wird von App oder Build gebraucht
- [ ] Neue Prüfkette lokal und in der CI grün, Job-Name unverändert
- [ ] `dist/`-Vergleich zeigt keine Änderung außer der Build-Kennung, Screenshots gleich
- [ ] Neue Unterlagen, Helfer und Kurzbefehle vorhanden, Helfer einmal testweise aufgerufen
- [ ] Vercel-Vorschau für den Branch funktioniert
- [ ] Nutzer hat den PR gesehen und freigegeben, Merge nach `test-live`

### Was dem Bauenden überlassen bleibt

- Genaue Einteilung jeder einzelnen Testdatei in „bleibt“ oder „fliegt“ nach den Regeln in 0.3
- Genaue Formulierung von CLAUDE.md, Helfern und Kurzbefehlen
- Ob das Größenbudget-Skript bleibt oder vereinfacht wird
- Reihenfolge der Aufräum-Commits (kleine, nachvollziehbare Commits je Bereich)
- Ob Playwright aus `qa/` ins Hauptpaket wandert, damit `qa/` entfallen kann
- Welche Dateien unter `exports/content` außer `verify` noch gelesen werden (wird vor dem Löschen geprüft)

### Entscheidungen nach der Gegenlese (21.11.2026)

Ein Prüf-Helfer hat den Entwurf gelesen, als müsste er ihn bauen. Seine offenen Fragen sind so geklärt:

**Vom Nutzer entschieden:**

1. PRs nach `test-live` darf Claude öffnen. Gemergt wird nach „ok“ im Chat (siehe Feste Regeln, 0.5).
2. PR #95 wird gesichert und später kindgerecht übernommen (siehe 0.1).
3. Freunde bekommen die Hauptadresse. Sie wird nur nach einer fertigen Phase und nach OK erneuert (siehe Feste Regeln, 0.5 Punkt 8).

**Von Claude entschieden** (der Nutzer kann widersprechen):

- Umgang mit den 130 Browser-Tests (siehe 0.3)
- Build-Kennung beim `dist/`-Vergleich durch einen Platzhalter ersetzen. Das einmalige „Neue Version laden“ wird in Kauf genommen (siehe 0.3).
- Alte Branches auf GitHub und PR #27 bleiben in Schritt 0 unberührt. Aufräumen lohnt sich später und braucht dann eine eigene Rückfrage.
- Die 10 alten Commits auf `main` werden erst beim ersten Veröffentlichen behandelt, nicht in Schritt 0.

### Wünsche des Nutzers nach der Freigabe (21.11.2026)

**Gestaltung.** Claude darf das Design frei anpassen. Es soll sehr modern sein und Spaß machen, zum Beispiel mit einem glänzenden „Glossy Look“: Ein Lichtschimmer läuft über eine Kachel, wenn man darauf zeigt. Umsetzung in Phase 1 (Claudes Entscheidungen):
- Auf Handy und Tablet gibt es kein „Darüberfahren“. Dort erscheint der Effekt beim Antippen.
- Mit der Einstellung „Bewegung reduzieren“ bleibt er ruhig.
- Kompass, helle Flächen und die Akzente Orange und Petrol bleiben. Der Effekt unterstützt die Inhalte und überdeckt sie nicht.

**Bilder.**
- Zuerst echte Fotos und Originalabbildungen mit geklärter Lizenz, etwa von Menschen, Gegenständen und Orten.
- KI-Bilder nur, wenn es kein passendes freies Original gibt. Sie müssen kostenlos sein und werden sichtbar gekennzeichnet.
- Claudes Ergänzung: Echte Menschen werden nie als KI-Bild gezeigt, das wie ein Foto wirkt. Rekonstruktionen, etwa von Dinosauriern, werden als solche benannt.

**Themenideen.** Medizin und Körper (zum Beispiel Knochen), Wirtschaft, Geld und Zinsen, Religionen der Welt, aktuelle Technik wie das Elektroauto, mehr Erdkunde und Geschichte.
- Sie kommen ins BACKLOG. `ideen-scout`, `kinder-redaktion` und `fakten-pruefer` sehen sie durch, bevor sie eingeplant werden.
- Claudes Hinweise:
  - Aktuelle Themen werden zeitlos erklärt, zum Beispiel „Wie fährt ein Elektroauto?“. Nachrichten gibt es nicht, der News-Bereich bleibt entfernt.
  - Religionen werden neutral und respektvoll vorgestellt.
  - Medizin erklärt den Körper, gibt aber keine Gesundheitsratschläge.
  - Geld und Zinsen passen gut als Mitmach-Modell im Forscherlabor.
  - Geschichte (31 Themen) und Erdkunde (Globus, Länder) gibt es schon. Sie werden ausgebaut.
