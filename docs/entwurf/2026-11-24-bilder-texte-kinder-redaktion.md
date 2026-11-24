# Bildtexte für 40 Fotos: Prüfung der `kinder-redaktion` (24.11.2026)

Geprüft: `docs/bilder/texte-2026-11-24.json` und der Bericht `2026-11-24-bilder-texte-karten-autor.md`. Bericht gekürzt auf die Befunde, sinngemäß wörtlich.

**Gesamtnote:** gut. Tier-Alt-Texte anschaulich und genau. Probleme: Fachwörter in captions („Kettenblatt“, „Jungsteinzeit“, „Kupferstich“, „Feuerzeug“), ein Satz beginnt mit Verneinung (Ibn Sina), „Gemälde“/„Spätere Darstellung“ steht bis zu dreimal sichtbar.

**Was der Code zeigt (nur im Code gelesen):**
- Auf der Wissenskarte steht die `caption` sichtbar direkt unter dem Foto, danach die Zeile `{label ?? 'Foto'}: {author} · Lizenz`. Was die caption an Künstler oder Kennwort nennt, steht also doppelt.
- In den Vorschauen auf der Startseite (`app/discovery-topic-media.tsx`, `creditDisclosure`) zeigt „{label} & Quelle“ caption **und** `alt_de` sichtbar untereinander. Der Alt-Text soll darum nichts aus der caption doppeln.
- Das Kennwort auf dem Bild (`span.kartenbild-kennwort`) liest der Bildschirmleser zusätzlich vor.

**Länge der Alt-Texte:** ein Satz mit 9 bis 20 Wörtern ist in Ordnung, keine allgemein kürzere Fassung. Nur Komma-Doppelsätze teilen.

## Befunde

Alt-Texte:
1. orca-jumping-pair: „Zwei schwarz-weiße Orcas springen gleichzeitig aus dem Meer. Beim vorderen sieht man den weißen Fleck hinter dem Auge.“
2. wright-flyer-museum: „Ein sehr altes Flugzeug mit zwei Stoff-Flügeln übereinander hängt unter einem Glasdach. Auf dem unteren Flügel liegt eine Figur.“
3. north-american-beaver: „Ein Biber mit nassem, braunem Fell steht am Ufer zwischen trockenem Gras und Wasser.“
4. common-cuttlefish („Flossensaum“ Fachwort): „Eine Sepia mit großem Auge, Armen vorn am Kopf und schmalen Flossen an der Seite schwebt über Algen am Meeresgrund.“
5. blue-whale-noaa: „Ein Blauwal von oben: ein langer, schlanker, blaugrauer Rücken im dunkelblauen Meer.“
6. mary-anning: „Mary Anning in grünem Mantel steht mit Hammer und Korb an der Küste, neben ihr liegt ein Hund.“ maria-sibylla-merian: „Maria Sibylla Merian mit lockigem Haar, Perlenkette und hellem Spitzenkragen über dem dunklen Kleid.“
7. nelson-mandela (Clinton doppelt): „Nelson Mandela lächelt in dunklem Anzug, neben ihm stehen mehrere Männer.“ caption bleibt.
8. lise-meitner („mit Mütze“ doppelt): „Schwarz-Weiß-Foto: Eine alte Frau mit Mütze steht zwischen Männern in Anzügen, ein großer Mann mit Brille beugt sich zu ihr.“ caption bleibt.

Bildunterschriften:
9. ibn-sina-manuscript: „Eine alte Buchseite, mit der Hand abgeschrieben. Darauf steht ein Text von Ibn Sina über Heilmittel für das Herz. Wann sie abgeschrieben wurde, weiß man nicht.“ (Optional Kennwort „Alte Handschrift“/„Buchseite“.)
10. neolithic-fire-kit: „Werkzeug zum Feuermachen aus der Steinzeit, viele tausend Jahre alt. Damit schlugen Menschen Funken. Feuer nutzten sie aber schon viel früher.“
11. chain-drive-bicycle: „Ein Fahrrad von heute mit nur einem Gang. Gut zu sehen: das große Zahnrad vorn (Kettenblatt), die Kette und das kleine Zahnrad hinten.“
12. ibn-al-haytham: „Ein Bild aus einem Buch von 1647, rund 600 Jahre nach seiner Zeit. Wie Ibn al-Haytham wirklich aussah, weiß niemand.“
13. murasaki-shikibu: „Gemalt über 600 Jahre nach ihrer Zeit, im 17. Jahrhundert. Wie Murasaki Shikibu wirklich aussah, weiß niemand.“
14. mary-anning: „Mary Anning mit ihrem Hund Tray. Das Bild wurde gemalt, als sie noch lebte, vor 1842.“
15. maria-sibylla-merian: „Maria Sibylla Merian, gemalt im Jahr 1679. Da war sie etwa 30 Jahre alt.“
16. wright-flyer-museum: „Das Flugzeug der Wright-Brüder von 1903 in einem Museum in Washington, USA. Die Figur zeigt: Der Pilot flog im Liegen.“

Personenfotos ohne caption: **alle drei bekommen eine.**
17. inge-lehmann: „Inge Lehmann auf einem Foto von 1932. Da war sie über 40 Jahre alt.“
18. rabindranath-tagore: „Rabindranath Tagore auf einem Foto von 1909.“
19. octavia-butler: „Octavia E. Butler im Jahr 2005.“ (nicht „beim Signieren“)

**„Was ist neu?“:** Text von B mit neuem Titel. Titel „Neue Fotos und alte Bilder“, Text: „Schnabeltier, Okapi, Seepferdchen und viele andere Tiere zeigen wir jetzt auf echten Fotos. Manche Bilder von Menschen wurden erst viel später gemalt.“ (Grund: „in echt“ widerspricht den späteren Gemälden; „Neu sind …“ doppelt „Was ist neu?“.)

**Mehr erfahren:** nichts verschieben. Merian-Satz „Jacob Marrel war ihr Stiefvater.“ nur nach Prüfung durch `fakten-pruefer`.

**Unsicher:** Bilder nicht gesehen (Mütze/Hut bei Meitner, „links“ bei Mandela). Fakten beim `fakten-pruefer`.

**Nebenbefund (außerhalb des Auftrags):** Alte captions in `app/world-photos.json` sind teils nicht kindgerecht (Leavitt „Historisches Porträt aus der 1922 veröffentlichten Reproduktion.“, Payne-Gaposchkin, Bell Burnell, Wu, Hadid, Hokusai, Bryce Canyon, White Sands). Vorbild: kurze captions „Name, Ort, Jahr“ (Darwin, Goodall). Eigener kleiner Durchgang → BACKLOG.
