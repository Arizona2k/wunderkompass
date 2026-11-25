# Personen-Rätsel: Entscheidungsliste (25.11.2026)

Grundlage: die Entwürfe [Paket 1](2026-11-25-personen-raetsel-paket-1.md), [Paket 2](2026-11-25-personen-raetsel-paket-2.md), [Paket 3](2026-11-25-personen-raetsel-paket-3.md) (`karten-autor`) und die drei unabhängigen Prüfungen: [Fakten](2026-11-25-personen-raetsel-faktenpruefung.md), [Kinder-Redaktion](2026-11-25-personen-raetsel-kinderredaktion.md), [Stufen](2026-11-25-personen-raetsel-stufenpruefung.md).
Entschieden von Claude nach der Regel „Empfehlungen sind angenommen“ (Nutzer). Noch nicht eingebaut. Die zusammengeführte Fassung ist ein neuer Stand und geht vor dem Einbau noch einmal an alle drei Prüfer (Punkt 9).

## 1. Grundsatz: Entdecker liest nur Satz 1

- **Ja** (Empfehlung `stufen-pruefer`, Abschnitt 4 Punkt 4). Satz 1 hat im Mittel 11 Wörter, das ganze Rätsel 24. Profi liest alles.
- Getrennt wird am ersten Satzende, nach der Stufe der Runde (`gespielt`), nicht nach der gewählten Stufe. „Vorlesen“ liest denselben gekürzten Text.
- Gespeicherte Runden sind sicher: Der Fragetext wird nicht gespeichert. Alte Runden ohne Stufe spielen Entdecker und zeigen Satz 1.
- Folge für die Texte: Satz 1 sagt allein, wofür die Person bekannt ist, beginnt mit „Diese Person“ (eine Ausnahme: Hokusai), hat kein `?` und keine Abkürzung mit Punkt. Satz 2 beginnt nie mit „Diese Person“.

## 2. Die 27 neuen Rätsel: zusammengeführte Fassung

Gegen die Regeln aus `tests/world-game-learning-copy.test.mjs` (Namensteile, Fürwörter) und die Trennung am ersten Satzende mit einem nachgebildeten Skript geprüft, nicht mit dem echten Test. Satz 1 hat 8 bis 13 Wörter.

- **person-jane_goodall**
  - Diese Person beobachtete wilde Schimpansen und gab den Tieren Namen statt Nummern.
  - Dabei zeigte sich: Schimpansen holen mit Zweigen Termiten aus dem Bau.
  - Grund: Satz 2: kinder-redaktion (Kann), ohne zweites „diese Person“
- **person-wangari_maathai**
  - Diese Person pflanzte in Kenia mit vielen Menschen Bäume.
  - 2004 bekam diese Person den Friedensnobelpreis, einen der berühmtesten Preise der Welt.
  - Grund: Satz 2: fakten-pruefer (Soll, „dafür“ gestrichen) und kinder-redaktion (Soll, Doppelung „Preis für Frieden“)
- **person-ada_lovelace**
  - Diese Person schrieb vor etwa 180 Jahren Rechenschritte für eine geplante Rechenmaschine.
  - Außerdem dachte diese Person: So eine Maschine könnte vielleicht auch mit Musik arbeiten.
  - Grund: Satz 1: fakten-pruefer (nie gebaut), kinder-redaktion und stufen-pruefer (kürzer, Zeitangabe gegen Verwechslung mit Berners-Lee); „etwa 180“ statt „fast 200“ (1843). Satz 2: kinder-redaktion
- **person-bertha_benz**
  - Diese Person wagte mit einem der ersten Autos eine lange Fahrt.
  - 1888 ging die Reise mit den beiden Söhnen von Mannheim nach Pforzheim.
  - Grund: beide Sätze: kinder-redaktion (Kann, „wagte“, „den beiden Söhnen“)
