// Exact compatibility alias for one reviewed grammatical correction.
// The correct answer and its position are deliberately outside this mapping.
export const RETAINED_ANSWER_WORDING=Object.freeze({topic:'animal-white-tailed-eagle',index:2,before:'Die Länge eines einzelnen Schwanzfeder.',after:'Die Länge einer einzelnen Schwanzfeder.'});
/** @param {string} topic @param {string} value @returns {string} */
export function restoreAnswerWording(topic,value){return topic===RETAINED_ANSWER_WORDING.topic&&value===RETAINED_ANSWER_WORDING.before?RETAINED_ANSWER_WORDING.after:value;}
export function isRetainedAnswerWordingCorrection(c){
 const a=RETAINED_ANSWER_WORDING,before=c.before?.answers,after=c.after?.answers;
 return c.topic===a.topic&&Array.isArray(before)&&Array.isArray(after)&&before.length===3&&after.length===before.length&&c.before.correct===c.after.correct&&c.before.correct!==a.index&&before[a.index]===a.before&&after[a.index]===a.after&&before.every((value,index)=>index===a.index||value===after[index]);
}

// Four exact prior challenge choice sets; no incorrect answer is renamed into a different answer.
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
      "Eis wird flüssig"
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
      "Die Verdunstung aus offenen Gewässern"
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
      "Die Zahl der Modellstationen legt die Reisedauer fest"
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
      "Nur Wasserdampf"
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
      "Die Sonnenwärme ersetzt die Energie aus seiner Nahrung"
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
      "Fotosynthese und Zellatmung sind derselbe Vorgang"
    ],
    "beforeWrongReasons": null
  },
{
  "id": "history-timbuktu:mini",
  "topic": "history-timbuktu",
  "difficulty": "easy",
  "prompt": "Warum ist Timbuktu für die Wissensgeschichte wichtig?",
  "correct": 0,
  "why": "Handel, Handschriften und gelehrte Menschen verbanden unterschiedliche Orte.",
  "beforeAnswers": [
    "Die Stadt war ein Zentrum des Lernens und Handels.",
    "Hier begann die erste Mondreise.",
    "Dort gab es nie Bücher."
  ],
  "currentAnswers": [
    "Die Stadt war ein Zentrum des Lernens und Handels.",
    "Die Stadt war ausschließlich ein Warenlager ohne gelehrten Austausch.",
    "Die Bedeutung der Stadt begann erst mit dem Druck europäischer Bücher."
  ],
  "beforeWrongReasons": [
    null,
    "Eine Mondreise gehört zur Raumfahrt. Timbuktus hier beschriebene Bedeutung liegt bei Lernen, Handschriften und Handel.",
    "Die Quelle nennt ausdrücklich einen Markt für Handschriften. Die Behauptung, dort habe es nie Bücher gegeben, widerspricht diesem Beleg."
  ]
},
{
  "id": "history-mohenjo-daro:mini",
  "topic": "history-mohenjo-daro",
  "difficulty": "easy",
  "prompt": "Welche Spur nennt die UNESCO für die Stadtplanung von Mohenjo-Daro?",
  "correct": 0,
  "why": "Ausgegrabene Straßen und Wasseranlagen sind materielle Spuren. Ihre Untersuchung erlaubt begrenzte Aussagen über die Stadtplanung.",
  "beforeAnswers": [
    "Straßen und ein System von Abläufen",
    "Ein modernes elektrisches U-Bahn-Netz",
    "Satellitenaufnahmen aus der Bauzeit"
  ],
  "currentAnswers": [
    "Straßen und ein System von Abläufen",
    "Ein Nachweis, dass jedes Haus genau gleich gebaut war",
    "Ein Nachweis, dass alle Bewohner immer gesund waren"
  ],
  "beforeWrongReasons": [
    null,
    "Eine moderne elektrische U-Bahn gehört nicht zu den beschriebenen antiken Bauresten.",
    "Satelliten gab es in der Bauzeit nicht. Heutige Aufnahmen sind keine damaligen Augenzeugenbilder."
  ]
},
{
  "id": "history-polynesia:mini",
  "topic": "history-polynesia",
  "difficulty": "easy",
  "prompt": "Was half bei der traditionellen Navigation?",
  "correct": 0,
  "why": "Die Orientierung beruhte auf sorgfältig gelerntem Wissen über Himmel und Meer.",
  "beforeAnswers": [
    "Sterne und Meereswellen beobachten",
    "Nur auf Zufall vertrauen",
    "Ein Smartphone benutzen"
  ],
  "currentAnswers": [
    "Sterne und Meereswellen beobachten",
    "Jede Welle zeigt unmittelbar zur gesuchten Insel",
    "Sterne stehen die ganze Nacht unbewegt am selben Ort"
  ],
  "beforeWrongReasons": null
},
{
  "id": "history-paper:mini",
  "topic": "history-paper",
  "difficulty": "easy",
  "prompt": "Was passt zu Cai Lun?",
  "correct": 0,
  "why": "Ältere Papierfunde weisen auf eine frühere Nutzung des Materials hin. Für 105 ist die Vorstellung eines verbesserten Verfahrens durch Cai Lun überliefert. Eine Weiterentwicklung bekannter Verfahren ist etwas anderes als der voraussetzungslose Beginn sämtlichen Papiers.",
  "beforeAnswers": [
    "Er verbesserte ein bereits bekanntes Verfahren",
    "Er erfand allein jede Art von Papier",
    "Er erfand das Internet"
  ],
  "currentAnswers": [
    "Er verbesserte ein bereits bekanntes Verfahren",
    "Er entwickelte Schrift und Papier als dieselbe Erfindung",
    "Vor seinem Bericht gab es noch keine Papierblätter"
  ],
  "beforeWrongReasons": [
    null,
    "Die Überlieferung betrifft eine Verbesserung. Ältere Papierfunde tragen keine ausschließliche Erfindung sämtlichen Papiers durch eine einzige Person.",
    "Der historische Bericht betrifft die Papierherstellung. Er handelt nicht vom Internet."
  ]
},
{
  "id": "history-writing:mini",
  "topic": "history-writing",
  "difficulty": "easy",
  "prompt": "Wofür nutzten Menschen in Uruk frühe Schrift?",
  "correct": 0,
  "why": "Einige der frühen erhaltenen Tafeln bewahrten wirtschaftliche Angaben, etwa über Güter und Mengen. Eine Mengenliste erzählt nicht den gesamten Alltag, und die besprochene Schrift entwickelte sich über längere Zeit; sie begann nicht als fertiges Alphabet.",
  "beforeAnswers": [
    "Um Dinge wie Getreidemengen festzuhalten",
    "Zum Versenden von E-Mails",
    "Zum Bauen von Satelliten"
  ],
  "currentAnswers": [
    "Um Dinge wie Getreidemengen festzuhalten",
    "Um aus einer Mengenliste den gesamten Alltag einer Stadt abzulesen",
    "Um von Beginn an jeden gesprochenen Satz mit einem fertigen Alphabet aufzuschreiben"
  ],
  "beforeWrongReasons": [
    null,
    "E-Mails brauchen elektronische Geräte und ein Datennetz. Frühe Tontafeln bewahrten Zeichen direkt im Material.",
    "Eine Tontafel ist keine Bauanleitung für Satelliten. Die Quelle beschreibt frühe Aufzeichnungen etwa über Güter und Mengen."
  ]
},
{
  "id": "history-printing:mini",
  "topic": "history-printing",
  "difficulty": "easy",
  "prompt": "Wo gab es schon vor Gutenberg bewegliche Druckzeichen?",
  "correct": 0,
  "why": "Das Gutenberg-Museum beschreibt frühere bewegliche Druckzeichen in China und Korea. Der erhaltene koreanische Jikji-Band von 1377 belegt einen Druck mit beweglichen Metalltypen vor Gutenbergs Mainzer System um 1450.",
  "beforeAnswers": [
    "In China und Korea",
    "Nirgends auf der Welt",
    "Auf dem Mond"
  ],
  "currentAnswers": [
    "In China und Korea",
    "Nur in europäischen Schreibstuben",
    "In keiner Region: vorher gab es ausschließlich ganze Druckplatten"
  ],
  "beforeWrongReasons": [
    null,
    "Das Gutenberg-Museum und der koreanische Druckbeleg von 1377 zeigen frühere bewegliche Druckzeichen in Ostasien.",
    "Der erhaltene Beleg und die beschriebenen Drucktraditionen gehören zur Geschichte auf der Erde; der Mond ist kein genannter Entstehungsort dieses Verfahrens."
  ]
}
];
const same=(a,b)=>Array.isArray(a)&&a.length===b.length&&a.every((value,index)=>value===b[index]);
const permutation=(order,answers)=>Array.isArray(order)&&order.length===answers.length&&new Set(order).size===order.length&&order.every(value=>typeof value==='string'&&answers.includes(value));
/**
 * @param {{id:string,topic:string,difficulty:string,prompt:string,answers:string[],correct:number,why:string}} question
 * @param {unknown} order
 * @returns {{answers:string[],retainedAnswerOrder:boolean,retainedWrongReasons:(string|null)[]|null}|null}
 */
export function retainedChallengeChoiceVariant(question,order){
 if(permutation(order,question.answers))return {answers:question.answers,retainedAnswerOrder:false,retainedWrongReasons:null};
 const old=retainedChallengeChoices.find(row=>row.id===question.id&&row.topic===question.topic&&row.difficulty===question.difficulty);
 if(!old||old.prompt!==question.prompt||old.correct!==question.correct||old.why!==question.why||!same(question.answers,old.currentAnswers)||!permutation(order,old.beforeAnswers))return null;
 return {answers:[...old.beforeAnswers],retainedAnswerOrder:true,retainedWrongReasons:old.beforeWrongReasons};
}
