/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
const { defaults } = require("jest-config");

module.exports = {
    verbose: true,
    preset: "ts-jest",
    testEnvironment: "node",
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig-node.json",
        },
    },
    extraGlobals: ["Math"],
    moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx"],
    modulePathIgnorePatterns: ["<rootDir>/dist"],

    testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": require.resolve("ts-jest"),
    },
    transformIgnorePatterns: ["/node_modules/(?!@polkadot|@babel/runtime/helpers/esm/)"],
    // Don't use it with ts files -> Not supported
    // globalTeardown: "<rootDir>/tests/global_teardown.ts"
};
