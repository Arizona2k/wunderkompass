# Codeprüfung: Entwurf „Design-Umbau Kompass“

Helfer: code-pruefer (opus/high), 25.11.2026. Prüft docs/entwurf/2026-11-25-design-umbau.md gegen den Code.

**Ergebnis:** Der Entwurf geht nur mit Änderungen. Die Offline-Annahme stimmt. Die Annahme „kern.css gewinnt“ stimmt nicht. Mehrere Suitennamen gibt es nicht. Die Schriftdateien aus der Stilprobe können keine Buchstaben wie ł, ż oder ō. Schritt 6 berührt die Spielstände im Pass, das steht so nicht im Entwurf.

Alle Pfade beziehen sich auf `/home/user/wunderkompass/`. Ich habe nur gelesen und nichts geändert. Kein Test lief.

---

### Muss

**M1. kern.css gewinnt nicht gegen globals.css (Leitlinie 1 und 2, Schritt 1 und 2)**
- `@import` setzt kern.css an den Anfang von globals.css. Die eigenen Regeln von globals.css (Zeile 15 bis 208) stehen im Bundle **danach**.
  - Beleg im gebauten `dist/assets/index--LM6AHuB.css`: kern.css liegt bei etwa Byte 126 400 bis 137 000.
  - Danach kommen `:root{--background…}` (137 588), `.primary-button{background:#b95121}` (globals.css:176), der Fokus `:is(button,a,summary,input,select):focus-visible{…var(--wk-focus)…}` (globals.css:177) und der orange Fokus von globals.css:71.
- Nachgeladene CSS-Teile kommen noch später und gewinnen bei gleicher Spezifität: karte.css, article-workshop.css (über `bausteine.tsx:20`), journeys.css, book.css, guide-dialog.css.
- Dazu kommen `!important`-Regeln:
  - `.speech-button{font-size:.875rem!important}` (globals.css:24 und :29) und `14px!important` (:34).
  - `.large-reading … .primary-button{font-size:1.15rem!important}` (:44).
- Der Code kämpft schon heute dagegen an: `app/kern/karte/karte.css:160-162` und `:329-332`, `app/science-thinking.css:14-17`, `app/article-workshop.css:7`.
- Auch die Schrift für den Fließtext kommt so nicht durch: `globals.css:17` setzt `body{font-family:"Nunito Variable",…}` nach kern.css, `globals.css:16` setzt `--font-sans`. Ein `@font-face` mit `body`-Regel nur in kern.css greift nicht.
- **Vorschlag:** Schritt 1 und 2 löschen die alten Regeln in globals.css und die Gegenregeln mit `!important` im selben PR. „Verweisen lassen“ reicht nicht. Pro Baustein eine Prüfung mit `getComputedStyle` (Farbe, Größe, Fokus) in mindestens einem nachgeladenen Bereich, zum Beispiel Karte oder Reise.

**M2. Im Entwurf stehen Suitennamen, die es nicht gibt**
- Gemeint ist `node tests/browser/run.mjs --suite full …` mit `discovery-central`, `foundation`, `text-geometry`, `karte-stufen`, `world-game-learning-copy`, `learning-tasks` und „Welt-Suiten“.
- Das sind Dateinamen. `tests/browser/run.mjs:221-222` bricht dann mit „Unbekannte Suite“ ab. `spiel-fokus` gibt es noch nicht.
- Richtige Zuordnung laut `tests/browser/suites.mjs`:

| Datei | läuft in den Suiten |
|---|---|
| `discovery-central.mjs` | `home`, `home-visits`, `core`, `kern-huelle`, `offline-cold`, `engine-journeys` |
| `foundation.mjs` | `components`, `performance` |
| `text-geometry.mjs` (Hilfe) | `home`, `core` und `offline-cold` (über article-atlas), `people-learning`, `offline-resilience`, `journeys` |
| `karte-stufen.mjs` | `wissenskarte` (ci) |
| `world-game-learning-copy.mjs` | `playground` |
| `learning-tasks.mjs` | `journeys` (über learning-corrections) |

