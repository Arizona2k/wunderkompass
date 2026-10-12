import {createHash} from 'node:crypto';
import {calendarDay,berlinDay,approvedURL} from '../../app/news-validation.mjs';
import {fetchSource} from './engine.mjs';
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
/** An unchanged approved document is not a new legal opinion. Changed/missing
 * terms fail closed. Baseline hashes must be reviewed configuration, never
 * automatically learned from a first response or inferred from keywords.
 */
export async function monitorRights(source,{policy,previous,now=new Date(),readDocument=url=>fetchSource(url,policy,{rightsDocument:true}),intervalDays=30}={}){
 if(!Number.isInteger(intervalDays)||intervalDays<1||intervalDays>30)throw Error('Ungültiges Rechteprüfintervall');
 const rights=source?.rights,day=berlinDay(now),age=date=>(Date.parse(day)-Date.parse(date))/86400000;
 if(rights?.status!=='confirmed'||!calendarDay(rights.checkedOn)||age(rights.checkedOn)<0)throw Error('Quellenrechte nicht bestätigt');
 const pins=rights.documentFingerprints;
 if(!pins){if(age(rights.checkedOn)>180)throw Error('Quellenrechteprüfung ist überaltert; freigegebener Dokumentnachweis fehlt');return {status:'baseline-missing',effectiveCheckedOn:rights.checkedOn,proof:null};}
 if(!Array.isArray(pins)||!pins.length||pins.length>5||!Array.isArray(rights.urls)||pins.length!==rights.urls.length||new Set(pins.map(p=>p.url)).size!==pins.length||pins.some(p=>!rights.urls.includes(p.url)||!/^([a-f0-9]{64})$/.test(p.sha256)))throw Error('Ungültiger freigegebener Rechtenachweis');
 for(const pin of pins)approvedURL(pin.url,policy);
 const policyFingerprint=digest({id:source.id,url:source.url,rights});
 const initialAt=Date.parse(rights.checkedAt);
 if(!previous&&Number.isFinite(initialAt)&&initialAt<=now.getTime()&&berlinDay(new Date(initialAt))===rights.checkedOn&&age(rights.checkedOn)<intervalDays){const proof={policyFingerprint,checkedOn:rights.checkedOn,checkedAt:rights.checkedAt,documents:pins};return {status:'approved-baseline-cached',effectiveCheckedOn:rights.checkedOn,proof};}
 if(previous?.policyFingerprint===policyFingerprint&&calendarDay(previous.checkedOn)&&age(previous.checkedOn)>=0&&age(previous.checkedOn)<intervalDays&&JSON.stringify(previous.documents)===JSON.stringify(pins))return {status:'unchanged-cached',effectiveCheckedOn:previous.checkedOn,proof:previous};
 for(const pin of pins){const document=await readDocument(pin.url);if(document.sha256!==pin.sha256)throw Error('Rechtedokument geändert oder nicht nachgewiesen: '+source.id);}
 const proof={policyFingerprint,checkedOn:day,checkedAt:now.toISOString(),documents:pins};return {status:'unchanged-checked',effectiveCheckedOn:day,proof};
}
