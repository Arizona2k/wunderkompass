import {flag} from './earth-data';
const LOCAL=new Set(['DE','FR','IT','JP','AU','CA','BR','EG','IN','KE','ES','IR']);
export function flagCode(text:string){const characters=[...text];return characters.length===2?characters.map(c=>String.fromCharCode(c.codePointAt(0)!-127397)).join(''):'';}
export function CountryFlag({iso,label}:{iso:string;label:string}){return LOCAL.has(iso)?<span className="country-flag"><img src={'/flags/'+iso.toLowerCase()+'.svg'} width="80" height="60" alt={label} loading="lazy"/><span aria-hidden="true" className="sr-only">{flag(iso)}</span></span>:<span role="img" aria-label={label}>{flag(iso)}</span>;}
