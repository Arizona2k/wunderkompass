# Phase 1, Teilschritt 2 „Wissenskarte“ – Bauplan

> **Für ausführende Agenten:** Pflicht-Skill: superpowers:executing-plans (Claude baut selbst in dieser Sitzung) oder superpowers:subagent-driven-development. Schritte haben Kästchen (`- [ ]`) zum Abhaken.

**Ziel:** Die Wissenskarte wird neu gebaut: zuerst raten, dann kurz lesen, dann weiter entdecken („Dazu passt“). Jede Karte bekommt mindestens eine erklärte Verbindung. Die Texte werden aufgeräumt. Zwölf Pilot-Karten bekommen kurze Häppchen, „Stimmt das?“ und zwei bis drei neue Fragen.

**Aufbau:**
- Die neue Karte entsteht in `app/kern/karte/`: kleine Dateien, reine Logik getrennt von der Anzeige (`karten-daten.ts`, ohne React, im Node-Test prüfbar).
- Die Gestaltung liegt in `app/kern/karte/karte.css` und wird von der Karte selbst geladen, nicht in `globals.css`. Damit wächst das Einstiegs-CSS nicht.
- Die Mitmach-Bausteine laden erst, wenn „Ausprobieren“ aufgeht.
- `app/world-topic.tsx` wird am Ende gelöscht.
- `world-reader.tsx` (Karte und Routen-Stationen) und `world-view.tsx` (Rückweg) binden die neue Karte ein.

**Technik:** React 19, Vite 8, Tailwind 4, lucide-react 1.31.0, Node-Testrunner, eigener Playwright-Runner (`tests/browser/run.mjs`). Keine neuen Pakete.

**Entwurf:**
- [2026-11-21-phase-1-entwurf.md](2026-11-21-phase-1-entwurf.md): 6.3, 6.8, 6.9, 6.10 (nur die Bildsuche), 6.11 (Block auf der Karte), 9 und 10.
- [2026-11-21-phase-1-ergaenzung-spannung.md](2026-11-21-phase-1-ergaenzung-spannung.md): A1 bis A5, B7 Stufe 2, Abschnitte 5 und 6.

## Lieferung in zwei Teilen (Claudes Entscheidung, dem Nutzer mitgeteilt)

| Teil | Aufgaben | Inhalt | PR |
|---|---|---|---|
| A „Neue Karte“ | 1–8 | Prüfungen früher, neue Karte mit heutigen Texten, Reisen einfach zuerst | eigener PR nach `test-live` |
| B „Kürzer und verbunden“ | 9–13 | Verbindungen für alle Karten, Aufräumen, Pilot-Karten, Bildsuche | eigener PR nach `test-live` |

Gründe:
- Teil A ändert viel Code und viele Tests, Teil B vor allem Inhalte mit langen Prüfungen durch Helfer.
- Kleinere PRs heißen: Der Nutzer sieht früher etwas, und ein Fehler kostet weniger.
- Die Bildsuche (Aufgabe 12) läuft schon ab Schritt 0 nebenher, weil sie nur recherchiert.

Zwischen Teil A und Teil B zeigen 35 Karten in „Dazu passt“ noch keine Nachbarkarte. Ersatz aus `related` gibt es nicht (Entwurf 6.3). Teil B schließt die Lücke, und ein Test hält sie danach zu.

## Feste Vorgaben (gelten für jede Aufgabe)

- **Pass bleibt unberührt:**
  - Schema 3, App-ID `earth-explorer`, Schlüssel `erde-entdecken:save:v3`, Altpass `erde-entdecken:forscherpass:v2`, IndexedDB `earth-explorer`.
  - Neue Einträge nutzen nur vorhandene Speicherorte: `review` (neue Fragen) und `gameSessions['topic:<id>']` (Antworten, „Stimmt das?“).
  - Es gibt keine neue Schema-Version.
- **IDs:**
  - Karten-IDs und `world-question:<kartenId>` bleiben.
  - Neue Fragen heißen `<kartenId>:rate-<n>`, Behauptungen `<kartenId>:stimmt-<n>`.
  - Keine neue ID darf einer Challenge-ID gleichen (`<kartenId>-<n>` oder `<kartenId>:<wort>`).
  - Nichts wird umbenannt oder wiederverwendet.
- **Hash-Links bleiben:** `#world/topic/<id>`, Routen, `#journeys/...`. Alte `#news/...` führen nach `#home`.
- **Bestehende Schlüssel im Spielspeicher der Karte bleiben:** `items`, `topicAnswer`, `sensitiveAccepted` und die Schlüssel der Bausteine.
- **Verhalten bei „Rate mal!“** wie heute:
  - Falsch zeigt „Überlege noch einmal.“ und den Hinweis, aber keine Erklärung.
  - Richtig zeigt das Häkchen und die Erklärung (`why`) und löst `onLearn(id)` aus.
  - `onReview` kommt nur, wenn vorher keine Antwort gespeichert war.
  - Frühere Antwortwörter laufen über `restoreAnswerWording`.
  - „Später noch einmal prüfen“ bleibt.
- **Sammeln ohne Zahlen:** keine Zähler, kein „x von y“, kein Jubel, kein Konfetti. Das vorhandene Geräusch gibt es nur bei eingeschaltetem Ton.
- **Längen-Budget (A1)**, gilt für Pilot-Karten:

  | Baustein | Budget |
  |---|---|
  | Einstieg | 1 Satz |
  | Frage | höchstens 10 Wörter, 3 Antworten, mindestens 1 echter Kinderirrtum |
  | Erklärung | höchstens 2 Sätze |
  | Häppchen | höchstens 3, je höchstens 2 Sätze |
  | Steckbrief | höchstens 5 Zeilen |
  | „Schon gewusst?“ | 1 Satz |
  | Offener Teil gesamt | Ziel 120 Wörter, harte Grenze 140 |

- **Kein Wissen geht verloren:**
  - Bei Pilot-Karten bleiben die `paragraphs` unverändert und stehen unter „Für Große“.
  - Erwachsenensätze ziehen nach „Für Erwachsene“.
  - Gestrichen wird nur Doppeltes.
- **Inhalte:**
  - Neue Sätze stützen sich auf die Quellen der Karte. Eine neue Aussage braucht eine neue Quelle in `sources`.
  - Jede neue Frage, Behauptung, Auflösung und jeden Verbindungssatz prüfen `fakten-pruefer` und `kinder-redaktion`.
- **Aussehen:** Tippflächen mindestens 48 × 48 px mit 8 px Abstand, Fließtext 18 px, Kontrast AA. Bei „Bewegung reduzieren“ gibt es keine Animation.
- **Budgets:**
  - Einstiegs-CSS und Einstiegs-JS wachsen nicht (Ausgangswert aus Schritt 0).
  - Die Karte lädt im ersten Schritt nicht mehr JavaScript als die alte (`topicJsBytes`, Aufgabe 1).
- **Tests:**
  - Keine Prüfung abschwächen oder überspringen.
  - Wer eine Zusicherung entfernt, nennt den Grund in der Commit-Nachricht.
  - Was ein alter Test geschützt hat, prüft ein Ersatztest an der neuen Karte.
- **Commits:** `git -c user.name=Claude -c user.email=noreply@anthropic.com commit …`, deutsche Betreffzeile, Abschlusszeilen laut Sitzung. Vor jedem Push `git diff --check` und Autor/Committer prüfen.
- **Container:** Befehle erst nach `export PATH=/opt/node24/bin:$PATH`.
- **Modelle:** `fable` ist bis 23.11.2026 02:00 UTC erschöpft (STATUS.md). Bis dahin läuft die Schlussprüfung der Teile auf `opus`.

## Worauf Prüfer besonders achten

Fünf Fälle, die der Entwurf nicht ausdrücklich nennt, die Kinder aber treffen würden. Jeder hat einen Test in der zuständigen Aufgabe:

