module.exports = function(config) {
    config.set({

        frameworks: ["mocha", "parcel"],

        files: [
            // handle all src and test files through parcel plugin
            { pattern: "src/**/*.ts", watched: false, included: false },
            { pattern: "test/**/*.ts", watched: false, included: false }
        ],

        preprocessors: {
            '**/*.ts': ['parcel']
        },
        colors: true,

        // mocha reporter for printing test results
        reporters: ['mocha'],

        browsers: ["ChromeHeadless"],
        //singleRun: true
    });
};
