// Own qualitative article illustration: energy and matter have different roles.
import {useId} from 'react';

export default function PhotosynthesisRolesDrawing(){
 const title=useId();
 return <div className="photosynthesis-concept-drawing">
  <svg viewBox="0 0 320 250" role="img" aria-labelledby={title}>
   <title id={title}>Ein Blatt verbindet Lichtenergie mit Stoffwegen: Wasser und Kohlendioxid hinein, Zucker und Sauerstoff als Produkte.</title>
   <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="43" cy="40" r="17" fill="#f8dfb5" stroke="#925018" strokeWidth="2.5"/>
    <path d="M43 13V7M43 73V67M16 40H10M76 40H70M24 21L20 17M62 59L66 63M24 59L20 63M62 21L66 17" stroke="#925018" strokeWidth="2.5"/>
    <path d="M47 108C47 108 29 130 29 140a18 18 0 0 0 36 0c0-10-18-32-18-32Z" fill="#c5e0e9" stroke="#245d70" strokeWidth="2.5"/>
    <rect x="9" y="186" width="78" height="42" rx="20" fill="#edf4f7" stroke="#245d70" strokeWidth="2.5"/>
    <path d="M73 141H111M102 134L111 141L102 148M94 201Q107 194 119 181M109 182L119 181L117 191" stroke="#245d70" strokeWidth="3"/>
    <path d="M139 214C110 167 109 89 192 49C218 118 209 174 139 214Z" fill="#d6e8cf" stroke="#245d70" strokeWidth="3"/>
    <path d="M132 232C139 178 163 111 192 49M141 184L123 151M151 151L126 113M162 124L145 83M151 154L191 137M164 118L199 102" stroke="#3d6d52" strokeWidth="2.5"/>
    <path d="M79 43Q97 35 111 53T143 70T175 95M168 81L175 95L160 92" stroke="#925018" strokeWidth="3"/>
    <path d="M205 91H249M240 84L249 91L240 98M200 165H249M240 158L249 165L240 172" stroke="#245d70" strokeWidth="3"/>
    <rect x="259" y="73" width="39" height="35" rx="9" fill="#f6e6ce" stroke="#245d70" strokeWidth="2.5"/>
    <path d="M259 74L277 84L298 74M277 84V108" stroke="#245d70" strokeWidth="2"/>
    <circle cx="271" cy="165" r="11" fill="#e3eff4" stroke="#245d70" strokeWidth="2.5"/>
    <circle cx="294" cy="165" r="11" fill="#e3eff4" stroke="#245d70" strokeWidth="2.5"/>
   </g>
   <g fill="#193e4c" fontSize="22" textAnchor="middle">
    <text x="43" y="91">Licht</text><text x="47" y="179">H₂O</text>
    <text x="48" y="214">CO₂</text><text x="278" y="135">Zucker</text><text x="283" y="207">O₂</text>
   </g>
  </svg>
  <dl className="photosynthesis-concept-roles">
   <div><dt>Energie</dt><dd>Lichtenergie treibt den Aufbau an.</dd></div>
   <div><dt>Ausgangsstoffe</dt><dd>Wasser und Kohlendioxid liefern Stoffbausteine.</dd></div>
   <div><dt>Produkte</dt><dd>Zucker und Sauerstoff entstehen.</dd></div>
  </dl>
  <p className="photosynthesis-concept-key">Der gewellte Pfeil steht für Lichtenergie. Die übrigen Pfeile zeigen Stoffwege. Blatt und Zeichen sind eigene vereinfachte Symbole; die Zeichnung zeigt keine Mengen, Molekülstruktur oder Reaktionsgeschwindigkeit.</p>
 </div>;
}
