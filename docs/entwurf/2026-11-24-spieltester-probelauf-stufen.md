# Spieltester, erster Probelauf: Stufen aus Teil A (24.11.2026)

**Pilot, kein Kindertest.** Der Helfer `spieltester` (`.claude/agents/spieltester.md`) hat die Seite in zwei Rollen benutzt. Er ist kein Kind, hört keinen Ton und sieht 3D nur eingeschränkt. Echte Kinder bleiben die wichtigste Rückmeldung.

- Stand: lokaler Build von PR #108 (Commit `ffea84a`, gleicher App-Code wie `test-live` nach Teil A), Chromium.
- Aufträge (von Claude gestellt):
  1. 6 Jahre, mit einem Elternteil, Handy 390 × 844 (Touch): „Finde etwas über Elefanten und beantworte die Frage“, dann Stufe wechseln.
  2. 12 Jahre, allein, Rechner 1280 × 800: „Stell die schwerste Stufe ein und beantworte auf zwei verschiedenen Wissenskarten alle Fragen.“
- Eingesetzt als `general-purpose` mit Modell und Stufe aus der Helferdatei (sonnet / high), weil der Helfer beim Start noch nicht in der Helferliste dieses Chats stand (CLAUDE.md, „Helfer müssen laufen“).
- Bilder und Skripte lagen in `.qa-output/spieltester/a1/` und `a2/` (nicht in Git, gehen mit dem Container verloren).

Der Bericht folgt unverändert. Danach steht, was Claude daraus gemacht hat.

---

## Spieltest-Bericht: Stufen (Entdecker, Profi, Experte)

Stand: lokaler Build unter http://127.0.0.1:4182/, Chromium. Browser-Meldungen: keine, in beiden Aufträgen (weder Konsolenfehler noch gescheiterte Anfragen). Bilder liegen unter `/home/user/wunderkompass/.qa-output/spieltester/a1/` und `.../a2/`. Skripte liegen im selben Ordner.

---

### Auftrag 1: 6 Jahre, mit Elternteil, Handy

**1. Auftrag:** Rolle 6 Jahre, Elternteil liest vor, Kind tippt. Ziel: „Finde etwas über Elefanten und beantworte die Frage.“ Gerät: Handy 390×844 mit Touch. Leerer Pass.

**2. Ergebnis:** Ziel erreicht, nach etwa 8 Schritten (Suche, Karte, falsch, falsch, richtig). Dazu etwa 6 Zusatzschritte für Tipp und Stufenwechsel.

**3. Ablauf**
1. Startseite. Das Suchfeld „Suche nach Themen / Zum Beispiel: Mond oder Elefant“ ist gut zu finden (`a1/01-start.png`).
2. Suchfeld antippen, „Elefant“ tippen. Ein Treffer: „Afrikanischer Savannenelefant“ (`a1/03-elefant.png`).
3. Karte öffnet. Oben stehen Foto, Titel, „Vorlesen“ und „Merken“ (`a1/11-karte-oben.png`).
4. Die Frage „Rate mal!“ liegt erst nach etwa 440 px Scrollen im Blick (`a1/11-frage.png`).
5. Frage: „Was kann ein Elefant mit seinem Rüssel tun?“ Drei Antworten, die zwei falschen sind lustig-absurd („Wie ein Vogel fliegen“, „Unter Wasser atmen wie ein Fisch“).
6. Falsch getippt (Vogel): Die Antwort wird orange. Die Rückmeldung „Noch nicht ganz. Versuch es noch einmal! Lies unten unter ‚Kurz erklärt‘ nach.“ erscheint erst unterhalb des sichtbaren Bildes, beim Scrollen (`a1/12-falsch.png` zeigt sie nicht, `a1/11-falsch-unten.png` zeigt sie).
7. Zweite falsche Antwort: gleiche Rückmeldung.
8. „Brauchst du einen Tipp?“: „Stell dir vor, der Elefant untersucht einen Ast mit seinem Rüssel. Welche Körperteile nutzt du selbst, um etwas zu beschnuppern oder festzuhalten?“ (`a1/11-tipp.png`).
9. Richtige Antwort „Riechen und greifen“: grünes Häkchen, „Richtig! Der Rüssel ist Nase und bewegliches Greifwerkzeug zugleich.“ und der Knopf „Noch einmal raten“ (`a1/13-richtig.png`).
10. „Ändern“ antippen: Drei Stufen mit je einer Zeile (`a1/12-aendern.png`).
11. Experte gewählt (Elefant): Eine lange Aufgabe mit vier Antworten. Sie ist für ein 6-jähriges Kind nicht machbar. „Zu schwer? Zurück zu Entdecker“ steht dabei.

