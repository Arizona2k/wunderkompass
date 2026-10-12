import test from 'node:test';import assert from 'node:assert/strict';
import {createNewsRefresh} from '../app/news-refresh.mjs';
function fixture(load=async()=>({source:'network'})){
 let time=0,visible=true,online=true,count=0,id=0;const timers=new Map(),results=[],errors=[];
 const controller=createNewsRefresh({load:()=>{count++;return load();},onResult:r=>results.push(r),onError:()=>errors.push('failure'),now:()=>time,isVisible:()=>visible,isOnline:()=>online,setTimer:(fn,ms)=>{timers.set(++id,{fn,at:time+ms});return id;},clearTimer:id=>timers.delete(id)});
 return {controller,timers,results,errors,get count(){return count;},set visible(value){visible=value;},set online(value){online=value;},async advance(ms){time+=ms;for(const [id,timer] of [...timers])if(timer.at<=time){timers.delete(id);timer.fn();}await this.flush();},async flush(){await new Promise(resolve=>setImmediate(resolve));}};
}
test('one shared visible refresh every fifteen minutes; no extra requests for repeated returns or concurrent consumers',async()=>{
 const f=fixture();f.controller.start();await f.flush();assert.equal(f.count,1);f.controller.wake();f.controller.start();await f.advance(59999);assert.equal(f.count,1);await f.advance(1);assert.equal(f.count,1,'return cooldown does not turn a healthy feed into minute polling');await f.advance(14*60000);assert.equal(f.count,2);assert.equal(f.timers.size,1);
 f.controller.stop();assert.equal(f.timers.size,0);await f.advance(30*60000);assert.equal(f.count,2);
});
test('visibility and connection returns refresh after the minimum gap; hidden/offline sessions have no timers',async()=>{
 const f=fixture();f.controller.start();await f.flush();f.visible=false;f.controller.wake();assert.equal(f.timers.size,0);await f.advance(20*60000);assert.equal(f.count,1);f.visible=true;f.controller.wake();await f.flush();assert.equal(f.count,2);
 f.online=false;f.controller.wake();assert.equal(f.timers.size,0);await f.advance(20*60000);assert.equal(f.count,2);f.online=true;f.controller.wake();await f.flush();assert.equal(f.count,3);
});
test('temporary load/import failures retry with bounded backoff and a later valid edition returns to the normal interval',async()=>{
 let attempts=0;const f=fixture(async()=>{if(++attempts===1)throw Error('Import outage');if(attempts===2)return {source:'cache',warning:'Rejected'};return {source:'network'};});
 f.controller.start();await f.flush();assert.equal(f.errors.length,1);await f.advance(60000);assert.equal(f.count,2);await f.advance(60000);assert.equal(f.count,2);await f.advance(60000);assert.equal(f.count,3);assert.equal(f.results.at(-1).source,'network');await f.advance(60000);assert.equal(f.count,3);await f.advance(14*60000);assert.equal(f.count,4);
});
test('in-flight requests deduplicate returns and StrictMode restarts; stopped controllers cannot schedule more work',async()=>{
 let finish;const f=fixture(()=>new Promise(resolve=>{finish=resolve;}));f.controller.start();f.controller.wake();f.controller.stop();f.controller.start();await f.advance(20*60000);f.controller.wake();assert.equal(f.count,1);f.controller.stop();finish({source:'network'});await f.flush();assert.equal(f.timers.size,0);assert.equal(f.results.length,1);
});
