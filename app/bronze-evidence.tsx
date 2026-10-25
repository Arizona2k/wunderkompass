'use client';
import {useState} from 'react';
import {useSavedModel} from './saved-games';

const labels=['Fundkarten lesen','Material und Zeit trennen','Eine Behauptung prüfen'];
const tasks=[
 'Vergleiche die Materialangaben von A und B. Was ist verschieden, obwohl der angegebene Fundzusammenhang gleich ist?',
 'Blende den Fundzusammenhang aus. Kannst du das Alter jetzt allein aus dem Material bestimmen? Unterscheide eine Stoffanalyse von einer zeitlichen Einordnung.',
 'Prüfe: In diesem Zeitabschnitt bestand jeder Gegenstand aus Bronze. Was würde ein sicher zugeordneter Steinhammer für diese Behauptung bedeuten? Was sagt er noch nicht über alle Menschen aus?'
];
const comparisons=[
 'A nennt Stein, B nennt Kupfer und Zinn. Unser erfundenes Beispiel ordnet beide demselben bronzezeitlichen Zusammenhang zu. Verschiedene Werkstoffe können also nebeneinander vorkommen.',
 'Die Materialangabe bleibt lesbar. Die zeitliche Zuordnung fehlt jetzt. Eine Stoffanalyse allein liefert kein Herstellungsjahr; dafür braucht es zusätzliche verlässliche Belege.',
 'Ein sicher zugeordneter Steinhammer wäre ein Gegenbeispiel zu jeder Gegenstand bestand aus Bronze. Ein einzelner Fund zeigt aber noch nicht, wie häufig die verschiedenen Werkstoffe in einer ganzen Region benutzt wurden.'
];
export default function BronzeEvidence(){
 const [level,setLevel]=useSavedModel<number>('bronzeEvidenceLevel',0,{min:0,max:2});
 const [contextVisible,setContextVisible]=useSavedModel<boolean>('bronzeEvidenceContextVisible',true);
 const [compare,setCompare]=useState(false);
 return <section className="history-context history-evidence bronze-evidence" tabIndex={-1} aria-label="Geschichtsdetektiv" data-bronze-evidence>
  <h3>Was steht auf der Fundkarte?</h3>
  <p className="small-note">Erfundene Fundkarten zum Vergleichen, keine originalen Grabungsnotizen. Die gezeichneten Stücke sind frei gewählte Beispiele.</p>
  <div className="model-buttons" role="group" aria-label="Freiwillige Denkstufe">{labels.map((label,i)=><button key={label} className="secondary-button" aria-pressed={level===i} onClick={()=>{setLevel(i);setCompare(false);}}>{i+1} · {label}</button>)}</div>
  <p className="learning-goal">{tasks[level]}</p>
  <figure className="topic-illustration bronze-material-examples">
   <svg viewBox="0 0 360 145" role="img" aria-label="Eigene erfundene Materialbeispiele A und B: ein kantiges graues Stück und ein braunes Stück. Farbe und Form allein beweisen das Material nicht.">
    <path d="M35 103L27 69L55 35L113 29L151 58L141 108L91 122Z" fill="#8b9596" stroke="#285463" strokeWidth="3"/>
    <path d="M55 35L75 72L27 69M75 72L91 122M75 72L151 58" fill="none" stroke="#52686d" strokeWidth="2"/>
    <path d="M211 46L285 30L335 54L329 110L248 121L208 94Z" fill="#bf915b" stroke="#6d4a27" strokeWidth="3"/>
    <path d="M211 46L255 70L335 54M255 70L248 121" fill="none" stroke="#6d4a27" strokeWidth="2"/>
    <text x="90" y="95" textAnchor="middle" fontSize="38" fontWeight="700" fill="#173e4a">A</text>
    <text x="291" y="100" textAnchor="middle" fontSize="38" fontWeight="700" fill="#173e4a">B</text>
   </svg>
   <figcaption>Mit KI-Unterstützung erstellte eigene Zeichnung. Die Farben helfen beim Zuordnen; sie ersetzen keine Materialanalyse. Keine Fotos oder genauen historischen Objektformen.</figcaption>
  </figure>
  <div className="bronze-evidence-cards">
   {[{id:'A',material:'Stein'},{id:'B',material:'Kupfer und Zinn'}].map(card=><div key={card.id} className="bronze-evidence-card" data-bronze-card={card.id}>
    <h4>Fundkarte {card.id} · erfunden</h4>
    <p><strong>Materialangabe:</strong> {card.material}</p>
    <p data-bronze-context><strong>Fundzusammenhang:</strong> {contextVisible?'In unserem Lernbeispiel: bronzezeitlicher Zusammenhang in Britannien.':'Ausgeblendet. Das Material allein nennt kein Alter.'}</p>
   </div>)}
  </div>
  <div className="model-buttons"><button className="secondary-button" aria-expanded={contextVisible} onClick={()=>setContextVisible(v=>!v)}>{contextVisible?'Fundzusammenhang ausblenden':'Fundzusammenhang einblenden'}</button><button className="secondary-button" aria-expanded={compare} onClick={()=>setCompare(v=>!v)}>{compare?'Vergleich schließen':'Meine Überlegung vergleichen'}</button></div>
  {compare&&<div className="model-result" role="status"><strong>Eine mögliche Überlegung</strong><p>{level===1&&contextVisible?'Blende den Fundzusammenhang zunächst aus und vergleiche, welche Angaben dann fehlen.':comparisons[level]}</p></div>}
  <p className="small-note">Die freiwillige Untersuchung vergibt keinen Stempel. Du vergleichst deine Überlegung mit einem Beispiel. Die Fundkarten zeigen keine vollständige Ausgrabung und keinen Kalender für die ganze Welt.</p>
 </section>;
}
