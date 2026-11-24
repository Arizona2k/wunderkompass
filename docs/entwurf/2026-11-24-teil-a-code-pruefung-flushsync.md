# Code-Prüfung zur Fokus-Korrektur mit flushSync (24.11.2026)

Bericht des Helfers `code-pruefer` vom 24.11.2026, wortgetreu gesichert. Auftrag: Commit `0322422` („Stufenwechsel mit flushSync …“) im Zusammenhang mit `9b74f99` und `614d027` prüfen (flushSync in Klick-Handlern, neue Stufenwahl im DOM, Pass/IDs/Links, strenge Fokus-Tests, Komplexität). Was daraus umgesetzt wurde, steht in der [Entscheidungsliste Teil A](2026-11-23-teilschritt-3-teil-a-entscheidungen.md), Abschnitt „Dritter später Fund“.

---

**Ergebnis:** Der Stand ist bereit. Ich habe keinen Fehler gefunden, der Fortschritt, Links oder den Fokus gefährdet. Es bleiben nur zwei kleine Verbesserungsvorschläge.

Geprüft habe ich Commit `0322422` mit `9b74f99` und `614d027` auf `claude/trusting-galileo-ck3o23`. `pnpm run typecheck` und `pnpm run lint` sind grün.

## Antworten auf die fünf Fragen

**1. Ist `flushSync` korrekt und sicher?**
Ja. `flushSync` wird nur an drei Stellen aufgerufen, alle in `onClick`:
- `waehle`: die Stufenknöpfe und „Zurück zu Entdecker“ (`/home/user/wunderkompass/app/kern/stufen-wahl.tsx:44`, `:49`)
- `onJa` und `onNein` des Vorschlags (`/home/user/wunderkompass/app/kern/karte/wissenskarte.tsx:202`, `:203-207`)

Enter und Leertaste lösen bei `<button>` ein `click` aus und landen im selben Handler. Weitere Aufrufer gibt es nicht:
- `stufeWechseln` wird nur in diesen beiden Dateien benutzt.
- `StufenWahl` steht nur in `wissenskarte.tsx:198` und `progress-panel.tsx:20`.
- Kein Code ruft per `.click()` oder `dispatchEvent` einen dieser Knöpfe auf.

`flushSync` läuft also nie beim Zeichnen oder in einem Effekt. Das `setWahl` und `schliessen()` beim Zeichnen von `Kartenkoerper` sind Aktualisierungen in derselben Komponente. React erledigt sie im selben Durchgang innerhalb von `flushSync`. Hinweis: Eine Warnung gäbe React nur im Entwicklungsmodus aus; die Browser-Tests laufen auf dem Produktionsbuild und würden sie nicht sehen. Nach meiner Analyse entsteht sie aber nicht.

**2. Steht nach `flushSync` schon die neue Stufenwahl im DOM?**
Ja. Die Kette läuft komplett synchron ab, bevor `flushSync` zurückkehrt:
- `local.stufe` → `update` → `emit` → `useSyncExternalStore` plant eine sofortige Aktualisierung.
- `setOffen(false)`, `schliessen()` und das `setWahl` beim Zeichnen kommen im selben Durchgang mit.
- Die neue `RateMal` (`key={frage.id}`) speichert beim Einhängen über `useSavedGame` (`/home/user/wunderkompass/app/saved-games.tsx:24`). Das löst nur ein weiteres Neuzeichnen aus, keinen neuen Schlüssel. `wahl.id` ist Zustand, `RateMal` wird also nicht noch einmal neu eingehängt.
- `fokus={weitergeblaettert}` ist nach dem Wechsel `false`. Der Fokus-Effekt in `rate-mal.tsx:60` greift daher nicht ein, auch nicht nach vorherigem „Noch eine Frage“.

Falsche Fokusorte habe ich nicht gefunden:
- Je `article.wissenskarte` gibt es genau eine `.stufen-wahl`.
- `closest('article, …')` findet die Karte selbst, auch eingebettet in einer Lernroute (`world-reader.tsx:16`, eine Karte je Station).
- Im Pass wird `StufenWahl` nicht neu eingehängt. Dort greift `knopf.isConnected` und der Fokus geht auf das alte „Ändern“.
- Radix stört nicht: `handleMutations` greift erst in der nächsten Microtask ein und nur, wenn der Fokus auf `<body>` liegt; dann steht er schon auf „Ändern“. `handleFocusOut` ignoriert `relatedTarget === null`.
- Reacts Fokus-Wiederherstellung nach dem Neuzeichnen betrifft nur Elemente, die noch im Dokument sind. Der gedrückte Knopf ist entfernt.

**3. Ändert sich etwas an Pass, IDs oder Links?**
Nein. Keine Änderung an Speicher, Schlüsseln, `mitStufe`, `local-progress-store.ts`, IDs oder Hash-Links. Es geht nur um die Reihenfolge von Fokus und Zeichnen.

**4. Können die strengen Tests flackern?**
Einen falschen roten Lauf erwarte ich nicht. Sichtbare Änderung und Fokus entstehen jetzt in derselben JavaScript-Aufgabe, nämlich im Klick-Handler. Sobald `waitFor` oder `expectText` die Änderung sieht, ist der Fokus schon gesetzt. Das gilt genauso für `tap()`, das synthetische `click` und die Tastatur (Enter auf dem Stufenknopf im Pass). Unterschiede zwischen den Browsern spielen dafür keine Rolle. Die Wartebedingungen hängen nur am Klick: „Stufe: …“ in der Zeile, `detached` des Vorschlags oder des Zurück-Knopfs, die Profi-Frage statt der Entdecker-Frage. Eine Grenze siehe Befund 1.

