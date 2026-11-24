# Stufen-Feinschliff aus dem ersten Spieltest: Entscheidungen und Helferberichte

Stand: 24.11.2026. Grundlage: [Spieltest-Bericht](2026-11-24-spieltester-probelauf-stufen.md), BACKLOG Phase 1, Punkt 12 (a bis h). Entschieden vom Nutzer am 24.11.2026: als kleiner eigener Schritt vor Teil B, mit Test je echtem Fehler; (c) als klarer Schluss nach den Fragen der Stufe.

## Was gebaut ist (Commit „Stufen-Feinschliff: …“)

- **(a)** Nach einem Stufenwechsel auf der offenen Karte kommt eine Frage genau der gespielten Stufe (damals `frageNachWechsel` in `app/kern/karte/karten-daten.ts`; seit der Entscheidung unten wählt `ersteFrage` auch beim Öffnen nur aus der gespielten Stufe). Tests: Unit „Fehler (a) …“, Browser `wechselNachFalscherAntwort` in `tests/browser/karte-stufen.mjs`.
- **(b)** „Zu schwer? Zurück zu Entdecker“ fehlt, wenn die Karte ohnehin Entdecker spielt (`gespielteStufe`, Prop `spielt` in `app/kern/stufen-wahl.tsx`; im Pass gilt die gewählte Stufe). Test: Browser `profiOhneProfiFragen`.
- **(c, d)** „Noch eine Frage“ blättert nur in der gespielten Stufe (`fragenDerStufe`, `naechsteFrage`), jede Frage einmal je Runde (Runde = seit Öffnen oder Stufenwechsel). Danach statt „Noch eine Frage“ ein Schluss mit Satz und Knopf zur ersten erklärten Nachbarkarte (`data-route-focus`). Karten mit nur der Hauptfrage (181 von 204) bleiben, wie sie sind. Tests: Unit „„Noch eine Frage“ (c, d) …“, Browser `schlussNachDerStufe` (Handy und breit, auch: Knopf passt in die Breite, führt zur Nachbarkarte).

## Bericht der `kinder-redaktion` zum Schluss (24.11.2026, gekürzt)

Gesamteindruck „geht so (mit kleinen Änderungen gut)“.

- a) „Alle Experte-Fragen“ ist falsches Deutsch; richtig „Experten-Fragen“ (Fugen-n). Vorschlag: eigene Bindeform neben `STUFEN_NAME` nur für Zusammensetzungen.
- b) **Wichtigster Befund:** „Alle …“ erscheint oft, obwohl die Stufe nur eine Frage hat (Entdecker auf Elefant, Eisbär, Pyramiden von Gizeh, Khipu, Mohenjo-Daro, Bronze, Merian, Lehmann; Experte fast überall). Vorschlag: „Geschafft! Mehr Profi-Fragen hat diese Karte nicht.“ (passt für eine und viele Fragen).
- c) „Geschafft“ ist auch nach einem zweiten Versuch ehrlich (heißt „bis zum Ziel“, nicht „fehlerfrei“); nie „alle richtig“ schreiben.
- d) „Nächste Karte“ klingt nach fester Reihenfolge. Vorschlag: „Weiter zu: <Titel> →“, Titel in eigenem `<span>` für sauberen Umbruch.
- e) Kein zusätzlicher Lob- oder Hinweissatz; kürzer ist besser.
- f) Mit Stufen-Vorschlag stehen bis zu vier Knöpfe da. Vorschlag: Schluss-Satz zuerst, dann der Vorschlag, dann die Knöpfe; „Nein, ich bleibe“ beim Schluss evtl. weglassen. Gestaltung vom `design-pruefer` ansehen lassen.
- g) „Geschafft!“ und „Weiter zu:“ in `app/kern/woerter.ts`.
- Unsicher: Wie oft Vorschlag und Schluss zusammenfallen (Spieltest am Handy); Karten mit nur der Hauptfrage bekommen keinen „Weiter zu“-Knopf (ungleich); Titel der Nachbarn nicht einzeln geprüft.