- **person-cai_lun**
  - Diese Person half im alten China, besseres Papier herzustellen.
  - Es heißt: Im Jahr 105 kam das neue Papier an den Hof des Kaisers.
  - Grund: Satz 2: kinder-redaktion (Doppelung) mit der Vorsicht des fakten-pruefers („Es heißt“ statt „Erzählt wird“, einfacher)
- **person-marie_curie**
  - Diese Person bekam zweimal einen Nobelpreis, einen der berühmtesten Preise der Welt.
  - Im Team entdeckte diese Person 1898 zwei neue Grundstoffe: Polonium und Radium.
  - Grund: Satz 1: kinder-redaktion (Kann, einheitlich mit Maathai). Satz 2: kinder-redaktion (Soll)
- **person-rachel_carson**
  - Diese Person warnte: Gift gegen Schädlinge kann auch andere Tiere treffen.
  - Darüber schrieb diese Person 1962 ein Buch: Gift kann mit dem Futter weiterwandern.
  - Grund: beide Sätze: kinder-redaktion (Soll); „warnte“ belegt (NPS: „alerted the public“). Satz 1 ohne „Buch“, damit Darwin weniger lockt (stufen-pruefer)
- **person-inge_lehmann**
  - Diese Person entdeckte: Mitten in der Erde steckt ein Kern im Kern.
  - Dazu verglich diese Person, wann Erdbebenwellen an verschiedenen Orten ankamen.
  - Grund: beide Sätze: kinder-redaktion (Kann)
- **person-tu_youyou**
  - Diese Person suchte im Team nach Medizin gegen Malaria, eine Krankheit durch Mückenstiche.
  - Aus der Pflanze Einjähriger Beifuß gewann das Team einen Stoff namens Artemisinin.
  - Grund: Satz 1: kinder-redaktion (Soll, eindeutig)
- **person-maria_sibylla_merian**
  - Diese Person beobachtete und zeichnete, wie aus Raupen Schmetterlinge werden.
  - 1699 reiste diese Person mit der jüngsten Tochter nach Suriname in Südamerika.
  - Grund: Satz 1: kinder-redaktion (Kann). Satz 2: „mit der jüngsten Tochter“ nach dem Beleg des fakten-pruefers (Rijksmuseum)
- **person-johannes_gutenberg**
  - Diese Person druckte in Mainz Bücher mit einzelnen Buchstaben aus Metall.
  - Die beweglichen Buchstaben ließen sich danach für einen anderen Text neu ordnen.
  - Grund: unverändert
- **person-katsushika_hokusai**
  - Von dieser Person stammt ein berühmtes Bild mit einer riesigen Welle.
  - Das Bild zeigt auch den Berg Fuji und wurde mit Holzblöcken gedruckt.
  - Grund: Satz 1: kinder-redaktion (Kann, „stammt“)
- **person-alexander_humboldt**
  - Diese Person verglich, welche Pflanzen unten und welche hoch oben am Berg wachsen.
  - Von 1799 bis 1804 reiste diese Person durch Teile Amerikas.
  - Grund: Satz 2: fakten-pruefer („dafür“ gestrichen) und kinder-redaktion (ohne Bonpland)
- **person-grace_hopper**
  - Diese Person half, Computern Befehle in Wörtern zu geben.
  - Dafür entstanden im Team frühe Programme, die Wörter für den Computer übersetzen.
  - Grund: Satz 1: „Befehle“ statt „Anweisungen“ (kinder-redaktion), ohne „statt Zahlen“ (nicht auf der Karte). Satz 2: kinder-redaktion
- **person-katherine_johnson**
  - Diese Person rechnete aus, auf welchem Weg Raumschiffe durch den Weltraum fliegen.
  - 1962 prüfte diese Person Computer-Rechnungen für einen Flug rund um die Erde.
  - Grund: Satz 2: kinder-redaktion (ohne „John“, das zu Johnson führt)
