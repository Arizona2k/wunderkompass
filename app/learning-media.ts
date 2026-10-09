import {BookOpen,Cloud,Compass,Droplets,Globe2,Heart,Layers3,Leaf,Sun,Waves} from 'lucide-react';
export const TOPIC_ICONS:Record<string,typeof Globe2>={globe:Globe2,layers:Layers3,water:Droplets,sun:Sun,waves:Waves,leaf:Leaf,cloud:Cloud,heart:Heart,book:BookOpen,compass:Compass};
export const PHOTOS:Record<string,{src:string;alt:string;credit:string;url:string}>={
 earth:{src:'/photos/earth.jpg',alt:'Wolken und Sonnenlicht über dem Atlantik, fotografiert von der ISS',credit:'NASA',url:'https://www.nasa.gov/image-article/sunlight-atlantic-ocean/'},
 reef:{src:'/photos/reef.jpg',alt:'Fische und Korallen am Riff von Swains Island',credit:'NOAA',url:'https://www.noaa.gov/explainers/coral-reefs-essential-and-threatened'},
 volcano:{src:'/photos/volcano.jpg',alt:'Der Sarychev-Vulkan bei seinem Ausbruch am 12. Juni 2009, von der ISS aus gesehen',credit:'NASA / JSC',url:'https://svs.gsfc.nasa.gov/11446'},
};
