# Phase 1 „Neuer Kern“ – Entwurf

Stand: 21.11.2026 · Status: **vom Nutzer freigegeben am 21.11.2026**
Grundlage: [VISION.md](../../VISION.md), [Neuausrichtung](2026-11-21-neuausrichtung-design.md), [Katalog-Einordnung](2026-11-21-katalog-2027-einordnung.md), BACKLOG „Phase 1“.

## 1. Worum es geht

**Wunsch des Nutzers (21.11.2026, in seinen Worten):** „dass das Kind nicht gelangweilt wird und lernt und Spaß hat, ob jetzt alleine oder mit den Eltern zusammen, nach dem Motto: Es will dranbleiben und weitermachen, weil es ihm Spaß macht.“

Phase 1 baut dafür den Kern neu: Aussehen, Kopfzeile und Navigation, Wissenskarte, Weltenseite, Startseite, die Sammlung im Pass und „Was ist neu?“. Zuerst für das Handy (320–390 px), dann Tablet und Rechner.

**Für wen:** Kinder von 5 bis 10, meistens mit einem Elternteil, ab etwa 8 auch allein. Viele Fünf- und Sechsjährige lesen noch nicht selbst. Deshalb tragen Bilder, kurze Sätze und Vorlesen die Seite.

**Woran wir den Erfolg messen** (kein Kindertest, sondern prüfbare Eigenschaften):
- Auf der Startseite kann ein Kind im ersten Bildschirm etwas tun (eine Frage beantworten), ohne zu scrollen oder zu lesen, was ein Menü ist.
- Jede Karte endet mit einem sichtbaren, begründeten nächsten Schritt („Dazu passt“).
- Das Wichtige einer Karte passt auf etwa 3 Handy-Bildschirme (heute rund 7).
- Kinder sehen, was sie schon entdeckt haben, als Bilder, ohne Zahlen.

## 2. Ausgangslage (gemessen am 21.11.2026)

- **Länge:** Die Elefanten-Karte ist bei 390 px 5.514 px hoch (12 Abschnitte). Die Startseite ist 6.076 px hoch, eine Welt mit 48 Karten 6.930 px.
- **Startfragen:** 56 Karten haben eine `homeQuestion`. Gut sind etwa 15 (z. B. „Wie viele Arme hat ein Krake?“). Viele sind Schablonen („Wofür ist … besonders bekannt?“, „Welche Erklärung passt zu diesem Bauwerk?“). Sieben sind viel zu schwer („Ein langlebiger Stoff befindet sich in Beutetieren …“).
- **Welten:** Die App kennt sechs Welten (`animals` 48, `science` 46, `people` 36, `history` 34, `inventions` 24, `buildings` 16; zusammen 204 Karten). Die sieben Welten der VISION gibt es noch nicht.
- **Bilder:** Nur 56 von 204 Karten haben ein Foto (`animals` 24, `people` 25, `buildings` 7; `history`, `inventions`, `science` keins). Etwa 54 weitere haben eine eigene Zeichnung (`TopicIllustration`: Tiere, Personen, Diagramme, Geräte). **Etwa 94 Karten haben gar kein Bild:** alle 34 der Zeitreise, 21 von 24 Erfindungen, 9 Bauwerke, etwa 30 aus der Wissenschaft. In der Weltenliste steht bei ihnen nur ein Symbol.
- **Mini-Fragen:** Alle 204 Karten haben `question` (Frage, drei Antworten, richtige Antwort, Erklärung). Heute gilt: Nach einer falschen Antwort kommt „Überlege noch einmal.“, dazu gibt es einen aufklappbaren Hinweis. Die Erklärung (`why`) erscheint erst nach der richtigen Antwort, weil sie oft die Lösung verrät. Ein Browser-Test sichert das (`tests/browser/article-atlas.mjs`).
- **Verbindungen:** 196 erklärte Verbindungen mit Satz „warum“ (`world-connections.json`), auf beiden Karten angezeigt. 35 Karten haben keine einzige (Zeitreise 20, Erfindungen 6, Personen 4, Bauwerke 4, Wissenschaft 1). Daneben gibt es das Feld `related` ohne Begründung: 144 Einträge sind einseitig, viele sind Füller (Elefant und Honigbiene bei fast allen Tieren).
- **Belohnung heute:** Der Pass zeigt „Entdeckerpunkte“, Stufen mit Pokal, Abzeichen, Missionen. Die Kopfzeile zeigt „Entdeckerpass 0/19“.
- **Code:** Die meisten Teile liegen in `app/earth-explorer.tsx` (81 KB). Der ganze Kartenaufbau steht in `app/world-topic.tsx:42` in einer Zeile mit 7.660 Zeichen. `app/globals.css` ist 116 KB groß, mit 199 × `!important`. Das Einstiegs-CSS liegt mit 348 KB knapp unter seiner Grenze von 350 KB. Die Schrift ist „Trebuchet MS“, es gibt keine Webschrift.
- **Pass-Kopplung der Karte:**
  - Öffnen ruft `onActivity({type:'topic',id})` und `onVisit('topic:'+id)` auf.
  - Eine gelöste Mini-Frage ruft `onLearn(id)` (→ `learned:<id>`) und `onReview('world-question:'+id, correct)` auf.
  - Merken ruft `onFavorite('topic:'+id)` auf.
  - Der Zustand der Frage steckt in `SavedGame` mit `id='topic:'+id`.

## 3. Was gute Kinderseiten anders machen (ideen-scout, 21.11.2026)

Der Scout hat Klexikon, die Seite mit der Maus, logo!, Helles Köpfchen, National Geographic Kids und PBS Kids angesehen. Die Wirkungen sind seine Einschätzung, keine Studien.

