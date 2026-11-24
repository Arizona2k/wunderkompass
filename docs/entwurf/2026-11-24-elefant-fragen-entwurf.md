# Entwurf: Elefanten-Fragen (Stufen-Feinschliff, Punkt e)

Stand: 24.11.2026. Bericht des Helfers `karten-autor`, unverändert im Inhalt, leicht gekürzt in der Form. Der vollständige Entwurf aller Zusatzfragen liegt als JSON daneben: [2026-11-24-elefant-fragen-entwurf.json](2026-11-24-elefant-fragen-entwurf.json). **Noch nicht geprüft** (Fakten, Sprache, Stufen); nur ein Formcheck mit `kartenFeldFehler` und der Längenzählung aus `tests/karten-inhalt.test.mjs` lief ohne Fehler.

Anlass: Spieltest vom 24.11.2026 ([Bericht](2026-11-24-spieltester-probelauf-stufen.md), Befund 5; BACKLOG Phase 1, Punkt 12 e). Die Experten-Frage `:rate-4` verrät die Antwort auf die Profi-Frage `:rate-3`; dazu Ratemuster in `:rate-2` (Zahlenreihe 3/30/100/1.000 kg, Lösung in der Mitte) und `:rate-3` („Meist“ nur in der richtigen Antwort).

## Befunde des Helfers, von denen die Lösung abhängt

- Alle Antworten von `:rate-2`, `:rate-3` und `:rate-4` stehen in `tests/fixtures/gespeicherte-antworten-teil-a.json`. Der Test „datierte Liste Teil A“ verlangt, dass jede alte Antwort wörtlich bleibt und die richtige gleich bleibt; Ausnahme ist nur eine ruhende Frage, die dann ganz unverändert bleibt. Profi und Experte brauchen genau vier Antworten. `restoreAnswerWording` kennt nur den Alias für den Seeadler.
- Die Lösung von `:rate-3` steht schon auf der Karte („Ein erfahrenes Weibchen führt sie.“). Eigentlich Entdecker-Niveau.
- Längen-Untergrenze knapp: Von 41 sichtbaren Zusatzfragen ist nur bei 7 die richtige Antwort die einzige längste (17 %, erlaubt ab 15 %). `:rate-4` ist eine davon und sollte bleiben.

## Empfehlung des Helfers

1. `:rate-3` bekommt `ruht: true`, sonst unverändert. Dann fragt keine Frage mehr nach der Anführerin; `:rate-4` verrät nichts mehr, und das „Meist“-Muster ist weg. Beide Antwortlisten bleiben grün; der Pass-Eintrag bleibt (wie bei `person-jane_goodall:rate-2`).
2. `:rate-4` bleibt wörtlich (guter Denkschritt: lange Lebenszeit plus Dürre ergibt Erinnerung an Wasserstellen).
3. Neue Profi-Frage `:rate-5` „Was sind die Stoßzähne eines Elefanten?“ (Lange Eckzähne / Riesige Backenzähne / Hörner aus Knochen / **Lange Schneidezähne**). Profi hat dann weiter drei Fragen (`:rate-1`, `:rate-2`, `:rate-5`).
4. `:rate-2`: zwei falsche Antworten ersetzen („Etwa 3 Kilogramm“ → „Etwa 500 Kilogramm“, „Etwa 30 Kilogramm“ → „Etwa 300 Kilogramm“), Lösung „Etwa 100 Kilogramm“ bleibt; neuer Rechentipp („Ein Menschenbaby wiegt etwa 3 Kilogramm. Ein Elefantenbaby ist ungefähr 30-mal so schwer.“). **Berührt gespeicherte Antworten:** Wer 3 oder 30 kg gespeichert hat, sieht „Hier gibt es neue Antworten …“ und wählt neu (`fruehereAuswahl`). Dafür bräuchte der Test „datierte Liste Teil A“ eine neue, gleich strenge Ausnahme (nur falsche Antworten, nur mit Grund), und `ERSETZT` in `tests/gespeicherte-antworten.test.mjs` einen Eintrag. Alternative: `:rate-2` ruhen lassen und neu anlegen (Helfer rät ab).
5. Option `:rate-6` (Experte, Fresszeit: „… Mehr als die Hälfte davon kann er nicht verdauen. Was folgt daraus für seinen Tag?“). Würde die Grenze von vier sichtbaren Zusatzfragen im Pilot-Test überschreiten. Empfehlung: erst beim Ausbau der Tierwelt.
- Sonst nötig: `:rate-5` in `tests/fixtures/stable-ids.json` unter `world-card-extras`; vor dem Merge `scripts/antworten-stand.mjs`.

