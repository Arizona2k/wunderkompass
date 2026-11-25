# Design-Umbau „Kompass“: Bestand im Code (25.11.2026)

Helfer: `Explore` (nur gelesen), Stand `bce6fba`. Grundlage für den [Entwurf des Umbaus](2026-11-25-design-umbau.md).

**Zum Lesen der Zeilennummern:** `app/globals.css` ist minifiziert und hat nur 208 Zeilen. Eine Angabe wie `:15` meint dort eine lange Zeile mit vielen Regeln. Alle Pfade beziehen sich auf `/home/user/wunderkompass/`.

---

### 1. Gestaltungsgrundlagen

**Es gibt sechs Token-Sätze, die sich überschneiden:**

1. **Kern** in `app/kern/kern.css:23-39`:
   - Farben: `--kern-grund #FAF8F3`, `--kern-flaeche #FFF`, `--kern-text #15303A`, `--kern-text-leise #4A626B`, `--kern-petrol #0E6E72`, `-dunkel #0B5A5D`, `-zart #E3F1F1`, `--kern-orange #E8742A`, `--kern-orange-text #B5531A`, `--kern-linie #DDE5E3`.
   - Maße: `--kern-rund 16px`, `--kern-rund-gross 24px`, `--kern-tipp 48px`, `--kern-leiste-hoehe 64px`, `--kern-schatten`.
   - Fokus in `kern.css:42-45`: 3px, durchgezogen, `--kern-petrol`, Abstand 3px.
   - forced-colors in `kern.css:473-476`.
2. **shadcn** in `app/globals.css:15`: `--background #FAF8F3`, `--foreground #15303A`, `--primary #B5531A`, `--ring #0E6E72`, `--radius .85rem` sowie card, popover, muted, accent, destructive, border und input. Das doppelt die Kern-Farben, verweist aber nicht auf sie.
   - `globals.css:16`: `@theme inline` macht daraus `--color-*`, `--radius-sm` bis `-xl` und `--font-sans "Nunito Variable"`.
   - `globals.css:17`: body mit 18px, Zeilenhöhe 1.5, Gewicht 500. h1 bis h3 mit 800.
3. **Discovery** in `app/discovery.css:2`: `--wk-ink #193743`, `--wk-muted #466570`, `--wk-night #122943`, `--wk-teal #246374`, `--wk-amber #edb176`, `--wk-line #d6dedb`, `--wk-radius 24px`, `--wk-focus #157599`.
4. **Foundation** in `app/foundation.css:2`: `--wk-gutter`, `--wk-layout-gap`, `--wk-tile-min 320px`, `--wk-touch 48px` und **noch einmal `--wk-focus`, hier `#256384`**. foundation.css wird nach discovery.css geladen und gewinnt.
5. **Karte** in `app/kern/karte/karte.css:5-10`: `--motiv-grund`, `-stark`, `-symbol` und `-text` je Welt. Dazu einzelne `--kern-*` und fest eingetragene Hex-Werte.
6. **Örtliche Token in globals.css:**
   - `:29`: `.tone-*` mit `--topic-wash` und `--topic-ink`.
   - `:68`: `--world-tint` und `--world-accent`.
   - `:113`: `--learning-radius 16px` und `--learning-gap 16px`.
   - Dazu kommt `vendor/shadcn-tailwind-4.13.0.css` mit Keyframes und Varianten.

**Fokusrahmen gibt es in mindestens fünf Varianten:**
- Kern: 3px petrol.
- `globals.css:53`: 3px `#386b80`.
- `globals.css:71`: 3px orange `#df773c`.
- `foundation.css` und `pass-atlas.css:74-75`: 2px `var(--wk-focus)`.
- Weitere eigene Regeln in discovery.css (6), book.css (5) und playground.css (4).

**Stilprobe C** (`docs/entwurf/2026-11-25-stilproben/c.css`, `:root`):
- Farben: `--papier #EDF1EA`, `--tinte #15314A`, `--tinte-2 #4A5F70`, `--linie #C6D1C8`, `--rand #788A80`, `--wasser #0B6B73`, `--petrol-hell #DCEFEF`, `--nadel #D9650A`, `--wald #2E7A55` (dazu `-hell` und `-tief`), `--falsch #B5462F`, `--falsch-hell #F8E7E1` und die Weltfarben `--w-*`.
- Schriften: `--kopf "Bricolage Grotesque"`, `--text "Andika"`.
- Radien: `--r-gross 22px`, `-mittel 14px`, `-klein 8px`.
- Fokus: 3px `--wasser`, Abstand 2px, dazu ein weißer Schatten.
- Klassen: `.kopf` (bleibt oben stehen), `.marke`, `.rund` (48px), `.fuss` (fest unten, 6 Spalten), `.knopf` (56px).

