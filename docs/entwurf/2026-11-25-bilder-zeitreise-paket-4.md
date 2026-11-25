# Bildkandidaten Zeitreise, Paket 4 (25.11.2026)

> Helferbericht (bild-recherche, sonnet), von Claude unverändert gesichert. Entwurf bzw. Befund, noch nicht umgesetzt.

Helfer: `bild-recherche`. Im Repository wurde nichts geändert. Zwischendateien (Vorschaubilder, Skripte) liegen nur im Scratchpad `/tmp/claude-0/-home-user-wunderkompass/85bd3235-f2d4-50d2-a34e-927efd2405a1/scratchpad/`.

## Prüftiefe (ehrlich)

- **Gelesen über die Commons-API** (`extmetadata`): Lizenz, Lizenz-Link, Urheber, Datum, Größe, Beschreibung. Das ist der Wikitext. Die gerenderte Dateiseite habe ich nicht geöffnet.
- **Vorvorhandene Löschanträge:** Für alle Hauptkandidaten und die meisten Ersatzbilder gibt es keine Löschdiskussion unter `Commons:Deletion requests/File:<Name>` (API: Seite fehlt). Die Löschanträge der Ersatzbilder Berliner Mauer Koreng, Reichstag Bundesarchiv und Zrenjanin habe ich nicht gesondert geprüft. Das ist nur eine Teilprüfung: Sammel-Löschanträge zu ganzen Kategorien oder Bildern desselben Werks erkennt sie nicht.
- **Bilder angesehen** habe ich nur als Vorschau mit 640 px Breite, nicht in voller Größe. Schärfe, Wasserzeichen und kleine Details sind nicht geprüft.
- **Nicht angesehen (nur API-Daten):** `Gedenkstätte Berliner Mauer, 170514, ako.jpg` (Vorschau scheiterte), `Luopan - Whipple Wh.0075.jpg` ist angesehen, aber nur Ersatz. Bei `Tribute in Light in 2010.jpg` und `9-11 Memorial (15276491640).jpg` ist die Vorschau angesehen.
- **Externe Quellen** (National Geographic, Canadian War Museum, US Air Force, Bundesarchiv, Museum Het Valkhof) habe ich nicht geöffnet.
- Alle Hauptkandidaten sind mindestens 960 px breit. Ausnahme: ein ausdrücklich so benannter Ersatz bei `history-reunification`.
- Ausschnitt-Hinweise sind aus den Vorschauen geschätzt (Prozentwerte vom Original, x von links, y von oben). Vor dem Einbau `--vorschau` benutzen.
- Foto-IDs: Alle vorgeschlagenen (auch die der Ersatzbilder) habe ich gegen `app/world-photos.json` geprüft. Keine ist belegt.
- Die API hat oft gebremst (leere Antworten). Ich habe Abfragen gebündelt, mit Pausen gearbeitet und den User-Agent `WunderKompass-Bildeinbau/1.0` benutzt.
- Dateiseiten-Adresse bei allen: `https://commons.wikimedia.org/wiki/File:` plus Dateiname mit `_` statt Leerzeichen.
- Das Feld `label` für Gemälde und Zeichnungen heißt im Bestand „Darstellung“ (Eingabe „Spätere Darstellung“), für Fotos „Foto“.

---

## A. Ohne Sonderregel

### 1. `history-zero` (Rechnen mit der Null; Brahmagupta, 628, Bhinmal)