## Quellen (laut Helfer; ⚠ = noch zu belegen)

| Aussage | Quelle |
|---|---|
| Kalb wiegt bei der Geburt rund 100 kg | WWF Deutschland, Artenlexikon Afrikanischer Savannenelefant, https://www.wwf.de/themen-projekte/artenlexikon/afrikanischer-savannenelefant; San Diego Zoo, https://animals.sandiegozoo.org/animals/elephant („50 to 120 kilograms“) |
| Kalb ist bei der Geburt etwa 1 m hoch | San Diego Zoo (gleiche Seite) |
| Menschenbaby etwa 3 kg, Elefantenkalb etwa 30-mal so viel | ⚠ WHO Child Growth Standards, https://www.who.int/tools/child-growth-standards/standards/weight-for-age (nicht abgerufen) |
| Stoßzähne sind Schneidezähne | WWF Deutschland; San Diego Zoo |
| Stoßzähne wachsen ein Leben lang | San Diego Zoo; Tokyo Zoological Park Society, https://www.tokyo-zoo.net/tama/encyclopedia/african-bush-elephant/index.html |
| Elefanten haben keine Eckzähne | WWF Deutschland (nur Stoß- und Backenzähne) |
| Backenzähne zermahlen das Futter | ⚠ nicht belegt; sonst kürzen auf „Backenzähne sitzen hinten im Maul.“ |
| Hörner oben auf dem Kopf, z. B. bei Kühen | ⚠ Alltagswissen |
| `:rate-6`: etwa 60 % bleiben unverdaut | San Diego Zoo Library, https://ielc.libguides.com/sdzg/factsheets/african_elephant/diet |
| `:rate-6`: etwa 16 Stunden Fressen am Tag, auch nachts | San Diego Zoo; WWF Deutschland („mehr als 17 Stunden“); ⚠ „auch nachts“ nur gefolgert |
| `:rate-6`: Elefanten schlafen eher wenig | San Diego Zoo; Gravett u. a. 2017, PLOS ONE, https://pmc.ncbi.nlm.nih.gov/articles/PMC5382951/ (nur 2 Tiere) |
| `:rate-2` why: „Nach etwa 20 Minuten kann er schon stehen“ (unverändert) | ⚠ keine abgerufene Quelle nennt die 20 Minuten |

## Was die Prüfer gezielt ansehen sollen (laut Helfer)

- `stufen-pruefer`: `:rate-2` Tipp zu stark? „Richtige Antwort = kleinste Zahl“ als neues Muster? `:rate-5` Tipp „ganz vorn“ zu verräterisch, wissen 8-Jährige „Schneidezähne“? „Hörner aus Knochen“ eine Quatsch-Antwort? Reicht eine Experten-Frage, wenn „Noch eine Frage“ nur in der eigenen Stufe blättert?
- `fakten-pruefer`: alle ⚠ oben.
- `kinder-redaktion`: „verdauen“, „Schneidezähne/Eckzähne/Backenzähne“, „ungefähr 30-mal so schwer“.

## Offen (laut Helfer)

- Ausnahme in der Teil-A-Liste für ersetzte falsche Antworten, oder `:rate-2` unverändert lassen?
- `:rate-6` jetzt oder beim Ausbau der Tierwelt?
- `:rate-4`: „älteste“ in der Frage passt zu „von früher“ in der Antwort; bewusst so (das ist der Denkschritt). Entschärfung möglich: „Eine sehr alte Elefantenkuh“.
- Die Karte hat keine Entdecker-Zusatzfrage (BACKLOG).

