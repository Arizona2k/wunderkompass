export function validateBookData(data){
 const text=value=>typeof value==='string'&&value.trim().length>0&&value.length<=20000&&!/[<>\u0000-\u0008]/u.test(value);
 if(data?.schemaVersion!==1||!Array.isArray(data.words)||!Array.isArray(data.why)||data.words.length<1||data.words.length>10000||data.why.length<1||data.why.length>10000)throw Error('Ungültiges Wissensbuch');
 for(const [entries,size] of [[data.words,3],[data.why,2]]){
  const keys=new Set();for(const item of entries){if(!Array.isArray(item)||item.length!==size||!item.every(text)||keys.has(item[0]))throw Error('Beschädigter oder doppelter Wissenseintrag');keys.add(item[0]);}
 }
 return data;
}
