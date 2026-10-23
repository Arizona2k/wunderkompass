/** Sites publications and deployed test updates have distinct evidence and labels.
 * A merge alone never establishes availability; prepared work stays separate. */
export type UpdateCategory='Neue Inhalte'|'Spielen und Lernen'|'Einfachere Bedienung'|'Fehler behoben'|'Anschaulicher erklärt'|'Bereitstellung';
export type UpdateEntry = {
 category:UpdateCategory;
 id:string; version:string; channel:'sites'|'vercel-test'; status:'publication-confirmed'|'test-available'|'prepared';
 confirmedOn:string; publishedOn:string|null; availableOn:string|null; occurredAt:string|null; icon:string; title:string;
 summary:string; details:string[]; benefit:string; links:{label:string;hash:string}[];
 evidence:{file:string;revision:string;quote:string;publicationVersion?:number;pullRequest?:number};
};
import EVIDENCE from '../content/update-history-evidence.json' with {type:'json'};
import TEST_EVIDENCE from './update-history-test-evidence.json' with {type:'json'};
export const HISTORY_EVIDENCE=EVIDENCE;
export const TEST_HISTORY_EVIDENCE=TEST_EVIDENCE;
export function berlinDay(timestamp:string){
 const parts=new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'Europe/Berlin'}).formatToParts(new Date(timestamp));
 const value=(type:string)=>parts.find(p=>p.type===type)!.value;
 return `${value('year')}-${value('month')}-${value('day')}`;
}
type HistoryCopy=Pick<UpdateEntry,'icon'|'category'|'title'|'summary'|'details'|'benefit'|'links'>;
const HISTORY_COPY:Record<number,HistoryCopy> = {
 "1": {
  "icon": "🌍",
  "category": "Neue Inhalte",
  "title": "Eine Weltkugel voller Fragen",
  "summary": "Drehe die Erde, erkunde ihr Inneres und beobachte Tag und Nacht. Ein Quiz und die Vorlesefunktion laden dazu ein, eigene Fragen zu verfolgen.",
  "details": [
   "Auf der Weltkugel kannst du Länder und Meere entdecken.",
   "Eine eigene Ansicht führt ins Innere der Erde.",
   "Die Tag-und-Nacht-Ansicht erklärt eine weitere Seite unseres Planeten.",
   "Quiz und Vorlesen bieten verschiedene Zugänge zum Wissen."
  ],
  "benefit": "Du kannst selbst beobachten, zuhören und dein Wissen ausprobieren. Eltern finden einen gemeinsamen Einstieg in Fragen über die Erde.",
  "links": [
   {
    "label": "Weltkugel",
    "hash": "globe"
   }
  ]
 },
 "2": {
  "icon": "🧭",
  "category": "Spielen und Lernen",
  "title": "Aus Neugier wird eine Lernreise",
  "summary": "Folge einem Thema Kapitel für Kapitel oder entdecke es in einem Spiel. Lernreisen, Länder-Memory und das Wissensbuch eröffnen unterschiedliche Wege zum Wissen.",
  "details": [
   "Lernreisen führen Kapitel für Kapitel durch ein Thema und bieten Vorlesen.",
   "Am Reiseende warten ein Experiment oder Rätsel und ein Reisestempel.",
   "Länder-Memory verbindet Länder mit ihren Hauptstädten.",
   "Reihenfolge-Spiele und das Wissensbuch helfen beim Ordnen und Nachschlagen."
  ],
  "benefit": "Du lernst in deinem eigenen Tempo und auf verschiedenen Wegen. Eltern können ein Kapitel begleiten oder gemeinsam ein Spiel wählen.",
  "links": [
   {
    "label": "Lernreisen",
    "hash": "journeys"
   },
   {
    "label": "Spielplatz",
    "hash": "games"
   }
  ]
 },
 "3": {
  "icon": "🧪",
  "category": "Spielen und Lernen",
  "title": "Was passiert, wenn …?",
  "summary": "Was verändert sich, wenn du eine Einstellung ausprobierst? Neue digitale Labore, Länderporträts und Naturspiele helfen dir, Vermutungen zu prüfen.",
  "details": [
   "Länderporträts ergänzen die Weltkugel mit Informationen zum gewählten Land.",
   "Vulkan-Werkstatt, Erdbeben-Wellen und Wetterstation machen Naturphänomene erkundbar.",
   "Weitere Labore behandeln etwa Wasserkreislauf, Jahreszeiten, Mondphasen und Gezeiten.",
   "Flaggen-, Lebensraum- und Tierdetektiv-Spiele eröffnen zusätzliche Lernwege."
  ],
  "benefit": "Du kannst Fragen durch Ausprobieren verfolgen. Eltern haben konkrete Anlässe, über Länder, Tiere und Naturereignisse zu sprechen.",
  "links": [
   {
    "label": "Forscherlabor",
    "hash": "labs"
   },
   {
    "label": "Weltkugel",
    "hash": "globe"
   }
  ]
 },
 "4": {
  "icon": "🎒",
  "category": "Einfachere Bedienung",
  "title": "Lieblingswissen finden und mitnehmen",
  "summary": "Finde ein Thema über die gemeinsame Suche und nimm deinen Lernstand als Sicherungsdatei mit. Größere Schrift und weniger Bewegung machen das Lesen angenehmer.",
  "details": [
   "Die gemeinsame Suche macht Lerninhalte von einem Ort aus auffindbar.",
   "Der Entdeckerpass lässt sich als Datei herunterladen und wieder einlesen.",
   "Größere Schrift und weniger Bewegung sind frei wählbar.",
   "Persönlicher Lernstand und Notizen werden auf dem eigenen Gerät gespeichert."
  ],
  "benefit": "Du kannst angenehmer lesen und schneller wieder anknüpfen. Eltern können den Pass für einen Gerätewechsel sichern; die Sicherungsdatei bleibt privat.",
  "links": [
   {
    "label": "Wissensbuch",
    "hash": "book"
   }
  ]
 },
 "5": {
  "icon": "🪐",
  "category": "Spielen und Lernen",
  "title": "Wie weit ist es bis zum Neptun?",
  "summary": "Wähle einen der acht Planeten und vergleiche seine Entfernung zur Sonne und seine Umlaufzeit. Ein Zeitregler und freiwillige Hinweise helfen dir beim Erkunden.",
  "details": [
   "Acht Planeten sind im Sonnensystem-Modell auswählbar.",
   "Ein Zeitregler verändert die Positionen auf den vereinfachten Umlaufbahnen.",
   "Angaben zu Sonnenabstand und Umlaufzeit helfen beim Vergleichen.",
   "Die Modellgrenzen erklären, warum die Darstellung kein maßstabsgetreues Abbild ist.",
   "Lernhilfen geben auf Wunsch schrittweise Hinweise."
  ],
  "benefit": "Du kannst Unterschiede selbst entdecken, statt nur Planetennamen zu lernen. Eltern können gemeinsam über Zeit, Entfernung und die Grenzen eines Modells sprechen.",
  "links": [
   {
    "label": "Forscherlabor",
    "hash": "labs"
   }
  ]
 },
 "7": {
  "icon": "✨",
  "category": "Neue Inhalte",
  "title": "Sechs Türen zu einer größeren Welt",
  "summary": "Von Tieren bis zu Erfindungen: Sechs Wissenswelten und ihre ersten 90 Karten öffnen neue Entdeckungswege. Zusammengehörende Karten lassen sich auf Wissensrouten erkunden.",
  "details": [
   "Tiere, Geschichte, große Köpfe, Erfindungen, Bauwerke und Wissenschaft erhalten eigene Themenzugänge.",
   "90 Wissenskarten bilden den ersten Katalog dieser Welten.",
   "Wissensrouten führen über mehrere zusammengehörende Karten.",
   "Spiele wie Tierdetektiv und „Sortiere die Zeit“ greifen die neuen Themen auf.",
   "Die Lernwelt kann vorab für die Nutzung ohne Internet auf das Gerät geladen werden."
  ],
  "benefit": "Kinder folgen ihrer Neugier auch über die Erde hinaus. Familien können einen Lernweg gemeinsam wählen und sich vor einer Reise auf Offline-Nutzung vorbereiten.",
  "links": [
   {
    "label": "Wissenswelten",
    "hash": "world"
   }
  ]
 },
 "8": {
  "icon": "🔁",
  "category": "Bereitstellung",
  "title": "Die Wissenswelt wird erneut bereitgestellt",
  "summary": "Die bekannten Wissenswelten wurden erneut bereitgestellt. Die gesicherten Lerninhalte blieben dabei gleich; neue Funktionen kamen nicht hinzu.",
  "details": [
   "Der gesicherte Inhaltsstand entspricht Version 7: dieselben 90 Wissenskarten und Lernfunktionen."
  ],
  "benefit": "Ihr könnt die schon bekannten Welten weiter nutzen. Dieser Eintrag macht die erneute Bereitstellung transparent, ohne neue Inhalte zu versprechen.",
  "links": [
   {
    "label": "Wissenswelten",
    "hash": "world"
   }
  ]
 },
 "9": {
  "icon": "📷",
  "category": "Anschaulicher erklärt",
  "title": "Ein Bild als Auftakt zur Lernreise",
  "summary": "Thematisch passende Fotos begrüßen dich am Beginn ausgewählter Lernreisen. Ihre Herkunft kannst du in den Bildnachweisen nachlesen.",
  "details": [
   "Die Einstiegsbilder der Lernreisen erhalten thematisch ausgewählte Fotos.",
   "Die verwendeten Bilder werden mit ihren Bildnachweisen verknüpft."
  ],
  "benefit": "Du bekommst einen anschaulichen ersten Eindruck vom Thema. Eltern können die Bildherkunft nachsehen; erklärende Kapitelgrafiken folgen erst später.",
  "links": [
   {
    "label": "Lernreisen",
    "hash": "journeys"
   }
  ]
 },
 "10": {
  "icon": "💾",
  "category": "Fehler behoben",
  "title": "Weiterlernen, wo du aufgehört hast",
  "summary": "Setze eine begonnene Spielrunde mit denselben Fragen und Antwortmöglichkeiten fort. Mehrere offene Fenster gleichen deinen Lernstand auf demselben Gerät ab.",
  "details": [
   "Gespeicherte Spielrunden behalten ihre Fragen und Antwortmöglichkeiten beim Wiederherstellen.",
   "Ein gemeinsamer Entdeckerpass bewahrt deinen bisherigen Lernfortschritt.",
   "Offene Browserfenster gleichen Änderungen am Pass auf demselben Gerät ab.",
   "Sicherungen bleiben der Weg, den Pass auf ein anderes Gerät mitzunehmen."
  ],
  "benefit": "Du kannst eine begonnene Runde wieder aufnehmen. Eltern können den Lernstand sichern, ohne eine automatische Synchronisierung zwischen Geräten vorauszusetzen.",
  "links": [
   {
    "label": "Spielplatz",
    "hash": "games"
   }
  ]
 },
 "11": {
  "icon": "🔎",
  "category": "Einfachere Bedienung",
  "title": "Gesuchtes finden, Gehörtes verstehen",
  "summary": "Suche nach einem Spiel oder Begriff und öffne passende Wissenskarten direkt. Browser-Zurück und eine wählbare Vorlesestimme erleichtern das Weiterlernen.",
  "details": [
   "Die Suche berücksichtigt auch Spiele und passende Begriffe.",
   "Direktlinks öffnen Wissenskarten im passenden Bereich.",
   "Browser-Zurück führt durch die zuvor besuchten Lernansichten.",
   "Im Entdeckerpass lässt sich eine verfügbare Vorlesestimme auswählen."
  ],
  "benefit": "Du gelangst leichter vom gesuchten Begriff zum passenden Lernweg. Eltern können eine auf ihrem Gerät vorhandene Stimme gemeinsam auswählen.",
  "links": [
   {
    "label": "Wissensbuch",
    "hash": "book"
   },
   {
    "label": "Spielplatz",
    "hash": "games"
   }
  ]
 },
 "12": {
  "icon": "🖼️",
  "category": "Anschaulicher erklärt",
  "title": "So funktioniert es – Bild für Bild",
  "summary": "Schau dir an, wie ein Gerät funktioniert, ein Bauwerk entsteht oder ein Ereignis eingeordnet wird. Neue Erklärzeichnungen ergänzen die Lernreisen und Wissenskarten.",
  "details": [
   "Kapitelgrafiken veranschaulichen die Erklärungen in den Lernreisen.",
   "Funktionszeichnungen zeigen Bauteile und Zusammenhänge von Erfindungen.",
   "Bauwerksmodelle führen durch Bauschritte und tragende Teile.",
   "Geschichtskarten ordnen Ereignisse in hilfreiche Kontextfolgen ein.",
   "Passende Karten und aufklappbare Details ergänzen die Darstellungen."
  ],
  "benefit": "Du kannst Abläufe und Bauteile leichter miteinander verbinden. Eltern können eine Zeichnung als Gesprächseinstieg nutzen und bei Interesse gemeinsam tiefer einsteigen.",
  "links": [
   {
    "label": "Lernreisen",
    "hash": "journeys"
   },
   {
    "label": "Wissenswelten",
    "hash": "world"
   }
  ]
 },
 "13": {
  "icon": "🌊",
  "category": "Neue Inhalte",
  "title": "Vom Walhai bis zu Computerregeln",
  "summary": "Entdecke unter anderem Walhai, Timbuktu und Schall: 18 zusätzliche Karten erweitern den damaligen Bestand auf 108. Neun weitere Modelle zeigen Zusammenhänge aus Natur und Technik.",
  "details": [
   "Walhai, Gartenkreuzspinne, Dromedar und Seeadler ergänzen die Tierwelt.",
   "Maya, Polynesien, Timbuktu, Griechenland und Rom erweitern die Geschichte.",
   "Neue Wissenschaftskarten behandeln unter anderem Atmosphäre, Magnetismus, Strömungen und Schall.",
   "Neun Modelle erschließen auch Motor, Nahrungsketten, Sonnensystem, Sonnenenergie und Musterregeln."
  ],
  "benefit": "Du findest neue Fragen in vertrauten Welten. Eltern können Tiere, Geschichte und Technik miteinander verbinden, statt nur einzelne Fakten nachzuschlagen.",
  "links": [
   {
    "label": "Wissenswelten",
    "hash": "world"
   },
   {
    "label": "Forscherlabor",
    "hash": "labs"
   }
  ]
 },
 "14": {
  "icon": "🛠️",
  "category": "Fehler behoben",
  "title": "Kleine Hürden beim Entdecken verschwinden",
  "summary": "Tierkarten sind in der Suche leichter zu finden; Hilfe und Elterntipps lassen sich direkt öffnen. Nach dem Einlesen einer Sicherung bleibt die passende Fortsetzung auch bei mehreren offenen Fenstern erhalten.",
  "details": [
   "Die Suche zeigt Tierkarten klarer, ohne doppelte Trefferwege.",
   "Hilfe und Elterntipps lassen sich direkt öffnen; Suchdialoge schließen zuverlässiger.",
   "Ein zweites offenes Fenster überschreibt das aus einer Sicherung übernommene Fortsetzungsziel nicht mehr.",
   "Das Nahrungsspiel berücksichtigt auch die neu hinzugekommenen Tierkarten."
  ],
  "benefit": "Kinder kommen mit weniger Umwegen zum Ziel und können passend weiterlernen. Eltern finden Unterstützung schneller und können Sicherungen zuverlässiger mitnehmen.",
  "links": [
   {
    "label": "Wissenswelten",
    "hash": "world"
   },
   {
    "label": "Spielplatz",
    "hash": "games"
   }
  ]
 }
};
const SITES_HISTORY:UpdateEntry[]=EVIDENCE.versions.flatMap(record=>{
 const copy=HISTORY_COPY[record.number],publication=record.publication;
 if(!copy||publication?.status!=='succeeded'||publication.type!=='publish')return [];
 return [{id:'site-v'+record.number,version:String(record.number),channel:'sites',status:'publication-confirmed',confirmedOn:EVIDENCE.checkedOn,publishedOn:berlinDay(publication.completedAt),availableOn:null,occurredAt:publication.completedAt,...copy,evidence:{file:'content/update-history-evidence.json',revision:record.sourceCommit,quote:record.sourceCommit,publicationVersion:record.number}}];
});
type TestRecord=(typeof TEST_EVIDENCE.pullRequests[number])&{checkedOn?:string};
type UpdateCopy=HistoryCopy&Pick<UpdateEntry,'id'>;
/** Reject stale success, unrelated previews and merged-but-unavailable work. */
export function confirmedTestDeployment(record:TestRecord,baseline=TEST_EVIDENCE.testLive){
 const commit=record.mergeCommit,merged=Date.parse(record.mergedAt??'');
 if(record.base!=='test-live'||!commit||!/^[a-f0-9]{40}$/.test(commit)||!Number.isFinite(merged)||!baseline.includedMergeCommits.includes(commit)||record.statusesUrl!==`https://api.github.com/repos/${TEST_EVIDENCE.repository}/commits/${commit}/statuses`)return null;
 const latest=record.deploymentStatuses.filter(s=>s.context==='Vercel').toSorted((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt)||b.id-a.id)[0];
 if(!latest||latest.state!=='success'||latest.creator!=='vercel[bot]'||latest.description!=='Deployment has completed'||!/^https:\/\/vercel\.com\/interaktive-wissens-und-lernplattform\/wunderkompass\/[A-Za-z0-9]+$/.test(latest.targetUrl)||!Number.isFinite(Date.parse(latest.createdAt))||Date.parse(latest.createdAt)<merged)return null;
 return latest;
}
export function testUpdate(record:TestRecord,copy:UpdateCopy,baseline=TEST_EVIDENCE.testLive):UpdateEntry{
 const deployment=confirmedTestDeployment(record,baseline);
 return {...copy,links:deployment?copy.links:[],version:String(record.number),channel:'vercel-test',status:deployment?'test-available':'prepared',confirmedOn:record.checkedOn??TEST_EVIDENCE.checkedOn,publishedOn:null,availableOn:deployment?berlinDay(deployment.createdAt):null,occurredAt:deployment?.createdAt??null,evidence:{file:'app/update-history-test-evidence.json',revision:record.mergeCommit??'',quote:record.mergeCommit??`"number": ${record.number}`,pullRequest:record.number}};
}
const JOURNEY_COPY:UpdateCopy = {
 "id": "journeys-3",
 "icon": "🧭",
 "category": "Spielen und Lernen",
 "title": "Lernreisen: nicht nur lesen, selbst weiterdenken",
 "summary": "Entdecken, erklären, übertragen: Jede Lernreise bietet eigene Kapitelziele und freiwillige Denkaufgaben. Private Merkzettel und direkte Kapiteladressen helfen dir, später wieder anzuknüpfen.",
 "details": [
  "Alle 80 Inhaltskapitel erhalten eigene Aufgaben zum Entdecken, Erklären und Übertragen.",
  "Freiwillige Hinweise und konkrete Rückmeldungen helfen beim Weiterdenken.",
  "Kapiteladressen und Kapitelkarten erleichtern das Zurückkehren zur richtigen Station.",
  "Private Merkzettel bleiben im vorhandenen Entdeckerpass; bisherige Stempel und Spielstände werden erhalten.",
  "Lesbare Grafikbeschriftungen und ruhige Abstände unterstützen kleine Bildschirme und größere Schrift."
 ],
 "benefit": "Du kannst Zusammenhänge selbst erklären und später an deine eigenen Gedanken anknüpfen. Eltern behalten den bisherigen Lernstand und die vertrauten Sicherungen.",
 "links": [
  {
   "label": "Lernreisen",
   "hash": "journeys"
  }
 ]
};
const OFFLINE_COPY:UpdateCopy={
 "id": "offline-learning-3-5",
 "icon": "🧭",
 "category": "Einfachere Bedienung",
 "title": "Deine Lernwelt verlässlich mitnehmen",
 "summary": "Bei der Offline-Vorbereitung zeigt ein echter Dateizähler den Fortschritt. Beim nächsten Versionswechsel werden passende gespeicherte Dateien erneut geprüft und wiederverwendet.",
 "details": [
  "Der Fortschritt zählt nur Dateien, die vollständig geprüft und sicher gespeichert wurden.",
  "Unveränderte gespeicherte Dateien müssen beim Update nicht erneut heruntergeladen werden; jede Datei wird trotzdem auf Größe und Prüfsumme kontrolliert.",
  "Ältere offene Tabs behalten die Dateien ihrer Version. Die letzte vollständige Version bleibt als Rückfall erhalten.",
  "Bei Verbindungs- oder Speicherfehlern wird die unvollständige Vorbereitung verworfen. Erneutes Vorbereiten bleibt möglich; dein Entdeckerpass bleibt erhalten."
 ],
 "benefit": "Du kannst erkennen, wie die Vorbereitung vorankommt, und nach einem Fehler sicher neu versuchen. Eltern können die Lernwelt für unterwegs vollständig vorbereiten.",
 "links": []
};
export const JOURNEY_SUPPORT_COPY:UpdateCopy={
 id:'journey-reading-support-3-5',icon:'🧭',category:'Spielen und Lernen',
 title:'Weiterdenken mit lesbaren Bildern und passenden Hinweisen',
 summary:'Die Lernreisen erhalten genauer passende Denkhinweise. Beschriftungen unter den Kapitelgrafiken bleiben auch auf kleinen Bildschirmen gut lesbar.',
 details:[
  'Alle 240 bisherigen Denkaufgaben erhalten individuell formulierte freiwillige Hinweise. Sie unterstützen das Nachdenken, ohne eine Antwort automatisch auszuwählen.',
  'Bei 32 Aufgaben werden ablenkende Antwortmöglichkeiten und ihre Rückmeldungen gezielter. Die richtigen Antworten und bereits gespeicherten Positionen bleiben erhalten.',
  'Die 64 vorhandenen Kapitelgrafiken behalten ihre Bedienung; Wörter stehen als lesbarer Text unter der Zeichnung. Ländergrenzen und die Ansichten von Neumond, erstem Viertel und Vollmond werden genauer dargestellt.'
 ],
 benefit:'Kinder können sich gezielt Hilfe holen und Bilder auch mit großer Schrift untersuchen. Familien können ihre bisherigen Reisen und Merkzettel weiterverwenden.',
 links:[{label:'Lernreisen',hash:'journeys'}]
};
export const ANIMAL_SOLAR_COPY:UpdateCopy={
 id:'animal-evidence-solar-labels-3-5',icon:'🔎',category:'Spielen und Lernen',
 title:'Tiere genauer erforschen und Planeten gut lesen',
 summary:'Auf den Tierkarten kannst du Belege aufdecken, Zusammenhänge erklären und vorsichtige Schlussfolgerungen üben. Im Planetenvergleich bleiben Namen, Zahlen und Einheiten auch auf kleinen Bildschirmen lesbar.',
 details:[
  'Alle 24 bisherigen Tierkarten erhalten eine freiwillige Werkstatt mit drei Denkwegen. Zwei passende Belege und eigene Hinweise helfen beim Vergleichen; 48 Denkfragen erklären auch typische Fehlschlüsse.',
  '17 neue erklärte Verbindungen zeigen zum Beispiel, warum ein Walhai kein Wal ist und Eisbär und Kaiserpinguin keine natürlichen Nachbarn sind. Zurück führt wieder an den gewählten Verweis.',
  'Beim Planetenvergleich stehen Beschriftungen als umbrechbarer Text unter der Grafik. Auch die Abstandsangaben und Einheiten wachsen mit großer Schrift; die wissenschaftlichen Maßstäbe bleiben erhalten.',
  'Begonnene Werkstattgedanken werden im bisherigen Entdeckerpass gespeichert. Alte Fragen, Spielrunden, Fotos, Favoriten und Sicherungen bleiben nutzbar.'
 ],
 benefit:'Kinder können Wissen mit Belegen begründen und Grenzen eines Bildes erkennen. Familien können die Karten und Planetenwerte mit großer Schrift gemeinsam lesen.',links:[]
};
export const JOURNEY_SOURCE_COPY:HistoryCopy&{id:string}={
 id:'journey-readable-sources-3-5',icon:'📖',category:'Einfachere Bedienung',
 title:'Quellen in den Lernreisen leichter öffnen',
 summary:'Die Quellenangaben aller 16 Lernreisen werden größer und leichter antippbar. Du kannst die ursprünglichen Belege weiterhin freiwillig im Quellenabschnitt öffnen.',
 details:['Quellenlinks verwenden die normale Leseschrift statt kleiner Fußnotenschrift und wachsen bei großer Schrift mit.','Mindestens 48 Pixel hohe Linkflächen erleichtern das Antippen; lange Bezeichnungen dürfen umbrechen.','Unterstreichung und sichtbarer Tastaturfokus machen die Verweise auch ohne Farberkennung erkennbar.'],
 benefit:'Kinder und Eltern können Belege auf kleinen Bildschirmen und mit großer Schrift leichter lesen und erreichen. Reiseinhalte und gespeicherte Fortschritte bleiben erhalten.',
 links:[{label:'Lernreisen',hash:'journeys'}]
};
export const LAB_FEEDBACK_COPY:UpdateCopy={
 id:'lab-feedback-3-5',icon:'🧪',category:'Anschaulicher erklärt',title:'Aus einem Irrtum weiterforschen',
 summary:'Die elf Forscherlabore erhalten passende Erklärungen zu falschen Antworten. So kannst du erkennen, welcher Gedanke noch nicht zur Beobachtung passt.',
 details:['Bei allen 33 bestehenden Laborfragen unterscheidet die Rückmeldung zwischen den beiden falschen Antworten: insgesamt 66 konkrete Erklärungen.','Die drei freiwilligen Denkstufen, Hinweise und Modelle bleiben erhalten. Du kannst nach einem Fehlversuch weiter überlegen und erneut antworten.','Vermutungen, Modellvergleiche, Forschernotizen und bereits verdiente Stempel bleiben im bisherigen Entdeckerpass.'],
 benefit:'Du bekommst einen konkreten Anhaltspunkt zum Weiterdenken. Familien können Missverständnisse gemeinsam am vertrauten Modell untersuchen.',links:[{label:'Forscherlabor',hash:'labs'}]
};
export const ANIMAL_EXPANSION_COPY:HistoryCopy&{id:string}={
 id:'animal-new-species-3-5',icon:'🦉',category:'Neue Inhalte',title:'24 neue Tiere und ihre besonderen Lebensweisen',
 summary:'Vom Schnabeltier bis zur Sepia: 24 zusätzliche Arten laden zum Beobachten, Vergleichen und Erklären ein. Eigene Merkmalszeichnungen und freiwillige Denkwege ergänzen jede Karte.',
 details:['Jede neue Art erhält eigene Erklärungen, Quellen, ein Quiz und einen als Beispiel gekennzeichneten Kartenort.','24 eigene kleine Zeichnungen zeigen Merkmale mit lesbaren HTML-Beschriftungen und klaren Grenzen.','Belege aufdecken, Zusammenhänge erklären und Schlussfolgerungen prüfen: jede Karte bietet drei freiwillige Denkwege mit Hinweisen und konkretem Feedback.','23 erklärte gegenseitige Wissensverbindungen führen zu passenden neuen und bisherigen Themen.','Messrichtung und Angaben für obere oder typische Vergleichswerte bleiben unterscheidbar; die bisherigen Tierkarten und Spielstände bleiben erhalten.'],
 benefit:'Kinder können neue Arten kennenlernen und zugleich lernen, Beobachtung und Schlussfolgerung zu unterscheiden. Eltern finden nachvollziehbare Originalquellen und transparente Prüfgrenzen.',links:[{label:'Tierwelt',hash:'world/animals'}]
};

