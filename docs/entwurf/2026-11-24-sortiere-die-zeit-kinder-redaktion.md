# Kinder-Redaktion: „Sortiere die Zeit“, Endfassung (24.11.2026)

Helfer: `kinder-redaktion`. Geprüft: `docs/entwurf/2026-11-24-sortiere-die-zeit-endfassung.md`, Abschnitte 1 bis 4 und die offenen Fragen in Abschnitt 10; zum Vergleich der frühere Bericht `2026-11-24-drei-spiele-kinder-redaktion.md` und `app/kern/woerter.ts`. Nichts geändert.

## 1. Gesamteindruck: gut

Die Punkte aus dem früheren Bericht sind fast alle eingearbeitet (Namen als kurze Sätze in der Gegenwart, „Noch nicht ganz“ nirgends doppelt, „2 von 4“). Alle Namen haben höchstens 8 Wörter. Offen ist Feinschliff: die lange Anzeige nach dem Prüfen bei frühen Teilen (dreimal „vor“), der Profi-Tipp, zwei Einleitungssätze, ein Tipp ohne Hilfe und die Familien-Zeitwörter.

## 2. Befunde

**Offene Frage 6, Zeitwörter mit Familie:** „als Oma und Opa jung waren“ passt rechnerisch nicht (bei Jahrgang 2019 waren die Großeltern 1957 oft noch nicht geboren, 1993 um die 30); Familien sind verschieden (verstorbene Großeltern, Patchwork, Kinder bei den Großeltern). Vorschlag, im Muster von „vor 100 bis 200 Jahren“: „vor 30 bis 70 Jahren“ statt „als Oma und Opa jung waren“, „vor etwa 25 Jahren“ statt „als Mama und Papa Kinder waren“.

**Offene Frage 7, „Patent“:** behalten, mit Erklärzeile (nur Profi und Experte). „… darf … als Erfindung schützen lassen“ ist länger und schief. Erklärzeile: „Ein Patent schützt eine Erfindung. Andere dürfen sie dann nicht einfach nachbauen.“ Auf Experte die Zeile höchstens einmal je Rätsel. Gleicher Bau: „Bell bekommt ein Patent auf sein Telefon“.

**`nachDemPruefen` bei frühen Teilen:** „vor etwa 4.600 Jahren (um 2550 v. Chr.) · vor sehr, sehr langer Zeit“ hat dreimal „vor“ und 12 Wörter; „v. Chr.“ wird beim Vorlesen womöglich falsch gesprochen. Vorschlag: Beginnt `jahrText` mit „vor“, das `zeitwort` weglassen; die Klammer in eine zweite, kleinere Zeile, auf Entdecker ganz weglassen; Vorlesefassung schreibt „vor Christus“ aus. „vor etwa 2.050 Jahren“ → „vor über 2.000 Jahren (27 v. Chr.)“. Übrige `jahrText` können bleiben.

**`vChrErklaerung`:** „Gemeint ist: vor dem Jahr 1.“ erklärt nicht, warum 2550 früher ist als 27. Vorschlag: „v. Chr. heißt „vor Christus“, also vor dem Jahr 1. Hier zählt man rückwärts: Die größere Zahl ist früher.“

**Namen:**
- `zeit-dampfmaschine`: „Newcomens“ (fremder Name im Genitiv) für Entdecker schwer. → „Newcomen baut eine Dampfmaschine für Bergwerke“.
- `zeit-flugzeug`: „fliegt gesteuert“ holprig. → „Die Brüder Wright lenken ein Flugzeug mit Motor“ (`fakten-pruefer` gegenlesen).
- `zeit-internetseiten`: „Der Plan … entsteht“ abstrakt, Entdecker sehen das Teil. → „Ein Forscher hat die Idee für Internetseiten“.
- `zeit-webb`: sonst „Fernrohr“ (1608), hier „Teleskop“. → „Das Weltraum-Fernrohr Webb zeigt seine ersten Bilder“.
- `zeit-satellit` (Entdecker): neue `erklaerung` „Ein Satellit ist ein Gerät, das um die Erde kreist.“

