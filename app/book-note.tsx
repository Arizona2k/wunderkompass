import {useLayoutEffect,useRef,useState} from 'react';
import {Textarea} from '@/components/ui/textarea';

export function BookNote({note,onSave,onRemove,onRead}:{note:{id:string;text:string;at:string};onSave:(text:string,id?:string)=>void;onRemove:(id:string)=>void;onRead:(text:string,localOnly?:boolean)=>void}){
 const [edit,setEdit]=useState<{original:string;text:string}|null>(null),field=useRef<HTMLTextAreaElement>(null),opener=useRef<HTMLButtonElement>(null),returnFocus=useRef(false);
 const editing=edit!==null;
 useLayoutEffect(()=>{if(editing)field.current?.focus();else if(returnFocus.current){returnFocus.current=false;opener.current?.focus();}},[editing]);
 const changedElsewhere=edit!==null&&edit.original!==note.text;
 function close(){returnFocus.current=true;setEdit(null);}
 return <article className="word-card" data-note-id={note.id}>
  {edit?<><label htmlFor={'note-edit-'+note.id}>Deine Notiz bearbeiten</label><Textarea ref={field} id={'note-edit-'+note.id} maxLength={1000} value={edit.text} onChange={event=>setEdit({...edit,text:event.target.value})}/>
   {changedElsewhere&&<p role="status">Diese Notiz wurde in einer anderen Ansicht geändert. Brich die Bearbeitung ab und öffne den aktuellen Text erneut.</p>}
   <button className="primary-button" disabled={!edit.text.trim()||changedElsewhere} onClick={()=>{onSave(edit.text,note.id);close();}}>Notiz speichern</button>
   <button className="secondary-button" onClick={close}>Abbrechen</button>
  </>:<><p>{note.text}</p><button ref={opener} className="speech-button" onClick={()=>setEdit({original:note.text,text:note.text})}>Notiz bearbeiten</button><button className="speech-button" onClick={()=>onRead(note.text,true)}>Notiz vorlesen</button><button className="speech-button" onClick={()=>onRemove(note.id)}>Notiz entfernen</button></>}
 </article>;
}
