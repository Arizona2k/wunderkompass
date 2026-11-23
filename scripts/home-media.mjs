// Zeigt eine Wissenskarte auf der Startseite ein Bild? Dieselbe Regel wie DiscoveryTopicMedia
// (app/discovery-topic-media.tsx): eigenes Foto, eine der festen Foto-, Zeichnungs- oder Konzeptkarten,
// eine Wissenschafts-Zeichnung (app/science-diagram.tsx) oder sonst die Ortskarte, die nur mit Orten etwas zeigt.
// Die ID-Listen kommen direkt aus den Quelldateien, damit es nur eine Quelle gibt.
import {sourceConstant} from './source-constant.mjs';

export function homeMediaCheck() {
  const ids = new Set([
    ...sourceConstant('app/discovery-topic-media.tsx', 'DISCOVERY_PHOTO_IDS'),
    ...sourceConstant('app/discovery-topic-media.tsx', 'DISCOVERY_DRAWING_IDS'),
    ...sourceConstant('app/discovery-concept-media.tsx', 'CONCEPT_MEDIA_IDS'),
    ...Object.keys(sourceConstant('app/science-diagram.tsx', 'diagrams')).map(key => 'science-' + key),
  ]);
  return entry => !!entry && (!!entry.image || ids.has(entry.id) || (entry.locations?.length ?? 0) > 0);
}
