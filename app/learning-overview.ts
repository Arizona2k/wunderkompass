// One canonical lightweight journey/badge declaration; book explanations stay in learning-data.
import journeyIndex from "./journey-index.json" with {type:"json"};
import type {Journey} from "./learning-data";
export type {Journey,JourneyStep} from "./learning-data";
export const JOURNEYS=journeyIndex as Journey[];
export const BADGES=[
 {id:"traveler",name:"Weltenbummler",text:"Entdecke 12 verschiedene Orte.",icon:"globe"},
 {id:"core",name:"Kernforscher",text:"Besuche alle 4 Erdschichten.",icon:"layers"},
 {id:"reader",name:"Wissenssammler",text:"Schließe 4 Lernreisen ab.",icon:"book"},
 {id:"explorer",name:"Wissensmeister",text:"Schließe alle 16 Lernreisen ab.",icon:"compass"},
 {id:"player",name:"Spieleforscher",text:"Löse 6 verschiedene Spiele.",icon:"game"},
 {id:"quiz",name:"Quizstern",text:"Beende eine Quizrunde.",icon:"star"},
 {id:"map",name:"Kartenprofi",text:"Löse die 12 Suchmissionen selbst.",icon:"compass"},
 {id:"volcano",name:"Vulkanforscher",text:"Löse die Vulkan-Lernreise und das Vulkanlabor.",icon:"layers"},
 {id:"ocean",name:"Meeresexperte",text:"Löse die Meeres-Lernreise und das Gezeitenlabor.",icon:"waves"},
 {id:"nature",name:"Tierforscher",text:"Löse die Lebensraum-Lernreise und ein Tierspiel.",icon:"leaf"},
 {id:"weather",name:"Wetterdetektiv",text:"Löse die Wetter-Lernreise und das Wetterlabor.",icon:"cloud"},
 {id:"super",name:"Super-Entdecker",text:"Schließe die Abenteuer-Weltreise und 5 Labore ab.",icon:"star"},
];
