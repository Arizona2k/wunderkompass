import DATA from '../../app/animal-inquiries.json' with {type:'json'};
export const animalCases=(widths,states=['normal','large'])=>DATA.entries.flatMap(e=>widths.flatMap(width=>states.map(state=>({id:e.id,width,state,levels:[0,1,2],bothEvidence:true,wrongAndCorrect:true,keyboard:true,geometry:true}))));
export const animalProof=(widths=[320,360,390,768,1024,1440,1920])=>({observed:animalCases(widths),focusChecks:widths.map(width=>({width,state:'large',tabNavigation:true,active:true,visible:true,outlineWidth:3,outlineStyle:'solid'})),seconds:1,oldSessionsPreserved:true,largeText:true,axe:true,navigation:true,independentAcceptance:false});
export const animalNativeProof=()=>({percent:200,cssWidth:640,scale:2,screenshot:{pixelWidth:1280,sampledColors:2},observed:animalCases([640],['large'])});
export const animalOfflineProof=()=>({coldRestart:true,observed:animalCases([1280],['offline'])});

export const solarCases=(widths,states=['normal','large'])=>['Merkur','Venus','Erde','Mars','Jupiter','Saturn','Uranus','Neptun'].flatMap(planet=>['diameters','distances'].flatMap(mode=>widths.flatMap(width=>states.map(state=>({planet,mode,width,state,readableHTML:true,geometry:true,originalScale:true,keyboard:true})))));
export const solarProof=(widths=[320,360,390,402,768,1024,1440,1920])=>({observed:solarCases(widths),seconds:1,axe:true,clippingGuard:true});
export const solarNativeProof=()=>({percent:200,cssWidth:640,scale:2,captures:[0,1].map(()=>({cssWidth:640,scale:2,pixelWidth:1280,sampledColors:2})),observed:solarCases([640],['large'])});

export const solarOfflineProof=()=>({coldRestart:true,observed:solarCases([1280],['offline'])});
