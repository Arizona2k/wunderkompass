# CHANGELOG

Was sich geändert hat, in einfachen Worten. Neueste Einträge oben.
Der Verlauf vor dem 21.11.2026 steht im alten Stand: `git show b53f75f:CHANGELOG.md`.

## 25.11.2026 – Kurze Auflösungen, Tipps in Kinderton, „Richtig!“ gleich ganz im Bild

Nach der [Endfassung](docs/entwurf/2026-11-25-spiel-aufloesung-endfassung.md) (Entwurf `karten-autor`, geprüft von `fakten-pruefer` in zwei Runden, `kinder-redaktion`, `stufen-pruefer`).

- **„Wer war das?“:** Nach „Richtig!“ steht nicht mehr der ganze Kartentext (im Schnitt 877 Zeichen Erwachsenentext), sondern eine kurze Auflösung mit etwas Neuem über die Person, auf allen Stufen (`AUFLOESUNG` in `app/world-game-support.mjs`).
- **Tipps in Kinderton** für Personen (Profi, Experte), Tierzuhause, Futter, Erfindungen und Früher oder heute. **Eigene Rückmeldungen** nach falscher Antwort bei Personen (Profi, Experte) und bei „Erst in der Zukunft“ (Früher oder heute; der Satz verrät keine Zeit).
- **Rückmeldung im Blick:** Nach jeder Antwort rollt die Seite so, dass „Richtig!“ oder „Noch nicht ganz“ ganz über der unteren Leiste steht; nach „Richtig!“ hat „Nächste Aufgabe“ den Fokus. Ist der Kasten höher als der freie Platz (kleines Handy, große Schrift, lange Erklärung), steht sein Anfang oben und der Fokus liegt auf „Richtig!“; mit Tab holt die Seite „Erklärung vorlesen“ und „Nächste Aufgabe“ über die Leiste (in Firefox nötig). Gilt für alle Welt-Spiele, Kreuz und quer, „Stimmt das wirklich?“ und „Wer lebt wo?“ (`app/kern/spiel-fokus.ts`).
- **Aussehen:** „Richtig!“ und „Noch nicht ganz“ größer als der Text darunter, auch bei großer Schrift; Luft zwischen „Erklärung vorlesen“ und „Nächste Aufgabe“, nebeneinander und untereinander.
- „Was ist neu?“: „„Richtig!“ siehst du jetzt gleich ganz“.
- **Tests:** neue Suite `spiel-fokus` im CI-Satz (360 px mit Touch, 1280 px mit weichem Rollen, 320 px mit großer Schrift und der längsten Erklärung; ohne die Tab-Korrektur in Firefox rot); neue Unit-Tests für Auflösungen und Tipps (`tests/world-game-learning-copy.test.mjs`). Zwei Testhilfen warten jetzt, statt im Augenblick zu fragen (`hilfeOeffnen`, `angezeigteFrage`; [Technik-Prüfung](docs/entwurf/2026-11-25-zeitfehler-browsertests.md), Soll 1 und 2).
- Rest im BACKLOG (Punkt 25, „Auflösung und Rückmeldung, Rest“), als Nächstes: kurze Auflösungen für Technik und die anderen Welt-Spiele.
- **Messwerte:** *Funde vor dem PR:* 28 (Texte 19: fakten-pruefer 5 und 4, kinder-redaktion 6 und 1 beim „Was ist neu?“-Text, stufen-pruefer 3; Einbau 9: code-pruefer 4 (CI-Liste ohne die neue Suite, zufällig kippende Suite, hoher Kasten nie geprüft, Rand des Kastens nicht mitgezählt; der Spieltest fand den hohen Kasten auch), design-pruefer 2 (Knöpfe berühren sich, Überschrift zu klein), spieltester 1 in der Nachprüfung (Firefox: Knopf mit Fokus hinter der Leiste), technik-pruefer 2 (Testhilfen fragen im Augenblick statt zu warten)); *späte Funde:* 1 (Engine-Schnellprüfung in Firefox: Fokusrahmen von „Nächste Aufgabe“ hinter der Leiste, weil die Rollhilfe den Rand der Knöpfe nicht mitrechnete; der Test traf den Fall nur zufällig und stellt ihn seitdem gezielt her, [Technik-Prüfung](docs/entwurf/2026-11-25-spaeter-fund-fokusrahmen.md)); *Dauer:* –.

## 25.11.2026 – „Wer war das?“: eigene Rätsel für alle 36 Menschen

Die Personen-Rätsel nach der [Endfassung](docs/entwurf/2026-11-25-personen-raetsel-endfassung.md) (Abschnitte 7 und 8 gelten vor 1 und 2; [Entscheidungen](docs/entwurf/2026-11-25-personen-raetsel-entscheidungen.md)).