- **person-tim_berners_lee**
  - Diese Person entwickelte das Web: Internetseiten, die durch Links verbunden sind.
  - Ende 1990 lief der erste Browser, ein Programm, das solche Seiten zeigt.
  - Grund: beide Sätze: kinder-redaktion (Soll und Kann)
- **person-mary_anning**
  - Diese Person fand an der Küste versteinerte Reste von Tieren aus uralter Zeit.
  - Bei Lyme Regis legte diese Person Teile eines ausgestorbenen Meerestiers frei.
  - Grund: Satz 2: kinder-redaktion (Soll)
- **person-ibn_al_haytham**
  - Diese Person erforschte vor etwa 1000 Jahren, wie Licht und unser Sehen funktionieren.
  - Mit Versuchen zeigte diese Person: Licht kommt von den Dingen in unsere Augen.
  - Grund: Satz 1: Zahl einheitlich „etwa 1000“ (stufen-pruefer, kinder-redaktion). Satz 2: Aha-Fassung der kinder-redaktion; die Karte sagt es genauso (paragraphs[1])
- **person-henrietta_swan_leavitt**
  - Diese Person verglich Fotos vom Sternenhimmel auf Glasplatten.
  - Dabei fand diese Person Sterne, die in einem festen Takt heller und dunkler werden.
  - Dieser Takt hilft, Entfernungen im Weltall zu messen.
  - Grund: Satz 2 und 3: kinder-redaktion (Muss, drei kurze Sätze statt Strichpunkt)
- **person-cecilia_payne_gaposchkin**
  - Diese Person untersuchte das Licht der Sterne, um herauszufinden, woraus Sterne bestehen.
  - Das Ergebnis von 1925: Sterne bestehen vor allem aus Wasserstoff und Helium.
  - Grund: Satz 2: kinder-redaktion (Muss); „Ergebnis“ erfüllt auch den fakten-pruefer (nicht „erklärte“)
- **person-rosalind_franklin**
  - Diese Person fand mit Röntgenstrahlen heraus, wie winzige Dinge ganz innen aufgebaut sind.
  - 1952 entstand im Team ein berühmtes Bild der DNA, des Bauplans in Zellen.
  - Grund: Satz 1: ohne „Stoffe“ (Kleiderstoff, stufen-pruefer und kinder-redaktion), neu gefasst. Satz 2: kinder-redaktion (Muss, ohne Gosling, „im Team“)
- **person-jocelyn_bell_burnell**
  - Diese Person fand mit einem Feld voller Antennen regelmäßige Signale aus dem Weltall.
  - Die Signale erschienen auf langen Papierstreifen, und der Fund war ein Zufall.
  - Grund: Satz 1: Werkzeug nach vorn (stufen-pruefer, Soll). Satz 2: ohne das falsche „dafür“ (fakten-pruefer, Muss), Papierstreifen und Zufall wie auf der Karte
- **person-octavia_butler**
  - Diese Person schrieb Geschichten über erfundene Welten und die Zukunft.
  - Solche Geschichten heißen Science-Fiction und stellen oft Fragen an unser Leben heute.
  - Grund: Satz 2: kinder-redaktion (Science-Fiction erklärt), „oft“ ergänzt, weil Science-Fiction nicht nur Zukunft ist
- **person-chien_shiung_wu**
  - Diese Person prüfte mit einem genauen Versuch, ob im Spiegelbild alles gleich abläuft.
  - Ende 1956 zeigte sich im Team: Beim Zerfall mancher Atomkerne ist das nicht so.
  - Grund: Satz 1: Spiegel-Fassung (kinder-redaktion Rückfall, stufen-pruefer). Satz 2: kinder-redaktion, „Ende 1956“ (fakten-pruefer)
- **person-lise_meitner**
  - Diese Person erklärte, wie ein winziger Atomkern in zwei Stücke zerbrechen kann.
  - Das gelang 1939 mit Otto Frisch, kurz nach der Flucht aus Deutschland.
  - Grund: beide Sätze: kinder-redaktion (Muss und Soll); Flucht bleibt in Satz 2 (stufen-pruefer, Einstein-Falle)