1. **Bild und Tun zuerst:** großes Foto, eine Frage in Alltagswörtern, zwei bis drei Antworten zum Antippen.
2. **Fragen als Überschriften** (Klexikon): Artikel lassen sich so überfliegen.
3. **Der nächste Schritt ist immer sichtbar** (Maus: große Knöpfe am Seitenende).
4. **Welten als große Bildkacheln**, nicht als Liste.
5. **Vorlesen** löst keine der gesehenen deutschen Seiten gut. Für Leseanfänger kann das unser Vorsprung sein.
6. **Meiden:** Dauerjubel und Belohnungsschleifen (Elternkritik an einer Lern-App), Menüs mit vielen gleichwertigen Punkten, Suchfeld als Einstieg.

## 4. Ziele, Nicht-Ziele, Anti-Ziele

**Ziele**
1. Neues, einheitliches Aussehen für die ganze Seite: hell, bildstark, Kompass, Orange und Petrol, Glanz-Schimmer.
2. Navigation, die auf dem Handy mit dem Daumen erreichbar ist und bei 320 px nichts abschneidet.
3. Wissenskarte: kurz oben, „Rate mal!“ früh, Vertiefung freiwillig, „Dazu passt“ am Ende.
4. Weltenseite: große Bildkacheln, zwei pro Zeile auf dem Handy, Filter ohne Vorlauf.
5. Startseite: „Rate mal!“ mit Bild im ersten Bildschirm, dann „Weiter machen“ und die Welten.
6. Sammlung „Meine Entdeckungen“ im Pass, ohne Zahlen. Punkte, Stufen, Abzeichen und Missionen verschwinden aus der Ansicht.
7. „Was ist neu?“ neu: kurz, kindgerecht, mit Motiv je Eintrag.
8. Echte Verbindungen: Jede Karte bekommt mindestens eine erklärte Verbindung. Sichtbar sind nur noch Verbindungen mit Satz „warum“; Zufallsnachbarn verschwinden aus der Ansicht (BACKLOG Phase 1, Punkt 8).

**Nicht-Ziele (nicht in Phase 1)**
- Keine Neuordnung in sieben Welten. Die sechs heutigen Welten bleiben. Die Neuordnung kommt mit dem Umzug der Inhalte (ab Phase 2).
- Kein Neuschreiben aller Kartentexte. Das passiert Welt für Welt ab Phase 2. Phase 1 baut die Vorlage und nutzt die vorhandenen Felder.
- Keine Bildersuche für alle Welten. In Phase 1 nur für Zeitreise und Erfindungen (6.10) und einzelne Welt-Kacheln (6.4). Bauwerke, Wissenschaft und Tiere folgen in ihrer Welt-Phase.
- Spielplatz, Forscherlabor, Lernreisen, Wissensbuch und Globus behalten ihren inneren Aufbau. Sie bekommen nur Schrift, Grundfarben und die neue Hülle.
- Kein Dunkelmodus.
- Keine Begleitfigur. Die Idee kommt ins BACKLOG (Ideen).
- Keine Änderung am Pass-Speicher (Schema, Schlüssel, Felder).

**Anti-Ziele (wäre ein Fehlschlag, auch wenn es technisch läuft)**
- Ein Kind verliert Fortschritt, Merkliste oder Notizen.
- Ein alter Link führt ins Leere.
- Jubel-Animationen, Zähler oder „Dir fehlen noch 3!“, die zum Klicken statt zum Staunen verleiten.
- Neue Textwüsten: Die Karte wird nur anders sortiert, aber nicht kürzer.
- Die Seite wird langsamer oder sprengt ein Größenbudget.
- Seiten ohne Foto sehen aus wie kaputte Platzhalter.

## 5. Feste Grenzen (aus CLAUDE.md, hier nur das für Phase 1 Wichtige)

- Pass: Schema 3, App-ID `earth-explorer`, Schlüssel `erde-entdecken:save:v3`, Altpass `erde-entdecken:forscherpass:v2`, IndexedDB `earth-explorer`. **Phase 1 ändert den Speicher nicht.** Die Sammlung wird aus vorhandenen Einträgen (`discoveries`) berechnet.
- Alle Hash-Links funktionieren weiter. Das gilt besonders für:
  - `#home`, `#world`, `#world/<kategorie>`, `#world/<kategorie>/page/<n>`, `#world/topic/<id>`, `#world/route/<id>`
  - `#updates`, `#news…` → `#home`
  - die Routen der anderen Bereiche
- Karten-, Fragen- und Routen-IDs bleiben unverändert.
- Kostenlos; neue Pakete nur mit passender Lizenz, exakt gepinnt, mindestens 7 Tage alt.
- Bilder nur mit vollständigem Nachweis. Vorhandene Nachweise bleiben sichtbar erreichbar.
- Größenbudgets in `performance-budgets.json` halten (Einstiegs-CSS ≤ 350.000 B, Einstiegs-JS ≤ 1.000.000 B, CLS ≤ 0,1, LCP ≤ 6 s).

## 6. Der Entwurf im Einzelnen

### 6.1 Aussehen (Design-System)

- **Schrift:** Nunito als variable Schrift (Paket `@fontsource-variable/nunito`, Version 5.3.0, Lizenz OFL-1.1). Sie wird mit ausgeliefert, damit sie offline funktioniert; nur der lateinische Zeichensatz. Überschriften kräftig (750–850), Text 500. Ersatzschriften: `"Trebuchet MS", Arial, sans-serif`.
- **Größen (Handy):**
  - Fließtext 18 px, Zeilenhöhe 1,5
  - Kartentitel 30–34 px, Startfrage 28–32 px
  - Kleinster Text 14 px, nur für Bildnachweise und Nebenangaben
  - Keine kleinere Schrift als Notlösung
- **Farben** (Startwerte; die genauen Töne legt der Bauende nach Kontrastprüfung fest):

  | Rolle | Startwert |
  |---|---|
  | Hintergrund | warmes Weiß `#FAF8F3` |
  | Flächen | Weiß |
  | Text | dunkles Petrol `#15303A` |
  | Petrol (Links, Fokus, Auswahl) | `#0E6E72` |
  | Orange (Marke, Hauptknopf) | `#E8742A` |

  Text auf Orange und Orange als Schrift müssen WCAG AA erreichen (4,5 : 1). Dafür wird ein dunkleres Orange genutzt, wo nötig. Jede Welt behält eine zarte eigene Tönung (heute `--world-tint`/`--world-accent`).
