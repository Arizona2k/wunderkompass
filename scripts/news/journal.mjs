import {readFile,readdir,mkdir,copyFile,rm,lstat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {verifyPublication} from './verify-publication.mjs';

/** Genuine signed content activity in the isolated news repository, including
 * honest no-new status. Never a fake keep-alive or an application code commit.
 * GitHub's token is repository-scoped; path enforcement is an extra code guard.
 */
export async function retainSignedJournal({root=process.cwd(),directory,runtime,policy,topicIds,now=new Date(),repository=process.env.GITHUB_REPOSITORY,push=false}){
 if(runtime.mode!=='pages'||!runtime.allowedRepository||repository!==runtime.allowedRepository||repository==='Arizona2k/wunderkompass'||runtime.allowedBranch!=='news-content')throw Error('Keine freigegebene separate News-Reservierung');
 const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
 const origin=git('remote','get-url','origin');if(!['https://github.com/'+repository,'https://github.com/'+repository+'.git','git@github.com:'+repository+'.git'].includes(origin))throw Error('News-Journal hat keinen passenden isolierten Git-Ursprung');
 if(git('branch','--show-current')!==runtime.allowedBranch||git('status','--porcelain','--untracked-files=normal'))throw Error('News-Journal braucht einen sauberen isolierten Branch');
 const validation={keys:runtime.keys,policy,topicIds,now},proof=await verifyPublication(directory,validation),target=path.join(root,'news-data');
 const names=['latest.json','history.json',...(await readdir(path.join(directory,'versions'))).map(f=>'versions/'+f)];
 // Before replacing an existing tree, reject symlinks and unexpected content.
 let previous;try{previous=await lstat(target);}catch(error){if(error.code!=='ENOENT')throw error;}
 if(previous){if(previous.isSymbolicLink()||!previous.isDirectory())throw Error('News-Journal ist kein sicherer Datenordner');await verifyPublication(target,validation);}
 await rm(target,{recursive:true,force:true});await mkdir(path.join(target,'versions'),{recursive:true});
 for(const name of names)await copyFile(path.join(directory,name),path.join(target,name));
 await verifyPublication(target,validation);git('add','--','news-data');
 const changed=git('diff','--cached','--name-only').split('\n').filter(Boolean);
 if(changed.some(f=>!/^news-data\/(?:latest\.json|history\.json|versions\/\d+-[a-f0-9]{64}\.json)$/.test(f)))throw Error('News-Journal würde fremde Dateien ändern');
 if(!changed.length)return {status:'unchanged',proof};
 const latest=JSON.parse(await readFile(path.join(target,'latest.json'),'utf8'));
 git('-c','user.name=WunderKompass News','-c','user.email=41898282+github-actions[bot]@users.noreply.github.com','commit','-m',`news: retain signed status ${latest.day} sequence ${latest.sequence}`);
 if(push)git('push','origin','HEAD:refs/heads/news-content');
 return {status:'retained',proof,commit:git('rev-parse','HEAD'),files:changed};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const json=async file=>JSON.parse(await readFile(new URL('../../'+file,import.meta.url),'utf8'));
 console.log(JSON.stringify(await retainSignedJournal({directory:path.resolve('work/news-runtime/publication'),runtime:await json('content/news-runtime.json'),policy:await json('content/news-source-policy.json'),topicIds:(await json('app/world-index.json')).map(t=>t.id),push:true})));
}
