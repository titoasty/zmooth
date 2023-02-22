import fs from 'fs';
import { defineConfig } from 'tsup';

export default defineConfig((options) => {
    if (!options.minify) {
        fs.rmSync('./dist', { recursive: true, force: true });
    }

    const config = {
        entry: options.minify
            ? {
                  'zmooth.min': 'src/index.ts',
              }
            : {
                  zmooth: 'src/index.ts',
              },
        clean: false,
        dts: true,
        sourcemap: options.watch,
        bundling: !options.watch,
        platform: 'browser',
        outExtension({ format }) {
            if (format === 'cjs') return { js: `.cjs` };
            else if (format === 'esm') return { js: `.mjs` };
            else if (format === 'iife') return { js: `.js` };
            return { js: `.${format}.js` };
        },
    };

    return [
        {
            ...config,
            format: ['cjs', 'esm'],
        },
        {
            ...config,
            format: ['iife'],
            globalName: 'zmooth',
            footer: {
                js: 'zmooth = zmooth.default;',
            },
        },
    ];
});
