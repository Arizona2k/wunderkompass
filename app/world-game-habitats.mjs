import data from './world-game-habitat-data.json' with {type:'json'};
const groups=new Map(data.entries.map(row=>[row.id,row.comparison]));
const DRY='Trockene Sandwüste fern von Gewässern',CANOPY='Baumkronen im tropischen Regenwald',REEF='Unter Wasser in einem warmen Korallenriff',ICE='Meereis der Antarktis';
// Compare habitats at the same question scope. Literal inequality cannot make
// Arctic coasts and the Arctic incompatible. Explicit groups also cover mixed
// water/land habitats; a future animal needs an individual review before use.
/** @param {string} id @returns {string[]} */
export function habitatDistractors(id){
 const group=groups.get(id);if(!group)throw Error('Habitat comparison not reviewed: '+id);
 if(group==='water')return[DRY,CANOPY];if(group==='water-edge')return[DRY,REEF];if(group==='land')return[REEF,ICE];throw Error('Invalid reviewed habitat group: '+id);
}
// Narrow, documented interpretation of already selected older answers. Keep
// original saved strings and IDs; never accept arbitrary fuzzy synonyms.
/** @type {Record<string,readonly string[]>} */
const compatibleLegacy={
 'animal-walrus':['Arktis'],
 'animal-orca':['Arktis','Antarktis'],
 'animal-blue-whale':['Antarktis']
};
/** @param {string} game @param {{id:string,answers:string[],correct:number}} item @param {unknown} answer */
export function worldGameAnswerCorrect(game,item,answer){
 if(answer===item.answers[item.correct])return true;
 return game==='habitats'&&typeof answer==='string'&&compatibleLegacy[item.id]?.includes(answer)===true;
}
