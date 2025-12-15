import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        outDir: './dist',
        lib: {
            entry: resolve(__dirname, './src/index.ts'),
            formats: ['es'],

        },
        rollupOptions: {
            external: [
                'three',
                'cannon-es',
                'three/addons/utils/SkeletonUtils',
                '@alexfdr/three-game-core',
                '@tweenjs/tween.js',
                'pixi.js',
            ]
        },
        reportCompressedSize: false,
    },
    plugins: [
        dts({
            exclude: ['node_modules/**'],
            rollupTypes: true,
        })
    ]
});