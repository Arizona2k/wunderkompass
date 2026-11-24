# Stufen-Feinschliff aus dem ersten Spieltest: Entscheidungen und Helferberichte

Stand: 24.11.2026. Grundlage: [Spieltest-Bericht](2026-11-24-spieltester-probelauf-stufen.md), BACKLOG Phase 1, Punkt 12 (a bis h). Entschieden vom Nutzer am 24.11.2026: als kleiner eigener Schritt vor Teil B, mit Test je echtem Fehler; (c) als klarer Schluss nach den Fragen der Stufe.

## Was gebaut ist (Commit „Stufen-Feinschliff: …“)

- **(a)** Nach einem Stufenwechsel auf der offenen Karte kommt eine Frage genau der gespielten Stufe (`frageNachWechsel` in `app/kern/karte/karten-daten.ts`). Beim Öffnen bleibt `ersteFrage` mit „falsch beantwortet zuerst“ (E4). Tests: Unit „Fehler (a) …“, Browser `wechselNachFalscherAntwort` in `tests/browser/karte-stufen.mjs`.
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

## Offen für den Nutzer

Nichts zu entscheiden. Hinweis: Der Schluss erscheint auf Profi und Experte immer (auch nach nur einer Frage), auf Entdecker nur nach mehr als einer Frage.