**Umgesetzt:** a (Bindeform `STUFEN_BINDEFORM`), b (Satz wie vorgeschlagen), c (bleibt „geschafft“), d („Weiter zu:“, Titel im `<span>`), e, g. Zu f: Der Schluss-Satz steht jetzt vor dem Vorschlag, die Knöpfe danach; „Nein, ich bleibe“ bleibt (schließt den Hinweis, ein eigener Weg). Prüfung durch `design-pruefer`. **Nicht umgesetzt (bewusst):** „Weiter zu“ auf Karten mit nur der Hauptfrage. Dort folgt nach der Frage der Kartentext; ein Knopf weg von der Karte gleich nach der ersten Antwort könnte vom Lesen abhalten. Als Idee im BACKLOG.

## Bericht des `code-pruefer` zum ersten Commit (24.11.2026, gekürzt)

Ergebnis: „mit Änderungen bereit“. Pass und Schlüssel unverändert (nur gelesen; `gezeigt` lebt nur im React-Zustand); Rundenlogik stimmt; Stufenwechsel aus anderem Tab, Pass oder Vorschlag ohne Schleife; gleiche Frage nach dem Wechsel baut nicht neu auf; „Noch einmal raten“ nach dem Schluss in Ordnung; kein anderer Test geht noch vom alten Verhalten aus.

- **1 (wichtig):** „Zurück“ nach „Nächste Karte“ findet den Knopf meist nicht wieder: Beim Zurückgehen wählt die Karte neu, die Runde beginnt von vorn, der Schluss-Knopf fehlt, der Fokus geht auf den Kartentitel oben. Vorschlag: ein Rücksprungziel, das immer da ist (`section.rate-mal` mit `data-route-focus`), und ein Test wie `rueckwegNachDazuPasst`.
- **2 (wichtig):** In einer Lernroute (`embedded`) steht der orange Knopf zur Nachbarkarte neben „Zur nächsten Station“ und führt aus der Route heraus. Vorschlag: in Routen nur der Satz.
- 3: „Experte-Fragen“ falsch (schon nach der `kinder-redaktion` behoben).
- 4: Der Schluss kommt auf Entdecker schon nach einer einzigen Frage, aber nur auf 8 Karten (Karten mit höheren Fragen); die 181 Karten mit nur einer Frage zeigen ihn nicht. Uneinheitlich. Vorschlag: Schluss nur, wenn die Runde mehr als eine Frage hat oder die Stufe nicht Entdecker ist.
- 5: `weiter` nimmt `naechste` aus der Closure; sauberer im Updater neu rechnen.
- 6: Der Vorschlags-Test prüft nicht mehr, ob danach „Noch eine Frage“ oder der Schluss kommt.
- 7: Kommentar in `rate-mal.tsx` (Vorschlag „vor Noch eine Frage“) veraltet.
- 8: Nachträge (Was ist neu?, CHANGELOG, STATUS, BACKLOG) fehlen noch.

**Umgesetzt:** 1 (Knopf setzt vor dem Wechsel den Fokus auf „Rate mal!“, das ein festes Rücksprungziel hat; Test „Zurück nach Weiter zu“), 2 (in Routen nur der Satz, Test), 4 (wie vorgeschlagen: `zeigtSchluss`; Entdecker mit nur einer Frage bleibt wie bisher), 5, 6, 7, 8.

## Spieltest-Befunde f und g: falsche Antwort sah am Handy grünlich aus

