// „Was ist neu?“ für Kinder: kurze Einträge, neueste zuerst.
// Ältere Einträge (vor dem Neustart) sind die frühere Chronik, in Kindersprache zusammengefasst
// (Nutzerentscheid 21.11.2026). Einen neuen Eintrag immer oben anfügen.

export type NeuigkeitSymbol = 'kompass' | 'globus' | 'stern' | 'buch' | 'lupe';
export type Neuigkeit = {id: string; datum: string /* JJJJ-MM-TT */; symbol: NeuigkeitSymbol; titel: string; text: string};

// Tag des Neustarts. Was davor kam, steht unter „Früher“.
export const NEUSTART = '2026-11-21';
// So viele neue Einträge stehen höchstens oben; der Rest rutscht unter „Früher“.
const OBEN_HOECHSTENS = 6;

export const NEUIGKEITEN: readonly Neuigkeit[] = [
  {id: 'drei-stufen', datum: '2026-11-23', symbol: 'stern', titel: 'Drei Stufen: Entdecker, Profi, Experte', text: 'Auf den Karten gibt es jetzt Fragen für jede Stufe. Ist es zu leicht oder zu schwer, schlägt die Karte eine andere Stufe vor.'},
  {id: 'erst-ein-leichter-satz', datum: '2026-11-23', symbol: 'lupe', titel: 'Erst ein leichter Satz', text: 'Auf vielen Karten steht oben ein kurzer, leichter Satz. Mehr erfährst du unter „Für Große“.'},
  {id: 'stimmt-das', datum: '2026-11-22', symbol: 'lupe', titel: 'Neu bei zwölf Karten: Stimmt das?', text: 'Prüfe eine Behauptung und rate weitere Fragen. Auf jeder Karte steht jetzt, warum die Nachbarkarte dazu passt.'},
  {id: 'neue-wissenskarten', datum: '2026-11-22', symbol: 'lupe', titel: 'Die Wissenskarten sind neu gemacht', text: 'Erst raten, dann lesen. Unten auf jeder Karte findest du, was dazu passt.'},
  {id: 'reisen-einfach', datum: '2026-11-22', symbol: 'globus', titel: 'Lernreisen beginnen ganz leicht', text: 'Jedes Kapitel beginnt mit ein paar kurzen Sätzen. Mehr steht unter „Für Große“.'},
  {id: 'neue-leiste', datum: '2026-11-21', symbol: 'kompass', titel: 'Neue Leiste, neue Schrift', text: 'Alle Bereiche findest du jetzt in einer Leiste. Die Schrift ist runder und leichter zu lesen.'},
  // Frühere Chronik (6. Oktober bis 7. November 2026)
  {id: 'lebenswege', datum: '2026-11-07', symbol: 'stern', titel: '18 Lebensgeschichten zum Ausprobieren', text: 'Bei 18 bekannten Menschen probierst du jetzt selbst etwas aus. Bei Ada Lovelace und Katherine Johnson vergleichst du Rechenwege.'},
  {id: 'lebenswege-neu', datum: '2026-11-05', symbol: 'stern', titel: '14 neue Lebensgeschichten', text: 'Lerne Menschen kennen, die zum Beispiel Sterne erforscht, Bilder gemalt oder Bücher geschrieben haben. Zu jedem gibt es drei Knobelfragen.'},
  {id: 'weltkarte-merkt-ort', datum: '2026-11-04', symbol: 'globus', titel: 'Die Weltkarte merkt sich deine Wahl', text: 'Wählst du auf der einfachen Weltkarte einen Ort, ist er beim Zurückkommen noch da.'},
  {id: 'landschaften', datum: '2026-11-03', symbol: 'globus', titel: '34 Landschaften neu erklärt', text: 'Dazu gibt es etwas zum Ausprobieren und Fragen zum Knobeln. Von dort reist du weiter zur Weltkugel.'},
  {id: 'buch-lebewesen', datum: '2026-11-02', symbol: 'buch', titel: 'Neue Wörter im Wissensbuch', text: 'Das Wissensbuch erklärt Evolution: wie sich Lebewesen über lange Zeit verändern. Dazu kommen winzige Lebewesen, Dürre und Warum-Fragen.'},
  {id: 'weltall-woerter', datum: '2026-11-01', symbol: 'stern', titel: 'Kometen, Galaxien und Lichtjahre', text: 'Neu erklärt: Asteroid, Komet, Galaxie, Lichtjahr und ferne Planeten. Mit eigenen Modellen probierst du selbst etwas aus.'},
  {id: 'bits-messwerte', datum: '2026-11-01', symbol: 'lupe', titel: 'Bits, Messwerte und Mittelwerte', text: 'Neu erklärt: Bits, die kleinsten Bausteine von Computerdaten, und Prüfsummen, die Fehler finden. Du vergleichst auch Messwerte.'},
  {id: 'zellen-gene', datum: '2026-10-31', symbol: 'lupe', titel: 'Zellen, DNA und Gene', text: 'Wie ist eine Zelle aufgebaut? Zeichnungen zeigen es, und du erfährst, was Gene und DNA tun.'},
  {id: 'kraft-bewegung', datum: '2026-10-31', symbol: 'kompass', titel: 'Kraft und Bewegung vergleichen', text: 'Was ist Trägheit, was Beschleunigung? An Bildern zum Mitmachen probierst du Reibung und Hebel selbst aus.'},
  {id: 'lesestelle-bleibt', datum: '2026-10-31', symbol: 'kompass', titel: 'Du findest leichter zurück', text: 'Gehst du zurück, landest du wieder dort, wo du gelesen hast. Das klappt auch mit großer Schrift.'},
  {id: 'hinweise-mit-zeit', datum: '2026-10-30', symbol: 'lupe', titel: 'Hinweise lassen dir Zeit', text: 'Ein Hinweis lässt dir Zeit für deine eigene Antwort. Nach einem Abstecher zu einer Karte findest du dorthin zurück, wo du warst.'},
  {id: 'atome-schiffe', datum: '2026-10-29', symbol: 'lupe', titel: 'Atome und schwimmende Schiffe', text: 'Neu erklärt: Atom, Proton und Elektron. Zeichnungen zeigen, warum ein schweres Schiff schwimmt.'},
  {id: 'licht-waerme-einheiten', datum: '2026-10-28', symbol: 'buch', titel: 'Licht, Wärme und Maßeinheiten', text: 'Das Wissensbuch erklärt Lichtwellen, Wärme und Einheiten wie Meter und Kilogramm. Dazu gibt es Warum-Fragen.'},
  {id: 'planetenreise-tag-jahr', datum: '2026-10-28', symbol: 'globus', titel: 'Tag und Jahr auf unserer Erde', text: 'Die Reise „Unser blauer Planet“ erklärt Tag und Jahr genauer. Vier Zeichnungen helfen dir beim Verstehen.'},
  {id: 'gemeinsame-form', datum: '2026-10-28', symbol: 'kompass', titel: 'Lesen, Forschen, Spielen', text: 'Alle drei sind jetzt gleich aufgebaut. Ein kurzer Einstieg hilft dir jeweils beim Anfangen.'},
  {id: 'startseite-fragen', datum: '2026-10-27', symbol: 'kompass', titel: 'Fragen mit Fotos auf der Startseite', text: 'Die Startseite zeigt Fragen mit passenden Fotos. Von dort geht es direkt zur Suche und zur Weltkugel.'},
  {id: 'spielvorschau', datum: '2026-10-27', symbol: 'kompass', titel: 'Spiele mit Vorschau-Bild', text: 'Kleine Bilder zeigen, wie ein Spiel aussieht. Nach einer Antwort erfährst du, was gepasst hat.'},
  {id: 'planeten-massstab', datum: '2026-10-27', symbol: 'stern', titel: 'Planeten-Abstände richtig vergleichen', text: 'Beide Planetenmodelle nutzen jetzt dieselben Abstände. Du kannst nachsehen, woher die Zahlen kommen.'},
  {id: 'gesteine-genauer', datum: '2026-10-26', symbol: 'lupe', titel: 'Steine und Wasser genauer erklärt', text: 'Neun Erklärungen zu Gesteinen, Grundwasser, Vulkanen und Polargebieten sind jetzt genauer. Bei jeder steht, woher das Wissen stammt.'},
  {id: 'merian-lehmann', datum: '2026-10-26', symbol: 'stern', titel: 'Maria Sibylla Merian und Inge Lehmann', text: 'Zwei Forscherinnen zeigen, wie man aus genauem Hinsehen eine Erklärung baut.'},
  {id: 'neues-aussehen', datum: '2026-10-26', symbol: 'kompass', titel: 'Ein neues Aussehen', text: 'Startseite, Wissenswelten und dein Entdeckerpass passen jetzt besser zusammen.'},
  {id: 'fundstueck-bronze', datum: '2026-10-25', symbol: 'lupe', titel: 'Was verrät ein Fundstück?', text: 'Mit ausgedachten Fundkarten lernst du, Material und Alter zu unterscheiden. Ein neuer Text erzählt von Bronze.'},
  {id: 'okapi-bruecken', datum: '2026-10-25', symbol: 'buch', titel: 'Okapi, Brücken und 3D-Druck', text: 'Ein Computerprogramm, eine KI, hat ein neues Okapi-Bild gemalt, und das steht auch dabei. Zeichnungen erklären Brücken und 3D-Druck.'},
  {id: 'wissenschaft-karten', datum: '2026-10-24', symbol: 'lupe', titel: '23 neue Wissenschafts-Karten', text: 'Von Druck und Schwingungen bis zu Zellen und fernen Planeten. Bilder zum Mitmachen helfen beim Vergleichen.'},
  {id: 'acht-bauwerke', datum: '2026-10-24', symbol: 'globus', titel: 'Acht berühmte Bauwerke', text: 'Entdecke Angkor Wat, die Oper von Sydney und sechs weitere Bauwerke. Zeichnungen zeigen, wie sie gebaut sind.'},
  {id: 'neun-erfindungen', datum: '2026-10-23', symbol: 'kompass', titel: 'Neun Erfindungen untersuchen', text: 'Fahrrad, Kühlschrank, Batterie und mehr. Bilder zum Mitmachen zeigen, wie sie funktionieren.'},
  {id: 'reisen-genauer', datum: '2026-10-23', symbol: 'globus', titel: '30 Reise-Kapitel genauer erklärt', text: 'Es geht um Berge, Flüsse, Klima, Vulkane und den Mond. Neue Bilder helfen dir beim Vergleichen.'},
  {id: 'reisen-ueberarbeitet', datum: '2026-10-21', symbol: 'globus', titel: '50 Reise-Kapitel leichter erklärt', text: 'Es geht um Erde, Länder, Lebensräume, Meere und Wetter. Neue Bilder laden dich zum Vergleichen ein.'},
  {id: 'anning-haytham', datum: '2026-10-21', symbol: 'stern', titel: 'Mary Anning und Ibn al-Haytham', text: 'Zwei neue Karten erzählen ihre Geschichte. Du prüfst selbst, was ein Beleg zeigen kann.'},
  {id: 'kamera-fernrohr', datum: '2026-10-21', symbol: 'kompass', titel: 'Kamera, Fernrohr und Mikroskop', text: 'Drei Karten zeigen, wie Licht beim Fotografieren und Vergrößern hilft. An Bildern probierst du es selbst aus.'},
  {id: 'tierspiele-klarer', datum: '2026-10-21', symbol: 'lupe', titel: 'Tierspiele sind klarer', text: 'Im Spiel Tierdetektiv helfen dir jetzt passende Beobachtungen. Eine angefangene Runde bleibt, auch wenn du die Seite neu öffnest.'},
  {id: 'laenderangaben', datum: '2026-10-21', symbol: 'globus', titel: 'Länderangaben neu geprüft', text: 'Kanadas Fläche und die Hauptstädte von Benin und Burundi stimmen jetzt mit neuen Quellen.'},
  {id: 'tiere-24', datum: '2026-10-20', symbol: 'globus', titel: '24 neue Tiere', text: 'Vom Schnabeltier bis zur Sepia, einem Tintenfisch, ist alles dabei. Zeichnungen zeigen, was an ihnen besonders ist.'},
  {id: 'khipu-stadtplan', datum: '2026-10-20', symbol: 'lupe', titel: 'Knotenschnüre und alte Stadtpläne', text: 'Zähle wie die Inka mit Knotenschnüren, den Khipu. An einem ausgedachten Plan der uralten Stadt Mohenjo-Daro prüfst du Vermutungen.'},
  {id: 'erdplatten', datum: '2026-10-20', symbol: 'globus', titel: 'Erdplatten besser verstehen', text: 'Neue Bilder zeigen, wie sich die Platten der Erde bewegen. Mit drei Knobelfragen findest du heraus, was man leicht verwechselt.'},
  {id: 'labor-irrtum', datum: '2026-10-18', symbol: 'lupe', titel: 'Aus Fehlern lernen im Labor', text: 'Alle elf Labore erklären jetzt, warum eine Antwort nicht passt. So kannst du weiterforschen.'},
  {id: 'tierkarten-forschen', datum: '2026-10-17', symbol: 'globus', titel: 'Tierkarten zum Forschen', text: 'Auf den Tierkarten deckst du Hinweise auf und findest heraus, was zusammengehört. Die Zahlen bei den Planeten sind am Handy gut lesbar.'},
  {id: 'reisen-hinweise', datum: '2026-10-17', symbol: 'buch', titel: 'Bessere Hinweise in den Reisen', text: 'Die Lernreisen geben dir bessere Hinweise zum Nachdenken. Bildtexte und Angaben, woher das Wissen stammt, sind am Handy gut lesbar.'},
  {id: 'offline-zaehler', datum: '2026-10-16', symbol: 'kompass', titel: 'Auch ohne Internet entdecken', text: 'Ein Zähler zeigt, wie viel der Seite schon ohne Internet bereitliegt. So siehst du, wann alles fertig ist.'},
  {id: 'lernreisen-weiterdenken', datum: '2026-10-13', symbol: 'globus', titel: 'Lernreisen zum Weiterdenken', text: 'Jede Reise hat Ziele und Knobelfragen. Auf einem Merkzettel hältst du fest, was du dir überlegt hast.'},
  {id: 'labore-vermuten', datum: '2026-10-12', symbol: 'lupe', titel: 'Vermuten, vergleichen, forschen', text: 'Schreib eine Vermutung auf und vergleiche zwei Beobachtungen. Alle elf Labore haben eigene Forschungsaufgaben.'},
  {id: 'spiele-31', datum: '2026-10-11', symbol: 'kompass', titel: '31 Spielideen', text: 'Finde unter 31 Spielen eins, das zu dir passt. Du siehst auch, wo du weiterspielen kannst.'},
  {id: 'guter-anfang', datum: '2026-10-11', symbol: 'kompass', titel: 'Ein guter Anfang', text: 'Die Startseite zeigt dir, womit du anfangen kannst. Von dort kommst du direkt in alle sechs Bereiche.'},
  {id: 'pass-aufgeraeumt', datum: '2026-10-10', symbol: 'kompass', titel: 'Dein Pass ist aufgeräumt', text: 'Entdeckungen, Sicherungskopie und Einstellungen haben je einen eigenen Platz. Auf dem Handy siehst du das Wichtigste zuerst.'},
  {id: 'mond-meer', datum: '2026-10-10', symbol: 'globus', titel: 'Mond und Meer erforschen', text: 'Warum sieht der Mond mal rund und mal wie eine Sichel aus? Zeichnungen erklären Mond und Gezeiten, ein Bild zeigt eine Küste bei Niedrig- und Hochwasser.'},
  {id: 'startseite-ueberblick', datum: '2026-10-09', symbol: 'kompass', titel: 'Die ganze Wissenswelt auf einen Blick', text: 'Wähle auf der Startseite eine Welt, suche eine Frage oder folge einer Wissensspur.'},
  {id: 'tipp-statt-loesung', datum: '2026-10-09', symbol: 'lupe', titel: 'Ein Tipp statt der Lösung', text: 'Steckst du fest, gibt es einen Tipp. Die ganze Erklärung kommt erst nach der richtigen Antwort.'},
  {id: 'pflanzen-wasser-mond', datum: '2026-10-09', symbol: 'globus', titel: 'Pflanzen, Wasser und der Mond', text: 'Acht neue Wissenskarten verbinden diese Themen. Bei der Wissens-Challenge suchst du dir eine von drei Stufen aus.'},
  {id: 'walhai-timbuktu', datum: '2026-10-09', symbol: 'stern', titel: 'Vom Walhai bis zur Wüstenstadt Timbuktu', text: 'Es kamen 18 Karten dazu, damit waren es 108. Neue Zeichnungen zeigen, wie Dinge funktionieren.'},
  {id: 'testseite', datum: '2026-10-09', symbol: 'kompass', titel: 'Neues wird erst getestet', text: 'Bevor du etwas Neues siehst, wird es auf einer Probe-Seite getestet. Die Suche findet Tierkarten jetzt leichter.'},
  {id: 'suchen-zuhoeren', datum: '2026-10-09', symbol: 'buch', titel: 'Suchen und Zuhören', text: 'Du findest Spiele und Begriffe über die Suche. Die Vorlesestimme kannst du dir aussuchen.'},
  {id: 'weiterspielen', datum: '2026-10-08', symbol: 'kompass', titel: 'Weiterspielen, wo du warst', text: 'Eine angefangene Spielrunde geht mit denselben Fragen weiter.'},
  {id: 'reise-fotos', datum: '2026-10-08', symbol: 'globus', titel: 'Fotos zum Reisebeginn', text: 'Passende Fotos begrüßen dich am Anfang einiger Lernreisen. Woher sie kommen, steht in den Bildnachweisen.'},
  {id: 'sechs-welten', datum: '2026-10-07', symbol: 'globus', titel: 'Sechs Wissenswelten', text: 'Von Tieren bis zu Erfindungen: sechs Welten mit den ersten 90 Karten. Auf Wissensrouten gehst du von Karte zu Karte.'},
  {id: 'neptun', datum: '2026-10-07', symbol: 'stern', titel: 'Wie weit ist es bis zum Neptun?', text: 'Vergleiche, wie weit die acht Planeten von der Sonne entfernt sind. Ein Zeitregler hilft beim Erkunden.'},
  {id: 'labore-was-wenn', datum: '2026-10-07', symbol: 'lupe', titel: 'Was passiert, wenn …?', text: 'Neue Labore, Länder-Steckbriefe und Naturspiele sind da. Probier etwas aus und prüfe deine Vermutung.'},
  {id: 'suche-sicherung', datum: '2026-10-07', symbol: 'kompass', titel: 'Suche, Sicherung und große Schrift', text: 'Du findest Dinge über die Suche und kannst deinen Pass als Datei sichern. Große Schrift und weniger Bewegung machen das Lesen leichter.'},
  {id: 'lernreisen-buch', datum: '2026-10-06', symbol: 'buch', titel: 'Lernreisen und Wissensbuch', text: 'Folge einem Thema Kapitel für Kapitel. Dazu gibt es Länder-Memory und das Wissensbuch.'},
  {id: 'weltkugel', datum: '2026-10-06', symbol: 'globus', titel: 'Eine Weltkugel voller Fragen', text: 'Dreh die Erde, schau in ihr Inneres und beobachte Tag und Nacht. Dazu gibt es ein Quiz, und die Seite liest dir vor.'},
];

const DATUM = new Intl.DateTimeFormat('de-DE', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'});

// '2026-11-21' → '21. November 2026'
export function datumLesbar(datum: string): string {
  return DATUM.format(new Date(datum + 'T00:00:00Z'));
}

// Teilt die Liste: oben die neuen Einträge seit dem Neustart, darunter „Früher“.
export function aufteilen(liste: readonly Neuigkeit[] = NEUIGKEITEN): {neu: Neuigkeit[]; frueher: Neuigkeit[]} {
  // Die Liste ist nach Datum sortiert, also stehen die neuen Einträge vorn.
  const neu = liste.filter(eintrag => eintrag.datum >= NEUSTART).slice(0, OBEN_HOECHSTENS);
  return {neu, frueher: liste.slice(neu.length)};
}
