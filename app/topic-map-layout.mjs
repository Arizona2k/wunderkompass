import {geoEqualEarth} from 'd3-geo';

// Match the separate contextProjection in the existing media generator.
const projection=geoEqualEarth().fitExtent([[48,48],[752,370]],{type:'Sphere'});
/**
 * @typedef {{x:number,y:number,index:number,label:string}} ProjectedLocation
 * @param {{lat:number,lon:number,label:string}[]} locations
 * @returns {{x:number,y:number,members:ProjectedLocation[],label:string}[]}
 */
export function topicMapGroups(locations){
 const points=locations.map((location,index)=>{
  if(!Number.isFinite(location.lat)||!Number.isFinite(location.lon)||Math.abs(location.lat)>90||Math.abs(location.lon)>180)throw new RangeError('Invalid map location');
  const [x,y]=projection([location.lon,location.lat]);return {x,y,index,label:location.label};
 });
 const parents=points.map((_p,i)=>i),find=i=>parents[i]===i?i:parents[i]=find(parents[i]);
 for(let i=0;i<points.length;i++)for(let j=0;j<i;j++)if(Math.hypot(points[i].x-points[j].x,points[i].y-points[j].y)<70)parents[find(i)]=find(j);
 /** @type {Map<number,ProjectedLocation[]>} */
 const groups=new Map();
 for(const point of points){const key=find(point.index);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(point);}
 return [...groups.values()].map(members=>({x:members.reduce((sum,p)=>sum+p.x,0)/members.length,y:members.reduce((sum,p)=>sum+p.y,0)/members.length,members,label:members.map(p=>p.index+1).join('&')}));
}
