// Own qualitative teaching cases, never measurements or personal genetic data.
export const GENE_OUTPUTS = [
 {key:'protein',label:'Gen für ein Protein',rnaRole:'RNA trägt hier Information für die Proteinherstellung.',protein:true},
 {key:'rna',label:'Gen für funktionsfähige RNA',rnaRole:'Die RNA erfüllt hier selbst eine biologische Aufgabe.',protein:false},
] as const;
export const CHROMOSOME_STAGES = [
 {key:'before',label:'Vor dem Kopieren',chromosomes:1,chromatids:1,dnaMolecules:1,positions:[160],connected:false,explanation:'Ein ausgewähltes Chromosom besteht vor dem Kopieren aus einem Chromatid mit einem DNA-Molekül.'},
 {key:'copied',label:'Nach dem Kopieren',chromosomes:1,chromatids:2,dnaMolecules:2,positions:[139,181],connected:true,explanation:'Zwei Schwesterchromatiden bleiben verbunden. Sie bilden zusammen weiterhin ein Chromosom; die DNA wurde kopiert.'},
 {key:'separated',label:'Nach der Trennung',chromosomes:2,chromatids:2,dnaMolecules:2,positions:[86,234],connected:false,explanation:'Nach der Trennung gilt jedes frühere Schwesterchromatid als eigenes Tochterchromosom. Kopieren und Trennen sind verschiedene Schritte.'},
] as const;
export const NUCLEOTIDE_TYPES = [
 {key:'DNA',sugar:'Desoxyribose',bases:['A','T','C','G']},
 {key:'RNA',sugar:'Ribose',bases:['A','U','C','G']},
] as const;
export const RNA_ROLES = [
 {key:'mRNA',label:'Nachricht',description:'mRNA trägt Information, die bei der Herstellung eines Proteins gelesen werden kann.'},
 {key:'rRNA',label:'Teil des Ribosoms',description:'rRNA gehört zum Aufbau und zur Arbeit des Ribosoms, an dem Proteine hergestellt werden.'},
 {key:'tRNA',label:'Aminosäuren zuordnen',description:'tRNA bringt passende Aminosäuren in den Zusammenhang der Proteinherstellung.'},
] as const;
export function selectCase<T>(cases:readonly T[],index:number):T{
 if(!Number.isInteger(index)||index<0||index>=cases.length)throw new TypeError('Unbekanntes Gedankenbeispiel.');
 return cases[index];
}
export function inventedSequenceChange(changed:boolean){
 if(typeof changed!=='boolean')throw new TypeError('Der Vergleich benötigt eine eindeutige Auswahl.');
 const before='ATCG',after=changed?'ATGG':before;
 return{before,after,differences:[...before].flatMap((base,index)=>base===after[index]?[]:[index]),biologicalEffect:'Aus diesem erfundenen Vier-Zeichen-Beispiel nicht bestimmbar.'};
}
export function qualitativeReaction(withEnzyme:boolean){
 if(typeof withEnzyme!=='boolean')throw new TypeError('Unbekannter Reaktionsweg.');
 // SVG y grows downwards. Both paths have exactly the same endpoints.
 const start={x:38,y:138},end={x:282,y:170},peak={x:160,y:withEnzyme?102:42};
 return{start,end,peak,path:`M${start.x} ${start.y}C85 138 100 ${peak.y} 160 ${peak.y}S235 170 282 170`,withEnzyme,measured:false};
}
