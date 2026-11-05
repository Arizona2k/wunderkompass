import assert from 'node:assert/strict';

// Individual WK-053 retained-person DOM laws; no state-label-only acceptance.
// The same tree format as capturePeopleFigureTree; inputs must be actual DOM
// captured after control activation. State labels alone never establish a law.
const all=(n,t)=>[...(n.tag===t?[n]:[]),...n.children.flatMap(c=>all(c,t))];
const a=(n,k)=>n.attributes[k];
const walk=n=>[n,...n.children.flatMap(walk)];
const by=(n,k)=>walk(n).filter(c=>a(c,k)!==undefined);
const nums=(n,keys)=>keys.map(k=>Number(a(n,k)));
const eq=(x,y,why)=>assert.deepEqual(x,y,why);
const one=(ns,why)=>{assert.equal(ns.length,1,why);return ns[0];};
const svg=root=>one(all(root,'svg'),'one explanatory drawing');
const text=n=>n.text.replace(/\s+/g,' ').trim();
const status=root=>text(one(by(root,'role').filter(n=>a(n,'role')==='status')));
const include=(root,fragment)=>assert(text(root).includes(fragment),fragment);
const child=(n,t)=>n.children.filter(c=>c.tag===t);
const pnums=s=>s.trim().split(/\s+/).map(p=>p.split(',').map(Number));

