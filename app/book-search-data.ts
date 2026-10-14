import {useEffect,useState} from 'react';
import url from './book-search.json?url&no-inline';
import integrity from './book-search-integrity.json' with {type:'json'};
import {readBookBytes,verifiedBookJSON} from './book-part-validation.mjs';
import learningIndex from './book-learning-index.json' with {type:'json'};
let saved:Record<string,string>|null=null,pending:Promise<Record<string,string>>|null=null;
export function useBookSearch(active=true){
 const [data,setData]=useState(saved),[error,setError]=useState(false),[attempt,setAttempt]=useState(0);
 useEffect(()=>{if(!active)return;let live=true;if(!pending)pending=(async()=>{const response=await fetch(url,{signal:AbortSignal.timeout(12000)});const next=await verifiedBookJSON(await readBookBytes(response,integrity.bytes),integrity);if(!next||Array.isArray(next)||JSON.stringify(Object.keys(next))!==JSON.stringify(learningIndex)||!Object.values(next).every(s=>typeof s==='string'&&s.length<=100000&&!/[<>\u0000-\u0008]/u.test(s)))throw Error('Unvollständige Wortsuche');saved=next;return next;})().catch(e=>{pending=null;throw e;});(saved?Promise.resolve(saved):pending).then(next=>{if(live){setData(next);setError(false);}}).catch(()=>{if(live)setError(true);});return()=>{live=false;};},[attempt,active]);
 return {data,error,retry:()=>setAttempt(n=>n+1)};
}
