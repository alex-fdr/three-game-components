import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        outDir: './dist',
        lib: {
            entry: {
                physics: resolve(__dirname, './src/physics/index.ts'),
            },
            formats: ['es'],
            
        },
        rollupOptions: {
            external: ['three', 'cannon-es']
        },
        reportCompressedSize: false,
    },
    plugins: [
        dts({ 
            exclude: ['node_modules/**', '**/index.ts'],
            outDir: './dist/types'
            // rollupTypes: false, 
            // insertTypesEntry: true, 
            // rollupOptions: {
            //     localBuild: true,
            // },
        })
    ]
})