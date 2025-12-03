import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        outDir: './dist',
        lib: {
            entry: {
                physics: resolve(__dirname, './src/physics/index.ts'),
                animations: resolve(__dirname, './src/animations/index.ts'),
            },
            formats: ['es'],
            
        },
        rollupOptions: {
            external: [
                'three', 
                'cannon-es', 
                'three/addons/utils/SkeletonUtils', 
                '@alexfdr/three-game-core'
            ],
            output: {
                entryFileNames: ({name}) => `${name}/[name].js`
            }
        },
        reportCompressedSize: false,
    },
    plugins: [
        dts({ 
            exclude: ['node_modules/**', '**/index.ts'],
            outDir: './dist/',
            // rollupTypes: true, 
            // insertTypesEntry: true, 
        })
    ]
})