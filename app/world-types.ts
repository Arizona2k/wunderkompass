import type {Mode,Place} from './earth-data';
import type {Activity,LocalProgress} from './progress-storage';
export type WorldCategory='animals'|'history'|'people'|'inventions'|'buildings'|'science';
export type WorldPhotoData={variants?:{src:string;width:number}[];id:string;src:string;author:string;license:string;license_url:string;source_page_url:string;alt_de:string;width:number;height:number;transformations_de:string;fit?:string;caption?:string;label?:string};
export type WorldLocation={label:string;lat:number;lon:number;iso?:string};
export type NewWorldModel='atmosphere'|'magnetism'|'currents'|'motor'|'foodweb'|'sound'|'solar-system'|'energy'|'patterns';
export type WorldModel='water-cycle'|'moon-phases'|'circuit'|'network'|'flight'|'gps'|'computer'|'shadows'|'lock'|'bridge'|'heights'|NewWorldModel;
export type WorldQuestion={prompt:string;answers:string[];correct:number;why:string};
// Neue Felder der Wissenskarte (Phase 1, Teilschritt 2), alle freiwillig: kurze Häppchen, „Stimmt das?“ und weitere Fragen.
// IDs: Behauptungen <kartenId>:stimmt-<n>, Fragen <kartenId>:rate-<n>. Sie stehen im Pass und werden nie umbenannt.
export type KartenKapitel={question:string;text:string};
export type KartenBehauptung={id:string;text:string;isTrue:boolean;explanation:string};
// Teilschritt 3 (E6): jede Zusatzfrage hat eine Stufe; Tipps als Liste (hints) oder wie bisher einer (hint);
// je Antwort ein Satz „warum nicht“ (null bei der richtigen).
export type KartenZusatzfrage=WorldQuestion & {id:string;hint?:string;hints?:string[];level?:import('./kern/stufe').Stufe;wrongReasons?:(string|null)[]};
export type WorldTopic={investigation?:import('./science-investigation').InvestigationId;revision?:number;checkedAt?:string;challenges?:(WorldQuestion & {id:string;difficulty:'medium'|'hard';level?:import('./kern/stufe').Stufe})[];id:string;category:WorldCategory;title:string;intro:string;aliases:string[];paragraphs:string[];facts:{label:string;text:string}[];more:string[];surprise?:string;locations:WorldLocation[];related:string[];sources:{label:string;url:string}[];sourceNote?:string;image?:string;question:WorldQuestion;learning?:{starter:string;observe:string;benefit:string};questionFeedback?:{hint:string;wrongReasons:(string|null)[]};links:{label:string;mode:Mode;id?:string;iso?:string}[];model?:WorldModel;
 chapters?:KartenKapitel[];claims?:KartenBehauptung[];moreQuestions?:KartenZusatzfrage[];
 animal?:{group:string;habitat:string;continent:string;diet:string;skill:string;size:{min:number;max:number;unit:string;measurement_de:string;text_de:string;kind?:'range'|'upper-bound'|'typical'};protection:{text_de:string;scope:string;checked_at:string}};
 history?:{year:number;date:string;era:string;sensitive:boolean};
 person?:{lifespan:string;field:string;method:string};
 invention?:{year:number;date:string;walkthrough?:boolean;recognitionClue?:string;comparisonQuestion?:(WorldQuestion & {hint:string;wrongReasons:(string|null)[]});model?:'resolution'|'aperture'|'generator'|'transistor'|'seismograph'|'layers';stages:{label:string;text:string}[];parts:{id:string;name:string;description:string}[];blueprint:'car'|'plane'|'lamp'|'computer'|'phone'|'printer'|'compass'|'train'|'rocket'|'satellite'|'network'|import('./invention-discovery').DiscoveryKind};
 building?:{date:string;size:string;height?:number;exploration?:{kind:'aqueduct'|'dry-stone'|'timber'|'earth'|'rock-cut'|'temple-water'|'corbel'|'shells';steps:[string,string,string];note:string}};
};
export type WorldEntry=Pick<WorldTopic,'id'|'category'|'title'|'intro'|'aliases'|'locations'|'image'|'model'> & {group?:string;habitat?:string;continent?:string;year?:number;era?:string;date?:string;field?:string;lifespan?:string;sensitive?:boolean;homeQuestion?:string;homePhoto?:WorldPhotoData};
export type WorldActions={progress:LocalProgress;onActivity:(activity:Activity)=>void;onVisit:(id:string)=>void;onLearn:(id:string)=>void;onFavorite:(id:string)=>void;onRead:(s:string)=>void;onPlace:(p:Place)=>void;onNavigate:(mode:Mode,id?:string,iso?:string)=>void;onSave:(id:string,key:string,value:unknown,activity:Activity)=>void;onReview:(id:string,correct:boolean)=>void;onNachbessern?:(id:string)=>void;onStufe?:(stufe:import('./kern/stufe').Stufe)=>void;onGame:(id:string)=>void;onClear:(id:string)=>void};