**Bytes je CSS-Datei (Quelltext):**

| Datei | Bytes |
|---|---|
| globals.css | 110319 |
| discovery.css | 32618 |
| kern/karte/karte.css | 25230 |
| kern/kern.css | 16956 |
| vendor/shadcn-tailwind-4.13.0.css | 16041 |
| pass-atlas.css | 13383 |
| playground.css | 12669 |
| journeys.css | 11078 |
| research.css | 9779 |
| book.css | 5928 |
| article-workshop.css | 5759 |
| article-atlas.css | 4817 |
| foundation.css | 3155 |
| people-evidence.css | 3146 |
| world-model.css | 3069 |
| book-gene-figures.css | 2944 |
| guide-dialog.css | 2781 |
| book-cell-comparison-figure.css | 2377 |

Kleinere Dateien:
- book-cell-dna 1792, book-digital 1762, book-statistics 1702, science-diagram 1668, book-cell-process 1600, animal-inquiry 1575, book-nature-water 1555, invention-optics 1506, planet-comparison 1495, science-thinking 1352, nature-study 1348, history-evidence 1334, book-ecology 1323, book-retained-figures 1321, animal-illustration 1097, book-astronomy 1042, topic-map 1039, science-investigation 1023, device-illustration 1010, photosynthesis-roles-drawing 867.
- Unter 600: kern/karte/rueckweg 586, nature-photo 338, planet-distance-notes 278, book-nature-habitats 201, book-retained-investigations 194, book-nature-process 93.

Zum Vergleich:
- Stilprobe c.css: 21678 Bytes.
- Gebaut (`dist/assets`): Einstiegs-CSS `index-*.css` 247248 B (gzip 45684), dazu eigene Teile world-reader 17437, bausteine 14548, learning-journeys 10179 und knowledge-book 7091.

**Wie die Stile geladen werden:**
- `migration/main.tsx` lädt `app/globals.css`.
- globals.css bindet Tailwind 4 ein (`@import "tailwindcss" source(none)` mit `@source` auf app, components und migration), außerdem tw-animate-css und den shadcn-Vendor.
- Danach bindet sie discovery, article-atlas, pass-atlas, playground, foundation und research ein. **kern.css kommt zuletzt** und gewinnt deshalb bei gleicher Spezifität.
- Die übrigen CSS-Dateien importiert jede Komponente selbst, Vite teilt sie in eigene Teile.
- Tailwind-Klassen stehen nur in `components/ui/*`. In `app/` kommt nur `sr-only` vor.

---

### 2. Schriften

- **Nunito Variable**: Paket `@fontsource-variable/nunito` 5.3.0 (package.json).
  - Geladen über zwei `@font-face` in `app/kern/kern.css:5-21`: latin und latin-ext, Gewicht 200 bis 1000, `font-display: swap`, mit `unicode-range`.
  - Quelle: `url('@/node_modules/@fontsource-variable/nunito/files/nunito-latin(-ext)-wght-normal.woff2')`. Vite legt die Dateien mit Hash ab: 39128 B und 35588 B.
- **Lizenz:** `public/licenses/nunito-OFL.txt`, Hinweis in `kern.css:3`. In `public/` liegt keine weitere Schrift.
- **Alte Schrift:** `kern.css:357` setzt für alle SVG `font-family:"Trebuchet MS",Arial,sans-serif`. Zeichnungen nutzen also die alte Systemschrift.
- **Offline:** `build/learning-assets.mjs` (`finalLearningAssets`) nimmt jede Datei in dist mit der Endung `.woff2?` auf. `build/learning-worker.js:130` liefert `/assets/*.(js|css|woff2?)` aus dem Cache. Geprüft wird das über offlineAssetMetrics und `build/learning-offline.ts`. Neue Schriften, die wie Nunito per `url()` aus CSS kommen, landen also **ohne Zusatzarbeit** im Offline-Paket.
- **Stilprobe:** in `docs/entwurf/2026-11-25-stilproben/schriften/`:
  - bricolage-grotesque.woff2: 131548 B, als variable Schrift deutlich größer als Nunito.
  - andika-400: 19208 B, andika-700: 19472 B.
  - grandstander: 42376 B, laut Beschreibung nicht mehr vorgesehen.
  - Die OFL-Texte liegen bei. Sie müssten nach `public/licenses/` wandern.
  - Offen: ob die Andika-Dateien latin-ext abdecken (Test `kern-huelle.mjs:95-99` mit „Białowieża“).

