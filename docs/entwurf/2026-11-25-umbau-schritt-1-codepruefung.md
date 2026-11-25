## Ergebnis

> Helferbericht (code-pruefer, opus/high), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

Nicht bereit. Drei Löschungen alter Fokusregeln machen den Fokusrahmen an Stellen unsichtbar, die bestehende Browser-Tests ausdrücklich prüfen. Zwei davon treffen die CI-Suite `pass-atlas` (Pflicht-Check), eine die volle Suite `journeys`. Das habe ich aus dem Code abgeleitet, nicht im Browser laufen lassen.

## Befunde

### Muss

**M1: Der Fokusrahmen im Pass-Kopf ist weiß auf hellem Grund**
- Stelle: `/home/user/wunderkompass/app/kern/kern.css:85` mit `.passport-atlas .pass-header :focus-visible { outline-color: #fff; }`.
- Der Kommentar sagt „Der Pass-Kopf ist dunkel“. Das stimmt nicht: `/home/user/wunderkompass/app/pass-atlas.css:114` (`.passport-atlas .pass-header{background:#eaf0ec}`) schlägt Zeile 3 (`var(--wk-night)`). Zeile 116 macht auch den Schließen-Knopf weiß.
- Fall: Pass öffnen, mit Tab auf „Entdeckerpass schließen“. Der Rahmen ist weiß auf #eaf0ec, Kontrast 1,16:1, also praktisch unsichtbar. Vorher war er Petrol (gelöschte Regel `.passport-atlas .pass-header button:focus-visible{outline-color:var(--wk-focus)}`).
- Test: `/home/user/wunderkompass/tests/browser/pass-atlas.mjs:115` → `keyboardRing(close,'header close')` verlangt mindestens 3:1 und wird bei 320 und 1440 px rot.
- Vorschlag: Zeile 85 und ihren Kommentar löschen. Petrol auf #eaf0ec hat 5,4:1.

**M2: Die Überschriften der Pass-Abschnitte verlieren ihren Fokusrahmen**
- Stelle: In `/home/user/wunderkompass/app/pass-atlas.css:72` ist aus der Regel `.passport-atlas :is(button,…,h3):focus-visible` die Angabe `outline` entfernt worden.
- Folge: Jetzt gilt die Ruhe-Regel `/home/user/wunderkompass/app/kern/kern.css:81` (`h3[tabindex="-1"]…{outline:none}`). Vorher schlug die Pass-Regel mit Spezifität (0,3,0) sie (0,2,1).
- Fall: Im Pass mit Tab auf „Lernwege“ und Enter. Die Seite fokussiert `h3.pass-section-title` (tabIndex −1, `:focus-visible`), aber es ist kein Rahmen zu sehen.
- Test: `/home/user/wunderkompass/tests/browser/pass-atlas.mjs:81` → `keyboardRing(heading,'section heading …')` wird bei 320 und 1440 px rot.
- Vorschlag: `.passport-atlas .pass-section-title:focus-visible{outline:3px solid var(--kern-petrol);outline-offset:2px}` in kern.css oder pass-atlas.css aufnehmen. Den Test nicht abschwächen: Der Rahmen zeigt Kindern, wohin der Sprung ging.

**M3: Die Themenkachel nach „Zurück“ (Tippen) hat keinen Rahmen mehr**
- Stelle: In `/home/user/wunderkompass/app/foundation.css` ist `.world-view .world-topic-tile:focus{outline:3px …}` samt der Regel für erzwungene Farben gelöscht. Das war bewusst `:focus` und nicht `:focus-visible`.
- Fall: 320 px mit Touch. Orca antippen, dann „zur Auswahl“ antippen. Die App fokussiert die Kachel per Skript. Nach einem Tippen passt `:focus-visible` in Chromium nicht, also kein Rahmen. Kinder sehen nicht mehr, von welcher Karte sie kamen.
- Test: `/home/user/wunderkompass/tests/browser/learning-navigation.mjs:66` meldet „actual returned reading card has a visible focus indicator“. Die Prüfung läuft über `learning-corrections.mjs:27` (`touch:width===320`) und `native-world-selection-return.mjs:21` in der vollen Suite `journeys`, die der Bauplan Punkt 8 laufen lässt. Ich rechne fest mit Rot, ausgeführt habe ich es nicht.
- Vorschlag: Die Regel mit 3 px Petrol und 2 px Abstand wieder aufnehmen. `book.css:4` behält die gleiche Idee (`[data-route-focus]:focus`) ja auch.

### Soll

**S1: `bausteineUeberall` misst nicht unbedingt im genannten Bereich**
- Stelle: `/home/user/wunderkompass/tests/browser/kern-huelle.mjs:90`. `messen` nimmt das erste sichtbare Element der ganzen Seite.
- Fall Pass: Radix blendet den Hintergrund nicht aus, `checkVisibility()` ist dort also wahr. Damit findet `.secondary-button` zuerst „Alle Spiele“ aus dem Spielraum dahinter (`/home/user/wunderkompass/app/game-shell.tsx:15`). Der Knopf im Pass wird nie gemessen.
- Ähnlich bei „Spiel“ und „Reise“: Die Behauptung „in nachgeladenen Bereichen gemessen“ ist dort nicht gesichert.
- Vorschlag: Die Auswahl je Bereich eingrenzen, zum Beispiel `.passport-atlas .secondary-button`, `.wissenskarte .secondary-button`, `.journey-reader .primary-button`, `.world-game-room .speech-button`.