Beim Nachstellen am Handy (390 px, Bild in `.qa-output/feinschliff/`, nicht in Git) zeigte sich: Nach dem Tippen auf eine falsche Antwort war der Knopf grünlich hinterlegt, nur die Schrift orange. Ursache: Die alte Regel für „Maus darüber“ in `app/globals.css` (`.quiz-answer:not(:disabled):hover`, grünlich #f0f8f4 / #9abfb0) ist stärker als `.is-incorrect`, und am Handy bleibt :hover nach dem Tippen stehen. Das erklärt Befund f („nur die Antwort wird orange“) und g (Hover-Grün ähnlich dem Richtig-Grün). **Behoben:** Die Regel gilt nur noch mit `@media(hover:hover)`, nicht für beantwortete Knöpfe, und in neutralem Blaugrau (#f2f7f9 / #799da9, wie schon in `.classic-learning`). Gilt für alle Antwortknöpfe der Seite. Test in `wechselNachFalscherAntwort` (Handy und Maus): Die falsche Antwort bleibt orange, auch mit Finger oder Maus darauf.
Lage der Rückmeldung (f): Mit ins Bild geholter Antwort liegt „Noch nicht ganz …“ bei 390 px im Bild (522 bis 642 von 844 px). Weiteres prüft der `design-pruefer`.

## Bericht des `design-pruefer` (24.11.2026, gekürzt)

Bilder in 320 (auch große Schrift), 390, 768, 1280, 1440 px. Blockierend: keine. Tippflächen alle mindestens 44 px, Kontraste in Ordnung (Weiß auf Orange 4,9:1). Rückmeldung nach falscher Antwort liegt bei 390 px im Bild. Hover gegen Richtig jetzt klar verschieden; das alte Grün war nirgends sonst gewollt.

- Wichtig 1: Bei 320 px Schachtelung grüne Karte → Rückmeldung → weiße Vorschlagskarte; Text nur etwa 185 px breit. Vorschlag: Vorschlagskarte unter 560 px ohne eigenen Kasten.
- Wichtig 2: Vier Knöpfe untereinander am Handy; „Ja“ und der orange Knopf konkurrieren. Vorschläge: Ja/Nein nebeneinander, „Nein, ich bleibe“ als Textknopf, „Noch einmal raten“ zarter.
- Feinschliff 3: Schluss-Satz hebt sich nur halb ab → Titelfarbe und ein Zeichen. Feinschliff 4: Falsch nur an der Farbe erkennbar → neutrales Zeichen. 5: Umbruch des orangen Knopfs in Ordnung. 6: Hover-Regel in `playground.css` ohne `@media(hover:hover)`.

**Umgesetzt:** 3 (Titelfarbe, Kompass-Zeichen; das Zeichen ist schon im Startpaket, kostet keine Bytes), 6 (gleiche Regel wie in `globals.css`). **Ins BACKLOG** (Phase 1, Punkt 12 l): 1, 2 und 4; sie betreffen den Vorschlags-Baustein aus Teil A und die Antwortknöpfe überall, gehören mit einem `spieltester`-Lauf am Handy zusammen geprüft.

## Elefanten-Fragen (e)

Entwurf, alle Prüfungen und das Ergebnis: [2026-11-24-elefant-fragen-entwurf.md](2026-11-24-elefant-fragen-entwurf.md). Kurz: `:rate-3` ruht, `:rate-4` bleibt, neue Profi-Frage `:rate-5` (Stoßzähne), `:rate-2` unverändert (keine Ausnahme im Schutztest), einige Sätze genauer. Neue datierte Antwortliste.

## Spieltest vor dem PR (`spieltester`, 24.11.2026, gekürzt)

Rolle „11 Jahre, allein, will es schwer haben“, Handy 390 px, lokaler Build. Ziel erreicht (Profi drei Fragen, Experte eine, „Weiter zu: Großer Panda“, „Zurück“), etwa 21 Handlungen, keine Browserfehler. Bestätigt: nur Fragen der gewählten Stufe; Schluss mit „Weiter zu“ auf Profi und Experte; nach falscher Entdecker-Antwort und Wechsel sofort eine Profi-Frage; falsche Antwort orange; „Zu schwer?“ nur, wo es etwas ändert; neue Stoßzahn-Frage „sinnvoll, mit guten Erklärungen“.

- **Fehler (wichtig):** Nach „Zurück“ stand „Stufe: Profi“, darunter die Entdecker-Hauptfrage (drei Antworten). Ursache: Beim Öffnen suchte `ersteFrage` eine ungesehene Frage auch unter den leichteren; nach allen Profi-Fragen gewann die nie gestellte Hauptfrage. **Behoben:** Neue und fällige Fragen kommen beim Öffnen nur aus der gespielten Stufe; nur „falsch beantwortet zuerst“ reicht weiter in die leichteren (E4, wie entschieden). Unit-Test angepasst (Profi, Experte), Browser-Test: nach „Zurück“ eine Profi-Frage.
- Auch gesehen: Mit Stufe Experte und einer früher falsch beantworteten Entdecker-Frage zeigt die Karte beim Zurückkommen diese Entdecker-Frage mit der alten Rückmeldung („Noch nicht ganz“). Das war die Regel E4 („falsch beantwortet zuerst“ beim Öffnen); der Nutzer hat sie am 24.11.2026 auf die eigene Stufe begrenzt (siehe unten).
- Feinschliff: Experte hat nur eine Frage, die Wasserstellen-Antwort ist erratbar (BACKLOG 12 h); Zahlenreihe 3/30/100/1.000 (BACKLOG 12 j). „Das war leicht für dich“ trotz falscher Antwort: nachgestellt, der Vorschlag kommt nur nach drei richtigen ersten Antworten (mit F-R-F kein Vorschlag, mit R-R-R einer); der Spieltester sah ihn in einem anderen Durchgang.

## Nachprüfung des `code-pruefer` (Commits 8571597 bis b609a8d, 24.11.2026, gekürzt)

„Mit kleinen Änderungen bereit.“ Nichts gefährdet Pass, IDs oder Links. Geprüft und in Ordnung: festes Rücksprungziel „rate-mal“ (auch mehrere Karten in der Historie, Wegnavigieren über Leiste, „Dazu passt“, „Mehr erfahren“), Befunde 2, 4 bis 7, neue Wahl beim Öffnen (einziger Aufrufer; Entdecker unverändert), Texte, CSS (keine anderen Zustandsklassen betroffen), Daten (`:rate-3` nur `ruht`, neue Liste deckt die 287 sichtbaren Fragen, Pass-Einträge zu `:rate-3` bleiben), Exporte aktuell.

- **W1 (wichtig):** Der Farbtest wartete nach dem Tippen auf `:hover`; in Firefox und WebKit nicht belegt (Engine-Schnellprüfung). **Behoben:** Der Test fährt ausdrücklich mit dem Zeiger über die Antwort; Lauf in Firefox und WebKit.
- K1: „Was ist neu?“ versprach „nur Fragen deiner Stufe“, E4 zeigt aber eine falsch beantwortete leichtere. **Behoben:** Text sagt jetzt „„Noch eine Frage“ bleibt jetzt in deiner Stufe.“; CHANGELOG ebenso.
- K2: Offene Frage fehlte in `STATUS.md`. **Behoben.**
- K3: CHANGELOG „Lernreisen“ statt „Lernrouten“. **Behoben.**
- K4: Kommentare (`karten-daten.ts`, `karte-hilfen.mjs`, `rate-mal.tsx`). **Behoben.**
- K5: Denkfragen im Wissensbuch (`book-study.tsx`, `nature-study-body.tsx`) markieren die Wahl nur mit `aria-pressed`; am Handy war sie bisher nur zufällig über das hängende Hover-Grün zu sehen. **Behoben:** neutrale Markierung für `.quiz-answer[aria-pressed="true"]` in `globals.css`.
- K6: Auf Experte mit einer einzigen, schon gelösten Frage öffnet die Karte sofort gelöst mit dem Schluss. Folgerichtig; BACKLOG 12 h (beim nächsten Spieltest ansehen).

## Entschieden: „Falsch beantwortet zuerst“ nur in der eigenen Stufe (24.11.2026)

- **Frage:** Beim Öffnen kam eine falsch beantwortete Frage zuerst, auch wenn sie leichter war als die gewählte Stufe. Der Spieltest zeigt die Folge: Wer auf Entdecker falsch antwortet, dann auf Experte wechselt und später zurückkommt, sah wieder die Entdecker-Frage mit „Noch nicht ganz“, obwohl „Stufe: Experte“ dastand.
- **Entscheidung des Nutzers** („ok zur Empfehlung und mergen“, dazu „alle Empfehlungen finde ich super“): „falsch zuerst“ nur in der gespielten Stufe. Die falsche Entdecker-Frage wartet, bis das Kind wieder Entdecker spielt.
- **Umgesetzt:** `ersteFrage` wählt beim Öffnen und nach einem Stufenwechsel nur aus der gespielten Stufe (`app/kern/karte/karten-daten.ts`). `fragenFuerStufe`, `frageNachWechsel` und `waehleFrage` sind dabei entfallen, die Testhilfen sind vereinfacht (`fragenAufStufe` liefert jetzt genau die gespielte Stufe).
- **Lücke beim Umsetzen gefunden:** „Noch einmal nachdenken“ im Wissensbuch listet Karten, deren Hauptfrage (immer Entdecker) falsch beantwortet oder wieder fällig ist. Auf Profi oder Experte hätte die Karte nach dem Tipp eine Profi-Frage gezeigt, und der Eintrag im Wissensbuch wäre stehen geblieben. Für fällige Hauptfragen galt das schon seit `b609a8d`. **Gelöst:** Der Knopf setzt einen Merker im Verlaufseintrag (`navigateHash(…, {nachdenken})`, `history.state.wunderNachdenken`). Die Karte liest ihn beim Öffnen und, weil der Weltbereich versteckt offen bleibt, bei jedem späteren Wechsel des Wegs, und löscht ihn danach. Dann zeigt sie die wartende Hauptfrage, auch auf Profi und Experte (`frageZumNachdenken`); „Noch eine Frage“ bleibt danach in der Stufe. Die Regel für die Liste und die Karte steht an einer Stelle (`app/kern/wiederholen.ts`). Pass, IDs und Hash-Links sind unverändert; der Merker lebt nur im Verlauf des Browsers.
- **Tests:** Unit-Tests „eine falsch beantwortete Frage kommt zuerst, aber nur in ihrer Stufe“, „Fehler (a)“, „Noch einmal nachdenken“ und `wartetZumWiederholen` (`tests/karte-stufen.test.mjs`). Browser `wechselNachFalscherAntwort` (`tests/browser/karte-stufen.mjs`): Neuladen auf Profi zeigt eine Profi-Frage ohne „Noch nicht ganz“, „Zurück zu Entdecker“ zeigt die wartende Frage, „Noch einmal nachdenken“ zeigt sie auf Profi, am Handy bei offener Karte, breit nach einem Neuladen im Wissensbuch; danach geht „Noch eine Frage“ mit einer Profi-Frage weiter.
- Startpaket: 292 318 Byte (vorher 292 290), Grenze 293 000.

## Hinweis

- Hinweis: Der Schluss erscheint auf Profi und Experte immer (auch nach nur einer Frage), auf Entdecker nur nach mehr als einer Frage.

## Messwerte dieses PR (erste Zählung, 24.11.2026)

Regel seit 24.11.2026 (`CLAUDE.md`, Arbeitsablauf Punkt 7). Gezählt sind Fehler, keine reinen Stilvorschläge.

- **Funde vor dem PR: 10.** `code-pruefer` (erster Commit): „Zurück“ fand den Knopf nicht wieder; der Knopf zur Nachbarkarte führte aus einer Lernroute; Schluss uneinheitlich auf Entdecker. `code-pruefer` (Nachprüfung): Farbtest in Firefox/WebKit ohne Beleg (W1); „Was ist neu?“ versprach zu viel (K1); Wahl einer Denkfrage im Wissensbuch am Handy nicht sichtbar (K5). `spieltester`: Entdecker-Hauptfrage nach „Zurück“ auf Profi. `kinder-redaktion`: „Experte-Fragen“; „Alle …“ bei nur einer Frage. `design-pruefer`: Die Hover-Regel in den Spielen (`playground.css`) hatte denselben Fehler wie die auf den Karten. Dazu kamen die geprüften Elefanten-Entwürfe (`stufen-pruefer`, `fakten-pruefer`, `kinder-redaktion`), hier nicht mitgezählt, weil Prüfen von Entwürfen der normale Weg ist.
- **Nach dem PR, vor dem Merge:** eine Lücke in Claudes eigener Empfehlung (Weg über das Wissensbuch), von Claude beim Bauen gefunden, nicht von einem Helfer. Daraus die Regel „Alle Wege prüfen“.
- **Späte Funde: 0** (Stand vor dem Merge; CI auf dem Endstand steht noch aus).
- **Dauer:** Beginn der Arbeit 24.11.2026, 08:58 UTC; Merge wird nachgetragen.
