import fs from 'node:fs';
const root='/home/user/wunderkompass/';
const C=JSON.parse(fs.readFileSync(root+'app/world-catalog.json','utf8'));
const B=JSON.parse(fs.readFileSync(root+'app/people-game-baseline.json','utf8'));
const F=JSON.parse(fs.readFileSync(root+'app/world-game-fallen.json','utf8')).ausschluss.people;
const P=C.filter(t=>t.person);
const T=id=>P.find(t=>t.id===id).title;
const retained=B.map(id=>P.find(t=>t.id===id));
const jahr=t=>Number(t.person.lifespan.match(/\d{3,4}/)?.[0]);
function profi(id){const t=P.find(x=>x.id===id),nicht=F[id]??[];return P.filter(x=>x.id!==id&&!nicht.includes(x.id)).sort((a,b)=>Math.abs(jahr(a)-jahr(t))-Math.abs(jahr(b)-jahr(t))||a.title.localeCompare(b.title,'de')).slice(0,5).map(x=>x.id);}
const out={};
P.forEach((t,i)=>{const old=B.indexOf(t.id),index=old<0?i:old;let ent=[retained[(index+3)%20].id,retained[(index+7)%20].id];
 const nicht=new Set(F[t.id]??[]);const repl=ent.some(e=>nicht.has(e));
 out[t.id]={ent,repl,profi:profi(t.id),jahr:jahr(t)};});
fs.writeFileSync(process.argv[2],JSON.stringify(out,null,1));
for(const [id,o] of Object.entries(out))console.log(id.replace('person-',''),'| E:',o.ent.map(x=>x.replace('person-','')).join(', '),o.repl?'(ERSATZ)':'','| P5:',o.profi.map(x=>x.replace('person-','')).join(', '));