---

### 3. Hülle

**Komponenten:**
- **Kopf** `app/kern/kopfzeile.tsx`: `header.kern-kopf`.
  - Logo: `a.kern-marke` mit href `#home`, aria-label „WunderKompass – Startseite“, Symbol Compass aus lucide in `.kern-marke-zeichen`.
  - Darin die Bereichsleiste.
  - Suche: Knopf mit aria-label „Lernwelt durchsuchen“.
  - Pass: `.kern-knopf.kern-pass`, aria-label „Entdeckerpass öffnen“, sichtbarer Text „Entdeckerpass“, Symbol IdCard.
- **Leiste** `app/kern/bereichsleiste.tsx`: `nav.kern-leiste` mit aria-label „Bereiche“. Sechs Links mit `data-route-focus=home-nav-<id>`.
  - Die Daten stehen in `app/kern/bereiche.ts`: Start, Welten, Spielen, Labor, Reisen, Buch, dazu `bereichFuerRoute`.
  - Anordnung: am Handy fest unten in 6 Spalten (`kern.css:159-186`), am Tablet zwei Zeilen (`kern.css:205-212`), ab 1200px eine Reihe (`kern.css:214-219`).
- **Menü:** Ein Menü-Knopf („Hamburger“) existiert nicht. Diese Rolle übernimmt die Leiste.
- **Fuß** `app/kern/fusszeile.tsx`: `footer.kern-fuss` mit dem Link „Was ist neu?“ (`#updates`), dem Knopf „Für Eltern“, einer Offline-Box und dem Satz „Wissen entdecken. Zusammenhänge verstehen.“
- **Einbindung** in `app/earth-explorer.tsx` (82 KB):
  - `:282` Sprunglink, `:283` Kopfzeile, `:284` `main#learning-main`, `:347` Fusszeile.
  - `:349` Suchdialog: `.search-dialog` mit `app/global-search.tsx` und `ui/command`.
  - `:350` Pass-Dialog: `.passport-dialog.passport-atlas` mit `app/pass-shell.tsx`.
  - Eltern und Hilfe: `app/parent-guide.tsx` und `app/help-guide.tsx` mit `guide-dialog.css`.

**Bereich → Hauptdatei → Stilquelle**

| Bereich | Hauptdatei | Stilquelle |
|---|---|---|
| Start | `app/discovery-central.tsx`, `discovery-daily.tsx` | discovery.css (`--wk-*`), etwas globals.css und `kern.css:377` |
| Welten | `app/world-view.tsx` (+ world-gateways, world-media, world-progress) | globals.css ab `:68` (`--world-*`), foundation.css |
| Wissenskarte | `app/world-reader.tsx` → `app/kern/karte/wissenskarte.tsx` | karte.css (`--motiv-*`, teils `--kern-*`), rueckweg.css, alte article-workshop.css über `kern/karte/bausteine.tsx:20`, Klassen aus globals.css (`.quiz-answer`, `.speech-button`, `.world-photo`) |
| Wissensbuch | `app/knowledge-book.tsx` | book.css und rund 20 `book-*-figures.css`, globals.css, ui/tabs, ui/input |
| Spiele: Übersicht | `app/playground.tsx`, `playground-catalog.ts` | playground.css |
| Spiele: Welt-Spiele | `app/world-games.tsx`, `knowledge-challenge-game.tsx` | globals.css (`.world-game-*`, `:140`), `kern.css:461-471` |
| Spiele: Klassik | `app/learning-games.tsx`, `classic-reason-game.tsx`, `advanced-games.tsx`; Rahmen `game-shell.tsx` | playground.css (`.classic-learning`), globals.css, ui/progress |
| Labore | `app/research-labs.tsx` (+ learning-labs, solar-lab) | research.css, ui/slider, ui/switch |
| Lernreisen | `app/learning-journeys.tsx` | journeys.css, `.tone-*` aus globals.css, ui/progress |
| Pass | `earth-explorer.tsx:350`, `app/pass-shell.tsx`, progress-panel.tsx | pass-atlas.css (`--wk-focus`), ui/dialog, alert-dialog, switch, slider |
| Was ist neu? | `app/kern/neuigkeiten-ansicht.tsx` | `kern.css:256-350`, ganz im Kern |