**M3. Die Schriftdateien der Stilprobe haben keine Latein-Erweiterung**
- Ich habe die Zeichentabellen der woff2-Dateien ausgelesen:
  - `andika-400.woff2` und `andika-700.woff2`: je 232 Zeichen.
  - `bricolage-grotesque.woff2`: 226 Zeichen.
  - Es fehlen ą ć ę ł ń ś ź ż Ł Ż ș ț ă ō ū ā ē ī İ đ Č Š Ž.
- `app/world-catalog.json` enthält ō (6), ū (6), ā (3), ī (2), ł (1) und Ṭ (1). Diese Buchstaben kämen sonst aus einer Ersatzschrift, im Wort gemischt.
- Der Test `tests/browser/kern-huelle.mjs:88-99` erwartet eine eigene Schriftdatei mit `unicode-range` ab U+0100.
- **Vorschlag:**
  - Je Schrift zwei Teile, latin und latin-ext, mit `unicode-range` wie heute in `app/kern/kern.css:5-21`.
  - Am einfachsten über Fontsource-Pakete (`@fontsource/andika`, `@fontsource-variable/bricolage-grotesque`, exakt gepinnt). Das ist derselbe Weg wie bei Nunito, und der Lockfile steckt schon im Build-Fingerabdruck. Die Paketgrößen habe ich nicht geprüft.

**M4. Eine Nunito-Prüfung fehlt im Entwurf**
- `tests/browser/offline-cold.mjs:78-83` prüft „Nunito Variable“ beim Offline-Kaltstart beim Namen.
- Die Suite läuft im CI-Satz und in der WebKit-Kurzprüfung. Der Entwurf nennt nur `kern-huelle.mjs`.
- In Schritt 2 umstellen und **auf alle Schriften erweitern** (Andika 400, Andika 700, Bricolage). Schriften laden erst, wenn sie gebraucht werden. Die heutige Prüfung ist schon mit einer geladenen Schrift zufrieden. Fehlt offline die Schrift der Überschriften, fiele das nicht auf.

**M5. Schritt 6 berührt die Spielstände im Pass**
- Drei Spielfamilien bekommen ein gemeinsames Brett. Sie speichern unter verschiedenen Kennungen:
  - `world:` (`app/discovery-selection.ts:10,18`, `app/earth-explorer.tsx:229,248-257`)
  - `challenge:` (`app/knowledge-challenge.ts:36,53`, `app/knowledge-challenge-game.tsx:30,39`)
  - `classic:` (`app/classic-learning.ts:33`)
  - `topic:` (`app/world-reader.tsx:16`)
- Gespeichert wird in `gameSessions` (`app/use-local-progress.ts:29-34`, `app/progress-sync.ts:48`), dazu `geschafft` je Stufe (`tests/browser/spiel-auswahl.mjs:165`).
- „Beim Stufenwechsel beginnt eine neue Runde“ (BACKLOG 25) ändert, wie gespeicherte Runden behandelt werden.
- In der Prüfliste von Schritt 6 fehlen `pnpm run check` und die Pass-Suiten: `pass-spielstaende`, `animal-game-saves`, `retained-answer-wording`, `habitat-answer-semantics`, `people-learning`, `challenge`.
- **Vorschlag:** Ausdrücklich festhalten: Das Brett ist nur Darstellung. Kennungen, Präfixe, `onWin`-IDs und Sitzungsformat bleiben. Eine Prüfung mit einem alten Testpass (`tests/fixtures/retained-animal-game-before-expansion.json` und ähnliche) mitten in einer Runde: neu laden, weiterspielen, Stempel holen.

**M6. Die große Prüfung kommt zu spät**
- Schritt 2 tauscht die Schrift überall, auch in den Zeichnungen. Die Prüfungen „Text bleibt im Kasten oder Knopf“ stecken vor allem in Suiten, die nur die Vollprüfung startet:
  - `journeys` mit den Buchansichten über book-normalization
  - `research`, `animals`, `offline-resilience`, `home`
- Der Entwurf plant `test:full` erst in Schritt 7.
- **Vorschlag:** Nach Schritt 1, 2 und 6 die CI-„Vollprüfung“ von Hand auf dem Branch starten (`workflow_dispatch`, die Gruppen laufen parallel). Sonst sind späte Funde fast sicher.

---

### Soll

