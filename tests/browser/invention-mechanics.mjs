import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {inventionSourceView} from './invention-electrical.mjs';
const catalog=JSON.parse(await fs.readFile(new URL('../../app/world-catalog.json',import.meta.url),'utf8'));
export const mechanicsIds=['invention-refrigerator','invention-bicycle','invention-elevator','invention-seismograph','invention-3d-printing','invention-sewing-machine'];
export const mechanicsTopics=mechanicsIds.map(id=>{const topic=catalog.find(t=>t.id===id);assert.ok(topic,id);return topic;});
export async function mechanicsSourceView(page,options={}){const result=await inventionSourceView(page,{...options,topics:mechanicsTopics});assert.equal(result.length,6);return result;}
