import assert from 'node:assert/strict';

// Input is captured from the rendered DOM after actual control activation.
// These laws examine geometry and content, independently of data-state labels.
export function capturePeopleFigureTree(element) {
  const copy = node => ({tag:node.localName,attributes:Object.fromEntries([...node.attributes].map(a=>[a.name,a.value])),text:node.textContent,children:[...node.children].map(copy)});
  return copy(element);
}
const attr=(node,key)=>node.attributes[key];
const children=(node,tag)=>node.children.filter(n=>n.tag===tag);
const all=(node,tag)=>[...(node.tag===tag?[node]:[]),...node.children.flatMap(n=>all(n,tag))];
const values=(nodes,key)=>nodes.map(n=>attr(n,key));
const points=d=>[...d.matchAll(/[ML](-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g)].map(m=>[Number(m[1]),Number(m[2])]);
const eq=(a,b,message)=>assert.deepEqual(a,b,message);
const BLUE='#467889',ORANGE='#b7572f',ACCENT='#be633d';

export function assertPeopleFigureSemanticPair(kind,pair) {
  assert.equal(pair.length,2);
  const svg=pair.map(root=>all(root,'svg'));
  assert(svg.every(s=>s.length>0));
  const [a,b]=svg.map(s=>s[0]);
  switch(kind) {
    case 'cepheid-evidence': {
      const traces=[a,b].map(s=>{const paths=all(s,'path').filter(p=>attr(p,'stroke')===ACCENT);assert.equal(paths.length,1);const trace=points(attr(paths[0],'d'));assert.equal(trace.length,261);return trace;});
      const peaks=traces.map(t=>t.filter((p,i)=>i>0&&i<t.length-1&&p[1]<t[i-1][1]&&p[1]<t[i+1][1]).map(p=>p[0]));
      eq(peaks,[[50,150,250],[50,150,250]],'distance change preserves the same three maxima and period');eq(traces[0].map(p=>p[0]),traces[1].map(p=>p[0]));
      const [near,far]=traces.map(t=>t.map(p=>p[1]));const nearMin=Math.min(...near),farMin=Math.min(...far),scale=(Math.max(...far)-farMin)/(Math.max(...near)-nearMin),offset=farMin-scale*nearMin;
      assert(scale>0&&scale<1&&farMin>nearMin);assert(near.every((y,i)=>far[i]>=y&&Math.abs(far[i]-(scale*y+offset))<=.01),'same waveform, weaker apparent light, independently rounded SVG coordinates');break;
    }
    case 'spectral-evidence': {
      const lines=[a,b].map(s=>all(s,'path').filter(p=>attr(p,'stroke-width')==='7'));assert(lines.every(l=>l.length===3));eq(values(lines[0],'d'),values(lines[1],'d'));assert.notDeepEqual(values(lines[0],'opacity'),values(lines[1],'opacity'));assert(lines.flat().every(p=>Number(attr(p,'opacity'))>0&&Number(attr(p,'opacity'))<=1));for(const s of[a,b])eq(all(s,'text').map(n=>n.text),['1','2','3']);break;
    }
    case 'diffraction-evidence': {
      eq(svg.map(s=>s.length),[1,2]);const dots=s=>all(s,'circle').map(c=>['cx','cy','r'].map(k=>attr(c,k)));assert.equal(dots(a).length,7);eq(dots(a),dots(b));assert.equal(children(svg[1][1],'path').length,11);assert(pair.every(p=>p.text.includes('keine Photo51-Reproduktion')));break;
    }
    case 'pulse-evidence': {
      const traces=[a,b].map(s=>all(s,'path').filter(p=>attr(p,'stroke-width')==='4').map(p=>attr(p,'d')));eq(traces.map(t=>t.length),[1,2]);eq(traces[0][0],traces[1][0]);eq(traces[1].map(d=>{const p=points(d),minimum=Math.min(...p.map(q=>q[1]));return p.filter(q=>q[1]===minimum).map(q=>q[0]);}),[[50,115,180,245],[50,115,180,245]]);for(const s of[a,b])eq(all(s,'text').map(n=>n.text),['1','3','5','7']);break;
    }
    case 'print-registration-evidence': {
      eq(values(children(a,'path'),'d'),values(children(b,'path'),'d'));const [ga,gb]=[a,b].map(s=>children(s,'g')[0]);assert.equal(attr(ga,'transform'),undefined);assert.equal(attr(gb,'transform'),'translate(22 0)');eq(children(ga,'path')[0],children(gb,'path')[0]);const colorMax=Math.max(...points(attr(children(ga,'path')[0],'d')).map(p=>p[0])),outlineMax=Math.max(...points(attr(children(a,'path')[0],'d')).map(p=>p[0]));assert(colorMax<outlineMax&&outlineMax<colorMax+22);break;
    }
    case 'narrative-and-transmission-evidence': {
      eq(values(all(a,'path'),'d'),values(all(b,'path'),'d'));eq(values(all(a,'circle'),'cx'),['60','240']);eq(values(all(b,'circle'),'cx'),['60','240']);eq([a,b].map(s=>attr(children(s,'rect')[0],'x')),['24','204']);break;
    }
    case 'food-transfer-evidence': {
      const marks=[a,b].map(s=>all(s,'circle').filter(c=>attr(c,'fill')===ORANGE));eq(marks.map(m=>m.length),[4,4],'all four markers are conserved');assert(marks[0].every(c=>Number(attr(c,'cx'))<120));assert(marks[1].every(c=>Number(attr(c,'cx'))>200));break;
    }
    case 'narrative-information-evidence': {
      eq(values(all(a,'path'),'d'),values(all(b,'path'),'d'));for(const s of[a,b])eq(values(all(s,'circle'),'cx'),['75','230']);eq([a,b].map(s=>values(children(s,'path').slice(0,2),'stroke')),[[ORANGE,BLUE],[BLUE,ORANGE]]);break;
    }
    case 'equal-participation-rule-reading': {
      const counts=[a,b].map(s=>{const groups=children(s,'g');assert.equal(groups.length,4);eq(groups.map(g=>children(g,'text')[0].text),['1','2','3','4']);eq(groups.map(g=>attr(children(g,'rect')[0],'x')),['17','94','171','248']);const count=groups.filter(g=>attr(children(g,'rect')[0],'stroke-dasharray')===undefined).length;assert.equal(groups.flatMap(g=>children(g,'path')).filter(p=>attr(p,'stroke')===BLUE).length,count);return count;});eq(counts,[2,4]);break;
    }
    case 'direction-count-evidence': {
      const counts=[a,b].map(s=>{const groups=children(s,'g');assert.equal(groups.length,2);const actual=groups.map(g=>children(g,'circle').length);assert.equal(actual[0]+actual[1],8);eq(groups.map(g=>Number(children(g,'text')[0].text)),actual);eq(groups.map(g=>Number(attr(children(g,'rect')[0],'height'))),actual.map(n=>18*n));return actual;});eq(counts,[[4,4],[6,2]]);break;
    }
    case 'finding-explanation-evidence': {
      assert.equal(children(a,'circle').length,1);const c=children(b,'circle');assert.equal(c.length,3);assert(Number(attr(c[0],'r'))>Number(attr(c[1],'r')));eq(attr(c[1],'r'),attr(c[2],'r'));assert(Number(attr(c[0],'cx'))<Number(attr(c[1],'cx')));eq(attr(c[1],'cx'),attr(c[2],'cx'));assert.notEqual(attr(c[1],'cy'),attr(c[2],'cy'));assert(attr(a,'aria-label').includes('Befundsymbol'));assert(attr(b,'aria-label').includes('schematische Erklärung'));break;
    }
    case 'exhibition-route-evidence': {
      const expected=[[[45,185],[85,66],[235,107],[275,185]],[[45,185],[235,107],[85,66],[275,185]]];for(const[i,s]of[a,b].entries()){const c=children(s,'circle')[0];eq(['cx','cy'].map(k=>Number(attr(c,k))),[85,66]);const diamond=children(s,'path').find(p=>attr(p,'fill')===ORANGE),p=points(attr(diamond,'d'));eq([0,1].map(k=>(Math.min(...p.map(q=>q[k]))+Math.max(...p.map(q=>q[k])))/2),[235,107]);eq(children(s,'g').map(g=>points(attr(children(g,'path')[0],'d'))),[0,1,2].map(j=>expected[i].slice(j,j+2)));}break;
    }
    case 'invented-line-evidence': {
      eq(attr(children(a,'path')[0],'d'),attr(children(b,'path')[0],'d'),'original free line stays unchanged');eq([a,b].map(s=>children(s,'path').length),[1,2]);eq([a,b].map(s=>children(s,'circle').length),[0,1]);break;
    }
    case 'text-transmission-evidence': {
      const selected=[a,b].map(s=>{const groups=children(s,'g');assert.equal(groups.length,3);eq(groups.map(g=>attr(children(g,'circle')[0],'cx')),['60','160','260']);eq(groups.map(g=>children(g,'text')[0].text),['1','2','3']);return groups.flatMap((g,i)=>attr(children(g,'circle')[0],'stroke')===ORANGE?[i]:[]);});eq(selected,[[0],[2]]);for(const root of pair)eq(children(all(root,'ol')[0],'li').map(li=>Number(li.text.match(/\d+/)[0])),[11,12,15]);break;
    }
    default: assert.fail('No individual semantic law for '+kind);
  }
  return {kind,actualDOMStates:2,individualGeometryLaw:true};
}

export function rejectFourActualDOMCountercases(pairs) {
  const reject=(kind,change)=>{const altered=structuredClone(pairs[kind]);change(altered);assert.throws(()=>assertPeopleFigureSemanticPair(kind,altered),undefined,'the deliberately altered case must fail: '+kind);return kind;};
  return [
    reject('food-transfer-evidence',pair=>{const s=all(pair[1],'svg')[0];s.children.splice(s.children.findIndex(n=>n.tag==='circle'&&attr(n,'fill')===ORANGE),1);}),
    reject('direction-count-evidence',pair=>{const group=children(all(pair[1],'svg')[0],'g')[0];group.children.splice(group.children.findIndex(n=>n.tag==='circle'),1);}),
    reject('exhibition-route-evidence',pair=>{children(all(pair[1],'svg')[0],'circle')[0].attributes.cx='86';}),
    reject('invented-line-evidence',pair=>{children(all(pair[1],'svg')[0],'path')[0].attributes.d='M46 150L50 200';}),
  ];
}
