module.exports = {
    testEnvironment: "node",

    testMatch: [
        "<rootDir>/tests/unit/**/*.test.js"
    ],

    collectCoverageFrom: [
        "frontend/calculator.js"
    ],

    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};
