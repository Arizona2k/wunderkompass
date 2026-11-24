# Code-Nachprüfung des Design-Commits Teil A (Bericht des `code-pruefer`, 24.11.2026)

Gesichert, wie geliefert (opus/high). Geprüft: Commit `00feeff` („Design-Prüfung Teil A: Stufenwahl als eigener Kasten, Vorschlag vor „Noch eine Frage““). Bewertung und Umsetzung: Abschnitt „Design-Prüfung“ in [der Entscheidungsliste](2026-11-23-teilschritt-3-teil-a-entscheidungen.md).

---

**Ergebnis:** Der Commit `00feeff` ist bereit. Ich habe nichts Hohes oder Mittleres gefunden, nur drei niedrige Hinweise und eine Testlücke. Pass, IDs, Hash-Links und Tests sind nicht betroffen.

**Deine Fragen**

1. **Wird der Vorschlag sicher sichtbar?** Ja. In `rate-mal.tsx:70-77` ruft `waehle` erst `setAntwort` und dann `onAntwort`/`merke` auf. Beide Änderungen landen im selben Klick-Durchlauf, also erscheinen Rückmeldung und Vorschlag im selben Bild. Das gilt nach drei richtigen ersten Antworten (Rückmeldung richtig) und nach zwei falschen (Rückmeldung „Noch nicht ganz“).

2. **Vorschlag gehalten, aber unsichtbar?** Das passiert nur nach „Noch einmal raten“ (`rate-mal.tsx:120`): `antwort` wird null, die Rückmeldung schließt, `vorschlag` bleibt im State. Bei der nächsten Antwort auf dieselbe Frage erscheint er wieder; diese Antwort zählt nicht neu, weil sie nicht die erste ist. Das ist harmlos, das Kind verpasst nichts. Vorher blieb der Vorschlag dabei stehen, jetzt verschwindet er kurz.
   - „Noch eine Frage“ (`wissenskarte.tsx:105`) und ein Stufenwechsel (`wissenskarte.tsx:94-97`) rufen `schliessen()` auf. Der Vorschlag wandert also nicht auf eine andere Frage und taucht nicht in einer gespeicherten Rückmeldung wieder auf.
   - Nach einem Reload ist der State leer.

3. **Fokus:** Funktioniert weiter.
   - „Ja …“: `schliessen` und `onStufe` lassen „Rate mal!“ mit neuer Frage neu aufbauen. `fokusAufStufenWahl` sucht „Ändern“ danach per `requestAnimationFrame` neu.
   - „Nein“: Der Vorschlag verschwindet, die Rückmeldung bleibt. Der Fokus geht per `requestAnimationFrame` auf `section.rate-mal`.
   - Dass die Knöpfe jetzt in der Live-Region stehen, stört den Fokus nicht. `inert` greift nur, solange die Rückmeldung ausblendet (`learning-motion.tsx:22`), und nach dem Klick sind die Knöpfe ohnehin weg.

**Befunde (alle niedrig)**

1. **Mehr Vorlesen** (`app/kern/karte/rate-mal.tsx:112`, `app/learning-motion.tsx:22`)
   - Was passiert: `role="status"` hat implizit `aria-atomic="true"`. Bei jeder Änderung der Rückmeldung wird darum alles neu vorgelesen, jetzt auch Vorschlagstext und Knopfnamen.
   - Fall: Profi, zweite falsche erste Antwort, Vorschlag „Ganz schön knifflig …“ erscheint. Wählt das Kind danach noch eine falsche Antwort, hört es wieder „… Ganz schön knifflig. Willst du eine Stufe leichter spielen? Ja, leichter spielen Nein, ich bleibe“. Vorher war der Vorschlag eine eigene Region und wurde nicht wiederholt.
   - Auch das Entfernen nach „Nein“ kann bei manchen Kombinationen (z. B. VoiceOver/Safari) die Region neu ansagen, neben der Fokusansage „Rate mal!“. Ich habe das nicht mit Screenreader geprüft.
   - Vorschlag: so lassen; bei der nächsten Screenreader-Teilprüfung ansehen. Falls es stört, Rückmeldungstext und Vorschlag in eigene Regionen trennen (`aria-live` nur auf Strong und Text).
   - Ob die Region beim ersten Erscheinen überhaupt angesagt wird, ist unverändert: Die Rückmeldung wird mit Inhalt zusammen eingefügt. Das war vorher beim eigenen `role="status"` genauso, also kein Rückschritt.

