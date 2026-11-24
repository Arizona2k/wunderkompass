# Stufen-Prüfung E14: „Rekorde“, „Wetter und Klima“, „Sortiere die Zeit“

Helfer: `stufen-pruefer`, 24.11.2026. Bericht unverändert gesichert (nur lokale Pfade entfernt). Der Helfer hat nichts geändert; Messungen liefen mit `node -e` über die JSON-Daten im Scratchpad, nicht im Repository.

Geprüft wurden: `docs/entwurf/2026-11-24-rekorde-entwurf.json`, `docs/entwurf/2026-11-24-rekorde-karten-autor.md`, `docs/entwurf/2026-11-24-wetter-zeit-karten-autor.md`. Regeln: `docs/entwurf/2026-11-23-phase-1-ergaenzung-stufen.md`, `docs/entwurf/2026-11-23-phase-1-teilschritt-3.md` (E3, E4, E14), `docs/entwurf/2026-11-24-teil-b-entscheidungen.md` (Punkt 8, Kreuz und quer). Code: `app/world-games.tsx`, Zeilen 55 und 56 (`TIME_IDS`, `Chronology` ohne Stufe).

Zum Zusammenspiel mit den anderen Berichten: `2026-11-24-drei-spiele-kinder-redaktion.md`, `2026-11-24-rekorde-fakten-pruefer.md`, `2026-11-24-wetter-zeit-fakten-pruefer.md`. Wo sich Vorschläge widersprechen, entscheidet Claude beim Einbau; die neuen Fakten in diesem Bericht sind **noch nicht** geprüft (Abschnitt 5).

## 1. Gesamteindruck

Die Entdecker-Aufgaben von „Rekorde“ und die Wetter-Zeichen sind gut für 5- bis 7-Jährige. Klimazonen, Ozean-Namen und Wetter-oder-Klima-Sätze sind dagegen eher Profi.

Profi ist an mehreren Stellen nicht schwerer als Entdecker:
- Die Falle `falsch[2]` ist oft leicht zu erkennen (Bewölkt, Tau, Hagel, Strauß bei der Giraffe).
- Bei Subtropen und Kilimandscharo steht die Lösung schon halb in der Frage.
- Zwei Tipps machen die Profi-Falle wertlos (Nil, Eis).

Von den vier Experte-Aufgaben ist nur `rekord-messregel-berg` eine echte Knobelei. `rekord-fairer-vergleich` und `wetter-berg-eis` kommen nach den Änderungen unten dazu. `wetter-ein-tag` ist Profi.

Bei „Sortiere die Zeit“ ist die Idee gut. Experte wäre aber nach einer Runde auswendig gelernt (nur 3 feste Gruppen), und die Jahreszahlen müssen versteckt werden.

**Die Zählungen der Autoren stimmen.** Rekorde Profi (15 Aufgaben mit 4 Antworten): die richtige ist nie die einzige längste und zweimal die einzige kürzeste (13 %). Rekorde Entdecker: 0 % und 0 %. Wetter Entdecker (9 Aufgaben): 22 % längste und 33 % kürzeste. Wetter mit 4 Antworten: 13 % und 13 %.

Das Längenmuster bei den Klimazonen nutzt nichts: Dieselben drei bzw. vier Namen stehen in jeder Zonenfrage, jeder Name hat also immer dieselbe Länge. Dass die richtige Antwort bei Rekorde kaum je die einzige längste ist, ist auch kein lernbares Muster. Es sind fast nur kurze Namen, und es gibt viele Gleichstände.

**Die echten Muster liegen woanders:**
- Ein Wort der Frage steht in der Antwort (Subtropen, Kilimandscharo, „Polen“ und „Polarzone“).
- Tipps verraten die Lösung.
- Zwei falsche Antworten sagen dasselbe (beim Falken).
- Fallen, die eigentlich Quatsch sind.

## 2. Einstufung

### Rekorde

