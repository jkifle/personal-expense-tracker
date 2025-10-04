import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // routes any import('cookie') in the client bundle to the shim
            'cookie': path.resolve(__dirname, 'src/cookie-client.js'),
        },
    },
});
