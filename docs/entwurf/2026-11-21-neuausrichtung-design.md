# WunderKompass – Neuausrichtung (Weg C) und Schritt 0 „Großputz & Arbeitsweise“

Stand: 21.11.2026 · Status: **Entwurf, wartet auf Freigabe**

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
- **Git.** `main` wird nie direkt geändert. Kein Force-Push auf `test-live` oder `main`. Gemergt wird nur über einen PR, nach grüner Prüfung und nach Freigabe des Nutzers.
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

### 0.1 Sicherung vor dem Aufräumen

- Ein Git-Tag `archiv/vor-neuausrichtung-2026-11-21` auf `b53f75f` wird angelegt und gepusht. Damit bleibt der komplette alte Stand mit allen Berichten und Tests jederzeit abrufbar, ohne dass er im Arbeitsbaum liegt.
- Der Tag gilt als Sicherungsbasis. Er wird nicht gelöscht.

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

CI (`quality.yml`):

- Der Job-Name **„Required quality checks“ bleibt exakt gleich**, weil die GitHub-Regel für `test-live` ihn verlangt.
- Nur Chromium, Ziel unter 10 Minuten.
- Firefox und WebKit prüfen wir gezielt vor großen Übergaben (Ende einer Phase), nicht bei jedem Schritt.

**Nachweis, dass sich für Kinder nichts ändert:**

- Die App-Dateien in `dist/` (JS, CSS, HTML, `public/`-Kopien) werden vor und nach dem Aufräumen gebaut und verglichen. Erlaubte Unterschiede gibt es nur bei der Build-Kennung.
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
6. **Freigabe** durch den Nutzer, dann PR nach `test-live` und regulärer Merge nach grüner CI
7. STATUS, BACKLOG und CHANGELOG nachführen

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

- [ ] Archiv-Tag existiert auf GitHub
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