**S1. Wo die Schriftdateien liegen, entscheidet über Offline**
- `build/learning-fingerprint.mjs:8` erfasst nur `app`, `components`, `public`, `migration`, `hooks`, `lib` und einzelne Dateien. `vendor/` (eingebunden in globals.css:3) und `docs/` gehören nicht dazu.
- Liegt eine Schrift dort und wird ersetzt, bleibt die Kennung `VERSION` gleich. Dann geschieht Folgendes:
  - Der neue Worker schreibt in den **aktiven** Vorrat `earth-learning-<VERSION>` (`build/learning-worker.js:27`).
  - Scheitert die Vorbereitung, löscht er genau diesen Vorrat (`build/learning-worker.js:63`).
  - Das Kind verliert die Offline-Bereitschaft.
- **Vorschlag:** Schriften nach `app/kern/schriften/` oder über `node_modules` einbinden. Nie direkt aus `docs/entwurf/…` oder `vendor/` verweisen. `vendor` in `learningInputs` aufnehmen; das Problem besteht schon heute.

**S2. `fontBytes` braucht Code**
- `scripts/performance-budget.mjs:6-15` misst keine Schriften.
- `violations()` (Zeile 16) wertet einen fehlenden Messwert als Verstoß, der Build würde rot.
- `measureBuild` muss die Größe aller `dist/assets/*.woff2` zusammenzählen. In `tests/foundation.test.mjs:38` den neuen Schlüssel ergänzen.

**S3. Verrutschen beim Laden und Tempo**
- Die Suite `performance` (CI) prüft `homeCls ≤ 0.1` und LCP (`tests/browser/foundation.mjs:28-30`).
- Zwei neue Schriftfamilien mit `font-display: swap` können die Seite beim Laden verschieben.
- **Vorschlag:** Ersatzschrift mit passenden Maßen (`size-adjust`, `ascent-override`) oder `preload` einplanen und messen.

**S4. `hyphens: manual` widerspricht gewollten Regeln**
- `app/kern/kern.css:313-317`: Überschriften trennen erst ab 10 Buchstaben, so prüft es `kern-huelle.mjs:629-650`.
- `app/kern/karte/karte.css:42`, `:92` und `:173`: Kartentitel bis 44 px mit `overflow-wrap:anywhere; hyphens:auto`.
- Ohne Trennung bricht ein langer Titel bei 320 px mitten im Wort, und zwar ohne Bindestrich. Das ist für Leseanfänger schlechter.
- **Vorschlag:** Die Überschriften-Regel behalten oder ausdrücklich entscheiden, und den Test dazu anpassen.

**S5. Der Fokusrahmen hat mehr Varianten als genannt**
- Es fehlen:
  - `app/journeys.css` mit `.journey-reader :focus-visible` (2 px `#28627e`)
  - `app/research.css` (3 px `#276c88`)
  - `app/kern/karte/karte.css` mit `.dazu-passt-kachel` (Farbe der Welt)
  - der Ring der shadcn-Bausteine in `components/ui/*`
- Diese Regeln sind spezifischer als die Kern-Regel (Spezifität 0,2,0) und müssen gelöscht werden.
- Die Gegenstücke für erzwungene Farben (`CanvasText` oder `Highlight` in pass-atlas, discovery, book, playground, foundation) brauchen einen Ersatz.
- Der weiße Innenring aus `c.css:34` per `box-shadow` überschreibt eigene Schatten, zum Beispiel `.stufen-knopf[aria-pressed]` (`kern.css:420`).

**S6. „Bewegung reduzieren“ gibt es zweimal**
- Die App hat eine eigene Pass-Einstellung `settings.reducedMotion`. Sie setzt `data-reduced-motion` (`app/earth-explorer.tsx:281`). Die Regel in globals.css lautet `.earth-app[data-reduced-motion] *{animation:none!important;transition:none!important}`.
- c.css kennt nur die Media-Query. Dadurch entsteht ein Fehler beim Schimmer:
  - `.welt.schimmer .bild::after{transform:translateX(0)}` (`c.css:241`).
  - Ist die Pass-Einstellung an, aber nicht die Systemeinstellung, steht der weiße Streifen still über dem Foto. Der Entwurf verlangt aber „nie über Foto“.
- `c.css:60-63`: Die Nadel pendelt 1,6 s ein. Das widerspricht Leitlinie 5.
- Der Stempel muss im Grundzustand schon fertig aussehen. Nur dann zeigt `animation:none` den Stempel.

