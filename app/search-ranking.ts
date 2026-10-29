export const foldSearch=(s:string)=>s.replace(/[\u00ad\u200b-\u200d\u2060\ufeff]/g,'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('de').replace(/ß/g,'ss').replace(/[_\u2010-\u2015-]+/g,' ').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
function near(a:string,b:string){if(Math.abs(a.length-b.length)>1)return false;const row=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let last=row[0];row[0]=i;for(let j=1;j<=b.length;j++){const old=row[j];row[j]=Math.min(old+1,row[j-1]+1,last+(a[i-1]===b[j-1]?0:1));last=old;}}return row[b.length]<=1;}
export type SearchDocument={name:string;preview:string;keywords:string;aliases:string[];tokens:string[]};
export function prepareSearchDocument(label:string,preview='',keywords=''):SearchDocument{const folded=foldSearch(keywords);return{name:foldSearch(label),preview:foldSearch(preview),keywords:folded,aliases:folded.split(/\s+/),tokens:words(foldSearch(label+' '+preview+' '+keywords))};}
// The query is already folded once per input change; documents once per catalog
// change. Existing phrase scores precede a conservative all-meaningful-words
// fallback across that same canonical document, never an OR recommendation.
const questionWords=new Set(['warum','wieso','weshalb','wie','was','wo','wann','ist','sind','ein','eine','einen','einem','einer','der','die','das','den','dem','des','und','oder','im','in','am','an','auf','zu','zum','zur','mit','von','fur','entsteht','entstehen','kann','konnen']);
const words=(s:string)=>s.match(/[\p{L}\p{N}]+/gu)??[];
export function preparedSearchScore(q:string,doc:SearchDocument){if(!q)return 1;if(doc.name===q)return 6;if(doc.aliases.includes(q))return 5;if(doc.name.includes(q))return 4;if(doc.keywords.includes(q))return 3;if(doc.preview.includes(q))return 2;if(q.length>=4&&[...doc.name.split(/\s+/),...doc.aliases].some(w=>w.length>=4&&near(w,q)))return 1;
 const terms=words(q).filter(w=>!questionWords.has(w)),haystack=doc.tokens;
 return terms.length&&terms.every(term=>haystack.some(word=>word===term||(term.length>=3&&word.startsWith(term))||(term.length>=4&&word.includes(term))||(term.length>=4&&word.length>=4&&near(word,term))))?1:0;
}
export function searchScore(term:string,label:string,preview='',keywords=''){return preparedSearchScore(foldSearch(term),prepareSearchDocument(label,preview,keywords));}
