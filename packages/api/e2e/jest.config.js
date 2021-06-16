const { defaults } = require("jest-config");

module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  setupFilesAfterEnv: [],
  rootDir: "../",
  testPathIgnorePatterns: [...defaults.testPathIgnorePatterns, "<rootDir>/src"],
  watchPathIgnorePatterns: ["<rootDir>/src"]
};
