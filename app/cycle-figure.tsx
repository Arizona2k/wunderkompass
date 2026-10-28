export const WATER=[
 {title:'Verdunsten',text:'Sonnenenergie ermöglicht den Übergang zu unsichtbarem Wasserdampf.',x:100,y:180},
 {title:'Kondensieren',text:'Beim Abkühlen kann aus Wasserdampf flüssiges Wasser werden. Winzige Tröpfchen bilden Wolken.',x:230,y:65},
 {title:'Niederschlag',text:'Große Tropfen oder Eiskristalle fallen aus Wolken zur Erde.',x:430,y:65},
 {title:'Abfließen & versickern',text:'Schwerkraft bewegt Wasser bergab und in den Boden. Es kann lange gespeichert bleiben.',x:470,y:180}
];
export const MOON=[
 {title:'Neumond',text:'Die beleuchtete Hälfte ist von uns abgewandt. Der Mond steht am Himmel ungefähr in Richtung Sonne.',x:440,y:150,fill:'#34495e'},
 {title:'Zunehmender Halbmond',text:'Wir sehen die Hälfte der beleuchteten Mondscheibe. Der Mond selbst bleibt eine Kugel.',x:300,y:40,fill:'#34495e'},
 {title:'Vollmond',text:'Wir sehen fast die ganze beleuchtete Seite. Der Mond steht der Sonne am Himmel ungefähr gegenüber.',x:160,y:150,fill:'#f4d98a'},
 {title:'Abnehmender Halbmond',text:'Wieder ist die halbe Scheibe beleuchtet. Danach nimmt die sichtbare Lichtfläche weiter ab.',x:300,y:260,fill:'#34495e'}
];
export default function CycleFigure({kind,step=0}:{kind:'water-cycle'|'moon-phases';step?:number}){
 const water=kind==='water-cycle',stations=water?WATER:MOON,current=stations[step];
 return <svg viewBox={water?'0 0 600 270':'0 0 600 310'} role="img" aria-label={water?'Vereinfachter Wasserweg: Verdunsten, Kondensieren, Niederschlag, Abfließen und Versickern. Ausgewählt: '+current.title:'Mondbahn von oben: Sonne rechts, Erde in der Mitte. Ausgewählt: '+current.title}>
 {water?<><path d="M100 180L230 65H430L470 180H100" stroke="#587e8c" fill="none" strokeWidth="3" strokeDasharray="8 7"/><path d="M45 215Q120 200 190 215T335 215T550 215" fill="none" stroke="#318eb5" strokeWidth="8"/><circle cx="85" cy="53" r="24" fill="#e1ad45"/></>:<><ellipse cx="300" cy="150" rx="140" ry="110" fill="none" stroke="#587e8c" strokeDasharray="7 5"/><circle cx="300" cy="150" r="25" fill="#318eb5"/><text x="300" y="196" textAnchor="middle">Erde</text><circle cx="545" cy="150" r="30" fill="#e1ad45"/><text x="590" y="200" textAnchor="end">Sonne</text><path d="M503 115H466M503 150H478M503 185H466" stroke="#ad7315" strokeWidth="3"/></>}
 {stations.map((s,i)=><g key={s.title}><circle cx={s.x} cy={s.y} r={water?24:18} fill={step===i?'#125b52':'#e1efeb'} stroke="#125b52" strokeWidth={step===i?5:2}/><text x={s.x} y={s.y+6} textAnchor="middle" fill={step===i?'white':'#125b52'} fontSize="18">{i+1}</text></g>)}
 </svg>;
}
