import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { Plugin } from 'vite';
import {learningInputs,learningFingerprint} from './learning-fingerprint.mjs';

// A content fingerprint shared by HTML, client code and the offline worker.
// Only public learning content is cached. Authentication and API routes are excluded.
export function learningOffline(): Plugin {
  const root = process.cwd();
  const files=learningInputs(root);
  const version=learningFingerprint(root,files);
  const publicFiles = files.filter(p => p.startsWith(join(root, 'public') + '/'))
    .filter(p => /\.(json|svg|png|jpe?g|webp|webmanifest)$/.test(p))
    .map(p => '/' + relative(join(root, 'public'), p));
  return {
    name: 'learning-offline',
    config: (_, env) => ({ define: { __EARTH_BUILD__: JSON.stringify(version), __EARTH_PRODUCTION__: JSON.stringify(env.command === 'build') } }),
    generateBundle(_, bundle) {
      if (this.environment.name !== 'client') return;
      const assets = [...new Set([...publicFiles, ...Object.keys(bundle).filter(p => /\.(js|css|woff2?|svg|png|webp|json)$/.test(p)).map(p => '/' + p)])].sort();
      const template = readFileSync(join(root, 'build/learning-worker.js'), 'utf8');
      this.emitFile({ type: 'asset', fileName: 'learning-worker.js', source: template.replace('__BUILD__', JSON.stringify(version)).replace('__ASSETS__', JSON.stringify(assets)) });
    },
  };
}
