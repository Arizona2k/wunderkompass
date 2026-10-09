import type {WorldTopic} from './world-types';
import {MachineDrawing} from './invention-blueprint';
const labels:Record<string,[string,string]>={
 light:['Glühlampe mit heißem Draht','LED-Lampe mit Leuchtdioden'],car:['Frühes Motorfahrzeug','Modernes Fahrzeug, zum Beispiel elektrisch'],railway:['Dampflokomotive','Elektrozug'],airplane:['Frühes Motorflugzeug mit zwei Tragflächen','Modernes Verkehrsflugzeug'],phone:['Telefon mit Kabel und Wählscheibe','Mobiltelefon mit Funk'],computer:['Früher Rechner mit großen Schränken','Laptop'],internet:['Wenige verbundene Rechner','Viele verbundene Netze'],compass:['Magnetischer Richtungsanzeiger','Moderner Magnetkompass'],printing:['Handbetriebene Presse','Digital gesteuerter Drucker'],rocket:['Frühe Raketenentwicklung','Moderne Rakete'],satellite:['Früher künstlicher Satellit','Moderner Messsatellit'],smartphone:['Früher tragbarer Computer mit Telefon','Modernes Smartphone']};
export default function TechnologyComparison({topic,today}:{topic:WorldTopic;today:boolean}){
 const id=topic.id.replace('invention-','');
 const kind=topic.id==='invention-smartphone'?'smartphone':topic.invention!.blueprint;
 return <figure className="technology-picture"><svg viewBox="0 0 600 325" role="img" aria-label={`${today?'Heute':'Damals'}: ${labels[id][today?1:0]}`}><MachineDrawing kind={kind} today={today}/></svg><figcaption><strong>{labels[id][today?1:0]}</strong><p>Eine vereinfachte Beispielzeichnung. Formen und Bauteile änderten sich über viele Schritte.</p></figcaption></figure>;
}
