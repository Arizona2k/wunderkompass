// Exact compatibility alias for one reviewed grammatical correction.
// The correct answer and its position are deliberately outside this mapping.
export const RETAINED_ANSWER_WORDING=Object.freeze({topic:'animal-white-tailed-eagle',index:2,before:'Die Länge eines einzelnen Schwanzfeder.',after:'Die Länge einer einzelnen Schwanzfeder.'});
/** @param {string} topic @param {string} value @returns {string} */
export function restoreAnswerWording(topic,value){return topic===RETAINED_ANSWER_WORDING.topic&&value===RETAINED_ANSWER_WORDING.before?RETAINED_ANSWER_WORDING.after:value;}
export function isRetainedAnswerWordingCorrection(c){
 const a=RETAINED_ANSWER_WORDING,before=c.before?.answers,after=c.after?.answers;
 return c.topic===a.topic&&Array.isArray(before)&&Array.isArray(after)&&before.length===3&&after.length===before.length&&c.before.correct===c.after.correct&&c.before.correct!==a.index&&before[a.index]===a.before&&after[a.index]===a.after&&before.every((value,index)=>index===a.index||value===after[index]);
}

// Exact prior challenge choice sets (several per question are allowed); no incorrect answer is renamed into a different answer.
// Existing orders identify the known variant without adding a save field or learning store.
const retainedChallengeChoices=[
  {
    "id": "science-water-cycle-1",
    "topic": "science-water-cycle",
    "difficulty": "medium",
    "prompt": "Warum verschwinden Pfützen auch ohne Abfluss?",
    "correct": 0,
    "why": "Flüssiges Wasser kann als Wasserdampf in die Luft gelangen.",
    "beforeAnswers": [
      "Wasser verdunstet",
      "Wasser wird zu Stein",
      "Wasser verliert seine Masse"
    ],
    "currentAnswers": [
      "Wasser verdunstet",
      "Das Wasser kondensiert",
      "Die Sonne vernichtet das Wasser"
    ],
    "beforeWrongReasons": null
  },
  {
    "id": "science-water-cycle-2",
    "topic": "science-water-cycle",
    "difficulty": "medium",
    "prompt": "Was heißt Kondensation?",
    "correct": 0,
    "why": "Beim Kondensieren entstehen aus Wasserdampf Tröpfchen.",
    "beforeAnswers": [
      "Gasförmiges Wasser wird flüssig",
      "Wasser fließt bergab",
      "Eis wird zu Dampf"
    ],
    "currentAnswers": [
      "Gasförmiges Wasser wird flüssig",
      "Flüssiges Wasser wird gasförmig",
      "Eis wird flüssig",
      "Flüssiges Wasser wird zu Eis"
    ],
    "beforeWrongReasons": null
  },
  {
    "id": "science-water-cycle-3",
    "topic": "science-water-cycle",
    "difficulty": "hard",
    "prompt": "Eine Stadt versiegelt viele Böden. Was wird unmittelbar erschwert?",
    "correct": 0,
    "why": "Undurchlässige Oberflächen erschweren den Weg in den Boden; mehr Wasser kann oberflächlich abfließen.",
    "beforeAnswers": [
      "Das Versickern von Regenwasser",
      "Die Erdrotation",
      "Die Anziehung des Mondes"
    ],
    "currentAnswers": [
      "Das Versickern von Regenwasser",
      "Das oberflächliche Abfließen von Regenwasser",
      "Die Verdunstung aus offenen Gewässern",
      "Das Bilden von Pfützen"
    ],
    "beforeWrongReasons": null
  },
  {
    "id": "science-water-cycle-4",
    "topic": "science-water-cycle",
    "difficulty": "hard",
    "prompt": "Warum gibt es keine feste Rundreisezeit für jeden Tropfen?",
    "correct": 0,
    "why": "Eis, Grundwasser und Atmosphäre speichern Wasser unterschiedlich lange.",
    "beforeAnswers": [
      "Wasser bleibt verschieden lange in Speichern",
      "Jeder Tropfen hat dieselbe Geschwindigkeit",
      "Der Kreislauf stoppt nachts überall"
    ],
    "currentAnswers": [
      "Wasser bleibt verschieden lange in Speichern",
      "Jeder Tropfen durchläuft immer dieselben vier Stationen",
      "Die Zahl der Modellstationen legt die Reisedauer fest",
      "Manche Tropfen gehen unterwegs verloren"
    ],
    "beforeWrongReasons": null
  },
  {
    "id": "science-photosynthesis:mini",
    "topic": "science-photosynthesis",
    "difficulty": "easy",
    "prompt": "Welche Energie nutzt die Fotosynthese?",
    "correct": 0,
    "why": "Licht liefert Energie für den Aufbau energiereicher Stoffe.",
    "beforeAnswers": [
      "Lichtenergie",
      "Schallenergie",
      "Nur Erdwärme"
    ],
    "currentAnswers": [
      "Lichtenergie",
      "Energie aus dem Abbau von Zucker",
      "Chemische Energie aus Mineralstoffen"
    ],
    "beforeWrongReasons": null
  },
  {
    "id": "science-photosynthesis-1",
    "topic": "science-photosynthesis",
    "difficulty": "medium",
    "prompt": "Welche Stoffe braucht die Pflanze dafür?",
    "correct": 0,
    "why": "Wasser und Kohlendioxid liefern die Ausgangsstoffe; Licht liefert Energie.",
    "beforeAnswers": [
      "Wasser und Kohlendioxid",
      "Nur Erde und Salz",
      "Nur Sauerstoff"
    ],
    "currentAnswers": [
      "Wasser und Kohlendioxid",
      "Wasser und Sauerstoff",
      "Kohlendioxid und Mineralstoffe, ohne Wasser"
    ],
    "beforeWrongReasons": null
  },
  {
    "id": "science-photosynthesis-2",
    "topic": "science-photosynthesis",
    "difficulty": "medium",
    "prompt": "Was wird bei der Fotosynthese frei?",
    "correct": 0,
    "why": "Bei der Fotosynthese von Pflanzen entsteht Sauerstoff.",
    "beforeAnswers": [
      "Sauerstoff",
      "Eisen",
      "Plastik"
    ],
    "currentAnswers": [
      "Sauerstoff",
      "Kohlendioxid",
      "Nur Wasserdampf",
      "Stickstoff"
    ],
    "beforeWrongReasons": null
  },
  {
    "id": "science-photosynthesis-3",
    "topic": "science-photosynthesis",
    "difficulty": "hard",
    "prompt": "Warum kann ein Löwe indirekt von Fotosynthese abhängen?",
    "correct": 0,
    "why": "Energie gelangt über Pflanzenfresser zu Fleischfressern.",
    "beforeAnswers": [
      "Seine Beute frisst Pflanzen mit gespeicherter Energie",
      "Er betreibt Fotosynthese im Fell",
      "Sonnenlicht ersetzt seine Nahrung"
    ],
    "currentAnswers": [
      "Seine Beute frisst Pflanzen mit gespeicherter Energie",
      "Der Löwe nutzt Licht direkt zum Aufbau seiner Nahrung",
      "Die Sonnenwärme ersetzt die Energie aus seiner Nahrung",
      "Er schläft gern im warmen Sonnenlicht"
    ],
    "beforeWrongReasons": null
  },
  {
    "id": "science-photosynthesis-4",
    "topic": "science-photosynthesis",
    "difficulty": "hard",
    "prompt": "Welche Aussage über Pflanzen ist richtig?",
    "correct": 0,
    "why": "Pflanzen nutzen Zellatmung, um Energie aus energiereichen Stoffen verfügbar zu machen.",
    "beforeAnswers": [
      "Sie betreiben auch Zellatmung",
      "Sie brauchen niemals Sauerstoff",
      "Sie stellen Zucker aus Schall her"
    ],
    "currentAnswers": [
      "Sie betreiben auch Zellatmung",
      "Ihre Zellatmung findet nur ohne Licht statt",
      "Fotosynthese und Zellatmung sind derselbe Vorgang",
      "Sie atmen überhaupt nicht"
    ],
    "beforeWrongReasons": null
  },
  {
    "id": "science-water-cycle-2",
    "topic": "science-water-cycle",
    "difficulty": "medium",
    "prompt": "Was heißt Kondensation?",
    "correct": 0,
    "why": "Beim Kondensieren entstehen aus Wasserdampf Tröpfchen.",
    "beforeAnswers": [
      "Gasförmiges Wasser wird flüssig",
      "Flüssiges Wasser wird gasförmig",
      "Eis wird flüssig"
    ],
    "currentAnswers": [
      "Gasförmiges Wasser wird flüssig",
      "Flüssiges Wasser wird gasförmig",
      "Eis wird flüssig",
      "Flüssiges Wasser wird zu Eis"
    ],
    "beforeWrongReasons": [
      null,
      "Der Übergang von flüssigem zu gasförmigem Wasser heißt Verdunstung. Kondensation verläuft in die andere Richtung.",
      "Wenn Eis flüssig wird, schmilzt es. Bei Kondensation wird dagegen aus gasförmigem Wasser flüssiges Wasser."
    ]
  },
  {
    "id": "science-water-cycle-3",
    "topic": "science-water-cycle",
    "difficulty": "hard",
    "prompt": "Eine Stadt versiegelt viele Böden. Was wird unmittelbar erschwert?",
    "correct": 0,
    "why": "Undurchlässige Oberflächen erschweren den Weg in den Boden; mehr Wasser kann oberflächlich abfließen.",
    "beforeAnswers": [
      "Das Versickern von Regenwasser",
      "Das oberflächliche Abfließen von Regenwasser",
      "Die Verdunstung aus offenen Gewässern"
    ],
    "currentAnswers": [
      "Das Versickern von Regenwasser",
      "Das oberflächliche Abfließen von Regenwasser",
      "Die Verdunstung aus offenen Gewässern",
      "Das Bilden von Pfützen"
    ],
    "beforeWrongReasons": [
      null,
      "Wasser kann über undurchlässige Oberflächen abfließen. Erschwert wird hier zunächst der Eintritt in den Boden.",
      "Offene Gewässer können weiterhin Wasser an die Luft abgeben. Die Frage betrifft zunächst den Weg des Regenwassers durch die versiegelte Fläche in den Boden."
    ]
  },
  {
    "id": "science-water-cycle-4",
    "topic": "science-water-cycle",
    "difficulty": "hard",
    "prompt": "Warum gibt es keine feste Rundreisezeit für jeden Tropfen?",
    "correct": 0,
    "why": "Eis, Grundwasser und Atmosphäre speichern Wasser unterschiedlich lange.",
    "beforeAnswers": [
      "Wasser bleibt verschieden lange in Speichern",
      "Jeder Tropfen durchläuft immer dieselben vier Stationen",
      "Die Zahl der Modellstationen legt die Reisedauer fest"
    ],
    "currentAnswers": [
      "Wasser bleibt verschieden lange in Speichern",
      "Jeder Tropfen durchläuft immer dieselben vier Stationen",
      "Die Zahl der Modellstationen legt die Reisedauer fest",
      "Manche Tropfen gehen unterwegs verloren"
    ],
    "beforeWrongReasons": [
      null,
      "Das Schema zeigt nur einen möglichen Weg. Wirkliche Wasserwege können sich verzweigen und andere Speicher einschließen.",
      "Die vier Stationen sind Erklärschritte, keine Zeiteinheiten. Das Modell enthält weder Aufenthaltszeiten noch eine berechnete Reisedauer."
    ]
  },
  {
    "id": "science-photosynthesis-2",
    "topic": "science-photosynthesis",
    "difficulty": "medium",
    "prompt": "Was wird bei der Fotosynthese frei?",
    "correct": 0,
    "why": "Bei der Fotosynthese von Pflanzen entsteht Sauerstoff.",
    "beforeAnswers": [
      "Sauerstoff",
      "Kohlendioxid",
      "Nur Wasserdampf"
    ],
    "currentAnswers": [
      "Sauerstoff",
      "Kohlendioxid",
      "Nur Wasserdampf",
      "Stickstoff"
    ],
    "beforeWrongReasons": [
      null,
      "Hier hast du ein Gas gewählt, das die Pflanze für den Zuckeraufbau nutzt. Die Frage sucht ein bei der Fotosynthese entstehendes Gas.",
      "Wasserdampf kann bei der Transpiration austreten. Das ist ein anderer Vorgang; Fotosynthese grüner Pflanzen erzeugt außerdem Sauerstoff."
    ]
  },
  {
    "id": "science-photosynthesis-3",
    "topic": "science-photosynthesis",
    "difficulty": "hard",
    "prompt": "Warum kann ein Löwe indirekt von Fotosynthese abhängen?",
    "correct": 0,
    "why": "Energie gelangt über Pflanzenfresser zu Fleischfressern.",
    "beforeAnswers": [
      "Seine Beute frisst Pflanzen mit gespeicherter Energie",
      "Der Löwe nutzt Licht direkt zum Aufbau seiner Nahrung",
      "Die Sonnenwärme ersetzt die Energie aus seiner Nahrung"
    ],
    "currentAnswers": [
      "Seine Beute frisst Pflanzen mit gespeicherter Energie",
      "Der Löwe nutzt Licht direkt zum Aufbau seiner Nahrung",
      "Die Sonnenwärme ersetzt die Energie aus seiner Nahrung",
      "Er schläft gern im warmen Sonnenlicht"
    ],
    "beforeWrongReasons": [
      null,
      "Ein Löwe betreibt keine Fotosynthese. Er erhält chemisch gespeicherte Energie über seine Nahrung.",
      "Sonnenwärme kann einen Körper erwärmen. Sie ersetzt beim Löwen jedoch nicht die chemische Energie aus Nahrung."
    ]
  },
  {
    "id": "science-photosynthesis-4",
    "topic": "science-photosynthesis",
    "difficulty": "hard",
    "prompt": "Welche Aussage über Pflanzen ist richtig?",
    "correct": 0,
    "why": "Pflanzen nutzen Zellatmung, um Energie aus energiereichen Stoffen verfügbar zu machen.",
    "beforeAnswers": [
      "Sie betreiben auch Zellatmung",
      "Ihre Zellatmung findet nur ohne Licht statt",
      "Fotosynthese und Zellatmung sind derselbe Vorgang"
    ],
    "currentAnswers": [
      "Sie betreiben auch Zellatmung",
      "Ihre Zellatmung findet nur ohne Licht statt",
      "Fotosynthese und Zellatmung sind derselbe Vorgang",
      "Sie atmen überhaupt nicht"
    ],
    "beforeWrongReasons": [
      null,
      "Zellatmung braucht nicht erst Dunkelheit. Lebende Pflanzenzellen können gespeicherte Energie auch tagsüber verfügbar machen.",
      "Beim Zuckeraufbau wird Lichtenergie genutzt; bei der Zellatmung wird gespeicherte chemische Energie verfügbar. Das sind verschiedene Reaktionsfolgen."
    ]
  },
  {
    "id": "science-pollination-3",
    "topic": "science-pollination",
    "difficulty": "hard",
    "prompt": "Eine Biene besucht eine Blüte. Warum gibt es trotzdem nicht immer Samen?",
    "correct": 0,
    "why": "Der Pollen muss auf die Narbe einer passenden Blüte gelangen. Danach muss noch die Befruchtung klappen. Erst dann entstehen Samen. Auch viele andere Insekten bestäuben.",
    "beforeAnswers": [
      "Passende Pollenübertragung und weitere Schritte müssen gelingen",
      "Jeder Besuch erzeugt sofort eine Frucht",
      "Pollen sind fertige Samen"
    ],
    "currentAnswers": [
      "Pollen muss auf eine passende Narbe kommen",
      "Die Biene hat den Nektar mitgenommen",
      "Pollen sind fertige Samen",
      "Nur Honigbienen können eine Blüte bestäuben"
    ],
    "beforeWrongReasons": null,
    "beforePrompt": "Warum beweist ein Blütenbesuch noch keinen Samenerfolg?",
    "beforeWhy": "Bestäubung und anschließende Befruchtung sind getrennte Vorgänge.",
    "beforeCorrect": 0
  },
  {
    "id": "science-pollination-4",
    "topic": "science-pollination",
    "difficulty": "hard",
    "prompt": "Pollen einer Tulpe landet auf der Narbe einer Rose. Was passiert?",
    "correct": 0,
    "why": "Tulpe und Rose sind ganz verschiedene Pflanzen. Der Tulpenpollen passt nicht zur Rose. Aus ihm entstehen keine Samen und auch keine Mischpflanze.",
    "beforeAnswers": [
      "Erfolgreiche Fortpflanzung ist damit nicht gesichert",
      "Es entstehen sicher Samen",
      "Alle Arten können beliebig gekreuzt werden"
    ],
    "currentAnswers": [
      "Davon entstehen keine Samen",
      "Es entstehen sicher Samen",
      "Die Rose bildet Tulpensamen",
      "Es wächst eine Mischung aus Tulpe und Rose"
    ],
    "beforeWrongReasons": null,
    "beforePrompt": "Eine Blüte bekommt unpassenden Pollen. Was folgt daraus?",
    "beforeWhy": "Für erfolgreiche Fortpflanzung muss Pollen zur Pflanze passen; ein Transport allein genügt nicht.",
    "beforeCorrect": 0
  },
  {
    "id": "science-fungi-2",
    "topic": "science-fungi",
    "difficulty": "medium",
    "prompt": "Manche Pilze leben mit Baumwurzeln zusammen. Was bekommt der Pilz vom Baum?",
    "correct": 0,
    "why": "Der Baum macht mit Sonnenlicht Zucker und gibt dem Pilz etwas ab. Der Pilz bringt ihm dafür Wasser und Mineralstoffe.",
    "beforeAnswers": [
      "Zucker",
      "Pollen als einziges Futter",
      "Fertige Pilzhüte"
    ],
    "currentAnswers": [
      "Zucker",
      "Pollen als einziges Futter",
      "Mineralstoffe",
      "Wasser"
    ],
    "beforeWrongReasons": null,
    "beforePrompt": "Was bekommt ein Mykorrhizapilz von seiner Pflanzenpartnerin?",
    "beforeWhy": "Die Pflanze liefert energiereiche Stoffe aus der Fotosynthese.",
    "beforeCorrect": 0
  },
  {
    "id": "science-fungi-3",
    "topic": "science-fungi",
    "difficulty": "hard",
    "prompt": "Stell dir einen Wald ganz ohne Pilze und andere Zersetzer vor. Was würde passieren?",
    "correct": 0,
    "why": "Zersetzer machen aus totem Laub und Holz wieder Stoffe, die Pflanzen brauchen. Ohne sie bliebe das Laub liegen, und dem Boden fehlten Nährstoffe.",
    "beforeAnswers": [
      "Sie machen Stoffe aus totem Material wieder zugänglich",
      "Sie vernichten alle Stoffe endgültig",
      "Sie ersetzen alle Pflanzen"
    ],
    "currentAnswers": [
      "Totes Laub würde sich hoch stapeln",
      "Bäume bekämen mehr Nährstoffe",
      "Totes Laub würde schneller zu Erde",
      "Bäume würden schneller wachsen"
    ],
    "beforeWrongReasons": null,
    "beforePrompt": "Warum sind Pilze im Nahrungsnetz wichtig?",
    "beforeWhy": "Zersetzung trägt zum Stoffkreislauf bei.",
    "beforeCorrect": 0
  },
  {
    "id": "science-fungi-4",
    "topic": "science-fungi",
    "difficulty": "hard",
    "prompt": "Pilzfäden verbinden manche Baumwurzeln. Welcher Satz ist vorsichtig und richtig?",
    "correct": 0,
    "why": "Eine Verbindung allein belegt noch keinen bestimmten Austausch oder menschliche Kommunikation.",
    "beforeAnswers": [
      "Übertragungen müssen untersucht werden",
      "Bäume sprechen nachweislich wie Menschen",
      "Alle Pilze teilen immer alles"
    ],
    "currentAnswers": [
      "Übertragungen müssen untersucht werden",
      "Bäume sprechen nachweislich wie Menschen",
      "Alle Pilze teilen immer alles",
      "Pilze verbinden niemals Bäume"
    ],
    "beforeWrongReasons": null,
    "beforePrompt": "Was ist eine vorsichtige Aussage über Pilznetzwerke?",
    "beforeWhy": "Eine Verbindung allein belegt noch keinen bestimmten Austausch oder menschliche Kommunikation.",
    "beforeCorrect": 0
  },
  {
    "id": "science-coral-reef-1",
    "topic": "science-coral-reef",
    "difficulty": "medium",
    "prompt": "Was liefern die Algenpartner vieler Riffkorallen?",
    "correct": 0,
    "why": "Die Algen nutzen Licht und versorgen die Koralle mit energiereichen Stoffen.",
    "beforeAnswers": [
      "Energiereiche Stoffe aus Fotosynthese",
      "Elektrischen Strom",
      "Fertige Fische"
    ],
    "currentAnswers": [
      "Energiereiche Stoffe aus Fotosynthese",
      "Schutz vor Fischen, die Korallen fressen",
      "Kleine Krebse als Futter",
      "Kühles Wasser bei Hitze"
    ],
    "beforeWrongReasons": null
  },
  {
    "id": "science-coral-reef-2",
    "topic": "science-coral-reef",
    "difficulty": "medium",
    "prompt": "Das Meer wird sehr warm. Was kann mit Korallen passieren?",
    "correct": 0,
    "why": "Ohne ihre Algen wird die Koralle blass, fast weiß. Das nennt man Korallenbleiche.",
    "beforeAnswers": [
      "Korallen verlieren ihre Algenpartner",
      "Korallen werden automatisch Pflanzen",
      "Das Meer wird überall zu Eis"
    ],
    "currentAnswers": [
      "Korallen verlieren ihre Algenpartner",
      "Korallen bekommen noch mehr Algenpartner",
      "Korallen färben sich dunkler",
      "Korallen wachsen schneller"
    ],
    "beforeWrongReasons": null,
    "beforePrompt": "Was kann bei starkem Wärmestress passieren?",
    "beforeWhy": "Der Verlust der Algenpartner kann zur Bleiche führen.",
    "beforeCorrect": 0
  },
  {
    "id": "science-coral-reef-4",
    "topic": "science-coral-reef",
    "difficulty": "hard",
    "prompt": "Warum brauchen viele Riffkorallen klares Wasser?",
    "correct": 0,
    "why": "Die Algen in der Koralle brauchen Licht, wie Pflanzen. In trübes Wasser kommt zu wenig Licht.",
    "beforeAnswers": [
      "Licht kann ihre Algenpartner erreichen",
      "Korallen können nur in Luft atmen",
      "Klarheit entfernt jede Wärme"
    ],
    "currentAnswers": [
      "Licht kann ihre Algenpartner erreichen",
      "Korallen können ihre Beute besser sehen",
      "In klarem Wasser ist es kühler",
      "In klarem Wasser gibt es keine Feinde"
    ],
    "beforeWrongReasons": null,
    "beforePrompt": "Weshalb hilft klares Wasser vielen tropischen Riffkorallen?",
    "beforeWhy": "Fotosynthetische Algenpartner sind auf Licht angewiesen; das gilt nicht für alle Korallenarten.",
    "beforeCorrect": 0
  },
  {
    "id": "science-moon-phases-1",
    "topic": "science-moon-phases",
    "difficulty": "medium",
    "prompt": "Was verändert sich bei den Mondphasen?",
    "correct": 0,
    "why": "Die Sonne beleuchtet immer eine Hälfte des Mondes. Je nachdem, wo er steht, sehen wir mehr oder weniger davon.",
    "beforeAnswers": [
      "Unser Blick auf die beleuchtete Hälfte",
      "Die Kugelform des Mondes",
      "Die Größe der Sonne"
    ],
    "currentAnswers": [
      "Unser Blick auf die beleuchtete Hälfte",
      "Die Kugelform des Mondes",
      "Der Schatten der Erde auf dem Mond",
      "Wie hell die Sonne gerade leuchtet"
    ],
    "beforeWrongReasons": null,
    "beforePrompt": "Was verändert sich bei den Mondphasen?",
    "beforeWhy": "Der Mond bleibt ungefähr kugelförmig; wir sehen verschieden viel beleuchtete Fläche.",
    "beforeCorrect": 0
  },
  {
    "id": "science-moon-phases-3",
    "topic": "science-moon-phases",
    "difficulty": "hard",
    "prompt": "Warum gibt es nicht bei jedem Vollmond eine Mondfinsternis?",
    "correct": 0,
    "why": "Die Bahn des Mondes ist etwas schräg. Darum zieht er bei Vollmond meist über oder unter dem Erdschatten vorbei.",
    "beforeAnswers": [
      "Die Mondbahn ist gegen die Erdbahnebene geneigt",
      "Der Mond schaltet sein Licht aus",
      "Die Erde hat keinen Schatten"
    ],
    "currentAnswers": [
      "Die Bahn des Mondes ist etwas schräg",
      "Der Erdschatten ist zu klein für den Mond",
      "Die Erde steht nicht zwischen Sonne und Mond",
      "Der Mond ist bei Vollmond zu weit weg"
    ],
    "beforeWrongReasons": null,
    "beforePrompt": "Warum gibt es nicht jeden Vollmond eine Mondfinsternis?",
    "beforeWhy": "Meist verfehlt der Mond den Erdschatten.",
    "beforeCorrect": 0
  },
  {
    "id": "science-seasons-2",
    "topic": "science-seasons",
    "difficulty": "medium",
    "prompt": "Warum erwärmt hohe Sonne den Boden stärker?",
    "correct": 0,
    "why": "Steht die Sonne hoch, trifft ihr Licht auf eine kleine Fläche und wärmt sie stark.",
    "beforeAnswers": [
      "Licht verteilt sich auf eine kleinere Fläche",
      "Die Sonne besteht dann aus mehr Sternen",
      "Der Boden zieht Licht magnetisch an"
    ],
    "currentAnswers": [
      "Licht verteilt sich auf eine kleinere Fläche",
      "Die Sonne ist dann näher an der Erde",
      "Die Sonne leuchtet dann heller",
      "Licht verteilt sich auf eine größere Fläche"
    ],
    "beforeWrongReasons": null,
    "beforePrompt": "Warum erwärmt hohe Sonne den Boden stärker?",
    "beforeWhy": "Bei höherem Sonnenstand trifft mehr Energie auf dieselbe Bodenfläche.",
    "beforeCorrect": 0
  },
  {
    "id": "science-seasons-4",
    "topic": "science-seasons",
    "difficulty": "hard",
    "prompt": "Ein Modell zeigt Erde, Sonne und die schräge Achse. Was kann es nicht vorhersagen?",
    "correct": 0,
    "why": "Ob es regnet, hängt von Wolken, Wind und Luft ab. Das zeigt das Modell nicht.",
    "beforeAnswers": [
      "Ob es morgen an deinem Ort regnet",
      "Welche Halbkugel zur Sonne geneigt ist",
      "Warum Tageslängen wechseln"
    ],
    "currentAnswers": [
      "Ob es morgen an deinem Ort regnet",
      "Welche Halbkugel zur Sonne geneigt ist",
      "Warum Tageslängen wechseln",
      "Wann bei uns die Tage am längsten sind"
    ],
    "beforeWrongReasons": null,
    "beforePrompt": "Was kann das einfache Achsenmodell nicht vorhersagen?",
    "beforeWhy": "Für Tageswetter braucht man weitere Daten über die Atmosphäre.",
    "beforeCorrect": 0
  },
  {
    "id": "science-tides-2",
    "topic": "science-tides",
    "difficulty": "medium",
    "prompt": "Ist Hochwasser überall gleichzeitig?",
    "correct": 0,
    "why": "Die Form der Küste und die Tiefe des Meeres sind überall anders. Darum hat jeder Ort eigene Zeiten.",
    "beforeAnswers": [
      "Nein, örtliche Bedingungen unterscheiden sich",
      "Ja, an allen Küsten gleichzeitig",
      "Ja, immer um zwölf Uhr"
    ],
    "currentAnswers": [
      "Nein, jede Küste hat eigene Zeiten",
      "Ja, an allen Küsten gleichzeitig",
      "Ja, immer um zwölf Uhr",
      "Nein, Hochwasser gibt es nur bei Vollmond"
    ],
    "beforeWrongReasons": null,
    "beforePrompt": "Ist Hochwasser überall gleichzeitig?",
    "beforeWhy": "Form und Tiefe von Meeresbecken sowie Küsten beeinflussen den Verlauf.",
    "beforeCorrect": 0
  },
  {
    "id": "science-tides-3",
    "topic": "science-tides",
    "difficulty": "hard",
    "prompt": "Du willst durchs Watt wandern. Warum reicht ein Mondkalender nicht?",
    "correct": 0,
    "why": "Ein Mondkalender zeigt nur die Mondphasen. Fürs Watt brauchst du die Gezeiten für genau diesen Ort und den Wetterbericht. Und eine Begleitung, die sich auskennt.",
    "beforeAnswers": [
      "Örtliche Zeiten und Wetter müssen berücksichtigt werden",
      "Der Mond hat keinen Einfluss auf das Meer",
      "Jeder Vollmond hält Wasser zurück"
    ],
    "currentAnswers": [
      "Er zeigt keine Gezeiten und kein Wetter für deinen Ort",
      "Der Mond hat keinen Einfluss auf das Meer",
      "Jeder Vollmond hält Wasser zurück",
      "Bei Vollmond bleibt das Watt den ganzen Tag trocken"
    ],
    "beforeWrongReasons": null,
    "beforePrompt": "Warum ist eine Mondphasenkarte kein sicherer Ausflugsplan fürs Watt?",
    "beforeWhy": "Für einen sicheren Ausflug sind örtliche Gezeitenvorhersagen und Wetter wichtig.",
    "beforeCorrect": 0
  },
  {
    "id": "science-tides-4",
    "topic": "science-tides",
    "difficulty": "hard",
    "prompt": "Bei Neumond und Vollmond gibt es Springtiden, besonders hohe Fluten. Warum?",
    "correct": 0,
    "why": "Stehen Sonne, Erde und Mond in einer Linie, wirken Sonne und Mond zusammen. Dann ist die Flut besonders hoch.",
    "beforeAnswers": [
      "Sonnen- und Mondeinfluss können sich verstärken",
      "Nur Vollmond erzeugt Schwerkraft",
      "Springtide gibt es nur im Frühling"
    ],
    "currentAnswers": [
      "Sonne, Erde und Mond stehen auf einer Linie",
      "Nur Vollmond erzeugt Schwerkraft",
      "Springtide gibt es nur im Frühling",
      "Dann ist der Mond der Erde besonders nah"
    ],
    "beforeWrongReasons": null,
    "beforePrompt": "Warum kann Springtide bei Neu- und Vollmond auftreten?",
    "beforeWhy": "Bei entsprechender Anordnung verstärken sich die Gezeiteneinflüsse.",
    "beforeCorrect": 0
  },
  {
    "id": "history-khipu:compare",
    "topic": "history-khipu",
    "difficulty": "medium",
    "prompt": "Ein Bild zeigt drei Zeichen und fünf Zeichen. Niemand hat dir gesagt, was sie bedeuten. Was weißt du dann nicht?",
    "correct": 0,
    "why": "Zählen und vergleichen kannst du selbst. Was die Zeichen bedeuten, muss dir jemand sagen.",
    "beforeAnswers": [
      "Ob die Zeichen etwa Körbe oder Personen zählen",
      "Dass fünf mehr als drei ist",
      "Die Möglichkeit, beide gezeichneten Mengen zu vergleichen"
    ],
    "currentAnswers": [
      "Ob die Zeichen etwa Körbe oder Personen zählen",
      "Dass fünf mehr als drei ist",
      "Die Möglichkeit, beide gezeichneten Mengen zu vergleichen",
      "Wie viele Zeichen es zusammen sind"
    ],
    "beforeWrongReasons": null,
    "beforePrompt": "Du erkennst in unserem erfundenen Lernbild drei und fünf Zeichen. Was fehlt ohne Vereinbarung?",
    "beforeWhy": "Eine Anzahl lässt sich vergleichen, ohne zu wissen, was gezählt wird. Die Bedeutung braucht eine vereinbarte Zuordnung.",
    "beforeCorrect": 0
  },
  {
    "id": "history-khipu:limits",
    "topic": "history-khipu",
    "difficulty": "hard",
    "prompt": "Forschende lesen aus einem Khipu Zahlen ab. Was behauptet zu viel?",
    "correct": 0,
    "why": "Zahlen lesen heißt nicht, alles zu verstehen. Fäden und Knoten können noch mehr bedeuten.",
    "beforeAnswers": [
      "Dass damit jede weitere Bedeutung des Khipus vollständig geklärt ist",
      "Dass bestimmte Mengen aufgezeichnet sein können",
      "Dass Knoten und Anordnung untersucht werden können"
    ],
    "currentAnswers": [
      "Dass damit alles im Khipu verstanden ist",
      "Dass bestimmte Mengen aufgezeichnet sein können",
      "Dass Knoten und Anordnung untersucht werden können",
      "Dass Khipus Zahlen festhalten konnten"
    ],
    "beforeWrongReasons": null,
    "beforePrompt": "Ein Khipu enthält erkennbare Zahlen. Welche Schlussfolgerung geht über diesen Befund hinaus?",
    "beforeWhy": "Erkennbare Zahlen beweisen keine vollständige Entschlüsselung aller weiteren Merkmale oder Bedeutungen.",
    "beforeCorrect": 0
  },
  {
    "id": "history-mohenjo-daro:compare",
    "topic": "history-mohenjo-daro",
    "difficulty": "medium",
    "prompt": "In einem alten Haus finden Forschende einen Abfluss. Was zeigt das sicher?",
    "correct": 0,
    "why": "Der Abfluss zeigt: Hier konnte Wasser abfließen. Ob die Menschen reich waren oder das Wasser sauber, verrät er nicht.",
    "beforeAnswers": [
      "An dieser Stelle gab es eine bauliche Einrichtung für einen Wasserweg",
      "Dass alle Bewohner der Stadt dasselbe Einkommen hatten",
      "Dass das Wasser immer keimfrei war"
    ],
    "currentAnswers": [
      "Dass es hier einen Weg für Wasser gab",
      "Dass alle Bewohner der Stadt dasselbe Einkommen hatten",
      "Dass das Wasser immer keimfrei war",
      "Dass jedes Haus der Stadt einen Abfluss hatte"
    ],
    "beforeWrongReasons": null,
    "beforePrompt": "In einem Haus wird ein Ablauf gefunden. Was ist damit direkt belegt?",
    "beforeWhy": "Der Fund belegt zunächst die bauliche Einrichtung. Einkommen oder Keimfreiheit benötigen andere Belege.",
    "beforeCorrect": 0
  },
  {
    "id": "history-mohenjo-daro:limits",
    "topic": "history-mohenjo-daro",
    "difficulty": "hard",
    "prompt": "Forschende haben nur einen Teil der Stadt ausgegraben. Warum wissen sie nicht alles über die ganze Stadt?",
    "correct": 0,
    "why": "Andere Stadtteile können anders ausgesehen haben. Weitere Grabungen können mehr verraten.",
    "beforeAnswers": [
      "Untersuchter Ausschnitt und Gesamtstadt sind nicht automatisch gleich",
      "Weil Baureste grundsätzlich nichts über Menschen verraten",
      "Weil nur schriftliche Quellen wissenschaftlich zählen"
    ],
    "currentAnswers": [
      "Weil andere Stadtteile anders sein konnten",
      "Weil Baureste grundsätzlich nichts über Menschen verraten",
      "Weil nur schriftliche Quellen wissenschaftlich zählen",
      "Weil Ausgrabungen alle Funde zerstören"
    ],
    "beforeWrongReasons": null,
    "beforePrompt": "Warum reicht ein ausgegrabener Stadtteil nicht für jede Aussage über die gesamte Stadt?",
    "beforeWhy": "Materielle Quellen sind wertvoll, aber ihr räumlicher und zeitlicher Ausschnitt begrenzt die Schlüsse. Weitere Funde können sie ergänzen.",
    "beforeCorrect": 0
  },
  {
    "id": "history-bronze:material",
    "topic": "history-bronze",
    "difficulty": "medium",
    "prompt": "In einem alten Metallstück stecken Kupfer und Zinn. Was verrät das nicht?",
    "correct": 0,
    "why": "Die Analyse beschreibt Bestandteile. Eine zeitliche Einordnung braucht zusätzliche Informationen, etwa einen verlässlich untersuchten Fundzusammenhang.",
    "beforeAnswers": [
      "Wann und wo Menschen das Stück benutzt haben.",
      "Dass das untersuchte Stück Kupfer enthält.",
      "Dass das untersuchte Stück Zinn enthält."
    ],
    "currentAnswers": [
      "Wann und wo Menschen das Stück benutzt haben.",
      "Dass das untersuchte Stück Kupfer enthält.",
      "Dass das untersuchte Stück Zinn enthält.",
      "Dass das Stück aus einem Metallgemisch besteht."
    ],
    "beforeWrongReasons": [
      null,
      "Kupfer ist in der Analyse bereits genannt. Die Frage sucht eine Information, die aus diesen Bestandteilen allein noch nicht folgt.",
      "Zinn ist in der Analyse bereits genannt. Die Stoffangabe liefert allein noch keine Angaben zu Ort und Zeitpunkt der Nutzung."
    ],
    "beforePrompt": "Die Analyse eines Stücks ergibt Kupfer und Zinn. Was ist damit allein noch nicht geklärt?",
    "beforeWhy": "Die Analyse beschreibt Bestandteile. Eine zeitliche Einordnung braucht zusätzliche Informationen, etwa einen verlässlich untersuchten Fundzusammenhang.",
    "beforeCorrect": 0
  },
  {
    "id": "history-bronze:limits",
    "topic": "history-bronze",
    "difficulty": "hard",
    "prompt": "Bei einer Ausgrabung liegt ein Gegenstand aus Bronze. Welcher Satz behauptet zu viel?",
    "correct": 0,
    "why": "Ein einzelner Fund zeigt nicht, was alle benutzten. Es gab vielleicht auch Werkzeuge aus Stein oder Holz.",
    "beforeAnswers": [
      "Alle Menschen der ganzen Region benutzten ausschließlich Bronze.",
      "An diesem Fund kann der Werkstoff untersucht werden.",
      "Weitere Funde können mit diesem Stück verglichen werden."
    ],
    "currentAnswers": [
      "Alle Menschen der Gegend nutzten nur Bronze.",
      "An diesem Fund kann der Werkstoff untersucht werden.",
      "Weitere Funde können mit diesem Stück verglichen werden.",
      "Der Fund kann etwas über diesen Ort verraten."
    ],
    "beforeWrongReasons": [
      null,
      "Das einzelne Stück kann tatsächlich untersucht werden. Diese begrenzte Aussage behauptet keine ausschließliche Nutzung in der ganzen Region.",
      "Ein Vergleich mit weiteren Funden ist möglich. Er setzt keine pauschale Aussage über alle Menschen und Werkstoffe voraus."
    ],
    "beforePrompt": "In einer Ausgrabung wird ein Bronzegegenstand gefunden. Welche Schlussfolgerung braucht deutlich mehr Belege?",
    "beforeWhy": "Ein einzelner Gegenstand zeigt keine ausschließliche Nutzung in einer ganzen Region. Weitere Funde und ihre Zusammenhänge können auch die Nutzung anderer Werkstoffe belegen.",
    "beforeCorrect": 0
  },
  {
    "id": "person-maria_sibylla_merian:evidence",
    "topic": "person-maria_sibylla_merian",
    "difficulty": "medium",
    "prompt": "Ein Bild zeigt eine Raupe, ein anderes einen Falter. Wird aus dieser Raupe dieser Falter? Wie findest du es sicher heraus?",
    "correct": 1,
    "why": "Nur wer dieselbe Raupe beobachtet, bis aus der Puppe ein Falter schlüpft, weiß es sicher. Ähnliche Farben oder derselbe Ort sind kein Beleg.",
    "beforeAnswers": [
      "Die beiden Bilder mit derselben Hintergrundfarbe ausmalen.",
      "Beobachtungsnotizen, die die Entwicklung desselben Tiers verfolgen.",
      "Die Namen der Tiere durch besonders ähnliche Wörter ersetzen."
    ],
    "currentAnswers": [
      "Die Farben von Raupe und Falter genau vergleichen",
      "Die Raupe beobachten, bis der Falter schlüpft",
      "Schauen, ob beide auf derselben Wiese leben",
      "Nachsehen, ob beide gleich groß sind"
    ],
    "beforeWrongReasons": [
      "Gleiche Bildfarben sind eine Gestaltungsentscheidung. Sie beobachten keine Entwicklung.",
      null,
      "Ähnliche Wörter sind kein Entwicklungsnachweis. Dafür braucht es Informationen über die beobachteten Tiere."
    ],
    "beforePrompt": "Maria Sibylla Merian: Zwei verschiedene Tiere liegen als einzelne Bilder nebeneinander. Die Notizen sagen nicht, ob sie zu derselben Entwicklungsfolge gehören. Welche Zusatzinformation hilft bei der Zuordnung?",
    "beforeWhy": "Eine nachvollziehbare Beobachtungsfolge kann die Entwicklungsstadien verbinden. Ähnliche Gestaltung oder Namen liefern diesen Beleg nicht.",
    "beforeCorrect": 1
  },
  {
    "id": "person-maria_sibylla_merian:limits",
    "topic": "person-maria_sibylla_merian",
    "difficulty": "hard",
    "prompt": "Jemand sagt: „Merians Name steht auf dem Buch. Also stammt alles darin nur von ihr.“ Welche Tatsache zeigt, dass das nicht stimmt?",
    "correct": 2,
    "why": "Merian hat viel selbst beobachtet und gemalt. Aber einheimische und versklavte Menschen zeigten ihr Pflanzen und Tiere. Ihre Namen schrieb sie nicht ins Buch.",
    "beforeAnswers": [
      "Das Buch wurde im Jahr 1705 veröffentlicht.",
      "Das Buch enthält besonders sorgfältig ausgeführte Bilder.",
      "Merian nutzte auch Wissen und Arbeit indigener und versklavter Menschen."
    ],
    "currentAnswers": [
      "Das Buch wurde im Jahr 1705 veröffentlicht.",
      "Das Buch enthält besonders sorgfältig ausgeführte Bilder.",
      "Merian nutzte auch Wissen und Arbeit indigener und versklavter Menschen.",
      "Merian zeichnete sehr genau und geduldig."
    ],
    "beforeWrongReasons": [
      "Das Erscheinungsjahr belegt einen Zeitpunkt. Es sagt nicht, dass die Autorin ohne Beiträge anderer arbeitete.",
      "Sorgfältige Bilder sagen noch nicht, von wem alle Beobachtungen und Informationen stammen.",
      null
    ],
    "beforePrompt": "Maria Sibylla Merian: Eine Behauptung lautet: Weil Merians Name auf dem Buch steht, stammt alles darin allein von ihr. Welche Quelleninformation ist für diese Behauptung entscheidend?",
    "beforeWhy": "Die dokumentierten Beiträge anderer widersprechen dem Alleinanspruch. Ihre oft fehlenden Namen machen ihr Wissen und ihre Arbeit nicht bedeutungslos.",
    "beforeCorrect": 2
  },
  {
    "id": "person-inge_lehmann:evidence",
    "topic": "person-inge_lehmann",
    "difficulty": "medium",
    "prompt": "Inge Lehmann misst ein schwaches Signal von einer Erdbebenwelle. Nach dem alten Bild der Erde dürfte es gar nicht da sein. Was ist jetzt klug?",
    "correct": 2,
    "why": "Erst prüft man, ob die Messung stimmt. Wenn ja, braucht man eine bessere Erklärung.",
    "beforeAnswers": [
      "Die Zeichnung schöner färben und damit die Messung ersetzen.",
      "Das Signal löschen, weil es nicht zur bisherigen Zeichnung passt.",
      "Messung prüfen und untersuchen, welche Erklärung sie zusätzlich erfasst."
    ],
    "currentAnswers": [
      "Sofort ein ganz neues Bild der Erde zeichnen.",
      "Das Signal löschen, weil es nicht zur bisherigen Zeichnung passt.",
      "Die Messung prüfen und eine bessere Erklärung suchen.",
      "Warten, bis jemand Berühmtes es erklärt."
    ],
    "beforeWrongReasons": [
      "Eine schönere Farbe erklärt kein unerwartetes Wellensignal. Dafür sind Messungen und fachliche Überlegungen nötig.",
      "Eine unbequeme Messung zu entfernen prüft ihre Verlässlichkeit nicht und verbessert das Modell nicht.",
      null
    ],
    "beforePrompt": "Inge Lehmann: Das einfachere Modell sagt für einen Bereich kein solches Signal voraus. Dort wird trotzdem ein passendes schwaches Signal gemessen. Was ist jetzt sinnvoll?",
    "beforeWhy": "Ein verlässliches unerwartetes Signal kann eine zusätzliche Erklärung nötig machen. Weitere Daten und Rechnungen prüfen, ob das veränderte Modell besser passt.",
    "beforeCorrect": 2
  },
  {
    "id": "person-inge_lehmann:limits",
    "topic": "person-inge_lehmann",
    "difficulty": "hard",
    "prompt": "Ein neues Modell erklärt Lehmanns Messungen besser als das alte. Was darf man jetzt sagen?",
    "correct": 0,
    "why": "Ein Modell, das besser passt, erklärt viel, aber nicht alles.",
    "beforeAnswers": [
      "Das Modell wird durch passende Messungen gestützt; weitere Eigenschaften brauchen zusätzliche Belege.",
      "Nun sind jede Temperatur und jeder Stoff im Erdinneren exakt bekannt.",
      "Damit ist das gezeichnete Schnittbild ein Foto des wirklichen Erdkerns."
    ],
    "currentAnswers": [
      "Das Modell passt besser, aber vieles ist noch offen.",
      "Nun sind jede Temperatur und jeder Stoff im Erdinneren exakt bekannt.",
      "Damit ist das gezeichnete Schnittbild ein Foto des wirklichen Erdkerns.",
      "Das alte Modell war also in allem falsch."
    ],
    "beforeWrongReasons": [
      null,
      "Die Erklärung der Wellen liefert nicht automatisch sämtliche Temperaturen und Zusammensetzungen exakt mit.",
      "Ein passendes Modell bleibt eine Darstellung und Erklärung. Es verwandelt sich nicht in eine direkte Fotografie."
    ],
    "beforePrompt": "Inge Lehmann: Ein verändertes Modell erklärt zusätzliche Wellenankünfte besser als das zuvor benutzte Modell. Welche Folgerung ist damit angemessen?",
    "beforeWhy": "Eine Erklärung kann bestimmte Messungen gut erfassen. Genaue Temperaturen, Stoffe oder weitere Grenzen werden nicht allein durch diesen einen Vergleich bestimmt.",
    "beforeCorrect": 0
  }
];
const same=(a,b)=>Array.isArray(a)&&a.length===b.length&&a.every((value,index)=>value===b[index]);
const permutation=(order,answers)=>Array.isArray(order)&&order.length===answers.length&&new Set(order).size===order.length&&order.every(value=>typeof value==='string'&&answers.includes(value));
/**
 * @param {{id:string,topic:string,difficulty:string,prompt:string,answers:string[],correct:number,why:string}} question
 * @param {unknown} order
 * @returns {{answers:string[],retainedAnswerOrder:boolean,retainedWrongReasons:(string|null)[]|null}|null}
 */
