const { defaults } = require("jest-config");

module.exports = {
  collectCoverageFrom: ["src/**/*.ts"],
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: [
    ...defaults.testPathIgnorePatterns,
    "<rootDir>/e2e",
    "<rootDir>/dist"
  ],
  watchPathIgnorePatterns: ["<rootDir>/dist"]
};
