import {Bookmark,BookOpen,NotebookPen} from 'lucide-react';
import type {LocalProgress} from './progress-storage';

export default function PassSaved({progress,onOpenBook}:{progress:LocalProgress;onOpenBook:()=>void}){
 return <section data-pass-section="saved" tabIndex={-1} aria-label="Gespeichertes und Notizen"><h3 tabIndex={-1} className="pass-section-title">Gespeichertes & Notizen</h3><p>Deine persönlichen Fundstücke bleiben bei dir. Im Wissensbuch kannst du sie öffnen und deine Notizen bearbeiten.</p><div className="pass-saved-counts"><span><Bookmark size={19}/>{progress.favorites.length} gespeichert</span><span><NotebookPen size={19}/>{progress.notes.length} Notizen</span></div>{progress.notes.length>0&&<ul className="pass-note-preview">{progress.notes.slice(-3).toReversed().map(note=><li key={note.id}>{note.text}</li>)}</ul>}<button className="secondary-button" onClick={onOpenBook}><BookOpen size={18}/> Im Wissensbuch öffnen</button></section>;
}