const TEST_COPY:Record<number,UpdateCopy> = {
 57:{"id":"electrical-originals-3-5","icon":"⚡","category":"Neue Inhalte","title":"Batterie, Generator und Transistor erkunden","summary":"Drei Erfindungskarten erklären, wie eine Batterie Energie bereitstellt, Bewegung elektrische Energie liefert und ein Transistor Strom steuert. Eigene Funktionspläne helfen beim Vergleichen.","details":["Die Batterie erklärt chemisch gespeicherte Energie und den geschlossenen Stromkreis. Ein vereinfachtes Generatormodell vergleicht Bewegung und Stillstand.","Beim Transistormodell kannst du prüfen, wie eine kleine Steuerung einen anderen Stromweg beeinflusst. Die Grenzen der qualitativen Modelle stehen direkt dabei.","Drei freiwillige Denkstufen, individuelle Hinweise und Rückmeldungen begleiten die Karten. Neun erklärte Wissenswege führen auch zu bisherigen Themen zurück.","Alte Aufgaben, Spielreihenfolgen, Notizen und gespeicherte Lernstände bleiben nutzbar."],"benefit":"Du kannst verschiedene elektrische Aufgaben unterscheiden und deine Erklärung an einem einfachen Modell prüfen.","links":[{"label":"Erfindungen in den Wissenswelten entdecken","hash":"world"}]},
 56:{id:'landscapes-climate-depth-3-5',icon:'🏞️',category:'Anschaulicher erklärt',title:'Landschaften und Klima genauer entdecken',summary:'Zehn bekannte Kapitel erklären Berge, Flüsse, Seen und Klimazonen genauer. Acht eigene Schaubilder und anspruchsvollere Aufgaben helfen dir beim Vergleichen.',details:['Eigene Modelle zeigen unter anderem, wie Wasser durch eine Landschaft fließt und welche Einflüsse das Klima prägen.','Beim See verlaufen Wasseroberfläche und möglicher Abfluss jetzt auf plausibler Höhe. Nicht jeder See hat einen oberirdischen Abfluss.','Schwere Aufgaben verbinden Beobachtungen mit Erklärungen. Passende Denkhinweise und Rückmeldungen helfen beim Weiterdenken.','Frühere Antworten und verdiente Fortschritte bleiben erhalten; du kannst deine begonnene Reise fortsetzen.'],benefit:'Du kannst Landschaften genauer erklären, Modelle kritisch betrachten und deine Vermutungen überprüfen.',links:[{label:'Lernreisen erkunden',hash:'journeys'}]},
 55:{id:'journey-explanations-transfer-3-5',icon:'🧭',category:'Anschaulicher erklärt',title:'Vulkane, Mond und Orientierung besser verstehen',summary:'Zwanzig bekannte Kapitel erklären Zusammenhänge genauer. Eigene Schaubilder, freiwillige Vorlesehilfen und anspruchsvollere Denkaufgaben begleiten deine Reise.',details:['Zwölf eigene Erklärgrafiken helfen dir, Vulkane, Erdbeben, Mond und Orientierung genauer zu vergleichen.','Schwere Labor- und Reiseaufgaben bieten passendere Vergleiche und konkrete Rückmeldungen. Frühere Antworten und Lernstände bleiben erhalten.','Weitere Erklärteile, Hinweise und Rückmeldungen lassen sich freiwillig vorlesen. Bleibt ein Aufgabenabruf aus, kannst du ihn erneut versuchen.','Die Buchsuche findet Schreibvarianten zuverlässiger; passende Wissenslinks und Rückwege führen dich an die richtige Stelle.'],benefit:'Du kannst Beobachtungen besser erklären, freiwillige Hilfe nutzen und deine begonnene Lernreise fortsetzen.',links:[{label:'Lernreisen erkunden',hash:'journeys'}]},
 54:{"id":"world-game-learning-hints-3-5","icon":"🐾","category":"Spielen und Lernen","title":"Tierfragen und Rätsel verständlicher spielen","summary":"Vergleiche Lebensräume und Nahrung mit eindeutigeren Antworten. Im Tierdetektiv helfen dir passende Beobachtungen beim Nachdenken.","details":["Lebensraumfragen unterscheiden passende Umgebungen, statt nur unterschiedlich geschriebene Wörter zu vergleichen.","Nahrungsfragen vergleichen ganze Beschreibungen. Bei Tieren mit verschiedenen Entwicklungsstadien kommt es darauf an, von welchem Stadium die Rede ist.","Tierdetektivrätsel verraten den gesuchten Namen nicht mehr. Freiwilliger Denkhinweis, Rückmeldung nach einer falschen Wahl und Erklärung nach der Lösung sind getrennt und vorlesbar.","Begonnene Runden, gespeicherte Antworten und verdiente Erfolge bleiben erhalten. Frühere fachlich passende Lebensraumantworten werden gezielt weiter anerkannt."],"benefit":"Du kannst genauer vergleichen und aus einer falschen Wahl weiterlernen, ohne deine begonnene Runde zu verlieren.","links":[{"label":"Auf dem Spielplatz entdecken","hash":"games"}]},
 53:{"id":"planet-inside-depth-3-5","icon":"🌍","category":"Anschaulicher erklärt","title":"Unsere Erde und ihr Inneres genauer verstehen","summary":"Zehn bekannte Kapitel erklären Luft, Erdbewegungen und Erdschichten verständlicher. Vergleiche Beobachtungen, Begriffe und die Grenzen unserer Modelle.","details":["Unterscheide die wasserbedeckte Oberfläche von der Wassermenge. Bei Inseln und Kontinenten hilft dir die Erklärung des verwendeten Kontinentmodells.","Wind zeigt bewegte Luft, aber noch nicht ihre genaue Zusammensetzung. Zwei verschiedene Erdbewegungen erklären Tag und Jahr.","Vom festen und flüssigen Erdinneren geht es zu den beweglichen Platten: Eine Platte umfasst die Kruste und den starren obersten Mantel. Darunter liegt kein weltweites Magmameer.","Drei freiwillige Denkstufen, eigene Beobachtungsaufträge und passende Quellen begleiten die bestehenden Aufgaben und Schaubilder. Deine bisherigen Antworten, Merkzettel und Lernstände bleiben erhalten."],"benefit":"Du kannst genauer sagen, was ein Bild oder eine Beobachtung zeigt – und welche weitergehenden Fragen damit noch nicht beantwortet sind.","links":[{"label":"Unseren blauen Planeten erkunden","hash":"journeys/planet/1"},{"label":"Unter unseren Füßen weiterforschen","hash":"journeys/inside/1"}]},
 52:{"id":"people-evidence-two-biographies-3-5","icon":"🔎","category":"Neue Inhalte","title":"Mit Mary Anning und Ibn al-Haytham Belege prüfen","summary":"Zwei neue Entdeckerkarten verbinden Lebensgeschichten mit eigenen Forschungsfragen. Vergleiche Beobachtungen und erkläre, was ein Beleg tatsächlich zeigen kann.","details":["Bei Mary Anning unterscheidest du in einem gedachten Fossilbeispiel einen Knochenfund von zwei erfundenen Rekonstruktionszeichnungen. Nicht jedes gezeichnete Detail ist schon ein beobachteter Beleg.","Bei Ibn al-Haytham verfolgst du einen vereinfachten Lichtweg von der Lichtquelle über einen Gegenstand zum Auge. Vergleiche, was sich durch einen undurchlässigen Schirm auf diesem Weg verändert.","Drei freiwillig wählbare Denkstufen bieten eigene Fragen, Hilfen und konkrete Rückmeldungen. Die Grenzen der Zeichnungen und Lernbeispiele werden ausdrücklich erklärt.","Passende Wissenswege führen zu Charles Darwin und zur Kamera – mit Rückwegen zu den neuen Karten. Bisherige Personenbilder, gespeicherte Spielrunden, Notizen und Favoriten bleiben erhalten."],"benefit":"Du kannst Beobachtung und Vermutung auseinanderhalten und begründen, welche Fragen mit den vorhandenen Belegen noch offenbleiben.","links":[{"label":"Mit Mary Anning Fossilienbelege untersuchen","hash":"world/topic/person-mary_anning"},{"label":"Mit Ibn al-Haytham Lichtwege vergleichen","hash":"world/topic/person-ibn_al_haytham"}]},
 51:{"id":"continents-countries-chapter-depth-3-5","icon":"🌍","category":"Spielen und Lernen","title":"Länder und Kontinente genauer entdecken","summary":"Zehn überarbeitete Kapitel helfen dir, Länder, Kontinente und Karten genauer zu unterscheiden. Vergleiche Darstellungen und begründe deine eigenen Beobachtungen.","details":["Kurze Einstiege, genauere Erklärungen und freiwillige Beobachtungsaufträge begleiten die Kapitel zu Kontinenten und Ländern.","Eigene Schaubilder zeigen unter anderem Europa und Asien, Kartenverzerrungen, Hauptstädte und Nachbarländer. Die Grenzen der Modelle werden erklärt.","Bei Flaggen, Fläche und Bevölkerung kommt es auf die konkrete Frage, Einheiten und Datenjahre an. Ein Symbol erzählt nicht alles über einen Menschen.","Drei Denkstufen mit Hinweisen und konkreten Rückmeldungen laden zum Erkennen, Erklären und Übertragen ein. Suche, Wissenswege, Notizen und bisherige Lernstände bleiben erhalten."],"benefit":"Du kannst geografische Darstellungen vergleichen und erklären, welche Aussage eine Karte oder Zahl tatsächlich erlaubt.","links":[{"label":"Kontinente und Länder in den Lernreisen entdecken","hash":"journeys"}]},
 50:{"id":"nature-protect-chapter-depth-3-5","icon":"🌿","category":"Spielen und Lernen","title":"Lebensräume verstehen und die Natur schützen","summary":"Zehn überarbeitete Kapitel helfen dir, Lebensräume und Umweltschutz genauer zu verstehen. Du kannst Erklärungen vergleichen, Schaubilder untersuchen und eigene Beobachtungen festhalten.","details":["Kurze Einstiege, genauere Erklärungen und freiwillige Beobachtungsaufträge begleiten die zehn Kapitel zu Natur und Umweltschutz.","Regenwald, Savanne, Wüsten und Polarregionen werden genauer unterschieden. Eigene Schaubilder erklären Beziehungen und benennen die Grenzen ihrer Vereinfachung.","Die Schutzreise unterscheidet den natürlichen Treibhauseffekt von zusätzlicher Erwärmung und erklärt, wie weniger Verschwendung und mehr Lebensraum helfen können.","Drei Denkstufen, konkrete Hinweise und Rückmeldungen laden zum Erkennen, Erklären und Übertragen ein. Passende Wissenswege, deine Notizen und bisherige Lernstände bleiben erhalten."],"benefit":"Du kannst Beobachtungen mit einer Erklärung verbinden und begründen, welche Handlung der Natur helfen kann.","links":[{"label":"Natur und Umweltschutz in den Lernreisen entdecken","hash":"journeys"}]},
 49:{"id":"seasons-ocean-chapter-depth-3-5","icon":"🌊","category":"Spielen und Lernen","title":"Jahreszeiten und Meere genauer erklären","summary":"Zehn überarbeitete Kapitel helfen dir, Jahreszeiten und das Weltmeer zu verstehen. Du kannst Erklärungen vergleichen, Schaubilder untersuchen und einzelne Kapitel über die Suche wiederfinden.","details":["Kurze Einstiege, genauere Erklärungen und freiwillige Beobachtungsaufträge begleiten alle zehn Kapitel zu Jahreszeiten und Meeren.","Schaubilder unterscheiden Achsneigung, Blickrichtung, Drehung und Umlauf. Du siehst auch, wie gelöste Salze ins Meer gelangen und warum Wasserdampf Salz zurücklässt.","Ein vergrößertes Korallenmodell unterscheidet das Tier, seine Algenpartner und das Kalkskelett. Die Grenzen der vereinfachten Bilder stehen direkt dabei.","Drei Denkstufen mit Hinweisen und Rückmeldungen helfen beim Erkennen, Erklären und Übertragen. Passende Wissenswege und deine bisherigen Notizen und Lernstände bleiben erhalten."],"benefit":"Du prüfst eine Vermutung am Schaubild und erklärst, welche Beobachtung sie stützt und welche Frage noch offenbleibt.","links":[{"label":"Jahreszeiten und Meere in den Lernreisen entdecken","hash":"journeys"}]},
 48:{"id":"water-weather-chapter-depth-3-5","icon":"💧","category":"Spielen und Lernen","title":"Wasser und Wetter selbst erklären","summary":"Zehn überarbeitete Kapitel helfen dir, Wasserwege, Wolken und Wettervorhersagen genauer zu verstehen. Du kannst passende Erklärungen wählen, Schaubilder untersuchen und einzelne Kapitel direkt über die Suche wiederfinden.","details":["Kurze Einstiege, ausführlichere Erklärungen und freiwillige Beobachtungsaufträge begleiten alle zehn Wasser- und Wetterkapitel.","Schaubilder unterscheiden Grundwasser in Gesteinsporen, unsichtbaren Wasserdampf, Wolkenformen und Luftbewegung. Ihre Grenzen stehen direkt dabei.","Drei Denkstufen mit Hinweisen und Rückmeldungen laden zum Beobachten, Erklären und Übertragen ein. Benannte Quellen helfen beim Nachschlagen.","Die Suche öffnet einzelne Kapitel. Passende Wissenswege führen zu Artikeln und Laboren; deine Notizen und bisherigen Lernstände bleiben erhalten."],"benefit":"Du kannst eine Vermutung am Modell prüfen und erklären, was deine Beobachtung zeigt – und was sie offenlässt.","links":[{"label":"Wasser und Wetter in den Lernreisen entdecken","hash":"journeys"}]},
 47:{id:'geography-country-facts-3-5',icon:'🌍',category:'Neue Inhalte',title:'Länderangaben genauer nachschlagen',summary:'Kanadas Fläche und die Hauptstädte von Benin und Burundi sind mit aktuellen Quellen erklärt. Gespeicherte Orte bleiben erhalten und zeigen passende aktuelle Angaben.',details:['Bei Kanada steht die Fläche aus Land und Binnengewässern; Meeresflächen werden nicht dazugerechnet. Der Zeitbezug der amtlichen Angabe ist sichtbar.','Porto-Novo ist Benins Hauptstadt; Cotonou bleibt als Regierungssitz erklärt. Gitega ist Burundis politische Hauptstadt; Bujumbura bleibt als wichtiger Wirtschaftsstandort erhalten.','Alte gespeicherte Stadtorte, Favoriten, Notizen und Spielstände bleiben nutzbar. Die beiden Hauptstadtpunkte ergänzen die Karte.'],benefit:'Du kannst Zahlen und Ortsangaben mit ihrer Bedeutung und ihren Quellen vergleichen, ohne deine gespeicherten Entdeckungen zu verlieren.',links:[{label:'Länder auf der Weltkugel entdecken',hash:'globe'},{label:'Im Wissensbuch nachschlagen',hash:'book'}]},
 46:{id:'animal-saved-rounds-3-5',icon:'🐾',category:'Spielen und Lernen',title:'Begonnene Tierrunden bleiben erhalten',summary:'Ältere Tierdetektiv-Runden behalten ihre gültigen Antwortauswahlen und Reihenfolgen. Du kannst begonnene Runden nach dem Neuladen oder dem Wiederherstellen einer Passsicherung fortsetzen.',details:['Gültige Antworten und ihre Reihenfolge aus dem früheren Tierbestand bleiben in gespeicherten Runden erhalten.','Neuladen und Wiederherstellen einer Passsicherung erhalten den Stand begonnener Fünfer-Runden einschließlich deiner letzten Antwort.','Favoriten, eigene Notizen und andere gespeicherte Spiele bleiben erhalten.'],benefit:'Du kannst deine begonnene Tierrunde in Ruhe weiterspielen.',links:[{label:'Auf dem Spielplatz weiterspielen',hash:'games'}]},
 45:{id:'optics-learning-3-5',icon:'🔭',category:'Neue Inhalte',title:'Kamera, Fernrohr und Mikroskop selbst untersuchen',summary:'Drei Erfindungskarten erklären, wie Licht beim Fotografieren und Vergrößern hilft. Eigene bedienbare Modelle und freiwillige Denkstufen laden zum Vergleichen ein.',details:['Bei der Kamera kannst du kleine und große Öffnungen vergleichen. Beim Fernrohr und Mikroskop untersuchst du Teile und Lichtwege in vereinfachten Modellen.','Drei freiwillige Vertiefungen und sechs Denkhandlungen helfen beim Beobachten, Erklären und Übertragen. Hinweise und Rückmeldungen begleiten deine Antworten.','Fünf erklärte Wissensverbindungen führen in beide Richtungen zu Smartphone, Satellit und Sonnensystem sowie zwischen den optischen Erfindungen.','Alte Technikfragen, Antworten und gespeicherte Spielreihenfolgen bleiben erhalten. Klare Modellgrenzen und ein Sonnenwarnhinweis helfen beim sicheren Einordnen.'],benefit:'Du kannst eine Vermutung ausprobieren und erklären, was ein Lichtmodell zeigt und was es nicht vorhersagt.',links:[{label:'Die Wissenswelten entdecken',hash:'world'}]},

 44:{id:'historical-source-discovery-3-5',icon:'🔎',category:'Neue Inhalte',title:'Knoten und Stadtpläne als Spuren untersuchen',summary:'Mit Khipu-Schnüren und einem erfundenen Stadtplan zu Mohenjo-Daro kannst du zählen, vergleichen und Vermutungen prüfen. Die Zeichnungen zeigen Lernmodelle mit klaren Grenzen.',details:['Zwei neue Geschichtskarten erklären Khipus und die archäologischen Spuren von Mohenjo-Daro anhand benannter Originalquellen.','Drei freiwillige Denkstufen unterscheiden Beobachten, Vergleichen und die Grenzen einer Aussage. Hinweise und Rückmeldungen helfen beim Weiterdenken.','Du kannst zwei Zählmengen verändern oder einen eingezeichneten Wasserweg mit einem Vergleichsplan prüfen. Eigene Schemata sind als erfunden gekennzeichnet.','Vier erklärte Wissenswege verbinden die neuen Karten mit Schrift, Weben und Rom. Alte Antworten und Lernstände bleiben erhalten.'],benefit:'Du lernst, was eine Spur zeigt und welche zusätzliche Information du für eine Schlussfolgerung brauchst.',links:[{label:'Die Wissenswelten entdecken',hash:'world'}]},
 43:{id:'journey-diagram-clarity-3-5',icon:'🌍',category:'Spielen und Lernen',title:'Erdplatten und Bewegungen klarer verstehen',summary:'Überarbeitete Lernbilder zeigen genauer, wie sich Erdplatten bewegen und welche Gesteinsschichten dazugehören. Drei Denkaufgaben helfen dir, typische Verwechslungen zu prüfen.',details:['Beim seitlichen Vorbeigleiten zeigen zwei parallele Pfeile die entgegengesetzten Richtungen. Auseinanderdriften und Zusammenstoßen bleiben eigene Bewegungsarten.','Kruste und starrer oberster Mantel gehören zusammen zu einer Erdplatte. Darunter liegt überwiegend festes, langsam verformbares Gestein.','Fünf Schaubilder zeigen getrennte Pfeilspitzen und klare Modellgrenzen; gleich große Materialfelder behaupten keine gemessenen Mengen.','Drei Aufgaben bieten passendere Hinweise oder nachvollziehbare falsche Erklärungen mit eigener Rückmeldung. Richtige Antworten und vorhandene Lernstände bleiben erhalten.'],benefit:'Du kannst Zeichnungen und Erklärungen besser miteinander vergleichen und typische Denkfehler selbst entdecken.',links:[{label:'Die Lernreisen entdecken',hash:'journeys'}]},
 36:{id:'prepared-search-3-5',icon:'🔎',category:'Einfachere Bedienung',title:'Die Suche bereitet bekannte Begriffe vor',summary:'Namen und Suchhinweise werden einmal vorbereitet. Beim Tippen muss die Suche dieselben Wörter dadurch seltener erneut bearbeiten.',details:['Die Suche bereitet Namen, Vorschautexte und Schreibvarianten einmal vor, statt sie bei jedem Tastendruck erneut zu bearbeiten.','Ändert sich der geladene Katalog, wird auch die Vorbereitung erneuert.','Die bisherige Bewertung der Treffer, die Hilfe bei kleinen Tippfehlern und die vertrauten Rückwege bleiben erhalten.'],benefit:'Die Suche erledigt beim wiederholten Tippen weniger unnötige Arbeit. Deine bisherigen Suchwege und Lernstände bleiben erhalten.',links:[{label:'Wissenswelten durchsuchen',hash:'world'}]},
 "39": ANIMAL_EXPANSION_COPY,
 38:LAB_FEEDBACK_COPY,
 35:JOURNEY_SOURCE_COPY,
 33:ANIMAL_SOLAR_COPY,
 32:JOURNEY_SUPPORT_COPY,
 30:OFFLINE_COPY,
 29:{
 "id": "clear-update-chronicle",
 "icon": "🧭",
 "category": "Einfachere Bedienung",
 "title": "Neuigkeiten leichter überblicken",
 "summary": "Die Entwicklungsgeschichte erklärt konkrete Verbesserungen mit kurzen Texten und freiwilligen Details. Kategorien und klare Datumsangaben helfen dir, passende Neuigkeiten zu finden.",
 "details": [
  "Auch die älteren Einträge erklären konkret, was du entdecken oder leichter bedienen kannst.",
  "Kurze Zusammenfassungen und freiwillige Einzelheiten halten die Übersicht ruhig.",
  "Zeitangaben und Nachweise bleiben erhalten; vorbereitete Änderungen werden nicht als verfügbar angezeigt.",
  "Spielplatz: Eine mit der Tastatur geöffnete Spielhilfe behält deinen Platz. Auch nach einem schnellen Bereichswechsel kannst du sie mit Enter wieder schließen."
 ],
 "benefit": "Du kannst schneller erkennen, welche Änderung dir hilft und wo du sie findest.",
 "links": [
  {
   "label": "Was ist neu?",
   "hash": "updates"
  }
 ]
},
 "3": {
  "id": "test-website",
  "icon": "🚀",
  "category": "Bereitstellung",
  "title": "Ein eigener Platz zum Ausprobieren",
  "summary": "Eine eigene Testversion macht neue Verbesserungen vor ihrer Freigabe für die Hauptwebsite ausprobierbar. Dieser erste belegte Teststand enthielt die bereits vorhandene Lernwelt.",
  "details": [
   "Der hier erste belegte Testwebsite-Stand stellt die erhaltene Lernwelt bereit."
  ],
  "benefit": "Ihr könnt Verbesserungen auf der Testwebsite kennenlernen. Eine erfolgreiche Testbereitstellung bedeutet weiterhin keine Veröffentlichung auf der Hauptwebsite.",
  "links": [
   {
    "label": "Lernwelt entdecken",
    "hash": "globe"
   }
  ]
 },
 "9": {
  "id": "connected-discoveries",
  "icon": "🌿",
  "category": "Neue Inhalte",
  "title": "Was verbindet Pflanzen, Wasser und den Mond?",
  "summary": "Was haben Pflanzen, Wasser und der Mond miteinander zu tun? Acht neue Wissenskarten und zwei zusätzliche Routen verbinden diese Themen; die Challenge bietet drei frei wählbare Stufen.",
  "details": [
   "Wasser, Fotosynthese, Bestäubung, Pilze, Korallenriffe, Mondphasen, Jahreszeiten und Gezeiten ergänzen den Katalog auf 116 Karten.",
   "Zwei zusätzliche Lernrouten und erklärte Wissensverbindungen verbinden neue und vorhandene Themen.",
   "Zwei bedienbare Modelle helfen beim Ausprobieren.",
   "Die Challenge bietet sechs Aufgaben pro Runde; leicht, mittel und schwer bleiben frei wählbar.",
   "Begonnene Challenge-Runden lassen sich im vorhandenen Entdeckerpass fortsetzen."
  ],
  "benefit": "Du kannst erkennen, vergleichen oder weiterdenken, ohne eine feste Altersstufe zugewiesen zu bekommen. Eltern finden zusammenhängende Themen für gemeinsames Forschen.",
  "links": [
   {
    "label": "Wissenswelten",
    "hash": "world"
   },
   {
    "label": "Spielplatz",
    "hash": "games"
   }
  ]
 },
 "10": {
  "id": "hint-correction",
  "icon": "🧩",
  "category": "Spielen und Lernen",
  "title": "Ein Denkanstoß statt der fertigen Lösung",
  "summary": "Ein freiwilliger Hinweis hilft dir beim Überlegen, ohne gleich die Lösung zu zeigen. Erst eine richtige Antwort öffnet die vollständige Erklärung.",
  "details": [
   "Alle drei Challenge-Stufen bieten freiwillige Denkhinweise.",
   "Nach einer falschen Antwort bleibt die vollständige Auflösung verborgen.",
   "Eine richtige Antwort öffnet die zugehörige Erklärung.",
   "Die nächste Aufgabe beginnt wieder mit geschlossenem Hinweis."
  ],
  "benefit": "Du behältst die Gelegenheit, selbst auf die Lösung zu kommen. Eltern können einen Hinweis gemeinsam besprechen, ohne die Antwort schon zu verraten.",
  "links": [
   {
    "label": "Spielplatz",
    "hash": "games"
   }
  ]
 },
 "11": {
  "id": "individual-hints",
  "icon": "💡",
  "category": "Spielen und Lernen",
  "title": "Jede Frage bekommt ihren eigenen Denkanstoß",
  "summary": "Die Hilfe passt jetzt zur Frage, die du gerade löst. Bei ausgewählten Challenge-Aufgaben kannst du freiwillig einen zweiten Denkschritt öffnen.",
  "details": [
   "Jede der 142 spielbaren Fragen erhält einen eigenen Einstiegshinweis.",
   "38 Fragen bieten einen zweiten, gezielteren Denkschritt; insgesamt gibt es 180 Hinweise.",
   "Themenname und Vorlesen machen auch allgemein formulierte Fragen verständlicher.",
   "Die vollständige Erklärung bleibt bis zur richtigen Antwort verborgen."
  ],
  "benefit": "Du bekommst Hilfe zur aktuellen Frage statt allgemeiner Tipps. Eltern können schrittweise unterstützen; der zweite Hinweis ist eine bewusste Wahl.",
  "links": [
   {
    "label": "Spielplatz",
    "hash": "games"
   }
  ]
 },
 "12": {
  "id": "discovery-centre",
  "icon": "✨",
  "category": "Einfachere Bedienung",
  "title": "Die ganze Wissenswelt auf einen Blick",
  "summary": "Wähle auf der Startseite eine Wissenswelt, suche nach einer Frage oder folge einer Wissensspur. Auch eine begonnene Challenge kannst du direkt wieder aufnehmen.",
  "details": [
   "Sechs Themenzugänge führen von der Startseite in die vorhandenen Wissenswelten.",
   "Die Suche und die Weltkugel sind direkt erreichbar.",
   "Drei wählbare Wissensspuren verbinden je zwei passende Karten und eine Lernroute.",
   "Ein direkter Challenge-Einstieg berücksichtigt begonnene Runden."
  ],
  "benefit": "Du findest einen Anfang, der zu deiner Neugier passt. Eltern erkennen schneller, welche Themen und Lernwege bereits vorhanden sind.",
  "links": [
   {
    "label": "Entdecken",
    "hash": "globe"
   }
  ]
 },
 "14": {
  "id": "science-articles",
  "icon": "🌙",
  "category": "Anschaulicher erklärt",
  "title": "Mond und Meer verständlich erforschen",
  "summary": "Warum verändert der Mond seine Form und weshalb steigt das Wasser an einer Küste? Erklärzeichnungen, ein Küstenvergleich und besser lesbare Beschriftungen helfen dir beim Forschen.",
  "details": [
   "Artikel bieten Sprungziele zu Erklärungen, Forschung, Fragen und passenden vorhandenen Lernrouten.",
   "Eigene Zeichnungen erklären Mondphasen, Gezeiten und Meeresströmungen.",
   "Ein Vergleich zeigt dieselbe Beispielküste bei zwei Wasserständen.",
   "Grafikbeschriftungen stehen auch auf schmalen Smartphones als separater Text mit gut lesbarer Schrift; Alternativtexte und Modellgrenzen bleiben erhalten.",
   "110 Mini-Fragen verwenden passende Denkhinweise; die Auflösung folgt erst nach einer richtigen Antwort."
  ],
  "benefit": "Du kannst zwischen Lesen, Beobachten und Ausprobieren wechseln. Eltern können Zeichnungen gemeinsam erklären und auch auf kleinen Bildschirmen die Beschriftungen lesen.",
  "links": [
   {
    "label": "Mondphasen",
    "hash": "world/topic/science-moon-phases"
   },
   {
    "label": "Wissenswelten",
    "hash": "world"
   }
  ]
 },
 "15": {
  "id": "explorer-pass",
  "icon": "🎒",
  "category": "Einfachere Bedienung",
  "title": "Ein klarer Platz für deine Entdeckungen",
  "summary": "Im Entdeckerpass findest du deine Entdeckungen, Lernwege, Sicherungen und Einstellungen in eigenen Abschnitten. Die wichtigsten Wege bleiben auch beim Scrollen erreichbar.",
  "details": [
   "Übersicht, Lernwege, Sicherung und Einstellungen sind direkt anwählbar.",
   "Schließen und „Weiter entdecken“ bleiben beim Scrollen erreichbar.",
   "Sämtliche Abzeichen bleiben in aufklappbaren Sammlungen verfügbar.",
   "Sichern und Wiederherstellen erhalten getrennte, verständliche Flächen.",
   "Große Schrift und weniger Bewegung gelten auch im Pass; lange ausgewählte Stimmennamen sind vollständig lesbar."
  ],
  "benefit": "Du findest deine Entdeckungen leichter wieder. Eltern gelangen ohne langes Scrollen zu Sicherungen und Einstellungen; bisherige Lernstände und Spielrunden bleiben erhalten.",
  "links": []
 },
 "16": {
  "id": "calm-connections",
  "icon": "🔗",
  "category": "Einfachere Bedienung",
  "title": "Zusammenhänge mit mehr Ruhe lesen",
  "summary": "Warum hängen zwei Themen zusammen? Ruhigere Abstände und feine Trennlinien machen die Erklärungen leichter lesbar; die direkten Wege zum Weiterentdecken bleiben erhalten.",
  "details": [
   "Die grünen vertikalen Balken neben den Erklärungen entfallen.",
   "Mehr Abstand und dezente horizontale Linien trennen die Einträge.",
   "Klare Linktitel ersetzen farbige Kachelhintergründe; Pfeile und sichtbarer Tastaturfokus bleiben."
  ],
  "benefit": "Ihr könnt euch leichter auf den Zusammenhang konzentrieren und die passenden Themen weiterhin direkt öffnen.",
  "links": [
   {
    "label": "Wissenswelten",
    "hash": "world"
   }
  ]
 },
 "17": {
  "id": "explorer-pass-fine",
  "icon": "🏅",
  "category": "Einfachere Bedienung",
  "title": "Mehr Luft im kleinen Entdeckerpass",
  "summary": "Auf kleinen Bildschirmen zeigt dein Pass die wichtigsten Informationen zuerst. Größere Schalter und klar gegliederte Einstellungen lassen mehr Platz zum Lesen und Antippen.",
  "details": [
   "Der kompaktere Passkopf lässt bei großer Schrift mehr Platz für den Inhalt.",
   "Hauptwerte stehen in klaren Gruppen; zusätzliche Statistiken bleiben freiwillig aufklappbar.",
   "Sichern und Wiederherstellen stehen vor den längeren Zusatzhinweisen.",
   "Einstellungen erhalten getrennte Gruppen und größere Touchflächen für Schalter.",
   "Abschnittswege fokussieren die Überschrift mit einem schmalen, kontrastreichen Rahmen; auch Hovertexte bleiben gut lesbar."
  ],
  "benefit": "Du kannst die wichtigsten Werte schneller erfassen. Eltern erreichen Sicherungen und Einstellungen auch mit großer Schrift; alle Lernstände, Abzeichen und Funktionen bleiben erhalten.",
  "links": []
 },
 "18": {
  "id": "first-visit-home",
  "icon": "🧭",
  "category": "Einfachere Bedienung",
  "title": "Ein guter Anfang für deine Neugier",
  "summary": "Neu hier? Die Startseite zeigt dir einen klaren ersten Schritt zur Weltkugel oder Suche; begonnene Lernaktivitäten lassen sich an der passenden Station fortsetzen.",
  "details": [
   "Weltkugel und Suche stehen als erste Aktionen bereit.",
   "Fünf geordnete Hauptbereiche und sechs Weltenkarten erschließen die vorhandenen Lernwege.",
   "Begonnene Lernaktivitäten lassen sich am passenden Kapitel fortsetzen.",
   "Zurück bringt dich an die vorherige Stelle und erhält offene Abschnitte sowie deine gewählte Wissensspur.",
   "„Was ist neu?“ unterscheidet frühere Sites-Veröffentlichungen, bestätigte Testupdates und Änderungen ohne Bereitstellungsnachweis."
  ],
  "benefit": "Du findest schneller einen freiwilligen ersten Schritt oder deine Fortsetzung. Eltern erkennen, was die Lernwelt bietet und welche Verbesserungen tatsächlich verfügbar sind.",
  "links": [
   {
    "label": "Entdecken",
    "hash": "globe"
   }
  ]
 },
 "19": {
  "id": "history-polish",
  "icon": "🖼️",
  "category": "Einfachere Bedienung",
  "title": "Die Entwicklungsgeschichte wird anschaulicher",
  "summary": "Du kannst die Entwicklung schneller überblicken: Kurze Zusammenfassungen nennen die wichtigsten Änderungen. Einzelheiten und ihren Nutzen öffnest du nur bei Interesse.",
  "details": [
   "Die bestehenden Einträge nennen konkrete belegte Änderungen.",
   "Aufklappbare Details erläutern den Nutzen für Kinder und Eltern.",
   "Klare Datumszeilen, ruhige Symbole und dezente Trennlinien ordnen die Zeitleiste."
  ],
  "benefit": "Familien können die Entwicklung überblicken und nur bei Interesse mehr lesen.",
  "links": []
 },
 "20": {
  "id": "clear-main-navigation",
  "icon": "🧭",
  "category": "Einfachere Bedienung",
  "title": "Wissenswelten sind wieder direkt erreichbar",
  "summary": "Wissenswelten, Spiele, Forscherlabor, Lernreisen und Wissensbuch sind direkt erreichbar. Die sechs Hauptbereiche passen sich deinem Bildschirm an und behalten verständliche Namen.",
  "details": [
   "Wissenswelten sind auch innerhalb ihrer Themenkarten und Lernrouten als eigener Bereich erkennbar.",
   "Die Übersicht nennt ihre verknüpften Kartenwege klar Wissensrouten; Lernreisen bleiben der eigene Bereich für geführte Kapitel.",
   "Die Navigation ordnet alle sechs Bereiche auf Smartphones in zwei, auf Tablets in drei und auf breiten Bildschirmen in sechs Spalten an.",
   "Lesbare Namen, große Touchziele und sichtbarer Tastaturfokus erleichtern die Auswahl auch mit größerer Schrift.",
   "Die Suche findet die Weltenübersicht und Kategorien; Browser-Zurück bringt den Fokus wieder zur geöffneten Karte, Wissensverknüpfung oder Lernroute."
  ],
  "benefit": "Du kannst Wissen und Spiele leichter unterscheiden. Eltern können direkt zu einem Bereich wechseln und nach einer Entdeckung zuverlässig zurückkehren.",
  "links": [
   {
    "label": "Alle Wissenswelten",
    "hash": "world"
   },
   {
    "label": "Weltkugel entdecken",
    "hash": "globe"
   }
  ]
 },
 "21": {
  "id": "playground-2",
  "icon": "🧩",
  "category": "Spielen und Lernen",
  "title": "31 Spielideen, ein klarer Einstieg",
  "summary": "Finde unter 31 Spielangeboten eine passende Idee und erkenne, wo du eine Runde fortsetzen kannst. Lebensräume und Fakten-Detektiv bieten neue Denkaufgaben und freiwillige Hilfen.",
  "details": [
   "Freiwillige Themen- und Spielartfilter, Lernziele, Altersorientierung und erkennbare Rundenstände erleichtern die Auswahl.",
   "Lebensräume und Fakten-Detektiv bieten jeweils leicht, mittel und schwer: Grundlagen erkennen, Zusammenhänge vergleichen und Wissen übertragen. 24 konkrete Aufgaben bilden die sechs Stufenrunden.",
   "Zwei freiwillige Denkschritte unterstützen jede neue Aufgabe; falsche Antworten bekommen eine passende Erklärung und lassen sich ohne Punktabzug korrigieren.",
   "Im Sortierspiel bleibt ein fehlerhafter Bau erhalten: Bausteine lassen sich entfernen und neu einordnen, statt alles neu mischen zu müssen.",
   "Neue Runden lassen sich fortsetzen; unsichere Aufgaben freiwillig wiederholen. Passende vorhandene Wissenskarten und Routen führen weiter, alte gespeicherte Runden und Stempel bleiben erhalten."
  ],
  "benefit": "Du findest leichter einen passenden Einstieg und kannst selbst entscheiden, wie viel Hilfe du brauchst. Eltern bekommen konkrete Lernziele und können gemeinsam vergleichen, erklären oder eine Pause machen.",
  "links": [
   {
    "label": "Spielplatz entdecken",
    "hash": "games"
   }
  ]
 },
 "22": {
  "id": "foundation-2a",
  "icon": "🛠️",
  "category": "Einfachere Bedienung",
  "title": "Mehr Ruhe beim Laden und Entdecken",
  "summary": "Große Lernbereiche laden erst, wenn du sie öffnest. Klarere Auswahlflächen und verständliche Lade- oder Fehlermeldungen helfen dir auf kleinen und großen Bildschirmen weiter.",
  "details": [
   "Spielauswahl, Forscherlabor und Wissensrouten teilen lesbare Raster mit passenden Abständen und großen Touchflächen.",
   "Weltkugel, Wissensartikel, Spiele und zusätzliche Dialoginhalte werden bei Bedarf geladen; die Kartenübersicht bleibt direkt erreichbar.",
   "Lade-, Leer- und Fehlermeldungen erklären den nächsten Schritt; freiwillige Details bleiben mit der Tastatur bedienbar.",
   "Abstände und Schrift passen sich an schmale und breite Bildschirme an; große Auswahlflächen lassen sich leichter antippen.",
   "Deine Lernstände und die Vorbereitung zum Lernen ohne Internet bleiben erhalten."
  ],
  "benefit": "Du kannst dich auf deine nächste Entdeckung konzentrieren. Eltern erhalten besser lesbare Auswahlflächen und klare Rückmeldungen, während große Inhalte erst bei Bedarf geladen werden.",
  "links": [
   {
    "label": "Spielplatz",
    "hash": "games"
   },
   {
    "label": "Forscherlabor",
    "hash": "labs"
   }
  ]
 },
 "23": {
  "id": "research-2b",
  "icon": "🧪",
  "category": "Spielen und Lernen",
  "title": "Selbst vermuten, vergleichen und weiterforschen",
  "summary": "Halte eine Vermutung fest, vergleiche zwei Beobachtungen und erkläre dein Ergebnis. Alle elf digitalen Labore bieten eigene Forschungsaufgaben; praktische Versuche und passende Wissenswege führen weiter.",
  "details": [
   "In allen elf Laboren lassen sich zwei Beobachtungen festhalten, Bedingungen vergleichen und eigene Erklärungen im vorhandenen Entdeckerpass sichern.",
   "Jahreszeiten zeigen Tageslänge und Sonnenstand; das Mondmodell erklärt Bahnknoten und Finsternis-Ausrichtungen, Gezeitenkurven vergleichen Mond- und Sonnenbeiträge. Alle drei benennen ihre Modellgrenzen.",
   "Sechs praktische Versuche erhalten sichere Vergleichsaufgaben; bestehende Globusmissionen führen auf Wunsch in ein passendes Labor.",
   "Die Suche öffnet sofort und findet auch Labore und praktische Versuche. Acht erklärte Wissensspuren bieten passende konkrete Aktivitäten und Rückwege.",
   "Die sicheren Vergleichsaufgaben und erklärten Wissenswege lassen sich zusammen mit den vorhandenen Lernständen weiter nutzen."
  ],
  "benefit": "Du kannst eine Vermutung selbst prüfen und dein Ergebnis erklären. Familien finden passende gemeinsame Versuche und behalten ihre bisherigen Lernstände; Sicherheitshinweise gehören zu jedem praktischen Versuch.",
  "links": [
   {
    "label": "Forscherlabor",
    "hash": "labs"
   },

  ]
 },
 "25": {
  "id": "journeys-3",
  "icon": "🧭",
  "category": "Spielen und Lernen",
  "title": "Lernreisen: nicht nur lesen, selbst weiterdenken",
  "summary": "Entdecken, erklären, übertragen: Jede Lernreise bietet eigene Kapitelziele und freiwillige Denkaufgaben. Private Merkzettel und direkte Kapiteladressen helfen dir, später wieder anzuknüpfen.",
  "details": [
   "Alle 80 Inhaltskapitel erhalten eigene Aufgaben zum Entdecken, Erklären und Übertragen.",
   "Freiwillige Hinweise und konkrete Rückmeldungen helfen beim Weiterdenken.",
   "Kapiteladressen und Kapitelkarten erleichtern das Zurückkehren zur richtigen Station.",
   "Private Merkzettel bleiben im vorhandenen Entdeckerpass; bisherige Stempel und Spielstände werden erhalten.",
   "Lesbare Grafikbeschriftungen und ruhige Abstände unterstützen kleine Bildschirme und größere Schrift."
  ],
  "benefit": "Du kannst Zusammenhänge selbst erklären und später an deine eigenen Gedanken anknüpfen. Eltern behalten den bisherigen Lernstand und die vertrauten Sicherungen.",
  "links": [
   {
    "label": "Lernreisen",
    "hash": "journeys"
   }
  ]
 },
 "26": {
  "id": "excellence-foundation-3-5",
  "icon": "🧭",
  "title": "Passende Reisestationen leichter finden",
  "summary": "Zu einem Wissensartikel findest du alle passenden Stationen einer Lernreise. Weitere Stationen kannst du aufklappen; beim Zurückkehren bleibt dein vorheriger Platz erhalten.",
  "details": [
   "Die erste passende Station bleibt direkt sichtbar.",
   "Weitere Stationen derselben Reise lassen sich freiwillig aufklappen.",
   "Beim Zurückkehren bleiben aufgeklappte Stationen und der Tastaturfokus erhalten."
  ],
  "benefit": "Kinder und Eltern können ein Thema an mehreren passenden Stationen weiterverfolgen.",
  "links": [
   {
    "label": "Wissenswelten",
    "hash": "world"
   },
   {
    "label": "Lernreisen",
    "hash": "journeys"
   }
  ],
  "category": "Einfachere Bedienung"
 }
};