**Fazit:** Ganz im Kern-Stil sind nur die Hülle, „Was ist neu?“ und die Stufenwahl, die Wissenskarte zum Teil. Alte globale Klassen sind weit verbreitet:
- `secondary-button`: 69 Dateien, 191 Treffer
- `primary-button`: 23 Dateien, 47 Treffer
- `speech-button`: 22 Dateien
- `eyebrow`: 22 Dateien
- zum Vergleich `kern-knopf`: 4 Dateien, 7 Treffer

`.primary-button` und `.secondary-button` sind in globals.css mehrfach definiert, etwa `:17`, `:29` und `:176`.

---

### 4. Spielende und Stempel

**Wo der Text steht:**
- `app/world-games.tsx:64`: Knopf mit `{index===ids.length-1?'Spielstempel sammeln':'Nächste Aufgabe'}` (`primary-button`). Der Klick ruft `setDone`, `setGeschafft` und `onWin()` auf.
- Abschluss in `world-games.tsx:63`: `.world-game-finish` mit h2 „Eine ganze Runde gelöst!“, dem Satz „Alle {n} Aufgaben sind gelöst. Dein Spielstempel bleibt in deinem Entdeckerpass.“ und dem Knopf „Zu einer passenden Entdeckerkarte“.
- Dasselbe in `app/knowledge-challenge-game.tsx:39` (Knopf) und `:38` (Abschluss).
- Weitere Abschlüsse:
  - `app/classic-reason-game.tsx:38`: „Zusammenhänge entdeckt!“
  - `app/learning-games.tsx:102`: GameWin „Abenteuer geschafft!“
  - `app/advanced-games.tsx:38`: „Stempel im Entdeckerpass“
  - Quiz in earth-explorer: „REISE GESCHAFFT“
- Der Text steht fest im Code, nicht in der Wortliste `app/kern/woerter.ts`. Dort stehen nur richtig, nochNicht, tipp, geschafft und weiterZu.
- Stile: `.world-game-finish` (grün `#3a7d57`) und `.game-win` in globals.css um `:140`.

**Wie der Stempel gespeichert wird:**
- `world-games.tsx:45` ruft `onWin('world:'+game)` auf.
- `earth-explorer.tsx:202`: `completeGame=id=>{addProgress("games",id);celebrate();}`.
- `use-local-progress.ts:17`: `add(field,id)` hängt die ID an.
- Das Feld ist `games: string[]` (`progress-storage.ts:10`), im Pass mit Schema 3 unter dem Schlüssel `erde-entdecken:save:v3`.

**Wo der Stempel angezeigt wird:**
- Pass-Statistik „Spiele geschafft“ in `earth-explorer.tsx:350`: `gameStamps.size` (`:223`) plus die `world:`-IDs, geteilt durch `GAME_INDEX.length`.
- Punkte: `:227`.
- Abzeichen: `world-progress.tsx:9-12`.
- Spielübersicht: `playground-catalog.ts:45-62` (`gameStatus`, „Schon gespielt“ oder „Runde abgeschlossen“), `playground.tsx:20` (Häkchen) und `:22` („X von N Angeboten ausprobiert und geschafft“).

---

### 5. Tests, die vom Aussehen abhängen

**Feste Werte, die mit Kompass sicher scheitern:**
- `tests/browser/kern-huelle.mjs` (Suite ci):
  - `:83-86`: Nunito geladen, body 18px, Hintergrund **rgb(250, 248, 243)**, Schriftliste beginnt mit „Nunito Variable“.
  - `:95-99`: Nunito latin-ext für „Białowieża“.
  - `:136-138`: Fokus der Marke mindestens 2px, Farbe **rgb(14, 110, 114)**. Die Kompass-Farbe `--wasser #0B6B73` weicht davon ab.
- `tests/browser/karte-stufen.mjs:138`: falsche Antwort mit Hintergrund **rgb(255, 243, 228)**. Kompass sieht `--falsch-hell #F8E7E1` vor.

