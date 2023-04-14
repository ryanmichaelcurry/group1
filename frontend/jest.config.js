
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFiles: ["jest-canvas-mock", './setupJest.js'],
    transform: {
        //'^.+\\.(ts|tsx)?$': 'ts-jest',
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
    //testMatch: ["**/**/*.test.ts"],
    //verbose: true,
    //forceExit: true,
    //clearMocks: true
};