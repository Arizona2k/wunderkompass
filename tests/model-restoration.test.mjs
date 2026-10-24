import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import React from 'react';import * as jsx from 'react/jsx-runtime';import {renderToStaticMarkup} from 'react-dom/server';import ts from 'typescript';import * as gameState from '../app/game-state.ts';
// Exercise the real hook initializer through React, so a correct but unused
// normalization helper cannot hide the original -34 -> 0 / 2.75 -> 2 failure.
const source=fs.readFileSync(new URL('../app/saved-games.tsx',import.meta.url),'utf8'),code=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,module={exports:{}};
new Function('require','module','exports',code)(name=>{if(name==='react')return React;if(name==='react/jsx-runtime')return jsx;if(name==='./game-state')return gameState;throw Error('Unexpected saved-game dependency '+name);},module,module.exports);
function initial({id='topic:model-probe',key='value',value,fallback=52,limits,counter=false,items}){
 function Probe(){const [restored]=counter?module.exports.useSavedGame(key,fallback):module.exports.useSavedModel(key,fallback,limits);return React.createElement('output',null,String(restored));}
 return renderToStaticMarkup(React.createElement(module.exports.SavedGame,{id,family:'world',sessions:{[id]:{[key]:value,...(items?{items}:{})}},onSave:()=>{}},React.createElement(Probe)));
}
test('real saved-model initializer preserves declared southern latitude and fractional domains in every context',()=>{
 for(const id of ['lab:seasons','topic:model-probe','classic-model-probe']){
  assert.equal(initial({id,key:'latitude',value:-34,limits:{min:-80,max:80}}),'<output>-34</output>');
  assert.equal(initial({id,value:-2.75,fallback:1,limits:{min:-5,max:5,integer:false}}),'<output>-2.75</output>');
  assert.equal(initial({id,value:2.75,fallback:1,limits:{min:-5,max:5,integer:false}}),'<output>2.75</output>');
 }
});
test('saved model domains still reject malformed values, bound ranges and normalize declared discrete choices',()=>{
 for(const value of [null,'-34',{},NaN,Infinity])assert.equal(initial({value,limits:{min:-80,max:80}}),'<output>52</output>');
 for(const [value,result]of [[-200,-80],[200,80],[-34.6,-35]])assert.equal(initial({value,limits:{min:-80,max:80}}),'<output>'+result+'</output>');
 assert.equal(initial({value:'persons',fallback:'metres',limits:['metres','persons']}),'<output>persons</output>');
 assert.equal(initial({value:'unknown',fallback:'metres',limits:['metres','persons']}),'<output>metres</output>');
 assert.equal(initial({value:false,fallback:true}),'<output>false</output>');
});
test('generic saved-game indices and scores retain their existing nonnegative integer and item bounds',()=>{
 assert.equal(initial({counter:true,value:-34,fallback:0}),'<output>0</output>');
 assert.equal(initial({counter:true,value:2.75,fallback:0}),'<output>2</output>');
 assert.equal(initial({counter:true,key:'index',value:99,fallback:0,items:['a','b','c']}),'<output>2</output>');
 assert.equal(initial({counter:true,key:'score',value:99,fallback:0,items:['a','b','c']}),'<output>3</output>');
});