export function assertExisting18ActualDOMStates(kind,states) {
  assert.equal(states.length,kind==='photon-number-vs-single-energy'?3:2,'all actual selectable scenes');
  states.forEach((root,i)=>{
    const controls=all(root,'div').filter(n=>a(n,'class')?.split(/\s+/).includes('visual-choice'));
    const scene=controls[0];assert(scene,'visible scene controls');
    eq(child(scene,'button').map(b=>a(b,'aria-pressed')),states.map((_,j)=>String(i===j)),'actual selected control');
    assert(status(root).length>20,'actual explanatory feedback');
    assert(all(root,'p').some(n=>a(n,'class')==='small-note'&&text(n).length>100),'visible model limits');
  });
  switch(kind) {
    case 'ordered-operations-evidence': {
      const expected=[[2,5,10],[2,4,7]],ops=[['+ 3','× 2'],['× 2','+ 3']];
      states.forEach((r,i)=>{const s=svg(r),groups=by(s,'data-operation-stage');eq(groups.length,3);
        eq(groups.map(g=>Number(one(child(g,'text')).text)),expected[i],'actual arithmetic, not only metadata');
        eq(groups.map(g=>nums(one(child(g,'rect')),['x','y','width','height'])),[[15,90,70,70],[125,90,70,70],[235,90,70,70]]);
        eq(by(s,'data-operation-label').map(g=>text(one(child(g,'text')))),ops[i]);});break;
    }
    case 'equal-steps-evidence': {
      const pictures=states.map(svg);pictures.forEach((s,i)=>{const circles=all(s,'circle'),left=circles.filter(c=>Number(a(c,'cx'))<160),right=circles.filter(c=>Number(a(c,'cx'))>160);
        eq([left.length,right.length],i?[0,5]:[3,8],'subtract the same three units on both sides');
        eq(all(s,'text').filter(n=>a(n,'y')==='249').map(text),i?['?','5']:['? + 3','8']);
        eq(all(s,'text').filter(n=>a(n,'y')==='100').map(text),['?']);});
      eq(all(pictures[0],'rect'),all(pictures[1],'rect'),'same unknown and same equation fields');break;
    }
    case 'photon-number-vs-single-energy': {
      states.forEach((r,i)=>{const s=svg(r),bars=by(s,'data-photon-bar'),n=[1,4,4][i],h=[60,60,120][i];eq(bars.length,n);
        for(const b of bars)eq(nums(b,['height','y','width']),[h,205-h,34],'common energy scale');
        include(r,'E = h·f');const observed=status(r);assert(observed.includes(`${n} Lichtquant`));
        assert(observed.includes(`je ${[1,1,2][i]} Energieeinheit`));assert(observed.includes(`zusammen ${[1,4,8][i]}`));});break;
    }
    case 'height-temperature-note-comparison': {
      const temps=[[18,12,6],[22,16,10]],xs=[48,167,286],heights=[500,1500,2500];
      states.forEach((r,i)=>{const s=svg(r),dots=all(s,'circle');eq(dots.length,3);
        eq(dots.map(d=>nums(d,['cx','cy'])),temps[i].map((t,j)=>[xs[j],206-t/24*180]),'same axes and independent height/temperature pairs');
        eq(by(r,'data-height-temperature-note').map(text),temps[i].map((t,j)=>`${heights[j]} m Höhe: ${t} °C`));
        eq(a(all(s,'path')[0],'d'),'M48 26V206H286');});break;
    }
    case 'test-conditions-evidence': {
      states.forEach((r,i)=>{eq(all(r,'svg').length,0);const rows=by(r,'data-test-condition');eq(rows.length,3);
        eq(rows.map(n=>text(one(child(n,'strong')))),['Antrieb am selben Platz','Steigung unterwegs','Versorgung unterwegs']);
        eq(rows.map(n=>text(one(child(n,'span')))),[true,!!i,!!i].map(p=>p?'Im Gedankenbeispiel untersucht':'In dieser Notiz noch nicht untersucht'));
        assert(status(r).includes('noch kein erfolgreiches Ergebnis'),'scope is observation, not success');});break;
    }
    case 'fibre-distribution-evidence': {
      states.forEach((r,i)=>{const fibres=all(svg(r),'line');eq(fibres.length,8,'conserved fibre count');const quadrants=[0,0,0,0];
        for(const f of fibres){const[x1,y1,x2,y2]=nums(f,['x1','y1','x2','y2']);eq(Math.hypot(x2-x1,y2-y1),80,'conserved length');
          const x=(x1+x2)/2,y=(y1+y2)/2;assert(x>20&&x<300&&y>20&&y<240);quadrants[Number(x>160)+2*Number(y>130)]++;}
        eq(quadrants,i?[2,2,2,2]:[8,0,0,0]);});break;
    }
    case 'inherited-variants-generations': {
      states.forEach((r,i)=>{const groups=by(svg(r),'data-generation-variant'),counts=[0,0];eq(groups.length,i?16:8);
        groups.forEach((g,j)=>{const circle=one(child(g,'circle')),path=one(child(g,'path'));eq(nums(circle,['cx','cy','r']),[52+j%4*72,28+Math.floor(j/4)*49,17]);
          const type=j<(i?12:4)?0:1;counts[type]++;eq(a(circle,'stroke'),type?'#a44923':'#286a7b');
          const d=a(path,'d');assert(type?d.includes('L'):d.includes('H'),'shape also distinguishes variants');});
        eq(counts,i?[12,4]:[4,4]);assert(status(r).includes('Nicht ein einzelnes Lebewesen wechselt seine Variante'));});break;
    }
    case 'instruction-meaning-evidence': {
      states.forEach((r,i)=>{eq(all(r,'svg').length,0);const figures=all(r,'figure');eq(figures.length,3);
        eq(all(r,'code').map(text),[i?'ADD 2 3':'ADDIERE 2 3','plus(2, 3)']);
        assert(all(figures[2],'span').some(n=>text(n)==='2 + 3 = 5'),'unchanged actual numerical meaning');});break;
    }
    case 'tool-preparation-observation': {
      states.forEach((r,i)=>{const s=svg(r);eq(a(one(by(s,'data-tool-stem')),'d'),'M35 135Q160 120 285 135','unchanged actual stem');
        const leaves=by(s,'data-tool-leaf');eq(leaves.length,i?0:4);assert(leaves.every(n=>child(n,'path').length===1));});break;
    }
    case 'reusable-letter-order-evidence': {
      states.forEach((r,i)=>{const groups=by(svg(r),'data-reusable-letter');eq(groups.length,3);
        const actual=groups.map(g=>text(one(child(g,'text'))));eq(actual,i?['O','R','T']:['T','O','R']);eq([...actual].sort(),['O','R','T'],'same three reusable letters');
        eq(groups.map(g=>Number(a(one(child(g,'rect')),'x'))),[15,120,225]);});break;
    }
    case 'drive-connection-scope': {
      const ss=states.map(svg);eq(ss.map(s=>a(one(by(s,'data-drive-link-state')),'d')),['M146 96H176','M146 96H151M171 96H176'],'real gap in the drawn connection');
      eq(by(ss[0],'data-drive-wheel'),by(ss[1],'data-drive-wheel'),'wheel unchanged, no invented stopping simulation');
      eq(all(ss[0],'path').length-all(ss[1],'path').length,1,'outgoing arrow removed');break;
    }
    case 'calculation-check-evidence': {
      states.forEach((r,i)=>{const s=svg(r),lines=all(s,'polyline');eq(lines.length,2);const first=[0,3,4,3,0],second=i?[0,4,8,12,16]:first;
        eq(lines.map(l=>pnums(a(l,'points'))),[first,second].map(values=>values.map((v,t)=>[50+60*t,215-10*v])),'all five actual values share one scale');
        eq(all(s,'circle').map(c=>nums(c,['cx','cy'])),first.map((v,t)=>[50+60*t,215-10*v]));
        const stepGroup=all(r,'div').find(n=>a(n,'aria-label')==='Vergleichsschritt wählen');assert(stepGroup);eq(child(stepGroup,'button').map(text),[0,1,2,3,4].map(t=>`Schritt ${t}`));
        const selected=child(stepGroup,'button').findIndex(b=>a(b,'aria-pressed')==='true');assert(selected>=0);assert(status(r).includes(`Schritt ${selected}: A = ${first[selected]}; B = ${second[selected]}.`));});break;
    }
    case 'shared-freefall-relative-distance': {
      states.forEach((r,i)=>{const s=svg(r),cabin=one(by(s,'data-freefall-cabin')),ball=one(by(s,'data-freefall-ball')),floor=one(by(s,'data-freefall-floor')),shift=i*45;
        eq(nums(cabin,['x','y','width','height']),[65,30+shift,160,140]);eq(nums(ball,['cx','cy','r']),[145,90+shift,16]);eq(a(floor,'d'),`M65 ${170+shift}H225`);
        eq(Number(a(cabin,'y'))+Number(a(cabin,'height'))-Number(a(ball,'cy')),80,'same relative distance while both move');});break;
    }
    case 'measurement-and-hypothesis-evidence': {
      const ss=states.map(svg);eq(ss[0],ss[1],'a hypothesis creates no new measured data');
      states.forEach(r=>{const bars=by(svg(r),'data-observation-bar');eq(bars.length,2);
        eq(bars.map(g=>nums(one(child(g,'rect')),['height','y'])),[[60,170],[150,80]]);eq(bars.map(g=>child(g,'circle').length),[2,5]);
        eq(bars.map(g=>child(g,'text').map(text)),[['2','A'],['5','B']]);});assert(status(states[1]).startsWith('Vermutung:'));break;
    }
    case 'apollo11-roles-snapshots': {
      states.forEach((r,i)=>{const lists=by(r,'data-crew-place'),columbia=one(lists.filter(n=>a(n,'data-crew-place')==='columbia'));
        eq(child(columbia,'li').map(text),i?['Michael Collins']:['Neil Armstrong','Buzz Aldrin','Michael Collins']);
        const moon=lists.filter(n=>a(n,'data-crew-place')==='moon');eq(moon.length,i?1:0);if(i)eq(child(moon[0],'li').map(text),['Neil Armstrong','Buzz Aldrin']);
        eq(lists.flatMap(l=>child(l,'li').map(text)).sort(),['Buzz Aldrin','Michael Collins','Neil Armstrong'],'three distinct actual people conserved');});break;
    }
    case 'web-note-links': {
      states.forEach((r,i)=>{const s=svg(r);eq(all(s,'text').map(text),['A','B','C'],'all notes stay present');eq(all(s,'rect').map(n=>nums(n,['x','y','width','height'])),[[30,93,72,88],[205,23,72,88],[205,163,72,88]]);
        const arrows=child(s,'path');eq(arrows.length,2);eq(arrows.map(p=>Number(a(p,'stroke-width'))),i?[2,4]:[4,2]);
        assert(status(r).includes(i?'Heute zeichnen wir ein Dreieck.':'Heute malen wir einen Kreis.'));});break;
    }
    case 'evidence-scope-comparison': {
      states.forEach((r,i)=>{const evidence=by(r,'data-evidence-level');eq(evidence.length,3);
        eq(evidence.map(n=>text(one(child(n,'strong')))),['Historischer Hinweis','Untersuchter Stoff','Behandlung bei Menschen']);
        eq(evidence.map(n=>text(one(child(n,'span')))),[true,!!i,false].map(p=>p?'In dieser Notiz vorhanden':'In dieser Notiz nicht belegt'),'no clinical evidence invented');
        assert(status(r).includes(i?'weiterhin nicht nachgewiesen':'weder, welcher einzelne Stoff'));});break;
    }
    case 'tree-follow-up': {
      states.forEach((r,i)=>{const s=svg(r),rects=all(s,'rect'),values=i?[8,10]:[10,20];eq(rects.length,2);
        eq(rects.map(n=>nums(n,['x','y','height'])),values.map((v,j)=>[84+j*135,210-v*8,v*8]),'common zero baseline and count scale');
        eq(all(s,'text').map(text),['20','0',String(values[0]),'A',String(values[1]),'B']);});assert(status(states[1]).includes('acht von zehn gegenüber zehn von zwanzig'));break;
    }
    default:assert.fail('No individual older18 law for '+kind);
  }
  return {kind,actualDOMStates:states.length,individualContentAndGeometryLaw:true};
}