- **Formen:** große Rundungen (16–24 px), weiche Schatten, Fotos randlos und formatfüllend (`object-fit: cover` mit sinnvollem Ausschnitt).
- **Tippflächen:** mindestens 48 × 48 px, Abstand zwischen Tippzielen mindestens 8 px.
- **Glanz-Schimmer:** Ein Lichtstreifen läuft einmal über eine Kachel. Er erscheint bei Mauszeigern beim Darüberfahren und auf Touch beim Antippen. Bei „Bewegung reduzieren“ (Systemeinstellung oder Pass-Einstellung `settings.reducedMotion`) gibt es keinen Schimmer und keine Animation. Der Schimmer überdeckt nie Text.
- **Bewegung:** kurz (150–250 ms), sanft; Wichtiges ist ohne Warten da.
- **Fokus:**
  - Ein sichtbarer Rahmen erscheint nur bei Tastaturbedienung (`:focus-visible`).
  - Der Fokus nach einem Seitenwechsel zeigt keinen großen Rahmen. Das Sprungziel für Bildschirmleser bleibt (BACKLOG Phase 1, Punkt 9).
- **Gilt für die ganze Seite:** Schrift, Grundfarben, Knöpfe, Fokus und Hülle wirken auch in den alten Bereichen. Deren eigene Gestaltung wird nicht umgebaut, aber wo sie mit der neuen Grundlage hässlich kollidiert, wird nachgebessert.
- **Kein Dunkelmodus** (`color-scheme: light` bleibt).

### 6.2 Hülle: Kopfzeile und Navigation

**Kopfzeile (alle Breiten):** Kompass-Logo mit „WunderKompass“ (führt zur Startseite), Suche (Symbol, öffnet die vorhandene Suche), Entdeckerpass (Symbol, ab Tablet mit Wort). **Kein Zähler** mehr am Pass-Knopf. „So geht’s“ wandert in den Fuß („Für Eltern“).

**Navigation Handy (bis unter 768 px):** Leiste unten am Bildschirmrand, immer sichtbar, mit allen sechs Bereichen, je Symbol und kurzes Wort:

```
┌────────────────────────────────────────┐
│ Start  Welten  Spielen  Labor  Reisen  Buch │
└────────────────────────────────────────┘
```

- Kurze Wörter statt der langen Namen, damit bei 320 px (je ca. 53 px) nichts abgeschnitten wird.
- Der aktive Bereich ist farbig hinterlegt.
- Die Leiste berücksichtigt den unteren Rand von Geräten ohne Knopf (`safe-area-inset-bottom`) und verdeckt keinen Inhalt.

**Navigation ab Tablet:** oben unter der Kopfzeile oder in ihr, mit den vollen Namen (Entdecken, Wissenswelten, Spielplatz, Forscherlabor, Lernreisen, Wissensbuch).

**Fuß (alle Breiten):** „Was ist neu?“, „Für Eltern“ (heutiger Hilfe-Dialog), „Auch ohne Internet“ (heutige Offline-Vorbereitung), Kurzzeile zur Seite.

### 6.3 Wissenskarte (`#world/topic/<id>`)

Aufbau von oben nach unten:

```
┌──────────────────────────────┐
│ ← Tierwelt                   │  Rückweg zur Welt (oder zur Herkunft)
│ [ großes Foto, randlos ]     │
│ Foto: Name · Lizenz          │  ein Satz, Link zum vollen Nachweis
│ Afrikanischer Savannenelefant│  Titel
│ Er lebt in Savannen …        │  intro (1–2 Sätze)
│ [🔊 Vorlesen] [♡ Merken]     │
├──────────────────────────────┤
│ RATE MAL!                    │
│ Was kann ein Elefant mit     │  question.prompt
│ seinem Rüssel tun?           │
│ [ Riechen und greifen     ]  │  question.answers, große Knöpfe
│ [ Unter Wasser atmen      ]  │
│ [ Wie ein Vogel fliegen   ]  │
│ → falsch: „Überlege noch     │  Hinweis aufklappbar, neu versuchen
│   einmal.“                   │
│ → richtig: Häkchen + Erklärung│ question.why, freundlich, ohne Jubel
├──────────────────────────────┤
│ Kurz erklärt                 │  paragraphs (oder chapters, s. u.)
│ Steckbrief                   │  facts als kompaktes Raster
│ Schon gewusst?               │  surprise
├──────────────────────────────┤
│ ▸ Ausprobieren               │  vorhandene Mitmach-Bausteine je Typ
│ ▸ Mehr erfahren              │  more, Karte/Ort, Forscherblick
│ ▸ Für Erwachsene: Quellen    │  sources, checkedAt, sourceNote
├──────────────────────────────┤
│ DAZU PASST                   │
│ [Bild] Giraffe – lebt auch … │  echte Nachbarkarte + Satz „warum“
│ [Bild] Auf dem Globus zeigen │  locations → Globus
│ [Bild] Spiel/Labor/Reise     │  links
└──────────────────────────────┘
```

- **Bildregel** (gilt für Karte, Kacheln, Sammlung und „Dazu passt“):
  1. Foto oder historische Abbildung, wenn vorhanden.
  2. Sonst die vorhandene Zeichnung auf der Weltfarbe, groß und ruhig.
  3. Sonst eine **gestaltete Motivkachel**: Weltfarbe, großes Weltsymbol, Titel. Sie muss absichtlich aussehen, nie wie ein grauer oder kaputter Kasten.
  - KI-Bilder, eigene Zeichnungen und Rekonstruktionen tragen auch auf kleinen Kacheln ein sichtbares Wort („KI-Bild“, „Zeichnung“, „Rekonstruktion“).
  - Wie viele der 94 Karten ohne Bild in Phase 1 ein echtes Bild bekommen: siehe 6.10.
