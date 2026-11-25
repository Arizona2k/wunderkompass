import {readFileSync} from 'node:fs';
const catalog=JSON.parse(readFileSync('/home/user/wunderkompass/app/world-catalog.json','utf8'));
const arr=Array.isArray(catalog)?catalog:Object.values(catalog).find(Array.isArray);
const normalize=s=>s.normalize('NFKD').replace(/\p{M}/gu,'').toLocaleLowerCase('de').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const V={
'person-jocelyn_bell_burnell':'Diese Person fand auf langen Papierstreifen sehr regelmäßige Signale aus dem Weltall. Vorher half diese Person in Cambridge, ein Radioteleskop zu bauen: viele Antennen auf einem großen Feld.',
'person-cecilia_payne_gaposchkin':'Diese Person untersuchte das Licht der Sterne, um herauszufinden, woraus Sterne bestehen. 1925 berechnete diese Person in einer großen Forschungsarbeit: Sterne bestehen vor allem aus Wasserstoff und Helium.',
'person-wangari_maathai':'Diese Person pflanzte in Kenia mit vielen Menschen Bäume. 2004 bekam diese Person auch dafür den Friedensnobelpreis, einen berühmten Preis für Frieden.',
'person-ada_lovelace':'Diese Person schrieb Rechenschritte für eine Maschine, die nie fertig gebaut wurde. Außerdem dachte diese Person: Eine solche Maschine könnte vielleicht auch mit Musik umgehen.',
'person-henrietta_swan_leavitt':'Diese Person verglich Fotos vom Sternenhimmel auf Glasplatten. Dabei merkte diese Person: Je heller manche blinkenden Sterne leuchten, desto langsamer ist der Takt, und das hilft, Entfernungen im Weltall zu messen.',
'person-chien_shiung_wu':'Diese Person prüfte mit einem genauen Versuch, ob Vorgänge im Spiegelbild gleich ablaufen. Ende 1956 zeigte diese Person mit einem Team: Beim Betazerfall, einem Zerfall von Atomkernen, gilt diese Spiegel-Regel nicht.',
'person-cai_lun':'Diese Person half im alten China, besseres Papier herzustellen. Im Jahr 105 soll diese Person dem Hof des Kaisers ein verbessertes Schreibpapier gezeigt haben.',
'person-alexander_humboldt':'Diese Person verglich, welche Pflanzen unten und welche hoch oben am Berg wachsen. Von 1799 bis 1804 reiste diese Person mit Aimé Bonpland durch Teile Amerikas.',
};
for(const [id,satz] of Object.entries(V)){
 const t=arr.find(x=>x.id===id);const fehler=[];
 const teile=normalize(t.title).split(' ').filter(w=>w.length>2&&!['al','von','van','der'].includes(w));
 for(const teil of teile){const hit=teil.length>3?normalize(satz).includes(teil):new RegExp('(^| )'+teil+'( |$)','u').test(normalize(satz));if(hit)fehler.push('Name '+teil);}
 if(/\b(er|sie|sein|seine|seinen|seinem|seiner|ihr|ihre|ihren|ihrem|ihrer|Er|Sie|Sein|Seine|Ihr|Ihre)\b/u.test(satz))fehler.push('Fürwort '+satz.match(/\b(er|sie|sein|seine|seinen|seinem|seiner|ihr|ihre|ihren|ihrem|ihrer|Er|Sie|Sein|Seine|Ihr|Ihre)\b/u)[0]);
 const saetze=satz.split(/(?<=[.!?])\s+/);
 console.log(id, fehler.length?fehler.join(','):'ok', 'Sätze:',saetze.length, saetze.map(s=>s.split(/\s+/).length).join('/'));
}
