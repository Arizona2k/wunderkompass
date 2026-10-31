import assert from 'node:assert/strict';

// Prepared for the next integrated content wave. Not wired into or used as
// evidence for the fixed current PR80 application or its running Quality job.
const close=(actual,expected,label)=>assert(Math.abs(actual-expected)<1e-7,label+': '+actual+' vs '+expected);
const signed=n=>n>0?'+'+n:String(n);
const direction=n=>n===0?'keine Bewegung':n>0?'nach rechts':'nach links';
const segment=d=>{const m=/^M(-?[\d.e+-]+) (-?[\d.e+-]+)L(-?[\d.e+-]+) (-?[\d.e+-]+)/i.exec(d);assert(m,'actual SVG arrow segment '+d);return {x:Number(m[1]),y:Number(m[2]),dx:Number(m[3])-Number(m[1]),dy:Number(m[4])-Number(m[2])};};

async function actualGeometry(figure,kind){
 const state=await figure.evaluate(root=>{
  const num=(el,name)=>Number(el.getAttribute(name));
  const arrow=group=>{const p=group.querySelector('path[stroke]');return p?{d:p.getAttribute('d'),dash:p.getAttribute('stroke-dasharray')}:null;};
  return {
   status:root.querySelector('[role=status]')?.textContent,
   selected:[...root.querySelectorAll('[role=group]')].map(group=>({label:group.querySelector('.mechanics-choice-label')?.textContent,choice:[...group.querySelectorAll('button')].findIndex(button=>button.getAttribute('aria-pressed')==='true')})),
   forces:[...root.querySelectorAll('[data-force-arrow]')].map(group=>({kind:group.getAttribute('data-force-arrow'),newtons:num(group,'data-newtons'),arrow:arrow(group)})),
   motion:[...root.querySelectorAll('[data-motion-second]')].map(group=>({seconds:num(group,'data-motion-second'),position:num(group,'data-position'),x:num(group.querySelector('circle'),'cx'),arrow:arrow(group)})),
   topArrows:[...root.querySelectorAll('svg > g')].map(arrow),
   curve:[...root.querySelectorAll('[data-curve-sample]')].map(group=>({x:num(group.querySelector('circle'),'cx'),y:num(group.querySelector('circle'),'cy'),arrows:[...group.querySelectorAll(':scope > g')].map(arrow)})),
   straightPoints:[...root.querySelectorAll('svg > g')].filter(group=>group.querySelector(':scope > circle')).map(group=>({x:num(group.querySelector(':scope > circle'),'cx'),y:num(group.querySelector(':scope > circle'),'cy'),arrow:arrow(group)})),
   contact:root.querySelector('[data-contact-mode]')?{mode:root.querySelector('[data-contact-mode]').getAttribute('data-contact-mode'),arrows:[...root.querySelectorAll('[data-contact-mode] > g')].map(arrow)}:null,
   elastic:root.querySelector('[data-elastic-case]')?{kind:root.querySelector('[data-elastic-case]').getAttribute('data-elastic-case'),load:num(root.querySelector('[data-elastic-case]'),'data-load-step'),extension:num(root.querySelector('[data-elastic-case]'),'data-extension'),rectY:num(root.querySelector('[data-elastic-case] > rect'),'y')}:null,
   svgTextCount:root.querySelectorAll('svg text').length
  };
 });
 assert.equal(state.svgTextCount,0,'HTML legends carry readable labels');
 for(const group of state.selected)assert(group.choice>=0,'one actual selected control '+group.label);
 if(kind==='forces-and-net'){
  const [left,right,velocity]=state.selected.map(row=>row.choice),l=[0,2,4][left],r=[0,2,4][right],v=[-2,0,2][velocity],net=r-l,acceleration=net/2,after=v+acceleration;
  assert.equal(state.status,`Resultierende Kraft: ${signed(net)} N. Beschleunigung: ${signed(acceleration)} m/s². Nach einer Sekunde: ${signed(after)} m/s (${direction(after)}).`);
  assert.equal(state.forces.length,3);
  for(const [name,value,expectedDx]of [['left',l,-l*20],['right',r,r*20],['net',net,net*20]]){
   const actual=state.forces.find(row=>row.kind===name);assert(actual);assert.equal(actual.newtons,value);
   if(value===0)assert.equal(actual.arrow,null,'zero force has no visible arrow');
   else{assert(actual.arrow,'nonzero force requires actual drawn arrow '+name);const line=segment(actual.arrow.d);close(line.dx,expectedDx,name+' actual signed arrow');close(line.dy,0,name+' horizontal arrow');}
  }
 }else if(kind==='balanced-motion'){
  const velocity=[-2,0,2][state.selected[0].choice];assert.equal(state.motion.length,4);
  for(const [i,row]of state.motion.entries()){
   assert.equal(row.seconds,i);assert.equal(row.position,i===0?0:i*velocity,'initial physical origin is zero in either direction');
   close(row.x-state.motion[0].x,i*velocity*18,'actual equal-time drawn displacement');
   if(velocity===0)assert.equal(row.arrow,null);else close(segment(row.arrow.d).dx,velocity*12,'actual constant signed velocity arrow');
  }
  assert.equal(state.status,`Resultierende Kraft: 0 N. Geschwindigkeit: ${signed(velocity)} m/s (${direction(velocity)}).`);
 }else if(kind==='velocity-direction'){
  const other=[2,-2,4][state.selected[0].choice];assert.equal(state.topArrows.length,2);
  close(segment(state.topArrows[0].d).dx,50,'reference velocity arrow');close(segment(state.topArrows[1].d).dx,other*25,'B direction and relative magnitude');
  assert.equal(state.status,`Oben A: 2 m/s nach rechts. Unten B: ${Math.abs(other)} m/s ${direction(other)}.`);
 }else if(kind==='changing-velocity'){
  if(state.selected[0].choice===0){
   assert.equal(state.curve.length,0);assert.equal(state.straightPoints.length,4);
   for(const [i,row]of state.straightPoints.entries()){
    close(row.x-state.straightPoints[0].x,i*70,'actual straight equal-time spacing');
    close(row.y,state.straightPoints[0].y,'actual straight path');
    close(segment(row.arrow.d).dx,28,'actual unchanged straight velocity');close(segment(row.arrow.d).dy,0,'actual unchanged straight direction');
   }
   assert.equal(state.status,'Betrag und Richtung bleiben gleich: Die Beschleunigung ist null.');
  }
  else{
   assert.equal(state.curve.length,4);
   for(const row of state.curve){
    assert.equal(row.arrows.length,2);const v=segment(row.arrows[0].d),a=segment(row.arrows[1].d),radial={x:row.x-160,y:row.y-90};
    close(v.dx*a.dx+v.dy*a.dy,0,'actual tangential velocity perpendicular to acceleration');
    assert(a.dx*radial.x+a.dy*radial.y<0,'actual acceleration arrow points inward');
    close(a.dx*radial.y-a.dy*radial.x,0,'actual acceleration is radial');
   }
   assert.equal(state.status,'Die Schnelligkeit bleibt gleich, die Richtung ändert sich: Es gibt Beschleunigung zur Kreismitte.');
  }
 }else if(kind==='friction-contact'){
  const sliding=state.selected[0].choice===1;assert(state.contact);assert.equal(state.contact.mode,sliding?'sliding':'static');assert.equal(state.contact.arrows.length,2);
  const tendency=segment(state.contact.arrows[0].d),force=segment(state.contact.arrows[1].d);
  assert(tendency.dx<0&&force.dx>0,'actual relative tendency and force point in opposite directions in this selected contact case');
  assert.equal(state.contact.arrows[0].dash,sliding?null:'5 4','static tendency is distinct from real sliding');
  assert.match(state.status,sliding?/Gleitfall.*relativ zum Boden nach hinten/:/Haftfall.*droht relativ zum Boden nach hinten/);
 }else if(kind==='lever-perpendicular-arm'){
  const choice=state.selected[0].choice,arm=[1,2,0][choice],radius=choice===0?1:2;
  assert.equal(state.status,`Abstand zum Ansatzpunkt: ${radius} m. Senkrechter Abstand zur Wirkungslinie: ${arm} m. Drehmomentbetrag: 2 N × ${arm} m = ${2*arm} N·m.`);
  assert.equal(state.topArrows.length,1);const force=segment(state.topArrows[0].d),radial={x:force.x-55,y:force.y-130},cross=radial.x*force.dy-radial.y*force.dx;
  if(choice===2){close(cross,0,'actual force line passes through pivot');assert(force.dx>0);}
  else{assert(cross<0,'actual perpendicular force rotates about pivot');close(Math.abs(cross),radius*90*70,'actual moment scales with perpendicular arm');}
 }else if(kind==='elastic-versus-permanent'){
  assert(state.elastic);const e=state.elastic;assert(['linear','nonlinear','permanent'].includes(e.kind));assert([0,1,2].includes(e.load));
  let extension=e.load===0?e.extension:e.kind==='nonlinear'?[0,15,40][e.load]:[0,20,40][e.load];
  if(e.load===0)assert(e.extension===0||(e.kind==='permanent'&&e.extension===12),'only selected irreversible history may retain extension');
  assert.equal(e.extension,extension);close(e.rectY,98+extension,'actual drawn endpoint follows selected extension');
 }else assert.fail('unknown mechanics figure '+kind);
 const clipped=await figure.locator('svg').evaluate(svg=>{const v=svg.viewBox.baseVal;return [...svg.querySelectorAll('path,circle,rect')].flatMap(shape=>{const b=shape.getBBox();return b.x<v.x-1||b.y<v.y-1||b.x+b.width>v.x+v.width+1||b.y+b.height>v.y+v.height+1?[shape.outerHTML.slice(0,160)]:[];});});
 assert.deepEqual(clipped,[],'actual mechanics drawing remains inside its viewBox');
 return state;
}

