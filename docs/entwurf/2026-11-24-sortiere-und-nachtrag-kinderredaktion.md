# Kinder-Redaktion: „Sortiere die Zeit“ Fassung 2 und Nachtrag Experte „Stimmt das wirklich?“ (24.11.2026)

Helfer: kinder-redaktion. Geprüft: Sortiere die Zeit Fassung 2 und Experten-Nachtrag Stimmt das wirklich?. Nichts geändert.

Ich habe nichts geändert. Gelesen habe ich beide Entwürfe, meinen früheren Bericht zum Zeitspiel, meinen Bericht zu „Stimmt das wirklich?“, `app/kern/woerter.ts`, die sichtbaren Texte in `app/world-games.tsx` sowie in `app/classic-questions.json` die Fragen zu Luft, Pilzen, Pflanzen und Wasser und die vorhandenen Experten-Fragen.

---

## A) „Sortiere die Zeit“, Fassung 2 – gut

Meine Vorschläge aus der Endfassung sind fast alle sauber umgesetzt. Seine vier Abweichungen überzeugen mich auch aus Sicht der Kinder, nämlich Profi-Tipp, ISS-Tipp, „Vorlesen“ und „Dein Spielstempel …“. Offen sind noch zwei Hinweise, die den Zielen der Fassung 2 widersprechen („Das erste Flugzeug“, die Römer-Null). Dazu kommen ein holpriger Name und Zeitwörter, die schnell veralten.

**Zu den Abweichungen (Abschnitt 9):**
- Profi-Tipp mit zwei Teilen: überzeugt. Beim engsten Paar hilft nur ein Vergleich, und ein einzelnes Teil hilft kaum.
- ISS: überzeugt. Mein Satz ordnete nur gegenüber dem Satelliten, und das sagt der Satelliten-Tipp schon. Der Ersatz „Erst flogen Menschen kurz zum Mond. Später wohnten sie lange im All.“ passt gut zum Namen „zieht … ein“.
- „Vorlesen“ und „Dein Spielstempel bleibt in deinem Entdeckerpass.“: überzeugt. Es ist derselbe Baustein wie in `Rounds` (Regel „Einheitlich“).
- E1 „lang Kaiser“, E2 Benzinmotor und „knifflig“ statt „schwer auseinanderzuhalten“: überzeugt.

**Befunde:**

1. **motoren, Tipp 1, Widerspruch zum Namen.** Beim Namen ist „erste“ bewusst gestrichen, im Tipp steht es wieder.
   alt: „Das erste Flugzeug hatte einen Benzinmotor. Den gab es vorher schon in Autos.“
   neu: „Das Flugzeug der Brüder Wright hatte einen Benzinmotor. Den gab es vorher schon in Autos.“

2. **ganz-frueh, Tipp 1, Römer und Null.** Der Satz sagt nichts über die Zeit. Ein Kind kann daraus nicht sicher schließen, dass Rom früher war. Mit „noch“ wird die Reihenfolge hörbar.
   alt: „Die Römer hatten kein Zeichen für die Null.“
   neu: „Die Römer kannten noch kein Zeichen für die Null.“
   Der `fakten-pruefer` soll mitlesen.

3. **`zeit-mikroskop`, Name.** „Zeichnungen aus dem Mikroskop“ klingt, als kämen die Bilder aus dem Gerät heraus.
   alt: „Robert Hooke zeigt Zeichnungen aus dem Mikroskop“
   neu: „Robert Hooke zeigt, was er im Mikroskop sah“ (8 Wörter)
   Der Hooke-Tipp mit „Mikroskop-Zeichnungen“ kann bleiben. „Zeichnungen“ ist ein Alltagswort.

4. **buch-bis-bahn, Kolumbus-Tipp.** 11 Wörter, und das Wichtige steht hinten. Zwei kurze Sätze sind leichter.
   alt: „Den Brief von Kolumbus über seine Reise druckte man viele Male.“
   neu: „Kolumbus schrieb einen Brief über seine Reise. Man druckte ihn viele Male.“

5. **Profi-Einleitung.** Bei frühen Teilen sieht das Kind keine Jahreszahl, sondern „vor etwa 4.600 Jahren“.
   alt: „… Die Jahreszahlen siehst du, wenn alles stimmt.“
   neu: „… Die Zeiten siehst du, wenn alles stimmt.“ (freiwillig)

6. **`vChrErklaerung`.** Auf Profi stehen „um 2550 v. Chr.“ und „im Jahr 628“ nebeneinander. Das Wort „Hier“ kann ein Kind auf alle Zahlen beziehen.
   alt: „… Hier zählt man rückwärts: Die größere Zahl ist früher.“
   neu: „… Vor dem Jahr 1 zählt man rückwärts: Die größere Zahl ist früher.“

