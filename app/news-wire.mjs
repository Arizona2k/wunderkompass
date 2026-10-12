import {validateNews,calendarDay,berlinDay} from './news-validation.mjs';

// One deterministic wire format in browser, producer and verifier. No secrets here.
export function canonical(value){
 if(value===null||typeof value==='boolean'||typeof value==='string')return JSON.stringify(value);
 if(typeof value==='number'&&Number.isFinite(value))return JSON.stringify(value);
 if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
 if(value&&typeof value==='object'&&Object.getPrototypeOf(value)===Object.prototype)return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';
 throw Error('Ungültiges JSON');
}
const bytes=value=>new TextEncoder().encode(canonical(value));
export async function fingerprint(value){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes(value)))].map(n=>n.toString(16).padStart(2,'0')).join('');}
export function base64url(data){return btoa(String.fromCharCode(...new Uint8Array(data))).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');}
export function unbase64url(text){if(typeof text!=='string'||!/^[A-Za-z0-9_-]+$/.test(text)||text.length>200)throw Error('Ungültige Signatur');return Uint8Array.from(atob(text.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0));}
export const signedFields=envelope=>({version:envelope.version,keyId:envelope.keyId,sequence:envelope.sequence,issuedAt:envelope.issuedAt,day:envelope.day,previous:envelope.previous,fingerprint:envelope.fingerprint,status:envelope.status,payload:envelope.payload});
export function validatePayload(payload,{policy,topicIds,now=new Date()}){
 if(payload?.schemaVersion!==1||!['inactive','automatic'].includes(payload.automation)||!Array.isArray(payload.entries)||!payload.entries.length||payload.entries.length>128)throw Error('Ungültige Nachrichtenausgabe');
 if(payload.selectionHistory!==undefined){
  if(!Array.isArray(payload.selectionHistory)||payload.selectionHistory.length>14)throw Error('Ungültiger Themenverlauf');
  const days=new Set();for(const h of payload.selectionHistory){if(!calendarDay(h.day)||h.day>berlinDay(now)||days.has(h.day)||!Array.isArray(h.items)||h.items.length>3)throw Error('Ungültiger Themenverlauf');days.add(h.day);for(const item of h.items)for(const field of ['id','domain','subjectKey','eventKey','meaningKey','family'])if(typeof item[field]!=='string'||!item[field]||item[field].length>160)throw Error('Unvollständiger Themenbeleg');}
 }
 const ids=new Set();let latest='1970-01-01T00:00:00Z';
 for(const entry of payload.entries){validateNews(entry,{policy,topicIds,now});if(ids.has(entry.id))throw Error('Doppelte Nachrichten-ID');ids.add(entry.id);if(entry.checkedAt>latest)latest=entry.checkedAt;}
 if(payload.checkedAt!==latest)throw Error('Prüfstand passt nicht zu den Beiträgen');return payload;
}
export async function verifyEnvelope(envelope,{keys,policy,topicIds,now=new Date(),floor=0,knownFingerprint=null}){
 if(new TextEncoder().encode(canonical(envelope)).length>1048576)throw Error('Nachrichtenausgabe zu groß');
 if(envelope?.version!==1||!Number.isSafeInteger(envelope.sequence)||envelope.sequence<1||envelope.sequence<floor||!calendarDay(envelope.day))throw Error('Ungültige oder zurückgesetzte Ausgabe');
 const issued=Date.parse(envelope.issuedAt);if(!Number.isFinite(issued)||issued>now.getTime()+60000||berlinDay(new Date(issued))!==envelope.day)throw Error('Ungültige Ausgabezeit');
 if(envelope.previous!==null&&!/^[a-f0-9]{64}$/.test(envelope.previous))throw Error('Ungültiger Vorgänger');
 if(!['ok','degraded','no-new-items','rollback'].includes(envelope.status?.state)||!Number.isSafeInteger(envelope.status.quarantined)||envelope.status.quarantined<0||!Number.isSafeInteger(envelope.status.attempts)||envelope.status.attempts<1||envelope.status.attempts>3)throw Error('Ungültiger Betriebsstatus');
 if(envelope.sequence===floor&&knownFingerprint&&knownFingerprint!==envelope.fingerprint)throw Error('Konkurrierende Ausgabe');
 const jwk=keys[envelope.keyId];if(!jwk||jwk.kty!=='EC'||jwk.crv!=='P-256'||jwk.d)throw Error('Unbekannter Signaturschlüssel');
 const key=await crypto.subtle.importKey('jwk',jwk,{name:'ECDSA',namedCurve:'P-256'},false,['verify']);
 if(!await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},key,unbase64url(envelope.signature),bytes(signedFields(envelope))))throw Error('Signatur ungültig');
 if(await fingerprint(envelope.payload)!==envelope.fingerprint)throw Error('Fingerabdruck ungültig');
 validatePayload(envelope.payload,{policy,topicIds,now});return envelope;
}
export async function signEnvelope({payload,keyId,privateKey,sequence,previous=null,now=new Date(),state='ok',quarantined=0,attempts=1}){
 const envelope={version:1,keyId,sequence,issuedAt:now.toISOString(),day:berlinDay(now),previous,fingerprint:await fingerprint(payload),status:{state,quarantined,attempts},payload};
 envelope.signature=base64url(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},privateKey,bytes(signedFields(envelope))));return envelope;
}
