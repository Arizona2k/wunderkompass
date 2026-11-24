# Stufen-Prüfung: Zeitspiel Fassung 2 und Nachtrag „Stimmt das wirklich?“ für Experte (24.11.2026)

Helfer: stufen-pruefer. Geprüft: Sortiere die Zeit Fassung 2 und Experten-Nachtrag Stimmt das wirklich?. Nichts geändert.

Ich habe nichts geändert. Gezählt habe ich mit `node -e` direkt aus den JSON-Blöcken der Entwürfe. Den Code der Folge habe ich gelesen: `app/kern/stufe.ts`, `app/kern/stufen-vorschlag.tsx`, `neueKlassikRunde` und `app/kern/auswahl.ts`.

---

## A) „Sortiere die Zeit“, Fassung 2

**Ergebnis:** P1 bis P3, E1 bis E4 und D1/D2 sind sauber umgesetzt. Die drei Stufen sind jetzt klar getrennt: Entdecker mindestens 132 Jahre Abstand mit Zeitwort-Tipp, Profi mindestens 50 Jahre ohne Zahlen, Experte 10 bis 23 Jahre mit Denk-Tipps. Es bleiben zwei kleine Tipp-Lücken (buch-bis-bahn und weltall-netz) und eine Ergänzung zu E6.

**Zahlen aus Abschnitt 8: alle bestätigt.**
- **Entdecker:** 48 Rätsel, 432 Runden, kleinster Abstand 132 Jahre.
- **Profi:** 21 Teile im Vorrat. Bei 50 Jahren gibt es 2.815 Rätsel (2.155 mit 2 Teilen aus einem Fenster), 1.511.194 Runden, kleinster Abstand 50 Jahre. Bei 30 Jahren sind es 3.769 Rätsel, kleinster Abstand 31.
- **Experte:** 5 + 15 + 5 + 5 = 30 Rätsel, 300 Runden.
- Die Häufigkeiten stimmen: Satellit 370-mal, Rom 682-mal.
- **Alle Tipp-Zuordnungen in Abschnitt 4 stimmen**, mit einer Ausnahme (Befund A2).

**Befunde**

- **A1 · buch-bis-bahn, `tipp2`:** Hier gibt es nur die Vorlage „Ganz nach oben gehört …“.
  - In 10 von 15 Ziehungen nennt sie den Buchdruck. In 6 davon hat Tipp 1 schon „Buchdruck vor Karibik“ geordnet. Der zweite Tipp hilft dann fast nicht.
  - Drei Paare bleiben oft ohne Hilfe: Mikroskop/Dampfmaschine (47 Jahre) in 6 Ziehungen, Fernrohr/Mikroskop (57) in 4, Karibik/Fernrohr (116) in 3. Für Karibik/Fernrohr gibt es zwar einen Tipp, aber nur in `tipp1`, und dort kommt zuerst der Buchdruck dran.
  - **Vorschlag**, `tipp2` vor der Vorlage ergänzen (⚠ `fakten-pruefer`, `kinder-redaktion`):
    - `{"braucht":["zeit-karibik","zeit-fernrohr"],"text":"Kolumbus hatte noch kein Fernrohr an Bord."}` (die Regel „Tipp 2 ≠ Tipp 1“ fängt Doppeltes ab)
    - `{"braucht":["zeit-fernrohr","zeit-mikroskop"],"text":"Das Fernrohr wurde über 50 Jahre vor Hookes Zeichnungen beschrieben."}`
    - `{"braucht":["zeit-mikroskop","zeit-dampfmaschine"],"text":"Hookes Zeichnungen waren schon über 40 Jahre alt. Dann kam Newcomens Dampfmaschine."}`
  - Nachgezählt: Die Paare ohne Tipp sinken von 25 auf 19, Mikroskop/Dampfmaschine von 6 auf 3. Ein reiner Wissens-Tipp ist auf Tipp 2 in Ordnung, wie bei „Das Telefon kam zehn Jahre vor dem Auto.“

- **A2 · weltall-netz, Abschnitt 8 „Internetseiten/ISS, jetzt mit Tipp“:** Das stimmt nur in 1 von 3 Ziehungen mit beiden Teilen.
  - Wenn die Mondlandung dabei ist, greift zuerst der Tipp Internetseiten/Mondlandung. Das engste Paar (11 Jahre) bleibt dann offen.
  - **Vorschlag:** In `tipp2` den Eintrag Internetseiten/ISS vor Internetseiten/Mondlandung stellen. Die Zahl offener Paare bleibt gleich (7). Offen bleibt dann aber das leichtere Paar Mondlandung/Internetseiten (20 Jahre).
  - Das ist eine schwache Empfehlung. Ob Kinder Mondlandung/Internet oder Internet/ISS schwerer finden, zeigen nur echte Kinder.

