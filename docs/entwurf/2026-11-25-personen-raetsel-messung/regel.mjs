import fs from 'node:fs';
const C=JSON.parse(fs.readFileSync(new URL('../../../app/world-catalog.json', import.meta.url),'utf8')).filter(t=>t.person);
const F=JSON.parse(fs.readFileSync(new URL('../../../app/world-game-fallen.json', import.meta.url),'utf8')).ausschluss.people;
const A={};for(const[k,v]of Object.entries(F))A[k.replace('person-','')]=v.map(x=>x.replace('person-',''));
A.albert_einstein=['henrietta_swan_leavitt','cecilia_payne_gaposchkin','ibn_al_haytham'];A.charles_darwin.push('maria_sibylla_merian');
const G={charles_darwin:['natur'],alexander_humboldt:['natur'],maria_sibylla_merian:['natur','schrift'],mary_anning:['natur'],jane_goodall:['natur'],rachel_carson:['natur','schrift'],wangari_maathai:['natur','gesellschaft'],
neil_armstrong:['weltall','technik'],mae_jemison:['weltall','medizin'],katherine_johnson:['weltall','rechnen'],henrietta_swan_leavitt:['weltall'],cecilia_payne_gaposchkin:['weltall','physik'],jocelyn_bell_burnell:['weltall'],
marie_curie:['physik'],albert_einstein:['physik'],lise_meitner:['physik'],chien_shiung_wu:['physik'],rosalind_franklin:['physik'],inge_lehmann:['natur','physik'],ibn_al_haytham:['physik','rechnen'],
al_khwarizmi:['rechnen'],ada_lovelace:['rechnen'],grace_hopper:['rechnen'],tim_berners_lee:['rechnen'],
karl_benz:['technik'],bertha_benz:['technik'],johannes_gutenberg:['technik','schrift'],cai_lun:['technik','schrift'],
murasaki_shikibu:['schrift'],rabindranath_tagore:['schrift'],octavia_butler:['schrift'],katsushika_hokusai:['schrift','technik'],zaha_hadid:['schrift','technik'],
tu_youyou:['medizin'],ibn_sina:['medizin','schrift'],nelson_mandela:['gesellschaft']};
const B=[['marie_curie','albert_einstein'],['marie_curie','rabindranath_tagore'],['marie_curie','wangari_maathai'],['marie_curie','tu_youyou'],
['ibn_sina','murasaki_shikibu'],['ibn_sina','al_khwarizmi'],['ibn_sina','ibn_al_haytham'],['murasaki_shikibu','ibn_al_haytham'],['murasaki_shikibu','al_khwarizmi'],['al_khwarizmi','ibn_al_haytham'],
['ibn_sina','johannes_gutenberg'],['murasaki_shikibu','johannes_gutenberg'],
['albert_einstein','ibn_al_haytham'],['albert_einstein','cecilia_payne_gaposchkin'],['albert_einstein','henrietta_swan_leavitt'],['albert_einstein','jocelyn_bell_burnell'],['albert_einstein','mae_jemison'],['ibn_al_haytham','cecilia_payne_gaposchkin'],
['nelson_mandela','wangari_maathai'],['nelson_mandela','katherine_johnson'],['nelson_mandela','mae_jemison'],['cai_lun','tu_youyou'],['cai_lun','chien_shiung_wu']];
const extra=process.argv.includes('--extra');
if(extra)B.push(['albert_einstein','neil_armstrong'],['albert_einstein','katherine_johnson']);
const ids=Object.keys(G);const jahr={};for(const t of C)jahr[t.id.replace('person-','')]=Number(t.person.lifespan.match(/\d{3,4}/)?.[0]);
const nah=(a,b)=>G[a].some(g=>G[b].includes(g));
const inB=(a,b)=>B.some(([x,y])=>(x===a&&y===b)||(x===b&&y===a));
const inA=(a,b)=>(A[a]??[]).includes(b)||(a.endsWith('benz')&&b.endsWith('benz'));
const E=a=>ids.filter(b=>b!==a&&!nah(a,b)&&!inA(a,b)&&!inB(a,b));
const Pg=a=>ids.filter(b=>b!==a&&nah(a,b)&&!inA(a,b));
const near=a=>ids.filter(b=>b!==a&&!inA(a,b)).sort((x,y)=>Math.abs(jahr[x]-jahr[a])-Math.abs(jahr[y]-jahr[a])).slice(0,5);
for(const a of ['albert_einstein','marie_curie','henrietta_swan_leavitt','jocelyn_bell_burnell','murasaki_shikibu','ibn_sina','cai_lun']){
 console.log(a,'E',E(a).length,'Pgebiet',Pg(a).join(','),'| near5',near(a).join(','));}
console.log('Einstein-Entdecker-Kandidaten:',E('albert_einstein').join(','));
console.log('min E',Math.min(...ids.map(a=>E(a).length)),'Personen mit nur 1 Gebietsfalle:',ids.filter(a=>Pg(a).length===1).map(a=>a+'→'+Pg(a)));
console.log('Personen mit 2-3 Gebietsfallen:',ids.filter(a=>Pg(a).length>1&&Pg(a).length<4).map(a=>a+'→'+Pg(a).join('/')));
// Simulation Profi: 1 Gebietsfalle + 2 aus near5 (ohne Doppel); Kind kennt nur das Gebiet des Rätsels und rät unter passenden Antworten
function sim(zweiGebiet){let sum=0,n=0,match=0;for(const a of ids){for(let r=0;r<400;r++){const pg=[...Pg(a)].sort(()=>Math.random()-.5);const k=zweiGebiet&&pg.length>=2?2:1;const f=pg.slice(0,k);const rest=near(a).filter(b=>!f.includes(b)).sort(()=>Math.random()-.5);while(f.length<3&&rest.length)f.push(rest.shift());
 const opts=[a,...f];const m=opts.filter(o=>nah(a,o)).length;sum+=1/m;match+=m;n++;}}return [(sum/n*100).toFixed(0)+'% Treffer nur mit Gebiet',(match/n).toFixed(2)+' passende Antworten im Schnitt'];}
console.log('Regel 1 Gebietsfalle:',sim(false));console.log('Regel 2 Gebietsfallen:',sim(true));