**Geometrie und Aufbau der Hülle (`kern-huelle.mjs`):**
- `:111-120`: Überschriften ohne Rahmen.
- `:169-182`: Leistenwörter genau wie BEREICHE, Flächen mindestens 48×48, nichts abgeschnitten, Schrift mindestens 14px, kein Überlauf, genau ein aria-current, Kontrast mindestens 4.5, unter 768px liegt die Leiste unten.
- `:210-211`: keine Ziffer am Pass, kein Knopf „Hilfe öffnen“.
- `:220-233`: Fuß mit „Was ist neu?“ und „Für Eltern“.
- `:238-269`: Leiste verdeckt den Fuß nicht.
- `:273-292`: Dialoge liegen über der Leiste.
- `:296` und `:666`: große Schrift bei 320px.
- `:523-533`: „So geht’s“ mindestens 44px hoch.
- `:537-565`: Fokusrahmen und Platzhalter der Suche.
- `:588-626`: „Was ist neu?“ samt axe.
- `:632`: keine getrennten Wörter.

**Gemeinsame Prüfhilfen** in `tests/browser/lesbarkeit.mjs`, genutzt von wissenskarte.mjs und `reise-kapitel.mjs:72-75`:
- `aufklapperErkennbar` `:19`: ::after mindestens 8×8 oder Listenmarke.
- `tippflaechen48` `:38`: mindestens 47.5.
- `schrift14` `:50`.
- `kontrast` `:71`.
- `grosseSchriftWaechst` `:86`: Klasse `.earth-app.large-reading`.
- `bleibtGroesser` `:108`.

**Wissenskarte** `tests/browser/wissenskarte.mjs`:
- `:399-418`: Lesbarkeitsprüfungen, `.answer-letter` mit Kontrast mindestens 4.5.
- `:439-441`: Kontrast nach dem Tippen.
- `:452-477`: Höchstgrößen der Zeichnungen (120, 150 und 400px).
- `:481`: Schrift mindestens 14px.
- `:486-510`: Motivkachel bei 320px.
- `:517`: grid-Prüfung.
- `:829` und `:891`: Schrift und Geometrie.
- Dazu `karte-stufen.mjs:248` und `:260`.

**Pass** `tests/browser/pass-atlas.mjs` (bei 320 und 1440px):
- `:13-44`: Tippflächen mindestens 44, Text passt, Fokusring mindestens 2px mit Kontrast mindestens 3, Schaltergeometrie, Textkontrast mindestens 4.5.
- `:64`: Knöpfe in Kopf und Fuß.
- Screenshots `pass-*.png`, forced-colors, axe, `animationName none`.
- Außerdem `pass-spielstaende.mjs:102-130`: mindestens 48px.

**Start** `tests/browser/discovery-central.mjs`:
- `:262-266`: Kontrast.
- `:272-273`: Leistenlinks mindestens 44px, feste Wörter `['Start','Welten','Spielen','Labor','Reisen','Buch']`.
- Fokus mindestens 2px: `:279`, `:334`, `:354`, `:386`.
- `:131`: Grafikkontrast mindestens 3.
- Screenshots: `:140-141`, `:190`.
- axe auf `.discovery-hero` und `.kern-leiste`: `:195`, `:381`, `:383`.

**Weitere Suiten:**
- `foundation.mjs:40-113`: Überlauf, „44px touch contract“, Fokus auf summary.
- `text-geometry.mjs`: Text bleibt im Knopf, Grafikkontrast mindestens 3.
- `spiel-auswahl.mjs:119` und `:204`: Lage des Spielraums. `:158` und `:162`: genaue Texte „Spielstempel sammeln“ und der Abschlusssatz.
- `smoke.mjs`: Screenshots bei 360 und 1440px.
- Rund 15 weitere Suiten mit Prüfungen auf mindestens 44px: journeys, research, guides, globe-missions, practical-guides, book-*, nature-*, invention-* und weitere.

**Abhängigkeit von Namen und Klassen:**
- „Entdeckerpass öffnen“: 58 Dateien, 86 Treffer
- „Lernwelt durchsuchen“: 9 Dateien
- „Spielstempel sammeln“: 6 Dateien
- „Nächste Aufgabe“: 8 Dateien
- `.quiz-answer`: 28 Dateien
- `.wissenskarte`: 23 Dateien
- `.discovery-hero`: 9 Dateien
- Überschrift „Eine ganze Runde gelöst!“: 5 Dateien

