/** Geometric, explicitly simplified educational models, never local predictions. */
const radians=(degrees:number)=>degrees*Math.PI/180;
export function seasonalSun(latitude:number,month:number,tilted=true){
 const declination=tilted?[0,23.4,0,-23.4][month]??0:0;
 const crossing=-Math.tan(radians(latitude))*Math.tan(radians(declination));
 const daylight=crossing>=1?0:crossing<=-1?24:24*Math.acos(crossing)/Math.PI;
 return {declination,daylight,noonAltitude:90-Math.abs(latitude-declination)};
}
export function moonObservation(angle:number){const a=((angle%360)+360)%360;return {day:a/360*29.53,illuminated:(1-Math.cos(radians(a)))/2,waxing:a<=180};}
/** Qualitative alignment demonstration, not an eclipse prediction/ephemeris. */
export function moonAlignment(angle:number,node:number,inclined=true){
 const phase=((angle%360)+360)%360;
 const latitude=inclined?5.145*Math.sin(radians(phase-node)):0;
 const newMoon=Math.min(phase,360-phase)<8,fullMoon=Math.abs(phase-180)<8;
 return {latitude,nearNode:Math.abs(latitude)<.5,alignment:newMoon?'new':fullMoon?'full':'other'} as const;
}
export function tideHeight(hours:number,quarter=false,delay=0){
 const t=hours-delay;
 return Math.cos(2*Math.PI*t/(24+50/60)*2)+.46*Math.cos(2*Math.PI*t/12+(quarter?Math.PI:0));
}
export function summarizeLab(id:string,s:Record<string,unknown>){
 const number=(key:string,fallback:number)=>typeof s[key]==='number'?s[key] as number:fallback;
 switch(id){
 case 'depth':{const d=number('depth',0);return `${d} km: ${d<=35?'Kruste (Richtwert)':d<=2890?'überwiegend fester Mantel':d<=5150?'flüssiger äußerer Kern':'fester innerer Kern'}`;}
 case 'volcano':return `Gas ${number('gas',30)} (Modellskala), ${s.thick?'zähes':'dünnflüssiges'} Magma; ${s.erupt?(s.thick&&number('gas',30)>60?'explosiver':'fließender')+' Modellausbruch':'noch kein Ausbruch ausgelöst'}`;
 case 'quake':return `Herd ${number('depth',15)} km tief; Epizentrum darüber; ${number('run',0)>0?'Wellen ausgelöst':'noch keine Wellen ausgelöst'}`;
 case 'weather':return `${({sun:'Sonne',cloud:'Wolken',rain:'Regen',snow:'Schnee',wind:'Wind',rainbow:'Regenbogen'} as Record<string,string>)[String(s.weather??'cloud')]??'Wolken'}: Abkühlung ${number('cool',0)}, Wind ${number('wind',20)} (beides Modellskalen)`;
 case 'water':return `${['Verdunstung','Kondensation','Niederschlag','Sammeln und Fließen'][number('stage',0)]}; Wärme ${number('warmth',60)} (Modellskala)`;
 case 'seasons':{const m=number('month',1),r=seasonalSun(number('latitude',52),m,s.tilted!==false);return `${['März','Juni','September','Dezember'][m]}, ${number('latitude',52)}° Breite, ${s.tilted===false?'ohne':'mit'} Neigung: ${r.daylight.toFixed(1)} h Tag, Mittagshöhe ${r.noonAltitude.toFixed(1)}° (Geometriemodell)`;}
 case 'plates':return `${({apart:'Auseinander',together:'Zusammen',past:'Seitlich vorbei'} as Record<string,string>)[String(s.type??'apart')]??'Auseinander'}: Bewegung ${number('amount',20)} (beschleunigte Modellskala)`;
 case 'moon':{const r=moonObservation(number('angle',0));return `${number('angle',0)}°: Tag ${r.day.toFixed(1)}, ${Math.round(r.illuminated*100)} % sichtbare Scheibe hell`;}
 case 'clocks':return `${String(s.date??'2026-10-07')}, ${number('hour',10)} h UTC; örtliche Zeiten nach datumsabhängigen Browserregeln`;
 case 'tides':return `${s.phase==='quarter'?'Halbmond / Nipptide':'Linie / Springtide'}, ${number('tideHour',0)} h: ${tideHeight(number('tideHour',0),s.phase==='quarter',number('tideDelay',0)).toFixed(2)} relative Modelleinheiten`;
 case 'solar':return `Planet ${String(s.planet??'earth')}, Zeit ${String(s.days??0)}, Ansicht ${s.compare?'Abstandsbalken':'Bahnenmodell'}; Größen und Entfernungsmaßstab getrennt beachten`;
 default:return '';
 }
}
