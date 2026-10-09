import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
registerHooks({resolve(specifier,context,next){
 if(specifier.startsWith('.')&&!/\.[a-z]+$/.test(specifier)){
  for(const extension of ['.ts','.tsx']){const candidate=new URL(specifier+extension,context.parentURL);if(existsSync(fileURLToPath(candidate)))return next(candidate.href,context);}
 }
 return next(specifier,context);
}});