// Eine Frage kann mehrere frühere Antwortsätze haben (Teilschritt 3: erst umformuliert, dann eine vierte Antwort).
// Jede Zeile gilt nur für die geprüfte heutige Fassung (currentAnswers); eine alte Reihenfolge passt zu genau dem Satz,
// den sie vertauscht. Frage, Lösung, richtige Antwort und Erklärung bleiben gleich.
export function retainedChallengeChoiceVariant(question,order,rows=retainedChallengeChoices){
 if(permutation(order,question.answers))return {answers:question.answers,retainedAnswerOrder:false,retainedWrongReasons:null};
 // Zeilen mit beforePrompt tragen die ganze alte Frage (Teilschritt 3: umformuliert); die alte Runde zeigt sie so, wie sie war.
 const ganz=row=>typeof row.beforePrompt==='string';
 const old=rows.find(row=>row.id===question.id&&row.topic===question.topic&&row.difficulty===question.difficulty&&same(question.answers,row.currentAnswers)&&permutation(order,row.beforeAnswers)
  &&(ganz(row)||row.prompt===question.prompt&&row.correct===question.correct&&row.why===question.why&&row.beforeAnswers[row.correct]===question.answers[question.correct]));
 if(!old)return null;
 return ganz(old)?{answers:[...old.beforeAnswers],prompt:old.beforePrompt,why:old.beforeWhy,correct:old.beforeCorrect,retainedAnswerOrder:true,retainedWrongReasons:old.beforeWrongReasons}:{answers:[...old.beforeAnswers],retainedAnswerOrder:true,retainedWrongReasons:old.beforeWrongReasons};
}