- **person-zaha_hadid**
  - Diese Person plante Gebäude mit ganz ungewöhnlichen Formen.
  - Dazu gehört ein Feuerwehrhaus in Weil am Rhein von 1993.
  - Grund: beide Sätze: kinder-redaktion (Kann und Soll)
- **person-ibn_sina**
  - Diese Person schrieb vor etwa 1000 Jahren ein großes Buch über Medizin.
  - Das Buch wurde viele hundert Jahre lang übersetzt und abgeschrieben.
  - Grund: Satz 1: Zahl einheitlich. Satz 2: kinder-redaktion (ohne „Kanon“)

Bewusst nicht übernommen:
- Wu „links und rechts unterscheiden“ (kinder-redaktion): Für 5- bis 7-Jährige abstrakter als der Spiegel, den sie kennen.
- Meitner mit Berlin und Flucht in Satz 1 (Alternative des Autors): Einstein-Falle (stufen-pruefer, kinder-redaktion).
- Hopper „mit Wörtern statt Zahlen“: steht nicht auf der Karte.
- Bell Burnell „wie ein Ticken“: ein Vergleich, der wie eine Tatsache klingt.
- Leavitt mit „hellere Sterne haben einen langsameren Takt“ (fakten-pruefer, Kann): fachlich der Kern, aber für Kinder ein Satz zu viel; das Weglassen ist laut fakten-pruefer zulässig.

## 3. Die neun vorhandenen Rätsel

- Armstrong, al-Chwarizmi, Tagore, Einstein: bleiben.
- **Mandela und Jemison** (Muss M2): Satz 1 trägt nicht allein (Apartheid unerklärt; Raumflug erst in Satz 2).
- **Darwin und Murasaki** (Soll S1): Satz 1 sagt nicht, wofür die Person bekannt ist.
- **Karl Benz** (Kann): „Motorwagen, also ein sehr frühes Auto“, damit Kleine bei Bertha und Karl nicht beide Male auf Bertha tippen.
- Neufassung dieser fünf schreibt gerade der `karten-autor` (Entwurf folgt als eigene Datei), danach dieselbe Nachprüfung wie Punkt 9.

## 4. Fallen der Runde (Befunde M1, S2, S3)

Heute: Entdecker zieht nur aus 20 Namen (16 Personen sind auf Entdecker nie falsch, ein Kind merkt das), Profi nimmt die fünf zeitlich nächsten (in 18 von 36 Fällen keine fachnahe Falle), beide Benz können zusammen kommen.

**Entscheidung:** Personen bekommen eine geprüfte Fallen-Liste je Person, genau wie Lebensraum und Nahrung (`world-game-tier-fallen.json`, Entscheidungsliste Teil B Punkt 6). Gleicher Baustein für gleiche Dinge.
- Entdecker: zwei Fallen aus einem deutlich anderen Gebiet, gezogen aus allen 36 Personen.
- Profi: drei Fallen, mindestens eine aus demselben Gebiet, sonst aus derselben Zeit; nie zwei aus derselben Familie (beide Benz).
- Die Ausschlussliste (`world-game-fallen.json`) gilt weiter.
- Entwurf der Liste: `karten-autor` (mit Gebiet je Person), Prüfung `stufen-pruefer` und `fakten-pruefer`. Ein Test prüft: genug Einträge je Stufe, keine Ausschluss-Paare, nie beide Benz, jede Person kommt auf Entdecker als Falle vor.
- Kompatibilität: `validWorldGameOrder` nimmt bei Erkennungsspielen schon jeden Namen aus dem Vorrat an; trotzdem `tests/fixtures/gespeicherte-antworten*.json` und die Personen-Altstände prüfen.

