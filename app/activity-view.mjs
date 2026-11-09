// Visibility of a redundant resume action only; never changes stored activity.
export function activityIsOpen(activity,{route,mode,gameFamily,gameId,placeId}={}){
 if(!activity||typeof activity.id!=='string'||!activity.id)return false;
 const id=activity.id;
 switch(activity.type){
  case 'journey':return route==='journeys/'+id||route?.startsWith('journeys/'+id+'/')===true;
  case 'lab':return route==='labs/'+id;
  case 'topic':return route==='world/topic/'+id;
  case 'route':return route==='world/route/'+id;
  case 'game':return mode==='games'&&!!activity.family&&gameFamily===activity.family&&gameId===id;
  case 'quiz':return mode==='quiz';
  case 'place':{
   if(placeId!==id)return false;
   if(mode==='globe')return true;
   // The exact selected article-map point is already available in its parent
   // article. A duplicate resume card appearing on Back would move the reader.
   // Keep the saved place unchanged and keep resume available everywhere else.
   const articlePoint=/^world-(.+)-(0|[1-9]\d*)$/.exec(id);
   return !!articlePoint&&route==='world/topic/'+articlePoint[1];
  }
  default:return false;
 }
}
