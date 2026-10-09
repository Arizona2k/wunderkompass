import { geoArea, geoCentroid, geoContains } from "d3-geo";
import marineData from "./marine.json";
import { OCEANS, type Country, type Place } from "./earth-data";

export function oceanAt(lon: number, lat: number): Place {
  // This learning model uses NOAA's Southern Ocean boundary at 60° south.
  if(lat < -60)return OCEANS.find(o=>o.id==="southern")!;
  const found = MARINE_REGIONS.find(region => geoContains(region, [lon,lat]));
  if(found){
    const p=found.properties;
    const known:Record<string,string>={"Atlantic Ocean":"atlantic","Pacific Ocean":"pacific","Indian Ocean":"indian","Arctic Ocean":"arctic","Southern Ocean":"southern","Mediterranean Sea":"mediterranean","North Sea":"north-sea","Red Sea":"red-sea","Baltic Sea":"baltic","Caribbean Sea":"caribbean","Arabian Sea":"arabian","Bay of Bengal":"bay-bengal","Coral Sea":"coral-sea","Bering Sea":"bering","Gulf of Mexico":"gulf-mexico"};
    const familiar=OCEANS.find(o=>o.id===known[p.english]);
    if(familiar)return familiar;
    const [x,y]=geoCentroid(found);
    return {id:"marine-"+p.id,name:p.name,kind:"ocean",lat:y,lon:x,text:p.english==="Caspian Sea"?"Das Kaspische Meer liegt zwischen Europa und Asien. Trotz seines Namens ist es ein See: Es hat keine natürliche Verbindung zum Weltmeer.":`Du hast ein Gewässer entdeckt: ${p.name}. Schau auf der Kugel nach, welche Länder an seinen Küsten liegen.`,fact:p.english==="Caspian Sea"?"Nicht jedes Gewässer mit „Meer“ im Namen gehört zu einem Ozean.":"Ein Ozean ist ein sehr großes Meer. Viele kleinere Meere werden nach benachbarten Ländern oder Regionen benannt."};
  }
  let id = "pacific";
  if (lat > 66) id = "arctic";
  else if (lat < -60) id = "southern";
  else if (lat > 30 && lat < 46 && lon > -6 && lon < 37) id = "mediterranean";
  else if (lat > 50 && lat < 62 && lon > -5 && lon < 12) id = "north-sea";
  else if (lat > 12 && lat < 30 && lon > 32 && lon < 44) id = "red-sea";
  else if (lon > 20 && lon < 147 && lat < 30) id = "indian";
  else if (lon > -70 && lon <= 20) id = "atlantic";
  return OCEANS.find(o => o.id === id)!;
}

type MarineRegion={type:"Feature";properties:{id:string;name:string;english:string;rank:number;kind:string};geometry:Country["geometry"]};
const MARINE_REGIONS=marineData.features as unknown as MarineRegion[];
for(const region of MARINE_REGIONS)if(geoArea(region)>2*Math.PI){if(region.geometry.type==="Polygon")region.geometry.coordinates.forEach(r=>r.reverse());else region.geometry.coordinates.forEach(p=>p.forEach(r=>r.reverse()));}

