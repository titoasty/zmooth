import { defineConfig } from 'tsup';

export default defineConfig((options) => {
    return {
        entry: options.minify
            ? {
                  'zmooth.min': 'src/index.ts',
              }
            : {
                  zmooth: 'src/index.ts',
              },
        clean: !options.minify,
        dts: true,
        sourcemap: options.watch,
        format: ['cjs', 'esm'],
        platform: 'browser',
        // outExtension({ format }) {
        //     if (format === 'cjs') return { js: `.cjs` };
        //     else if (format === 'esm') return { js: `.mjs` };
        //     else if (format === 'iife') return { js: `.js` };

        //     return {
        //         js: `.${format}.js`,
        //     };
        // },
    };
});