**Einleitung:**
- Entdecker: „Was zuerst kam, steht ganz oben“ klingt, als stehe es schon dort. → „Ordne von früher nach später. Was zuerst kam, gehört ganz nach oben.“
- Experte: „Diese vier liegen nah beieinander“ stimmt für „Ganz früh“ nicht (3.800 Jahre). → „Ordne von früher nach später. Diesmal wird es knifflig.“
- Profi (falls Zahlen erst bei richtiger Lösung): „… Die Jahreszahlen siehst du, wenn alles stimmt.“

**Tipps:**
- Profi: „Ein Tipp: {name} – das war {jahrText}.“ wird lang, Zeiten passen nicht zusammen. → „Unter einem Teil steht jetzt seine Jahreszahl.“
- Experte, Weltall, `braucht: ["zeit-iss"]`: „In der ISS leben bis heute Menschen.“ sagt nichts über die Reihenfolge, „bis heute“ läuft ab. → „Wer in der ISS wohnen will, muss erst ins All fliegen können.“
- Bei neuem Namen für `zeit-internetseiten`: „Die Idee für Internetseiten kam etwa 20 Jahre nach der Mondlandung.“, „Das erste Smartphone kam vier Jahre nach der Idee für Internetseiten.“

**Rückmeldungen:**
- `profi_0`: → „Noch keins steht richtig. Versuch es noch einmal!“
- `profi_1`, `profi_2`: → „1 von 4 steht schon richtig.“, „2 von 4 stehen schon richtig.“
- `entdecker_eins`: → „Das grüne Teil steht schon richtig. Tausch die anderen zwei!“

**Kleinigkeiten:** `vorlesenKnopf` „Stationen“ → „Alles vorlesen“; `gespeichert` → „Gespeichert in deinem Entdeckerpass.“

## 3. Nötige Änderungen

1. Zeitwörter neutral: „vor 30 bis 70 Jahren“, „vor etwa 25 Jahren“.
2. Anzeige nach dem Prüfen: bei frühen Teilen kein `zeitwort`, Klammer in zweite Zeile bzw. auf Entdecker weg, „v. Chr.“ beim Vorlesen ausschreiben.
3. Profi-Tipp: „Unter einem Teil steht jetzt seine Jahreszahl.“
4. Einleitung Entdecker („gehört ganz nach oben“) und Experte („Diesmal wird es knifflig.“).
5. ISS-Tipp ersetzen.
6. `profi_0` mit „Versuch es noch einmal!“.
7. Patent-Erklärzeile höchstens einmal je Rätsel.
8. Namen Dampfmaschine, Flugzeug, Internetseiten.

## 4. Kann so bleiben

Alle übrigen Namen (darunter Karibik „erreichen“, Steinwerkzeuge, Feuer, Rom, Papier, Null, Mikroskop, Aufzug, Smartphone, ISS); übrige `jahrText`; `entdecker_keins`, `experte`, `richtig`, `geschafft`, Zähler, Prüf- und Weiter-Knopf, Spielliste und Mission; Entdecker-Tipp; Experte-Tipps zu Pyramide/Tagebuch, Dampflok, Kolumbus, Hooke, alle Motoren-Tipps, Satellit und die Rückfall-Sätze; „Patent“ als Wort.

## Unsicher

- „Das grüne Teil“: nicht nur Farbe, ein Haken wäre sicherer (`design-pruefer`).
- Ob „in Richtung Weltall“ für Goddards Rakete trägt (etwa 12 m hoch) und der Flugzeug-Wortlaut: `fakten-pruefer`.
- Ob 5-Jährige Freude am Sortieren mit versteckten Zahlen haben, zeigen nur echte Kinder.