- **Hauptkandidat:** `File:0121521 Chaturbhuj Temple, Gwalior Fort, Madhya Pradesh 37 (where is zero in this Hindu inscription).jpg`. Kennzeichnung: **Foto** (Inschrift im Chaturbhuj-Tempel in Gwalior mit einer markierten Null in der Zahl 270).
- **Passt, weil:** Es zeigt die älteste bekannte Steininschrift der Welt, die die Null als Zeichen benutzt (laut Dateibeschreibung; die Inschrift stammt aus dem Jahr 876, das ist aus meinem Wissen und nicht auf der Dateiseite geprüft). Ein Originalfoto von Brahmaguptas Handschrift von 628 habe ich nicht gefunden. Die Unterschrift muss sagen: „Null auf Stein, etwa 250 Jahre nach Brahmagupta“ und darf nicht behaupten, es sei sein Werk.
- **Größe:** 5016 x 3000, Aufnahme 15.12.2021.
- **Urheber:** Ms Sarah Welch. **Lizenz:** CC0 (https://creativecommons.org/publicdomain/zero/1.0/). Keine Namensnennung nötig, keine Weitergabe unter gleichen Bedingungen.
- **Ausschnitt:** Das Bild hat 1,67:1, also nahezu 16:9. 16:9: ohne Zuschnitt. 4:3: `focus 40% 50%`. Quadrat: `focus 35% 50%`, dabei fällt das Einsatzbild „270“ rechts oben weg; der blaue Kreis (bei etwa 67 % x) bleibt drin.
- **Alt-Text:** Eine große alte Steintafel mit eingeritzter Schrift. Ein blauer Kreis zeigt eine Zahl, in der eine Null als runder Kringel steht.
- **Vorgeschlagene Foto-ID:** `gwalior-zero-inscription`.
- **Nachweisvorschlag:** Ms Sarah Welch, CC0, Quelle: Wikimedia Commons (Adresse oben), eigenes Werk. Bearbeitung: Größe geändert, in WebP umgewandelt, ggf. zugeschnitten.
- **Risiken:** Das Bild ist eine Collage mit Pfeil, Einsatzbild und englischer Zahl „270“ (die Beschriftung wurde vom Fotografen eingefügt). Schrift ist nicht lesbar für Kinder; das Motiv ist eher abstrakt. Die Inschrift gehört zu einer anderen Zeit und einem anderen Ort als die Karte (Bhinmal, 628).
- **Ersatz:** `File:Bakhshali manuscript.jpg`, 1220 x 698, Foto einer Birkenrinde mit indischer Schrift, mit Pünktchen-Null (3. bis 4. Jahrhundert laut Dateibeschreibung). Lizenz „Public domain“ (Baustein `Cc-pd-mark`), Urheber „National Geographic“, Begründung der Datei: „nicht kreatives Bild eines 2D-Objekts“. **Rechtlich schwächer:** Die Gemeinfreiheit beruht auf einer Rechtsauffassung zur Reproduktion, keine Namensnennung nötig. Optisch das anschaulichere Bild für Kinder (Handschrift auf Rinde). Nur nehmen, wenn die Dateiseite vorher geöffnet und die Quelle geprüft ist.
- **Nicht gewählt:** `File:Bas-relief of Brahmagupta.jpg` (4208 x 3120, CC0). Es ist ein modernes Metall-Relief auf einer G20-Tafel („Welcome to Delhi“) mit Logo; für uns ungeeignet.

### 2. `history-compass` (Der Kompass hilft auf See, China)

- **Hauptkandidat:** `File:Chinese Mariner's Compass c. 1760, National Maritime Museum.jpg`. Kennzeichnung: **Foto** eines Museumsstücks (chinesischer Schiffskompass, um 1760, National Maritime Museum, Greenwich).
- **Passt, weil:** Es ist ein echter chinesischer Kompass mit Magnetnadel und Schriftzeichen. **Doppelung geprüft:** `invention-compass` zeigt `antique-pocket-compass` (`Boussole_01.JPG`, ein französischer Taschenkompass). Dieses Bild ist ein anderer Gegenstand aus einer anderen Kultur, also keine Doppelung. Ein „historischeres“ Motiv (der Löffel-Kompass der Han-Zeit) gibt es nur als Nachbau oder Zeichnung und hat keine passende freie Datei ergeben.
- **Größe:** 2288 x 1520, Foto von 2016, Gegenstand um 1760.
- **Urheber:** Victoria C. **Lizenz:** CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). Namensnennung und Weitergabe unter gleichen Bedingungen nötig.
- **Ausschnitt:** Kompass links, Deckel rechts, unten rechts ein Museums-Zettel mit der Zahl „4“. 4:3: `focus 38% 50%` (Zettel fällt aus dem Bild). 16:9: `focus 50% 45%`. Quadrat: Zuschnitt `links 0.18, oben 0.05, breite 0.60, hoehe 0.90`.
- **Alt-Text:** Ein runder Holzkasten mit einer Magnetnadel in der Mitte. Rundherum stehen chinesische Schriftzeichen für die Himmelsrichtungen. Daneben liegt der Deckel.
- **Vorgeschlagene Foto-ID:** `chinese-mariners-compass-1760`.
- **Nachweisvorschlag:** Victoria C, CC BY-SA 4.0, Quelle: Wikimedia Commons (Adresse), Gegenstand im National Maritime Museum. Bearbeitung: zugeschnitten, verkleinert, WebP.
- **Risiken:** Der Kompass ist von etwa 1760, nicht von 1000. Die Unterschrift muss „Schiffskompass aus China, etwa 1760“ sagen und nicht „der erste Kompass“. Spiegelung in der Vitrine, bläulicher Hintergrund. Es gibt zwei fast gleiche Dateien (`... c. 1760 (NAV0240), ... .JPG`, selbe Maße, selber Urheber); ich habe nur die erste angesehen.
- **Ersatz:** `File:Luopan - Whipple Wh.0075.jpg`, 3024 x 3024, CC0, Marsupium (Whipple Museum, Cambridge). Foto eines lackierten Luopan (chinesischer Kompass mit vielen Ringen aus Schriftzeichen). Keine Namensnennung nötig. Beeindruckend, aber für Kinder dicht; ein Luopan wird traditionell zum Ausrichten von Gebäuden benutzt, nicht für die Seefahrt (Unterschrift entsprechend: „chinesischer Kompass mit vielen Ringen“). Quadratisch, `focus 50% 50%`. Vorschlags-ID: `luopan-whipple`.

### 3. `history-polynesia` (Über den Pazifik ohne GPS)

