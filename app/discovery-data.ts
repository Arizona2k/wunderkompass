/** Existing graph edges and routes highlighted by the discovery centre. */
export const DISCOVERY_CONNECTIONS=[
 {label:'Mond & Meer',id:'science-moon-phases--science-tides',routeId:'moon-to-sea'},
 {label:'Wald & Leben',id:'science-photosynthesis--science-fungi',routeId:'living-networks'},
 {label:'Meer in Bewegung',id:'science-tides--science-currents',routeId:'ocean-life'},
 {label:'Biene & Blüte',id:'science-pollination--animal-honey-bee',routeId:'living-networks'},
 {label:'Mond & Zeitreise',id:'science-moon-phases--history-apollo11',routeId:'space'},
 {label:'Wasser & Luft',id:'science-water-cycle--science-atmosphere',routeId:'moon-to-sea'},
 {label:'Sonne & Jahreszeit',id:'science-seasons--science-solar-system',routeId:'world-knowledge'},
 {label:'Riff & Kraken',id:'science-coral-reef--animal-common-octopus',routeId:'ocean-life'},
] as const;
export const DISCOVERY_ACTIVITIES=[
 {title:'Mondstellung und Wasserstand vergleichen',text:'Wähle Vollmond und Halbmond. Was ändert sich am Unterschied zwischen Hoch- und Niedrigwasser?',hash:'labs/tides',label:'Gezeiten erforschen'},
 {title:'Wasser verdunstet auch ohne Kochen',text:'Vergleiche zwei gleiche Wasserschalen. Was verändert sich am sonnigeren und schattigeren Standort? Gemeinsam mit einem Erwachsenen.',hash:'labs/experiment/evaporation',label:'Wasserversuch öffnen'},
 {title:'Zwei Gezeitenkurven, ein Modelltag',text:'Bewege die Modellzeit. Vergleiche die durchgezogene und die gestrichelte Kurve.',hash:'labs/tides',label:'Modelltag untersuchen'},
 {title:'Blüten und Bestäuber verbinden',text:'Prüfe in der Wissens-Challenge, wie Pflanzen und Tiere zusammenwirken. Hinweise und Stufen wählst du selbst.',hash:'games',label:'Wissens-Challenge öffnen'},
 {title:'Ein Mondmonat in deiner Hand',text:'Gehe vom Neumond zum Vollmond. Vergleiche die vergangenen Tage mit dem hellen Anteil der Scheibe.',hash:'labs/moon',label:'Mondmonat ausprobieren'},
 {title:'Woher kommen Tröpfchen am Glas?',text:'Beobachte ein kaltes Glas gemeinsam mit einem Erwachsenen. Kommt das Wasser von innen oder aus der Luft?',hash:'labs/experiment/condensation',label:'Tröpfchen untersuchen'},
 {title:'Ein Ort, zwei Jahreszeiten',text:'Wähle denselben Breitengrad im Juni und Dezember. Vergleiche Tageslänge und Sonnenstand.',hash:'labs/seasons',label:'Jahreszeiten vergleichen'},
 {title:'Unterwasserleben weiter erkunden',text:'Folge der vorhandenen Lernreise in den Ozean und untersuche, was Tiere und ihre Lebensräume verbindet.',hash:'journeys/ocean',label:'Ozeanreise starten'},
] as const;
