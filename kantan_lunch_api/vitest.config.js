// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        setupFiles: './tests/vitest.setup.js', 
        // Optionally, increase the timeout if necessary
        testTimeout: 10000,
    },
});