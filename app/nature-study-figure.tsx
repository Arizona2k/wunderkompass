import Water from './book-nature-water-figure';
import Geology from './book-nature-geology-figure';
import Habitats from './book-nature-habitats-figure';
import Landforms from './book-nature-landforms-figure';
import Coast from './book-nature-coast-figure';
import Process from './book-nature-process-figure';
import Geoscience from './book-nature-geoscience-figure';
import FinalSix from './book-nature-final-six-figure';
import type {NatureWaterFigureKind} from './book-nature-water-models';
import type {NatureGeologyFigureKind} from './book-nature-geology-models';
import type {NatureHabitatFigureKind} from './book-nature-habitats-models';
import type {NatureLandformFigureKind} from './book-nature-landforms-models';
import type {NatureCoastFigureKind} from './book-nature-coast-models';
import type {NatureProcessFigureKind} from './book-nature-process-models';
import type {NatureGeoscienceFigureKind} from './book-nature-geoscience-models';
import type {NatureFinalSixFigureKind} from './book-nature-final-six-models';
export function NatureFigure({family,kind,headingLevel}:{family:string;kind:string;headingLevel:3|5}){
 if(family==='water')return <Water kind={kind as NatureWaterFigureKind} headingLevel={headingLevel}/>;
 if(family==='geology')return <Geology kind={kind as NatureGeologyFigureKind} headingLevel={headingLevel}/>;
 if(family==='habitats')return <Habitats kind={kind as NatureHabitatFigureKind} headingLevel={headingLevel}/>;
 if(family==='landforms')return <Landforms kind={kind as NatureLandformFigureKind} headingLevel={headingLevel}/>;
 if(family==='coast')return <Coast kind={kind as NatureCoastFigureKind} headingLevel={headingLevel}/>;
 if(family==='process')return <Process kind={kind as NatureProcessFigureKind} headingLevel={headingLevel}/>;
 if(family==='geoscience')return <Geoscience kind={kind as NatureGeoscienceFigureKind} headingLevel={headingLevel}/>;
 if(family==='final-six')return <FinalSix kind={kind as NatureFinalSixFigureKind} headingLevel={headingLevel}/>;
 throw Error('Unbekannte Naturzeichnung');
}
