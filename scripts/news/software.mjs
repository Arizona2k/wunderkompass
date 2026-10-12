import {createHash} from 'node:crypto';
import {berlinDay,calendarDay,validateNews} from '../../app/news-validation.mjs';
export const SOFTWARE_SOURCE='https://api.github.com/repos/godotengine/godot/releases/latest';
const assert=(ok,message)=>{if(!ok)throw Error(message);};
export function releaseEvidence(row,{now,policy}){
 assert(row&&Number.isSafeInteger(row.id)&&row.id>0&&row.draft===false&&row.prerelease===false,'Keine bestätigte öffentliche stabile Veröffentlichung');
 assert(typeof row.tag_name==='string'&&/^\d{1,2}\.\d{1,2}(?:\.\d{1,2})?-stable$/.test(row.tag_name),'Unbekannte stabile Versionsbezeichnung');
 assert(row.url===`https://api.github.com/repos/godotengine/godot/releases/${row.id}`&&row.html_url===`https://github.com/godotengine/godot/releases/tag/${row.tag_name}`,'Veröffentlichung stammt nicht aus dem freigegebenen Originalprojekt');
 assert(typeof row.published_at==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(row.published_at)&&Number.isFinite(Date.parse(row.published_at))&&new Date(row.published_at).toISOString()===row.published_at.replace('Z','.000Z')&&Date.parse(row.published_at)<=now.getTime(),'Veröffentlichungszeitpunkt ungültig');
 const day=berlinDay(new Date(row.published_at));assert(calendarDay(day),'Veröffentlichungstag ungültig');
 const age=(Date.parse(berlinDay(now))-Date.parse(day))/86400000;
 return {project:'Godot',repository:'godotengine/godot',releaseId:row.id,version:row.tag_name.replace('-stable',''),publishedAt:row.published_at,day,fresh:age>=0&&age<=policy.maxAgeDays};
}
export function generateSoftware(evidence,{now,sourceHashes}){
 assert(evidence.fresh,'Alte Softwareveröffentlichung bleibt Archiv, keine aktuelle Meldung');
 const {version,day,releaseId,publishedAt}=evidence,checkedAt=now.toISOString(),eventKey='software:godot:'+releaseId;
 return {id:'software-'+createHash('sha256').update(eventKey).digest('hex').slice(0,16),title:`Eine neue Ausgabe von Godot: ${version}`,section:'Technologie',sourceDateMeaning:'release',sourcePublishedOn:day,eventOn:day,eventUntil:null,checkedAt,
  summary:`Das Godot-Projekt hat die stabile Version ${version} am ${day.split('-').reverse().join('.')} veröffentlicht. Diese Angabe stammt aus seinem öffentlichen Veröffentlichungsverzeichnis.`,
  explanation:'Eine Versionsnummer benennt eine bestimmte Ausgabe eines Computerprogramms. Verschiedene Ausgaben können sich unterscheiden. Welche Funktionen hier neu sind, lässt sich aus der Nummer allein nicht erkennen.',
  why:'Wer über ein Computerprogramm spricht, kann mit seiner Versionsnummer genauer sagen, welche Ausgabe gemeint ist.',background:'Das Projekt ordnet diese Ausgabe als stabile Veröffentlichung ein. Mit der Versionsnummer können Menschen die Ausgabe in einer Erklärung genau benennen.',
  question:'Was sagt eine Versionsnummer – und was verrät sie allein noch nicht?',topicId:'invention-computer',connectionWhy:'Die Computerkarte erklärt, wie Programme Anweisungen geben. Eine Version bezeichnet eine bestimmte Ausgabe eines solchen Programms.',
  verification:'Projekt, Version und Veröffentlichungszeit wurden automatisch mit dem gezielten Original-Veröffentlichungseintrag verglichen. Beide Abrufe stammen aus demselben Projekt und sind keine unabhängigen Bestätigungen. Keine menschliche Einzelabnahme.',
  editorial:{status:'approved',reviewer:'Automatische Sachregel öffentliche Godot-Veröffentlichung v1 · keine menschliche Einzelabnahme',reviewedAt:checkedAt},
  sources:[SOFTWARE_SOURCE,`https://api.github.com/repos/godotengine/godot/releases/${releaseId}`].map((url,i)=>({name:i?'Godot · gezielte Veröffentlichung':'Godot · jüngste stabile Veröffentlichung',organization:'Godot-Projekt / GitHub',url,publishedOn:day,checkedAt,role:'primary',access:'reviewed',rights:'Dokumentierte begrenzte öffentliche REST-Abfrage; eigene Erklärung aus Versions-/Zeitmetadaten, keine Release-Notizen, Dateien, Bilder oder Personendaten.',sha256:sourceHashes[i]})),
  claims:[['project','godotengine/godot'],['version',version],['release-date',publishedAt]].map(([key,value])=>({key,value,sourceIndexes:[0,1]})),generation:{method:'structured-software-release-v1',ruleVersion:1,eventKey,evidence,sourceHashes}
 };
}
export function verifySoftware(entry,row,comparison,context){
 const first=releaseEvidence(row,context),second=releaseEvidence(comparison,context);assert(first.fresh&&JSON.stringify(first)===JSON.stringify(second),'Software-Veröffentlichungen fehlen, sind alt oder widersprechen sich');
 assert(JSON.stringify(entry)===JSON.stringify(generateSoftware(first,context)),'Nicht belegte Softwareaussage');validateNews(entry,context);return entry;
}
