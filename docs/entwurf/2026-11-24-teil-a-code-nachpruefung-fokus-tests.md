# Code-Nachprüfung der Fokus-Tests (24.11.2026)

Bericht des Helfers `code-pruefer` vom 24.11.2026, wortgetreu gesichert. Auftrag: Commit `1b87dd8` („Fokus-Tests prüfen am Ende des Klicks“) nachprüfen, also die Umsetzung seiner drei Befunde aus der [Code-Prüfung zu flushSync](2026-11-24-teil-a-code-pruefung-flushsync.md): Bau von `FOKUS_NACH_KLICK`, mögliche falsche rote oder grüne Läufe, Kommentare und Entscheidungsliste. Was daraus umgesetzt wurde, steht in der [Entscheidungsliste Teil A](2026-11-23-teilschritt-3-teil-a-entscheidungen.md), Abschnitt „Dritter später Fund“.

---

**Ergebnis:** Bereit. `FOKUS_NACH_KLICK` ist richtig gebaut. Ich habe weder einen falschen roten noch einen falschen grünen Lauf gefunden, der heute eintreten kann. Kommentare und Entscheidungsliste stimmen; es bleiben drei kleine Hinweise.

## Antworten auf deine drei Fragen

**1. Ist der Lauscher richtig gebaut?**
- **Reihenfolge:** Der Lauscher steht auf `window` in der normalen (Bubble-)Phase. Reacts `onClick` hängt am Wurzelknoten der App bzw. am Portal-Knoten des Pass-Dialogs, und `window` kommt immer zuletzt. Der Weg des Ereignisses steht schon zu Beginn fest. Darum erreicht der Klick `window` auch dann, wenn der gedrückte Knopf („Zurück zu Entdecker“, ein Stufenknopf) während `flushSync` entfernt wird.
- **Gleiche Aufgabe:** Ein neues Bild (`requestAnimationFrame`) kann nie zwischen Reacts Lauscher und dem auf `window` laufen; beide gehören zur selben Aufgabe.
- **Alle Eingabewege:** Das gilt für `click()`, für `tap()` und für Enter auf einem `<button>`. Enter löst ein echtes `click` aus. Bei echten Eingaben laufen die Microtasks (auch der Radix-MutationObserver) nach Reacts Lauscher und vor dem auf `window`. Damit stimmt die Aussage im Kommentar.
- **Kein Abbruch unterwegs:** In `app/`, `components/` und `lib/` ruft niemand `stopPropagation` auf.
- **Falscher roter Lauf, alle genannten Fälle:**
  - Ein späterer Klick: Zwischen dem entscheidenden Klick und der Prüfung gibt es an keiner Stelle einen weiteren Klick, nur `waitFor`/`expectText`.
  - Ein Klick ohne Fokuswechsel: unschädlich, festgehalten wird einfach `activeElement`.
  - Neuaufbau und `isConnected`: Er würde nur rot, wenn „Ändern“ nach dem Klick noch einmal ersetzt wird. Dann wäre der Fokus wirklich verloren, also ein berechtigtes Rot. Laut Code wird „Rate mal!“ nach dem Wechsel nicht erneut eingehängt; das Speichern beim Einhängen zeichnet nur neu.
  - Neuladen: Das Init-Skript läuft nach `reload` neu, der Wert ist dann leer. Zeile 86 liegt nach einem eigenen Klick auf „Zurück zu Entdecker“, ist also frisch.

**2. Kann ein alter Wert einen falschen grünen Lauf erzeugen?**
Heute nicht. Vor jeder Prüfung wird zuerst auf eine sichtbare Änderung gewartet: neue Stufe, neue Frage oder `detached`. Diese Änderung entsteht nur in einem `onClick` (`waehle`, `onJa`, `onNein`). Ist sie da, lief auch der Lauscher auf `window` für genau diesen Klick.
- Geprüft an allen Stellen: `karte-stufen.mjs:69`, `:78`, `:86`, `:98`, `:128`, `:133`, `:160` und `pass-spielstaende.mjs:149`, `:159`.
- Nachgerechnet, welcher Fall wo greift:
  - Die Experte-Karte `animal-african-savanna-elephant` wechselt von `:rate-1` auf `:rate-4`. Das ist der Neuaufbau.
  - `animal-lion` zeigt auf Profi dieselbe Frage. Dort bleibt der alte Knopf.

