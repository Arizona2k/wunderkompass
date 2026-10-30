import {topicBeforeLearningAudit} from './learning-audit-reference.mjs';
// Historical source hashes retain their original meaning. Only this explicitly
// reviewed image-disclosure wording maps to its former historical reference.
// The current product must independently retain the new disclosure; no answer,
// source, factual field, unknown note or different topic is ignored here.
export const OKAPI_MEDIA_SOURCE_NOTE=Object.freeze({previous:"Quellenstand 18.10.2026. Die Größenangabe ist eine Höhe, keine Körperlänge. Beinstreifen allein beweisen keine Verwandtschaft mit Zebras. Die Ortsmarke zeigt eine Beispielregion. Der Schutztext erklärt Rücksicht und Quellenbefunde: keine eigene weltweite Gefährdungseinstufung. Die eigene schematische Grafik ist keine sichere Bestimmungshilfe.",current:"Quellenstand 18.10.2026. Die Größenangabe ist eine Höhe, keine Körperlänge. Beinstreifen allein beweisen keine Verwandtschaft mit Zebras. Die Ortsmarke zeigt eine Beispielregion. Der Schutztext erklärt Rücksicht und Quellenbefunde: keine eigene weltweite Gefährdungseinstufung. Die eigene KI-Illustration ist kein Foto und keine sichere Bestimmungshilfe; sie zeigt beispielhaft ein weibliches Tier."});
export function topicAtHistoricalMediaReference(current){
 const topic=topicBeforeLearningAudit(current);
 return topic.id==='animal-okapi'&&topic.sourceNote===OKAPI_MEDIA_SOURCE_NOTE.current?{...topic,sourceNote:OKAPI_MEDIA_SOURCE_NOTE.previous}:topic;
}
