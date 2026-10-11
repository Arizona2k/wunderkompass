/** Sites publications and deployed test updates have distinct evidence and labels.
 * A merge alone never establishes availability; prepared work stays separate. */
export type UpdateEntry = {
 id:string; version:string; channel:'sites'|'vercel-test'; status:'publication-confirmed'|'test-available'|'prepared';
 confirmedOn:string; publishedOn:string|null; availableOn:string|null; occurredAt:string|null; icon:string; title:string;
 summary:string; details:string[]; links:{label:string;hash:string}[];
 evidence:{file:string;revision:string;quote:string;publicationVersion?:number;pullRequest?:number};
};
import EVIDENCE from '../content/update-history-evidence.json' with {type:'json'};
import TEST_EVIDENCE from './update-history-test-evidence.json' with {type:'json'};
export const HISTORY_EVIDENCE=EVIDENCE;
export const TEST_HISTORY_EVIDENCE=TEST_EVIDENCE;
export function berlinDay(timestamp:string){
 const parts=new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'Europe/Berlin'}).formatToParts(new Date(timestamp));
 const value=(type:string)=>parts.find(p=>p.type===type)!.value;
 return `${value('year')}-${value('month')}-${value('day')}`;
}
const HISTORY_COPY:Record<number,{icon:string;title:string;summary:string;details:string[];links:{label:string;hash:string}[]}>= {
 1:{icon:'🌍',title:'Die Abenteuerwelt beginnt',summary:'Eine drehbare Weltkugel lädt zum Entdecken ein. Erdschichten, Tag und Nacht und ein Quiz machen die Erde zum Ausprobieren.',details:['Dies ist die erste gespeicherte und erfolgreich veröffentlichte Website-Version. Das Projekt wurde am 6. Oktober 2026 deutscher Zeit angelegt. Frühere Ideen oder nicht gespeicherte Entwürfe sind nicht vollständig überliefert.'],links:[{label:'Weltkugel',hash:'globe'}]},
 2:{icon:'🧭',title:'Lernreisen und Spiele kommen dazu',summary:'Lernreisen führen dich Kapitel für Kapitel durch die Erde. Memory, Rätsel und ein Wissensbuch bieten weitere Wege für deine Neugier.',details:['Du kannst frei eine Reise wählen und Kapitel in deinem Tempo entdecken.'],links:[{label:'Lernreisen',hash:'journeys'},{label:'Spielplatz',hash:'games'}]},
 3:{icon:'🧪',title:'Die Erde wird zum Forscherlabor',summary:'Länderporträts, weitere Spiele und Labore erweitern die Lernwelt. Du kannst Naturphänomene untersuchen und eigene Vermutungen ausprobieren.',details:['Im Labor kannst du beobachten und ausprobieren; Länderporträts helfen dir beim Weiterforschen.'],links:[{label:'Forscherlabor',hash:'labs'},{label:'Weltkugel',hash:'globe'}]},
 4:{icon:'🎒',title:'Suchen, merken und mitnehmen',summary:'Eine gemeinsame Suche hilft beim Wiederfinden. Deinen Entdeckerpass kannst du sichern und wieder einlesen; größere Schrift und weniger Bewegung lassen sich auswählen.',details:['Sicherungen helfen beim Mitnehmen. Dein persönlicher Lernstand und eigene Notizen bleiben auf deinem Gerät.'],links:[{label:'Wissensbuch',hash:'book'}]},
 5:{icon:'🪐',title:'Unsere Erde im Sonnensystem',summary:'Ein neues Sonnensystem-Modell zeigt Planeten, ihre Bahnen und Abstände. Denkhinweise helfen beim Weiterforschen.',details:['Vergleiche Planeten und ihre Sonnenabstände. Die Modelle erklären vereinfacht und nennen ihre Grenzen.'],links:[{label:'Forscherlabor',hash:'labs'}]},
 7:{icon:'✨',title:'Sechs Wissenswelten öffnen sich',summary:'90 Wissenskarten verbinden Tiere, Geschichte, große Köpfe, Erfindungen, Bauwerke und Wissenschaft. Die Lernwelt lässt sich freiwillig für das Entdecken ohne Internet vorbereiten.',details:['Wissensrouten und passende Spiele helfen dir, Verbindungen zu entdecken. Für unterwegs kannst du die Lernwelt vorher auf dein Gerät laden.'],links:[{label:'Wissenswelten',hash:'world'}]},
 8:{icon:'🔁',title:'Die Wissenswelt bleibt bereit',summary:'Die Lernwelt wurde erneut bereitgestellt. Die Inhalte entsprechen dem vorherigen veröffentlichten Stand.',details:['Dieser Zwischenstand enthält dieselben Lerninhalte wie die Veröffentlichung davor.'],links:[{label:'Wissenswelten',hash:'world'}]},
 9:{icon:'📷',title:'Lernreisen mit passenden Bildern',summary:'Die Einstiege der Lernreisen bekommen ausgewählte Fotos und Bildnachweise. So wird schon der erste Blick anschaulicher.',details:['Die Bildnachweise bleiben bei den Lernreisen erreichbar. Ausführliche Kapitelgrafiken folgen in einer späteren Runde.'],links:[{label:'Lernreisen',hash:'journeys'}]},
 10:{icon:'💾',title:'Dein Lernstand bleibt zusammen',summary:'Fortschritt, Sicherungen und begonnene Spielrunden werden robuster verwaltet. Offene Fenster im selben Browser gleichen den Entdeckerpass auf demselben Gerät ab.',details:['Zwischen verschiedenen Geräten nimmst du deinen Pass weiterhin mit einer Sicherung mit.'],links:[{label:'Spielplatz',hash:'games'}]},
 11:{icon:'🔎',title:'Dein Wissen schneller wiederfinden',summary:'Die Suche berücksichtigt auch Spiele und passende Begriffe. Direktlinks führen zu Wissenskarten; mit Zurück kannst du wieder anknüpfen. Vorlesestimmen lassen sich besser auswählen.',details:['Deine Vorlesestimme wählst du im Entdeckerpass. Die Suche hilft dir auch beim Finden von Spielen.'],links:[{label:'Wissensbuch',hash:'book'},{label:'Spielplatz',hash:'games'}]},
 12:{icon:'🖼️',title:'Bilder erklären Zusammenhänge',summary:'Lernreisen bekommen erklärende Kapitelgrafiken. Erfindungen zeigen ihre Bauteile, Bauwerke ihre Bauschritte und Geschichtskarten hilfreiche Zusammenhänge.',details:['Eigene Funktionszeichnungen, Bauwerksmodelle, Kontextfolgen, Karten und Kapitelgrafiken erweitern die Darstellung. Freiwillige Details unterstützen das Verstehen.'],links:[{label:'Lernreisen',hash:'journeys'},{label:'Wissenswelten',hash:'world'}]},
 13:{icon:'🌊',title:'18 neue Entdeckungen',summary:'Walhaie, die Maya, Meeresströmungen und Computerregeln: 18 neue Karten erweitern die Wissenswelt auf 108. Neun zusätzliche Modelle laden zum Forschen ein.',details:['Der erhaltene Kartenkatalog wächst von 90 auf 108 Einträge. Die neuen Modelle behandeln unter anderem Atmosphäre, Magnetfeld, Strömungen, Motor, Nahrungsketten, Schall, Planeten, Sonnenenergie und Musterregeln.'],links:[{label:'Wissenswelten',hash:'world'},{label:'Forscherlabor',hash:'labs'}]},
 14:{icon:'🛠️',title:'Leichter suchen und sicher weiterlernen',summary:'Kleine Stolpersteine verschwinden: Tierkarten finden sich klarer, die passende Fortsetzung bleibt nach dem Mitnehmen erhalten und Elterntipps lassen sich direkt öffnen.',details:['Ein Nahrungsspiel kommt auch mit den neuen Tierkarten zurecht. Suche, Hilfe und Elterntipps lassen sich zuverlässiger öffnen und schließen.','Dies ist der letzte belegte Sites-Stand. Spätere Verbesserungen auf der Vercel-Testwebsite sind in der Chronik gesondert gekennzeichnet.'],links:[{label:'Wissenswelten',hash:'world'},{label:'Spielplatz',hash:'games'}]}
};
const SITES_HISTORY:UpdateEntry[]=EVIDENCE.versions.flatMap(record=>{
 const copy=HISTORY_COPY[record.number],publication=record.publication;
 if(!copy||publication?.status!=='succeeded'||publication.type!=='publish')return [];
 return [{id:'site-v'+record.number,version:String(record.number),channel:'sites',status:'publication-confirmed',confirmedOn:EVIDENCE.checkedOn,publishedOn:berlinDay(publication.completedAt),availableOn:null,occurredAt:publication.completedAt,...copy,evidence:{file:'content/update-history-evidence.json',revision:record.sourceCommit,quote:record.sourceCommit,publicationVersion:record.number}}];
});
type TestRecord=typeof TEST_EVIDENCE.pullRequests[number];
type UpdateCopy=Pick<UpdateEntry,'id'|'icon'|'title'|'summary'|'details'|'links'>;
/** Reject stale success, unrelated previews and merged-but-unavailable work. */
export function confirmedTestDeployment(record:TestRecord,baseline=TEST_EVIDENCE.testLive){
 const commit=record.mergeCommit,merged=Date.parse(record.mergedAt??'');
 if(record.base!=='test-live'||!commit||!/^[a-f0-9]{40}$/.test(commit)||!Number.isFinite(merged)||!baseline.includedMergeCommits.includes(commit)||record.statusesUrl!==`https://api.github.com/repos/${TEST_EVIDENCE.repository}/commits/${commit}/statuses`)return null;
 const latest=record.deploymentStatuses.filter(s=>s.context==='Vercel').toSorted((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt)||b.id-a.id)[0];
 if(!latest||latest.state!=='success'||latest.creator!=='vercel[bot]'||latest.description!=='Deployment has completed'||!/^https:\/\/vercel\.com\/interaktive-wissens-und-lernplattform\/wunderkompass\/[A-Za-z0-9]+$/.test(latest.targetUrl)||!Number.isFinite(Date.parse(latest.createdAt))||Date.parse(latest.createdAt)<merged)return null;
 return latest;
}
export function testUpdate(record:TestRecord,copy:UpdateCopy,baseline=TEST_EVIDENCE.testLive):UpdateEntry{
 const deployment=confirmedTestDeployment(record,baseline);
 return {...copy,version:String(record.number),channel:'vercel-test',status:deployment?'test-available':'prepared',confirmedOn:TEST_EVIDENCE.checkedOn,publishedOn:null,availableOn:deployment?berlinDay(deployment.createdAt):null,occurredAt:deployment?.createdAt??null,evidence:{file:'app/update-history-test-evidence.json',revision:record.mergeCommit??'',quote:record.mergeCommit??`"number": ${record.number}`,pullRequest:record.number}};
}
const TEST_COPY:Record<number,UpdateCopy>={
 3:{id:'test-website',icon:'🚀',title:'Eine Testwebsite zum Weiterentwickeln',summary:'Die erhaltene Lernwelt wird auf einer eigenen Testwebsite bereitgestellt. Dort lassen sich Verbesserungen ausprobieren, bevor sie für die Hauptwebsite freigegeben werden.',details:['Eine erfolgreiche Testbereitstellung ist keine Veröffentlichung auf der Hauptwebsite. Übernahmen und Veröffentlichungen werden weiterhin ausdrücklich freigegeben.'],links:[{label:'Lernwelt entdecken',hash:'globe'}]},
 9:{id:'connected-discoveries',icon:'🌿',title:'Von der Natur bis zum Mond',summary:'Acht neue Wissenskarten, zwei Lernrouten und die Wissens-Challenge verbinden Natur und Weltall.',details:['Drei frei wählbare Stufen helfen beim Erkennen, Vergleichen und Weiterdenken.'],links:[{label:'Wissenswelten',hash:'world'},{label:'Spielplatz',hash:'games'}]},
 10:{id:'hint-correction',icon:'🧩',title:'Selbst auf die Antwort kommen',summary:'Denkhinweise helfen dir beim Überlegen und verraten die Lösung nicht vorzeitig.',details:['Erklärungen und die richtige Lösung erscheinen erst nach einer erfolgreichen Antwort.'],links:[{label:'Spielplatz',hash:'games'}]},
 11:{id:'individual-hints',icon:'💡',title:'Hinweise, die zu deiner Frage passen',summary:'Alle 142 Challenge-Aufgaben bekommen eigene Denkhinweise. Du kannst in drei Stufen spielen und dir bei Bedarf Schritt für Schritt helfen lassen.',details:['Die Hinweise beziehen sich auf die jeweilige Frage und sollen dich beim eigenen Denken unterstützen.'],links:[{label:'Spielplatz',hash:'games'}]},
 12:{id:'discovery-centre',icon:'✨',title:'Wissenswelten direkt finden',summary:'Eine Entdeckerzentrale macht sechs Welten, die Weltkugel und verbundene Wissensspuren leichter erreichbar.',details:['Eine Frage kann dich zu zwei passenden Themen und einer Lernroute führen.'],links:[{label:'Entdecken',hash:'globe'}]},
 14:{id:'science-articles',icon:'🌙',title:'Wissen mit Bildern verstehen',summary:'Ruhigere Wissenskarten, Lernwege und eigene Mond- und Meeresgrafiken helfen beim Verstehen. Auch auf kleinen Smartphones bleiben die Beschriftungen lesbar.',details:['Grafiken zeigen Mondphasen, Gezeiten und Meeresströmungen. Lesbare Beschriftungen und Alternativtexte ergänzen die wissenschaftlichen Modelle.'],links:[{label:'Mondphasen',hash:'world/topic/science-moon-phases'},{label:'Wissenswelten',hash:'world'}]},
 15:{id:'explorer-pass',icon:'🎒',title:'Dein Entdeckerpass wird übersichtlicher',summary:'Fortschritt, Lernwege, Abzeichen und Sicherungen bekommen klarere Plätze. Deinen Pass kannst du leichter sichern und wieder mitnehmen.',details:['Alle bisherigen Einstellungen, Spielstände, Abzeichen und Sicherungen bleiben erhalten.'],links:[]},
 16:{id:'calm-connections',icon:'🔗',title:'Ruhige Wissensverbindungen',summary:'Dezente Trennlinien und passende Abstände lassen die Verbindungen zwischen Themen leichter lesen.',details:['Die grünen Seitenbalken entfallen. Die Erklärungen, warum Themen zusammenhängen, bleiben vollständig erreichbar.'],links:[{label:'Wissenswelten',hash:'world'}]},
 17:{id:'explorer-pass-fine',icon:'🏅',title:'Mehr Luft im mobilen Entdeckerpass',summary:'Klarere Gruppen, größere Schalter und gut sichtbarer, ruhiger Fokus machen den Pass auf kleinen Smartphones angenehmer.',details:['Auch mit großer Schrift bleiben die Hauptaktionen gut erreichbar. Sicherungen und Lernstände bleiben erhalten.'],links:[]},
 18:{id:'first-visit-home',icon:'🧭',title:'Dein erster Schritt wird klarer',summary:'Die Startseite erklärt die Lernwelt kurz, ordnet die Einstiege und bietet diese Chronik. Begonnene Lernaktivitäten lassen sich gezielt fortsetzen.',details:['Die Weltkugel, die Suche und sechs Wissenswelten sind leichter erreichbar. Zurück führt wieder an die passende Stelle.','Die Chronik unterscheidet frühere Sites-Veröffentlichungen und belegte Updates der Testwebsite.'],links:[{label:'Entdecken',hash:'globe'}]}
};
const TEST_UPDATES=TEST_EVIDENCE.pullRequests.flatMap(record=>TEST_COPY[record.number]?[testUpdate(record,TEST_COPY[record.number])]:[]);
export const UPDATE_HISTORY:UpdateEntry[]=[...SITES_HISTORY,...TEST_UPDATES.filter(e=>e.status==='test-available')];
export const PREPARED_UPDATES:UpdateEntry[]=TEST_UPDATES.filter(e=>e.status==='prepared');
export const updateLabel=(entry:UpdateEntry)=>entry.channel==='sites'?`Sites · Version ${entry.version}`:entry.status==='prepared'?'Bereitstellung noch unbestätigt':'Testwebsite · verfügbar';
const updateDay=(entry:UpdateEntry)=>entry.availableOn??entry.publishedOn??entry.confirmedOn;
export function publicUpdates(entries:readonly UpdateEntry[]=UPDATE_HISTORY){
 return entries.filter(e=>e.status==='publication-confirmed'&&e.channel==='sites'||e.status==='test-available'&&e.channel==='vercel-test'&&e.availableOn!==null).toSorted((a,b)=>updateDay(b).localeCompare(updateDay(a))||(Date.parse(b.occurredAt??'')||0)-(Date.parse(a.occurredAt??'')||0)||Number(b.version)-Number(a.version));
}
export function updateDate(entry:UpdateEntry){
 return formatHistoryDay(updateDay(entry));
}
export const formatHistoryDay=(date:string)=>new Intl.DateTimeFormat('de-DE',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Berlin'}).format(new Date(date+'T12:00:00Z'));