- **„Rate mal!“**
  - Es ist die vorhandene Mini-Frage, nur weiter oben.
  - Das Verhalten bei Antworten bleibt wie heute: Falsch zeigt „Überlege noch einmal.“ und den aufklappbaren Hinweis, aber nicht die Erklärung. Neu versuchen geht sofort. Die Erklärung kommt erst mit der richtigen Antwort, damit der Stempel nicht geschenkt ist.
  - Eine richtige Antwort löst wie heute `onLearn(id)` und `onReview('world-question:'+id, true)` aus.
  - Ein ruhiges Häkchen erscheint. Kein Konfetti, kein Dauerjubel. Das vorhandene Geräusch nur, wenn der Ton an ist.
- **Vorlesen:** Die vorhandene Sprachausgabe des Browsers liest Titel, Einleitung und „Rate mal“ vor (heute „Kurzfassung vorlesen“). Ehrlicher Hinweis: Ob es offline klappt und wie die Stimme klingt, hängt vom Gerät ab.
- **Kurz erklärt:** Heute sind das die `paragraphs`. Die Vorlage kennt zusätzlich ein **optionales** neues Feld für Fragekapitel (z. B. `chapters: [{question, text}]`) und ein optionales Feld „Für Große“. Phase 1 legt nur die Darstellung an. Gefüllt werden die Felder ab Phase 2. Fehlen sie, gilt die heutige Darstellung.
- **Ausprobieren:** Die vorhandenen Bausteine je Kartentyp (Größenvergleich und Tierforscher-Werkstatt, Baupläne der Erfindungen, Bauwerk-Modelle, Untersuchungen, Belege zu Personen und Geschichte) ziehen unverändert in diesen aufklappbaren Bereich. Sie werden erst geladen, wenn man ihn öffnet. Ihr Inneres wird in Phase 2 bis 4 Welt für Welt überarbeitet.
- **Dazu passt:** höchstens drei große Bildkacheln.
  1. Eine echte Nachbarkarte aus `world-connections.json` mit ihrem Satz „warum“. Kein Ersatz durch `related`: Nach 6.8 hat jede Karte mindestens eine erklärte Verbindung.
  2. Der Ort auf dem Globus, wenn `locations` vorhanden ist.
  3. Ein passendes Spiel, Labor oder eine Reise aus `links`.
  Weitere erklärte Verbindungen stehen unter „Mehr erfahren“. Das Feld `related` wird auf der Karte nicht mehr angezeigt (es bleibt in den Daten).
- **Pass-Kopplung wie heute** (siehe Abschnitt 2): Öffnen, Mini-Frage, Merken, `SavedGame`. Der Haken „gelernt“ bleibt sichtbar.
- **Länge:** Bei 390 px reicht der offene Teil (bis einschließlich „Dazu passt“, ohne aufgeklappte Bereiche) bei einer typischen Tierkarte bis etwa 3 Bildschirmhöhen (≈ 2.600 px). Bei Karten mit langen `paragraphs` darf es mehr sein. Gekürzt wird aber nicht am Text, sondern über die Fragekapitel ab Phase 2.
- **Rückweg:** Der Pfeil oben führt zur Welt der Karte. Kam das Kind von der Startseite, aus der Suche oder aus „Dazu passt“, führt er dorthin zurück (heutiges `navigateHash`/Verlauf).

### 6.4 Weltenseiten

**Übersicht aller Welten (`#world`):**
- Sechs große Bildkacheln, zwei pro Zeile auf dem Handy, drei auf Tablet und Rechner. Jede Kachel hat Bild, Weltname und eine kurze Kinderfrage.
- Darunter die acht „Entdeckerwege“ (`WORLD_ROUTES`) als ruhige Liste und eine Kachel „Zum Globus“.
- Der Block mit Zählern („Dein Weg als Weltentdecker“, `WorldProgress`) entfällt.
- Für die Welt-Kacheln „Erfindungen“ und „Wissenschaft & Weltall“ darf `bild-recherche` je ein freies Foto mit vollständigem Nachweis suchen. Gibt es keins, bleibt die Zeichnung.

**Seite einer Welt (`#world/<kategorie>`):**

```
┌──────────────────────────────┐
│ [ Weltbild, flach ]          │
│ Die Tierwelt                 │
│ Wer lebt wo und warum?       │  kurze Kinderfrage
│ (Suche in der Tierwelt)      │  kleines Suchfeld
│ [Alle][Säugetiere][Vögel]…→  │  Filter als Wischleiste
├──────────────┬───────────────┤
│ [Foto]       │ [Foto]        │  2 Spalten bei 320–767 px
│ Elefant   ✓  │ Löwe          │  ✓ = schon entdeckt (ohne Zahl)
├──────────────┼───────────────┤
│ …            │ …             │
└──────────────┴───────────────┘
```

- **Raster:** zwei Spalten bis unter 768 px, drei auf Tablet, vier ab 1280 px. Jede Kachel ist Bild (formatfüllend, fester Seitenverhältnis-Rahmen) plus Titel. Die Einleitung erscheint nicht auf der Kachel.
- **Alle Karten einer Welt auf einer Seite** (höchstens 48), Bilder unterhalb des ersten Bildschirms laden verzögert. **Die Bilder im ersten Bildschirm laden sofort**, mit festen Maßen und Weltfarbe als Hintergrund, nie grau.
- **Alte Seitenlinks** (`#world/<kategorie>/page/<n>`) öffnen dieselbe Welt. Sie sollen zur passenden Stelle scrollen (Karte Nummer (n − 1) · 12 + 1), mindestens aber die Welt zeigen.
- **Filter:**
  - Tierwelt: Tiergruppe und Lebensraum als antippbare Wischleisten (heute im aufklappbaren „Tiergruppe & Lebensraum“).
  - Andere Welten: kein Filter.
  - Zeitreise und Erfindungen: Der vorhandene Zeitleisten-Baustein bleibt als Knopf „Als Zeitleiste ansehen“ erreichbar.
  - Der Filterzustand überlebt den Rückweg von einer Karte (heute `history.state.wunderWorldSelection`).
