import {topicBeforeLearningAudit} from './learning-audit-reference.mjs';
// Exact boundary for historical release tests. The new release separately proves
// these two additions and these two backlinks; no factual/answer field is erased.
export const PEOPLE_METHOD_IDS=['person-maria_sibylla_merian','person-inge_lehmann'];
const backlinks={'animal-monarch-butterfly':'person-maria_sibylla_merian','invention-seismograph':'person-inge_lehmann'};
export const beforePeopleMethods=catalog=>catalog.map(topicBeforeLearningAudit).filter(t=>!PEOPLE_METHOD_IDS.includes(t.id)).map(t=>backlinks[t.id]?{...t,related:t.related.filter(id=>id!==backlinks[t.id])}:t);
export const beforePeopleMethodQuestions=questions=>questions.filter(q=>!PEOPLE_METHOD_IDS.includes(q.topic));
export const beforePeopleMethodGraph=graph=>({...graph,connections:graph.connections.filter(e=>!PEOPLE_METHOD_IDS.includes(e.fromId)&&!PEOPLE_METHOD_IDS.includes(e.toId))});
