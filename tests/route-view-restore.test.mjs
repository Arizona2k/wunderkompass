import test from 'node:test';
import assert from 'node:assert/strict';
import {restoreRouteView,scheduleRouteRestore} from '../app/hash-route.ts';

// Rectangles include the actual200%-zoom640x475 failure: a503px opener
// cannot fit completely. Revealing it again moved the reading position14px.
function observe(rect,height=475,focusKey='small-control'){
 const originals=new Map(['window','document','history','innerHeight'].map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
 const calls={scroll:[],focus:[],reveal:[]};
 const opener={dataset:{routeFocus:focusKey},getClientRects:()=>[rect],getBoundingClientRect:()=>rect,focus:options=>calls.focus.push(options),scrollIntoView:options=>calls.reveal.push(options)};
 try{
  Object.defineProperty(globalThis,'window',{configurable:true,value:{scrollTo:options=>calls.scroll.push(options)}});
  Object.defineProperty(globalThis,'document',{configurable:true,value:{querySelectorAll:selector=>selector==='[data-route-focus]'?[opener]:[]}});
  Object.defineProperty(globalThis,'history',{configurable:true,value:{state:{wunderScroll:670.5,wunderFocus:opener.dataset.routeFocus,wunderOpen:[]}}});
  Object.defineProperty(globalThis,'innerHeight',{configurable:true,value:height});
  restoreRouteView('world/animals/page/2');
  assert.deepEqual(calls.scroll,[{top:670.5,behavior:'instant'}]);assert.deepEqual(calls.focus,[{preventScroll:true}]);
  return calls.reveal;
 }finally{
  for(const[key,descriptor]of originals)if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];
 }
}
test('already visible oversized openers keep the saved reading position while an entirely offscreen oversized opener is revealed',()=>{
 assert.deepEqual(observe({top:0.1484375,bottom:503.109375,height:502.9609375}),[],'actual503px card already intersects the475px viewport');
 assert.deepEqual(observe({top:-60,bottom:640,height:700}),[],'a viewport-spanning tall card does not need impossible full fitting');
 assert.deepEqual(observe({top:600,bottom:1100,height:500}),[{block:'center',behavior:'instant'}]);
 assert.deepEqual(observe({top:-700,bottom:-200,height:500}),[{block:'center',behavior:'instant'}]);
});
test('fitting opener visibility and existing eight-pixel safety margin remain unchanged',()=>{
 for(const rect of [{top:-20,bottom:40,height:60},{top:430,bottom:490,height:60},{top:4,bottom:64,height:60}])assert.deepEqual(observe(rect),[{block:'center',behavior:'instant'}]);
 for(const rect of [{top:100,bottom:160,height:60},{top:8,bottom:68,height:60}])assert.deepEqual(observe(rect),[]);
});
test('fully visible world reading cards keep the saved position at viewport edges while clipped cards remain revealed',()=>{
 const card='world-topic-animal-orca';
 assert.deepEqual(observe({top:476.96875,bottom:949.546875,height:472.578125},950,card),[],'actual trusted WebKit182px departure card already fits fully; recentering would move239px');
 for(const rect of[{top:0,bottom:300,height:300},{top:175,bottom:475,height:300}])assert.deepEqual(observe(rect,475,card),[]);
 for(const rect of[{top:-.1,bottom:299.9,height:300},{top:175.1,bottom:475.1,height:300}])assert.deepEqual(observe(rect,475,card),[{block:'center',behavior:'instant'}],'reading card still requires complete visibility when it fits');
});

function scheduled(observe,{oversized=true}={}){
 const originals=new Map(['window','document','history','innerHeight','requestAnimationFrame','cancelAnimationFrame'].map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)])),frames=new Map(),listeners=new Map(),calls=[];let id=0;
 try{
  const opener={dataset:{routeFocus:'world-topic-animal-orca'},getClientRects:()=>[{}],getBoundingClientRect:()=>({height:oversized?503:60})};
  const globals={window:{location:{hash:'#world/animals/page/2'},scrollTo:value=>calls.push(value),addEventListener:(type,fn)=>listeners.set(type,fn),removeEventListener:(type,fn)=>{if(listeners.get(type)===fn)listeners.delete(type);}},document:{querySelectorAll:()=>[opener]},history:{state:{wunderScroll:560.5,wunderFocus:'world-topic-animal-orca'}},innerHeight:475,requestAnimationFrame:fn=>{frames.set(++id,fn);return id;},cancelAnimationFrame:id=>frames.delete(id)};
  for(const[key,value]of Object.entries(globals))Object.defineProperty(globalThis,key,{configurable:true,value});
  const cancel=scheduleRouteRestore('world/animals/page/2',false),frame=()=>{const pending=[...frames];frames.clear();for(const[,fn]of pending)fn();};
  observe({calls,listeners,frames,frame,cancel});
 }finally{for(const[key,descriptor]of originals)if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}
}
test('deferred return restores after the following layout frame, not the intermediate return layout',()=>scheduled(({calls,frame,frames,listeners})=>{
 assert.equal(calls.length,0);frame();assert.equal(calls.length,0,'the first frame can still have the intermediate return layout');assert.equal(frames.size,1);
 frame();assert.deepEqual(calls,[{top:560.5,behavior:'instant'}]);assert.equal(listeners.size,0);assert.equal(frames.size,0);
}));
test('trusted interaction before either deferred frame cancels return without stealing the new position',()=>{
 for(const type of ['keydown','pointerdown','focusin'])for(const afterFirst of [false,true])scheduled(({calls,frame,listeners})=>{
  if(afterFirst)frame();listeners.get(type)?.({isTrusted:true});frame();frame();assert.deepEqual(calls,[],type+' remains protected between frames');assert.equal(listeners.size,0);
 });
});
test('explicit cancellation and a changed route prevent a delayed old restore',()=>{
 scheduled(({calls,frame,cancel})=>{frame();cancel();frame();assert.deepEqual(calls,[]);});
 scheduled(({calls,frame})=>{frame();window.location.hash='#book';frame();assert.deepEqual(calls,[]);});
});
test('fitting controls retain the original single-frame schedule',()=>scheduled(({calls,frame,frames,listeners})=>{
 frame();assert.deepEqual(calls,[{top:560.5,behavior:'instant'}]);assert.equal(frames.size,0);assert.equal(listeners.size,0);
},{oversized:false}));