Die Unit-Tests (`tests/*.test.mjs`) prüfen kein Aussehen.

**Budgets** in `performance-budgets.json`:

| Budget | Grenze | Letzte Messung (`.qa-output/performance-build.json`) | Spielraum |
|---|---|---|---|
| entryCssBytes | 350000 | 247248 | rund 100 KB |
| entryCssGzipBytes | 60000 | 45684 | rund 14 KB |
| entryJsBytes | 1000000 | 840446 | |
| entryJsGzipBytes | 293000 | 242333 | |

- Weitere Grenzen: largestJsBytes 1750000, worldGeometryBytes 1800000. Im Browser: homeJs 1065000, areaJs 1500000, topicJs 2718000, CLS 0.1, readyMs und lcpMs je 6000.
- **Für Schriften gibt es kein Budget.** `scripts/performance-budget.mjs` misst nur das Einstiegs-CSS laut Manifest.

---

### 6. Altlasten (mit Beleg)

- **Keine verwaiste Datei:** Jede CSS- und TS-Datei wird importiert.
- **Unbenutzte Klassen in globals.css:** `age-note`, `brand-word`, `brand-period` (alter Kopf), `help-steps`, `more-games`, `parent-source`, `place-select`, `review-button`, `section-count`, `sort-chip`, `world-badge-title`, `world-games-hub`, `game-tile-icon`, `game-meta`, `challenge-levels`, `journey-image-diagram`, `journey-symbol`, `model-solar-system`, `world-choice-concept`.
  - Geprüft per grep über tsx, ts und mjs. Dynamisch gebaute Namen wie `stage-*`, `tone-*`, `world-<kat>` und `moon-phase-*` sind ausgenommen.
- **Unbenutzt in anderen Dateien:** playground.css `challenge-levels` und `game-preparation`, journeys.css `section-count`.
- **`--wk-focus` doppelt** mit verschiedenen Werten: `discovery.css:2` und `foundation.css:2`. Dazu kommt `--kern-petrol`.
- **shadcn-Variablen** in `globals.css:15` sind Kopien der Kern-Farben statt Verweise.
- **Alte Schrift in Zeichnungen:** `kern.css:357` hält alle SVG bei Trebuchet. `BACKLOG.md:56` und `:277` nennen 46 Zeichnungen in alter Schrift.
- **Ausgleichsregeln:** `kern.css` ab `:352` ist voller Korrekturen für alte Bereiche, z. B. `.stufen-wahl` mit 48px gegen alte 44px-Regeln.
- **Alte Prüfregeln:** Viele Tests prüfen noch 44px, die Hülle verlangt 48px.
- **index.html:** Beschreibung „Kinder ab 8 Jahren“, alter Titel.

---

### Wo anfangen, wo die Risiken liegen

Am besten fängt der Umbau mit den Token in `app/kern/kern.css:23-39` an: Dort die Kompass-Werte setzen und `globals.css:15` sowie die beiden `--wk-focus` darauf verweisen lassen. Danach die Schriften (Andika und Bricolage per `@font-face` in kern.css, Lizenzen nach `public/licenses/`; offline kommen sie automatisch mit) und die Hülle (`kopfzeile.tsx`, `bereichsleiste.tsx`, `fusszeile.tsx`). Deren Aufbau passt schon gut zu `.kopf`, `.fuss` und `.rund` aus c.css. Das größte Risiko sind fest eingetragene Werte in den ci-Tests: Hintergrund, Fokusfarbe und Nunito in `kern-huelle.mjs:83-99` und `:138`, der Farbwert in `karte-stufen.mjs:138`, die festen Leistenwörter sowie Screenshots und 44/48px-Prüfungen in rund 40 Suiten. Diese Tests müssen im selben Schritt angepasst werden. Das zweite Risiko ist die minifizierte, 110 KB große `globals.css`: Ihre alten Klassen (`primary-button` und `secondary-button` in über 90 Dateien, `quiz-answer`) prägen fast alle Bereiche. Ändert man sie, wirkt das überall; lässt man sie stehen, bleiben drei Farb- und Fokussysteme nebeneinander. Bei der Größe gibt es beim CSS etwa 100 KB Luft, für Schriften fehlt ein Budget: Bricolage allein wiegt 131 KB, mehr als beide Nunito-Dateien zusammen.
