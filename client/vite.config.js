import {resolve} from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
    // Place index in /src. Paths don't need to be edited for deployment.
    root: "./src",
    // Public directory broke since root, fix.
    publicDir: '../public',

    build: {
        rollupOptions: {
        input: {
            main: resolve(__dirname, 'src/index.html'),
            dashboard: resolve(__dirname, 'src/dashboard/index.html'),
        },
        },
    },
});