7. **`rundeOhneStempel`** (gehört zu Offen 4). Fehlt der Stempel ohne Grund, wirkt das wie ein Fehler der Seite. Bleibt die strenge Regel, soll der Satz sie freundlich nennen.
   alt: „Diese Runde ist zu Ende. Willst du gleich noch eine spielen?“
   neu: „Diese Runde ist zu Ende. Den Stempel gibt es, wenn du beide Rätsel ohne Lösung schaffst. Noch eine Runde?“
   Aus Kindersicht empfehle ich aber den Stempel auch nach „Lösung zeigen“. Für den Stufen-Vorschlag zählt die Runde dann trotzdem nicht. Auf Experte frustriert die strenge Regel 8- bis 10-Jährige sonst schnell.

8. **`zeit-smartphone`, `erklaerung`.** „E-Mails“ ist englisch, das ist ein kleiner Punkt.
   alt: „… tippen und E-Mails schreiben.“
   neu: „… tippen und Nachrichten schreiben.“ (freiwillig; `fakten-pruefer`: Fax und Pager zählen als Nachrichten)

9. **motoren, Tipp 2, Rechtschreibung.** Gemeint sind „die ältesten Teile“, das Wort steht also klein.
   alt: „… sind hier die Ältesten.“
   neu: „… sind hier die ältesten.“

10. **Offen 1, Zeitwörter.** „vor 30 bis 70 Jahren“ ist ehrlicher als die Familienwörter, aber für 5-Jährige schwer. Sie müssen „ein paar hundert“ gegen eine Spanne aus zwei Zahlen abwägen, die sie oft noch nicht kennen. Außerdem stimmt die Angabe ab 2028 nicht mehr (Satellit dann 71 Jahre).
    Vorschlag für den Korb `spät`:
    alt: „vor 30 bis 70 Jahren“
    neu: „vor weniger als 100 Jahren“
    - Alle Teile im Korb passen, auch das Smartphone mit 32 Jahren.
    - Das Wort „hundert“ verbindet die Zeitwörter: Auch beim Hören ist klar, dass „weniger als hundert“ jünger ist als „ein paar hundert“.
    - Mit „vor 100 bis 200 Jahren“ gibt es keine Überschneidung, auch nicht bei der Rakete: 1926 sind genau 100 Jahre.
    - Der Satz stimmt bis 2057 und braucht keine jährliche Prüfung.
    „vor etwa 25 Jahren“ (ISS) kann bleiben. Es kommt nur auf Profi und Experte vor und nur nach dem Lösen, sollte aber im Code ab dem aktuellen Jahr gerechnet werden.

**Kann so bleiben:**
- **Namen:** alle übrigen, darunter „Bell bekommt ein Patent auf sein Telefon“, „Ein Forscher schreibt seine Idee für Internetseiten auf“, Webb mit „Fernrohr“ und „Farbbilder“, Newcomen und Wright.
- **Erklärzeilen:** die Patent-Erklärung (höchstens einmal je Rätsel) und die Satelliten-Erklärung. „Gerät im Weltall“ wiederholt den Namen nicht. Ob „Wasserball“ für „beach ball“ passt, prüft der `fakten-pruefer`.
- **Wörter:** „knifflig“ ist ein bekanntes Kinderwort. „Patent“ bleibt mit Erklärzeile. „Satellit“ und „Besatzung“ kommen nur auf Profi und Experte vor, „Satellit“ auf Entdecker mit dem Zusatz „kreist um die Erde“ im Namen. „v. Chr.“ wird beim Vorlesen ausgeschrieben und ist neutral erklärt.
- **`nachDemLoesen`:** Die Regel „kein Zeitwort nach ‚vor …‘“ und `jahrGenau` in einer zweiten Zeile sind gut gelöst.
- **Sonstige Texte:** Spielliste, Mission, Zähler, alle drei Rückmeldungen für Entdecker und Profi, `experte`, `richtig`, `geschafft` (passt zu `WOERTER.geschafft`), `loesungText`, beide Tipp-Sätze, alle übrigen Experte-Tipps und die Rückfall-Sätze.

---

## B) Nachtrag Experte „Stimmt das wirklich?“ – gut

Beide Fragen sind echte Denkaufgaben mit plausiblen Fallen, und der Ton passt zu den vorhandenen Experten-Fragen. Zwei Tipps verraten die Lösung über ein gleiches Wort oder einen Gegensatz. Bei der Chipstüte verwirrt der Wechsel von „Luft“ zu „Gas“, und das Bild „prall wie ein Kissen“ passt nicht.

**Befunde:**

1. **pilze-3, Tipp 1, Wortverrat.** „wachsen“ steht nur im Tipp und in der richtigen Antwort („auf dem sie wachsen“).
   alt: „Denk an den Wald. Worauf wachsen dort viele Pilze?“
   neu: „Denk an den Wald. Wo findest du dort viele Pilze?“

