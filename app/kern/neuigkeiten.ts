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
  {id: 'neue-leiste', datum: '2026-11-21', symbol: 'kompass', titel: 'Alles mit einem Tipp', text: 'Alle Bereiche stehen jetzt in einer Leiste. Die Schrift ist runder und gut zu lesen.'},
  // Frühere Chronik (6. Oktober bis 7. November 2026)
  {id: 'lebenswege', datum: '2026-11-07', symbol: 'stern', titel: '18 spannende Lebenswege', text: 'Lerne Menschen aus Sternkunde, Kunst und Büchern kennen. Du siehst, wie sie Beobachtungen geprüft haben.'},
  {id: 'weltkarte-merkt-ort', datum: '2026-11-04', symbol: 'globus', titel: 'Die Weltkarte merkt sich deinen Ort', text: 'Auf der einfachen Weltkarte bleibt dein Ort gewählt, auch wenn du zurückkommst.'},
  {id: 'landschaften', datum: '2026-11-03', symbol: 'globus', titel: '34 neue Landschafts-Erklärungen', text: 'Neue Erklärungen zu Landschaften, mit Modellen und Denkaufgaben. Von dort geht es weiter zur Weltkugel.'},
  {id: 'buch-lebewesen', datum: '2026-11-02', symbol: 'buch', titel: 'Neue Wörter im Wissensbuch', text: 'Das Buch erklärt jetzt auch Evolution, winzige Lebewesen und Dürre. Dazu kommen neue Warum-Fragen.'},
  {id: 'weltall-woerter', datum: '2026-11-01', symbol: 'stern', titel: 'Kometen, Galaxien und Lichtjahre', text: 'Neue Wörter erklären Asteroiden, Kometen und ferne Planeten. Zum Ausprobieren gibt es eigene Modelle.'},
  {id: 'bits-messwerte', datum: '2026-11-01', symbol: 'lupe', titel: 'Bits, Messwerte und Mittelwerte', text: 'Neue Wörter erklären Bits und Prüfsummen. Du lernst auch, Messwerte und Mittelwerte zu vergleichen.'},
  {id: 'zellen-gene', datum: '2026-10-31', symbol: 'lupe', titel: 'Zellen, DNA und Gene', text: 'Neue Wörter und Zeichnungen zeigen, wie eine Zelle aufgebaut ist. Du siehst, was Gene und DNA tun.'},
  {id: 'kraft-bewegung', datum: '2026-10-31', symbol: 'kompass', titel: 'Kraft und Bewegung vergleichen', text: 'Was ist Trägheit, was Beschleunigung? Zeichnungen zum Verändern zeigen Reibung und Hebel.'},
  {id: 'lesestelle-bleibt', datum: '2026-10-31', symbol: 'kompass', titel: 'Du findest leichter zurück', text: 'Gehst du zurück, landest du wieder an deiner Stelle. Das klappt auch mit großer Schrift.'},
  {id: 'hinweise-mit-zeit', datum: '2026-10-30', symbol: 'lupe', titel: 'Hinweise lassen dir Zeit', text: 'Ein Hinweis hilft beim Nachdenken, die Lösung kommt später. Hilfe und Pass bringen dich an deinen Knopf zurück.'},
  {id: 'atome-schiffe', datum: '2026-10-29', symbol: 'lupe', titel: 'Atome und schwimmende Schiffe', text: 'Neue Wörter erklären Atom, Proton und Elektron. Zeichnungen zeigen, warum ein Schiff schwimmt.'},
  {id: 'licht-waerme-einheiten', datum: '2026-10-28', symbol: 'buch', titel: 'Licht, Wärme und Maßeinheiten', text: 'Das Wissensbuch erklärt Lichtwellen, Wärme und Einheiten wie Meter und Kilogramm. Dazu gibt es Warum-Fragen.'},
  {id: 'planetenreise-tag-jahr', datum: '2026-10-28', symbol: 'stern', titel: 'Tag und Jahr auf der Planetenreise', text: 'Die Planetenreise erklärt Licht, Tag und Jahr genauer. Vier Zeichnungen zeigen die Unterschiede.'},
  {id: 'gemeinsame-form', datum: '2026-10-28', symbol: 'kompass', titel: 'Alles sieht zusammen aus', text: 'Lesen, Forschen und Spielen haben jetzt eine gemeinsame Form. Kurze Einstiege helfen dir beim Anfangen.'},
  {id: 'startseite-fragen', datum: '2026-10-27', symbol: 'kompass', titel: 'Fragen mit Fotos auf der Startseite', text: 'Die Startseite zeigt Fragen mit passenden Fotos. Von dort geht es direkt zur Suche und zur Weltkugel.'},
  {id: 'spielvorschau', datum: '2026-10-27', symbol: 'kompass', titel: 'Spiele mit Vorschau-Bild', text: 'Kleine Bilder zeigen, wie ein Spiel aussieht. Nach einer Antwort erfährst du, was gepasst hat.'},
  {id: 'planeten-massstab', datum: '2026-10-27', symbol: 'stern', titel: 'Planeten im gleichen Maßstab', text: 'Beide Planetenmodelle nutzen jetzt dieselben Abstände. Du kannst nachsehen, woher die Zahlen kommen.'},
  {id: 'gesteine-genauer', datum: '2026-10-26', symbol: 'lupe', titel: 'Steine und Wasser genauer erklärt', text: 'Neun Erklärungen zu Gesteinen, Grundwasser, Vulkanen und Polargebieten sind genauer. Die Quellen sind direkt verlinkt.'},
  {id: 'merian-lehmann', datum: '2026-10-26', symbol: 'stern', titel: 'Maria Sibylla Merian und Inge Lehmann', text: 'Zwei Forscherinnen zeigen, wie man aus genauem Hinsehen eine Erklärung baut.'},
  {id: 'neues-aussehen', datum: '2026-10-26', symbol: 'kompass', titel: 'Ein neues Aussehen', text: 'Startseite, Wissenswelten und dein Entdeckerpass passen jetzt besser zusammen.'},
  {id: 'fundstueck-bronze', datum: '2026-10-25', symbol: 'lupe', titel: 'Was verrät ein Fundstück?', text: 'Mit ausgedachten Fundkarten lernst du, Material und Alter zu unterscheiden. Ein neuer Artikel erzählt von Bronze.'},
  {id: 'okapi-bruecken', datum: '2026-10-25', symbol: 'buch', titel: 'Okapi, Brücken und 3D-Druck', text: 'Neue KI-Bilder zeigen das Okapi, gut gekennzeichnet. Zeichnungen erklären Brücken und 3D-Druck.'},
  {id: 'wissenschaft-karten', datum: '2026-10-24', symbol: 'lupe', titel: '23 neue Wissenschafts-Karten', text: 'Von Druck und Schwingungen bis zu Zellen und fernen Planeten. Eigene Modelle helfen beim Vergleichen.'},
  {id: 'acht-bauwerke', datum: '2026-10-24', symbol: 'globus', titel: 'Acht berühmte Bauwerke', text: 'Entdecke Angkor Wat, die Oper von Sydney und sechs weitere Bauwerke. Skizzen zeigen, wie sie funktionieren.'},
  {id: 'neun-erfindungen', datum: '2026-10-23', symbol: 'kompass', titel: 'Neun Erfindungen untersuchen', text: 'Fahrrad, Kühlschrank, Batterie und mehr. Modelle zeigen, wie sie funktionieren.'},
  {id: 'reisen-genauer', datum: '2026-10-23', symbol: 'globus', titel: '30 Reise-Kapitel genauer erklärt', text: 'Berge, Flüsse, Klima, Vulkane und Mond werden genauer erklärt. Neue Schaubilder helfen beim Vergleichen.'},
  {id: 'reisen-ueberarbeitet', datum: '2026-10-21', symbol: 'globus', titel: '50 Reise-Kapitel überarbeitet', text: 'Erde, Länder, Lebensräume, Meere und Wetter sind jetzt verständlicher. Schaubilder laden zum Vergleichen ein.'},
  {id: 'anning-haytham', datum: '2026-10-21', symbol: 'stern', titel: 'Mary Anning und Ibn al-Haytham', text: 'Zwei neue Karten erzählen ihre Geschichte. Du prüfst selbst, was ein Beleg zeigen kann.'},
  {id: 'kamera-fernrohr', datum: '2026-10-21', symbol: 'kompass', titel: 'Kamera, Fernrohr und Mikroskop', text: 'Drei Karten zeigen, wie Licht beim Fotografieren und Vergrößern hilft. Modelle laden zum Ausprobieren ein.'},
  {id: 'tierspiele-klarer', datum: '2026-10-21', symbol: 'lupe', titel: 'Tierspiele sind klarer', text: 'Im Tierdetektiv helfen passende Beobachtungen. Begonnene Runden bleiben auch nach dem Neuladen erhalten.'},
  {id: 'laenderangaben', datum: '2026-10-21', symbol: 'globus', titel: 'Länderangaben neu geprüft', text: 'Kanadas Fläche und die Hauptstädte von Benin und Burundi stimmen jetzt mit neuen Quellen.'},
  {id: 'tiere-24', datum: '2026-10-20', symbol: 'globus', titel: '24 neue Tiere', text: 'Vom Schnabeltier bis zur Sepia: 24 neue Tiere warten auf dich. Zeichnungen zeigen ihre Besonderheiten.'},
  {id: 'khipu-stadtplan', datum: '2026-10-20', symbol: 'lupe', titel: 'Knotenschnüre und alte Stadtpläne', text: 'Zähle mit Khipu-Knotenschnüren. An einem ausgedachten Stadtplan von Mohenjo-Daro prüfst du Vermutungen.'},
  {id: 'erdplatten', datum: '2026-10-20', symbol: 'globus', titel: 'Erdplatten besser verstehen', text: 'Neue Bilder zeigen, wie sich Erdplatten bewegen. Drei Denkaufgaben helfen gegen typische Verwechslungen.'},
  {id: 'labor-irrtum', datum: '2026-10-18', symbol: 'lupe', titel: 'Aus Fehlern lernen im Labor', text: 'Alle elf Labore erklären jetzt, warum eine Antwort nicht passt. So kannst du weiterforschen.'},
  {id: 'tierkarten-forschen', datum: '2026-10-17', symbol: 'globus', titel: 'Tierkarten zum Forschen', text: 'Auf den Tierkarten deckst du Belege auf und erklärst Zusammenhänge. Planetenzahlen sind auf dem Handy gut lesbar.'},
  {id: 'reisen-hinweise', datum: '2026-10-17', symbol: 'buch', titel: 'Bessere Hinweise in den Reisen', text: 'Die Lernreisen haben passendere Denkhinweise. Quellen und Bildbeschriftungen sind auch auf dem Handy gut lesbar.'},
  {id: 'offline-zaehler', datum: '2026-10-16', symbol: 'kompass', titel: 'Für unterwegs vorbereiten', text: 'Ein Zähler zeigt, wie weit die Seite für unterwegs vorbereitet ist. Die Neuigkeiten wurden übersichtlicher.'},
  {id: 'lernreisen-weiterdenken', datum: '2026-10-13', symbol: 'globus', titel: 'Lernreisen zum Weiterdenken', text: 'Jede Reise hat Ziele und Denkaufgaben. Auf einem Merkzettel hältst du fest, was du dir überlegt hast.'},
  {id: 'labore-vermuten', datum: '2026-10-12', symbol: 'lupe', titel: 'Vermuten, vergleichen, forschen', text: 'Schreib eine Vermutung auf und vergleiche zwei Beobachtungen. Alle elf Labore haben eigene Forschungsaufgaben.'},
  {id: 'spiele-31', datum: '2026-10-11', symbol: 'kompass', titel: '31 Spielideen', text: 'Finde unter 31 Spielen eins, das zu dir passt. Du siehst auch, wo du weiterspielen kannst.'},
  {id: 'guter-anfang', datum: '2026-10-11', symbol: 'kompass', titel: 'Ein guter Anfang', text: 'Die Startseite zeigt dir einen klaren ersten Schritt. Alle sechs Bereiche sind direkt erreichbar.'},
  {id: 'pass-aufgeraeumt', datum: '2026-10-10', symbol: 'kompass', titel: 'Dein Pass ist aufgeräumt', text: 'Entdeckungen, Sicherungen und Einstellungen haben eigene Abschnitte. Auf dem Handy siehst du das Wichtigste zuerst.'},
  {id: 'mond-meer', datum: '2026-10-10', symbol: 'globus', titel: 'Mond und Meer erforschen', text: 'Warum ändert der Mond seine Form? Zeichnungen und ein Küstenvergleich zeigen, warum das Wasser an der Küste steigt.'},
  {id: 'startseite-ueberblick', datum: '2026-10-09', symbol: 'kompass', titel: 'Die ganze Wissenswelt auf einen Blick', text: 'Wähle auf der Startseite eine Welt, suche eine Frage oder folge einer Wissensspur.'},
  {id: 'tipp-statt-loesung', datum: '2026-10-09', symbol: 'lupe', titel: 'Ein Tipp statt der Lösung', text: 'Ein Hinweis hilft beim Überlegen, ohne die Lösung zu verraten. Erst nach der richtigen Antwort kommt die ganze Erklärung.'},
  {id: 'pflanzen-wasser-mond', datum: '2026-10-09', symbol: 'globus', titel: 'Pflanzen, Wasser und der Mond', text: 'Acht neue Wissenskarten verbinden diese Themen. Die Challenge hat drei Stufen zum Aussuchen.'},
  {id: 'walhai-timbuktu', datum: '2026-10-09', symbol: 'stern', titel: 'Vom Walhai bis Timbuktu', text: '18 neue Karten, jetzt sind es 108. Neue Zeichnungen zeigen, wie Dinge funktionieren.'},
  {id: 'testseite', datum: '2026-10-09', symbol: 'kompass', titel: 'Eine Seite zum Ausprobieren', text: 'Neues wird jetzt erst auf einer Testseite ausprobiert. Die Suche findet Tierkarten leichter.'},
  {id: 'suchen-zuhoeren', datum: '2026-10-09', symbol: 'buch', titel: 'Suchen und Zuhören', text: 'Du findest Spiele und Begriffe über die Suche. Die Vorlesestimme kannst du dir aussuchen.'},
  {id: 'weiterspielen', datum: '2026-10-08', symbol: 'kompass', titel: 'Weiterspielen, wo du warst', text: 'Eine angefangene Spielrunde geht mit denselben Fragen weiter.'},
  {id: 'reise-fotos', datum: '2026-10-08', symbol: 'globus', titel: 'Fotos zum Reisebeginn', text: 'Passende Fotos begrüßen dich am Anfang einiger Lernreisen. Woher sie kommen, steht in den Bildnachweisen.'},
  {id: 'sechs-welten', datum: '2026-10-07', symbol: 'globus', titel: 'Sechs Wissenswelten', text: 'Von Tieren bis zu Erfindungen: sechs Welten mit den ersten 90 Karten. Auf Wissensrouten gehst du von Karte zu Karte.'},
  {id: 'neptun', datum: '2026-10-07', symbol: 'stern', titel: 'Wie weit ist es bis zum Neptun?', text: 'Vergleiche, wie weit die acht Planeten von der Sonne entfernt sind. Ein Zeitregler hilft beim Erkunden.'},
  {id: 'labore-was-wenn', datum: '2026-10-07', symbol: 'lupe', titel: 'Was passiert, wenn …?', text: 'Neue Labore, Länderporträts und Naturspiele sind da. Probier etwas aus und prüfe deine Vermutung.'},
  {id: 'suche-sicherung', datum: '2026-10-07', symbol: 'kompass', titel: 'Suche, Sicherung und große Schrift', text: 'Sichere deinen Pass als Datei. Große Schrift und weniger Bewegung machen das Lesen leichter.'},
  {id: 'lernreisen-buch', datum: '2026-10-06', symbol: 'buch', titel: 'Lernreisen und Wissensbuch', text: 'Folge einem Thema Kapitel für Kapitel. Dazu gibt es Länder-Memory und das Wissensbuch.'},
  {id: 'weltkugel', datum: '2026-10-06', symbol: 'globus', titel: 'Eine Weltkugel voller Fragen', text: 'Dreh die Erde, schau in ihr Inneres und beobachte Tag und Nacht. Es gibt auch ein Quiz und Vorlesen.'},
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
