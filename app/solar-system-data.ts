import {PLANET_DISTANCE_AU} from './planet-distances';

// Existing identities, periods and facts retained. Distances share one defined source.
export const PLANETS=[
 {id:'mercury',name:'Merkur',au:PLANET_DISTANCE_AU.mercury,days:88,color:'#939aa3',type:'Gesteinsplanet',fact:'Merkur ist der kleinste Planet und der Sonne am nächsten.'},
 {id:'venus',name:'Venus',au:PLANET_DISTANCE_AU.venus,days:225,color:'#c49a57',type:'Gesteinsplanet',fact:'Die Venus hat eine dichte Atmosphäre. Unter ihren Wolken ist es sehr heiß.'},
 {id:'earth',name:'Erde',au:PLANET_DISTANCE_AU.earth,days:365.25,color:'#388ca6',type:'Gesteinsplanet',fact:'Unser Zuhause ist der dritte Planet von der Sonne. Ein Umlauf dauert etwa ein Jahr.'},
 {id:'mars',name:'Mars',au:PLANET_DISTANCE_AU.mars,days:687,color:'#bb6144',type:'Gesteinsplanet',fact:'Mars ist der vierte Planet. Seine Atmosphäre ist viel dünner als die der Erde.'},
 {id:'jupiter',name:'Jupiter',au:PLANET_DISTANCE_AU.jupiter,days:4333,color:'#c39270',type:'Gasriese',fact:'Jupiter ist der größte Planet. Er hat keine feste Oberfläche wie die Erde.'},
 {id:'saturn',name:'Saturn',au:PLANET_DISTANCE_AU.saturn,days:10756,color:'#b49d62',type:'Gasriese',fact:'Saturns auffällige Ringe bestehen aus vielen einzelnen Teilchen.'},
 {id:'uranus',name:'Uranus',au:PLANET_DISTANCE_AU.uranus,days:30687,color:'#5aa5b2',type:'Eisriese',fact:'Uranus ist der siebte Planet. Seine Drehachse ist stark zur Seite geneigt.'},
 {id:'neptune',name:'Neptun',au:PLANET_DISTANCE_AU.neptune,days:60190,color:'#5866b7',type:'Eisriese',fact:'Neptun ist der äußerste der acht Planeten. Ein Umlauf dauert etwa 165 Erdjahre.'},
] as const;