1. **Alte Antwort nach neuer Formulierung.** Ein Kind hat eine Frage beantwortet, danach wurde sie umformuliert. Seine Antwort zählt weiter, und `learned:<id>` bleibt. → Aufgabe 10, Test `alteAntwortNachUmformulierung`.
2. **Ausprobieren offline.** Nach einem Kaltstart ohne Netz öffnet „Ausprobieren“ seinen Baustein. → Aufgabe 5, Zusatz in `tests/browser/offline-cold.mjs`.
3. **Routen-Stationen.** In einer Route schaltet eine richtige Antwort auf der eingebetteten Karte die nächste Station frei. → Aufgabe 6, Test `eingebetteteKarte`.
4. **Zurück nach „Dazu passt“.** „Zurück“ im Browser führt zur Ausgangskarte, die Kachel hat den Fokus und steht im Bild. Das gilt auch in Safari, das Knöpfe beim Tippen nicht fokussiert. → Aufgabe 5, Test `dazuPasstZurueck`.
5. **Neue Fragen im Pass.** Die Antwort auf eine neue Frage übersteht Neuladen, Export und Import, und das Forscherbuch öffnet ohne Fehler. → Aufgabe 11, Test `zusatzfrageImPass`.

Zwei weitere Fälle haben eigene Tests: heikle Geschichtskarten (Aufgabe 4, `heikleKarteFragtVorher`) und die Motivkachel bei 320 px mit langem Titel (Aufgabe 5, `motivkachel320`).

---

## Schritt 0: Ausgangslage