**4. Befunde**

*Wichtig*
- **Verwirrend / Sieht falsch aus, Rückmeldung bei falscher Antwort nicht im Bild** (`a1/12-falsch.png`): Nach dem Antippen bleibt der Bildschirm stehen. Nur die Antwort färbt sich orange, der erklärende Text liegt unterhalb der Tab-Leiste. Ein Kind, das nicht liest und nicht scrollt, sieht nur „orange“ und weiß nicht, was das heißt. Vorschlag: Rückmeldung in den sichtbaren Bereich scrollen oder die Antwort selbst deutlicher markieren (z. B. Symbol).
- **Verwirrend, Rückmeldung hilft einem Nicht-Leser kaum:** „Lies unten unter ‚Kurz erklärt‘ nach.“ nützt den Kleinen nicht. Bei der Entdecker-Frage steht dort auch gar nichts zum Rüssel-Tun in den ersten zwei Zeilen. Vorschlag: Der Elternteil kann vorlesen, aber ein „Vorlesen“-Knopf direkt an der Rückmeldung fehlt. Der Tipp hat einen („Tipp vorlesen“), die Rückmeldung nicht.
- **Kaputt, Stufe wechseln nach einer Antwort lässt die alte Frage stehen** (`a1/11-profi.png`): Nach einer falschen Antwort auf Entdecker „Ändern → Profi“ wählen. Oben steht „Stufe: Profi“, darunter bleiben aber dieselbe Entdecker-Frage mit 3 Antworten und die alte „Noch nicht ganz“-Rückmeldung. „Profi“ wirbt mit „vier Antworten“. Bei frischer Karte (erst Stufe, dann antworten) kommt dagegen die richtige Profi-Frage („Wie trinkt ein großer Elefant?“, 4 Antworten). Nachstellen: Elefant öffnen, falsche Antwort tippen, „Ändern“, „Profi“. Als Test: Frage nach Stufenwechsel prüfen.

*Feinschliff*
- **Stufe ist bemerkbar, aber leise:** Die Zeile „Stufe: Entdecker [Ändern]“ steht gut sichtbar in der Rate-mal-Box. Tippfläche „Ändern“ ist 81×48 px, groß genug. Die Stufe Entdecker wird nicht erklärt, bevor man „Ändern“ drückt („zum Reinkommen“ steht erst dort). Das reicht für Eltern, ein 6-jähriges Kind wählt von allein nicht.
- **Zu leicht (Entdecker):** Die Entdecker-Frage ist für 6 Jahre gut machbar. Die zwei falschen Antworten sind so absurd, dass man sie ohne Wissen ausschließen kann. Das ist als Einstieg gewollt, aber sie testet wenig. Die richtige Antwort ist hier die kürzeste. Kein Längenmuster gegen die Absicht.
- Antwort-Reihenfolge wechselt bei jedem Neuladen (richtige Antwort war mal A, mal B, mal C). Innerhalb einer Sitzung bleibt sie stabil, auch nach falscher Antwort und Stufenwechsel. Das ist gut so.
- Die Experte-Aufgabe hat bei „Zu schwer? Zurück zu Entdecker“ einen klaren Ausweg. Gut.

**5. Spaß:** Die absurden falschen Antworten (Vogel, Fisch), das große Foto und „Rate mal!“ mit großen Antwortflächen (ca. 60 px hoch) laden zum Tippen ein. Der Tipp bezieht das Kind ein („Welche Körperteile nutzt du selbst …“).

**6. Browser-Meldungen:** keine.

**7. Nicht geprüft:** Vorlesen und Ton, echter Touch auf echtem Gerät, andere Browser, Verhalten ohne Internet, wie ein echtes 6-jähriges Kind liest oder tippt (das ist nur eine Rolle).

---

### Auftrag 2: 12 Jahre, allein, Rechner

**1. Auftrag:** Rolle 12 Jahre, allein, flüssig, will es schwer. Ziel: „Stell die schwerste Stufe ein und beantworte auf zwei verschiedenen Wissenskarten alle Fragen.“ Gerät: Rechner 1280×800. Leerer Pass.