| ID | Empfehlung | Begründung |
|---|---|---|
| animal-blue-whale | Entdecker (Profi geht mit Walhai) | kennt fast jedes Kind; Walhai ist eine echte Profi-Falle |
| animal-african-savanna-elephant | Entdecker (Profi geht mit Waldelefant) | machbar; Waldelefant ist eine gute Denkfalle (Savanne ist offen, Wald eng) |
| animal-cheetah | Entdecker (Profi geht mit Strauß) | gut |
| animal-giraffe | nur Entdecker, nicht in den Profi-Vorrat | Strauß ist schwächer als die Entdecker-Falle Elefant; auf Profi zu leicht |
| rekord-hoechster-berg | Entdecker, nur mit den Änderungen unten | „Mont Blanc“ und „Kilimandscharo“ kennt ein 6-jähriges Kind nicht; der Tipp hilft ihm nicht |
| rekord-groesster-ozean | **Profi** | Ozean-Namen sind Wissen ab etwa 8; für Kleine nur Raten |
| rekord-groesster-vogel | Entdecker (Profi geht mit Emu) | gut; der Tipp passt auf Profi auch zum Emu und verrät dort nichts |
| rekord-tiefste-stelle | Profi | gut nach Tausch von „Nordsee“ |
| rekord-wasserreichster-fluss | Profi | gute Falle Nil, aber der Tipp nimmt sie weg |
| rekord-groesste-wueste | Profi | gute Falle Gobi (auch eine kalte Wüste), aber der Tipp nimmt sie weg |
| rekord-tiefster-see | Profi | reine Merkfrage; vertretbar, siehe „Unsicher“ |
| rekord-sturzflug | Profi | Turmfalke und Mauersegler sind sehr gute ähnliche Fallen |
| rekord-groesster-fisch | Profi | sehr gut: Blauwal ist kein Fisch, Riesenhai der zweitgrößte Fisch |
| rekord-fairer-vergleich | Experte, nur mit neuen falschen Antworten | sonst bleibt nach dem Ausschließen ein 50:50 übrig, und die Falle ist nicht eindeutig falsch |
| rekord-messregel-berg | Experte | echte Denkfrage; Tipp 1 und eine falsche Antwort ändern |

### Wetter und Klima

| ID | Empfehlung | Begründung |
|---|---|---|
| wetter-regen, wetter-schnee, wetter-wind, wetter-sonnig | Entdecker, **nicht** in den Profi-Vorrat | ideal für 5 bis 7; die Profi-Fallen (Hagel, Tau, Bewölkt) widersprechen der Frage offen |
| wetter-nebel | **Entdecker** | „Wolke am Boden“ zu „Nebel“ ist Erkennen; der Tipp löst sie; für Profi zu leicht |
| wetter-klima-wort | **Profi** | „Klima“ ist ein Begriff aus der Schule; „Das Wetter“ steht als Wort in der Frage und lockt Kleine falsch |
| wetter-satz-heute | Entdecker, nur mit neuer Frage (unten), sonst Profi | „Welcher Satz erzählt vom Wetter?“ ist für Kinder ohne Klima-Begriff doppeldeutig, denn „Im Regenwald regnet es oft“ ist für sie auch Wetter |
| wetter-satz-klima | Profi, nur mit stärkerer Falle | heute löst man sie mit „Satz ohne Zeitwort“; die Falle „Diesen Winter“ hat selbst ein Zeitwort |
| wetter-zone-gemaessigt, wetter-zone-tropen, wetter-zone-polar | Entdecker, oberes Ende | lösbar über Merkwörter (Deutschland, Regenwald, Eisbär) und Ausschließen; „gemäßigt“ ist für 6-Jährige ein fremdes Wort |
| wetter-zone-subtropen | Profi, nur mit neuer Frage | heute nennt die Frage Tropen und gemäßigte Zone als Nachbarn; beide fallen weg, „Tropen“ ist darum keine Falle |
| wetter-ein-tag | **Profi** | ein einziger Begriff angewandt, nichts verbunden; zwei falsche Antworten sind Quatsch oder Übertreibung |
| wetter-berg-eis | Experte, nur mit den Änderungen unten | verbindet „Äquator ist warm“ mit „oben ist es kalt“; heute verraten Frage und Tipp 1 die Lösung |

## 3. Befunde und Vorschläge

### Rekorde

