import DATA from './world-connections.json' with {type:'json'};
export type KnowledgeConnection={id:string;fromId:string;toId:string;kind:'needs'|'energy'|'partnership'|'transport'|'recycling'|'habitat'|'exploration'|'cause'|'context'|'compare'|'uses'|'evidence';why:string;checkedAt:string};
export const KNOWLEDGE_CONNECTIONS=DATA.connections as KnowledgeConnection[];
export function connectionsFor(id:string){return KNOWLEDGE_CONNECTIONS.filter(c=>c.fromId===id||c.toId===id).map(c=>({...c,topic:c.fromId===id?c.toId:c.fromId}));}