**5. Unnötige Komplexität?**
Nein. Der Code ist kürzer und klarer als in `614d027`: Der Schritt im nächsten Bild und der vorgezogene `knopf.focus()` aus `9b74f99` sind weg, die Regel steht an einer Stelle.

## Befunde

1. **Niedrig: Der strenge Test kann den alten Fehler übersehen.** Fundstelle: `/home/user/wunderkompass/tests/browser/karte-stufen.mjs:44-47` und `/home/user/wunderkompass/tests/browser/pass-spielstaende.mjs:147`, `:156`. „Sofort prüfen“ heißt hier: nach einem Hin und Her zwischen Playwright und Seite. Fiele der Code auf „Fokus erst im nächsten Bild“ zurück, liefe das Bild auf einem schnellen Rechner meist vor dem `evaluate`, und der Test wäre trotzdem grün. Rot wurde er laut Commit nur mit 150 ms Verzögerung je Bild. Ein falscher roter Lauf ist nicht möglich, ein falscher grüner schon.
   - Vorschlag: Vor dem Tipp in der Seite einen Klick-Lauscher auf `window` setzen, der am Ende des Klicks festhält, wo der Fokus liegt, z. B. `addEventListener('click', () => { window.__fokusNachKlick = document.activeElement?.className; }, {once: true})`. `window` kommt nach Reacts Lauscher am Wurzelknoten, und der Weg des Ereignisses steht schon vor dem Entfernen des Knopfs fest. Das prüft genau „Fokus noch im Klick“, ohne Abhängigkeit vom Takt. Alternativ den Stresslauf `QA_FRAME_DELAY_MS` aus dem BACKLOG umsetzen.

2. **Niedrig: Der Ort für die Fokussuche wird vor dem Wechsel festgelegt.** Fundstelle: `/home/user/wunderkompass/app/kern/stufen-wahl.tsx:33` (`knopf?.closest(...)`) und `/home/user/wunderkompass/app/kern/karte/wissenskarte.tsx:202` (`artikel.current`). Heute ist das in Ordnung, weil die Karte nur `key={topic.id}` trägt (`world-reader.tsx:14`, `:16`, `wissenskarte.tsx:53`). Würde eine spätere Änderung die ganze Karte bei einem Stufenwechsel neu einhängen (z. B. die Stufe im `key`), sucht `querySelector` im abgehängten alten Element. `focus()` täte dann still nichts, und der Fokus fiele auf `<body>`.
   - Vorschlag: `ort` als Funktion übergeben, die erst nach `flushSync` ausgewertet wird (`() => artikel.current`). Oder einen Satz im Kommentar ergänzen, dass die Karte dafür nicht neu eingehängt werden darf.

3. **Niedrig, nur Testabdeckung: Ein Weg in `stufeWechseln` ist nicht abgedeckt.** Auf der Karte prüft kein Test den Fokus für den Fall, dass die Frage gleich bleibt (Zweig `knopf?.isConnected`). Ein Beispiel ist der Wechsel auf Experte ohne Experte-Frage in `karte-stufen.mjs:67-69`. Im Pass ist dieser Zweig abgedeckt.
   - Vorschlag: Nach Zeile 69 `await fokusAuf(page, AENDERN, …)` ergänzen.

## Geprüft und in Ordnung

- Die Diffs aller drei Commits.
- Der Code um die Änderung herum:
  - `/home/user/wunderkompass/app/kern/stufen-wahl.tsx` (ganz)
  - `/home/user/wunderkompass/app/kern/karte/wissenskarte.tsx` (Zeilen 60-260)
  - `/home/user/wunderkompass/app/kern/karte/rate-mal.tsx` (ganz)
  - `/home/user/wunderkompass/app/kern/stufen-vorschlag.tsx`
  - `/home/user/wunderkompass/app/use-local-progress.ts`
  - `/home/user/wunderkompass/app/local-progress-store.ts` (`update`/`emit`)
  - `/home/user/wunderkompass/app/saved-games.tsx`
  - `/home/user/wunderkompass/app/world-reader.tsx` (Schlüssel und Einbettung)
  - der Einbau in `/home/user/wunderkompass/app/progress-panel.tsx` und `earth-explorer.tsx`
- Radix FocusScope im installierten Paket (`handleFocusOut`, `handleMutations`), React-DOM 19.2.8.
- Alle Aufrufer von `onStufe`, `waehle`, `stufeWechseln`, `flushSync` und `.stufen-wahl`.
- Die Tests `karte-stufen.mjs` (Zeilen 1-200), `karte-hilfen.mjs` (`stufeWaehlen`, `stufenWahl`) und `pass-spielstaende.mjs` (Zeilen 110-175).
- `typecheck` und `lint` grün.

## Nicht geprüft

- Keine Browser-Suiten laufen lassen (`karte-stufen`, `pass-spielstaende`, `--suite full core`), auch nicht die Stressprobe aus dem Commit. Die Aussagen zu Firefox und WebKit beruhen auf der Analyse des Ablaufs, nicht auf eigenen Läufen.
- Kein `pnpm test` und kein Build.
- Nicht nachgemessen, ob `:focus-visible` nach Enter in allen drei Browsern gesetzt wird. Das prüft nur der bestehende Test.
- Bildschirmleser und echte iOS-Geräte nicht geprüft.
