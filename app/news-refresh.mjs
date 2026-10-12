/** One shared request, visible-page timers only, and bounded failure backoff.
 * Clock/timers are injectable so long-lived sessions are reproducibly tested. */
export function createNewsRefresh({load,onResult,onError,now=Date.now,isVisible=()=>true,isOnline=()=>true,setTimer=setTimeout,clearTimer=clearTimeout,intervalMs=15*60000,minGapMs=60000}){
 let active=false,inFlight=null,timer=null,lastAttempt=-Infinity,nextDue=0,failures=0;
 const cancel=()=>{if(timer!==null)clearTimer(timer);timer=null;};
 const schedule=()=>{cancel();if(active&&isVisible()&&isOnline()&&!inFlight)timer=setTimer(()=>{timer=null;void refresh();},Math.max(minGapMs-(now()-lastAttempt),nextDue-now(),0));};
 async function refresh(){
  if(!active||!isVisible()||!isOnline())return;
  if(inFlight)return inFlight;
  if(now()-lastAttempt<minGapMs){schedule();return;}
  cancel();lastAttempt=now();
  inFlight=(async()=>{
   try{const result=await load();failures=result.source==='network'?0:failures+1;onResult(result);}
   catch{failures++;onError();}
   finally{nextDue=now()+(failures?Math.min(intervalMs,minGapMs*2**Math.min(failures-1,4)):intervalMs);inFlight=null;schedule();}
  })();
  return inFlight;
 }
 return {start(){active=true;void refresh();},stop(){active=false;cancel();},wake(){cancel();void refresh();},refresh};
}