**S2: „Quiz fortsetzen“ bleibt bei 14 px und 44 px**
- Stelle: `/home/user/wunderkompass/app/globals.css`. Aus der alten Regel ist `.saved-quiz{font-size:.875rem;min-height:44px}` allein stehen geblieben. Sie steht nach dem Kern und hat dieselbe Spezifität, gewinnt also.
- Fall: Der Knopf `secondary-button saved-quiz` (`earth-explorer.tsx:296`) ist 14 px und 44 px statt mindestens 16 px und 48 px.
- Vorschlag: Die Regel löschen.

**S3: Die Wortgruppen-Tabs im Wissensbuch sind beim Wählen grün**
- Stelle: `/home/user/wunderkompass/app/globals.css:29` mit `.word-categories [data-state=active]{background:#dff1ec!important;…color:#2f715c!important}`.
- Dazu sind die Tabs 41 px hoch mit 14 px Schrift (`!important`).
- Das widerspricht „Grün nur bei richtig“ und den Tabs `.kind-tab` und `.explore-tabs`, die im selben PR umgestellt wurden.
- Vorschlag: Gewählt in Petrol-zart mit innerem Petrol-Rand, `min-height: var(--kern-tipp)`, Schrift `var(--kern-schrift-klein)`.

**S4: Gewählte und nicht gewählte Wahlknöpfe sehen sich zu ähnlich**
- Betroffen sind sieben Stellen mit `className="secondary-button"` in `.visual-choice`.
- Schrift: Die Regel für `.secondary-button` setzt `font-weight:700` für alle. „Fett = gewählt“ aus `kern.css:166` fällt damit weg.
- Hover: `.secondary-button:not(:disabled):hover` (Spezifität 0,3,0) färbt nicht gewählte Knöpfe beim Darüberfahren Petrol-zart, genau wie gewählte.
- Fall: Mit der Maus über „Modell B“, während „Modell A“ gewählt ist. Beide haben dieselbe Fläche, nur die Randfarbe unterscheidet sie (Grau-grün gegen Petrol, beide 2 px).
- Vorschlag: `.visual-choice button{font-weight:400}` und `.visual-choice button:not([aria-pressed="true"]):hover{background:var(--kern-flaeche);border-color:var(--kern-petrol)}`.

**S5: Regel „Engine-Sonderverhalten“**
- Die Kommentare in `kern-huelle.mjs` (Zeilen 462, 507, 571, 678) und `karte-stufen.mjs:57` und `:135` nennen Firefox- bzw. WebKit-Verhalten.
- Laut CLAUDE.md müssen beide Suiten vor dem Commit einzeln in Firefox und WebKit laufen.
- `fokusRahmen` hängt zusätzlich davon ab, dass `el.focus()` nach einem Tab in jeder Engine `:focus-visible` auslöst. Ob das gelaufen ist, kann ich nicht sehen.

### Kann

- **K1: Schriftgrößen weichen in Laboren und Modellen leicht ab.**
  - `/home/user/wunderkompass/app/article-workshop.css:4` setzt alle Knöpfe in Laboren auf 16 px (Spezifität 0,3,1). Antworten haben dort 16 statt 18 px, Hauptknöpfe 16 statt 17 px.
  - Mit „Größerer Schrift“ setzen `nature-photo.css:2`, `nature-study.css:11`, `research.css:55`, `discovery.css:338` und `guide-dialog.css:18` 20 px mit `!important`. Antworten haben dann 20 statt 21 px, Vorlesen 20 statt 19 px.
  - `world-model.css:5` setzt Knöpfe in `.model-buttons` auf 16 px mit `!important`.
  - Nichts liegt unter 16 px. „Je einmal festgelegt“ ist aber noch nicht erreicht. Gehört vermutlich zu Schritt 5.
- **K2: Erzwungene Farben.** Den Rahmen `4px double` bekommen nur `.quiz-answer`, `.visual-choice button` und `.model-choice` mit `aria-pressed`.
  - Bei den Stufenwahlen (`.journey-levels`, `.research-levels`, `.animal-inquiry-levels`, `.science-thinking-levels`, `.people-evidence-levels`) und bei `.model-chip-row .active` und `.sort-card.active` ist die Auswahl ohne Farbe nicht erkennbar. Das gab es schon vorher.
  - Eine falsche Antwort ohne `aria-pressed` (die meisten Spiele) unterscheidet sich nur durch 3 px statt 2 px Rand.
  - Vorschlag: `button[aria-pressed="true"]` allgemein in die Regel für erzwungene Farben aufnehmen und `.is-incorrect` eine eigene Randart geben.