**2. Ergebnis:** Ziel teilweise erreicht, nach etwa 25 Schritten. Die schwerste Stufe lässt sich einstellen und bleibt erhalten. Experte-Fragen gibt es aber nur auf wenigen Karten. Ich habe auf zwei Karten, Elefant und Eisbär, jeweils die Fragen durchgespielt, die kamen. Auf Elefant kam nach 4 Experte-Fragen eine einfache Frage, danach landete die erste Frage wieder gelöst. Auf Eisbär habe ich 3 Experte-Fragen und die vierte (einfache) gesehen, aber die vierte nicht mehr beantwortet. „Alle Fragen“ ist also nicht erfüllt.

**3. Ablauf**
1. Start, „Welten“, „Wissenschaft & Weltall“, Karte „Wie funktioniert Strom?“ (`a2/11-karte-strom.png`). Die Rate-mal-Box mit „Stufe: Entdecker [Ändern]“ ist gleich im ersten Bildschirm erreichbar. Stufenwahl gefunden.
2. „Ändern“, „Experte“ gewählt: Es erscheint „Experte gibt es hier noch nicht. Du spielst Entdecker.“ (`a2/12-experte.png`). Die Frage bleibt die Entdecker-Frage.
3. Auf „Löwe“, „Gepard“, „Bengaltiger“, „Giraffe“, „Großer Panda“, „Westlicher Flachlandgorilla“ ebenso. Bei allen steht dort dieser Hinweis. Beim Öffnen dieser Karten war „Stufe: Experte“ bereits gesetzt (Wahl bleibt beim Kartenwechsel erhalten).
4. Beim Durchblättern der ersten Seiten von Tierwelt, Wissenschaft & Weltall und Zeitreise (36 Karten): Experte gibt es nur bei „Afrikanischer Savannenelefant“, „Eisbär“ und „Werkzeuge aus Stein“. Die anderen 33 sagen „gibt es hier noch nicht“.
5. Elefant, Experte (`a2/11-elefant-stufenwahl.png`, `a2/12-elefant-experte.png`): Frage 1 „Wasserlöcher leer, die älteste Elefantenkuh führt die Herde. Warum ist das jetzt gut?“, vier Antworten.
6. Erst falsch (A, „Sie läuft am schnellsten …“): Rückmeldung „Schnell sein hilft nichts, wenn man nicht weiß, wohin.“ Das ist passend und hilft. Tipp: „Schau im Steckbrief nach: Wie alt kann ein Elefant werden?“ Dann richtig (C): „Eine alte Leitkuh hat schon viele trockene Jahre erlebt …“.
7. Frage 2 „Wie trinkt ein großer Elefant?“: erst „direkt durch den Rüssel“ (falsch, Rückmeldung „Der Rüssel ist auch seine Nase. Wasser direkt hinunterschlucken kann er damit nicht.“), dann „spritzt sich Wasser ins Maul“ (richtig).
8. Frage 3 „Wie schwer ist ein Elefantenbaby bei der Geburt?“ (3 / 30 / 100 / 1.000 kg), „Etwa 100 Kilogramm“ richtig.
9. Frage 4 „Wer führt eine Elefantenherde an?“, „Meist das älteste Weibchen“ richtig.
10. Frage 5 ist „Was kann ein Elefant mit seinem Rüssel tun?“ mit nur 3 absurden Antworten, also die Entdecker-Frage, obwohl „Stufe: Experte“ steht. Nach „Noch eine Frage“ kommt Frage 1 zurück, schon als „Richtig!“ gelöst angezeigt, ohne Hinweis, dass man durch ist (`a2/11-ende-Afrika.png`).
11. „Stimmt das?“ (Für Große, Karte Elefant): „Stimmt“ geantwortet. Rückmeldung „Das stimmt. Bei Afrikanischen Elefanten haben meist auch die Weibchen Stoßzähne …“. Dieses Feld hat keine Stufe.
12. Seite neu geladen: „Stufe: Experte“ bleibt, die Frage wechselt zur nächsten ungelösten („Wie trinkt ein großer Elefant?“). Stufe bleibt erhalten, auch nach Neuladen.
13. Eisbär, Experte: Frage 1 „Fell klatschnass, was hält ihn jetzt vor allem warm?“ (erst „schwarze Haut“ falsch, dann „dicke Fettschicht“ richtig), Frage 2 „Was machen die meisten Eisbären im Winter?“ (richtig: „Sie jagen weiter Robben“), Frage 3 „Wie schwimmt ein Eisbär?“ (richtig: „mit den Vorderpfoten“), Frage 4 „Warum braucht der Eisbär Meereis?“ hat nur 3 einfache Antworten, ebenfalls Entdecker-Niveau (`a2/11-ende-Eisbär.png`).

