export const SEQUENCE_GUIDANCE='Ordne diese konkrete Spur mit den Pfeilen. Das Modell zeigt nur den beschriebenen Ausschnitt.';
export const OBSERVATION_GUIDANCE='Vermute zuerst. Beschreibe dann, was du tatsächlich beobachtest. Dein Forschermerkzettel unten ist freiwillig.';
/** @param {{title:string,text:string,fact?:string,whyItMatters?:string,tryIt?:string}} step @param {{scene:string,goal:string}|null|undefined} inquiry */
export function chapterReadingText(step,inquiry){return step.title+'. '+[inquiry?.scene,inquiry?.goal,step.text,step.whyItMatters,step.fact,step.tryIt].filter(Boolean).join(' ');}
/** @param {string} observation */
export function observationReadingText(observation){return observation+' '+OBSERVATION_GUIDANCE;}
