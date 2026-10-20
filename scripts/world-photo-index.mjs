import fs from 'node:fs';
import {createHash} from 'node:crypto';

export const corePhotoIds=['african-elephant','giza-pyramids','marie-curie','golden-gate-bridge','jaguar','honey-bee'];
export function worldPhotoIndex(check=false){
 const bytes=fs.readFileSync('app/world-photos.json'),photos=JSON.parse(bytes);
 const generated={
  'world-photo-core.json':Object.fromEntries(corePhotoIds.map(id=>{if(!photos[id]||photos[id].id!==id)throw Error('Missing immediate photo credit '+id);return [id,photos[id]];})),
  'world-photo-ids.json':Object.keys(photos),
  'world-photo-integrity.json':{bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')},
 };
 for(const[name,value]of Object.entries(generated)){const content=JSON.stringify(value,null,2)+'\n',file='app/'+name;if(check){if(fs.readFileSync(file,'utf8')!==content)throw Error('Stale photo metadata projection '+file);}else fs.writeFileSync(file,content);}
}
