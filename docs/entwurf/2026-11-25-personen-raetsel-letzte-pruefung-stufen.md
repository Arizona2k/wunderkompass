# Personen-Rätsel: letzte Prüfung der Stufen

Helfer: stufen-pruefer (opus / high), 25.11.2026. Nur Befunde, ändert nichts. Messskript: docs/entwurf/2026-11-25-personen-raetsel-messung/regel.mjs.

Ich habe keine Dateien geändert. Gemessen habe ich mit den echten Daten (`world-catalog.json`, `world-game-fallen.json`). Dafür habe ich die geplante Regel nachgebaut, mit Paarliste A (inklusive der neuen Paare) und Paarliste B (inklusive der Kann-Paare). Das Skript liegt unter /tmp/claude-0/-home-user-wunderkompass/cbdee1fe-c6aa-57c6-9ce7-3cd85e45a5e9/scratchpad/letzte/regel.mjs.

**Kurz:** Alle vier Texte passen. Die Regel lässt sich so bauen. Zwei Befunde: Auf Profi verrät das Gebiet zu viel (S-A), und in Paarliste B fehlen zwei Einstein-Paare (S-B).

## 1. Einstein (neu) gegen Leavitt, Payne-Gaposchkin, Ibn al-Haytham, Bell Burnell: passt

- **Satz 1** („spielte im Kopf genau durch …“) beschreibt Nachdenken. Keine der vier Personen hat das getan: Leavitt, Payne-Gaposchkin und Bell Burnell haben beobachtet oder gemessen, Ibn al-Haytham hat Versuche gemacht.
- **Satz 2** (Nobelpreis des Jahres 1921) passt auf keine der vier: Ibn al-Haytham lebte vor 1000 Jahren, Bell Burnell ist 1943 geboren, Leavitt und Payne-Gaposchkin bekamen keinen Nobelpreis.
- **Umgekehrt** passt keiner ihrer Rätseltexte auf Einstein.
- **Profi wird echte Knobelei:** Bei Einstein ziehen jetzt Curie und Meitner aus dem Gebiet, Tagore kommt über die zeitliche Nähe dazu (gemessen). Curie und Tagore haben selbst einen Nobelpreis. Trennen müssen „Arbeit über Licht“, „1921“ und „im Kopf“. Das ist gewollt.
- Die drei Paare in Liste A bitte trotzdem behalten. Mit ihnen bleiben 25 Entdecker-Kandidaten.

## 2. Curie „unsichtbare Strahlen“ gegen Bell Burnell und Franklin: passt

- **Entdecker:** „zweimal den Nobelpreis“ entscheidet allein. Franklin und Bell Burnell haben keinen. Franklin kommt dort ohnehin nie, weil sie dasselbe Gebiet hat.
- Bell Burnell kann auf Entdecker als Falle neben Curie kommen. Das ist nur eine schwache Lockung: Dass Radio auch Strahlung ist, steht nur in ihrem Kartentext. Entdecker sehen in der Frage nur ihren Namen.
- **Profi:** Franklin ist eine gute Falle, denn „Röntgenstrahlen“ klingt nach „unsichtbaren Strahlen“. Eindeutig trennen „1898“, „Polonium und Radium“ und „zweimal Nobelpreis“.

## 3. Leavitt (Satz 1 ohne Werkzeug) gegen Bell Burnell: passt

- Satz 1 der beiden ist sich ähnlich: „fester Takt“ bei Leavitt, „regelmäßige Signale“ bei Bell Burnell.
- **Entdecker:** Sie kommen nie zusammen, weil beide das Gebiet Weltall haben. Das ist richtig so.
- **Profi:** Die beiden sind dort bewusst ein Paar (Liste C im Stufen-Bericht). Leavitts Satz 2 („Entfernungen messen“) und Satz 3 („Fotos vom Himmel“) trennen sie eindeutig von Antennen und Papierstreifen. Wer Satz 1 allein liest, kann schwanken. Wer alles liest, findet die Lösung: Das ist der gewünschte Abstand zwischen den Stufen.

## 4. Murasaki (neu) gegen Ibn Sina und Cai Lun: passt, mit einer Kann-Anmerkung

- **Murasaki:** Satz 1 („in Japan“, „Prinzen“) passt nur auf sie. Satz 2 enthält je einen Splitter der beiden anderen: „etwa 1000 Jahre“ (wie Ibn Sina) und „Hof des Kaisers“ (wie Cai Lun). Ganz passt er auf keinen der beiden. Auf Profi ist das eine gute Doppelfalle.
- **Entdecker:** Ibn Sina und Cai Lun kommen dort nie, weil sie über ihr Zweitgebiet „Kunst und Schrift“ mit Murasaki verbunden sind.
- **Kann:** Abschnitt 1 der Endfassung sagt, die Ähnlichkeit sei „durch Murasakis neuen Satz 2 behoben“. Das stimmt nur halb.
  - Im **Ibn-Sina**-Rätsel passt Satz 2 („übersetzt und abgeschrieben“) weiter voll auf Murasaki, deren Karte sagt „über viele Generationen abgeschrieben“.
  - Das Rätsel bleibt eindeutig, weil „Medizin“ in Satz 1 trennt. Satz 2 hilft dem Profi-Kind aber nicht beim Unterscheiden.
  - Wenn ihr das ändern wollt: „Darin ordnete diese Person, was man damals über Krankheiten und Heilung wusste.“ (Beleg: Karten-`intro` „ordnete medizinisches Wissen seiner Zeit“.) Sonst ins BACKLOG.

