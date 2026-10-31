import assert from 'node:assert/strict';
export async function measureMitoContour(figure){
 return figure.locator('.cell-process-fold').evaluate(inner=>{
  const sample=(p,n)=>{const length=p.getTotalLength();return Array.from({length:n+1},(_,i)=>{const point=p.getPointAtLength(length*i/n);return{x:point.x,y:point.y};});};
  const points=sample(inner,320),dna=sample(inner.ownerSVGElement.querySelector('.cell-process-dna'),80),cross=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);let crossings=0;const firstCrossings=[];
  for(let i=0;i<320;i++)for(let j=i+2;j<320;j++){
   if(i===0&&j===319)continue;const a=points[i],b=points[i+1],c=points[j],d=points[j+1];
   if(cross(a,b,c)*cross(a,b,d)<-1e-9&&cross(c,d,a)*cross(c,d,b)<-1e-9){crossings++;if(firstCrossings.length<8)firstCrossings.push({firstSegment:i,secondSegment:j});}
  }
  const inside=point=>{let yes=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a.y>point.y)!==(b.y>point.y)&&point.x<(b.x-a.x)*(point.y-a.y)/(b.y-a.y)+a.x)yes=!yes;}return yes;};
  const distance=(p,a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);};
  return{actualPath:inner.getAttribute('d'),actualSampledSegments:320,selfCrossings:crossings,firstCrossings,allDNASymbolPointsInsideInnerContour:dna.every(inside),minimumDNASymbolToInnerContourGap:Math.min(...dna.flatMap(p=>points.slice(0,-1).map((a,i)=>distance(p,a,points[i+1])))),allInnerContourPointsInsideOuterEllipse:points.every(p=>((p.x-140)/78)**2+((p.y-91)/48)**2<1)};
 });
}
export async function assertMitoContour(figure){
 const geometry=await measureMitoContour(figure);assert.equal(geometry.selfCrossings,0,'own inner membrane contour must not self-cross');assert.equal(geometry.allDNASymbolPointsInsideInnerContour,true,'own DNA symbol belongs inside the depicted inner contour');assert(geometry.minimumDNASymbolToInnerContourGap>2,'keep the two drawn symbols distinguishable at their actual stroke widths');assert.equal(geometry.allInnerContourPointsInsideOuterEllipse,true);return geometry;
}
