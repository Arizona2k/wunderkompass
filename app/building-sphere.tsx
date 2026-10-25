// Orthographic view of one unit sphere. Both coloured surface pieces use this
// same centre and radius; this is a geometry aid, not a roof reconstruction.
const radians=(degrees:number)=>degrees*Math.PI/180;
const point=(theta:number,phi:number)=>{
 const t=radians(theta),p=radians(phi),tilt=radians(20);
 const x=Math.sin(t)*Math.cos(p),y=Math.cos(t),z=Math.sin(t)*Math.sin(p);
 return{x:200+145*x,y:170+145*(-y*Math.cos(tilt)+z*Math.sin(tilt))};
};
const line=(points:{x:number;y:number}[])=>points.map((p,i)=>(i?'L':'M')+p.x.toFixed(2)+' '+p.y.toFixed(2)).join('');
const samples=(start:number,end:number)=>Array.from({length:25},(_,i)=>start+(end-start)*i/24);
const patch=(top:number,bottom:number,left:number,right:number)=>line([
 ...samples(left,right).map(p=>point(top,p)),...samples(top,bottom).map(t=>point(t,right)),
 ...samples(right,left).map(p=>point(bottom,p)),...samples(bottom,top).map(t=>point(t,left))
])+'Z';
export default function BuildingSphere(){
 return <figure className="building-sphere" data-building-sphere>
  <h4>Vom Kreis zur Kugelfläche</h4>
  <svg viewBox="0 0 400 340" role="img" aria-label="Eigene räumliche Geometriehilfe: ein kleineres oranges Flächenstück A und ein größeres grünes Flächenstück B liegen auf derselben Kugel. Keine Abbildung der wirklichen Dächer.">
   <circle cx="200" cy="170" r="145" fill="#edf4f2" stroke="#285463" strokeWidth="2"/>
   <g fill="none" stroke="#aac1bd" strokeWidth="1.5">
    {[35,65,95,125,155].map(theta=><path key={'latitude'+theta} d={line(samples(0,180).map(phi=>point(theta,phi)))}/>)}
    {[30,60,90,120,150].map(phi=><path key={'longitude'+phi} d={line(samples(0,180).map(theta=>point(theta,phi)))}/>)}
   </g>
   <path data-sphere-piece="A" d={patch(38,68,40,75)} fill="#edb77b" stroke="#814518" strokeWidth="3"/>
   <path data-sphere-piece="B" d={patch(82,128,90,145)} fill="#9fc7b3" stroke="#285b48" strokeWidth="3"/>
   {[{label:'A',theta:53,phi:57},{label:'B',theta:105,phi:118}].map(({label,theta,phi})=>{const p=point(theta,phi);return <text key={label} x={p.x} y={p.y+11} textAnchor="middle" fontSize="36" fontWeight="700" fill="#173e4a">{label}</text>;})}
  </svg>
  <figcaption>A ist kleiner, B ist größer. Beide gehören zur Oberfläche derselben Kugel. Unterschiedliche Flächengröße bedeutet hier keine andere Kugelgröße.</figcaption>
  <p className="small-note">Mit KI-Unterstützung erstellte eigene mathematische Zeichnung, keine Gebäudeansicht. Die Flächenstücke sind frei gewählt und zeigen weder die genaue Dachform noch Betonrippen, Tragfähigkeit oder Akustik des Opernhauses.</p>
 </figure>;
}