- [x] Der PR von Teilschritt 1 ist gemergt (PR #99, `6f43eb5`). Der Branch `claude/sweet-ramanujan-gl9yhc` ist neu von `test-live` aufgesetzt, dieser Plan liegt in `docs/entwurf/` und ist vom Nutzer freigegeben (21.11.2026). Ein neuer Chat arbeitet auf seinem eigenen `claude/...`-Branch vom Stand `test-live`.
- [ ] `pnpm install --frozen-lockfile && pnpm run build`. Einstiegs-JS, Einstiegs-JS gzip, Einstiegs-CSS und Einstiegs-CSS gzip im Notizblock festhalten. Das sind die Obergrenzen.
- [ ] Bildsuche starten (Aufgabe 12, läuft im Hintergrund).

---

## Teil A „Neue Karte“

### Aufgabe 1: Prüfungen früher

Fehler, die bisher erst in der großen Prüfung auffielen, sollen schon in `pnpm run check` auffallen. Dazu kommt ein Helfer, der das Arbeitssystem selbst prüft.

**Dateien:**
- Neu: `.claude/agents/technik-pruefer.md`
- Ändern:
  - `tests/browser/suites.mjs:65` (`performance`: `set: 'ci'`)
  - `tests/browser/foundation.mjs:8` (Route `topic`) und die Budget-Zusicherung
  - `performance-budgets.json` (`browser.topicJsBytes`)
  - `tests/browser-suites.test.mjs`
  - `scripts/browser-errors.mjs` (`monitorBrowserErrors`: ResizeObserver-Schleifen in allen Engines melden)
  - `CLAUDE.md` (Befehle und Helfer), `.claude/skills/pruefen/SKILL.md` (Helferliste)
  - `BACKLOG.md` (Punkte „Tempo-Prüfung in `pnpm run check`“ und „ResizeObserver-Schleifen auch in Chromium melden“ streichen)

**Schnittstellen:**
- Liefert die Konstante `PASS_OFFLINE` (die heutigen 13 CI-Suiten) und `CI = [...PASS_OFFLINE, 'performance']` in `tests/browser-suites.test.mjs`. Aufgabe 4 und 7 hängen dort ihre Suiten an.
- Liefert das Budget `browser.topicJsBytes`.

- [ ] **Schritt 1: Test anpassen (soll scheitern).**
  - In `tests/browser-suites.test.mjs` `PASS_OFFLINE` und `CI` wie oben anlegen.
  - Der Test „Pass- und Offline-Suiten laufen in jeder Engine“ läuft über `['smoke', ...PASS_OFFLINE]`.
  - Die Liste `FULL` verliert `'performance'`.
  - Neuer Test `CI-Satz enthält die Tempo-Prüfung`: Die Namen mit `set === 'ci'` sind genau `CI`.
- [ ] **Schritt 2:** `node --test tests/browser-suites.test.mjs`. Erwartet: FAIL (`performance` steht noch in `full`).
- [ ] **Schritt 3:** In `suites.mjs` `performance` auf `set: 'ci'` stellen (`solo` und `chromiumOnly` bleiben). Erwartet: PASS.
- [ ] **Schritt 4: Karten-Route in der Tempo-Prüfung.**
  - In `foundation.mjs` die Route `['topic', 'world/topic/animal-african-savanna-elephant', '#world-topic-title']` ergänzen.
  - Das JS-Budget je Route nachschlagen: `home` → `homeJsBytes`, `topic` → `topicJsBytes`, sonst `areaJsBytes`.
  - Die Meldung nennt den Messwert (`name + ' initial JS budget: ' + metrics.jsBytes`), wie schon beim Layout-Rutschen.
- [ ] **Schritt 5: Messen.**
  - `topicJsBytes` vorübergehend auf `1` setzen.
  - `pnpm run build && QA_DIST=dist node tests/browser/run.mjs --suite ci performance` ausführen. Erwartet: FAIL mit „topic initial JS budget: <Bytes>“.
  - Den Wert der alten Karte, auf volle 1.000 aufgerundet, als `topicJsBytes` eintragen. Erneut laufen lassen. Erwartet: PASS.
  - Falls ein Unit-Test die Schlüssel von `performance-budgets.json` prüft, dort `topicJsBytes` ergänzen.
- [ ] **Schritt 5b: ResizeObserver-Schleifen überall melden** (BACKLOG, Technik; in Teilschritt 1 fiel so eine Schleife erst in der WebKit-Vollprüfung auf).
  - Chromium und Firefox melden „ResizeObserver loop …“ nur als `error`-Ereignis im Fenster, das Playwright nicht sieht. WebKit meldet sie als Seitenfehler.
  - Gegenprobe mit der Suite, die in WebKit wirklich scheiterte. Nicht `kern-huelle`: Deren Fall `buchLeisteBleibtRuhig` fängt die Schleife schon selbst.
  - Lücke zeigen: `app/learning-strip.ts` vorübergehend ohne den Wächter `if(!list.clientWidth)return;` nach `<workspace>/dist-ohne-waechter` bauen (`pnpm exec vite build --outDir … --emptyOutDir`), den Wächter sofort zurücksetzen. Dann `QA_DIST=<workspace>/dist-ohne-waechter node tests/browser/run.mjs --suite full offline-resilience` in Chromium. Erwartet: PASS, obwohl die Schleife auftritt. In WebKit scheiterte dieselbe Suite mit 155 Meldungen.
  - RED: `monitorBrowserErrors` bekommt ein Init-Skript (`page.addInitScript`), das das `error`-Ereignis „ResizeObserver loop“ als `console.error` weitergibt. Diese Meldung sammelt die Überwachung schon heute als `consoleErrors`. Gleicher Lauf. Erwartet: FAIL mit „ResizeObserver loop“.
  - GREEN: gleicher Lauf mit einem Build vom aktuellen Stand (mit Wächter). Erwartet: PASS.
  - Dann `pnpm run check`. Meldet eine andere Suite eine Schleife, zuerst die Ursache klären (systematic-debugging). Die Meldung nie unterdrücken.
- [ ] **Schritt 6: Helfer `technik-pruefer`.** Kopf wie `code-pruefer.md`: `tools: Read, Grep, Glob, Bash`, `model: sonnet`, `effort: high`. Der Inhalt:
  - **Rolle:** Er meldet nur und ändert nichts. Er startet keine Builds, Browsertests, Installationen oder Pushes.
  - **Prüfliste:**
    1. Prüfungen, die erst spät laufen, aber früh laufen könnten.
    2. Dauer der CI gegen ihre Zeitgrenzen (`.github/workflows/quality.yml`).
    3. `CLAUDE.md` und `STATUS.md` gegen den echten Stand: Befehle, Pfade, Suiten, Adressen.
    4. Veraltete oder unsichere Pakete (`pnpm outdated`, `pnpm audit --prod`, nur wenn Netz da ist).
    5. Modellnamen der Helfer gegen den Modell-Stand in `CLAUDE.md`.
    6. Passen Vercel-Einstellungen, Branch-Regeln und Workflow-Namen zusammen?
  - **Ausgabe:** je Befund Fundstelle (Datei:Zeile), Beleg, Vorschlag und Dringlichkeit.
  - **Einsatz:** einmal je Phasenende und immer, wenn ein Fehler erst spät aufgefallen ist.
- [ ] **Schritt 7: Unterlagen.**
  - `CLAUDE.md`, Befehle: `test:browser` = „CI-Satz: Pass, Sicherung, Offline, alte Links, Tempo (zwei Suiten parallel)“.
  - `CLAUDE.md`, Helfer-Tabelle: neue Zeile `technik-pruefer` | Arbeitssystem: späte Prüfungen, CI-Dauer, Unterlagen gegen Wirklichkeit, Pakete, Modellnamen, Vercel/GitHub | sonnet / high.
  - `pruefen/SKILL.md`: „am Phasenende → `technik-pruefer`“.
  - `BACKLOG.md`: beide Punkte streichen.
- [ ] **Schritt 8:** `pnpm run check`. Erwartet: grün. Die Dauer von `test:browser` kommt ins Ledger. Liegt sie über 15 Minuten (CI-Grenze 20), schreibe ich eine Entscheidung ins Ledger, bevor es weitergeht.
- [ ] **Schritt 9:** Commit „Tempo-Prüfung und ResizeObserver-Meldungen in die Prüfkette, Helfer technik-pruefer“.

### Aufgabe 2: Datengrundlage der Karte (reine Logik)

**Dateien:**
- Neu: `app/kern/karte/karten-daten.ts`, `tests/wissenskarte.test.mjs`, `tests/karten-inhalt.test.mjs`
- Ändern: `app/world-types.ts` (neue optionale Felder in `WorldTopic`)

**Schnittstellen (liefert):**
```ts
// world-types.ts, alles optional
export type KartenKapitel = {question: string; text: string};
export type KartenBehauptung = {id: string; text: string; isTrue: boolean; explanation: string};
export type KartenZusatzfrage = WorldQuestion & {id: string; hint: string};
// WorldTopic: chapters?: KartenKapitel[]; claims?: KartenBehauptung[]; moreQuestions?: KartenZusatzfrage[];

// karten-daten.ts
export type KartenFrage = {id: string; reviewId: string; answerKey: string; itemsKey: string;
  question: WorldQuestion; hints: string[]; wrongReasons?: string[]};
export function kartenFragen(topic: WorldTopic, hintBank: Record<string, {steps: string[]}>): KartenFrage[];
export function ersteFrage(fragen: KartenFrage[], review: LocalProgress['review']): KartenFrage;
export type DazuPasstKachel =
  | {art: 'karte'; topicId: string; why: string}
  | {art: 'globus'}
  | {art: 'link'; label: string; mode: Mode; id?: string; iso?: string}
  | {art: 'spiel'};
export function dazuPasst(topic: WorldTopic, verbindungen: readonly {topic: string; why: string}[]): DazuPasstKachel[];
export function weitereVerbindungen<T extends {topic: string}>(topic: WorldTopic, verbindungen: readonly T[]): T[];
export function hatBaustein(topic: WorldTopic): boolean;
export function kartenFeldFehler(topic: WorldTopic): string[];
```
`verbindungen` ist das Ergebnis von `connectionsFor(topic.id)` aus `knowledge-connections.ts`, umgeformt auf `{topic, why}`, wie die Karte es heute nutzt.

Regeln:
- **`kartenFragen`:**
  - Die Hauptfrage hat `id = topic.id`, `reviewId = 'world-question:' + id` und die alten Schlüssel `topicAnswer` und `items`.
  - Ihre Hinweise entstehen wie heute: `questionFeedback.hint` plus `hintBank[id + ':mini'].steps.slice(1)`, sonst nur die Bank. `wrongReasons` kommt aus `questionFeedback`.
  - Zusatzfragen folgen in Datenreihenfolge, mit `reviewId = 'world-question:' + q.id`, `answerKey = 'topicAnswer:' + q.id`, `itemsKey = 'items:' + q.id` und `hints = [q.hint]`.
- **`ersteFrage`:** die erste Frage ohne Eintrag in `review`. Sind alle gesehen, die mit dem kleinsten `due`. Bei Gleichstand die frühere.
- **`dazuPasst`:** höchstens 3 Kacheln in dieser Reihenfolge:
  1. erste Verbindung,
  2. Globus, wenn `locations` nicht leer ist,
  3. `links[0]`, sonst das Spiel der Welt.
  - `related` wird nie benutzt.
- **`weitereVerbindungen`:** alle Verbindungen außer der ersten.
- **`hatBaustein`:** dieselben Bedingungen, unter denen `world-topic.tsx` heute einen Mitmach-Baustein zeigt (dort ablesen und genau übernehmen).
- **`kartenFeldFehler`:** prüft die neuen Felder:
  - `chapters`: 1 bis 3 Einträge, nichts leer.
  - `claims`: `id` passt zu `^<kartenId>:stimmt-\d+$`, `isTrue` ist ein Wahrheitswert, nichts leer.
  - `moreQuestions`: `id` passt zu `^<kartenId>:rate-\d+$`, 3 Antworten, `correct` im Bereich, `why` und `hint` nicht leer.

- [ ] **Schritt 1: Tests schreiben** in `tests/wissenskarte.test.mjs`. Kartenbeispiele kommen aus dem echten Katalog, Zusatzfelder aus kleinen ausgedachten Karten im Test.
  - `kartenFragen ohne Zusatzfragen liefert nur die Hauptfrage mit alten Schlüsseln`: Länge 1, `reviewId === 'world-question:animal-african-savanna-elephant'`, `answerKey === 'topicAnswer'`, `itemsKey === 'items'`.
  - `Zusatzfragen bekommen eigene Review-ID und eigene Schlüssel`: `'world-question:x:rate-1'`, `'topicAnswer:x:rate-1'`, `'items:x:rate-1'`.
  - `ersteFrage ohne Pass-Einträge nimmt die Hauptfrage`
  - `ersteFrage nimmt die erste ungesehene Frage`: Die Hauptfrage ist gesehen, also kommt `rate-1`.
  - `ersteFrage nimmt bei lauter gesehenen die am frühesten fällige`
  - `dazuPasst zeigt höchstens drei Kacheln in fester Reihenfolge`: Elefant ergibt `['karte', 'globus', 'link']`. Die Karten-Kachel trägt den Satz aus `world-connections.json`.
  - `dazuPasst zeigt nie related`: eine Karte mit `related`, aber ohne Verbindung, hat keine Kachel `karte`.
  - `dazuPasst nimmt das Weltspiel, wenn links fehlt`
  - `weitereVerbindungen lässt die erste weg`
  - `hatBaustein erkennt Tier, Erfindung, Bauwerk und Karten ohne Baustein`
- [ ] **Schritt 2:** Tests in `tests/karten-inhalt.test.mjs` schreiben.
  - `kartenFeldFehler meldet kaputte neue Felder`: falsche ID, 2 Antworten, leerer Hinweis, 4 Häppchen.
  - `alle Karten haben wohlgeformte neue Felder`: `kartenFeldFehler` ist für jede Katalogkarte leer.
  - `neue IDs sind eindeutig und gleichen keiner Challenge-ID`: Alle Karten-IDs, `challenges[].id`, `moreQuestions[].id` und `claims[].id` zusammen haben keine Dopplung.
- [ ] **Schritt 3:** `node --test tests/wissenskarte.test.mjs tests/karten-inhalt.test.mjs`. Erwartet: FAIL (Modul fehlt).
- [ ] **Schritt 4:** Typen und `karten-daten.ts` schreiben (ohne React-Import, damit Node es laden kann).
- [ ] **Schritt 5:** Dieselben Tests, dann `pnpm test && pnpm run typecheck`. Erwartet: PASS.
- [ ] **Schritt 6:** Commit „Datengrundlage der neuen Wissenskarte“.

### Aufgabe 3: Bild-Bausteine

**Dateien:**
- Neu: `app/kern/karte/kartenbild.tsx`, `app/kern/karte/bildnachweise.tsx`, `app/kern/karte/karte.css`
- Ändern: `app/kern/karte/karten-daten.ts` (`bildArt`, `bildnachweisListe`), `tests/wissenskarte.test.mjs`

**Schnittstellen (liefert):**
```ts
export type BildArt = {art: 'foto'; photoId: string; kennwort?: string} | {art: 'zeichnung'; kennwort: 'Zeichnung'} | {art: 'motiv'};
export function bildArt(topic: Pick<WorldTopic,'id'|'image'>, hatZeichnung: boolean): BildArt;
export function bildnachweisListe(photoIds: readonly string[]): {photoId: string; author: string; license: string; licenseUrl: string; sourceUrl: string; changes?: string}[];
// kartenbild.tsx
export default function Kartenbild(props: {topic: WorldEntry; groesse: 'gross' | 'kachel'; nachweis?: boolean}): JSX.Element;
// bildnachweise.tsx
export default function BildnachweiseAufDieserSeite(props: {photoIds: readonly string[]}): JSX.Element | null;
```

Regeln:
- **Reihenfolge (Bildregel 6.3):**
  1. Foto aus `world-photos.json`. `kennwort` ist das `label` des Fotos, wenn es „KI-Bild“, „Rekonstruktion“, „Spätere Darstellung“ oder „Historischer Druck“ heißt.
  2. Sonst die Zeichnung (`hasTopicIllustration` aus `app/topic-illustration.tsx`) mit dem Kennwort „Zeichnung“.
  3. Sonst die Motivkachel.
- **Motivkachel:** Weltfarbe, großes Weltsymbol (`world-icons.tsx`), Titel. Sie muss gewollt aussehen, nie grau. Den Schimmer baut Teilschritt 4.
- **Kennwort:** auch auf kleinen Kacheln sichtbar.
- **Nachweis:** `groesse: 'gross'` mit `nachweis` zeigt die Nachweiszeile direkt unter dem Foto, wie heute in `world-media.tsx`. Kacheln zeigen keine Nachweiszeile.
- **`BildnachweiseAufDieserSeite`:** ein `<details>` „Bildnachweise auf dieser Seite“ mit Urheber, Lizenz (Link), Quelle (Link) und Bearbeitung je Foto. Ohne Fotos zeigt es nichts.

- [ ] **Schritt 1: Tests (sollen scheitern).**
  - `bildArt nimmt zuerst das Foto`: Elefant ergibt `foto`.
  - `bildArt nennt das Kennwort des Fotos`: ein Foto mit `label` „KI-Bild“ aus `world-photos.json`.
  - `bildArt nimmt die Zeichnung vor der Motivkachel`
  - `bildArt nimmt die Motivkachel ohne Foto und Zeichnung`
  - `bildnachweisListe liefert für jedes Foto Urheber, Lizenz, Lizenz-Link und Quelle`: über alle 60 Foto-IDs, kein Feld leer.
- [ ] **Schritt 2:** `node --test tests/wissenskarte.test.mjs`. Erwartet: FAIL.
- [ ] **Schritt 3:** `bildArt`, `bildnachweisListe`, `Kartenbild`, `BildnachweiseAufDieserSeite` und die Regeln in `karte.css` schreiben. `hatZeichnung` übergibt die Komponente aus `hasTopicIllustration`, damit `karten-daten.ts` ohne React bleibt.
- [ ] **Schritt 4:** `pnpm test && pnpm run typecheck && pnpm run lint`. Erwartet: PASS.
- [ ] **Schritt 5:** Commit „Kartenbild, Motivkachel und Bildnachweis-Block“.

### Aufgabe 4: Neue Wissenskarte – Kopf, „Rate mal!“, Kurz erklärt, Steckbrief, Für Erwachsene

**Dateien:**
- Neu: `app/kern/karte/wissenskarte.tsx`, `app/kern/karte/rate-mal.tsx`, `tests/browser/wissenskarte.mjs`
- Ändern:
  - `app/world-reader.tsx` (beide Stellen nutzen `Wissenskarte` statt `WorldArticle`)
  - `tests/browser/suites.mjs` (Suite `wissenskarte`, `set: 'ci'`, alle Engines)
  - `tests/browser-suites.test.mjs` (`PASS_OFFLINE` bekommt `'wissenskarte'`)

**Schnittstellen:**
- Nutzt aus Aufgabe 2 `kartenFragen` und `ersteFrage`, aus Aufgabe 3 `Kartenbild`.
- Liefert:
  ```ts
  export default function Wissenskarte(props: {topic: WorldTopic; actions: WorldActions; onTopic: (id: string) => void; activity?: Activity; embedded?: boolean}): JSX.Element;
  export default function RateMal(props: {topic: WorldTopic; onLearn: () => void; onReview: (reviewId: string, correct: boolean) => void; onRead: (s: string) => void}): JSX.Element;
  ```
  Die Props sind dieselben wie bei `WorldArticle`.
- `Wissenskarte` behält:
  - die Hülle `LearningMotion` + `SavedGame id={'topic:' + id} family="world"` und die Speicherfunktion samt `activity`,
  - das Tor für heikle Karten (`sensitiveAccepted`, Texte wie heute),
  - `#world-topic-title`, mit `h2` statt `h1`, wenn `embedded`.

Aufbau von oben nach unten:
1. **Kopf:** `Kartenbild` groß mit Nachweis, Titel, `intro`, Haken „Gelernt“ (wenn `learned:<id>` im Pass), Knöpfe „Vorlesen“ und „Merken“.
   - „Vorlesen“ liest Titel, Einleitung und die angezeigte Frage mit ihren Antworten.
   - „Merken“ hat `aria-pressed` und schaltet `onFavorite('topic:' + id)`.
2. **`section.world-mini-question`:** „Rate mal!“ mit `.quiz-answer`-Knöpfen.
   - Verhalten wie in den Festen Vorgaben.
   - Der Text für eine frühere Auswahl bleibt sinngleich.
   - `onReview` bekommt die `reviewId` der angezeigten Frage.
3. **Kurz erklärt:**
   - Ohne `chapters` die heutige Darstellung (`paragraphs`, dazu `learning.starter` wie heute).
   - Mit `chapters` baut erst Aufgabe 11.
4. **Steckbrief:** `facts` als kompaktes Raster (`dl`).
5. **Schon gewusst?:** `surprise`. Ohne `surprise` entfällt der Abschnitt.
6. **Für Erwachsene:** `<details>` „Für Erwachsene: Quellen und Lernziele“ mit `sources`, `checkedAt`, `sourceNote` und `learning.benefit`.

Ausprobieren, Mehr erfahren, Dazu passt und der Bildnachweis-Block folgen in Aufgabe 5.

- [ ] **Schritt 1: Browsertests schreiben** in `tests/browser/wissenskarte.mjs`.
  - Der Pass wird gelesen mit `JSON.parse(localStorage.getItem('erde-entdecken:save:v3')).progress`.
  - Die richtige Antwort kommt aus dem Katalog (`question.answers[question.correct]`).
  - Tests:
    - `karteOeffnenSchreibtBesuch`: frischer Kontext, `#world/topic/animal-african-savanna-elephant`. Danach steht `topic:animal-african-savanna-elephant` im Pass. Nach Neuladen steht es dort weiter.
    - `richtigeAntwortSchreibtGelernt`: Richtige Antwort ergibt „Passende Antwort gewählt.“ und den `why`-Text. Danach `learned:<id>` und `review['world-question:<id>'].correct === true`. Nach Neuladen sind die Antwortknöpfe gesperrt, `learned` bleibt.
    - `falscheAntwortOhneErklaerung`: Ergibt „Überlege noch einmal.“, kein `why`-Text, kein `learned:<id>`, auch nach Neuladen. Das ersetzt die Zusicherung in `article-atlas.mjs`.
    - `merkenSchaltetFavoriten`: `aria-pressed="true"` und `topic:<id>` im Pass, auch nach Neuladen. Ein zweiter Tipp nimmt es wieder heraus.
    - `heikleKarteFragtVorher`: `#world/topic/history-holocaust` zeigt das Tor ohne Inhalt. „Die Erklärung anschauen“ zeigt den Inhalt. Nach Neuladen bleibt er offen.
- [ ] **Schritt 2:** Suite eintragen und `pnpm run build && QA_DIST=dist node tests/browser/run.mjs --suite ci wissenskarte`. Erwartet: FAIL (keine „Merken“-Schaltfläche, kein „Rate mal!“).
- [ ] **Schritt 3:** `rate-mal.tsx` und `wissenskarte.tsx` schreiben. `world-reader.tsx` umstellen.
- [ ] **Schritt 4:** `pnpm test && pnpm run typecheck && pnpm run lint && pnpm run build && QA_DIST=dist node tests/browser/run.mjs --suite ci wissenskarte`. Erwartet: PASS.
  - Ältere Suiten, die noch an der alten Karte hängen, dürfen bis Aufgabe 6 scheitern. Das kommt als Entscheidung ins Ledger, mit der Liste der betroffenen Suiten.
- [ ] **Schritt 5:** Commit „Neue Wissenskarte: Kopf, Rate mal, Kurz erklärt, Steckbrief“.

### Aufgabe 5: Ausprobieren, Mehr erfahren, Dazu passt, Bildnachweise

**Dateien:**
- Neu:
  - `app/kern/karte/ausprobieren.tsx` (Hülle mit `lazy`)
  - `app/kern/karte/bausteine.tsx` (Auswahl je Kartentyp; die Baustein-Imports ziehen aus `world-topic.tsx` hierher)
  - `app/kern/karte/tier-groesse.tsx` (`AnimalMeasure`, verschoben)
  - `app/kern/karte/erfindung-geschichte.tsx` (`InventionStory`, verschoben)
  - `app/kern/karte/mehr-erfahren.tsx`, `app/kern/karte/dazu-passt.tsx`
- Ändern: `wissenskarte.tsx`, `tests/browser/wissenskarte.mjs`, `tests/browser/offline-cold.mjs`

**Schnittstellen:**
- Nutzt `dazuPasst`, `weitereVerbindungen` und `hatBaustein` aus Aufgabe 2, `Kartenbild` und `BildnachweiseAufDieserSeite` aus Aufgabe 3.

Regeln:
- **Ausprobieren:**
  - Erscheint nur, wenn `hatBaustein`.
  - Ein `<details>`; beim ersten Öffnen wird `bausteine.tsx` über `lazy` in `Suspense` eingehängt. Es liegt im selben `SavedGame`, damit alle Baustein-Schlüssel gleich bleiben.
  - Zu ist es Standard.
- **Mehr erfahren:** ein `<details>` mit:
  - `more` und `learning.observe`,
  - weitere Verbindungen als `button.knowledge-link` mit `data-route-focus="world-connection-<kartenId>-<nachbarId>"` und Satz „warum“,
  - `TopicMap`, `.article-routes`, die Buch-, Labor- und Reise-Links von heute, `links` ab dem zweiten.
  - `related` erscheint nirgends.
- **Dazu passt:** Überschrift „Dazu passt“, höchstens 3 große Kacheln aus `dazuPasst`:
  - Nachbarkarte (`Kartenbild` als Kachel, Titel, Satz „warum“) → `onTopic(nachbarId)`. Sie behält `data-route-focus="world-connection-<kartenId>-<nachbarId>"`.
  - Globus → `actions.onPlace(worldPlace(topic, 0))`, Text „Auf dem Globus zeigen“ und der Ortsname.
  - Link → `actions.onNavigate(mode, id, iso)`.
  - Spiel → `actions.onGame(topic.category)`.
  - Jede Kachel ruft vor dem Wechsel `event.currentTarget.focus({preventScroll: true})` auf (Safari).
- **Bildnachweise:** `BildnachweiseAufDieserSeite` am Kartenende, mit allen Fotos der Kacheln.

- [ ] **Schritt 1: Tests (sollen scheitern)** in `tests/browser/wissenskarte.mjs`:
  - `dazuPasstHoechstensDrei`: Elefant hat 1 bis 3 Kacheln. Die erste enthält den Satz „warum“ aus `world-connections.json`. Kein Nachbar, der nur in `related` steht, ist zu sehen.
  - `dazuPasstZurueck`:
    - Bis „Dazu passt“ scrollen, die erste Kachel antippen. Der Titel der Nachbarkarte erscheint.
    - `page.goBack()`. Der Elefant ist wieder da.
    - `document.activeElement` trägt dasselbe `data-route-focus`, und die Kachel liegt im Bildschirm.
  - `ausprobierenLaedtErstBeimOeffnen`:
    - Vor dem Öffnen gibt es keine Ressource `/bausteine-/` (`performance.getEntriesByType('resource')`).
    - Nach dem Öffnen ist der Tier-Baustein sichtbar, und die Ressource ist geladen.
  - `bildnachweiseVollstaendig`: Für jedes Foto in den Kacheln stehen Urheber und Lizenz im Block „Bildnachweise auf dieser Seite“.
  - `motivkachel320`:
    - Bei 320 px die Karte ohne Foto und Zeichnung mit dem längsten Titel öffnen. Der Test sucht sie aus dem Katalog.
    - Danach gilt `scrollWidth <= 320`, und der Titel ist nicht abgeschnitten (`scrollWidth <= clientWidth`).
  - Zusatz in `offline-cold.mjs`: Offline nach Kaltstart `#world/topic/animal-african-savanna-elephant` öffnen, „Ausprobieren“ aufklappen. Der Baustein erscheint.
- [ ] **Schritt 2:** `pnpm run build && QA_DIST=dist node tests/browser/run.mjs --suite ci wissenskarte offline-cold`. Erwartet: FAIL.
- [ ] **Schritt 3:** Bausteine verschieben (Inhalt unverändert), dann `ausprobieren.tsx`, `mehr-erfahren.tsx`, `dazu-passt.tsx` und den Bildnachweis-Block in `wissenskarte.tsx` schreiben.
- [ ] **Schritt 4:** `pnpm test && pnpm run typecheck && pnpm run lint && pnpm run build && QA_DIST=dist node tests/browser/run.mjs --suite ci wissenskarte offline-cold performance`. Erwartet: PASS, `topicJsBytes` eingehalten.
- [ ] **Schritt 5:** Commit „Karte: Ausprobieren erst beim Öffnen, Mehr erfahren, Dazu passt, Bildnachweise“.

### Aufgabe 6: Umzug abschließen – alte Karte weg, Rückweg, Routen, Tests

**Dateien:**
- Löschen: `app/world-topic.tsx`
- Neu: `lib/shuffle.ts` (`shuffle` unverändert)
- Ändern:
  - `app/world-games.tsx` (Import von `shuffle`)
  - `app/world-view.tsx` (Kartenleiste → Rückweg)
  - CSS-Regeln, die nur die alte Karte nutzte (vor dem Löschen mit `grep` belegen)
  - `tests/browser/foundation.mjs` (Chunk-Namen in der Übersichtsprüfung)
  - die Browsertests, die an der alten Karte hängen

Regeln:
- **Rückweg:** Statt der drei Knöpfe gibt es oben einen Link.
  - Kam das Kind aus der App, ist `history.state?.wunderRoute === true` (gesetzt von `navigateHash`). Das gilt für Startseite, Suche, Weltenseite, Auswahl und „Dazu passt“. Dann heißt der Link „← Zurück“ und nutzt `history.back()`.
  - Bei `canReturnToSelection` behält er `data-route-focus="world-return-selection"`.
  - Direkt geöffnet (Link von außen, neuer Tab): „← {Name der Welt}“ führt zur Welt der Karte.
  - „Alle Welten“ entfällt, die Bereichsleiste hat „Welten“.
- **Routen-Stationen:** Die eingebettete Karte (`embedded`) zeigt keinen Rückweg. Eine richtige Antwort schreibt `learned:<id>` und schaltet damit die nächste Station frei (Logik in `world-reader.tsx` bleibt).
- **Tests umstellen:**
  - Betroffen: `animal-learning`, `article-atlas`, `backup`, `book-normalization`, `building-originals`, `connected-discoveries`, `core`, `discovery-central`, `history-learning`, `invention-electrical`, `invention-optics`, `journeys`, `learning-tasks`, `offline-resilience`, `people-learning`, `playground`, `portable-flows`, `retained-answer-wording`, `retained-people-learning`, `retained-people-miniquestions`, `route-focus`, `route-revisit`, `science-originals`, `smoke`, `world-game-learning-copy`, `world-photos`.
  - Die Auswahlen ändern sich:

    | Alt | Neu |
    |---|---|
    | `world-article` | `wissenskarte` |
    | „Das interessiert mich“ | „Merken“ |
    | „Kurzfassung vorlesen“ | „Vorlesen“ |
    | `world-sources` | „Für Erwachsene“ |
    | Bausteine direkt | erst „Ausprobieren“ öffnen |
    | Verbindungen auf der Karte | in „Mehr erfahren“ oder „Dazu passt“ |

  - `articleAtlas()` zieht auf die neue Karte um.
  - Zusicherungen auf `related` (`world-related-`) entfallen mit Begründung („`related` wird nicht mehr angezeigt, Entwurf 6.8“). Was sie schützten, schützt jetzt `dazuPasstHoechstensDrei`.
- **Tempo-Prüfung:** `/world-reader-|world-topic-/` auf die neuen Chunk-Namen umstellen (aus `dist/assets` ablesen). Der Sinn bleibt: Die Weltenübersicht lädt keine Karte.

- [ ] **Schritt 1: Test (soll scheitern).** `eingebetteteKarte` in `wissenskarte.mjs`:
  - Die erste Route aus `WORLD_ROUTES` öffnen und die Frage der ersten Station richtig beantworten.
  - Danach ist die zweite Station wählbar und `learned:<erste Id>` im Pass.
  - Der Titel ist `h2`, es gibt keinen Rückweg-Link.
  - Dazu `rueckwegZurWelt`: Direkt geöffnet (frischer Kontext, `page.goto`) zeigt die Elefantenkarte „← Tierwelt“ und führt zur Tierwelt.
  - Dazu `rueckwegNachDazuPasst`: Elefant → erste Kachel in „Dazu passt“. Die Nachbarkarte zeigt „← Zurück“ und führt zurück zum Elefanten.
- [ ] **Schritt 2:** Erwartet: FAIL. Der Rückweg-Link fehlt, die alte Leiste ist noch da.
- [ ] **Schritt 3:** Rückweg bauen, `world-topic.tsx` löschen, `shuffle` verschieben, ungenutzte CSS-Regeln löschen.
- [ ] **Schritt 4:** Tests umstellen. Für jede entfernte Zusicherung kommt eine Zeile Begründung in die Commit-Nachricht.
- [ ] **Schritt 5:** `pnpm run check`. Erwartet: grün. Einstiegs-CSS und -JS sind nicht größer als in Schritt 0.
- [ ] **Schritt 6:** `pnpm run build && QA_DIST=dist node tests/browser/run.mjs --suite full core animals animal-native-zoom playground challenge offline-resilience offline-cold-full people-learning research`. Erwartet: alle PASS. `journeys` und `home` laufen in Aufgabe 8.
- [ ] **Schritt 7:** Commit „Alte Karte entfernt, Rückweg zur Welt, Tests auf die neue Karte“.

### Aufgabe 7: Reisen – einfach zuerst (A5)

**Dateien:**
- Ändern: `app/learning-journeys.tsx` (Kapitelanzeige um Zeile 61), `tests/browser/suites.mjs`, `tests/browser-suites.test.mjs`
- Neu: `tests/browser/reise-kapitel.mjs` (Suite `reise-kapitel`, `set: 'ci'`, alle Engines)

Regeln:
- **Offen:** `starter`, `fact` und `observe` (alle 80 Kapitel haben einen `starter`).
- **„Für Große“** (zu): `text`, dann `deeper`.
- **„Für Erwachsene: Warum das wichtig ist“** (zu): `whyItMatters`.
- Die Texte in `journey-content.json` bleiben unverändert.

- [ ] **Schritt 1: Test (soll scheitern)** `reiseEinfachZuerst`: Das erste Kapitel der ersten Reise öffnen.
  - `starter`, `fact` und `observe` sind ohne Tippen sichtbar.
  - `text` liegt in einem geschlossenen `details` „Für Große“.
  - Nach dem Öffnen ist `text` sichtbar, wörtlich wie in `journey-content.json`.
- [ ] **Schritt 2:** `pnpm run build && QA_DIST=dist node tests/browser/run.mjs --suite ci reise-kapitel`. Erwartet: FAIL.
- [ ] **Schritt 3:** Anzeige umbauen. Zusicherungen in `journeys.mjs` auf die alten Klappen („Ganz einfach · etwa 6–8 Jahre“, „Noch genauer · etwa 12–14 Jahre“) umstellen.
- [ ] **Schritt 4:** Dieselbe Suite, dann `QA_DIST=dist node tests/browser/run.mjs --suite full journeys` (etwa 40 Minuten, im Hintergrund). Erwartet: PASS.
- [ ] **Schritt 5:** Commit „Reisen: einfache Fassung zuerst, langer Text unter Für Große“.

### Aufgabe 8: Teil A abschließen

- [ ] `pnpm run check` grün. Dann `pnpm run test:full` in Chromium. Laufzeiten ins Ledger.
- [ ] CI-Vollprüfung in drei Browsern von Hand starten (workflow_dispatch `quality.yml` auf dem Branch). Ergebnis abwarten, Fehler beheben (TDD).
- [ ] **Helfer parallel:**
  - `kinder-redaktion`: alle neuen Wörter, nämlich „Rate mal!“, „Merken“, „Vorlesen“, „Gelernt“, „Kurz erklärt“, „Steckbrief“, „Schon gewusst?“, „Ausprobieren“, „Mehr erfahren“, „Für Große“, „Für Erwachsene: …“, „Dazu passt“, „Auf dem Globus zeigen“, „Bildnachweise auf dieser Seite“, „← Zurück“.
  - `design-pruefer`: 320, 390, 768, 1280, 1440 px auf fünf Seiten: Elefant (Foto), eine Bauwerkskarte mit Motivkachel, `history-holocaust` (Tor), eine Personenkarte, ein Reisekapitel.
  - `code-pruefer`: der Diff von Teil A, besonders Pass, IDs, Links, Offline und die Fünf von oben.
- [ ] Befunde: Blockierendes beheben (Test zuerst). Der Rest kommt mit Grund ins BACKLOG.
- [ ] Eintrag in „Was ist neu?“ (`app/kern/neuigkeiten.ts`), kindgerecht, zum Beispiel „Die Wissenskarten sind neu: Erst raten, dann lesen. Unten findest du, was dazu passt.“ Prüft `kinder-redaktion`.
- [ ] `STATUS.md`, `BACKLOG.md`, `CHANGELOG.md` nachführen. Push, Vercel-Vorschau, Screenshots (390 und 1440 px), Bericht in der festen Form.
- [ ] Nach „ok“: PR nach `test-live`, CI, Auto-Merge, Testseite ansehen. Danach den Branch neu von `test-live` aufsetzen und mit Teil B weitermachen.

---

## Teil B „Kürzer und verbunden“

### Aufgabe 9: Jede Karte hat eine erklärte Verbindung (6.8)

**Dateien:**
- Ändern: `app/world-connections.json`, `tests/karten-inhalt.test.mjs`, Exporte über `pnpm run export:data`

Heute haben 35 Karten keine Verbindung: Zeitreise 20, Erfindungen 6, Personen 4, Bauwerke 4, Wissenschaft 1.

- [ ] **Schritt 1:** Test `jede Karte hat mindestens eine erklärte Verbindung` schreiben. Erwartet: FAIL mit 35 Karten-IDs.
- [ ] **Schritt 2: Neue Verbindungen** im vorhandenen Format `{id: '<a>--<b>', fromId, toId, kind, why, checkedAt}`.
  - `kind` nur aus den vorhandenen Werten.
  - `why` ist kindgerecht, höchstens 2 Sätze, länger als 50 Zeichen, ohne „nicht X, sondern Y“.
  - Der Zusammenhang muss fachlich echt sein, gestützt auf die Quellen beider Karten. Die Nachbarin auf der Zeitleiste zählt nur, wenn sie wirklich zusammenhängt.
  - Die ID-Reihenfolge `a--b` wie bei den vorhandenen Einträgen.
- [ ] **Schritt 3:** `fakten-pruefer` und `kinder-redaktion` prüfen die neuen Verbindungen. Befunde einarbeiten.
- [ ] **Schritt 4: Die vorhandenen 196 Sätze durchsehen.**
  - Drei Pakete nach Welt der `fromId`: Tiere und Wissenschaft; Zeitreise und Personen; Erfindungen und Bauwerke.
  - Je Paket `fakten-pruefer` (Stimmt der Zusammenhang?) und `kinder-redaktion` (Versteht ein Kind den Satz?), alle sechs parallel.
  - Nur `why` und `checkedAt` ändern sich, nie IDs.
- [ ] **Schritt 5:** `pnpm run export:data && pnpm test`. Erwartet: PASS.
- [ ] **Schritt 6:** Commit „Verbindungen: jede Karte mit erklärtem Nachbarn, Sätze durchgesehen“.

### Aufgabe 10: Aufräumen über alle Karten (A2)

**Dateien:**
- Ändern: `app/world-catalog.json`, `app/retained-answer-wording.mjs`, `app/challenge-hints.json` (falls Antworten sich ändern), `tests/karten-inhalt.test.mjs`, `tests/browser/retained-answer-wording.mjs`

**Schnittstelle (ändert):**
```ts
export const RETAINED_ANSWER_WORDING: readonly {topicId: string; before: string; after: string}[];
export function restoreAnswerWording(topicId: string, value: string): string; // gleiche Signatur wie heute
```
Der heutige Eintrag (Seeadler) bleibt als erster Listeneintrag.

Gezählt am 21.11.2026:

| Was | Gezählt |
|---|---|
| Steckbrief-Zeilen, die wörtlich in Einleitung, Abschnitten oder „Mehr“ stehen | 73 Zeilen auf 33 Karten |
| Gleicher „Schon gewusst?“-Satz | 25 Zeitreise, 12 Erfindungen, 6 Wissenschaft |
| Fragen mit Textverweis | `animal-red-kangaroo`, `science-flight`, `animal-barn-owl`, `invention-bicycle`, `invention-elevator`, `building-pont-du-gard` |

- [ ] **Schritt 1: Vier Tests schreiben** in `karten-inhalt.test.mjs`:
  - `kein Steckbrief-Eintrag wiederholt wörtlich einen Abschnitt`: `fact.text` steht nicht in `intro`, `paragraphs` oder `more`.
  - `kein „Schon gewusst?“-Satz steht auf mehr als einer Karte`
  - `keine Rate-mal-Frage verweist auf Text`: `/beschrieben|oben|im Text|diese[rn]? Karte/i` in `question.prompt` und in `moreQuestions[].prompt`.
  - `keine Erwachsenensätze im Kinderteil`:
    - Vorher `intro`, `paragraphs`, `facts` und `surprise` nach „Zeitanker“, „Modellgrenze“, „zurückdatiert“ und „Lernziel“ durchsuchen.
    - Die Treffer und das endgültige Muster kommen ins Ledger.
  - Dazu `wrongReasons passt zu den Antworten`: Länge von `questionFeedback.wrongReasons` gleich Länge von `answers`.
  - Erwartet: Die ersten drei Tests scheitern mit den gezählten Karten.
- [ ] **Schritt 2: Doppeltes streichen.**
  - Die doppelte Zeile verschwindet aus dem Steckbrief (A1: „nur Neues“).
  - Beim Fahrrad bleibt jeder Gedanke einmal (Vorschlag der `kinder-redaktion`).
- [ ] **Schritt 3: „Schon gewusst?“** für die 43 Karten.
  - Ein überraschender Satz, den die Karte schon enthält, wird zu `surprise`, gekürzt auf einen Satz.
  - Passt keiner, entfällt das Feld, und der Abschnitt verschwindet (Aufgabe 4).
  - Kein neuer Inhalt.
- [ ] **Schritt 4: Erwachsenensätze** nach `sourceNote` verschieben, das unter „Für Erwachsene“ steht.
- [ ] **Schritt 5: Die sechs Fragen umformulieren**, sodass sie für sich allein stehen.
  - Zuerst nur `prompt` ändern.
  - Müssen Antworten geändert werden: je Antwort einen Eintrag in `RETAINED_ANSWER_WORDING`, `challenge-hints.json` `<id>:mini` und die Reihenfolge von `wrongReasons` anpassen.
  - `why` beantwortet genau die Frage.
- [ ] **Schritt 6: Alte Antworten absichern.**
  - Unit-Test `alte Antwortwörter werden für jede umformulierte Karte zurückgeführt` (jeder Listeneintrag: `before` ergibt `after`).
  - Browsertest `alteAntwortNachUmformulierung` in `retained-answer-wording.mjs`:
    - Ein ausgedachter Altpass speichert für eine umformulierte Karte die alte richtige Antwort.
    - Die Karte zeigt sie als gewählt und richtig, `learned:<id>` bleibt.
  - Zuerst scheitern sehen, dann `restoreAnswerWording` auf die Liste umstellen.
  - Ändert sich keine Antwort, gilt der Browsertest für den Seeadler.
- [ ] **Schritt 7:** `kinder-redaktion` und `fakten-pruefer` prüfen alle geänderten Sätze (Schritte 2 bis 5).
- [ ] **Schritt 8:** `pnpm run export:data && pnpm test && pnpm run build && QA_DIST=dist node tests/browser/run.mjs --suite ci retained-answer-wording wissenskarte`. Erwartet: PASS.
- [ ] **Schritt 9:** Commit „Karten aufgeräumt: kein Doppeltes, eigene Überraschungen, Fragen ohne Textverweis“.

### Aufgabe 11: Zwölf Pilot-Karten (A1, A3, A4, B7 Stufe 2)

**Pilot-Karten:**

| Welt | Karten |
|---|---|
| Tiere | `animal-african-savanna-elephant`, `animal-polar-bear`, `animal-common-octopus` |
| Wissenschaft | `science-water-cycle`, `science-moon-phases` |
| Personen | `person-marie_curie`, `person-jane_goodall` |
| Bauwerke | `building-giza-pyramids`, `building-eiffel-tower` |
| Zeitreise | `history-stone_tools`, `history-apollo11` |
| Erfindungen | `invention-bicycle` |

**Dateien:**
- Neu: `app/kern/karte/stimmt-das.tsx`
- Ändern:
  - `app/kern/karte/wissenskarte.tsx` (Häppchen, „Für Große“, „Stimmt das?“)
  - `app/kern/karte/rate-mal.tsx` („Noch eine Frage“)
  - `app/world-catalog.json`, `tests/fixtures/stable-ids.json` (neuer Schlüssel `world-card-extras` mit allen neuen Fragen- und Behauptungs-IDs)
  - `tests/content-integrity.test.mjs` (jede ID dort existiert noch)
  - `tests/karten-inhalt.test.mjs`, `tests/browser/wissenskarte.mjs`

**Schnittstelle (liefert):**
```ts
export default function StimmtDas(props: {behauptung: KartenBehauptung}): JSX.Element; // speichert in SavedGame unter 'claim:' + behauptung.id
```

Regeln:
- **Kurz erklärt:** Mit `chapters` erscheint jedes Häppchen als `h3` (Frage) plus Text. Darunter steht `<details>` „Für Große“ mit den unveränderten `paragraphs`.
- **„Stimmt das?“:**
  - Steht nach „Kurz erklärt“: Behauptung, Knöpfe „Stimmt“ und „Stimmt nicht“, danach die Auflösung.
  - Die Auflösung sagt immer klar, was stimmt.
  - Ohne `review` und ohne `learned`.
- **„Noch eine Frage“:**
  - Erscheint nach einer richtigen Antwort, wenn es mehr als eine Frage gibt, und zeigt die nächste in der Reihenfolge (am Ende wieder die erste).
  - Ohne Zähler.
  - Den Start beim Besuch bestimmt `ersteFrage`.
- **Inhalt je Karte:**
  - `intro` in 1 Satz, Häppchen nach dem Budget, `facts` höchstens 5, `surprise` 1 Satz.
  - 1 Behauptung, 2 bis 3 Zusatzfragen mit Hinweis.
  - Mindestens eine falsche Antwort ist ein echter Kinderirrtum.
  - Die richtige Antwort ist nicht als einzige die längste.
  - Hauptantworten möglichst unverändert lassen. Sonst einen Eintrag in `RETAINED_ANSWER_WORDING` (Aufgabe 10).
  - Zusammen 25 bis 35 neue Fragen.

- [ ] **Schritt 1: Unit-Tests (sollen scheitern)** in `karten-inhalt.test.mjs`. Konstante `PILOT` = die zwölf IDs. Sätze zählt ein Hilfsmittel `saetze(text)` (Trennung nach `.`, `!` oder `?` vor Leerzeichen oder Ende), Wörter die Trennung an Leerraum.
  - `Pilot-Karten haben Häppchen, eine Behauptung und zwei bis drei Zusatzfragen`
  - `Pilot-Karten halten das Längen-Budget`:
    - Budgets wie in den Festen Vorgaben.
    - Der offene Teil zählt `intro`, `prompt`, `answers`, Häppchen, `facts`, `surprise` und Behauptung zusammen, höchstens 140 Wörter.
  - `richtige Antwort der Zusatzfragen ist nicht als einzige die längste`
  - `neue Fragen- und Behauptungs-IDs sind stabil eingetragen`: jede ID aus `world-card-extras` existiert, und jede neue ID steht dort.
- [ ] **Schritt 2: Browsertests (sollen scheitern)** in `wissenskarte.mjs`:
  - `kapitelUndFuerGrosse`: Elefant zeigt die Häppchen-Überschriften. „Für Große“ ist zu und enthält den ersten Absatz aus `paragraphs`.
  - `stimmtDas`:
    - Eine Antwort tippen, die Auflösung erscheint.
    - Danach `gameSessions['topic:<id>']['claim:<id>:stimmt-1']` gesetzt, kein neues `learned:<id>`.
    - Nach Neuladen bleibt die Auflösung.
  - `zusatzfrageImPass`:
    - Ein ausgedachter Pass hat schon `review['world-question:animal-african-savanna-elephant']`. Die Karte zeigt zuerst `rate-1`.
    - Richtig beantworten: `review['world-question:animal-african-savanna-elephant:rate-1']` und `learned:<id>`. „Noch eine Frage“ zeigt die nächste.
    - Nach Neuladen bleibt alles.
    - Export, Import in einen frischen Kontext: Der Eintrag ist da, `#book` öffnet ohne Browserfehler.
  - `karteHoeheHandy`: Bei 390 × 844 reicht der offene Teil der Elefantenkarte (Kartenanfang bis Ende „Dazu passt“) höchstens 2.600 px weit.
- [ ] **Schritt 3: Entwurf der Inhalte** für die zwölf Karten, nur aus Karte und Quellen. Neue Aussagen nur mit neuer Quelle in `sources`.
- [ ] **Schritt 4:** `fakten-pruefer` und `kinder-redaktion` prüfen alles in zwei Paketen zu sechs Karten, alle vier parallel. Befunde einarbeiten.
- [ ] **Schritt 5:** Inhalte in `world-catalog.json` eintragen und neue IDs in `stable-ids.json`. Dann `stimmt-das.tsx`, Häppchen, „Für Große“ und „Noch eine Frage“ bauen.
- [ ] **Schritt 6:** `pnpm run export:data && pnpm test && pnpm run build && QA_DIST=dist node tests/browser/run.mjs --suite ci wissenskarte backup portable-flows`. Erwartet: PASS.
- [ ] **Schritt 7:** Commit „Zwölf Pilot-Karten: Häppchen, Stimmt das?, neue Fragen“.

### Aufgabe 12: Bildsuche für Zeitreise und Erfindungen (6.10, nur Recherche)

Sie startet in Schritt 0 und läuft nebenher. Bilder werden erst in Teilschritt 4 eingebaut.

**Dateien:**
- Neu: `docs/entwurf/2026-11-21-bilder-zeitreise-erfindungen.md` (Kandidatenliste)

- [ ] **Vier `bild-recherche`-Helfer parallel:**
  - Zeitreise 1–17, Zeitreise 18–34 (Reihenfolge wie im Katalog),
  - die 21 Erfindungen ohne Bild,
  - die 3 Erfindungen mit KI-Bild (3D-Drucker, Nähmaschine, Seismograf).
- [ ] **Auftrag je Karte:**
  - 1 bis 2 freie Originale, zuerst Wikimedia Commons.
  - Je Kandidat: Datei-URL, Urheber, Lizenz mit Link, Quellseite, Kennwort („Foto“, „Spätere Darstellung“, „Historischer Druck“, „Rekonstruktion“), Alternativtext und ein Satz, warum es passt.
  - Keine Gewalt-, Kriegs- oder Leidensszenen im Vordergrund.
  - Gibt es nichts Gutes: „kein passendes Bild“ mit Grund.
- [ ] Ich prüfe, ob Motiv und Karte fachlich zusammenpassen, und trage die Liste ein. Keine Bilddateien ins Repository.
- [ ] **Fertig, wenn:** Jede der 58 Karten hat einen geprüften Kandidaten oder „kein passendes Bild“ mit Grund. Commit „Bildkandidaten für Zeitreise und Erfindungen“.

### Aufgabe 13: Teil B abschließen

- [ ] Wie Aufgabe 8: `pnpm run check`, `test:full` in Chromium, CI-Vollprüfung in drei Browsern, `design-pruefer` (Pilot-Karten in fünf Breiten), `code-pruefer` (Diff von Teil B).
- [ ] Schlussprüfung des ganzen Teilschritts: ein frischer Prüfer auf dem stärksten verfügbaren Modell (`fable`, sofern die Ausnahme vorbei ist, sonst `opus`), mit dem Abschnitt „Worauf Prüfer besonders achten“ und den Entscheidungen im Ledger.
- [ ] Eintrag in „Was ist neu?“, zum Beispiel „Zu jeder Karte gibt es jetzt etwas, das dazu passt. Bei zwölf Karten kannst du knobeln: Stimmt das?“. `STATUS.md`, `BACKLOG.md` und `CHANGELOG.md` nachführen.
- [ ] In den BACKLOG: Die übrigen 192 Karten bekommen Häppchen und Fragen Welt für Welt (Phase 2 und 3). Die Zusatzfragen der 13 Challenge-Karten erscheinen auf der Karte in Teilschritt 3 (B7 Stufe 1).
- [ ] Push, Vorschau, Screenshots, Bericht in der festen Form. Nach „ok“ PR nach `test-live`.
- [ ] Nach dem Merge dem Nutzer sagen, dass jetzt ein neuer Chat sinnvoll ist, mit der Startnachricht aus `STATUS.md`.