**3. Stimmen Kommentare und Entscheidungsliste?**
Ja.
- `harness.mjs:146-148`, `karte-stufen.mjs:41-45`, `pass-spielstaende.mjs:146-148` und `:158` sowie `app/kern/stufen-wahl.tsx:20-22` passen zum Code.
- **Befund 2:** Die Aussage stimmt. In `waehle` hängt der Ort am alten „Ändern“. Wird die ganze Karte neu eingehängt, findet `knopf.closest(...)` auch später ausgewertet nur den alten, abgehängten `article`. Wird nur „Rate mal!“ neu aufgebaut, findet es gar keinen, und die Suche fällt auf das ganze Dokument zurück. Bei `onJa` (`artikel.current`) würde eine Funktion helfen; das behauptet die Liste aber auch nicht.
- **Befund 3:** Die Zuordnung stimmt: Experte-Schritt = Neuaufbau, `profiOhneProfiFragen` = alter Knopf bleibt.

## Befunde

1. **Klein: Ein abgebrochener Klick würde einen alten Wert stehen lassen.** Fundstelle: `/home/user/wunderkompass/tests/browser/harness.mjs:149`. Heute stoppt niemand das Ereignis. Täte es später ein Handler, bliebe der Wert vom vorigen Klick stehen.
   - Konkreter Fall in `pass-spielstaende.mjs:149`: Der vorige Tipp (Experte) hat den Fokus schon auf genau dieses „Ändern“ gelegt. Die Prüfung wäre dann grün, ohne etwas zu messen.
   - Vorschlag (zwei Zeilen): zusätzlich `window.addEventListener('click', () => { window.__fokusNachKlick = null; }, true)`. Die Capture-Phase auf `window` läuft zuerst und setzt den Wert zurück; ein abgebrochener Klick gibt dann ein klares Rot.

2. **Klein: Der Test prüft das Verhalten, nicht den Zweig.** Fundstelle: `/home/user/wunderkompass/tests/browser/karte-stufen.mjs:97-98`. Der Kommentar sagt, der Fokus gehe auf den *alten* Knopf. `fokusAuf` prüft aber nur, ob er auf irgendeinem „Ändern“ liegt. Ginge der Zweig `knopf?.isConnected` verloren, bliebe der Test grün, weil `querySelector` dasselbe Element findet. Für Kinder ist das gleichwertig.
   - Vorschlag: entweder den Kommentar weicher fassen („Der Fokus bleibt auf ‚Ändern‘“) oder vorher das Element festhalten und danach auf Gleichheit prüfen. Kein Muss.

3. **Klein, alt (nicht aus diesem Commit):** `/home/user/wunderkompass/tests/browser/pass-spielstaende.mjs:151`. Dort steht „Umschalt+Tab wandert“, der Code drückt aber `Tab` (Zeile 155, von Entdecker zu Profi). Vorschlag: Kommentar auf „Tab wandert“ ändern.

## Geprüft und in Ordnung

- `git show 1b87dd8` ganz.
- `stufen-wahl.tsx` ganz; `wissenskarte.tsx:150-210` (StufenWahl steckt im `kopf` der geschlüsselten RateMal, `onJa`/`onNein`); `stufen-vorschlag.tsx` (nur `onClick`).
- `karte-stufen.mjs:12-160`, `karte-hilfen.mjs` (`stufeWaehlen`, `stufenWahl`), `pass-spielstaende.mjs:86-170`.
- Die Entscheidungsliste, Abschnitt „Dritter später Fund“, und mein früherer Bericht.
- Die Testkarten mit Node aus `karte-hilfen.mjs` nachgerechnet.
- Suche nach `stopPropagation` und nach `click`-Lauschern in `app/`, `components/` und `lib/`: keine Treffer.

## Nicht geprüft

- Keine Browser-Suiten, kein Build, keine Unit-Tests (wie gewünscht). Die Aussagen zur Reihenfolge in Firefox und WebKit stammen aus der Analyse.
- Die Gegenprobe mit altem Code ist nur für Chromium und WebKit belegt, nicht für Firefox.
- Nicht nachgemessen, ob React 19 den Fokus-Effekt beim Öffnen der Stufenwahl schon im Klick ausführt. Für das Ergebnis spielt das keine Rolle, weil immer der zweite Klick zählt.
