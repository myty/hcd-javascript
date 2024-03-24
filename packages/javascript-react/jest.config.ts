import type { Config } from "jest";

export default {
    rootDir: __dirname,
    /**
     * @note Include the polyfills in the "setupFiles"
     * to apply them BEFORE the test environment.
     */
    setupFiles: ["<rootDir>/jest.polyfills.ts"],
    setupFilesAfterEnv: [
        "<rootDir>/src/setup-tests.ts",
        // polyfill window.resizeTo
        "window-resizeto/polyfill",
    ],
    transform: {
        "^.+\\.tsx?$": "@swc/jest",
    },
    testEnvironment: "jsdom",
    testEnvironmentOptions: {
        /**
         * @note Opt-out from JSDOM using browser-style resolution
         * for dependencies. This is simply incorrect, as JSDOM is
         * not a browser, and loading browser-oriented bundles in
         * Node.js will break things.
         *
         * Consider migrating to a more modern test runner if you
         * don't want to deal with this.
         */
        customExportConditions: [""],
    },
} satisfies Config;
