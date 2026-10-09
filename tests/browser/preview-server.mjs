import { preview } from 'vite';

// Same-origin production probe. Vite's development CORS adds Vary: Origin,
// which caches a different response for preload versus module requests.
// Do not change the application worker or ignore cache validation in the test.
await preview({
  preview: {
    host: '127.0.0.1',
    port: Number(process.env.QA_PORT ?? '4182'),
    strictPort: true,
    cors: false,
  },
});
console.log('WK_PREVIEW_READY ' + (process.env.QA_PORT ?? '4182'));
