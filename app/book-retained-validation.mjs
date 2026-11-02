export const RETAINED_WORDS=["Hypothese", "Topografie", "Geoid", "Koordinate", "Kartenprojektion", "Kernfusion", "Kernspaltung", "Winkel", "Symmetrie"];
export const RETAINED_RETAINED_WORDS=[];
export const RETAINED_QUESTIONS=["Warum ist nicht jede Diagonale eine Spiegelachse?", "Warum ändert ein längerer gezeichneter Pfeil nicht den Winkel?", "Warum ist ein GPS-Punkt keine grenzenlos genaue Ortsangabe?", "Warum kann ein Papierplan eine echte Bauprüfung nicht ersetzen?", "Warum beeinflusst die Länge eines Pendels seinen Takt?", "Warum kann Anschieben im passenden Takt wirksamer sein?", "Warum bleibt ein Farbfleck in Wasser nicht immer an derselben Stelle?", "Warum kann ein schwarzer Stift mehrere Farben enthalten?"];
const text=v=>typeof v==='string'&&v.trim().length>0;
const record=v=>v&&typeof v==='object'&&!Array.isArray(v);
const day=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v+'T12:00:00Z').toISOString().slice(0,10)===v;
const exact=(group,terms)=>record(group)&&Object.keys(group).length===terms.length&&terms.every(term=>Object.hasOwn(group,term));
const figures=["contour-levels", "fixed-angle-length", "individual-motion-and-flow", "normalized-driven-response", "nuclear-symbol-comparison", "ordered-grid-point", "pendulum-length-period-ratio", "plan-scale", "position-example-radius", "projection-patch-area", "rectangle-reflection", "reference-versus-terrain", "testable-collection", "three-illustrative-pigments"];
const topics=["invention-compass", "invention-satellite", "science-angle", "science-chromatography", "science-diffusion", "science-fusion", "science-gps", "science-pendulum", "science-probability", "science-resonance", "science-symmetry", "science-tides"];
export function validateRetainedPack(data){
 const fail=()=>{throw Error('Incomplete retained explanations');};
 if(!record(data)||data.schemaVersion!==1||!exact(data.words,RETAINED_WORDS)||!exact(data.learning,RETAINED_WORDS)||!exact(data.why,RETAINED_QUESTIONS)||!exact(data.whyLearning,RETAINED_QUESTIONS))fail();
 for(const [terms,definitions,learning,tupleLength]of[[RETAINED_WORDS,data.words,data.learning,3],[RETAINED_QUESTIONS,data.why,data.whyLearning,2]])for(const term of terms){
  const definition=definitions[term],item=learning[term];
  if(!Array.isArray(definition)||definition.length!==tupleLength||definition[0]!==term||!definition.every(text)||!record(item))fail();
  if(!['starter','deeper','observe','benefit','connection'].every(key=>text(item[key]))||!day(item.sourceReadOn)||!figures.includes(item.figure)||!((topics.includes(item.topic)&&item.word===undefined)||(item.topic===undefined&&item.word==='Maßstab')))fail();
  const q=item.question;
  if(!record(q))fail();
  if(q!==undefined){
   if(!record(q)||!['prompt','hint','why'].every(key=>text(q[key]))||!Array.isArray(q.answers)||q.answers.length<2||!q.answers.every(text)||new Set(q.answers).size!==q.answers.length||!Number.isInteger(q.correct)||q.correct<0||q.correct>=q.answers.length)fail();
   if(!Array.isArray(q.wrongReasons)||q.wrongReasons.length!==q.answers.length||q.wrongReasons.some((reason,i)=>i!==q.correct&&!text(reason)))fail();
  }
  if(!Array.isArray(item.sources)||!item.sources.length||item.sources.some(s=>!record(s)||!['url','title','anchor'].every(key=>text(s[key]))||!s.url.startsWith('https://')||/\s/.test(s.url)||!day(s.checkedOn)||s.checkedOn>item.sourceReadOn||(s.updatedOn!==null&&!day(s.updatedOn))))fail();
  if(item.sources.map(s=>s.checkedOn).sort().at(-1)!==item.sourceReadOn)fail();
  for(const [key,target,allowed]of[['relatedWords','term',["Algorithmus", "Breitengrad", "Energie", "Frequenz", "Kapillarwirkung", "Kartenprojektion", "Kernfusion", "Kernspaltung", "Koordinate", "Längengrad", "Maßstab", "Meeresspiegel", "Meter", "Mittelwert", "Symmetrie", "Winkel"]],['relatedQuestions','question',["Warum ist die Erde rund?", "Warum ist ein GPS-Punkt keine grenzenlos genaue Ortsangabe?", "Warum ist nicht jede Diagonale eine Spiegelachse?", "Warum passt eine runde Erde nicht genau auf eine flache Karte?", "Warum ändert ein längerer gezeichneter Pfeil nicht den Winkel?"]]])if(item[key]!==undefined&&(!Array.isArray(item[key])||item[key].some(link=>!record(link)||!allowed.includes(link[target])||!text(link.reason))||new Set(item[key].map(link=>link[target])).size!==item[key].length))fail();
 }
 return data;
}
