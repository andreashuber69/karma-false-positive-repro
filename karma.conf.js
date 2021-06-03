const files = [
    { 
        pattern: "*.ts",
    },
];

const karmaTypescriptConfig = {
    bundlerOptions: {
        entrypoints: /\.spec\.ts$/,
        sourceMap: true
    },
    compilerOptions: {
        module: "commonjs"
    },
    coverageOptions: {
        // Set this to false while debugging
        instrumentation: true
    },
    include: {
        mode: "replace",
        values: [
            "*.ts"
        ]
    },
    tsconfig: "./tsconfig.json",
};

module.exports = function(config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        files,
        preprocessors: {
            "**/*.ts": ["karma-typescript"],
        },
        reporters: ["dots", "karma-typescript"],
        browsers: ["Chrome"],
        // Set this to false while debugging
        singleRun: true,
        karmaTypescriptConfig,
    });
};