**4. Befunde**

*Wichtig*
- **Zu leicht / Verwirrend, Experte-Wahl hat auf den meisten Karten keine Wirkung:** Von 36 geprüften Karten haben nur 3 Experte-Fragen (Savannenelefant, Eisbär, Werkzeuge aus Stein). Der Hinweis „Experte gibt es hier noch nicht. Du spielst Entdecker.“ ist ehrlich, aber „Zu schwer? Zurück zu Entdecker“ steht gleichzeitig darunter, obwohl man gerade Entdecker spielt. Das widerspricht sich (`a2/12-experte.png`). Vorschlag: Bei fehlender Stufe den „Zu schwer?“-Link ausblenden. Das 12-jährige Kind merkt vor allem: „Ich habe schwer gewählt, es ist trotzdem leicht.“
- **Zu leicht, einfache Entdecker-Frage mitten im Experte-Durchlauf:** Elefant nach 4 Experte-Fragen und Eisbär nach 3 zeigen eine 3-Antworten-Frage mit absurden Falschantworten („Eis macht ihn zu einem Fisch“, „Er frisst das Eis“; `a2/11-ende-Eisbär.png`), obwohl „Stufe: Experte“ oben steht. Vermutung: Der Experte-Durchlauf nimmt auch die Entdecker-Frage der Karte mit hinein. Nachstellen: Elefant öffnen, Experte, vier Fragen richtig beantworten, „Noch eine Frage“.
- **Verwirrend, Durchlauf ohne Ende:** Nach der letzten Frage kommt die erste wieder und steht schon als „Richtig!“ da, ohne Hinweis wie „Alle Fragen geschafft“ (`a2/11-ende-Afrika.png`). Man weiß nicht, ob man fertig ist.
- **Inhaltlich doppelt:** Experte-Frage 1 („Die älteste Elefantenkuh führt die Herde …“) verrät die Antwort von Frage 4 („Wer führt eine Elefantenherde an?“) und umgekehrt. Wer beide hintereinander beantwortet, braucht kein Wissen.

*Feinschliff (erratbar)*
- Die richtige Antwort ist bei den Experte-Fragen nicht durchgehend die längste. Bei Elefant Frage 1 war sie knapp die längste (43 gegen 40, 38, 37 Zeichen). Bei Eisbär Frage 2 und 3 war sie die kürzeste oder mit-kürzeste. Daher kein einheitliches Längenmuster. Vermutung: Gleichmäßig ist eher etwas anderes.
- Andere Ratemuster, die ich bemerkt habe: Die Antwort greift Wörter der Frage auf (Frage 1: „älteste“, „trockenen Jahr“ → „von früher“, „Wasserstellen“; Elefant Frage 4: nur die richtige Antwort enthält „Meist“). Frage 3 mit Zahlen („3 / 30 / 100 / 1.000 kg“) lässt sich per „Mitte wählen“ erraten. Die Eisbär-Frage 3 hat die zwei Extremantworten („nur Hinterbeinen“, „alle vier gleich stark“), die „Vorderpfoten“ als Mitte anbieten.
- Gut gelöst, fordernd: Die Fallen sind echte Kindheitsirrtümer („schwarze Haut“, „direkt durch den Rüssel trinken“, „Winterschlaf“). Als 12-Jähriges musste ich bei Frage 1 und 2 nachdenken. Die Rückmeldungen bei falschen Antworten sind passend zur gewählten Antwort und erklären (nicht nur „falsch“). Die Experte-Fragen sind in Ordnung schwer.
- Strom-Karte, Entdecker-Stufe: Die richtige Antwort „Einen geschlossenen Stromkreis“ ist die längste, die anderen sind absurd. Hier ist das Ratemuster „längste Antwort“ tatsächlich vorhanden (nur Entdecker, für Kleine ok).
- Antwort-Hover: Unter dem Mauszeiger färbt sich eine Antwort hellgrün, ähnlich dem „richtig“-Grün (`a2/12-experte.png`, Antwort B). Vermutung: ist nur Hover. Ein Kind könnte es für eine Rückmeldung halten.

