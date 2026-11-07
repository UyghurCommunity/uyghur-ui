import { defineConfig } from 'vite';
// The checkout uses linked local packages; share one React runtime in dev/build.
export default defineConfig({ resolve: { dedupe: ['react', 'react-dom'] } });