## 5. Regel aus Abschnitt 2: umsetzbar, mit zwei Befunden

**Umsetzbar (gemessen):**
- Jede Person hat mindestens 20 Entdecker-Kandidaten.
- Jede Person hat mindestens eine Profi-Falle aus ihrem Gebiet.
- Die neuen A-Paare nehmen keiner Person die Gebietsfalle weg.
- Gebiete und Liste B gehören am besten als Daten nach `world-game-fallen.json`. Liste B sollte in beide Richtungen gelten (für Entdecker ohne Nachteil), Liste A in eine Richtung wie heute.
- Der Test „jede Person hat ein Gebiet“ schützt auch künftige Personen.
- Gezogene Entdecker-Antworten (drei Namen aus dem Vorrat) lässt `validWorldGameOrder` schon heute durch (`app/world-game-bank.ts`, Zeilen 24 und 29 bis 31).
- Auf Entdecker bringt das Ziehen mehr Abwechslung als die festen Antworten. Gut.

**S-A (Soll), Ratemuster auf Profi: Das Gebiet verrät zu viel.**
- Mit „genau eine Falle aus dem Gebiet, zwei zeitlich nahe“ passen im Schnitt nur 2,45 von 4 Antworten zum Gebiet des Rätsels.
- Ein Kind, das nur das Gebiet erkennt („Sterne, also Weltall“) und unter den passenden Namen rät, trifft in **43 %** der Fragen. Reines Raten ergäbe 25 % (gemessen).
- Beispiel Bell Burnell: Die zeitlich nächsten sind Maathai, Butler, Hadid, Goodall und Berners-Lee. Dann bleiben oft nur zwei Weltall-Namen, also eine Münzwurf-Entscheidung.
- **Vorschlag:** „Profi: **zwei** Fallen aus Erst- oder Zweitgebiet, wo es mindestens zwei Kandidaten gibt, die dritte die zeitlich nächste.“ Das gilt für alle außer Mandela. Gemessen sinkt die Trefferquote mit Gebiet allein dann auf **32 %**, und im Schnitt passen 3,18 Antworten zum Gebiet. Der Test lautet dann entsprechend.

**S-B (Soll), zwei Einstein-Paare fehlen in Paarliste B.**
- Liste B nennt Einstein ↔ Jemison wegen „Raum“, aber nicht **Armstrong** und **Johnson**. Beide sind heute Entdecker-Kandidaten für Einstein (gemessen).
- Johnson „rechnete aus, auf welchem Weg Raumschiffe … fliegen“. Für ein kleines Kind klingt das nach „im Kopf durchspielen … Raum und Zeit“.
- **Vorschlag:** In B ergänzen: Einstein ↔ Neil Armstrong, Katherine Johnson. Danach bleiben 23 Entdecker-Kandidaten für Einstein.
- Das war meine Lücke im Vorbericht.

**Kann:**
- Mandela hat auf Profi immer Maathai als Falle, weil sie die einzige Person mit Gebiet „Gesellschaft“ ist. Das ist kein Ratemuster, weil „Südafrika“ und „1994“ trennen. Es wiederholt sich aber. Beobachten.
- Gespeicherte Runden, die noch laufen, behalten nach dem Update ihre alten Antworten, denn `validWorldGameOrder` nimmt sie weiter an. Bei Einstein auf Profi kann Leavitt also einmal noch vorkommen, bis eine neue Runde beginnt. Das ist harmlos und geht vorbei. Ob die Prüfung Liste A beachten soll, entscheidet der code-pruefer.
- Auf Entdecker ist die richtige Antwort immer die einzige aus dem Gebiet des Rätsels. Das ist gewollt, denn dort reicht Erkennen.

## Unsicher

- Ob kleine Kinder bei „Raum“ wirklich an den Weltraum denken (S-B) oder ob Profi-Kinder die Gebietsstrategie tatsächlich nutzen (S-A), ist meine Einschätzung. Gemessen sind nur Kandidaten und Quoten. Das klären nur Rückmeldungen echter Kinder.
- Die Einteilung der Gebiete und der Ibn-Sina-Vorschlag gehören zum fakten-pruefer.

**Dateien:** /home/user/wunderkompass/docs/entwurf/2026-11-25-personen-raetsel-endfassung.md, /home/user/wunderkompass/docs/entwurf/2026-11-25-personen-raetsel-nachpruefung-stufen.md, /home/user/wunderkompass/app/world-game-runde.ts, /home/user/wunderkompass/app/world-game-bank.ts, /home/user/wunderkompass/app/world-game-fallen.json
