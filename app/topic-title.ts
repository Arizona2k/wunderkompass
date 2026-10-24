// Preserve the canonical title in data, search and the accessible name.
// A manual German break also works when a browser lacks its hyphen dictionary.
export const displayTopicTitle=(title:string)=>title.replace(/Oberflächenspannung/g,'Oberflächen\u00adspannung');