*Funktioniert, kein Befund*
- Stufenwahl: Auf dem Rechner direkt im ersten Bildschirm der Karte zu finden („Ändern“, 81×48 px), nach dem Aufklappen mit Kurztexten („zum Reinkommen“, „vier Antworten, kniffligere Fallen“, „nachdenken und kombinieren“).
- Wahl bleibt beim Kartenwechsel erhalten (Löwe, Gepard, Bengaltiger, Giraffe, Panda, Gorilla waren schon auf Experte, ebenso Wechsel über Zurück/Welten). Wahl bleibt nach „Neu laden“ erhalten (Elefant, Experte).
- „Zurück“ funktioniert (zurück zur Weltliste).

**5. Spaß:** Die Fallenfragen (schwarze Haut, Wasser trinken) sind spannend, und die Rückmeldung erklärt, warum die eigene Antwort nicht stimmt („Schnell sein hilft nichts, wenn man nicht weiß, wohin.“). Das zieht zum Weiterspielen. „Noch eine Frage“ ist ein klarer, auffälliger Knopf.

**6. Browser-Meldungen:** keine.

**7. Nicht geprüft:** Profi auf dem Rechner, die Karte „Werkzeuge aus Stein“ (dritte Experte-Karte), die Experte-Fragen auf Handy und Tablet, ob die Stufe auch nach Schließen und späterem Öffnen des Browsers bleibt (nur Neuladen geprüft), faktische Richtigkeit der Antworten (nur als 12-Jähriges nach Allgemeinwissen gewertet, kein Fakten-Check), andere Browser, Ton.

---

### Zum Helfer selbst

**Gut funktioniert:**
- Die Struktur der Anleitung (Rolle, Ziel, Gerät, Stand) und das feste Antwortformat. Die Trennung „Befund / Vermutung / Nicht geprüft“ zwingt zu ehrlichen Aussagen.
- Die Regel „nur sichtbar bedienen“ hat echte Befunde gebracht, z. B. „Rückmeldung unter dem Bildrand“ und „Stufenwechsel nach Antwort“. Die automatischen Tests sehen solche Dinge kaum.
- Der Ablauf „wenige Schritte, Bild, Read“ ist gut, aber nur, wenn jedes Bild gleich eine Frage beantwortet.

**Unklar oder hinderlich:**
- Das Schrittlimit (rund 20 bis 30) ist bei zwei Aufträgen mit dem Ziel „alle Fragen“ zu knapp; ein Zähler für den Bericht wäre ehrlicher („nach X Schritten“ zählt je Skript, nicht je Aktion).
- Die Anleitung sagt „kein `evaluate`, um etwas auszulösen“. Ich habe `evaluate` nur zum Auslesen (Seitenhöhe, scrollY) benutzt. Eine Zeile, dass Lesen erlaubt ist, würde Zweifel nehmen.
- Hinderlich war die Locator-Technik: `getByText` trifft oft versteckte Bildunterschriften und wirft „not visible“ nach 30 s Wartezeit. Auch „Zurück“ ist ein Link, kein Button. Ein Absatz mit Hinweisen wie „`getByRole('link'/'button')` vor `getByText`, kurze Timeouts (z. B. 5 s), Antwortknöpfe heißen ‚A Text‘“ würde Zeit sparen. Ein kleines gemeinsames Hilfsskript (Start, Kontext, Konsolen-Logger, Screenshot-Zähler) liegt jetzt als `.qa-output/spieltester/a1/lib.mjs`; es könnte als Vorlage in die Anleitung.
- Die Anleitung sagt nichts dazu, wie man Zustand über mehrere Skriptläufe hält. Ich habe die Schritte als Argumente neu abgespielt (Skript `a2/play.mjs`). Ein Satz dazu wäre hilfreich.
- Die Anleitung verlangt ein Bild je Schritt. Bei der Frage „Ist die richtige Antwort immer die längste?“ ist Text auf der Seite (Antwortliste) aussagekräftiger als Bilder. Es sollte erlaubt sein, den sichtbaren Seitentext (`innerText`) mit zu protokollieren und dabei auf Bilder zu verzichten, wenn es nicht um Optik geht.

**Ich würde ändern:**
- Ratemuster-Prüfung als eigene Zeile („Antwortlängen, Wörter aus der Frage, ‚meist/etwa‘-Wörter, Mittelwerte bei Zahlen“) aufnehmen.
- Bei „alle Fragen beantworten“ ein Ende festlegen (z. B. „bis ‚Noch eine Frage‘ wieder bei der ersten Frage landet“).
- Ein Hinweis, dass der Helfer die Frage „Wird die Stufe mit einem sichtbaren Hinweis erklärt?“ als Befund melden darf, auch wenn der Auftrag sie nicht stellt.

