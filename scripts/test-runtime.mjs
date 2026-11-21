import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
registerHooks({resolve(specifier,context,next){
 if(specifier.startsWith('.')&&!/\.[a-z]+$/.test(specifier)){
  for(const extension of ['.ts','.tsx']){const candidate=new URL(specifier+extension,context.parentURL);if(existsSync(fileURLToPath(candidate)))return next(candidate.href,context);}
 }
 return next(specifier,context);
},
// Vite importiert JSON ohne `with {type:'json'}`. Damit Tests dieselben App-Dateien laden können,
// ergänzt dieser Hook das Attribut für .json-Dateien.
load(url,context,next){
 if(url.endsWith('.json'))return next(url,{...context,importAttributes:{...context.importAttributes,type:'json'}});
 return next(url,context);
}});
