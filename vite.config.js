import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        // Force Vite to prebundle 'cookie'
        include: ['cookie'],
    },
    ssr: {
        // Prevent Vite from treating 'cookie' as an external dependency
        noExternal: ['cookie'],
    },
});
// vite.config.js