- **Hauptkandidat:** `File:Hokule'a.jpg`. Kennzeichnung: **Foto** (Hōkūleʻa, ein **Nachbau** eines polynesischen Doppelrumpf-Kanus, gebaut 1975, bei der Ankunft in Honolulu nach der Reise von Tahiti, 26.08.1976).
- **Passt, weil:** Es zeigt ein Segelkanu auf offenem Meer, das nach alten Methoden (Sterne, Wellen, ohne GPS) gesegelt wurde. Das Bild ist farbig, scharf (in der Vorschau) und zeigt Menschen an Bord nur klein.
- **Größe:** 1728 x 1152.
- **Urheber:** Phil Uhl. **Lizenz:** CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/). Namensnennung und Weitergabe unter gleichen Bedingungen nötig.
- **Ausschnitt:** Kanu füllt das Bild. 4:3: `focus 50% 55%`. 16:9: `focus 50% 55%` (Mast oben und Rümpfe unten bleiben knapp drin). Quadrat: Zuschnitt `links 0.10, oben 0, breite 0.75, hoehe 1`.
- **Alt-Text:** Ein langes Segelkanu mit zwei Rümpfen und zwei großen hellbraunen Segeln fährt auf dem blauen Meer. Menschen stehen an Bord, kleine Boote begleiten es.
- **Vorgeschlagene Foto-ID:** `hokulea-1976`.
- **Nachweisvorschlag:** Phil Uhl, CC BY-SA 3.0, Quelle: Wikimedia Commons (Adresse), Aufnahme 1976. Bearbeitung: verkleinert, WebP, ggf. zugeschnitten.
- **Risiken:** Ein Nachbau (Unterschrift und Alt-Text sagen es). Die Reise ist 1976, die Karte meint die alte Zeit („um 1000“ als Orientierung). Auf dem Segel eine Hawaii-Flagge und eine US-Flagge; auf Deck viele kleine, nicht erkennbare Personen. Kleine Begleitboote (Küstenwache). Keine Markenzeichen im Bild gesehen.
- **Ersatz:** `File:Hokuclosecg copy.jpg`, 4700 x 2510, CC BY-SA 4.0, Matsujima. Ein Panorama vom Hōkūleʻa-Empfang an einer Küste Hawaiis: Das Kanu mit rotem Segel ist nur klein und weit hinten, im Vordergrund viele Zuschauer (Kinder im Wasser, erkennbare Gesichter). Deshalb nur Ersatz.
- **Nicht gewählt:** Die Reihe `Hokulea Homecoming 2017 (…)` (gemeinfrei, Region 5 Photography). Die geprüften Beispiele zeigen eine Kindergruppe auf einer Bühne und ein T-Shirt, kein Kanu. Marshall-Inseln-Stabkarten (`File:Stick chart used for navigation, Marshall Islands, undated - Ethnological Museum, Berlin - DSC01161.JPG`, 5472 x 3648, CC0, Daderot) sind sehr gute Objekte für „Wellen lesen“, stammen aber aus Mikronesien, nicht aus Polynesien. Nur als Ergänzung für ein späteres Bild zum Thema Wellen, nicht für diese Karte.

### 4. `history-bronze` (Bronze: neues Material, alte Werkzeuge)

