import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {newsRemovalComplete,NEWS_REMOVAL_WIDTHS,REMOVED_NEWS_ROUTES} from '../scripts/news-removal-evidence.mjs';
import {REQUIRED_SUITES} from '../scripts/quality-evidence.mjs';
const proof=()=>({noNewsRequests:true,observed:NEWS_REMOVAL_WIDTHS.flatMap(width=>[false,true].map(large=>({width,large,home:true,search:true,updates:true,routes:[...REMOVED_NEWS_ROUTES],reload:true,passPreserved:true})))});
test('news-removal acceptance rejects missing width/font/route/search/reload/pass or network evidence',()=>{
 assert.equal(newsRemovalComplete(proof()),true);assert.equal(newsRemovalComplete(null),false);
 for(const mutate of [p=>p.observed.pop(),p=>{p.observed[0]=p.observed[1];},p=>p.observed[0].routes.pop(),p=>{p.observed[0].routes[1]=p.observed[0].routes[0];},p=>{p.noNewsRequests=false;},p=>{p.observed[0].search=false;},p=>{p.observed[0].updates=false;},p=>{p.observed[0].passPreserved=false;},p=>{p.observed[0].reload=false;}]){const p=proof();mutate(p);assert.equal(newsRemovalComplete(p),false);}
 assert(REQUIRED_SUITES.includes('no-news'));assert(!REQUIRED_SUITES.includes('news-feed'));
});
test('removed news implementation, automatic runtime and exports are absent; remaining entry points do not import them',()=>{
 for(const p of ['app/news-preview.tsx','app/news-view.tsx','app/news-feed.ts','app/news-content.json','scripts/news/runtime.mjs','content/news-runtime.json','content/news-source-policy.json','exports/content/children-news.json','exports/content/news-source-policy.json'])assert.equal(fs.existsSync(p),false,p);
 for(const p of ['app/earth-explorer.tsx','app/global-search.tsx','app/globals.css'])assert.doesNotMatch(fs.readFileSync(p,'utf8'),/useNewsFeed|NewsView|NewsPreview|news\.css|onNews=/);
});