## Prüfung `kinder-redaktion` (24.11.2026, gekürzt)

Gesamteindruck „gut, mit Kleinigkeiten“. Fachwörter (Schneide-, Eck-, Backenzähne; „verdauen“ ab 10) in Ordnung.

- `:rate-2`: „Richtig = kleinste Zahl“ ist ein neues Muster. Vorschlag: „Etwa 30 Kilogramm“ behalten, nur „Etwa 3 Kilogramm“ → „Etwa 500 Kilogramm“ (500/100/1.000/30; nur eine gespeicherte Antwort betroffen). Der Rechentipp (3 kg × 30) verrät die Lösung fast ganz; stattdessen zwei Tipps: „Ein Elefantenbaby ist bei der Geburt etwa einen Meter hoch. So groß ist ein Kind im Kindergarten.“ / „Es ist aber viel dicker und schwerer als ein Kind. Ein kleines Auto wäre viel zu schwer.“ Den Vergleich mit Menschenbabys in `why`: „Ein Elefantenbaby wiegt bei der Geburt rund 100 Kilogramm. Das ist so viel wie etwa 30 Menschenbabys zusammen. Schon kurz nach der Geburt kann es stehen.“ (ohne unbelegte 20 Minuten). „warum nicht“: 500 kg „Das wäre zu schwer. So viel wiegt ein großes Pferd. Ein Elefantenbaby ist erst etwa einen Meter hoch.“; 1.000 kg ohne „ja“; 300 kg „So schwer wird ein Elefantenkind erst später. Bei der Geburt ist es noch viel leichter.“; falls 30 kg bleibt: „So viel wiegt ein Kind im Kindergarten. Ein Elefantenbaby ist viel schwerer.“
- `:rate-5`: Zwei Antworten „Lange …zähne“ bilden ein Ratepaar; „Hörner aus Knochen“ ist halb richtig (Knochenkern). Vorschlag: „Spitze Eckzähne / Riesige Backenzähne / Gebogene Hörner / Lange Schneidezähne“. Tipp in zwei Stufen: „Stoßzähne wachsen aus dem Maul, nicht aus dem Kopf.“ / „Fühl mal mit der Zunge: Welche Zähne hast du ganz vorn?“ Frage freiwillig: „Elefanten haben zwei lange Stoßzähne. Was sind sie eigentlich?“ `why` freiwillig mit „wie deine Zähne ganz vorn“. „warum nicht“: Eckzähne „…, wie Hunde sie haben. Elefanten haben gar keine.“; Backenzähne „… hinten im Maul. Damit zerkaut der Elefant Gras und Zweige. Stoßzähne sitzen vorn.“ (sonst ohne den mittleren Satz); Hörner „Hörner wachsen aus dem Kopf, zum Beispiel bei Kühen. Stoßzähne wachsen aus dem Maul. Sie sind Zähne.“
- `:rate-6` (Option): „Was folgt daraus“ zu abstrakt; Vorschläge für Frage, `why` und einen „warum nicht“-Satz.
- `:rate-4` (Folgebefund): Mit dem Ruhen von `:rate-3` ist „Leitkuh“ nirgends mehr erklärt. `why`: „Eine alte Elefantenkuh hat schon viele trockene Jahre erlebt. Sie erinnert sich, wo es damals noch Wasser gab, und führt die Herde dorthin.“; „warum nicht“ 4: „Auch die alte Elefantenkuh braucht viel Wasser. Sie hat einen anderen Vorteil.“
- Für den `fakten-pruefer`: Pferd etwa 500 kg, Kindergartenkind etwa 1 m und 20 kg, 300 kg nach etwa einem Jahr, „zerkaut Gras und Zweige“.

## Was daraus wurde

Folgt nach den Prüfungen durch `stufen-pruefer` und `fakten-pruefer`.