- **Suche in der Welt:** kleines Feld über dem Raster. Die Mehrwortsuche bleibt.
- **Entdeckt-Zeichen:** ein kleines Häkchen auf Kacheln, deren Karte entdeckt ist (gleiche Regel wie die Sammlung, 6.6). Kein Zähler.

### 6.5 Startseite (`#home`)

```
┌──────────────────────────────┐
│ [ großes Foto: Krake ]       │
│ RATE MAL!                    │
│ Wie viele Arme hat ein Krake?│
│ [ 6 ]  [ 8 ]  [ 10 ]         │  große Antwortknöpfe, im 1. Bildschirm
│ (🔊)        Andere Frage ↻   │
├──────────────────────────────┤
│ → nach dem Tippen: Erklärung │
│   [ Mehr über den Kraken → ] │
├──────────────────────────────┤
│ Weiter machen: Eisbär →      │  nur wenn lastActivity vorhanden
├──────────────────────────────┤
│ Wohin geht die Reise?        │
│ [Tierwelt] [Zeitreise]       │  sechs Bildkacheln, 2 Spalten
│ [Große Köpfe] [Erfindungen]  │
│ [Bauwerke] [Wissenschaft]    │
├──────────────────────────────┤
│ Spielen, forschen, reisen    │
│ [Spielplatz] [Labor] [Reisen]│  plus Kachel „Zum Globus“
│ [Globus]                     │
└──────────────────────────────┘
```

- **„Rate mal!“ auf der Startseite**
  - Die Frage kommt aus einer neuen, kleinen Liste geeigneter Karten (z. B. `app/kern/start-fragen.json`, nur Karten-IDs).
  - Aufnahmeregeln:
    - Die Karte hat ein Foto.
    - Ihre Mini-Frage ist für 5- bis 10-Jährige verständlich.
    - Die Antworten sind kurz.
    - Mindestens 24 Einträge, aus mindestens drei Welten.
  - Schwache Mini-Fragen dieser Karten dürfen umformuliert werden (Inhaltsänderung an der Karte, geprüft von `kinder-redaktion` und `fakten-pruefer`).
  - Frage, Antworten und Erklärung sind dieselben wie auf der Karte. Die Antwort zählt genauso (`onLearn`, `onReview`, `SavedGame`), damit Kinder dieselbe Frage nicht zweimal „lösen“ müssen.
  - Auswahl: zufällig je Besuch, ohne Wiederholung in derselben Sitzung (heutige Schlüssel `wunderkompass-discovery-*` dürfen weiterverwendet oder ersetzt werden; sie sind kein Pass).
  - Schon gelöste Fragen kommen erst wieder, wenn alle anderen dran waren.
  - Der Vorlese-Knopf liest Frage und Antworten vor.
- **Erster Bildschirm:** Bei 360 × 640 und 390 × 844 sind Foto, Frage und alle Antwortknöpfe ohne Scrollen sichtbar (das Foto darf dafür flacher werden).
- **Entfällt:**
  - die Überschrift „Was möchtest du heute verstehen?“
  - das Suchfeld als Einstieg (die Suche bleibt in der Kopfzeile)
  - „Eine Frage. Zwei Welten.“, „Heute ausprobieren“ und „Entdeckung des Tages“
  - der Link „Direkt zur Weltkugel“ (dafür die Globus-Kachel)
  - Die Verbindungen aus „Eine Frage. Zwei Welten.“ leben in „Dazu passt“ weiter.
- **Bleibt:** „Weiter machen“ aus `progress.lastActivity` (heute `continueActivity`).

### 6.6 Sammlung „Meine Entdeckungen“ (Entscheidung des Nutzers, 21.11.2026: „Sammeln ohne Zahlen“)

- **Ort:** im Entdeckerpass, ganz oben, vor „Weiter machen“, „Gemerkt“, Sicherung und Einstellungen. Der Pass bleibt in Phase 1 ein Dialog; auf dem Handy füllt er den Bildschirm.
- **Inhalt:** Für jede Welt eine Reihe Bildkacheln der entdeckten Karten. **Entdeckt** heißt: Die Karte wurde geöffnet (`topic:<id>`) **oder** ihre Mini-Frage wurde gelöst (`learned:<id>`, auch auf der Startseite). So landet eine Antwort auf der Startseite sofort in der Sammlung, ohne dass ein Besuch vorgetäuscht wird. Neueste vorne (Reihenfolge von `discoveries`). Antippen öffnet die Karte.
- **Stempel:** Karten mit gelöster Mini-Frage (`learned:<id>`) tragen einen kleinen Kompass-Stempel.
- **Geheimnis-Kachel:** Je Welt höchstens eine Kachel „Was ist das?“ mit verschwommenem Bild einer noch nicht entdeckten Karte. Antippen öffnet sie.
- **Keine Zahlen:** keine Gesamtzahl, kein „3 von 48“, kein Fortschrittsbalken, keine leeren Plätze für alles, was fehlt.
- **Leerer Pass:** freundlicher Satz und Knopf „Rate mal auf der Startseite“.
- **Entfällt aus der Ansicht:** Entdeckerpunkte, Stufen, Pokal, Abzeichen, die fünf Weltmissionen aus `world-progress.tsx`, der Zähler am Pass-Knopf. Die gespeicherten Daten bleiben unverändert im Pass. Nur die Anzeige fällt weg.
- **Wie weit „keine Zähler“ reicht:** Es geht um die Belohnungsanzeige. Sie verschwindet aus Kopfzeile, Pass, Startseite, Weltenübersicht, Weltenseiten und Karte. In Spielen, Quiz und Reisen bleiben Rückmeldungen wie „7 von 10 richtig“ oder „Station 3 von 6“. Sie gehören zum Spiel oder zeigen den Weg, und diese Bereiche bleiben in Phase 1 innen gleich. Das Suchspiel auf dem Globus (`MISSIONS` in `earth-explorer.tsx`) ist ein Spiel und bleibt. Ob Spiele und Reisen später ruhiger rückmelden, prüft Phase 4.

