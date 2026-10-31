import {GeneOutputFigure,NucleotidePartsFigure,RNARolesFigure} from './book-gene-information-figures';
import {ChromosomeCycleFigure,EnzymeBarrierFigure,MutationSequenceFigure} from './book-gene-process-figures';
import {ProteinRolesFigure,GeneContextFigure,BacteriaFormsFigure} from './book-gene-context-figures';
import './book-gene-figures.css';
export type GeneFigureKind='gene-output'|'chromosome-cycle'|'protein-roles'|'enzyme-barrier'|'sequence-change'|'nucleotide-parts'|'rna-roles'|'bacteria-forms'|'gene-context';
export default function BookGeneFigure({kind}:{kind:GeneFigureKind}){
 return <div data-book-gene-figure={kind}>{kind==='gene-output'?<GeneOutputFigure/>:kind==='chromosome-cycle'?<ChromosomeCycleFigure/>:kind==='protein-roles'?<ProteinRolesFigure/>:kind==='enzyme-barrier'?<EnzymeBarrierFigure/>:kind==='sequence-change'?<MutationSequenceFigure/>:kind==='nucleotide-parts'?<NucleotidePartsFigure/>:kind==='rna-roles'?<RNARolesFigure/>:kind==='gene-context'?<GeneContextFigure/>:<BacteriaFormsFigure/>}</div>;
}