1. **Der Falke (`rekord-fairer-vergleich`):** So wie die Antworten heute sind, ist die Aufgabe **unfair, nicht knifflig**.
   - „Der Falke jagt am Himmel, der Gepard am Boden“ ist kein eindeutig falscher Grund. „Sie bewegen sich in verschiedenen Welten“ ist im Alltag ein richtiger Grund, warum ein Vergleich hinkt. Klar falsch wird die Antwort nur, wenn man weiß, dass der Falke im normalen Flug langsam ist. Das steht erst im `warum`.
   - Dazu kommt: `falsch[0]` und `falsch[1]` sagen beide „er ist leicht“ und fallen deshalb zusammen weg. Es bleiben die zwei Sätze in der Form „Der Falke …, der Gepard …“, also ein 50:50.
   - Vorschlag. Richtig bleibt: „Der Falke stürzt nach unten, der Gepard rennt.“ Neue falsche Antworten:
     - `falsch[0]` „Der Falke ist viel leichter als der Gepard.“ (bleibt)
     - `falsch[1]` „Der Falke jagt kleinere Tiere als der Gepard.“
     - `falsch[2]` „Der Falke fliegt lange so schnell, der Gepard nur kurz.“ (gleiche Satzform wie die richtige Antwort, prüft genau den Kern, eindeutig falsch)
   - Längen danach: 46 / 43 / 45 / 55 Zeichen. Die richtige ist weder die längste noch die kürzeste.
   - Tipp 1 bleibt. Tipp 2 verrät viel, das ist auf Experte erlaubt.

2. **`rekord-messregel-berg`:**
   - Tipp 1 „Überlege, wo man mit dem Messen anfängt.“ verrät die Lösung. Neu: „Wie viel vom Mauna Kea siehst du, wenn du am Strand stehst?“
   - `falsch[2]` „Der Mauna Kea steht mitten im Meer.“ ist der richtige Grund in Kindersprache, nur unvollständig. Neu: „Auch der Everest ist vom Fuß aus höher.“ (Fehlvorstellung; der Everest ragt von seinem eigenen Fuß aus nur etwa 3.600 bis 4.600 Meter auf; **vom `fakten-pruefer` prüfen lassen**.)
   - Damit die richtige nicht die kürzeste ist: `falsch[1]` kürzen auf „Der Everest ist der ältere Berg.“
   - „Vulkan, kein Berg“ bleibt, das ist eine gute Kinder-Fehlvorstellung.

3. **`rekord-wasserreichster-fluss`:** Der Tipp „Achte auf die Wassermenge, nicht auf die Länge.“ streicht die Falle Nil. Neu: „Viel Wasser hat ein Fluss dort, wo es sehr viel regnet.“

4. **`rekord-groesste-wueste`:** Der Tipp „Auch Eis kann in einer Wüste liegen.“ löst die Aufgabe. Neu: „Eine Wüste muss nicht heiß sein.“ Dann bleibt die Gobi als echte Falle.

5. **`rekord-tiefste-stelle`:**
   - „Nordsee“ ist für Profi fast Quatsch. Neu: „Mittelmeer“.
   - Der Tipp schließt mit „größter Ozean“ und „weit weg von Europa“ alles bis auf die Lösung aus. Neu: „Die tiefsten Stellen sind lange, schmale Rinnen im Meeresboden.“

6. **`rekord-hoechster-berg`:**
   - Entdecker-Fallen neu: `falsch[0]` „Zugspitze“ statt „Mont Blanc“ („Mount“ und „Mont“ sehen für Leseanfänger gleich aus; die Zugspitze kennen Kinder aus Deutschland).
   - Tipp neu: „Sein Name fängt mit „Mount“ an. Er liegt weit weg in Asien.“

7. **`animal-african-savanna-elephant`:** Der Tipp „Welches dieser Tiere ist am schwersten?“ wiederholt nur die Frage. Neu: „Denk an das Tier mit den riesigen Ohren.“

8. **`animal-giraffe`:** Der Tipp „Gemessen wird vom Boden bis zum Kopf.“ hilft Kleinen nicht. Neu: „Dieses Tier frisst Blätter ganz oben aus den Bäumen.“ Nicht in den Profi-Vorrat aufnehmen.

9. **Die Falle „Strauß“ kehrt wieder:** dreimal als falsche Antwort, einmal als richtige (größter Vogel). Ohne die Giraffe im Profi-Vorrat bleibt es bei einmal falsch und einmal richtig. In Ordnung.