### 6.7 „Was ist neu?“ (`#updates`)

- Eine einfache Liste, neueste oben. Je Eintrag: Datum, ein Motiv (Foto aus dem Bestand oder Symbol), eine Überschrift, höchstens zwei kurze Sätze für Kinder.
- Die Daten liegen in einer neuen kleinen Datei.
- Die alte Chronik entfällt aus der App: `app/update-history.ts` (107 KB), `app/update-history-view.tsx`, `content/update-history-evidence.json` und `app/update-history-test-evidence.json`, sofern nichts anderes sie braucht. Sie bleibt in der Git-Historie. Damit sind auch die verwaisten `evidence.file`-Texte erledigt.
- Jeder Teilschritt von Phase 1 bekommt einen Eintrag.

### 6.8 Verbindungen (Ziel 6)

- **Nur erklärte Verbindungen sind sichtbar.** „Dazu passt“ und „Mehr erfahren“ zeigen nur Verbindungen aus `world-connections.json`, jede mit Satz „warum“. Damit verschwinden die Zufallsnachbarn aus `related` (z. B. Elefant → Honigbiene oder Großer Panda) aus der Ansicht. Die 15 fehlenden Rückrichtungen in `related` spielen dann keine Rolle mehr für Kinder.
- **Neue Verbindungen für die 35 Karten ohne:** je mindestens eine, fachlich echt und mit einem Satz, den man einem Kind sagen kann. Bei der Zeitreise kann das auch die Nachbarin auf der Zeitleiste sein („Das kam danach …“), wenn der Zusammenhang wirklich besteht.
- **Die vorhandenen 196 Sätze** werden einmal durchgesehen, weil sie jetzt prominent auf jeder Karte stehen: Stimmt der Zusammenhang, versteht ein Kind den Satz?
- `fakten-pruefer` prüft Zusammenhänge und Aussagen, `kinder-redaktion` die Sprache.
- Das Feld `related` bleibt in den Daten (keine Umbenennung, keine Löschung von IDs). Ob es aufgeräumt oder ganz ersetzt wird, steht im BACKLOG (ab Phase 2, Welt für Welt).

### 6.9 Texte der neuen Oberfläche

Alle neuen Wörter (Knöpfe, Überschriften, Weltfragen, leere Zustände, Fehlermeldungen) prüft `kinder-redaktion`. Kartentexte bleiben bis auf die Startfragen (6.5) und die Sätze „warum“ (6.8) unverändert.

### 6.10 Bilder für die Karten ohne Bild

**Entscheidung des Nutzers (21.11.2026): Zeitreise und Erfindungen bekommen schon in Phase 1 echte Bilder.**

- **Umfang:** etwa 55 Karten: alle 34 der Zeitreise und die 21 Erfindungen ohne Bild. Die drei Erfindungen mit KI-Bild (3D-Drucker, Nähmaschine, Seismograf) bekommen ein Original, wenn es ein passendes gibt (CLAUDE.md: zuerst freie Originale).
- **Bauwerke und Wissenschaft** (etwa 39 Karten ohne Bild) bekommen vorerst die Motivkachel aus 6.3. Echte Bilder folgen in ihrer Welt-Phase (BACKLOG).
- **Art der Bilder:** zuerst freie Originale, vor allem von Wikimedia Commons: Fotos von Fundstücken, Bauwerken und Geräten, alte Gemälde, historische Drucke und Zeichnungen. Lizenz und Namensnennung geprüft, vollständiger Nachweis in `world-photos.json` (Urheber, Lizenz, Quelle, Bearbeitung, Alternativtext).
- **Ehrlich benennen:** Ein Bild, das lange nach dem Ereignis gemalt wurde, heißt „Spätere Darstellung“; alte Drucke heißen „Historischer Druck“ (beide Kennwörter kennt der Code schon). Rekonstruktionen heißen so.
- **Kindgerecht:** keine Gewalt-, Kriegs- oder Leidensszenen im Vordergrund, auch nicht bei historischen Gemälden. Lieber ein Fundstück, ein Werkzeug oder einen Ort zeigen.
- **Passt das Bild zur Karte?** `bild-recherche` schlägt vor und prüft Rechte; ich prüfe, ob Motiv und Karte fachlich zusammenpassen. Gibt es für eine Karte kein gutes freies Bild, bleibt die Motivkachel. Kein KI-Bild nur, damit jede Karte eins hat.
- **Technik:** WebP in 320, 640 und 960 px wie die vorhandenen Fotos. Die Offline-Vorbereitung lädt alle Bilder vor. Nach dem heutigen Schnitt (60 Fotos ≈ 2,2 MB) kommen grob 2 MB dazu (Schätzung, wird beim Bauen gemessen).
- **Ablauf:** Die Suche läuft mit mehreren `bild-recherche`-Helfern parallel schon während Teilschritt 2. Eingebaut werden die Bilder in Teilschritt 3 zusammen mit den Weltenseiten.
- Die Motivkachel aus 6.3 wird trotzdem gebaut, weil Bauwerke, Wissenschaft und künftige Karten sie brauchen.

### 6.11 Bildnachweise auf Seiten mit Kacheln

- Auf der Karte selbst bleibt die Nachweiszeile direkt unter dem großen Foto (Urheber, Lizenz, Link zum Original und zur Bearbeitung).
- Kleine Kacheln (Weltenseite, Weltenübersicht, Startseite, „Dazu passt“, Sammlung) zeigen nur Bild und Titel, dazu das Kennwort aus 6.3, falls nötig. Eine Nachweiszeile auf jeder Kachel wäre bei zwei Spalten und 320 px nicht lesbar.
- Dafür hat jede solche Seite am Ende einen aufklappbaren Block **„Bildnachweise auf dieser Seite“** mit dem vollständigen Nachweis jedes dort gezeigten Fotos (Urheber, Lizenz mit Link, Quelle, Bearbeitung). Das entspricht der heutigen Regel im Code („credit=false requires full attribution on this page“) und dem Weg, den CC-Lizenzen ausdrücklich erlauben (Nachweis „in angemessener Weise“, auch über einen Link).
- Ein Test prüft: Jedes Foto auf einer Kachelseite steht mit Urheber, Lizenz und Quelle in diesem Block.

