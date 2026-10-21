import data from './world-game-food-data.json' with {type:'json'};
const groups=new Map(data.entries.map(row=>[row.id,row.comparison]));
// Exclusive complete descriptions, not possibly overlapping individual foods.
// Life stages and mixed diets need their own comparison, not a word regex.
/** @param {string} id @returns {string[]} */
export function foodDistractors(id){
 const group=groups.get(id);if(!group)throw Error('Food comparison not reviewed: '+id);
 if(group==='stages')return['In allen Lebensphasen ausschließlich Nektar','In allen Lebensphasen ausschließlich Seidenpflanzen'];
 if(group==='mixed')return id==='animal-eastern-clown-anemonefish'?['Ausschließlich Algen','Ausschließlich tierische Nahrung']:['Ausschließlich pflanzliche Nahrung','Ausschließlich tierische Nahrung'];
 if(group==='plant')return['Ausschließlich Robben','Ausschließlich Fische und Tintenfische'];
 if(group==='animal')return['Ausschließlich Blütennektar','Ausschließlich Blätter und Gräser'];
 throw Error('Invalid reviewed food comparison: '+id);
}
