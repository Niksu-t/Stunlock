import {resolve} from 'path';
import {defineConfig} from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { register } from 'module';

export default defineConfig({
    // Place index in /src. Paths don't need to be edited for deployment.
    root: "./src",
    // Public directory broke since root, fix.
    publicDir: '../public',

    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.html'),
                login: resolve(__dirname, 'src/login.html'),
                register: resolve(__dirname, 'src/register.html'),
                dashboard: resolve(__dirname, 'src/dashboard.html'),
            },
        },
    },
    plugins: [
        tailwindcss(),
    ],
});
