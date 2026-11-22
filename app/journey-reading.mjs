export const SEQUENCE_GUIDANCE='Ordne diese konkrete Spur mit den Pfeilen. Das Modell zeigt nur den beschriebenen Ausschnitt.';
export const OBSERVATION_GUIDANCE='Vermute zuerst. Beschreibe dann, was du tatsächlich beobachtest. Dein Forschermerkzettel unten ist freiwillig.';
// Der Knopf „Vorlesen“ liest, was offen steht: Titel, Auftrag, einfache Fassung, Tatsache, eigene Beobachtung.
// Der lange Text und die Vertiefung haben ihren Knopf unter „Für Große“. Vor dem Nachladen fehlt starter; dann der kurze Text.
/** @param {{title:string,text:string,starter?:string,fact?:string,tryIt?:string}} step @param {{scene:string,goal:string}|null|undefined} inquiry */
export function chapterReadingText(step,inquiry){return step.title+'. '+[inquiry?.scene,inquiry?.goal,step.starter??step.text,step.fact,step.tryIt].filter(Boolean).join(' ');}
/** @param {{text:string,deeper?:string}} step */
export function longReadingText(step){return [step.text,step.deeper].filter(Boolean).join(' ');}
/** @param {string} observation */
export function observationReadingText(observation){return observation+' '+OBSERVATION_GUIDANCE;}
