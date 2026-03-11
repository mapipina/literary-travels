import {defineConfig, configDefaults}  from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        exclude: [...configDefaults.exclude],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json-summary', 'json', 'html']
        }
    }
});