- **A3 · E6, Tipp benutzt:** Der Entdecker-Tipp löst das Rätsel fast ganz (D1), der Profi-Tipp das schwerste Paar.
  - Zählt „erste Prüfung richtig“ auch nach einem Tipp als richtig, schlägt die Seite einem Kind, das immer den Tipp nimmt, „Profi probieren?“ vor.
  - **Vorschlag:** Ist der Tipp aufgeklappt und die erste Prüfung richtig, wird das wie Lösen beim 2. oder 3. Versuch behandelt: Folge leeren, nicht als richtig zählen.

- **A4 · E6, „Folge leeren“ (Offen 5):** Auch beim Leeren muss der Rätsel-Schlüssel in `gezaehlt` landen und `stufe` gesetzt werden. Sonst zählt dasselbe Rätsel später doch noch.
  - Die Hilfe sinngemäß: `{...folge, stufe, antworten: [], gezaehlt: [...folge.gezaehlt, frage]}`, nur wenn `frageStufe === stufe` und der Schlüssel noch nicht gezählt ist.
  - Hinweis: `folge` ist eine gemeinsame Modul-Variable für Karten und alle Spiele. Ein Zeitspiel-Rätsel mit Mühe leert also auch eine Serie, die auf Karten entstanden ist. Das ist vertretbar und passt zur heutigen Bauweise.

- **Randnotiz zu P1 (kein Handlungsbedarf):** Bei 50 Jahren stehen Internetseiten, Smartphone und ISS immer ganz unten, Webb sowieso. 660 von 2.815 Rätseln (23 %) löst man allein durch Sortieren nach Thema. Das ist echte Zeitfolge und kein künstliches Muster mehr, denn das feste Fenster-Muster ist weg. Die Smartphone-Falle aus E3 kommt auf Profi nicht mehr vor: Das Smartphone steht nie mit ISS oder Webb zusammen.

**Wie die offenen Punkte umgesetzt sind**
- **E6 als Ganzes: gut.** Auf Experte bringt normales Knobeln keinen „leichter“-Vorschlag. Erst zweimal hintereinander „Lösung zeigen“ löst ihn aus. Auf Profi führen drei richtige erste Prüfungen zu „Experte probieren?“. Auf Entdecker gibt es kein „Lösung zeigen“, also kein falsches Signal. Dazu A3 und A4.
- **E5:** Die Experte-Rückmeldung „Noch nicht ganz. Was war zuerst da?“ ist in Ordnung. Ob Kinder trotzdem raten, bleibt zu beobachten (`spieltester`).

**Entscheidungen**
- **Offen 4, kein Stempel nach „Lösung zeigen“: beibehalten.**
  - Gründe: Die Mission heißt „Löse eine Runde“. Bei den anderen Weltspielen muss das Kind die richtige Antwort auch selbst finden. Der Prüfknopf bleibt nach dem 3. Fehlversuch da, der Stempel ist also immer erreichbar. Der Stempel wird je Stufe einmal vergeben (`mitGeschafft`), eine aufgegebene Runde kostet also nichts Dauerhaftes. Entdecker ist nie betroffen.
  - Die Alternative („Stempel ja, aber nicht zählen“) passt nicht zu E6, denn dort zählt „Lösung zeigen“ als falsch.
  - Bedingung: Neben „Lösung zeigen“ steht kein Zähler und kein Satz, der die Versuche bewertet.
- **Offen 6: 50 Jahre.**
  - Bei 30 Jahren kämen Paare auf Profi, die Experte-Paare sind und dort einen eigenen Tipp haben: Mondlandung/ISS (31) und Buchdruck/Karibik (42). Dazu kämen Satellit/Internetseiten (32), Internetseiten/Webb (33), Auto/Rakete (40) und Mikroskop/Dampfmaschine (47). Der Abstand zwischen Profi und Experte würde verwischen.
  - Rakete/Satellit gibt es dann auf keiner Stufe, denn die beiden Teile liegen auf Experte in verschiedenen Gruppen. Dafür siehe die Lücke unten.
- **Offen 7: Aufzug nicht auf Profi.**
  - Er brächte 451 Rätsel mehr (3.266 statt 2.815), Abwechslung fehlt aber nicht.
  - Er würde nur mit Teilen vor 1804 und ab 1926 gezogen, kein Paar wäre dann kleiner als 72 Jahre. Er ist also eine reine Wissensfalle: Kinder halten Aufzüge für modern und legen ihn nach die Rakete.
  - Auf Experte hat er seinen Platz, mit Tipp.
