import type {Place} from './earth-data';

type SourceNotes=Pick<Place,'geographyNote'|'geographySources'|'geographyCheckedOn'>;
const checked='2026-10-26';
const recordTable={title:'Temperaturrekorde: WMO-Tabelle vom 31. Juli 2025 (Englisch)',url:'https://wmo.int/sites/default/files/2025-07/Table_Records_25Jul2025.pdf'};
const rock={title:'Gestein und Minerale: USGS (Englisch)',url:'https://www.usgs.gov/news/science-snippet/earthword-rock-vs-mineral'};
const glass={title:'Vulkanisches Glas: USGS (Englisch)',url:'https://volcanoes.usgs.gov/volcanic_ash/glossary/obsidian.html'};

export const WORD_SOURCE_NOTES:Record<string,SourceNotes>={
 Gestein:{geographySources:[rock,glass],geographyCheckedOn:checked},
 Mineral:{geographySources:[rock],geographyCheckedOn:checked},
 Grundwasser:{geographySources:[{title:'Grundwasser und Hohlräume: USGS (Englisch)',url:'https://www.usgs.gov/water-science-school/science/how-do-hydrologists-locate-groundwater'}],geographyCheckedOn:checked},
 Nordpol:{geographySources:[{title:'Nordpol im Arktischen Ozean: NOAA (Englisch)',url:'https://www.pmel.noaa.gov/arctic-zone/faq.html'}],geographyCheckedOn:checked},
 Vulkanasche:{geographySources:[{title:'Bestandteile von Vulkanasche: USGS (Englisch)',url:'https://volcanoes.usgs.gov/volcanic_ash/ash.html'}],geographyCheckedOn:checked},
};

export const NATURE_SOURCE_NOTES:Record<string,SourceNotes>={
 'antarctic-desert':{geographySources:[{title:'Niederschlag im Inneren und an den Küsten: Australisches Antarktisprogramm (Englisch)',url:'https://www.antarctica.gov.au/about-antarctica/weather-and-climate/weather/'}],geographyCheckedOn:checked},
 fuji:{geographySources:[{title:'Bestätigte und unsichere Ausbrüche: Smithsonian (Englisch)',url:'https://volcano.si.edu/volcano.cfm?vn=283030'}],geographyCheckedOn:checked},
 vostok:{geographyNote:'Der Punkt zeigt die ungefähre Stationslage. Der Rekord beschreibt eine einzelne Lufttemperaturmessung, nicht das Klima der ganzen Antarktis.',geographySources:[{title:'Stationslage: SCAR-Ortsverzeichnis beim Australian Antarctic Data Centre (Englisch)',url:'https://data.aad.gov.au/aadc/gaz/display_name.cfm?gaz_id=136400'},recordTable,{title:'Oberflächentemperatur und Satellitenmessung: NASA (Englisch)',url:'https://science.nasa.gov/science-research/earth-science/09dec_coldspot/'}],geographyCheckedOn:checked},
 'furnace-creek':{geographySources:[recordTable],geographyCheckedOn:checked},
};