---

## Was daraus wurde (Claude, 24.11.2026)

Claude hat jeden Befund am Code geprüft (`app/kern/karte/wissenskarte.tsx`, `app/kern/karte/karten-daten.ts`, `app/kern/stufen-wahl.tsx`), bevor er als Fehler gilt. Nichts davon ist in PR #108 geändert: Der PR betrifft Tests und Unterlagen, die Befunde betreffen die Stufen aus Teil A, die seit PR #107 auf `test-live` sind. Alle Punkte stehen im `BACKLOG.md` (Punkt „Stufen-Feinschliff aus dem ersten Spieltest“).

1. **Stufenwechsel nach falscher Antwort zeigt die alte Frage: bestätigt, folgt aus einer Regel.** `ersteFrage` nimmt zuerst eine falsch beantwortete Frage (Teilschritt 3, E4). Die Fragen einer Stufe schließen die leichteren Stufen ein (`fragenFuerStufe`). Darum gewinnt nach dem Wechsel auf Profi die eben falsch beantwortete Entdecker-Frage. Bei einem Wechsel erwartet das Kind aber eine Frage der neuen Stufe. Vorschlag: Beim Stufenwechsel zuerst Fragen genau der neuen Stufe; „falsch beantwortet zuerst“ gilt weiter beim Öffnen der Karte. Als Test: Frage nach dem Wechsel hat die neue Stufe.
2. **„Zu schwer? Zurück zu Entdecker“, obwohl die Karte Entdecker spielt: bestätigt, Fehler.** Der Knopf steht immer bei Profi und Experte (`stufen-wahl.tsx`, Zeile 51), auch wenn der Hinweis „… gibt es hier noch nicht. Du spielst Entdecker.“ darüber steht. Vorschlag: Knopf ausblenden, wenn die Karte ohnehin Entdecker spielt.
3. **Leichtere Fragen im Experte-Durchlauf: so gebaut, Entscheidung offen.** „Noch eine Frage“ blättert in den Fragen der Stufe und darunter (Kommentar in `wissenskarte.tsx`, Zeile 90). Für eine 12-jährige Rolle wirkt das wie „schwer gewählt, trotzdem leicht“. Vorschlag: Auf Profi und Experte nach den Fragen der Stufe ein klarer Schluss, statt nahtlos in die Entdecker-Frage zu laufen.
4. **Kein Ende nach der letzten Frage: so gebaut („am Ende wieder vorn“), Vorschlag.** Ein kurzer Satz wie „Alle Fragen dieser Stufe geschafft!“ mit einem Weg zur nächsten Karte. Passt mit Punkt 3 zusammen.
5. **Elefant, Experte: Frage 1 verrät Frage 4: Inhaltsbefund.** Geht an `karten-autor` (Entwurf) und `stufen-pruefer` (Prüfung), bevor etwas geändert wird. Dazu die bemerkten Ratemuster (Zahlenreihe mit „Mitte“, Extremantworten um die richtige, „Meist“ nur in der richtigen Antwort).
6. **Rückmeldung nach falscher Antwort liegt auf dem Handy unter dem Bildrand: nicht nachgeprüft.** Plausibel (Bild `a1/12-falsch.png` zeigt sie nicht). Wird beim Feinschliff am Handy nachgestellt. Dazu der Hinweis „Lies unten unter ‚Kurz erklärt‘ nach“, der Kleinen ohne Vorlesen wenig hilft.
7. **Hover-Grün ähnlich dem Richtig-Grün: Vermutung.** Geht an den `design-pruefer` beim Feinschliff.
8. **Experte auf nur 3 von 36 Karten: bekannt.** Teil A hat Experte bewusst nur auf Pilotkarten; der Ausbau steht im Plan (Wachsen lassen). Der Hinweis „… gibt es hier noch nicht“ ist ehrlich.

**Zum Helfer:** Seine Rückmeldung ist in `.claude/agents/spieltester.md` eingearbeitet: Lesen per `evaluate` ist erlaubt (Auslösen nicht), Hinweise zum Finden von Knöpfen und kurze Wartezeiten, ein kleines Startgerüst für das Skript, Zustand über mehrere Läufe durch Neuabspielen, Text statt Bild, wenn es nicht um das Aussehen geht, Ratemuster als eigene Zeile, ein festes Ende für „alle Fragen“, Schritte zählen je Handlung.
