import DATA from '../app/animal-inquiries.json' with {type:'json'};

export function animalCasesComplete(cases,widths,states=['normal','large']){
 if(!Array.isArray(cases)||cases.length!==DATA.entries.length*widths.length*states.length||new Set(cases.map(c=>c.id+':'+c.width+':'+c.state)).size!==cases.length)return false;
 return DATA.entries.every(e=>widths.every(width=>states.every(state=>cases.some(c=>c.id===e.id&&c.width===width&&c.state===state&&c.bothEvidence===true&&c.wrongAndCorrect===true&&c.keyboard===true&&c.geometry===true&&Array.isArray(c.levels)&&c.levels.length===3&&new Set(c.levels).size===3&&[0,1,2].every(level=>c.levels.includes(level))))));
}
export function animalCoverageComplete(proof,widths){return animalCasesComplete(proof?.observed,widths)&&['oldSessionsPreserved','largeText','axe','navigation'].every(key=>proof?.[key]===true)&&proof.independentAcceptance===false&&Number.isFinite(proof.seconds)&&proof.seconds>0;}
export function animalNativeComplete(proof){return proof?.percent===200&&proof.cssWidth===640&&proof.scale===2&&proof.screenshot?.pixelWidth===1280&&proof.screenshot?.sampledColors>1&&animalCasesComplete(proof.observed,[640],['large']);}
export function animalOfflineComplete(proof){return proof?.coldRestart===true&&animalCasesComplete(proof.observed,[1280],['offline']);}

export function solarCasesComplete(cases,widths,states=['normal','large']){
 const planets=['Merkur','Venus','Erde','Mars','Jupiter','Saturn','Uranus','Neptun'],modes=['diameters','distances'];
 if(!Array.isArray(cases)||cases.length!==planets.length*modes.length*widths.length*states.length||new Set(cases.map(c=>[c.planet,c.mode,c.width,c.state].join(':'))).size!==cases.length)return false;
 return planets.every(planet=>modes.every(mode=>widths.every(width=>states.every(state=>cases.some(c=>c.planet===planet&&c.mode===mode&&c.width===width&&c.state===state&&['readableHTML','geometry','originalScale','keyboard'].every(k=>c[k]===true))))));
}
export const solarCoverageComplete=(proof,widths)=>solarCasesComplete(proof?.observed,widths)&&proof.axe===true&&proof.clippingGuard===true&&Number.isFinite(proof.seconds)&&proof.seconds>0;
export const solarNativeComplete=proof=>proof?.percent===200&&proof.cssWidth===640&&proof.scale===2&&Array.isArray(proof.captures)&&proof.captures.length===2&&proof.captures.every(c=>c.cssWidth===640&&c.scale===2&&c.pixelWidth===1280&&c.sampledColors>1)&&solarCasesComplete(proof.observed,[640],['large']);

export const solarOfflineComplete=proof=>proof?.coldRestart===true&&solarCasesComplete(proof.observed,[1280],['offline']);