- **Offen 2, Restwissen auf Experte:**
  - **Webb ohne eigenen Tipp ist vertretbar.** Anders als beim Smartphone ist der Platz, den Kinder aus dem Bauch heraus wählen, richtig („Weltraum-Fernrohr … Farbbilder“ klingt neu). Es ist also keine Falle, nur Wissen. Ohne Webb hätte weltall-netz nur noch 1 Rätsel. Beim `spieltester` beobachten; ein Hubble-Teil gehört als Idee ins BACKLOG.
  - **Mikroskop/Dampfmaschine:** Eine Abhängigkeit braucht es nicht, ein Wissens-Tipp auf Tipp 2 reicht (A1).

**Kann so bleiben:** Entdecker-Körbe, Zeitwort-Tipp und grüne feste Teile (D1/D2). Profi-Ziehregel, Einleitung und Tipp (P1 bis P3); auch die Zeiten „vor etwa … Jahren“ im Tipp sind ein passender kleiner Denkschritt für Profi. Profi-Rückmeldung als Zahl. Smartphone nur auf Profi (E3). Rom/Papier „lang Kaiser“ (E1). Benzinmotor-Tipp, der nur zwei Teile ordnet (E2, besser als mein Satz). Kolumbus-Brief (E4). Experte-Ziehung mit wechselnden Gruppen. Regel „Tipp 2 ≠ Tipp 1“. Zu Offen 1: Für Entdecker mit Vorlesen ist die Folge „sehr, sehr lange“ > „ein paar hundert“ > „30 bis 70“ machbar.

**Lücke:** Eine fünfte Experte-Gruppe „Weg ins All“ (Flugzeug, Rakete, Satellit, Mondlandung, ISS) wäre eine durchgehende Kette mit echten Abhängigkeiten (Abstände 23, 31, 12, 31). Dafür müsste ein Teil in mehreren Gruppen stehen dürfen. Das ist eine Idee fürs BACKLOG, nicht für jetzt.

---

## B) Nachtrag „Stimmt das wirklich?“ für Experte

**Ergebnis:** `detective-luft-3` ist eine echte Experten-Frage: Sie verbindet zwei Karten (dünne Luft und Gasdruck), und alle drei Fallen sind echte Fehlvorstellungen. `detective-pilze-3` ist in dieser Form eher Profi und sollte umgebaut werden; Gruppe „nahrung“ und die neue Falle für wasser-2 sind richtig.

**Einstufung**
- `detective-luft-3`: **Experte.** Übertragen auf eine neue Lage; die Lösung steht in keinem Kartensatz. Die Schwerkraft-Falle erklärt auch dünne Luft und bleibt darum selbst nach Tipp 1 verlockend.
- `detective-pilze-3`: **Profi** (Begründung in B1).
- `detective-wasser-2` mit neuer Falle: **Profi**, passt.

**Befunde**

- **B1 · pilze-3, nicht schwer genug:**
  - Die Licht-Falle schließt die Frage selbst aus („in dunklen Räumen … Trotzdem“).
  - „Aus der Luft, so wie grüne Blätter“ widerlegt sich selbst: Champignons haben sichtbar keine grünen Blätter, und das ist Wissen aus pilze-1 (Entdecker).
  - Übrig bleiben Kompost und Wasser, und „Wasser ist keine Nahrung“ wissen 10-Jährige.
  - Das Bauchgefühl („worauf es wächst“) ist hier schon richtig. Der Schritt von „Pilze zerlegen totes Laub“ (Karte, pilze-1-Tipp) zum Kompost ist nur einer.
  - Dazu ein Wortecho: Tipp 1 „Worauf wachsen dort viele Pilze?“ und die Lösung „…, auf dem sie wachsen“.
  - **Vorschlag:** Zwei Tatsachen verbinden, im Viererfeld wie bei `detective-meer-4` (⚠ Fakten zu Basilikum im Dunkeln, Wortlaut für `karten-autor` und `kinder-redaktion`):
    - Frage: „In einem dunklen Keller steht ein Topf mit Basilikum. Daneben wachsen Champignons auf Kompost. Was ist nach zwei Wochen?“
    - Antworten: „Das Basilikum wird schwach, die Pilze wachsen weiter“ (richtig) / „Die Pilze werden schwach, das Basilikum wächst weiter“ / „Beide werden schwach, denn beiden fehlt das Licht“ / „Beide wachsen weiter, denn Licht brauchen beide nicht“. Das sind 52, 53, 49 und 53 Zeichen, je 8 Wörter; keine Antwort fällt durch die Länge auf.
    - Tipps: „Was brauchen grüne Blätter, um Nahrung zu machen?“ / „Champignons haben keine grünen Blätter. Wovon leben sie dann?“
    - Gruppe „nahrung“ behalten.
  - **Wenn die Fassung bleibt:** Mindestens Tipp 1 zu „Denk an den Wald. Wovon leben dort viele Pilze?“ ändern. Die Frage ist dann ehrlich ein schwaches Experte.

