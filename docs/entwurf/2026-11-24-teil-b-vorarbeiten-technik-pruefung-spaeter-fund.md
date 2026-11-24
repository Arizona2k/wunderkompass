# Teil B, Vorarbeiten: Technik-Prüfung nach dem späten Fund (24.11.2026)

Helfer `technik-pruefer` (sonnet / high), wie `CLAUDE.md` es nach einem späten Fund verlangt. Stand: Branch `claude/tender-mccarthy-qz5aob`, PR [#110](https://github.com/Arizona2k/wunderkompass/pull/110), Commit `1ca1d79` plus die Korrektur unten.

## Der Fund

- **Wo:** CI-Lauf 45397127026 auf GitHub, Job „Engine-Schnellprüfung (firefox)“, Suite `kern-huelle`, Teil `neuigkeiten`.
- **Was:** Nach dem Klick auf den Link „Was ist neu?“ im Fuß kam die Überschrift `#updates-title` nicht (30 s). Derselbe Code war im selben Job 3 Minuten vorher grün und lokal 4-mal grün.
- **Nur im Test.** Kinder trifft das nicht (siehe unten, „Ursache in der App“).

## Ursache

Nachgestellt mit einem Versuchsskript. Es verzögert Programmteile und schreibt mit, wann gedrückt und losgelassen wird:

- `neuigkeiten` klickte gleich nach dem Öffnen der Seite (`withPage`, `ready()`) auf den Fuß-Link.
- Nachgeladene Teile der Startseite kommen oft erst danach und schieben den Fuß um über 1000 px nach unten (lokal bei 1440 px: von y 1817 auf 2941, etwa 300 ms nach dem Laden). Dazu gehören `DiscoveryActivities` mit `fallback={null}` in `app/earth-explorer.tsx`, die Tagesentdeckung und die Bilder.
- Fällt das zwischen Drücken und Loslassen, landet das Loslassen auf einem Bild. Der Klick geht dann an den gemeinsamen Vorfahren (`div.earth-app`), es wird nicht navigiert, und Playwright meldet trotzdem Erfolg. Grund: Playwright 1.65.1 prüft das Trefferziel nur beim ersten Ereignis, dem Drücken (`expectHitTarget` in `playwright-core/lib/coreBundle.js`).
- **Beleg:** Mit 1500 ms zwischen Drücken und Loslassen verpufften 8 von 8 Klicks. Wartete der Test vorher, bis alle Ladeanfragen fertig waren, verpuffte keiner von 8.
- `CLAUDE.md` verlangte schon, vor einem Wechsel innerhalb der App mit `ladeanfragen` zu warten. Der Test hielt sich nicht daran.

## Befunde des Helfers

1. **Weitere Stellen.** Die Korrektur ist richtig. Sichere weitere Treffer gibt es nicht, aber zwei Stellen mit schwachem Restrisiko:
   - `discovery-central.mjs:356`: Fuß-Link direkt nach `goBack`. Die Startseite wird neu eingehängt, die Bilder laden danach.
   - `discovery-central.mjs:374`: derselbe Klick nach dem Pass-Dialog. Kleineres Risiko, weil viel Zeit vergangen ist.
   - **Kein Treffer:** `audit-ui.mjs` (Dialog-Schritte mit `settle` davor), `kern-huelle.mjs` `dialogUeberLeiste` (läuft nach `fuss`), `zurueckOhneFokus` (`element.click()`), Kopf und Bereichsleiste (fest).
   - **Nicht erschöpfend geprüft:** rund 590 Klicks in 91 Dateien. Klicks auf nachgeladene Teile anderer Ansichten (Reisen, Welt, Labore) sah der Helfer nicht einzeln durch.
2. **Wohin gehört die Absicherung?**
   - Empfohlen: ein kleiner Helfer `klickNachRuhe(locator)` in `tests/browser/harness.mjs`.
   - Nicht in `withPage`: Jeder Aufruf kostete mindestens 500 ms, und die meisten Tests klicken gar nicht in den Fuß.
   - Die Ruhezeit von 500 ms deckt Reacts Sammelzeit von 300 ms ab.
   - Die Ursache liegt teils in der App: Der Fuß springt um über 1000 px, auch auf einem langsamen Handy. Das gehört ins BACKLOG (Platzhalter mit fester Mindesthöhe).
3. **Unterlagen.**
   - `CLAUDE.md` (Abschnitt „Seitenwechsel im Test“) und der Kommentar über `ladeanfragen` begründeten das Warten nur mit Abbrüchen bei Seitenwechseln. Ergänzen: auch vor einem echten Mausklick auf etwas, das nachgeladene Teile noch verschieben können.
   - Die Kurzform `ladeanfragen(page)()` ist erlaubt, stand aber nicht im Kommentar.
   - Der Fund gehört im CHANGELOG unter „Messwerte“ zu den späten Funden.

## Was daraus wurde

| Befund | Umgesetzt |
|---|---|
| 1, Fuß-Klicks | Alle fünf echten Mausklicks in den Fuß nehmen `klickNachRuhe`: `kern-huelle.mjs` (`fuss`, `neuigkeiten`), `research.mjs`, `discovery-central.mjs` (beide Stellen). |
| 2, Helfer | `klickNachRuhe(locator)` in `tests/browser/harness.mjs`. Kein Warten in `withPage`. |
| 2, App | BACKLOG, Phase 1: Platzhalter für die nachgeladenen Teile der Startseite (`design-pruefer` misst den Sprung). |
| 3, Unterlagen | `CLAUDE.md` „Seitenwechsel im Test“ und der Kommentar über `ladeanfragen` ergänzt, Kurzform genannt. CHANGELOG: später Fund unter „Messwerte“. |

## Ursache in der App (für das BACKLOG)

Kinder trifft das nur selten: Ein Kind drückt und lässt kurz los. Rutscht der Fuß genau dazwischen weg, verpufft ein Tipp, dann tippt es noch einmal. Ärgerlich ist eher, dass der Fuß auf einem langsamen Handy erst spät an seinen Platz springt. Gemessen ist das am Handy noch nicht.