const PREPARED_ANIMAL_SOLAR:UpdateEntry={...ANIMAL_SOLAR_COPY,version:'Tierwerkstatt und Planetenvergleich',channel:'vercel-test',status:'prepared',confirmedOn:'2026-10-17',publishedOn:null,availableOn:null,occurredAt:null,links:[],evidence:{pullRequest:33,file:'content/animal-editorial-review.json',revision:'prepared',quote:'Implementierter Lieferabschnitt; noch keine bestätigte Übernahme oder Bereitstellung.'}};
const TEST_UPDATES=TEST_EVIDENCE.pullRequests.flatMap(record=>TEST_COPY[record.number]?[testUpdate(record,TEST_COPY[record.number])]:[]);
// The actual PR number is assigned by GitHub, never guessed before creating it.
// Reconcile this same stable identity with its real merge/deployment on the next GO.

const PREPARED_JOURNEY_SUPPORT:UpdateEntry={...JOURNEY_SUPPORT_COPY,version:'Lernhilfen',channel:'vercel-test',status:'prepared',confirmedOn:'2026-10-17',publishedOn:null,availableOn:null,occurredAt:null,links:[],evidence:{file:'content/journey-task-review.json',revision:'prepared',quote:'Individuelle Reise-Lernhilfen, noch ohne bestätigte Übernahme und Testbereitstellung.'}};
export const UPDATE_HISTORY:UpdateEntry[]=[...SITES_HISTORY,...TEST_UPDATES.filter(e=>e.status==='test-available')];
const PREPARED_JOURNEYS:UpdateEntry={...JOURNEY_COPY,version:'Paket 3',channel:'vercel-test',status:'prepared',confirmedOn:'2026-10-12',publishedOn:null,availableOn:null,occurredAt:null,summary:'Die Lernreise-Verbesserungen sind vorbereitet; ihre Bereitstellung ist noch unbestätigt.',links:[],evidence:{file:'BACKLOG.md',revision:'d6945c8',quote:'WK-048: Lernreisen 2.0 – alle 16 Reisen/80 Kapitel ganzheitlich modernisieren.'}};