**S7. Große Schrift**
- `globals.css:44` setzt Fließtext und Knöpfe bei großer Schrift auf `1.15rem!important`, also 18,4 px.
- Hebt Schritt 1 die Grundgröße auf 16 bis 18 px (`.knopf` in c.css: 18 px), wächst die große Schrift um höchstens 2 %.
- `tests/browser/lesbarkeit.mjs:86-104` verlangt nur „größer“. Der Test bleibt grün, der Nutzen ist weg.
- **Vorschlag:** Eine feste Stufung für große Schrift im Kern, etwa +20 %.

**S8. Zwischen Schritt 1 und 7 bleibt die Seite halb umgebaut**
- Wie viel die `--kern-*`-Namen allein ändern:
  - globals.css hat 720 feste Hex-Farben, davon 73 kräftige Orangetöne, und nur 28 `var()`-Verweise.
  - `--kern-*` wird nur etwa 90-mal benutzt.
  - `--kern-grund` wird nie benutzt. Der Grund kommt aus `--background` (globals.css:15 und :17).
  - Neue Werte unter den alten Namen ändern also nur Hülle, Karte und „Was ist neu?“.
- Es fehlen Bausteine in Schritt 1:
  - Wahlknöpfe `.visual-choice button` (31 tsx-Dateien, 14 px, ausgewählt grün)
  - `model-choice` und `quiz-answer`
- Sonderregeln mit `--wk-teal` bleiben stehen: `app/discovery.css:59-60` und `:70-71`, `app/pass-atlas.css:43` und `:71-72`, dazu der Hover-Wert `#1d5143`.
- Folge: Kinder sehen drei bis vier Knopfstile nebeneinander, Labore, Reisen, Buch und Pass bis Schritt 7.
- **Vorschlag:** Wahlknopf, Antwortknopf und Hover in Schritt 1 aufnehmen. `--wk-teal` auf den Kern verweisen lassen. Eine kurze Tabelle „alter Hex-Wert → Token“ für die sichtbarsten Werte.

**S9. Die Leiste in c.css hat 13 px Schrift**
- `c.css:47` setzt die Leistenwörter auf 13 px.
- `kern-huelle.mjs:173` verlangt mindestens 14 px, der Entwurf verlangt 16 px. So nicht übernehmen.
- Bei 320 px hat jedes der sechs Felder nur etwa 53 px. Mit der neuen Schrift „abgeschnitten“ prüfen, auch bei großer Schrift (15 px, `kern.css:189`).

**S10. Die Liste „unbenutzte Klassen“ im Bestand ist teilweise falsch (Schritt 7)**
- `model-solar-system` wird zusammengebaut: `className={'world-model model-'+kind}` (`app/world-models.tsx:10`).
- Die CI-Suite `solar-labels` sucht die Klasse (`tests/browser/solar-comparison.mjs:37,50`).
- `globals.css` begrenzt damit die Höhe der Zeichnung (`max-height:365px`). Nicht löschen.
- Die Suche im Bestand lief nicht über `.json`.

**S11. Der Lizenz-Link im Elternbereich**
- `app/parent-guide.tsx:17` verlinkt „Schrift-Lizenz (Nunito)“ auf `/licenses/nunito-OFL.txt`.
- In Schritt 2 auf die neuen Lizenztexte umstellen.

---

### Kann

- **K1. Nunito entfernen ist sicher.** Nur `app/kern/kern.css:5-21` bindet das Paket ein, laut Suche über den ganzen Code. Im selben Commit mitziehen:
  - `globals.css:16-17`
  - `offline-cold.mjs:78-83` und `kern-huelle.mjs:71-99`
  - `parent-guide.tsx:17` und `public/licenses/nunito-OFL.txt`
  - Entfernen mit `pnpm remove`, damit der Lockfile stimmt (die CI nutzt `--frozen-lockfile`).
  - Danach nach `@fontsource` suchen: Vite warnt bei einem nicht gefundenen `url()` nur, statt abzubrechen.
  - `tests/offline-assets.test.mjs:10-11` benutzt nur einen Dateinamen in einem Testordner und ist nicht betroffen.