export function rejectExisting18ActualDOMCountercases(pairs) {
  const reject=(kind,change)=>{const damaged=structuredClone(pairs[kind]);change(damaged);assert.throws(()=>assertExisting18ActualDOMStates(kind,damaged),undefined,'damaged actual DOM must fail: '+kind);return kind;};
  const set=(node,key,value)=>{assert(node);node.attributes[key]=value;};
  return [
    reject('ordered-operations-evidence',p=>{one(child(by(p[1],'data-operation-stage')[2],'text')).text='10';}),
    reject('equal-steps-evidence',p=>{const s=svg(p[1]);s.children.splice(s.children.findIndex(n=>n.tag==='circle'),1);}),
    reject('photon-number-vs-single-energy',p=>set(by(p[2],'data-photon-bar')[0],'height','60')),
    reject('height-temperature-note-comparison',p=>set(all(svg(p[1]),'circle')[1],'cy','80')),
    reject('test-conditions-evidence',p=>{one(child(by(p[0],'data-test-condition')[1],'span')).text='Im Gedankenbeispiel untersucht';}),
    reject('fibre-distribution-evidence',p=>set(all(svg(p[1]),'line')[0],'x2','166')),
    reject('inherited-variants-generations',p=>{const s=svg(p[1]);s.children.splice(s.children.findIndex(n=>a(n,'data-generation-variant')==='A'),1);}),
    reject('instruction-meaning-evidence',p=>{all(p[1],'code')[1].text='minus(2, 3)';}),
    reject('tool-preparation-observation',p=>set(by(p[1],'data-tool-stem')[0],'d','M40 135Q160 120 285 135')),
    reject('reusable-letter-order-evidence',p=>{one(child(by(p[1],'data-reusable-letter')[2],'text')).text='O';}),
    reject('drive-connection-scope',p=>set(by(p[1],'data-drive-link-state')[0],'d','M146 96H176')),
    reject('calculation-check-evidence',p=>set(all(svg(p[1]),'polyline')[1],'points','50,215 110,175 170,135 230,95 290,215')),
    reject('shared-freefall-relative-distance',p=>set(by(p[1],'data-freefall-ball')[0],'cy','90')),
    reject('measurement-and-hypothesis-evidence',p=>set(child(by(p[1],'data-observation-bar')[1],'rect')[0],'height','180')),
    reject('apollo11-roles-snapshots',p=>{child(by(p[1],'data-crew-place').find(n=>a(n,'data-crew-place')==='columbia'),'li')[0].text='Neil Armstrong';}),
    reject('web-note-links',p=>{all(svg(p[1]),'text')[2].text='B';}),
    reject('evidence-scope-comparison',p=>{one(child(by(p[1],'data-evidence-level')[2],'span')).text='In dieser Notiz vorhanden';}),
    reject('tree-follow-up',p=>set(all(svg(p[1]),'rect')[0],'height','80')),
  ];
}
