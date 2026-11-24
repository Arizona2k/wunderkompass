import {createRoot} from 'react-dom/client';
import EarthExplorer from '../app/earth-explorer';
import LearningBoundary from '../app/learning-boundary';
import '../app/globals.css';
// Letztes Auffangnetz: Scheitert irgendwo ein Teil ohne eigene Fehlergrenze (z. B. ein nachgeladener Programmteil
// ohne Netz), sieht das Kind einen Hinweis mit „Seite neu laden“ statt einer weißen Seite.
createRoot(document.getElementById('root')!).render(<LearningBoundary name="WunderKompass"><EarthExplorer/></LearningBoundary>);
