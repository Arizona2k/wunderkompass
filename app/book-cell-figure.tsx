import {CellComparisonFigure} from './book-cell-comparison-figure';
import {DNAOrderFigure} from './book-cell-dna-figure';
import {CellMembraneFigure, CellMitochondrionFigure, CellGenomeFigure} from './book-cell-process-figure';
import './book-cell-comparison-figure.css';
import './book-cell-dna-figure.css';
import './book-cell-process-figure.css';
export type CellFigureKind='cell-examples'|'dna-order'|'selective-membrane'|'mitochondrial-conversion'|'genome-parts';
export default function BookCellFigure({kind,term}:{kind:CellFigureKind;term:string}){
 return <div data-book-cell-figure={kind}>{kind==='cell-examples'?<CellComparisonFigure initialExample={term==='Prokaryot'||term==='Warum kann eine Zelle Erbinformation ohne Zellkern besitzen?'?'bacterium':term==='Eukaryot'?'mature-human-red-cell':'nucleated-human'}/>:kind==='dna-order'?<DNAOrderFigure/>:kind==='selective-membrane'?<CellMembraneFigure/>:kind==='mitochondrial-conversion'?<CellMitochondrionFigure/>:<CellGenomeFigure/>}</div>;
}
