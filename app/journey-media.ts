import { PHOTOS } from './learning-media';
import newPhotos from './journey-photos.json';
import worldPhotos from './world-photos.json';

export type JourneyImage = {
  src: string;
  alt: string;
  credit: string;
  url: string;
  width: number;
  height: number;
  caption: string;
  kind: 'photo' | 'diagram';
  previewSrc?: string;
  fit?: string;
  position?: string;
  license?: string;
  licenseUrl?: string;
};

function photo(id: keyof typeof newPhotos, caption: string): JourneyImage {
  return { ...newPhotos[id], kind: 'photo', caption };
}

function wildlife(id: 'jaguar' | 'honey-bee', caption: string): JourneyImage {
  const p = worldPhotos[id];
  return {
    src: p.src, alt: p.alt_de, width: p.width, height: p.height,
    credit: p.author, url: p.source_page_url,
    license: id === 'jaguar' ? 'CC BY-SA 4.0' : 'CC0 1.0',
    licenseUrl: p.license_url, kind: 'photo', caption,
  };
}

function diagram(id: string, alt: string, caption: string, map = false): JourneyImage {
  return {
    src: `/journeys/${id}.svg`, alt, caption, kind: 'diagram',
    width: 800, height: 450, fit: 'contain',
    credit: map ? 'Eigene Lernkarte nach Natural Earth' : 'Eigene Lerngrafik',
    url: map ? 'https://www.naturalearthdata.com/about/terms-of-use/'
      : id === 'quakes' ? 'https://www.usgs.gov/programs/earthquake-hazards/science-earthquakes'
      : 'https://science.nasa.gov/earth/facts/',
  };
}

// One visual for every current journey. Progress IDs and the three photo-game
// subjects stay unchanged; journey media can grow independently of that game.
export const JOURNEY_IMAGES: Record<string, JourneyImage> = {
  planet: {
    ...PHOTOS.earth, width: 1041, height: 585, kind: 'photo',
    caption: 'Wolken und Sonnenlicht über dem Atlantik – gesehen von der Internationalen Raumstation.',
  },
  inside: diagram('inside', 'Die vier Erdschichten im Querschnitt: Kruste, Mantel, äußerer und innerer Kern.',
    'Vier Schichten im Querschnitt. Die dünne Kruste ist vergrößert, damit du sie erkennen kannst.'),
  water: photo('water', 'Wolken über dem Missouri River: Wasser reist durch Luft, Boden und Flüsse. Wasserdampf selbst ist unsichtbar.'),
  weather: photo('weather', 'Unter den Wolken fallen Regenschauer. Entdeckst du die hellen Streifen über der Landschaft?'),
  seasons: photo('seasons', 'Herbst in den Rocky Mountains: Einige Pflanzen werden goldgelb, die Nadelbäume bleiben grün.'),
  ocean: {
    ...PHOTOS.reef, width: 1275, height: 717, kind: 'photo',
    caption: 'Ein Korallenriff bietet vielen Meerestieren ein Zuhause. Wie viele Fische entdeckst du?',
  },
  nature: wildlife('jaguar', 'Welche Verstecke kannst du im Lebensraum dieses Jaguars finden? Tiere brauchen Nahrung, Wasser und Schutz.'),
  protect: wildlife('honey-bee', 'Eine Biene besucht eine Blüte. Blühende Pflanzen helfen Bienen – und Bienen helfen vielen Pflanzen beim Bestäuben.'),
  continents: diagram('continents', 'Weltkarte mit sieben markierten Kontinenten: Nordamerika, Südamerika, Europa, Afrika, Asien, Australien und Antarktika.',
    'Die Markierungen zeigen sieben Kontinente. Sie sind keine Ländergrenzen.', true),
  countries: diagram('countries', 'Karte der Länder Afrikas. Kenia ist orange hervorgehoben.',
    'Afrika ist ein Kontinent. Kenia ist eines der Länder in Afrika. Die Linien zeigen vereinfachte Ländergrenzen.', true),
  volcanoes: {
    ...PHOTOS.volcano, width: 1280, height: 720, kind: 'photo',
    caption: 'Der Sarychev-Vulkan stößt eine große Wolke aus Asche und Gasen aus. Die Aufnahme entstand 2009 von der Raumstation aus.',
  },
  quakes: diagram('quakes', 'Gestein bewegt sich an einer Bruchfläche. Von der Bruchstelle breiten sich Erdbebenwellen aus.',
    'Wenn verhaktes Gestein plötzlich rutscht, entstehen Erschütterungen. Die Grafik zeigt das stark vereinfacht.'),
  moon: photo('moon', 'Ein echtes Foto von Apollo 17: Der Mond hat helle Hochländer, dunklere Ebenen und viele Krater. Er reflektiert Sonnenlicht.'),
  navigation: diagram('navigation', 'Weltkarte mit Breiten- und Längengraden und dem orange markierten Äquator bei null Grad Breite.',
    'Der Äquator liegt zwischen Nord- und Südhalbkugel. Die Linien helfen beim Orientieren – draußen sind sie unsichtbar.', true),
  landscapes: photo('landscapes', 'Berggipfel, Wald und See in Alaska. Wo könnte Wasser von den Bergen talwärts fließen?'),
  climate: diagram('climate', 'Vereinfachte Klimagürtel auf einer Weltkarte: Polargebiete, mittlere Breiten und Tropen rund um den Äquator.',
    'Die Farben zeigen einen groben Überblick nach der Breite. Höhe, Meer, Winde und Landschaft beeinflussen das Klima ebenfalls.', true),
};