- **Hauptkandidat:** `File:Bronze tools - Derbeden treasure - Bashkortostan National Museum.jpg`. Kennzeichnung: **Foto** von Bronzewerkzeugen aus dem Hortfund von Derbeden (Nationalmuseum Baschkortostan).
- **Passt, weil:** Es zeigt Äxte, Sicheln und einen Meißel aus Bronze, also Werkzeuge. Das passt zum Karteninhalt („Werkzeuge“). Es gibt keine Waffen im Einsatz; nur eine kleine Pfeilspitze (Nr. 7 auf dem Museumszettel). Die Karte hat ein Thema „altes Werkzeug neben neuem Material“; ein Foto, das Stein- und Bronzewerkzeug zusammen zeigt, habe ich nicht gefunden.
- **Größe:** 5111 x 2835, Aufnahme 01.11.2025.
- **Urheber:** Лапоть (Lapot). **Lizenz:** CC0 (https://creativecommons.org/publicdomain/zero/1.0/). Keine Namensnennung nötig.
- **Ausschnitt:** Sicheln und Äxte liegen auf hellgrauem Grund; unten links ein weißer Museumszettel mit russischem und baschkirischem Text. 16:9: `focus 50% 40%`. 4:3: Zuschnitt `links 0.10, oben 0, breite 0.80, hoehe 0.72` (schneidet den Zettel ab). Quadrat: `links 0.15, oben 0, breite 0.55, hoehe 0.75`.
- **Alt-Text:** Auf einem hellgrauen Tisch liegen alte Werkzeuge aus grünlich schimmerndem Metall: oben vier Äxte, in der Mitte große gebogene Sicheln.
- **Vorgeschlagene Foto-ID:** `derbeden-bronze-tools`.
- **Nachweisvorschlag:** Лапоть, CC0, Quelle: Wikimedia Commons (Adresse), Nationalmuseum der Republik Baschkortostan. Bearbeitung: zugeschnitten, verkleinert, WebP.
- **Risiken:** Die Datierung der Fundstücke (Spätbronzezeit?) steht nicht in den API-Daten; vor der Unterschrift prüfen oder allgemein „aus der Bronzezeit“ sagen. Der Zettel am Rand ist kyrillisch. Die Dateiseite wurde am 21.08.2026 zuletzt bearbeitet (junges Bild, kaum Prüfhistorie).
- **Ersatz:** `File:Celtic axes and pieces of Bronze Age sickles, museum Zrenjanin.jpg`, 1746 x 1120, CC BY-SA 4.0, Jozefsu (30.12.2016). Äxte und Sichelstücke in einer Vitrine in Zrenjanin (Serbien). Namensnennung und Weitergabe unter gleichen Bedingungen nötig. Breite reicht (über 960), das Bild ist aber ein Vitrinenfoto mit Spiegelung. Ich habe es nicht angesehen, nur die API-Daten gelesen. Vorgeschlagene ID: `zrenjanin-bronze-axes-sickles`.
- **Nicht gewählt:** `File:Socketed axe, Bronze age.jpg` (4928 x 3264, CC BY-SA 4.0, Museum Het Valkhof, 1000–800 v. Chr.). Sehr gutes Einzelstück mit Maßstab. Aber der Urheber steht als „Unknown author“, die Lizenz ist also auf der Dateiseite nicht sicher; erst nach Klärung der Dateiseite nehmen (dann wäre es ein hübsches Hauptbild).

### 5. `history-reunification` (Deutschland wird wiedervereinigt, 3. Oktober 1990)

- **Hauptkandidat:** `File:Reichstag building Berlin view from west before sunset.jpg`. Kennzeichnung: **Foto von heute** (Reichstagsgebäude, aufgenommen 04.11.2007).
- **Passt, weil:** Die Karte nennt als Beispiel die Feier vor dem Berliner Reichstag. Das Gebäude steht für die Einheit (vor dem Reichstag wurde 1990 die Fahne gehisst). Deutsche Fahnen wehen, blauer Himmel, keine Gewalt, kaum Personen.
- **Größe:** 8347 x 3157 (Panorama, etwa 2,6:1).
- **Urheber:** Jürgen Matern. **Lizenz:** CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/). Namensnennung und Weitergabe unter gleichen Bedingungen nötig.
- **Ausschnitt:** 16:9: Zuschnitt `links 0.18, oben 0, breite 0.64, hoehe 1` (ganzes Gebäude, nicht höher). 4:3: Zuschnitt `links 0.30, oben 0, breite 0.38, hoehe 1` (Mittelteil mit Kuppel und Fahne). Quadrat: `links 0.32, oben 0, breite 0.32, hoehe 1`. Das Original ist breit genug für alle Zuschnitte mit über 960 px.
- **Alt-Text:** Das Reichstagsgebäude in Berlin mit Säulen und einer großen Glaskuppel. Davor wehen schwarz-rot-goldene Fahnen am blauen Himmel.
- **Vorgeschlagene Foto-ID:** `reichstag-west-view`.
- **Nachweisvorschlag:** Jürgen Matern, CC BY-SA 3.0, Quelle: Wikimedia Commons (Adresse). Bearbeitung: zugeschnitten, verkleinert, WebP. Unterschrift: „Der Reichstag in Berlin, heute (2007)“, damit niemand es für ein Bild von 1990 hält.
- **Risiken:** Es ist kein historisches Bild. Personen sind sehr klein und nicht erkennbar. Das Panorama wurde zusammengesetzt (Dateiname `..._WC.jpg`); in voller Größe Nahtstellen prüfen.
- **Ersatz mit Einschränkung (besseres Motiv, aber zu schmal):** `File:Bundesarchiv Bild 183-1990-1003-400, Berlin, deutsche Vereinigung, vor dem Reichstag.jpg`, **nur 736 x 487**, Aufnahme 03.10.1990 (die Nachtfeier vor dem Reichstag mit Fahne und Menschenmenge). Lizenz CC BY-SA 3.0 de (https://creativecommons.org/licenses/by-sa/3.0/de/), Urheber Peer Grimm (ADN-Zentralbild, über das Bundesarchiv). Namensnennung und Weitergabe unter gleichen Bedingungen nötig. **Unter 960 px:** nur mit `mindestbreite_ok` und Begründung einbaubar (das Werkzeug erlaubt ab 640 px, Ausgabe dann 320, 640 und 736). Nur für kleine Kacheln. Menge und Fahnen, anonym, Mikrofon im Vordergrund. Vorschlags-ID: `reichstag-einheitsfeier-1990`. Die Bundesarchiv-Bilder der Serie 183-1990-1003 sind alle schmaler als 960 px (höchstens 800).
- **Nicht gewählt:** `File:Reunification of Germany (15353636431).jpg` (10335 x 4874, CC BY-SA 2.0, Archives New Zealand). Es ist ein Schreiben des neuseeländischen Außenministeriums mit einer Karte, kein Foto für Kinder.

---

## B. Belastende Themen (nur Orte, Gedenkstätten, Gegenstände)

Für alle vier gilt: Es gibt kein Gesicht in Nahaufnahme, keine Gewalt, keine Waffen, keine Opfer, keine Flammen oder Einsturzszenen. Ich habe nach Gedenkorten gesucht und nur welche gewählt, deren Bild ruhig ist.

### 6. `history-ww1` (Der Erste Weltkrieg, 1914–1918)

- **Hauptkandidat:** `File:Vivian Cummings - A Poppy Field, France CWM 20110004-024.jpeg`. Kennzeichnung: **Darstellung** (Aquarell eines Mohnfelds in Frankreich, 1918, gemalt vom kanadischen Soldaten und Architekten Vivian John Cummings; Bild des Canadian War Museum).
- **Warum für Kleine:** Ein stilles Landschaftsbild in Rot, Grün und Blau, ohne Menschen und ohne Kampf. Der Mohn ist das bekannte Zeichen des Gedenkens an den Krieg (laut Dateibeschreibung durch das Gedicht „In Flanders Fields“ von 1915). Kinder können es als schönes Bild sehen; Eltern können erklären, warum.
- **Größe:** 2024 x 923. Das Bild ist ein flaches Panorama (2,2:1).
- **Urheber:** Vivian John Cummings. **Lizenz:** Public domain (gemeinfrei; Dateiseite ohne weitere Angabe, Aquarell von 1918, Urheber vor langer Zeit gestorben; den genauen Baustein habe ich nicht gelesen). **Quelle:** Canadian War Museum, http://www.warmuseum.ca/collections/artifact/2216499. Keine Namensnennung nötig (Quellenangabe trotzdem setzen).
- **Ausschnitt:** 16:9: `focus 50% 55%`, wegen 2,2:1 bleibt oben und unten ein schmaler Streifen weg. 4:3: Zuschnitt `links 0.25, oben 0, breite 0.50, hoehe 1`. Quadrat: `links 0.30, oben 0, breite 0.45, hoehe 1`; dann bei 923 px Höhe nur etwa 923 px, also **nicht hochskalieren**: Ausgabe nur 640 oder kleiner. Für das große Titelbild reicht 16:9 oder 4:3.
- **Alt-Text:** Ein Aquarell von einem großen Feld mit leuchtend roten Mohnblumen. Dahinter stehen grüne Büsche, ein bläulicher Hügel und ein blasser Himmel. Es wurde 1918 gemalt.
- **Vorgeschlagene Foto-ID:** `cummings-poppy-field-1918`.
- **Nachweisvorschlag:** Vivian John Cummings, gemeinfrei, Quelle: Canadian War Museum (Adresse oben), über Wikimedia Commons. Bearbeitung: zugeschnitten, verkleinert, WebP. Kennzeichnung: Darstellung (Aquarell).
- **Risiken:** Kein Foto, ein Gemälde (Kennzeichnung „Darstellung“). Es zeigt den Krieg nur indirekt über das Mohn-Symbol; die Unterschrift muss das erklären. Die Dateibeschreibung ist englisch. Die Gemeinfreiheit ist plausibel, aber die Dateiseite nennt Cummings’ Lebensdaten nicht; vor dem Einbau Dateiseite öffnen.
- **Ersatz:** `File:Teddington, Poppies.jpg`, 2666 x 4000 (Hochformat), CC BY-SA 4.0, AndyScott (04.10.2019). Eine Metallskulptur aus drei großen roten Mohnblumen (Erster-Weltkrieg-Gedenken in Teddington, London, 2015 enthüllt). Namensnennung und Weitergabe unter gleichen Bedingungen nötig. **Risiken:** Hochformat, im Hintergrund ein Bürogebäude mit Aufschrift „Harlequin House“; Skulptur steht dauerhaft im öffentlichen Raum (Panoramafreiheit in Großbritannien deckt das, nicht von mir im Einzelfall geprüft). Zuschnitt auf die großen Blüten: `links 0.15, oben 0.02, breite 0.65, hoehe 0.45`. Vorschlags-ID: `teddington-poppies`.
- **Nicht gewählt:** Gräberfelder (`Tyne Cot cemetery`) und Namenswände am Menin-Tor (`Section of Menin Gate's Hall of Memory`, 3022 x 4906, CC BY 4.0) wegen Toten-Bezug und für Kinder unverständlich. Das britische „Poppies Falling From the Menin Gate“ steht unter OGL v1.0, keiner erlaubten Lizenz.

### 7. `history-holocaust` (Der Holocaust)

- **Hauptkandidat:** `File:Stolpersteine Stierstraße 21 Berlin-Friedenau 01.jpg`. Kennzeichnung: **Foto** (Stolpersteine, kleine Messing-Gedenkplatten im Pflaster vor einem Haus in Berlin-Friedenau).
- **Warum für Kleine:** Es sind keine Menschen zu sehen, nur Messingplatten im Pflaster. Kinder können fragen: „Was ist das?“, und Eltern erklären, dass hier Menschen wohnten, die verfolgt wurden. Der Gedenkort ist ruhig und alltäglich.
- **Größe:** 8144 x 5424, Aufnahme 04.04.2026.
- **Urheber:** Leonhard Lenz. **Lizenz:** CC0 (https://creativecommons.org/publicdomain/zero/1.0/). Keine Namensnennung nötig.
- **Panoramafreiheit:** Die Steine liegen dauerhaft auf öffentlichem Grund in Deutschland (§ 59 UrhG); Stolpersteine sind auf Commons üblich. Auf dieser Dateiseite ist keine Rechtefrage vermerkt, ein Löschantrag existiert nicht.
- **Ausschnitt:** Platten in einer Doppelreihe in der Bildmitte. 4:3 und 16:9: `focus 50% 55%`. Quadrat: Zuschnitt `links 0.30, oben 0.25, breite 0.45, hoehe 0.55`.
- **Alt-Text:** Im Pflaster einer Straße in Berlin liegen viele kleine goldene Gedenkplatten nebeneinander. Es sind Stolpersteine, sie erinnern an Menschen, die früher hier gewohnt haben.
- **Vorgeschlagene Foto-ID:** `stolpersteine-stierstrasse`.
- **Nachweisvorschlag:** Leonhard Lenz, CC0, Quelle: Wikimedia Commons (Adresse), eigenes Werk. Bearbeitung: zugeschnitten, verkleinert, WebP.
- **Risiken:** Auf den Platten stehen Namen real verfolgter Menschen, bei voller Größe wohl lesbar (in der Vorschau nicht). Das ist ein Gedenkzweck, kein Datenschutzproblem, aber im Alt-Text keine Namen nennen. Die Dateiseite wurde erst im April 2026 hochgeladen (junges Bild). Die Unterschrift muss erklären, was Stolpersteine sind, und darf nicht behaupten, hier sei etwas „passiert“; sie erinnern an Menschen, die hier wohnten. Hinweis auf die Zahl „etwa sechs Millionen“ nicht aufs Bild setzen.
- **Ersatz:** `File:Berlin, Denkmal für die ermordeten Juden Europas -- 2016 -- 5578.jpg`, 5460 x 3640, CC BY-SA 4.0, Dietmar Rabich (26.11.2016). Das Denkmal für die ermordeten Juden Europas in Berlin (Peter Eisenman, 2005): graue Betonblöcke, nebliger Tag, keine Personen im Bild. Namensnennung und Weitergabe unter gleichen Bedingungen nötig. Panoramafreiheit: Standort in Deutschland, auf der Dateiseite ist ein Baustein für den Standort eingebunden; geprüft habe ich das nicht im Einzelnen. 4:3 und 16:9: `focus 50% 70%`. Alt-Text: Viele graue Betonblöcke verschiedener Höhe stehen in Reihen auf einem Platz in Berlin. Dahinter sieht man Häuser. Vorschlags-ID: `memorial-murdered-jews-berlin`. **Risiko:** Für Kinder abstrakt; die Unterschrift muss sagen, dass es ein Denkmal ist.

### 8. `history-berlin_wall_build` (Die Berliner Mauer trennt Menschen)

- **Hauptkandidat:** `File:Berlin Wall Memorial at Bernauer Straße 01.jpg`. Kennzeichnung: **Foto** (Gedenkstätte Berliner Mauer, Bernauer Straße, Aufnahme 06.04.2025: ein erhaltenes Stück Mauer und dahinter die rostroten Stahlstäbe der Gedenkstätte).
- **Warum für Kleine:** Man sieht nur eine graue Betonmauer, Bäume und im Hintergrund winzige Besucher. Das Bild lässt ruhig fragen: „Warum steht hier eine Mauer?“ Keine Grenzsoldaten, keine Flucht.
- **Größe:** 5032 x 2816.
- **Urheber:** Ad Meskens. **Lizenz:** CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). Namensnennung und Weitergabe unter gleichen Bedingungen nötig. Die Dateiseite verlangt zusätzlich „© Ad Meskens / Wikimedia Commons“ und eine Mitteilung bei Gebrauch außerhalb von Wikimedia („erwünscht“, keine Pflicht der Lizenz).
- **Panoramafreiheit:** Gedenkstätte in Deutschland, dauerhaft im Freien; bei Bildern desselben Ortes führt Commons den Baustein `FoP-Germany` (gesehen bei der Datei von Koreng, nicht bei dieser). Bei der Meskens-Datei habe ich keine Löschdiskussion gefunden.
- **Ausschnitt:** Mauer links, Stäbe rechts, Besucher klein rechts in der Mitte. 16:9: `focus 50% 50%`. 4:3: Zuschnitt `links 0.02, oben 0, breite 0.72, hoehe 1`. Quadrat: Zuschnitt `links 0.02, oben 0, breite 0.55, hoehe 1`.
- **Alt-Text:** Ein langes Stück der Berliner Mauer aus grauem Beton steht zwischen Bäumen. Daneben stehen rostrote Stäbe in einer Reihe. Es ist ein Gedenkort in Berlin.
- **Vorgeschlagene Foto-ID:** `berlin-wall-memorial-bernauer`.
- **Nachweisvorschlag:** Ad Meskens, CC BY-SA 4.0, Quelle: Wikimedia Commons (Adresse), eigenes Werk. Bearbeitung: zugeschnitten, verkleinert, WebP.
- **Risiken:** Im Bild stehen drei bis vier kleine Besucher, nicht erkennbar. Der Urheber-Eintrag in der API enthält einen Textblock; im Nachweis nur „Ad Meskens“ angeben. Das Bild zeigt den Gedenkort von heute, nicht den Mauerbau 1961; die Unterschrift muss sagen: „Ein Stück der Mauer, heute Gedenkstätte in der Bernauer Straße“.
- **Ersatz:** `File:Berliner Mauer, Bernauer Straße, Berlin, 160326, ako.jpg`, 5472 x 3648, **CC BY 3.0 de** (https://creativecommons.org/licenses/by/3.0/de/), Ansgar Koreng (26.03.2016). Nahaufnahme von Beton der Mauer mit Rissen, Rostresten und etwas Farbe. Namensnennung nötig (keine Weitergabe unter gleichen Bedingungen). Sehr ruhig, aber sehr abstrakt (nur Wandfläche). Quadrat und alles: `focus 50% 50%`. Vorschlags-ID: `berlin-wall-detail-bernauer`. Weitere Datei desselben Urhebers: `File:Gedenkstätte Berliner Mauer, 170514, ako.jpg` (5472 x 3648, CC BY-SA 4.0, mit Baustein `FoP-Germany`); **dieses Bild habe ich nicht angesehen**, nur die API-Daten.

### 9. `history-september11` (Die Anschläge vom 11. September)

- **Hauptkandidat:** `File:Tribute in Light (air force 2) tilt corrected.jpg`. Kennzeichnung: **Foto** (Lichtinstallation „Tribute in Light“ am Gedenktag, Blick über den Hudson auf Lower Manhattan; Aufnahme September 2006 aus dem Liberty State Park, Fassung vom 12.09.2009).
- **Warum für Kleine:** Zwei blaue Lichtsäulen in der Nacht über der Stadt; ein stilles, schönes Bild des Gedenkens, ohne Rauch, Trümmer oder Menschen. Es zeigt den Ort, ohne die Tat zu zeigen.
- **Größe:** 2984 x 1967.
- **Urheber:** Denise Gould (US Air Force). **Lizenz:** Public domain (Werk der US-Bundesregierung, Quelle: af.mil). Keine Namensnennung nötig; Quelle trotzdem angeben. Die genaue Vorlage (`PD-USGov-Military-Air Force` o. ä.) habe ich nicht gelesen, nur die API-Angabe „Public domain“.
- **Panoramafreiheit / Rechte:** Die Lichtinstallation selbst (Künstler Julian LaVerdiere und Paul Myoda) kann urheberrechtlich geschützt sein; in den USA gibt es keine Panoramafreiheit für Kunstwerke. Das Foto ist als Regierungsarbeit frei, ob die Installation ein Schutzrecht auslöst, ist **offen**. Auf der Dateiseite gibt es keinen Löschantrag; ich habe keine Rechtsprüfung der Installation gemacht. **Unsicher, vor dem Einbau Dateiseite und Commons-Hinweise zum Thema „Tribute in Light“ lesen.**
- **Ausschnitt:** Stadt unten, Lichtsäulen oben Mitte. 16:9: `focus 50% 40%` (Wolkenkratzer und Lichtsäulen bleiben). 4:3: `focus 52% 45%`. Quadrat: Zuschnitt `links 0.30, oben 0, breite 0.42, hoehe 1`.
- **Alt-Text:** Nachts leuchten zwei lange blaue Lichtstrahlen aus der Stadt New York hoch in den Himmel. Unten glitzern viele Fenster in den Hochhäusern am Wasser.
- **Vorgeschlagene Foto-ID:** `tribute-in-light-2006`.
- **Nachweisvorschlag:** Denise Gould, U.S. Air Force, gemeinfrei, Quelle: Wikimedia Commons (Adresse), Ursprung af.mil. Bearbeitung: Neigung korrigiert (laut Commons), verkleinert, WebP.
- **Risiken:** Die Installation (siehe oben). Die Stadtfenster sind sehr dicht, im Kleinen unruhig. Die Unterschrift muss sagen, dass es ein Gedenklicht von Jahr zu Jahr ist und Menschen daran erinnert, die gestorben sind. Kein Bild mit Türmen oder Rauch.
- **Ersatz:** `File:Tribute in Light in 2010.jpg`, 4248 x 2832, Public domain, Sgt. Randall A. Clinton (US Marine Corps, 11.09.2010). Eine ruhige Aufnahme: eine blaue Lichtsäule über dem dunklen Wasser, kleine Skyline unten. Sehr kindgerecht, viel Himmel. **Schwäche:** Die Dateiseite trägt den Hinweis „Copyright-tag-still-required“ (der Lizenzbaustein ist laut Vorlagenliste dort nicht klar gesetzt, nur die Kennung des Marine Corps). Ich nehme sie deshalb nur nach Prüfung der Dateiseite. Gleiches Installations-Risiko. 16:9: `focus 50% 55%`. Vorschlags-ID: `tribute-in-light-2010`.
- **Weiteres, nicht empfohlen:** `File:9-11 Memorial (15276491640).jpg`, 2048 x 1368, CC BY 2.0, Christopher Michel (06.10.2014): schwarz-weißes Wasserbecken des Memorials mit Besuchern am Rand. Namensnennung nötig. Die Gestaltung des Memorials (Michael Arad) kann in den USA geschützt sein (keine Panoramafreiheit für Kunstwerke), und Besucher sind in der Nähe als einzelne Köpfe zu sehen. Nur nehmen, wenn die Rechtslage von jemandem geklärt ist. Vorschlags-ID: `pools-911-memorial`.

---

## Karten, für die ich kein freies Original in der Sollqualität gefunden habe

- **`history-reunification`:** Das beste historische Motiv (Bundesarchiv, 03.10.1990) ist schmaler als 960 px (736 px). Ich schlage deshalb den Reichstag von heute als Hauptbild vor und das Archivfoto nur als Option für kleine Kacheln. Ein KI-Bild wäre nicht nötig.
- **`history-zero`:** Es gibt kein freies Originalbild von Brahmaguptas Schrift (628). Ersatzweise die Null-Inschrift von 876 (Foto) oder die Handschrift von Bakhshali (rechtlich unsicher). Falls keins passt, wäre ein gekennzeichnetes Schaubild (eigene Illustration) besser als eine Fälschung; kein KI-Foto einer Person.
- **`history-compass`:** Kein Original aus der Zeit um 1000. Ein Museumsstück von 1760 muss in der Unterschrift klar als später benannt werden.
- **KI-Bilder:** Für keine der 9 Karten nötig.

## Offene Punkte für Claude und den Nutzer

1. **Belastende Karten:** Die Auswahl (Gedenkort, Pflaster, Mauerrest, Lichtsäulen, Mohn-Aquarell) ist aus meiner Sicht vertretbar für 5 bis 10 Jahre. Die Entscheidung liegt bei Claude und dem Nutzer; `kinder-redaktion` sollte die Unterschriften prüfen, besonders bei `history-holocaust` und `history-september11`.
2. **Rechtlich unsicher (vor dem Einbau Dateiseite öffnen):** Tribute in Light (Schutz der Lichtinstallation, keine US-Panoramafreiheit), Bakhshali (Gemeinfreiheit über „nicht kreatives 2D-Objekt“), Cummings-Aquarell (Lebensdaten nicht geprüft), Marine-Foto (Lizenzbaustein).
3. **Quelle der Lizenzbausteine:** Bei Lenz (CC0), Matern, Koreng, Meskens, Welch, Lapot, Victoria C, Phil Uhl habe ich die Angaben aus `LicenseShortName` und `LicenseUrl` der API entnommen (entspricht dem Wikitext-Baustein); den Baustein selbst habe ich nicht einzeln aus dem Wikitext gelesen.
4. **Namensnennung:** Pflicht bei Victoria C, Phil Uhl, Matern, Meskens, Rabich, Koreng (CC BY 3.0 de), Teddington, Zrenjanin. Keine Pflicht (CC0 oder gemeinfrei): Welch, Lapot, Lenz, Cummings, Gould, Clinton, Marsupium.
5. **Zuschnitte:** Vor dem Einbau `--vorschau` und `node scripts/foto-einbau.mjs <datei> --nur-pruefen` laufen lassen. Hochformate (Teddington) und das schmale Cummings-Panorama brauchen eine Sicht des `design-pruefer` bei 320 px.
6. **Fakten prüfen lassen** (`fakten-pruefer`): Datierung der Gwalior-Inschrift (876 steht nicht auf der Dateiseite), Datum der Hōkūleʻa-Ankunft (laut Dateiseite 26.08.1976), Datierung des Derbeden-Hortfunds, Aussage „Mohn als Gedenkzeichen“.

Dateien: `/home/user/wunderkompass/app/world-photos.json`, `/home/user/wunderkompass/app/world-catalog.json`, `/home/user/wunderkompass/scripts/foto-regeln.mjs`, `/home/user/wunderkompass/docs/entwurf/2026-11-25-bilder-zeitreise-erfindungen-paket-3.md`. Zu speichern unter `/home/user/wunderkompass/docs/entwurf/2026-11-25-bilder-zeitreise-paket-4.md`.