10. **Bekanntheitsmuster:** Wer nicht weiß, kann „die bekannteste Antwort ist der Rekord“ raten. Profi-Fallen sollten selbst bekannt sein. Bei Nil, Sahara, Blauwal und Atlantik gut. Beim Baikalsee sind alle vier Seen unbekannt (siehe „Unsicher“).

11. **Was eine Aufgabe über eine andere verrät** – diese Paare nie in derselben Runde (Ausschlussliste wie in Aufgabe 8):
    - `rekord-fairer-vergleich` und `rekord-sturzflug`
    - `rekord-messregel-berg` und `rekord-hoechster-berg`
    - aus den neuen Experte-Aufgaben (Abschnitt 4): Everest im Graben und `rekord-tiefste-stelle`; Amazonas und Nil und `rekord-wasserreichster-fluss`
    - Füllt Experte nur mit Profi-Aufgaben auf (Punkt 22), sind beim Berg und beim Gepard die Entdecker-Aufgaben von selbst draußen.

### Wetter und Klima

12. **`wetter-zone-subtropen`:**
    - Neue Frage: „Viele große, heiße Wüsten liegen in derselben Klimazone. Welche ist es?“
    - Neuer Tipp: „Diese Wüsten liegen nicht direkt am Äquator, sondern ein Stück weiter nördlich oder südlich.“
    - Erst so wird „Tropen“ eine echte Falle.
    - `fakten-pruefer` fragen: Die Sahara reicht bis in die Tropen (Vier-Zonen-Modell der Schule sollte halten).

13. **`wetter-berg-eis`:**
    - „oben“ steht in Frage und richtiger Antwort, Tipp 1 gibt die Lösung praktisch vor.
    - Tipp 1 neu: „Am Äquator gibt es keinen Winter wie bei uns.“
    - Tipp 2 neu: „Denk an die Alpen: Wo liegt im Frühling noch Schnee?“
    - Falsche Antworten ersetzen („Der Wind bringt Eis vom Nordpol.“ ist Quatsch, „Auf den Gipfel scheint nie die Sonne.“ hat „nie“):
      - „Oben scheint die Sonne schwächer.“ (Fehlvorstellung, oben ist sie sogar stärker; **prüfen**)
      - „Oben liegt der Berg im Schatten der Wolken.“
    - Längen danach: 35 / 35 / 43 / 33 Zeichen.

14. **`wetter-ein-tag`, jetzt Profi:** Beide Tipps verraten die Lösung. „Polarzone“ ist Quatsch, „immer“ eine Übertreibung. Neue falsche Antworten:
    - „Das Klima hat sich heute geändert.“ (bleibt)
    - „Im Juli ist es hier meistens kalt.“
    - „Morgen wird es bestimmt auch kalt.“

15. **`wetter-satz-klima`:** Die Regel „ein Zeitwort heißt Wetter“ muss brechen. Neue richtige Antwort: „Im Sommer ist es in Spanien meist heiß.“ Die anderen länger fassen: „Morgen wird es in Kiel stürmisch und kalt.“ und „Heute Mittag gibt es bei uns ein Gewitter.“ Dann ist „Diesen Winter lag hier kaum Schnee.“ eine echte Falle.

16. **`wetter-satz-heute`, wenn es Entdecker bleiben soll:** Neue Frage: „Welcher Satz passt zu einem Blick aus dem Fenster?“

17. **`wetter-zone-polar`:** „Nahe den Polen“ hört ein 6-jähriges Kind als das Land Polen. Neu: „Am Nordpol und am Südpol steht die Sonne tief. Die Winter sind lang.“

18. **`wetter-nebel`, jetzt Entdecker:** Entdecker sieht Hagel und Regen (Regen statt Tau als `falsch[1]`). Profi-Falle: Tau. „Raureif“ ist für alle Stufen zu fachlich.

19. **`wetter-wolke`:** „Aus Rauch von vielen Feuern“ ist für Profi nahe an Quatsch. Die Falle „unsichtbarer Wasserdampf“ ist hervorragend; so lassen.

20. **Profi-Vorrat Wetter:** Nach den Wechseln gibt es 6 eigene Profi-Aufgaben. Bei 8 Aufgaben je Runde reicht das nicht. Zum Auffüllen nur die drei Zonen nehmen, nie Regen, Schnee, Wind, Sonnig oder Nebel. Besser 2 bis 3 neue Profi-Aufgaben, z. B. „Was ist Tau?“ oder „Wann siehst du einen Regenbogen?“.

