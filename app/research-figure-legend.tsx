import {RESEARCH_PATHS} from './research-catalog';

/** Reuse the existing model description beside its figure, including in chapters. */
export default function ResearchFigureLegend({id}:{id:string}){
 return <ul className="research-figure-legend" aria-label="Legende zum Modell">{RESEARCH_PATHS[id].legend.map(text=><li key={text}>{text}</li>)}</ul>;
}