## 7. Wie gebaut wird (Weg und Entscheidung)

**Gewählt (Claudes Entscheidung, der Nutzer hat die Technik übergeben): neuer Kern frisch geschrieben, Stück für Stück eingesetzt.**
- Die neuen Teile entstehen in eigenen, kleinen Dateien (Vorschlag: `app/kern/`) mit normaler Zeilenlänge und eigener schlanker Gestaltungsdatei.
- Die Hülle (Kopfzeile, Navigation, Fuß) wird aus `app/earth-explorer.tsx` herausgelöst. Die alten Bereiche hängen weiter in der neuen Hülle.
- Ersetzte alte Teile werden entfernt, sobald nichts mehr sie braucht (Kein Bestandsschutz). Das betrifft:
  - die alten Startseiten-Bausteine `discovery-*`
  - die alte Kartenansicht und Weltenliste
  - das Punkte- und Abzeichen-Panel
  - die alte Chronik
  - ihre Gestaltungsregeln

  Das schafft auch Platz im CSS-Budget.

Verworfen:
- **Nur neu anmalen** (Gestaltungsregeln über den alten Aufbau legen): Die Karten blieben 7 Bildschirme lang. Jede Regel kämpft gegen 199 × `!important`, und das CSS-Budget ist fast voll.
- **Zweite Seite daneben und am Ende umschalten:** Pass, Routen und Offline-Liste müssten doppelt angebunden werden. Der Nutzer sähe lange nichts, und das Umschalten wäre ein großer Sprung statt kleiner Schritte.

## 8. Reihenfolge der Teilschritte

Jeder Teilschritt läuft durch Bauen → `pnpm run check` → passende Helfer → Vorschau und Screenshots → PR nach `test-live` → „ok“ des Nutzers → STATUS/BACKLOG/CHANGELOG und Eintrag in „Was ist neu?“.

| Nr. | Teilschritt | Inhalt |
|---|---|---|
| 1 | Aussehen und Hülle | Schrift, Farben, Fokus, Knöpfe; Kopfzeile, untere Leiste (Handy), obere Navigation (ab Tablet), Fuß; alte Bereiche an die Grundlage anpassen; neue „Was ist neu?“-Ansicht mit dem ersten Eintrag |
| 2 | Wissenskarte | neue Karte (6.3), „Dazu passt“, Verbindungen bereinigen (6.8) |
| 3 | Weltenseiten und Bilder | Übersicht und Seite einer Welt (6.4), Motivkacheln, Bildnachweise je Seite (6.11), etwa 55 Bilder für Zeitreise und Erfindungen (6.10, Suche läuft schon ab Teilschritt 2), optional zwei Welt-Fotos |
| 4 | Startseite und Sammlung | „Rate mal!“ mit Fragenliste (6.5), Sammlung im Pass, Punkte und Abzeichen aus der Ansicht (6.6) |
| 5 | Feinschliff und Abschluss | `design-pruefer` in 320/390/768/1280/1440 px, Befunde beheben, `test:full` in Chromium, Firefox und WebKit, große Schlussprüfung (mit `fable`, sofern die Ausnahme vorbei ist; sie prüft auch die Strecke ab `b53f75f`), Frage an den Nutzer zum Veröffentlichen für Freunde |

Die Reihenfolge Karte vor Startseite ist Absicht: Die Startseite nutzt die „Rate mal“-Logik und die Kacheln der Karte und der Welten.

## 9. Prüfen

- **Tests, die neu dazukommen oder angepasst werden** (nach den Regeln in CLAUDE.md, Abschnitt „Tests“):
  - Karte: Öffnen schreibt `topic:<id>`, eine richtige „Rate mal“-Antwort schreibt `learned:<id>`, Merken schaltet `favorites`, alles übersteht Neuladen.
  - Startseite: Die „Rate mal“-Antwort zählt für dieselbe Karte. Jede ID der Startliste existiert und hat ein Foto.
  - Karte: Eine falsche Antwort zeigt „Überlege noch einmal.“ ohne Erklärung und ohne `learned:<id>`, auch nach Neuladen (der vorhandene Test in `article-atlas.mjs` zieht auf die neue Karte um).
  - Sammlung: wird aus einem ausgedachten Testpass richtig berechnet, zeigt keine Zahlen. Eine Karte, deren Frage nur auf der Startseite gelöst wurde (nur `learned:<id>`), erscheint in der Sammlung.
  - Bildnachweise: Jedes Foto auf einer Kachelseite steht vollständig im Block „Bildnachweise auf dieser Seite“; KI-Bilder und Rekonstruktionen tragen ihr Kennwort.
  - Routen: alle in Abschnitt 5 genannten Hash-Links, dazu ein Altpass-Import, der danach in der Sammlung sichtbar ist.
  - Weltenseite: `page/<n>` öffnet die Welt; der Filter überlebt den Rückweg.
  - Navigation: alle sechs Bereiche bei 320 px erreichbar, nichts abgeschnitten, kein waagerechter Überlauf.
  - Inhalt: neue Felder sind optional; jede Karte hat mindestens eine Verbindung in `world-connections.json`; jede Verbindung hat einen Satz „warum“ und zeigt auf zwei vorhandene Karten; die Karte zeigt keine `related`-Nachbarn ohne Satz.
- **Bestehende Tests**, die an alten DOM-Klassen hängen (laut Bestand etwa 23 Dateien, z. B. `discovery-hero`, `mode-tabs`, `world-article`): Sie werden auf die neuen Bausteine umgestellt, wenn sie Pass, IDs, Links oder genutzte App-Logik schützen. Tests auf entfernte Ansichten werden entfernt. Keine Prüfung wird abgeschwächt.
- **Rauchtest** (`tests/browser/smoke.mjs`) auf den neuen Kern umstellen, weiterhin 360 px (Touch) und 1440 px, mit Bildern vorher/nachher.
- **Helfer:**
  - `design-pruefer` (alle fünf Breiten) nach Teilschritt 1 bis 4 und am Ende
  - `kinder-redaktion` für Oberflächentexte und Startfragen
  - `fakten-pruefer` für Startfragen und Verbindungssätze
  - `code-pruefer` für jeden PR, besonders Pass, IDs und Links
