import WaterMoonDrawing from './water-moon-drawing';
import ScienceDiagram,{hasScienceDiagram} from './science-diagram';
import AnimalIllustration,{hasAnimalIllustration} from './animal-illustration';
import PeopleIllustration,{hasPeopleIllustration} from './people-illustration';
import DeviceIllustration,{hasDeviceIllustration} from './device-illustration';
export const hasTopicIllustration=(id:string)=>((id!=='science-photosynthesis')&&hasScienceDiagram(id))||hasAnimalIllustration(id)||hasPeopleIllustration(id)||hasDeviceIllustration(id)||['science-moon-phases','science-tides','science-currents'].includes(id);
/** Original explanatory drawings; HTML labels retain their size on small screens. */
export default function TopicIllustration({id,compact=false}:{id:string;compact?:boolean}){
 if(id!=='science-photosynthesis'&&hasScienceDiagram(id))return <ScienceDiagram id={id} compact={compact}/>;
 if(hasAnimalIllustration(id))return <AnimalIllustration id={id} compact={compact}/>;
 if(hasPeopleIllustration(id))return <PeopleIllustration id={id} compact={compact}/>;
 if(hasDeviceIllustration(id))return <DeviceIllustration id={id} compact={compact}/>;
 return <WaterMoonDrawing id={id} compact={compact}/>;
}