- **Jeder Mensch hat ein eigenes Rätsel** aus zwei oder drei Sätzen, ohne Namensteile und ohne „er“ oder „sie“. Vorher bauten 27 Rätsel sich aus der Karten-Einleitung und verrieten oft das Geschlecht.
- **Entdecker liest nur Satz 1**, und die falschen Namen kommen aus ganz anderen Gebieten (Gebiete und Paarlisten als Daten in `app/world-game-fallen.json`). Neuer Tipp: „Kennst du einen der Namen? Überlege: Hat dieser Mensch so etwas gemacht?“ Nach einer falschen Antwort: „Hat dieser Mensch so etwas gemacht? Schau dir auch die anderen Namen an.“
- **Profi** sieht das ganze Rätsel; eine Falle kommt aus dem Erstgebiet der Person, eine aus Erst- oder Zweitgebiet, eine ist zeitlich nah. Gerechnet sinkt „richtig nur mit dem Gebiet“ von 43 % auf 32 % (Raten: 25 %; nachgerechnet, nicht im Spiel gemessen).
- **Alte gespeicherte Runden** gehen nicht verloren. Passt eine ihrer Fallen nicht zur neuen Entdecker-Regel, zeigt die Runde den ganzen Hinweis, bis eine neue beginnt.
- **Karten:** Einleitungen von Payne-Gaposchkin und Murasaki genauer; tote Links gestrichen (DPMA bei beiden Benz, NBI bei Lehmann, fremde Links bei Goodall und Curie); neue Quellen bei Bell Burnell, Mandela und Leavitt.
- „Was ist neu?“: „Neue Rätsel bei „Wer war das?““.
- Berichte zum Einbau: [Code](docs/entwurf/2026-11-25-personen-raetsel-einbau-code.md), [Fakten](docs/entwurf/2026-11-25-personen-raetsel-einbau-fakten.md), [Kinder-Redaktion](docs/entwurf/2026-11-25-personen-raetsel-einbau-kinderredaktion.md), [Stufen](docs/entwurf/2026-11-25-personen-raetsel-einbau-stufen.md). Rest im BACKLOG (Punkt 25, „Personen-Rätsel, Rest“).
- **Messwerte:** *Funde vor dem PR:* 19 beim Einbau (code-pruefer 4: Test-Variable außerhalb ihres Blocks, alte Runden, toter Rückfallweg, alter Kommentar; fakten-pruefer 5: Einstein-Satz unscharf, tote Links bei Lehmann und Benz, fehlende Belege bei Mandela und Leavitt; kinder-redaktion 4 und 2 beim „Was ist neu?“-Text; stufen-pruefer 2: Franklin neben Hadid, Profi-Fallen bei Franklin zu leicht; Claude 2 über `pnpm test`: Import ohne Dateiendung im Browser-Test, veraltete Exporte; dazu 1 in `offline-cold-full` vor dem PR: Die Offline-Prüfung zählte ein kurz noch sichtbares Spielbrett und lief dann ins Leere, Korrektur im Test, Verwandte sucht der [technik-pruefer](docs/entwurf/2026-11-25-zeitfehler-browsertests.md)). Die Fassungen davor lasen die Helfer in drei Runden (Berichte in der Endfassung). *Späte Funde:* 0 (CI und Engine-Schnellprüfung grün beim ersten Lauf). *Dauer:* rund 2¼ Stunden für den Einbau (ab etwa 09:15 UTC; [PR #117](https://github.com/Arizona2k/wunderkompass/pull/117) gemergt um 11:33 UTC); Entwurf und drei Prüfrunden liefen davor.

## 25.11.2026 – Technik: Speichern bei Fehlern, eine Grenze für Sicherungen, feste Paketversionen

Der Technik-PR nach den beiden Analysen ([Bewertung](docs/entwurf/2026-11-24-analysen-bewertung.md), [Bauplan](docs/entwurf/2026-11-24-technik-pr-bauplan.md)). Für Kinder sichtbar ist fast nichts:

- **Große Sicherungen lassen sich wieder öffnen.** Vorher nahm „Sicherung öffnen“ Dateien bis 2,6 MB an, scheiterte aber nach dem Bestätigen schon ab etwa 2 MB. Jetzt gilt überall dieselbe Grenze.
- **Zwei Meldungen sind klarer** (Kinder-Redaktion): Ist eine Sicherung zu groß, steht da „Diese Sicherung ist zu groß zum Öffnen. Dein Pass auf diesem Gerät bleibt, wie er ist.“ Ist eine heruntergeladene Sicherung sehr groß, sagt die Seite das und rät, den Pass auf diesem Gerät nicht neu zu beginnen.
- Kein Eintrag in „Was ist neu?“: Die Meldungen erscheinen nur im seltenen Fall einer sehr großen Sicherung.

Hinter den Kulissen:

- **Speichern nach Fehlern mit wachsender Pause** (`app/local-progress-store.ts`): Klappt das Speichern in der Datenbank nicht, versucht es die Seite nach 0,2 s, 1 s, 2 s, 4 s … bis höchstens 30 s, statt alle 200 ms ohne Ende. Jede Änderung steht weiter sofort im Browser-Speicher (Journal). Ist auch der voll, bleibt die Pause bei höchstens 2 s, auch wenn er erst während einer langen Pause vollläuft (Code-Prüfung, Soll 1, und Nachprüfung). Kommt man in den Tab zurück, versucht es die Seite sofort; beim Verlassen ohne Pause. Gleiche Fehler lösen keine neue Anzeige aus.
- **Vom Browser geschlossene Datenbank-Verbindung wird neu geöffnet** (Altfehler, Code-Prüfung Kann 1): Vorher scheiterte danach jeder Versuch bis zum Neuladen (z. B. WebKit nach langer Zeit im Hintergrund). Ein später Fehler einer alten Verbindung löscht keine neuere.
- **Eine Grenze in Bytes** (`MAX_IMPORT_BYTES` in `app/progress-storage.ts`) für Dateiauswahl, Wiederherstellen und Export. Wäre eine Sicherung eingerückt zu groß, wird sie kompakt in einer Zeile gespeichert.
- **Neun Paketversionen exakt gepinnt** (vorher mit `^`), genau die Versionen, die das Lockfile schon hatte. Neuer Wächter `tests/pakete.test.mjs`. Der Kommentar in `pnpm-workspace.yaml` stimmt jetzt.
- **Pass-Beleg** nach `CLAUDE.md`: Altpass bei kaputter Datenbank, Sicherung herunterladen und wiederherstellen, Neuladen nach Fehlern, Ablehnung ohne Änderung am Pass (Zustand, Journal, `epoch`), voller Browser-Speicher (auch erst während der Pause), Rückkehr in den Tab, geschlossene Verbindung über Fehler und `onclose` (Unit-Tests `tests/speicher-wiederholung.test.mjs`, `tests/pass-import-grenze.test.mjs`, jeweils mit Gegenprobe gegen den alten Code). Im Browser: `backup` genau an der Grenze (2 600 000 Bytes) in Chromium, Firefox und WebKit, `pass-spielstaende` in Chromium und Firefox.
- Berichte: [Code-Prüfung](docs/entwurf/2026-11-25-technik-pr-codepruefung.md), [Kinder-Redaktion zu den Meldungen](docs/entwurf/2026-11-25-technik-pr-hinweistext-kinderredaktion.md). Rest im BACKLOG (Paket-Wächter für `overrides`, `pagehide` messen, „Später bei Anlass“).
- **Messwerte:** *Funde vor dem PR:* 12 (technik-pruefer im Bauplan 1: Änderungen im Spiel hätten die Wiederholung immer wieder verschoben; code-pruefer 5: 1 Soll und 4 Kann, alle umgesetzt außer dem Wächter für `overrides`; [Code-Nachprüfung](docs/entwurf/2026-11-25-technik-pr-code-nachpruefung.md) 3: Browser-Speicher erst während der langen Pause voll, späte Fehler alter Verbindungen, `onclose` ungetestet, alle umgesetzt; kinder-redaktion 3: Wort passte zu keinem Knopf, Anfang der Meldung, knappe Ablehnung). *Späte Funde:* 0 (CI und Engine-Schnellprüfung grün beim ersten Lauf). *Dauer:* rund 1 Stunde (Beginn gegen 08:50 UTC; [PR #116](https://github.com/Arizona2k/wunderkompass/pull/116) gemergt um 09:49 UTC als `19352b3`).

## 24.11.2026 – Teil B, zweiter Teil: Kreuz und quer und die Klassik-Spiele mit Stufen

Aufgabe 9 von Teil B „Spiele kniffliger“ (PR 2 von 4). Für Kinder sichtbar:

- **Aus der Wissens-Challenge wird „Kreuz und quer“.** Das Spiel startet sofort auf deiner Stufe aus dem Pass, ohne die Auswahl „Leicht, Mittel, Schwer“. Als Experte kommen zuerst die wenigen echten Experten-Fragen (höchstens drei je Runde), dann Profi-Fragen. Das sagt das Spiel auch.
- **„Stimmt das wirklich?“ hat 26 neue Fragen** zu Wetter, Wasser, Meer, Pflanzen, Pilzen und Luft: 8 für Entdecker, 12 für Profis, 6 für Experten. Experte ist jetzt echt. Sechs alte Fragen ruhen (doppelt oder ohne passende Karte).
- **„Wer lebt wo?“ und „Stimmt das wirklich?“ starten auch gleich auf deiner Stufe.** Die Stufe lässt sich oben ändern, dann beginnt sofort eine neue Runde. Eine angefangene Runde, auch eine aus der Zeit von „Leicht, Mittel, Schwer“, läuft mit ihrer Stufe zu Ende.
- **Keine Zähler mehr:** „… davon beim ersten Versuch“, „Unsichere Aufgaben wiederholen“ und die Versuche beim Memory sind weg. Was beim ersten Mal nicht geklappt hat, kommt in einer späteren Runde wieder.
- **„Spielen“ in der Leiste führt immer zur Spiele-Übersicht**, auch mitten im Spiel oder nach einem Abstecher zu einer Karte. Dein Spielstand bleibt, „Fortsetzen“ bringt dich zurück.
- **Stufen-Vorschlag in allen Spielen:** Wie auf den Karten schlägt ein Spiel nach mehreren richtigen oder falschen Antworten eine andere Stufe vor, höchstens einmal je Runde.
- **„Neu mischen“** behält deinen Spielstempel und gibt dir nicht gleich dieselbe Runde noch einmal.
- **Spiele öffnen oben, der Fokus bleibt an seinem Platz** (Spieltest): Jedes Spiel öffnet oben statt mitten in der Liste. Nach einer richtigen Antwort springt der Fokus auf „Nächste Aufgabe“, auf dem Handy rückt der Knopf ins Bild. Nach „Nächste Aufgabe“ sieht man Stufe und ganze Frage. Nach „Spielen“ in der Leiste liegt der Fokus auf der Karte des Spiels, auf jedem Weg. Im offenen Spiel steht oben keine Karte „Weiter entdecken“ mehr; sie verschob vorher das Spiel nach unten (Design-Prüfung).
- **Kreuz und quer** hat denselben schmalen Fortschrittsbalken wie die anderen Spiele statt eines grauen Balkens. Das Bild von Kreuz und quer auf der Startseite hat einen Rahmen und wird nicht mehr unscharf groß gezogen.
- Neues Vorschaubild von „Kreuz und quer“ auf der Startseite und ein Eintrag in „Was ist neu?“.

Hinter den Kulissen:

- **Ratemuster-Test für verräterische Wörter** (`tests/ratemuster.test.mjs`): findet Wörter, die nur in der richtigen Antwort stehen. Zwei bekannte Funde (Nahrung als Profi, Technik als Entdecker) stehen als Ausnahmen mit BACKLOG-Verweis und dürfen nur schrumpfen.
- **Alte Spielstände bleiben:** Leicht = Entdecker, Mittel und Schwer = Profi (auch bei Kreuz und quer). Zwei richtige Antworten wurden umformuliert; eine gelöste alte Runde bleibt gelöst (`ALTE_ANTWORT`). Ein Stufen-Vorschlag, den ein Spiel nicht zeigen darf, verbraucht den Vorschlag der Runde nicht (`nachAntwort` in `app/kern/stufe.ts`).
- **Tests:** neue Unit-Tests für alte Runden, „Neu mischen“, Stufen-Vorschlag und alte Stufen; im Browser-Test `playground` die Leiste mitten im Spiel (direkt und über einen anderen Bereich), der Fokus nach „Noch eine Runde“ und „Neu mischen“ mit `vorige` und `geschafft`; dazu die Fokuswege aus dem Spieltest (gemeinsam in `app/kern/spiel-fokus.ts` und `app/game-shell.tsx`).
- Entscheidungen: [Teil B, Punkte 19 bis 35](docs/entwurf/2026-11-24-teil-b-entscheidungen.md). Berichte: [Code-Prüfung](docs/entwurf/2026-11-24-teil-b-pr2-code-pruefung.md), [Oberflächentexte](docs/entwurf/2026-11-24-teil-b-pr2-oberflaechentexte.md) und ihre [Kinder-Redaktion](docs/entwurf/2026-11-24-teil-b-pr2-oberflaechentexte-kinderredaktion.md), Entwurf „Stimmt das wirklich?“ mit [Fakten-](docs/entwurf/2026-11-24-stimmt-das-wirklich-entwurf-faktenpruefung.md), [Sprach-](docs/entwurf/2026-11-24-stimmt-das-wirklich-entwurf-kinderredaktion.md) und [Stufen-Prüfung](docs/entwurf/2026-11-24-stimmt-das-wirklich-entwurf-stufenpruefung.md) und [Nachprüfung](docs/entwurf/2026-11-24-stimmt-das-wirklich-nachpruefung.md). Nebenbei geprüft für PR 3: Rekorde der Natur, Wetter und Klima, Sortiere die Zeit (Fassung 2) und ein Experten-Nachtrag für „Stimmt das wirklich?“.
- Weitere Berichte: [Code-Nachprüfung](docs/entwurf/2026-11-24-teil-b-pr2-code-nachpruefung.md), [Spieltest](docs/entwurf/2026-11-24-teil-b-pr2-spieltest.md), [Technik-Prüfung zum späten Fund](docs/entwurf/2026-11-24-teil-b-pr2-technik-spaeter-fund.md), [Design-Prüfung](docs/entwurf/2026-11-24-teil-b-pr2-design-pruefung.md).
- **Messwerte:** *Funde vor dem PR:* 77 (code-pruefer 11, Nachprüfung 3; kinder-redaktion Oberflächentexte 12; Entwurf „Stimmt das wirklich?“ fakten 5, kinder 14, stufen rund 9; Nachprüfung der Fassung fakten 3, kinder 7, stufen 4; spieltester 9, davon 1 bis 4 behoben, 5 schon entschieden, 6 bis 9 im BACKLOG; reine Stilvorschläge nicht mitgezählt). Nach dem Öffnen des PR, vor dem Merge: `design-pruefer` 8 (3 wichtig: Spiele öffneten bei weichem Scrollen nicht oben, Kreuz und quer anders gebaut, Vorschaubild; 5 Feinschliff), davon 1 ganz und 2 teils behoben, Rest im BACKLOG; keine späten Funde im Sinne der Regel. *Späte Funde:* 1 (Fokus nach „Spielen“ in der Leiste, erst im großen Lauf `playground`; der Prüfschritt war nie gelaufen, [Technik-Prüfung](docs/entwurf/2026-11-24-teil-b-pr2-technik-spaeter-fund.md)). *Dauer:* rund 3¼ Stunden (Beginn gegen 20:16 UTC, [PR #114](https://github.com/Arizona2k/wunderkompass/pull/114) geöffnet um 22:36 UTC, gemergt um 23:27 UTC als `8dbe0c5`).

## 24.11.2026 – Bilder-Strang: echte Fotos statt KI-Zeichnungen

Hinweis des Nutzers: „Teilweise sind die Fotos nicht richtig, teilweise fehlen Fotos.“ Regel seitdem: immer zuerst freie Originalfotos, KI nur, wenn es nachweislich keines gibt. Für Kinder sichtbar:

- **24 Tierkarten zeigen jetzt echte Fotos** statt KI-gestützter Zeichnungen, zum Beispiel Schnabeltier, Okapi, Erdmännchen, Katta, Igel, Eisvogel, Chamäleon, Clownfisch und Seepferdchen.
- **Neue Bilder bei Menschen und Erfindungen:** 8 Personen bekommen ein Gemälde, einen alten Druck oder ein Foto (zum Beispiel Maria Sibylla Merian, Lise Meitner, Inge Lehmann, Tagore). Ibn Sina zeigt eine alte Handschrift, weil niemand weiß, wie er aussah. Dazu Bilder für Feuer, Kompass und Fahrrad.
- **Bessere Fotos:** ein neues Orca-Foto, größere Porträts von Karl und Bertha Benz, Einstein, Wangari Maathai, al-Chwarizmi und Gutenberg. Pinguin und Eiffelturm sind ganz zu sehen.
- **Ehrlich beschriftet:** Ein Schild oben links sagt, wenn ein Bild kein Foto ist („Gemälde“, „Spätere Darstellung“). Es liegt nicht mehr über Kopf oder Mütze. Auf dem Tablet sind die Bilder größer.
- **Zwei Startfragen kürzer und leichter:** „Welches Zeichen eines Kattas kann man riechen?“ und „Was haben junge Salamander im Bach?“ Die alten Fragen hatten Wörter, die auf schmalen Handys über zwei Zeilen liefen. Auch Tipp, Erklärung und „warum nicht“ sind neu: Beim Katta zeigst du auf Augen, Ohren und Nase. Beim Feuersalamander erfährst du, dass junge Salamander mit Kiemen atmen und die Kiemen später verlieren. Der alte Katta-Tipp führte in die Irre.

Hinter den Kulissen:

- **Einbau-Werkzeug** `scripts/foto-einbau.mjs` mit Prüfregeln `scripts/foto-regeln.mjs`: prüft Lizenz und Urheber noch einmal über die Commons-API, verlangt einen passenden Lizenz-Link, macht WebP in 320, 640 und (ab 736 px) einer dritten Größe, trägt Bildnachweis und Kennwort ein. Es baut erst alles fertig, bevor es etwas schreibt, und skaliert nie hoch. Anleitung im Kopf der Datei.
- **Foto-IDs geschützt:** Alle Foto-IDs stehen in `tests/fixtures/stable-ids.json` (Familie `photos`) und werden nie wiederverwendet. Ersetzte Fotos (heute `orca`) behalten ihren Nachweis und stehen in `tests/fixtures/ersetzte-fotos.json`; ein Unit-Test und der Browser-Test `world-photos` prüfen, dass jedes Foto gezeigt wird oder dort steht.
- Vorschläge und Bildtexte in `docs/bilder/`, Berichte: [Foto-Inventur](docs/entwurf/2026-11-24-foto-inventur.md), [Paket 1](docs/entwurf/2026-11-24-bilder-paket-1-tiere.md), [Paket 2](docs/entwurf/2026-11-24-bilder-paket-2-personen.md), [Code-Prüfung](docs/entwurf/2026-11-24-bilder-strang-code-pruefung.md), [Design-Prüfung](docs/entwurf/2026-11-24-bilder-strang-design-pruefung.md), [Startfragen](docs/entwurf/2026-11-24-startfragen-karten-autor.md), [Nachprüfung der Startfragen](docs/entwurf/2026-11-24-startfragen-nachpruefung.md), [neue Tipps und ihre Prüfung](docs/entwurf/2026-11-24-startfragen-hinweise-pruefungen.md), Bildtexte `docs/entwurf/2026-11-24-bilder-texte-*.md`. Offen: BACKLOG Phase 1, Punkt 26 und 27.
- **Vercel-Tageslimit erreicht** (kostenloser Plan, 100 Deployments in 24 Stunden): Von etwa 19:04 bis 19:21 UTC und ab 19:23 UTC wieder baute Vercel keine Vorschauen ([Bericht des `technik-pruefer`](docs/entwurf/2026-11-24-vercel-tageslimit.md)). **Entscheidung des Nutzers:** Alle benutzen nur die Test-Seite, darum baut Vercel zunächst nur noch `test-live` (`vercel.json`). Arbeits-Branches und `main` bekommen keinen Build mehr. Damit der Nutzer vor dem Merge auf seinen Geräten schauen kann, baut Vercel dann zusätzlich den festen Branch `vorschau` (OK des Nutzers): Claude bringt nur geprüfte, sichtbare Stände dorthin, einmal je Runde. `CLAUDE.md` ist angepasst (BACKLOG Punkt 28).
- Nebenbei gesichert für den nächsten Schritt: [Entscheidungsliste](docs/entwurf/2026-11-24-drei-spiele-entscheidungen.md) und Prüfberichte zu den drei Spiel-Entwürfen (Rekorde, Wetter und Klima, Sortiere die Zeit).
- **Messwerte:** Funde vor dem PR: 43 (Claude: feste Fotozahl im Test, Kennwort „Foto“, 4 Bildausschnitte (Eiffelturm, Erdmännchen, Seepferdchen, Walross), falscher Kachel-Wähler im Tiertest, Orca im Fototest, Feuerbild abgeschnitten, 2 Startfragen mit zu langen Wörtern (`kern-huelle`); `kinder-redaktion`: 19 Bildtexte und „Larven“ in der neuen Startfrage; `fakten-pruefer`: falsche Bildunterschrift bei Ibn Sina und 3 Präzisierungen; `code-pruefer`: halbe Schreibvorgänge im Werkzeug und 5 Risiken; `design-pruefer`: Kennwort über Porträts, Bilder am Tablet zu klein). Nach dem Öffnen des PR, vor dem Merge, fanden Helfer bei der Nachprüfung noch 12 (keine späten Funde im Sinne der Regel, denn keine Prüfung lief rot): 7 in den älteren Texten der beiden Startfragen (`stufen-pruefer` und `kinder-redaktion`: Katta-Tipp führt in die Irre, steife „warum nicht“-Sätze, beim Feuersalamander Ratemuster, Erklärung ohne das Ende der Kiemen, zu schwerer Tipp, Schreibweise „Feuer-Salamander“) und 5 in der neuen Fassung (`kinder-redaktion`: „die Jungen“ klingt wie „Jungs“, Rückbezug zur Frage fehlte; `fakten-pruefer`: missverständlicher Satz, Behörde statt Wikipedia als Quelle; `stufen-pruefer`: der Katta-Tipp wiederholte nur die Frage). Die Design-Nachprüfung fand keinen neuen Fehler. Zur neuen Vercel-Regel fand der `technik-pruefer` 4 Unterlagen-Befunde: README, PR-Vorlage, die Vollprüfung läuft ohne PR nach `main` nicht von selbst, alte Branches bauen weiter. Zur Vorschau-Regel fand er 4 Befunde am Befehl und an der Regel (fehlende `&&`, Grund für den neuen Commit, `vercel.json` im gezeigten Stand, nur eine Vorschau) und 7 Unterlagen-Stellen; Claude fand dazu, dass ein fehlgeschlagener Befehl den Branch hätte löschen können, und bei der Probe, dass ein schon bekannter Commit auf `vorschau` nicht baut. · späte Funde: 0 bis zum PR (`pnpm run check` und die großen Suiten `core`, `offline-cold-full`, `animals` mit `world-photos`, `animal-native-zoom`, `home` und `home-visits` waren auf `139579e` grün). Nach den neuen Texten noch einmal `pnpm run check` und `--suite full core offline-cold-full challenge`. · Dauer: rund 3¾ Stunden (Beginn gegen 16:45 UTC, PR gegen 19:05 UTC, letzter Commit gegen 20:00 UTC, Merge danach nach grüner CI).

## 24.11.2026 – Teil B, erster Teil: Wissensspiele mit Stufen

Die ersten beiden Aufgaben von Teil B „Spiele kniffliger“. Für Kinder sichtbar:

- **Deine Stufe gilt jetzt auch in sechs Wissensspielen:** „Tierdetektiv – neue Spuren“, „Tier & Lebensraum“, „Wer frisst was?“, „Wer war das?“, „Technik-Detektiv“ und „Früher oder heute?“
  - **Entdecker:** 5 Aufgaben mit 3 Antworten.
  - **Profi:** 8 Aufgaben, meist mit 4 Antworten (bei „Früher oder heute?“ bleiben es 3 feste Antworten). Die falschen Antworten sind näher dran, zum Beispiel Tiere aus derselben Tiergruppe oder Personen und Erfindungen aus derselben Zeit.
  - **Experte:** spielt vorerst Profi und sagt das auch.
  - Die Stufe lässt sich oben im Spiel ändern. Dann beginnt gleich eine neue Runde in der neuen Stufe.
- **Was du falsch hattest, kommt später wieder:** In den Wissensspielen und in der Wissens-Challenge kommen zuerst Aufgaben, die du falsch beantwortet hast, dann neue. Die Runde, die du gerade gespielt hast, kommt nicht gleich noch einmal.
- **Mehr Abwechslung:** Bei Tier & Lebensraum und Wer frisst was? wechseln die falschen Antworten von Runde zu Runde. Nach einem Fehler steht da, zu welchem Tier deine Wahl passt.
- **Klarere Rätsel:** Rotfuchs und Aal haben neue Rätsel mit einem Merkmal, das nur sie haben (Mäusesprung, Sargassosee). Bei „Wer war das?“ haben neun Personen eigene Rätsel, zum Beispiel Darwin, Einstein, Mandela und Mae Jemison. Darin steht nur, was auch auf ihrer Karte steht. Die Rätsel verraten weder den Namen noch, ob ein Mann oder eine Frau gesucht ist. Mitten im Satz steht jetzt „diese Person“ statt „Diese Person“.
- **Früher oder heute?:** Die dritte Antwort heißt jetzt bei jeder Aufgabe „Erst in der Zukunft“, wie die drei Zeiten auf den Erfindungskarten. Vorher hing die dritte Antwort von der Lösung ab und verriet sie. Gespeicherte Runden mit der alten Antwort laufen weiter.
- **Bequemer spielen:** Ein Spiel öffnet oben statt mitten in der Spieleliste. Nach einer richtigen Antwort springt der Fokus auf „Nächste Aufgabe“, am Ende auf „Eine ganze Runde gelöst!“. Auf dem Handy ist das Foto in der Runde kleiner, damit die Antworten schneller zu sehen sind. Die Stufe Profi heißt in der Auswahl jetzt „etwas kniffliger“.

Hinter den Kulissen:

- **Ein Auswahl-Helfer für alle Rundenspiele** (`app/kern/auswahl.ts`): Er sucht die Aufgaben einer Runde aus. Kreuz und quer, Klassik und die Länder-Spiele nutzen ihn in den nächsten Aufgaben auch.
- **Geprüfte falsche Antworten:** Der `fakten-pruefer` hat jede mögliche falsche Antwort geprüft. Passt ein Hinweis auch auf eine falsche Antwort, kommt sie nie (29 Ausschlüsse bei Tierdetektiv, Personen und Technik). Bei Lebensraum und Nahrung sind 112 Paare gestrichen, die in Wirklichkeit doch teilweise passen, etwa „Gebirge“ beim Löwen ([Bericht](docs/entwurf/2026-11-24-tier-fallen-faktenpruefung.md)).
- **Geschaffte Stufe gemerkt:** Jedes dieser Spiele merkt sich still die höchste geschaffte Stufe. Die goldenen Belohnungen dafür kommen in Teilschritt 5.
- **Tests:** Je ein neuer Test für den Auswahl-Helfer, die Welt-Spiel-Runden und das Ratemuster („die richtige Antwort ist nie auffällig oft die längste“). Dazu ein neuer Browser-Test `spiel-auswahl` für Stufenwechsel, Neuladen und „Neue Runde“. Dazu Tests für die eigenen Rätsel (kein Name, kein Geschlecht) und für Runden mit der alten dritten Antwort.
- Entscheidungen und Verschobenes: [Entscheidungsliste](docs/entwurf/2026-11-24-teil-b-entscheidungen.md), BACKLOG Phase 1, Punkt 25.
- **Messwerte:** Funde vor dem PR: 19 (`code-pruefer`: 2 Fehler und 3 behobene Risiken; `stufen-pruefer`: 5 Muss-Befunde, darunter die verratende dritte Antwort; `design-pruefer`: 2 Muss-Befunde und der Fokus nach einer richtigen Antwort; `spieltester`: das Spiel öffnete mitten in der Seite; `kinder-redaktion`: „Benzinmotor“ verriet „Benz“; `fakten-pruefer`: das Einstein-Rätsel stand nicht auf der Karte; Claude: das Hochrollen klappte nur manchmal (eigener Browser-Test), die Neuigkeit war zu lang (Unit-Test), der Browser-Test `habitat-answer-semantics` erwartete bei alten Spielständen noch die festen falschen Antworten (`pnpm run check`; nur im Test, beim Suchen der betroffenen Tests übersehen)). Dazu kommt die Faktenprüfung der falschen Antworten mit 29 Ausschlüssen und 112 gestrichenen Paaren. · späte Funde: 0 (die großen Suiten `core`, `animals`, `playground`, `challenge` und `offline-cold-full` waren auf `29af565` grün) · Dauer: rund 2¾ Stunden (Beginn gegen 13:56 UTC; [PR #111](https://github.com/Arizona2k/wunderkompass/pull/111) gemergt um 16:40 UTC als `2b08c8b`).

## 24.11.2026 – Teil B, Vorarbeiten: keine toten Knöpfe, schnellerer Start, ruhigere Tests

Bevor die Spiele kniffliger werden (Teil B), drei Vorarbeiten. Für Kinder sichtbar:

- **Kein Knopf mehr ins Leere:** Auf dem Globus zeigten rund 390 Orte, zum Beispiel alle Hauptstädte, den Knopf „Im Naturatlas weiterdenken“. Das Wissensbuch kannte sie aber nicht und sagte nur „Diesen Naturort gibt es hier nicht.“ Jetzt steht der Knopf nur bei Orten, die der Naturatlas wirklich erklärt.
- **Schnellerer Start:** Beim ersten Öffnen lädt die Seite 58 KB weniger. Ortssuche, Auswahllisten und der Tag-Regler kommen erst, wenn man den Globus oder das Quiz öffnet; offline sind sie trotzdem da.
- **Keine weiße Seite mehr:** Lädt ein Teil der Seite einmal nicht (zum Beispiel weil das WLAN gerade weg ist), steht an der Stelle „… braucht noch einen Versuch“ mit einem Knopf zum Neuladen. Der Rest bleibt bedienbar. Vorher konnte in so einem Fall die ganze Seite weiß werden.

Hinter den Kulissen:

- **Linkwächter:** Ein neuer Test prüft bei jedem PR, dass jeder feste Verweis der Seite zu etwas Vorhandenem führt. Er fand den Globus-Knopf oben und einen toten Wortverweis im Wissensbuch („Wolke“). [Landkarte aller Verweise](docs/entwurf/2026-11-24-linkwaechter-landkarte.md).
- **Tests warten von selbst:** Lädt ein Test die Seite neu, ruft eine neue Adresse auf oder schließt sie, wartet er jetzt an einer zentralen Stelle, bis nichts mehr lädt. Bisher musste jeder Test selbst daran denken; das war fünfmal schiefgegangen und erst spät aufgefallen.
- **Suche im Test:** Alle Tests, die in die Suche tippen und einen Treffer wählen, nutzen jetzt denselben sicheren Baustein.
- **Geprüft von zwei Helfern:** Technik ([Bericht](docs/entwurf/2026-11-24-teil-b-vorarbeiten-technik-pruefung.md)) und Code ([Bericht](docs/entwurf/2026-11-24-teil-b-vorarbeiten-code-pruefung.md)). Der Code-Helfer fand die weiße Seite oben; ein neuer Test lässt das Nachladen absichtlich scheitern.
- **Ein Klick, der still verpuffte:** In der Firefox-Prüfung auf GitHub klickte ein Test auf „Was ist neu?“ im Fuß, kurz bevor nachgeladene Teile der Startseite den Fuß weit nach unten schoben. Das Loslassen traf dann ein Bild, und nichts passierte. Jetzt warten alle Klicks in den Fuß, bis die Seite fertig geladen hat (`klickNachRuhe`). Dass der Fuß überhaupt so springt, steht im BACKLOG ([Bericht](docs/entwurf/2026-11-24-teil-b-vorarbeiten-technik-pruefung-spaeter-fund.md)).
- **Messwerte:** Funde vor dem PR: 13 (Linkwächter: 2 tote Ziele auf der Seite; `technik-pruefer`: 4 von 7 Befunden waren Fehler; `code-pruefer`: 7 von 9, darunter die weiße Seite) · späte Funde: 1 (Engine-Schnellprüfung Firefox, CI-Lauf 45397127026, nur im Test; die Vollprüfung auf `c84d1e2` fand keinen) · Dauer: rund 2¼ Stunden (Beginn gegen 11:40 UTC; Merge direkt nach grüner CI dieses Unterlagen-Commits, gegen 14:00 UTC).

## 24.11.2026 – Stufen-Feinschliff: jede Stufe mit Ziel

Aus dem ersten Spieltest (Rolle am Handy, kein Kindertest). Für Kinder sichtbar:

- **„Noch eine Frage“ bleibt in deiner Stufe:** Wer Profi spielt, bekommt keine Entdecker-Fragen mehr dazwischen, auch nicht beim Öffnen der Karte. Eine falsch beantwortete Frage wartet in ihrer Stufe; „Noch einmal nachdenken“ im Wissensbuch bringt dich trotzdem genau zu ihr; ist sie nur wieder dran, beginnt sie leer, damit nicht gleich die Lösung dasteht. Nach der letzten Frage steht „Geschafft! Mehr Profi-Fragen hat diese Karte nicht.“ und ein Knopf „Weiter zu: …“ zur passenden Nachbarkarte (in Lernrouten nur der Satz, dort geht es mit der nächsten Station weiter). „Zurück“ führt wieder zu „Rate mal!“.
- **Zwei Fehler behoben:** Nach einem Stufenwechsel kommt sofort eine Frage der neuen Stufe, nicht die alte. „Zu schwer? Zurück zu Entdecker“ steht nur noch dort, wo es etwas ändert.
- **Falsch sieht falsch aus:** Am Handy sah eine falsch angetippte Antwort grünlich aus, fast wie eine richtige. Jetzt bleibt sie orange, auf der Karte und in den Spielen. Im Wissensbuch ist die gewählte Antwort einer Denkfrage jetzt auch am Handy markiert.
- **Elefant:** Eine Profi-Frage verriet die Experten-Frage; sie ruht jetzt. Neu ist eine Frage zu den Stoßzähnen. Ein paar Sätze sind genauer (geprüft von Sprache, Fakten und Stufen).
- Je Fehler ein Test; eine neue Liste schützt die gespeicherten Antworten.
- **Arbeitsweise:** Zwei neue Regeln (Wunsch des Nutzers). Bevor Claude eine Änderung am Verhalten empfiehlt, prüft es alle Wege dorthin (Wissensbuch, Lernrouten, Zurück, Neuladen). Und jeder PR bekommt drei Messwerte, damit sich zeigt, ob wir schneller werden und weniger spät finden.
- **Messwerte:** Funde vor dem PR: 10 (Helfer; dazu die geprüften Elefanten-Entwürfe) · späte Funde: 0 · Dauer: rund 3 Stunden (08:58 UTC bis zum Merge gegen 11:45 UTC). Dazu 4 Funde nach dem PR, aber vor dem Merge (3 vom `code-pruefer`, 1 von Claude); Einzelheiten in den [Entscheidungen](docs/entwurf/2026-11-24-stufen-feinschliff-entscheidungen.md).

## 24.11.2026 – Teil A ist auf der Testseite; Prüfungen verlässlicher

Teil A „Eine Stufe für alles“ ist seit 24.11.2026 auf der Testseite (PR #107). Für Kinder ändert sich danach nichts Sichtbares. Die Prüfungen fallen seltener grundlos aus und finden Zeitfehler früher.

- **Browser schneller geladen:** Die Prüfung auf GitHub holt die Pakete für die Test-Browser zuerst von der offiziellen Ubuntu-Quelle. Ein langsamer Spiegel hatte sie bis knapp an ihre Zeitgrenze von 20 Minuten gebracht.
- **Stresslauf:** Ein Schalter bremst im Test jedes Bild der Seite. So zeigen sich Fehler, bei denen etwas erst einen Augenblick später erscheint, schon vor dem PR. Er gehört jetzt zu `/pruefen`.
- **Aufgeräumt:** Der veraltete Größenvergleich im Build ist weg; die festen Größengrenzen gelten weiter.
- **Arbeitsregel genauer:** Wer Karten ändert, prüft danach auch alle Karten offline, und betroffene Tests werden auch über ihren Auslöser gesucht.
- **Zwei Testfehler, die nur manchmal kamen, behoben:** In Safari (WebKit) war im Test einmal das Suchfeld leer, als beim Tippen die Kapiteltexte kamen; ein eigener Test prüft jetzt genau diesen Moment mit echtem Tippen. In Firefox war der Rauchtest rot, wenn die Startseite zufällig das Riff-Foto zeigte; jetzt wartet er, bis die Startseite fertig ist. Auf der Seite selbst war beides kein Fehler.
- **Neuer Helfer „Spieltester“ (Pilot):** Er benutzt die Seite im echten Browser in einer Rolle, z. B. „6 Jahre, mit einem Elternteil, am Handy“, und meldet, wo man hängen bleibt. Kein Kindertest. Sein erster Lauf an den Stufen fand zwei Fehler (nach einem Stufenwechsel bleibt manchmal die alte Frage stehen; „Zu schwer?“ steht auch dort, wo man schon Entdecker spielt). Sie stehen im BACKLOG und sind noch nicht behoben.

## 23.11.2026 – Teil A „Eine Stufe für alles“: drei Stufen, leichter Satz oben

Kinder wählen jetzt eine Stufe: Entdecker, Profi oder Experte. Die Karten zeigen Fragen passend zur Stufe.

- **Eine Stufe für alles:** Die Stufe steht im Entdeckerpass und gilt für Karten und Quiz (Spiele, Labore und Reisen folgen). Gewählt wird oben bei „Rate mal!“ oder im Pass. Wer drei Fragen hintereinander gleich richtig hat, bekommt eine schwerere Stufe vorgeschlagen; wer zweimal danebenliegt, eine leichtere. Nichts wechselt von selbst.
- **Mehr Fragen auf den Karten:** 12 neue Zusatzfragen, dazu die 42 Fragen der Wissens-Challenge auf ihren 13 Karten (drei davon neu), alle mit Tipps und „warum nicht“. Vier alte Fragen ruhen (sie bleiben in den Daten, damit alte Einträge im Pass lesbar bleiben). Profi und Experte haben vier Antworten. Neu sind „Fast richtig“ (Marie Curie: Welches Wort stimmt nicht?) und „Ordne richtig“ (Steinwerkzeuge, ab Experte). Alle Inhalte sind geprüft (Entwurf, Sprache, Fakten, Endprüfung).
- **Gleiche Wörter überall:** „Richtig!“, „Noch nicht ganz. Versuch es noch einmal!“ und „Tipp“ heißen jetzt überall gleich. „Noch einmal raten“ zählt nicht doppelt.
- **Erst ein leichter Satz:** Auf Karten ohne Häppchen steht „Ganz einfach“ jetzt offen oben, die langen Absätze stehen unter „Für Große“. 67 Karten haben dafür neue Sätze bekommen, 24 Tierkarten eine neue Einleitung. Bei Personen bleibt der Satz oben in „Ausprobieren“, weil er dort den Versuch anleitet.
- **Nichts geht verloren:** Alte Antworten im Pass bleiben lesbar, auch wenn eine Frage neue Antworten bekam; angefangene Runden der Wissens-Challenge laufen mit ihrer alten Frage weiter. Eine feste Liste aller gespeicherten Antworten wacht darüber.
- **Vorschläge fair, Tastatur besser** (nach der Code-Prüfung): Vorschläge zählen nur Fragen der gewählten Stufe. Nach einem Stufenwechsel und bei „Ordne richtig“ bleibt der Fokus an seinem Platz, der neue Platz wird angesagt. Alte Challenge-Runden mit der früheren Frage zeigen keine unpassenden Tipps. Eine zweite Liste schützt auch die neuen Antworten. Seit 24.11.2026 springt der Fokus nach einem Stufenwechsel auch nicht mehr kurz weg: Er steht sofort wieder auf „Ändern“, im Pass wie auf der Karte (Fund der CI in Safari/WebKit).
- **Klarer zu sehen** (nach der Design-Prüfung, 24.11.2026): Die offene Stufenwahl steht in einem eigenen Kasten mit der Frage „Welche Stufe willst du spielen?“ und sieht nicht mehr aus wie Antworten. Der Vorschlag für eine andere Stufe steht direkt nach der Erklärung, vor „Noch eine Frage“. „Prüfen“ bei „Ordne richtig“ ist größer. Offene Punkte zu Texten stehen im BACKLOG.
- **Neuer Helfer** `karten-autor`: schreibt Entwürfe für Karteninhalte; geprüft wird unabhängig.
- **Alte PRs aufgeräumt:** PR #95 und #27 sind durchgesehen und geschlossen. Brauchbares (Aufträge, „Ganz einfach“-Vorlagen, Funde) ist übernommen ([Durchsicht](docs/entwurf/2026-11-23-pr-95-27-durchsicht.md)).

## 23.11.2026 – Teilschritt 3 beginnt: schnellere Prüfungen, aufgeräumt, Entwurf „Kniffliger spielen“

Für Kinder ändert sich fast nichts Sichtbares. Fehler fallen jetzt früher auf, und die große Prüfung ist schneller.

- **Ein doppelter Satz weniger:** Bei 21 Karten aus Natur und Wissenschaft stand „Schon gewusst?“ wörtlich wie „Ganz einfach“. Der doppelte Satz ist weg. Neue Überraschungen mit Quelle kommen mit der Wissenschaftswelt.
- **Firefox und Safari früher prüfen:** Jeder PR prüft die wichtigsten Abläufe jetzt auch in Firefox und WebKit (Safari), nicht erst die große Prüfung am Phasenende. Das Sonnensystem mit seinen Beschriftungen ist dazugekommen.
- **Große Prüfung in Gruppen:** Statt drei langer Läufe (der längste rund 102 Minuten) laufen jetzt sieben kürzere gleichzeitig. Jeder Lauf schreibt auf, wie lange jeder Teil braucht. Mit den ersten Zeiten hat Firefox eine zweite Gruppe bekommen (vorher 55 Minuten in einer).
- **Gemeinsame Test-Bausteine:** Alle Browser-Tests beantworten Fragen und lesen „Ganz einfach“ über denselben Baustein. Ein Wächter verbietet eigene Wege dafür. Ein neuer Datentest prüft alle Karten in Sekunden darauf, dass „Ganz einfach“ nicht doppelt dasteht. Er fand 24 Tierkarten, die mit „Kniffliger spielen“ neu geschrieben werden.
- **Aufgeräumt:** 61 alte Dateien und 14 Pakete, die die Seite nicht mehr braucht, sind weg, darunter zwei mit bekannten Sicherheitslücken (eines davon bringt ein Lint-Baustein noch mit, ohne gemeldete Lücke). Die Lücken waren für Besucher nicht erreichbar. Die Lint-Regeln kommen jetzt direkt aus ihren Bausteinen statt aus einem Next-Paket; dabei prüft der Lint erstmals auch unsere Vite-Plugins in `build/`.
- **Zwei Firefox-Funde:** Firefox lädt ein Foto manchmal ein zweites Mal, weil React die Bildadresse nach dem Einfügen noch einmal setzt. Und nach dem Neuladen zeigt Firefox ein schon geladenes Foto aus seinem Speicher und bricht die Nachfrage dazu selbst ab. Beide Male erscheint das Bild; Kinder merken nichts. Die Tests hielten das für Fehler. Jetzt erkennen sie genau diese zwei Fälle und melden jeden anderen abgebrochenen Download weiter.
- **Entwurf „Kniffliger spielen“** ([Entwurf und Plan](docs/entwurf/2026-11-23-phase-1-teilschritt-3.md), [Entscheidungen zum Arbeitssystem](docs/entwurf/2026-11-23-teilschritt-3-arbeitssystem-entscheidungen.md)): drei Stufen (Entdecker, Profi, Experte), schwerere Fragen ohne Ratemuster, Labore mit echten Aufgaben. Gebaut wird nach der Freigabe.

## 23.11.2026 – Arbeitsweise: Helfer laufen, nichts geht verloren, zwei WebKit-Fehler behoben

Für Kinder ändert sich nichts Sichtbares. Wir arbeiten sauberer und schneller.

- **Alle Helfer laufen:** `/weiter` prüft beim Start, ob jeder Helfer da ist. Fehlt einer, wird er von Hand eingesetzt, und der Nutzer erfährt es. Nach jedem Fehler, der erst spät auffällt, prüft der Technik-Prüfer, wie man ihn früher findet.
- **Nichts geht verloren:** Wünsche, Regeln und Ideen kommen gleich ins Repository. Vor einem neuen Chat ist alles hochgeladen, und die Entscheidungen stehen in einer Liste ([Teilschritt 2](docs/entwurf/2026-11-23-phase-1-teilschritt-2-entscheidungen.md)).
- **Aufräumen gilt auch fürs Arbeiten:** Tests, Werkzeuge und Unterlagen, die bremsen, werden einfacher oder fallen weg.
- **Technik-Prüfung festgehalten** ([Bericht](docs/entwurf/2026-11-23-technik-pruefung.md)): Die große Prüfung in der CI soll von rund 102 auf rund 35 bis 38 Minuten schrumpfen. Das kommt als Erstes in Teilschritt 3.
- **Zwei alte WebKit-Fehler behoben** (Safari auf iPhone und iPad): Ohne Netz fragt die Seite nicht mehr unnötig nach einer neuen Version, und der Sicherungs-Test findet seine Teststimme auch in WebKit. Seitdem prüft jeder PR Pass und Offline zusätzlich in WebKit (`pnpm run test:browser:webkit`, etwa zwei Minuten mehr).

## 23.11.2026 – Teilschritt 2, Teil B: Karten, die zusammenpassen

Jede Karte hat jetzt einen echten Nachbarn. Zwölf Karten sind schon ganz im neuen Stil, mit kleinen Häppchen und mehr zum Knobeln.

- **Jede Karte hat einen Nachbarn:** 30 neue Verbindungen für die 35 Karten, die noch keine hatten. Unter „Dazu passt“ steht immer, warum zwei Karten zusammengehören. Alle 226 Sätze wurden für Kinder durchgesehen und auf Tatsachen geprüft. Fünf schwache Verbindungen stehen zum Ersetzen im BACKLOG.
- **Karten aufgeräumt:** Was im Steckbrief steht, kommt nicht noch einmal im Text. „Schon gewusst?“ verrät nur noch Neues. Fragen sagen nicht mehr „wie im Text steht“. Viele Sätze für Erwachsene sind aus dem Kinderteil verschwunden. Bei den Karten über Krieg, Völkermord und Anschläge steht bewusst keine Überraschungs-Tatsache mehr.
- **Zwölf Karten im neuen Stil** (Elefant, Eisbär, Krake, Steinwerkzeuge, Apollo 11, Marie Curie, Jane Goodall, Pyramiden von Gizeh, Eiffelturm, Wasserkreislauf, Mondphasen, Fahrrad): „Kurz erklärt“ besteht aus kleinen Häppchen mit je einer Frage als Überschrift. Bei „Stimmt das?“ entscheidet man, ob ein Satz stimmt. Nach einer richtigen Antwort gibt es „Noch eine Frage“. Der längere Text steht unter „Für Große“.
- **Alte Antworten bleiben:** Wurde eine Frage neu geschrieben, bleibt die gespeicherte Antwort gewählt und richtig. Gibt es eine Antwort gar nicht mehr, sagt die Karte: „Hier gibt es neue Antworten. Früher hast du … gewählt.“ Pass-Einträge gehen nicht verloren.
- **Weiterdenken, wo man war:** Wer auf einer Karte mit mehreren Fragen falsch geraten hat und später zurückkommt (aus dem Wissensbuch, von einer Nachbarkarte oder nach dem Neuladen), bekommt wieder dieselbe Frage und keine neue.
- **Besser lesbar:** Getippte Antworten bleiben gut lesbar und werden nicht blass. Zeichnungen in „Dazu passt“ sind kompakt. Die Mondzeichnung oben auf der Karte ist am Handy kleiner. „Noch einmal raten“ hat jetzt die richtige Schriftgröße. Bei Marie Curie, Jane Goodall und dem Fahrrad steht „Ganz einfach“ jetzt oben in „Ausprobieren“.
- **„Was ist neu?“** hat einen neuen Eintrag.
- **Geprüft:** ganze Prüfkette, die große Prüfung in Chromium (alle 32 Teile grün; fünf davon nach Korrekturen noch einmal einzeln, nach der letzten Korrektur auch `core` und `offline-resilience`). Alle neuen Sätze von der Kinder-Redaktion und auf Tatsachen geprüft, die zwölf Pilot-Karten zweimal auf Bildern in fünf Breiten, dazu eine Code-Prüfung und eine Schlussprüfung durch einen frischen Prüfer auf dem stärksten Modell. Was dort gefunden und nicht gleich behoben wurde, steht mit Grund im BACKLOG (Punkt 23). Firefox und WebKit prüft die Vollprüfung in der CI.

## 22.11.2026 – Teilschritt 2, Teil A: Die neue Wissenskarte

Jede Wissenskarte ist neu gebaut: erst raten, dann kurz lesen, dann selbst ausprobieren. Die alte Karte ist weg. Ihre Links, Antworten und Pass-Einträge bleiben.

- **Oben auf der Karte:** großes Bild mit Bildnachweis, der Titel und gleich eine Frage: „Rate mal!“. Wer falsch rät, bekommt einen Hinweis und kann „Noch einmal raten“.
- **Kurz erklärt und Steckbrief:** ein paar kurze Sätze und die wichtigsten Zahlen auf einen Blick. Was nur Eltern brauchen (Lernziel, Quellen, Datum der Prüfung), steht zugeklappt unter „Für Erwachsene: Quellen und Lernziele“.
- **Ausprobieren:** Messen, Modelle, Zeichnungen und Belege stehen in einem Bereich, der erst beim Öffnen lädt. So ist die Karte schneller da. Bricht das Netz dabei ab, gibt es „Noch einmal versuchen“, ohne dass die Seite neu lädt.
- **Mehr erfahren:** die längeren Texte, weitere Verbindungen und Orte auf der Karte, freiwillig zum Aufklappen.
- **Dazu passt:** unten auf jeder Karte höchstens drei große Kacheln: eine echte Nachbarkarte mit dem Grund, warum sie passt, der Ort auf dem Globus und eine Reise, ein Labor oder das Spiel der Welt. Nach „Zurück“ steht man wieder bei der Kachel, auch in Safari.
- **Klarer Rückweg:** statt der langen Sprungleiste ein Link „← Zurück“. Wer direkt auf eine Karte kam, bekommt einen Link zu ihrer Welt, zum Beispiel „← Die Tierwelt“.
- **Lernreisen einfach zuerst:** Jedes Kapitel beginnt mit ein paar kurzen Sätzen, einer Tatsache und einem Beobachtungsauftrag. Der lange Text steht unter „Für Große“, der Satz für Eltern unter „Für Erwachsene“. „Kapitel vorlesen“ liest, was offen steht.
- **Am Handy:** lange Wörter (etwa bei Grace Hopper) schieben die Seite nicht mehr zur Seite. Beschriftungen in Zeichnungen sind am kleinen Handy mindestens 16 Pixel groß. Vier Erfindungs-Zeichnungen haben noch winzige Schrift; das steht im BACKLOG.
- **Leichter zu bedienen:** Jeder Bereich zum Aufklappen hat rechts einen Pfeil, der sich beim Öffnen dreht. „Größere Schrift“ im Entdeckerpass macht die Frage und die ersten Sätze jetzt wirklich größer. Knöpfe und Aufklapper sind mindestens 48 Pixel hoch, die Buchstaben A, B, C bei den Antworten größer und dunkler.
- **„Was ist neu?“** hat zwei neue Einträge.
- **Hinter den Kulissen:** Die Tempo-Prüfung läuft jetzt in jeder Prüfung mit. Tests warten vor einem Seitenwechsel kurz, bis die Bilder geladen sind. Ein neuer Helfer prüft technische Themen. Die Startdateien sind nicht größer geworden.
- **Geprüft:** ganze Prüfkette, die große Prüfung in Chromium (alle 31 Teile grün), Karte und Lernreise auch in Firefox und WebKit. Eine Schlussprüfung des ganzen Umbaus (mit einem anderen Modell als geplant, darum eine Teilprüfung) und eine Prüfung der Gestaltung auf Bildern; was dort gefunden und nicht gleich behoben wurde, steht im BACKLOG (Punkt 20).
- **Entdeckerpass repariert:** Wer sehr viel entdeckt hatte (mehr als 256 Karten, Spiele, Reisen und Labore), verlor beim Laden die zuletzt angefangenen Spielstände. Den Fehler gab es schon vorher. Jetzt bleiben alle erhalten, auch beim Sichern, Wiederherstellen und Neuladen.

## 21.11.2026 – Teilschritt 2, Schritt 0: Prüfungen in drei Browsern repariert

Für Kinder ändert sich fast nichts. Es geht vor allem um die Prüfungen vor dem Umbau der Wissenskarte.

- **Drei neue Fehler der großen Prüfung geklärt:** Keiner lag an der Seite selbst. Ein Chromium-Test wechselte die Seite, während noch Bilder luden; er wartet jetzt. Ein Firefox-Test stürzte wegen eines Fehlers im Testwerkzeug Playwright ab; er umgeht ihn. In WebKit (Safari) sprang ein Buch-Test so schnell zwischen Seiten hin und her, dass Safari weitere Sprünge sperrte. Ein Kind kommt nie so schnell. Der Test bremst jetzt in Safari, und die Sperre zählt künftig als Fehler.
- **Alter Safari-Fehler mitbehoben:** `engine-journeys` scheiterte in WebKit schon vor Teilschritt 1, aus demselben Grund.
- **Wissensbuch am Handy:** Beim Drehen des Handys meldete Safari einen Fehler in der Leiste oben im Buch, am Rechner Chrome beim Ziehen des Fensters. Die Leiste misst jetzt ihren Rahmen statt sich selbst und rückt den gewählten Bereich danach wieder ganz ins Bild. Neue Tests drehen das Handy hin und her und ziehen das Fenster schmal und breit.
- **Startfrage am kleinen Handy:** Mit großer Schrift ragte eine Startfrage mit langem Wort („Radioaufzeichnung“) am kleinen Handy ein paar Pixel über den Rand, und die Seite ließ sich seitlich schieben. Die große Schrift ist dort jetzt etwas kleiner (31 statt 34 Pixel, normal sind 27). Ist ein Wort doch einmal zu lang, bricht es um, statt die Seite zu verschieben. Ein Test prüft jetzt alle 56 Startfragen, nicht nur die, die der Zufall gerade zeigt.
- **Drei weitere Testfehler in Chrome:** Drei Tests luden die Seite neu, während noch Bilder oder Programmteile nachluden. Der langsame Prüfrechner brach sie ab, und das zählte als Fehler. Die Tests warten jetzt vorher. Scheitert so ein Test künftig, nennt er den genauen Fehler.
- **Vorbereitung:** Größe der Startdateien gemessen (Obergrenze für den Umbau). Für die 58 Karten von Zeitreise und Erfindungen gibt es eine Liste freier Bildkandidaten mit Lizenz und Urheber; eingebaut wird später.

## 21.11.2026 – Phase 1, Teilschritt 1 „Aussehen und Hülle“

Die Seite bekommt ihre neue Grundlage. Startseite, Wissenskarte und Weltenseiten werden in den nächsten Teilschritten neu gebaut; hier bekommen sie nur Schrift, Farben und nötige Korrekturen.

- **Neue Schrift und Farben:** Nunito (rund, gut lesbar, freie Lizenz, offline dabei), helle Flächen mit Orange und Petrol. Auch Buchstaben wie in „Białowieża“ kommen jetzt aus einer Schrift.
- **Eine Leiste für alles:** Start, Welten, Spielen, Labor, Reisen, Buch. Am Handy steht sie unten, ab dem Tablet oben. Früher schnitt die Leiste am Handy Wörter ab.
- **Ruhiger Kopf:** nur noch Name, Suche und Entdeckerpass. Der Punkte-Zähler am Pass-Knopf ist weg.
- **Neuer Fuß:** „Was ist neu?“, „Für Eltern“ und der Kasten für das Offline-Lernen.
- **„Was ist neu?“ für Kinder:** kurze Einträge mit Symbol, neueste oben. Die alte Chronik steht in Kindersprache unter „Früher“ (Texte von Kinder-Redaktion und Faktenprüfer geprüft).
- **Kein großer Rahmen mehr** nach einem Seitenwechsel. Wer mit der Tastatur arbeitet, sieht den Fokus weiter deutlich.
- **Kleine Korrekturen aus der Design-Prüfung:** Das Suchfeld bleibt bei großer Schrift am kleinen Handy ganz sichtbar. Beispieltexte in Suchfeldern passen in die Felder. „So geht’s“ steht auf der Startseite in jeder Breite. Weitere Befunde stehen mit Grund im BACKLOG (Punkt 15).
- **Korrekturen aus der Schlussprüfung:** Auf dem iPhone bleibt die Lesestelle erhalten, wenn ein Kind unten in der Leiste oder im Fuß tippt und dann „Zurück“ geht (vorher sprang die Seite nach oben). Auf „Was ist neu?“ werden Wörter nicht mehr mitten durchgeschnitten, auch nicht bei großer Schrift. Beim Öffnen eines Bereichs springt die Seite nicht mehr: Vorher stand der Fuß kurz mitten im Bild und wurde dann weggeschoben. Kleinere Befunde stehen im BACKLOG (Punkt 16).
- **Hinter den Kulissen:** Tests öffnen Bereiche über einen eigenen Helfer statt über die alte Leiste. Viele alte Stilregeln sind gelöscht; die Startdateien sind kleiner als vorher. Zeichnungen behalten vorerst ihre bisherige Schrift, damit keine Beschriftung aus dem Bild rutscht.
- **Geprüft in drei Browsern:** Die Vollprüfung in der CI lief zum ersten Mal auch in Firefox und WebKit (Safari). Dabei fiel auf: Kam man aus einer Karte ins Wissensbuch zurück, sprang am Handy die Leiste oben im Buch einmal um, und Safari meldete das als Fehler. Das ist behoben. Ein Firefox-Test lud die Seite neu, während noch ein Bild lud; er wartet jetzt. Drei WebKit-Fehler gab es schon vorher; sie stehen im BACKLOG und kommen vor der nächsten Veröffentlichung für Freunde dran.
- **Werkzeug:** Das Browser-Testwerkzeug Playwright ist auf 1.65.1 (neueste Version, mindestens 7 Tage alt) und bleibt künftig immer aktuell. Chromium, Firefox und WebKit laufen jetzt auch im Arbeits-Container.

## 21.11.2026 – Alter Katalog „WunderKompass 2027“ eingeordnet

An der Seite selbst ändert sich nichts. Es geht um die Pläne.

- **Geprüft:** der Anforderungskatalog aus der ChatGPT-Zeit (jetzt in `docs/archiv/`). Die Einordnung mit Gründen steht in `docs/entwurf/2026-11-21-katalog-2027-einordnung.md`.
- **Übernommen:** einheitliches Design mit Tastaturbedienung, Mitmachen mit echtem Lernnutzen, Verknüpfung und Rückwege, hohe Qualität mit echtem Ansehen statt nur Tests.
- **Kein Bestandsschutz** (Wunsch des Nutzers): Was nicht gut ist, wird geändert oder gestrichen, auch wenn es es schon gibt. Erhalten bleiben nur der Fortschritt der Kinder im Pass und ihre Links.
- **Angepasst:** Inhalte kurz zuerst, mit drei Tiefen bis „Für Große“. 3D nur, wo es etwas erklärt, immer mit 2D-Fassung. Der Globus wird in Phase 4 das Herzstück. Neue Themen wie Körper, Geld oder Religionen ziehen Welt für Welt ein, mit Sorgfaltsregeln.
- **Nicht übernommen:** Spline (Logo im kostenlosen Plan), die alte Paket-Reihenfolge, Nachweis-Dateien, Inhalte von einer KI, Tagespolitik.
- **Audit V2 nachgeprüft:** 18 von 19 alten Befunden sind behoben. Offen sind vor allem rohe Sprachkürzel in Länderansichten (BACKLOG).

## 21.11.2026 – Neuausrichtung, Schritt 0 „Großputz & Arbeitsweise“

Claude entwickelt WunderKompass ab jetzt weiter. Für Kinder sieht die Seite noch genauso aus wie vorher.

- **Weniger Ballast:** Prüfberichte, Vergleichsdateien, Release-Sperren und alte Datenbank- und Sites-Reste sind entfernt. Das Repository ist deutlich kleiner: 1021 statt 1284 Dateien, 42,2 statt 73,9 MB.
- **Schnellere Prüfung:** Ein Befehl (`pnpm run check`) prüft Typen, Code, Unit-Tests, Build und die wichtigsten Browserwege. Die große Prüfung in drei Browsern läuft am Ende einer Phase.
- **Was weiter geschützt ist:** Entdeckerpass und gespeicherte Antworten; die IDs von Karten, Kapiteln, Spielen, Laboren, Missionen und Reisen, die meisten Fragen-IDs und alte Links (Orts-IDs und zwei Fragenbanken kommen noch dazu, siehe BACKLOG); Bilder mit Nachweis; Offline-Betrieb.
- **Einmal „Neue Version laden“:** Wer die Seite offline vorbereitet hat, sieht einmal den Knopf „Neue Version laden“. Pass und Favoriten bleiben dabei erhalten (im Test geprüft).
- **Geprüft (Chromium):** `pnpm run check` grün, große Prüfung 28 von 28 Suiten grün. Der neue Build gleicht dem alten bis auf die Versionskennung. Firefox und WebKit prüft die CI vor der nächsten Veröffentlichung für Freunde.
- **Neue kurze Unterlagen:** `CLAUDE.md`, `STATUS.md`, `VISION.md`, `BACKLOG.md`. Die Originalaufträge liegen in `docs/archiv/`.
- **Helfer:** sechs Prüf-Helfer für Kindertexte, Fakten, Design, Code, Bildrechte und Ideen; Kurzbefehle `/weiter` und `/pruefen`.
