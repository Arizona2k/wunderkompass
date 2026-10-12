/** Old journey URLs resume the same zero-based chapter stored in schema 3.
 * New one-based chapter URLs never change a legacy chapter's identity. */
export function journeyRoute(route,journeys,saved={}){
 const [area,id,page,...extra]=route.split('/'),journey=journeys.find(j=>j.id===id);
 if(area!=='journeys'||!journey)return {journey:null,step:0,invalid:area==='journeys'&&Boolean(id)};
 const last=journey.steps.length;
 const remembered=Number.isInteger(saved[id])?Math.max(0,Math.min(last,saved[id])):0;
 if(page===undefined&&!extra.length)return {journey,step:remembered,invalid:false};
 const valid=!extra.length&&/^[1-9]\d*$/.test(page)&&Number(page)<=last+1;
 return {journey,step:valid?Number(page)-1:remembered,invalid:!valid};
}
export const chapterPath=(id,index)=>'journeys/'+id+'/'+(index+1);