## 5. Tipp für Entdecker

Der Tipp ist heute für alle Stufen gleich und hilft Kleinen kaum („Vergleiche die genannte Tätigkeit oder Entdeckung …“). Entwurf eines einfachen Entdecker-Tipps schreibt der `karten-autor` mit Punkt 3.

## 6. Korrekturen an Karten (im selben PR)

- `person-cecilia_payne_gaposchkin`: Einleitung „erklärte“ → „berechnete“ (fakten-pruefer, Soll; passt zum Rätsel).
- `person-jane_goodall` und `person-marie_curie`: falsche Quellen (Lovelace- und Hopper-Seiten) entfernen.
- `person-bertha_benz`: toter DPMA-Link entfernen (Deutsches Museum trägt die Fahrt).
- `person-inge_lehmann`: toter Link; Ersatzkandidat `https://nbi.ku.dk/english/www/inge/lehmann/jordens-kerne/` vor dem Einbau abrufen.
- `person-jocelyn_bell_burnell`: Quelle für Antennenfeld, Papierstreifen und Zufall ergänzen (University of Cambridge, Journeys of Discovery: Pulsars).
- `person-henrietta_swan_leavitt`: nur eine Quelle; eine zweite verlässliche suchen (fakten-pruefer).
- Weil Kartentexte sich ändern: nach `pnpm run check` auch `node tests/browser/run.mjs --suite full core offline-cold-full` (CLAUDE.md, Prüfen).

## 7. Tests, die sich ändern

- `tests/world-game-runde.test.mjs` Zeile 180: Die Erwartung „Mit 26 Jahren begann diese Person“ (Goodall aus der Einleitung) fällt weg, weil Goodall ein eigenes Rätsel bekommt. Ersatz: ein Satz, der weiter aus einer Einleitung kommt (eine Person ohne eigenes Rätsel), sonst prüft der Test die Groß- und Kleinschreibung nicht mehr.
- `tests/world-game-learning-copy.test.mjs`: gilt für alle neuen Rätsel unverändert.
- Neu: Entdecker zeigt nur Satz 1, Profi alles; „Vorlesen“ liest den gezeigten Text.
- Vor dem Umbau alle betroffenen Tests suchen (Wortlaut der Rätsel, `personRecognitionClue`, `EIGENE_RAETSEL`, `gameSessions['world-game:people`) und in einem Durchgang anpassen.

## 8. Später (BACKLOG)

- Ein echtes Experten-Personenspiel fehlt (stufen-pruefer, Abschnitt 5): Reihenfolge auf dem Zeitstrahl, Knobelfall aus zwei Karten, „Fast richtig“. Kommt in die Ideen-Sammlung.
- Gleiches Muster prüfen für „Technik“ (Erfindungen): Auch dort nimmt Profi die fünf zeitlich nächsten.

## 9. Nachprüfung vor dem Einbau

Die Fassung aus Punkt 2 und die Neufassung aus Punkt 3 lesen `fakten-pruefer`, `kinder-redaktion` und `stufen-pruefer` noch einmal, je in einem kurzen Auftrag. Offene Fakten-Fragen dabei:
- Lovelace „vor etwa 180 Jahren“ und „geplante Rechenmaschine“
- Hopper „Befehle in Wörtern“, Satz 2 „frühe Programme, die Wörter … übersetzen“
- Berners-Lee „Internetseiten“, „Ende 1990 lief der erste Browser“
- Ibn al-Haytham „Licht kommt von den Dingen in unsere Augen“
- Wu „ob im Spiegelbild alles gleich abläuft“, „Ende 1956“
- Franklin „wie winzige Dinge ganz innen aufgebaut sind“
- Bell Burnell „Feld voller Antennen“, „der Fund war ein Zufall“
- Meitner „in zwei Stücke zerbrechen“, Cai Lun „Es heißt“, Merian „jüngsten Tochter“, Maathai ohne „dafür“
