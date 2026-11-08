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