- **K2. Weitere Schriftangaben:**
  - `globals.css:121` `.chapter-diagram svg text{font-family:"Trebuchet MS"}` ist spezifischer als die `svg`-Regel im Kern.
  - `book-cell-process-figure.css` und `book-gene-figures.css` setzen `font:… system-ui`.
  - Der Fließtext hat Stärke 500 (globals.css:17), Andika gibt es nur in 400 und 700. 500 wird dünner, 600 und 800 werden 700.
- **K3. Marke:** `public/favicon.svg` (orange `#f77e3f`), `public/learning.webmanifest` (`theme_color`, `background_color`) und die PNG-Symbole in Schritt 3 mitnehmen.
- **K4. Kontraste:**
  - `--w-tiere #2E8A5C` mit weißer Schrift hat nur etwa 4,3:1. Für Symbole reicht das, für Text nicht.
  - Der Rand `#788A80` hat auf Papier etwa 3,2:1. Die 3,6:1 im Entwurf gelten nur auf Weiß.
- **K5. „x von y Karten entdeckt“:** Der Pass kann Kennungen weggefallener Karten enthalten. Nur Kennungen aus dem aktuellen Katalog zählen, sonst ist „12 von 10“ möglich.
- **K6. Texte in Schritt 6, die Tests festhalten:**
  - der Satz „Alle 8 Aufgaben sind gelöst. Dein Spielstempel bleibt in deinem Entdeckerpass.“ (`spiel-auswahl.mjs:162`)
  - der Fokus auf der Überschrift „Eine ganze Runde gelöst!“ (`:163`)
  - „Neue Runde“ statt „Noch eine Runde“ in 5 Testdateien: learning-tasks, challenge-hints, connected-discoveries, spiel-auswahl, playground
- **K7. Größenbudget:** Die engere Grenze ist `entryCssGzipBytes` (60 000, gemessen 45 684, also etwa 14 KB Luft), solange Alt und Neu nebeneinander stehen.
- **K8.** `tests/browser/core.mjs:34` hält den Seitentitel fest, falls `index.html` mehr als die Beschreibung ändert.
- **K9.** Farbattribute in Zeichnungen sind in Tests festgehalten: `fourteen-actual-dom-semantic-laws.mjs:15`, `retained-people-dom-laws.mjs:72`, `invention-electrical.mjs:86`, `planet-diagrams.mjs:13`, `journeys.mjs:262-263`. Das zählt nur, wenn Zeichnungen umgefärbt werden.
- **K10. Die 44-px-Prüfungen scheitern nicht.** Es sind Untergrenzen (mindestens 44). Das Risiko im Entwurf ist zu hoch angesetzt. Auf 48 anheben wäre eine Verschärfung.
- **K11.** Für jeden sichtbaren Schritt einen Eintrag in „Was ist neu?“ einplanen (Regel in `CLAUDE.md`).

---

### Was gut ist

- **Offline stimmt.** `build/learning-assets.mjs:6` nimmt jede `.woff2` auf. `build/learning-worker.js:130` liefert `/assets/*.woff2` aus dem Vorrat. `offlineAssetMetrics` prüft, dass die Liste genau dem fertigen Build entspricht.
- Tests werden im selben PR angepasst statt abgeschwächt. Pass, IDs und Routen bleiben laut Leitlinie 4 unberührt.
- Die Grundlage kommt zuerst. Die Schriften liegen bei uns selbst, ohne fremden Dienst.
- Die Größenangabe stimmt: Bricolage 131 548 B gegen Nunito 39 128 + 35 588 B.
- Kontraste nachgerechnet: Petrol auf Papier etwa 5,5:1, Weiß auf Orange etwa 3,6:1 (nur Grafik).
- Die Nunito-Entfernung ist grundsätzlich sicher (K1).

### Nicht geprüft

- Kein `pnpm test`, kein Build und kein Browserlauf. Der Entwurf ist nur Text.
- Größen der Fontsource-Pakete für Andika und Bricolage.
- Ob die Andika-Lizenz einen reservierten Schriftnamen hat (wichtig beim Zuschneiden).
- Das Verhalten von `unicode-range` in Firefox und WebKit.
- Ob Vite sehr kleine Schriftteile (unter 4 KB) direkt ins CSS einbettet.
- Wie es aussieht, und alle übrigen Bausteine aus c.css.
