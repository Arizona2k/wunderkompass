import {defineConfig,type Plugin} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {learningOffline} from './build/learning-offline';
function learningMetadata():Plugin{let version='dev';return {name:'portable-learning-metadata',configResolved(c){version=JSON.parse(c.define?.__EARTH_BUILD__??'"dev"');},transformIndexHtml(){return [{tag:'meta',attrs:{name:'learning-build',content:version},injectTo:'head'}];}};}
export default defineConfig({base:'/',plugins:[react(),learningOffline(),learningMetadata()],resolve:{alias:{'@':fileURLToPath(new URL('./',import.meta.url)),'next/link':fileURLToPath(new URL('./migration/link.tsx',import.meta.url))}},build:{outDir:'dist',emptyOutDir:true},server:{host:'127.0.0.1'},preview:{host:'127.0.0.1'}});