- **K3: Restliche Fokusrahmen in anderer Größe.** `/home/user/wunderkompass/app/book.css:4` hat noch 2 px mit 4 px Abstand. `.kern-leiste a` mit −3 px ist bewusst so. „3 px und 2 px überall“ stimmt also bis auf diese Stellen.
- **K4: Dialoge auf neuem Grund.** shadcn-Dialoge haben über `bg-background` jetzt #EDF1EA. `text-muted-foreground` (#607981) hat darauf 4,04:1, vorher 4,35:1. Beides liegt unter 4,5:1 (`DialogDescription`, 14 px). Das sollte der `design-pruefer` ansehen.
- **K5: Globus-Knöpfe in alten Farben.** `.spin-button.active` hat grüne Schrift #2d8168, `.orientation-buttons button.active` ist orange, beide in `globals.css:17`. Das ist weder Petrol noch „richtig“.
- **K6: Neuigkeit `neue-farben` übertreibt.** „alle Knöpfe sehen gleich aus“ stimmt wegen K1, K5 und S3 nicht ganz. Die ID ist eindeutig. Der Unit-Test `neuigkeiten.test.mjs` prüft Eindeutigkeit, Reihenfolge, Länge und höchstens 6 Einträge oben. Die Browser-Tests lesen `NEUIGKEITEN` dynamisch. Kein Test erwartet eine feste Anzahl.
- **K7: Bauplan Punkt 6 nur teilweise.** „`lesbarkeit.mjs` prüft die Stufe der großen Schrift“ ist nicht umgesetzt. `bausteine` deckt das für die Bausteine mit festen Werten ab, aber nur je ein Element pro Bereich.

## Geprüft und in Ordnung
- **Reihenfolge und Spezifität der CSS:** Alle Regeln in `app/**/*.css` und `components/**/*.css` habe ich mit postcss-Skripten im Scratch-Ordner gegen die Bausteine abgeglichen, dazu alle Regeln mit `button` und alle Auswahlzustände mit grünem Farbton. Keine nachgeladene oder spätere Regel überschreibt Farbe oder Rand der Bausteine mit `!important`. Ausnahme ist die bewusst gestaltete `.rate-mal-weiter .speech-button` in `karte.css:160`, die es schon vorher gab.
- **Bewusst behaltene Ausnahmen:** `article-workshop.css:32`, `science-thinking.css:11/13`, `bit-switches`, `layer-button` und `story-stations` sind wie beschrieben.
- **Gelöschte Regeln in globals.css:** regelweise verglichen. Kein Abstand, keine Breite und kein Flex-Layout fehlt; Lage-Regeln wie `.chapter-actions>button` und `.pass-footer .primary-button{width:100%}` bleiben.
- **Deaktivierte Antworten:** `button:disabled{opacity:.65}` verliert gegen `.quiz-answer.is-correct` und gegen `.quiz-answer:disabled:not(…)`.
- **Kontraste nachgerechnet:**

  | Farbe | auf | Kontrast |
  |---|---|---|
  | Petrol | Papier | 5,46:1 |
  | Weiß | Petrol | 6,24:1 |
  | Rand | Papier | 3,2:1 |
  | leise Tinte | Papier | 5,81:1 |
  | Tinte | Falsch-zart | 11,15:1 |

- **Tests:** `karte-stufen.mjs:138` (`rgb(248, 231, 225)`) und die Werte in `kern-huelle.mjs` passen zu `kern.css`. Andere Tests mit festen Farbwerten für Knöpfe oder Fokus habe ich nicht gefunden. `wissenskarte.mjs` (Antworten nach dem Tippen, Deckkraft 1, mindestens 4,5:1) und `bleibtGroesser` (Frage 21/24 px gegen Antwort 18/21 px) passen. `journey-sources.mjs` (18,4 px) passt, weil `.large-reading … .journey-source` erhalten ist.
- **Pass, IDs und Offline:** Der Diff berührt keinen Speicher, keine ID, kein `tests/fixtures/` und keinen Service Worker; es gibt keine neuen Dateien. `index.html` ändert nur die Beschreibung.
- **Ausgeführt:** `pnpm test` (556 von 556 grün), `pnpm run lint` (grün), `pnpm run typecheck` (grün), `git diff --check` (sauber), `node --test tests/neuigkeiten.test.mjs` (grün).

## Nicht geprüft
- Keinen Browser-Test laufen lassen, keinen Build und keinen Server gestartet. M1 bis M3 sind aus dem Code abgeleitete Vorhersagen, ebenso ob `kern-huelle` in Firefox und WebKit grün ist.
- Das Größenbudget (`entryCssGzipBytes`) nicht gemessen.
- Kein Bild angesehen: Umbrüche bei 320 px durch 17 px Schrift statt 14 px (z. B. `.chapter-actions`, `.reader-toolbar`, `.journey-outline>.secondary-button`, `.quiz-aside`) bleiben für den `design-pruefer`.
- `components/ui/*.tsx` (Tailwind-Ringe) nur gelesen, nicht im Detail bewertet.