- **B2 · luft-3 und `detective-wasser-4` (Gruppe dampf), gegenseitiges Verraten:** Das hat der Entwurf übersehen.
  - Das „warum nicht“ zur Wärme-Falle („Oben auf einem Berg ist es meist kälter …“) nimmt die Lösung von wasser-4 vorweg („Oben wird es wärmer …“ ist der falsche Satz).
  - Umgekehrt nimmt das „warum“ von wasser-4 („Oben wird die Luft kälter“) die Wärme-Falle in luft-3 weg.
  - Beide sind Experte und kommen in beliebiger Reihenfolge; das zählt also für den Stufen-Vorschlag. Leicht, denn es betrifft je eine Falle.
  - **Entscheidung:** vertretbar. Wer es sauber will, ohne Vorrat zu verlieren (luft-3 in Gruppe „dampf“ würde 5 Plätze auf 4 senken), ändert nur dieses „warum nicht“: „Wärme ist hier nicht der Grund. Auch an kühlen Tagen wird die Tüte oben prall.“ (⚠ `fakten-pruefer`)

**Entscheidungen**
- **Gruppe „nahrung“ (pilze-3 und pflanzen-3): richtig und nötig.** Die Falle „Aus der Luft, so wie grüne Blätter“ samt „warum nicht“ verrät die Lösung von pflanzen-3 „Aus Luft und Wasser“. Danach gibt es 5 Plätze für 3 Experten-Fragen je Runde, das ist genug Abwechslung. Gilt auch für meine Fassung aus B1.
- **Offen 2 (luft-3 → luft-2, pilze-3 → pilze-2): vertretbar, so lassen.**
  - Die Experten-Fragen kommen zuerst, die Profi-Frage zuletzt. Es geht also nur in diese eine Richtung.
  - In beiden Fällen ist die betroffene Falle schon in der Profi-Frage selbst schwach: In luft-2 widerspricht der eigene Tipp 1 und luft-1 der Falle „Ganz oben wird die Luft wieder dichter“. In pilze-2 widerspricht die eigene Frage („Der Baum gibt ihm Zucker“) der Falle „Zucker vom Pilz zurück“.
  - Die Profi-Frage zählt auf Experte nicht für den Stufen-Vorschlag (`mitErsterAntwort`: `frageStufe !== stufe`).
- **wasser-2, neue Falle und 2:2 Ja/Nein: gut.**
  - „Ja, denn Wolken entstehen nur über dem Meer“ ist eine echte Fehlvorstellung und ersetzt eine schwache Falle mit „immer“, die sich selbst widersprach. Sie ist sicher falsch, ihr „warum nicht“ verrät nichts.
  - Die Ja/Nein-Aufteilung 2:2 nimmt das Muster „die eine andere Antwort“ weg. Nachteil: Wer am „immer“ in der Behauptung „Nein“ erkennt, hat nur noch 2 statt 3 Antworten. Für Profi ist das in Ordnung.
  - Die Falle mit der wahren Begründung („im Meer verdunstet das meiste“) nicht nehmen.

**Kann so bleiben:** luft-3 ganz (Antworten 42, 47, 41, 46 Zeichen; Tipp 2 lässt trotz „draußen“ noch drei Antworten übrig). Vier Antworten auf Experte. wasser-2 wie im Entwurf. Längen und Übertreibungswörter habe ich nachgemessen, sie stimmen mit dem Entwurf überein.

---

## Unsicher
- Ob Experte-Kinder die Wissens-Paare (Telefon/Auto, Webb, Papier/Null) als Knobelei oder als Raten erleben, und ob Mondlandung/Internet oder Internet/ISS schwerer ist (A2), zeigen nur echte Kinder. Ein `spieltester`-Lauf gibt Hinweise.
- Die neuen Tipp- und Fragesätze aus A1, B1 und B2 sind ungeprüft (`fakten-pruefer`, `kinder-redaktion`).

**Dateien**
- /home/user/wunderkompass/docs/entwurf/2026-11-24-sortiere-die-zeit-fassung-2.md
- /home/user/wunderkompass/docs/entwurf/2026-11-24-sortiere-die-zeit-stufenpruefung.md
- /home/user/wunderkompass/docs/entwurf/2026-11-24-stimmt-das-experte-nachtrag.md
- /home/user/wunderkompass/app/kern/stufe.ts
- /home/user/wunderkompass/app/kern/stufen-vorschlag.tsx
- /home/user/wunderkompass/app/classic-learning.ts
- /home/user/wunderkompass/app/classic-questions.json