2. **luft-3, Tipp 2, Verrat über „drinnen oder draußen“.** Wer „draußen“ denkt, findet die einzige Antwort mit „außen“. Ein Vergleich zum Ausprobieren lässt das Kind selbst schließen.
   alt: „In der Tüte ist oben genauso viel Gas wie im Tal. Was ist also oben anders: drinnen oder draußen?“
   neu: „Drück einen Luftballon mit beiden Händen zusammen. Was passiert, wenn du loslässt?“

3. **luft-3, „Gas“ statt „Luft“.** Für Kinder ist „Gas“ das vom Herd. Das Wort taucht ohne Erklärung auf, während Frage und Antworten von Luft sprechen.
   alt (why): „Das Gas in der Tüte drückt nach außen und dehnt sich aus.“
   neu: „Die Luft in der Tüte drückt nach außen und dehnt sich aus.“
   Der `fakten-pruefer` soll mitlesen. Stickstoff ist der größte Teil der Luft, darum halte ich das für vertretbar.

4. **luft-3, Frage.** Ein Kissen ist weich und nicht prall. Ein Ballon passt auch zum „warum nicht“ bei der Antwort mit den Löchern.
   alt: „… Oben auf einem hohen Berg ist sie prall wie ein Kissen. Warum?“
   neu: „… Oben auf einem hohen Berg ist sie prall wie ein Ballon. Warum?“

5. **pilze-3, zwei ähnliche Fallen** (Hinweis für den `stufen-pruefer`). „Licht“ und „Luft wie grüne Blätter“ prüfen beide denselben Irrtum: Pilze seien wie Pflanzen. Auch ihre „warum nicht“-Sätze klingen ähnlich (Grün, Licht). Für die Sprache ist das kein Muss. Ein Ersatz wäre aber besser, wenn der `stufen-pruefer` eine andere echte Fehlvorstellung findet.

6. **pilze-3, „why“.** „feinen Fäden“ kommt ohne Brücke. Bei `pilze-2` heißen sie „Pilzfäden“, das gleiche Wort ist einheitlicher.
   alt: „Ihre feinen Fäden zerlegen ihn …“
   neu: „Ihre feinen Pilzfäden zerlegen ihn …“

**Offen 3, „Mist“: bleibt.** Das Wort ist ehrlich, Kinder kennen es vom Bauernhof, und es ist kein Schimpfwort. Ein Kichern macht den Satz eher merkbar. „Stroh und Heu“ wäre unvollständig. Wer es noch anschaulicher will, nimmt „aus Stroh und Pferdemist“, das deckt die Penn-State-Quelle („horse manure“).

**Kann so bleiben:**
- **luft-3:** alle Antworten und alle drei „warum nicht“, Tipp 1 und das übrige „why“.
- **pilze-3:** die Frage, alle Antworten, das „warum nicht“ zu Licht, Wasser und Luft sowie Tipp 2. Tipp 2 ist stark, aber als zweiter Tipp in Ordnung.
- **wasser-2:** Die neue Falle „Ja, denn Wolken entstehen nur über dem Meer“ ist plausibel. Ihr „warum nicht“ ist anschaulich („türmen sich … auf“) und beschämt nicht. Richtig ist auch, „Ja, denn im Meer verdunstet das meiste Wasser“ nicht zu nehmen: Ein „Noch nicht ganz“ auf eine wahre Begründung würde Kinder verwirren.
- **Gruppe `nahrung` für pflanzen-3:** aus Textsicht nötig.
- **Ton und Satzlänge:** passen zu `jahreszeiten-3`, `meer-4` und `pflanzen-3`. Beide neuen Fragen kommen ohne „Ein Kind sagt“ aus, das im Vorrat schon oft vorkommt.

---

## Unsicher

- Ob Sachaussagen stimmen, gehört zum `fakten-pruefer`: „in Richtung Weltall“ für Goddard, „Wasserball“, „noch kein Zeichen für die Null“, „Luft“ statt „Gas“ und „Nachrichten“ beim Smartphone.
- Ob 5-Jährige Zeitwörter mit und ohne Zahlen gern ordnen, zeigen nur echte Kinder.
- Auf Entdecker sieht das Kind die Satelliten-Erklärung erst nach dem Lösen (Regel C3 des Nutzers). Beim Sortieren hilft nur der Name, darum ist dort Vorlesen durch Erwachsene wichtig.

Dateien:
- /home/user/wunderkompass/docs/entwurf/2026-11-24-sortiere-die-zeit-fassung-2.md
- /home/user/wunderkompass/docs/entwurf/2026-11-24-stimmt-das-experte-nachtrag.md
- /home/user/wunderkompass/app/classic-questions.json
- /home/user/wunderkompass/app/kern/woerter.ts
- /home/user/wunderkompass/app/world-games.tsx