### Experte-Vorrat und wie Experte zieht

21. **Mit 2 Experte-Aufgaben** wäre jede Experte-Runde gleich. Ab Runde 2 ist das Auswendigwissen.

22. **Empfehlung: dieselbe Regel wie bei Kreuz und quer, mit derselben Satz-Ansage.** Drei Bedingungen:
    - (a) Experte erst anbieten, wenn ein Spiel **mindestens 4 echte Experte-Aufgaben** hat. Bis dahin gilt E3: „Experte gibt es hier noch nicht. Du spielst Profi.“
    - (b) Je Runde höchstens 3 Experte-Aufgaben, die über `waehleAufgaben` wechseln.
    - (c) Aufgefüllt wird nur mit Profi-Aufgaben, nie mit Entdecker-Aufgaben, und mit der Ausschlussliste aus Punkt 11.

    Mit den neuen Aufgaben aus Abschnitt 4 kommt Rekorde auf 4 und Wetter auf 3 Experte-Aufgaben. Wetter braucht also noch eine. Experte-Aufgaben als Bonus in Profi-Runden einzustreuen, rät der Helfer ab (dritte Regel, Experten-Stern unklar).

### Sortiere die Zeit

23. **Widerspruch im Entwurf:** E14 sagt „je Runde 5“, E4 sagt 3 / 4 / 4 Teile. Empfehlung nach E4 mit **2 Rätseln je Runde**: Entdecker 2 × 3 Teile, Profi 2 × 4 Teile, Experte 2 Gruppen × 4 Teile aus verschiedenen Gruppen. Jedes Rätsel zählt beim ersten Prüfen als eine Antwort (Vorschlag S3).

24. **Jahreszahlen bis zum Prüfen verstecken, auf allen Stufen.**
    - Entdecker: Der Hinweis zeigt ein Zeitwort je Teil statt der Zahl („vor sehr, sehr langer Zeit“, „vor einigen hundert Jahren“, „vor nicht so langer Zeit, als Oma und Opa jung waren“). Dafür braucht jedes Teil ein kleines neues Feld, je Zeitkorb gleich.
    - Profi: Auf Wunsch zeigt der Hinweis die Jahreszahl eines Teils.
    - Experte: die zwei Tipps.
    - Nach dem Prüfen: Jahreszahl und Zeitwort.
    - Rückmeldung bei Fehler je Stufe: Entdecker – richtige Teile werden grün und bleiben stehen; Profi – „2 von 4 stehen richtig.“; Experte – nur „Noch nicht ganz. Was war zuerst da?“
    - Heute hat `Chronology` in `app/world-games.tsx` keine Stufe, keine Stufenzeile und keine Vorschläge. Das muss mit dazu, ebenso „Zurück zu Entdecker“.

25. **Aus welchen Zeiten gezogen wird:**
    - **Entdecker:** Zwischen Bahn (1825) und Telefon (1876) liegen nur 51 Jahre; Papier (105) ist eher eine Profi-Überraschung. Darum je ein Teil aus drei Körben (24 Kombinationen, kleinster Abstand 245 Jahre): früh – Schrift, Pyramide; Mitte – Buchdruck, Fernrohr, Dampfmaschine; spät – Satellit, Mondlandung, Web, ISS.
    - **Profi:** 4 Teile, je eines aus „ganz früh“, „Buch bis Bahn“, „Motoren“, „Weltall und Netz“, mit Papier im ersten Fenster (192 Kombinationen).

26. **Die Experte-Gruppen:**
    - **Abwechslung:** 3 feste Gruppen zu je 4 Teilen sind nach dem ersten Prüfen gelernt. Gruppen mit 5 bis 6 Teilen, davon 4 gezogen. Ergänzungen aus vorhandenen Karten (Daten vom `fakten-pruefer` bestätigen lassen): Buch bis Bahn – `history-voyages1492` (1492); Weltall und Netz – `invention-smartphone`, `history-webb` (2022); eine vierte Gruppe „ganz früh“ mit Schrift, Pyramide, Papier und `zeit-null` (628). **Nicht** `history-electric_light` (1879) zu Telefon (1876).
    - **Tipps:** Buch bis Bahn – Tipp 2 neu: „Der Buchdruck ist das Älteste in dieser Gruppe.“ Motoren – Tipp 1 neu als echte Abhängigkeit: „Das erste Flugzeug flog mit einem Motor, wie er auch in Autos steckt.“ (prüfen). Weltall und Netz – beide gut. Ganz früh: Tipp 1 „Beim Bau der großen Pyramide schrieben Arbeiter ein Tagebuch.“ (Papyrus des Merer; prüfen), Tipp 2 „Papier ist älter als das Rechnen mit der Null.“
    - **Teilname** „Erste Rakete mit flüssigem Treibstoff“ muss so genau bleiben.