export async function assertBookMechanicsFigure(figure,kind,{activate=button=>button.click(),onState=null}={}){
 const states=[];
 for(const group of await figure.getByRole('group').all()){
  const buttons=await group.getByRole('button').all();assert(buttons.length>=2);
  for(let i=0;i<buttons.length;i++){
   await activate(buttons[i]);assert.equal(await buttons[i].getAttribute('aria-pressed'),'true');
   const state=await actualGeometry(figure,kind);
   if(kind==='elastic-versus-permanent'&&await group.locator('.mechanics-choice-label').innerText()==='Gedankenbeispiel vergleichen'){
    assert.equal(state.elastic.load,0);assert.equal(state.elastic.extension,0,'new thoughtcase starts without invented permanent history');
   }
   states.push(state);await onState?.(states.length-1);
  }
  await activate(buttons[0]);
 }
 if(kind==='forces-and-net'){
  await activate(figure.getByRole('group',{name:'Kraft nach links',exact:true}).getByRole('button',{name:'2 N',exact:true}));
  await activate(figure.getByRole('group',{name:'Kraft nach rechts',exact:true}).getByRole('button',{name:'2 N',exact:true}));
  await activate(figure.getByRole('group',{name:'Anfangsgeschwindigkeit',exact:true}).getByRole('button',{name:'2 m/s nach links',exact:true}));
  const state=await actualGeometry(figure,kind);assert.match(state.status,/Nach einer Sekunde: -2 m\/s/);states.push(state);
 }
 if(kind==='elastic-versus-permanent'){
  for(const [label,expected]of [['Nichtlinear elastisch',0],['Mit bleibender Formänderung',12]]){
   await activate(figure.getByRole('button',{name:label,exact:true}));
   await activate(figure.getByRole('button',{name:'Belastungsschritt 2',exact:true}));
   await actualGeometry(figure,kind);
   await activate(figure.getByRole('button',{name:'Entlasten und Rückkehr vergleichen',exact:true}));
   const state=await actualGeometry(figure,kind);assert.equal(state.elastic.extension,expected);states.push(state);
  }
 }
 return states;
}