2. **Titel mit `aria-hidden`** (`app/kern/stufen-wahl.tsx:39-40`)
   - Vertretbar: Die Gruppe hat ihren Namen „Stufe wählen“, Screenreader verlieren nichts.
   - Sauberer wäre `aria-labelledby` auf den Titel (zweite `useId`, `aria-hidden` und `aria-label` weg). Dann sind Gesehenes und Gehörtes gleich, und der Titel ist beim zeilenweisen Lesen nicht unsichtbar.
   - Dann müssen `tests/browser/pass-spielstaende.mjs:126` und `tests/browser/karte-hilfen.mjs:245` mitgeändert werden: Beide suchen `getByRole('group', {name: 'Stufe wählen'})`.
   - Wahlfrei.

3. **Testlücke für die neue Stelle** (`tests/browser/karte-stufen.mjs:106` und `:132`)
   - Die Tests suchen `.stufen-vorschlag` irgendwo in „Rate mal!“. Ob er in der Rückmeldung (`getByRole('status')`) und vor „Noch eine Frage“ steht, prüft niemand. Ein Zurückschieben unter die Rückmeldung bliebe grün.
   - Vorschlag: in `vorschlagSchwerer` zwei Zeilen ergänzen. Erstens: `rateMal(page).getByRole('status').locator('.stufen-vorschlag')` hat genau einen Treffer. Zweitens: per `compareDocumentPosition` steht der Vorschlag vor dem Knopf „Noch eine Frage“.

**Geprüft und in Ordnung**
- Den ganzen Diff von `00feeff`, dazu `rate-mal.tsx` komplett, `stufen-vorschlag.tsx`, `stufen-wahl.tsx`, `wissenskarte.tsx` (Zustand und Aufräumstellen mit `schliessen`, Zeilen 84-110 und 186-205) und `LearningFeedback`/`FeedbackFrame`.
- Pass, IDs, Links: keine Änderung an Speicher, Schlüsseln, IDs oder Hash-Links. Der Vorschlag lebt weiter nur im Modul und im State, nie im Pass.
- Tests:
  - `karte-stufen.mjs` (`vorschlagSchwerer`, `vorschlagLeichter`) findet den Vorschlag weiter. Die Prüfung „noch kein Vorschlag nach 1/2 richtigen“ (Zeile 101) prüft weiter echt. Die Fokusprüfungen für Ja/Nein sind unverändert gültig.
  - `pass-spielstaende.mjs:126-133`: Der Titel ist kein Knopf, die Zählung „3“ stimmt also. Die Altersprüfung über den `innerText` von `.stufen-knoepfe` trifft den Titel nicht.
  - `karte-hilfen.mjs:245` ist unverändert gültig.
  - Keine Prüfung abgeschwächt oder entfernt. Andere Tests, die `.lab-feedback` nutzen, betreffen andere Bausteine.
- CSS:
  - Der Fokusrahmen der Vorschlagsknöpfe wird trotz `overflow:hidden` der Rückmeldung nicht abgeschnitten: Er liegt innerhalb der Innenabstände von 16 und 17 px.
  - Die gewählte Stufe ist ohne Farbe erkennbar (Haken und dickerer Rand).
  - Der neue Stufenkasten gilt auch im Pass (`progress-panel.tsx:20`). Das ist vermutlich gewollt, gesehen habe ich es dort nicht.

**Nicht geprüft**
- Kein Browser-Test, kein Build, keine Screenshots (wie gewünscht).
- Keine Screenreader-Prüfung: Ansage und Wiederholung bei Befund 1 sind aus dem Code abgeleitet.
- Den Lauf `--suite full core` habe ich nicht abgewartet.