- **Budgets:** Einstiegs-CSS und Einstiegs-JS dürfen nicht wachsen. Ziel ist, dass sie kleiner werden. Die neue Karte lädt im ersten Schritt nicht mehr JavaScript als die alte.

## 10. Fertig, wenn

- [ ] Alle fünf Teilschritte sind in `test-live`, jeder mit „ok“ des Nutzers.
- [ ] Startseite bei 360 × 640 und 390 × 844: Foto, Frage und alle Antworten im ersten Bildschirm.
- [ ] Karte bei 390 px: offener Teil einer typischen Tierkarte ≈ 3 Bildschirmhöhen, „Dazu passt“ mit begründeten Kacheln.
- [ ] Welten: zwei Spalten bei 320–767 px, im ersten Bildschirm keine grauen Platzhalter.
- [ ] Navigation: alle sechs Bereiche mit einem Tipp, nichts abgeschnitten bei 320 px, Tippflächen ≥ 48 px.
- [ ] Keine Punkte, Stufen, Abzeichen oder Belohnungszähler mehr in Kopfzeile, Pass, Startseite, Welten und Karte (Spiele, Quiz und Reisen siehe 6.6); die Sammlung zeigt Entdecktes als Bilder.
- [ ] Jede Karte hat mindestens eine erklärte Verbindung; keine Karte zeigt einen grauen oder leeren Bildkasten.
- [ ] Zeitreise und Erfindungen: Jede Karte hat ein freies Bild mit vollständigem Nachweis oder, wenn es nachweislich kein passendes gibt, die Motivkachel (Liste der Ausnahmen im BACKLOG).
- [ ] Pass, Altpass, Sicherung und alle alten Links unverändert funktionsfähig (Tests grün).
- [ ] `pnpm run check` grün, `test:full` in drei Browsern grün, Budgets gehalten.
- [ ] `design-pruefer`-Befunde behoben oder mit Grund im BACKLOG.
- [ ] „Was ist neu?“ hat je Teilschritt einen Eintrag.

## 11. Dem Bauenden überlassen

- Genaue Datei- und Komponentenstruktur, Name des neuen Ordners
- Genaue Farbtöne nach Kontrastprüfung, Schatten, Abstände, Rundungen im Rahmen von 6.1
- Bruchstellen zwischen Handy, Tablet und Rechner im Rahmen von 6.2 und 6.4
- Namen der neuen optionalen Kartenfelder (6.3), solange sie optional sind und nichts Bestehendes brechen
- Ob `world-catalog.json` für schnellere Karten aufgeteilt wird
- Wie genau der Schimmer gebaut wird
- Welche alten CSS-Dateien ganz entfallen und welche verkleinert werden
- Reihenfolge der Commits innerhalb eines Teilschritts

## 12. Entscheidungen

**Vom Nutzer entschieden (21.11.2026):**
- Ziel: Kinder sollen dranbleiben, weil es Spaß macht und sie lernen, allein oder mit Eltern.
- Belohnung: „Sammeln ohne Zahlen“ statt Punkte, Stufen und Abzeichen.
- Bilder: Zeitreise und Erfindungen bekommen schon in Phase 1 echte, freie Bilder (6.10); die übrigen Karten ohne Bild bekommen vorerst Motivkacheln.
- Technik und Gestaltung im Einzelnen entscheidet Claude; bei Richtungsfragen fragt Claude mit Auswahl.
- Freigabe des Entwurfs (21.11.2026). Dazu: Auch beim Aussehen und bei der Startseite ist Claude frei in der Gestaltung und nimmt den Nutzer mit, wie sonst auch.

**Von Claude entschieden (der Nutzer kann widersprechen):**
- Sechs Welten bleiben in Phase 1; sieben Welten erst mit dem Umzug der Inhalte.
- Neuer Kern frisch geschrieben statt umgemalt (Abschnitt 7).
- Untere Leiste mit allen sechs Bereichen auf dem Handy, kurze Wörter (Start, Welten, Spielen, Labor, Reisen, Buch).
- Schrift Nunito.
- „Rate mal!“ als erstes Tun auf Karte und Startseite, aus den vorhandenen Mini-Fragen.
- Startseite ohne „Eine Frage. Zwei Welten.“, „Heute ausprobieren“ und „Entdeckung des Tages“.
- Alle Karten einer Welt auf einer Seite statt zwölf je Seite.
- Sammlung zeigt geöffnete Karten und Karten mit gelöster Frage; gelöste Fragen geben einen Stempel; höchstens eine Geheimnis-Kachel je Welt.
- „Rate mal!“ bleibt bei falscher Antwort wie heute: Hinweis statt Erklärung, damit der Stempel nicht geschenkt ist.
- Sichtbar sind nur noch erklärte Verbindungen; die 35 Karten ohne Verbindung bekommen neue, geprüfte Verbindungen; `related` bleibt in den Daten, wird aber nicht mehr angezeigt.
- Kleine Kacheln ohne eigene Nachweiszeile; dafür vollständige Nachweise je Seite im Block „Bildnachweise auf dieser Seite“.
- „Keine Zähler“ meint die Belohnungsanzeige; Spiele, Quiz und Reisen behalten ihre Rückmeldungen in Phase 1.
- Karten ohne Bild bekommen eine gestaltete Motivkachel; KI-Bilder, Zeichnungen und Rekonstruktionen sind auch auf Kacheln gekennzeichnet.
- Alte Chronik in „Was ist neu?“ entfällt aus der App.
- Begleitfigur als Idee ins BACKLOG, nicht in Phase 1.