const PREPARED_ANIMAL_EXPANSION:UpdateEntry={...ANIMAL_EXPANSION_COPY,version:'Neue Tierarten',channel:'vercel-test',status:'prepared',confirmedOn:'2026-10-17',publishedOn:null,availableOn:null,occurredAt:null,links:[],evidence:{pullRequest:39,file:'content/animal-expansion-review.json',revision:'prepared',quote:'Eigener Tierabschnitt; Verfügbarkeit nur mit bestätigter Übernahme und Bereitstellung.'}};
const PREPARED_LAB_FEEDBACK:UpdateEntry={...LAB_FEEDBACK_COPY,version:'Labor-Rückmeldungen',channel:'vercel-test',status:'prepared',confirmedOn:'2026-10-17',publishedOn:null,availableOn:null,occurredAt:null,links:[],evidence:{file:'content/research-editorial-review.json',revision:'prepared',quote:'Eigener Labor-Lieferabschnitt; noch kein bestätigter Merge oder Bereitstellungsnachweis.'}};
const PREPARED_JOURNEY_SOURCES:UpdateEntry={...JOURNEY_SOURCE_COPY,version:'Lesbare Quellen',channel:'vercel-test',status:'prepared',confirmedOn:'2026-10-17',publishedOn:null,availableOn:null,occurredAt:null,links:[],evidence:{file:'CHANGELOG.md',revision:'prepared',quote:'Lesbare und leichter antippbare Quellenlinks; noch kein bestätigter Merge oder Vercel-Erfolg.'}};
export const PREPARED_UPDATES:UpdateEntry[]=[...(!TEST_UPDATES.some(e=>e.id===PREPARED_ANIMAL_EXPANSION.id)?[PREPARED_ANIMAL_EXPANSION]:[]),...(!TEST_UPDATES.some(e=>e.id===PREPARED_LAB_FEEDBACK.id)?[PREPARED_LAB_FEEDBACK]:[]),...(!TEST_UPDATES.some(e=>e.id===PREPARED_JOURNEY_SOURCES.id)?[PREPARED_JOURNEY_SOURCES]:[]),...(!TEST_UPDATES.some(e=>e.id===PREPARED_ANIMAL_SOLAR.id)?[PREPARED_ANIMAL_SOLAR]:[]),...TEST_UPDATES.filter(e=>e.status==='prepared'),...(!TEST_UPDATES.some(e=>e.id===PREPARED_JOURNEYS.id)?[PREPARED_JOURNEYS]:[]),...(!TEST_UPDATES.some(e=>e.id===PREPARED_JOURNEY_SUPPORT.id)?[PREPARED_JOURNEY_SUPPORT]:[])];
export const updateLabel=(entry:UpdateEntry)=>entry.channel==='sites'?`Frühere Website · Version ${entry.version}`:entry.status==='prepared'?'In Vorbereitung · noch nicht verfügbar':'Testversion · verfügbar';
const updateDay=(entry:UpdateEntry)=>entry.availableOn??entry.publishedOn??entry.confirmedOn;
export function publicUpdates(entries:readonly UpdateEntry[]=UPDATE_HISTORY){
 return entries.filter(e=>e.status==='publication-confirmed'&&e.channel==='sites'||e.status==='test-available'&&e.channel==='vercel-test'&&e.availableOn!==null).toSorted((a,b)=>updateDay(b).localeCompare(updateDay(a))||(Date.parse(b.occurredAt??'')||0)-(Date.parse(a.occurredAt??'')||0)||Number(b.version)-Number(a.version));
}
export function updateDate(entry:UpdateEntry){
 if(entry.occurredAt&&Number.isFinite(Date.parse(entry.occurredAt)))return formatHistoryInstant(entry.occurredAt);
 return formatHistoryDay(updateDay(entry));
}
export const formatHistoryInstant=(timestamp:string)=>new Intl.DateTimeFormat('de-DE',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',timeZone:'Europe/Berlin',timeZoneName:'short'}).format(new Date(timestamp));
export const formatHistoryDay=(date:string)=>new Intl.DateTimeFormat('de-DE',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Berlin'}).format(new Date(date+'T12:00:00Z'));