## 4. Lücken: neue Experte-Aufgaben (Entwürfe für den `karten-autor`, Fakten noch ungeprüft)

**Rekorde:**

- **Everest im Graben.** Frage: „Der Marianengraben ist etwa 11 km tief, der Everest etwa 9 km hoch. Du stellst den Everest in den Graben. Was gilt?“ Richtig: „Seine Spitze bleibt etwa 2 km unter Wasser.“ Falsch: „Seine Spitze ragt etwa 2 km aus dem Wasser.“ / „Seine Spitze ist genau an der Oberfläche.“ / „Seine Spitze bleibt etwa 20 km unter Wasser.“ Tipp 1: „Was ist größer: 11 oder 9?“ Tipp 2: „11 minus 9.“
- **Amazonas und Nil.** Frage: „Der Nil und der Amazonas sind etwa gleich lang. Trotzdem führt der Amazonas viel mehr Wasser. Warum?“ Richtig: „Wo er fließt, regnet es sehr viel.“ Falsch: „Er fließt in ein größeres Meer.“ / „Er ist viel älter als der Nil.“ / „Er hat mehr Kurven als der Nil.“ Nicht „schneller“ oder „breiter“ nehmen. Tipp 1: „Woher bekommt ein Fluss sein Wasser?“ Tipp 2: „Der Amazonas fließt durch den Regenwald, der Nil lange durch die Wüste.“

**Wetter:**

- **Regenbogen am Morgen.** Frage: „Am Morgen siehst du einen Regenbogen. In welcher Richtung?“ Richtig: „Im Westen, denn die Sonne steht im Osten.“ Falsch: „Im Osten, denn dort geht die Sonne auf.“ / „Im Süden, denn dort steht die Sonne mittags.“ / „Im Norden, denn dort ist der Himmel heller.“ Tipp 1: „Wo steht die Sonne am Morgen?“ Tipp 2: „Ein Regenbogen steht der Sonne gegenüber. Die Sonne ist hinter dir.“
- **Hagel im Sommer.** Frage: „Hagel ist Eis. Trotzdem fällt er bei uns meist im Sommer. Warum?“ Richtig: „Hagel entsteht in Gewittern, und die gibt es meist bei Wärme.“ Falsch: „Im Winter ist es für Hagel zu kalt.“ / „Im Sommer fällt mehr Regen, der dann gefriert.“ / vierte Antwort offen. Quelle: NSSL Hail steht schon im Entwurf.
- **Abgeraten:** eine Australien-Frage zu den Jahreszeiten (`science-seasons` beantwortet sie fast wörtlich).

**„Fast richtig“ (Art 2)** passt gut zu Rekorde (z. B. „Der Nil ist der wasserreichste Fluss.“). Das Quiz kann das heute nicht; fürs BACKLOG, nicht für jetzt.

## 5. Unsicher

- Ob 6-Jährige „Mount Everest“ kennen oder nur der Elternteil hilft. Ob 8- bis 10-Jährige den Baikalsee je gehört haben.
- Ob Entdecker mit versteckten Jahreszahlen und Zeitwörtern Spaß haben oder es frustrierend finden (ein `spieltester`-Lauf kann Hinweise geben, endgültig nur echte Kinder).
- Ob die Experte-Aufgaben 11- bis 12-Jährigen Spaß machen oder als „Trickfrage“ ärgern.
- Ungeprüfte Fakten in den Vorschlägen (Sache des `fakten-pruefer`): Everest von seinem Fuß aus; Sonne oben stärker; Regenbogen gegenüber der Sonne; Hagel und Gewitter; Flugzeugmotor der Wrights; Tagebuch des Merer; Sahara in Subtropen und Tropen.
