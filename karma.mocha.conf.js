const webpackConfig = require('./build/webpack.mocha.test.conf');
const path = require('path');
module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',
        client: {
            chai: {
                includeStack: true
            },
            mocha: {
                timeout: 4000
            },
            useIframe:false,
            clearContext: false,
            captureConsole: true // 设置由 terminal 捕捉 browser 的输出
        },
        browserConsoleLogOptions: {
            level: "log",
            format: "%b %T: %m",
            terminal: true
        },
        frameworks: ['mocha', 'chai','sinon-chai'],
        plugins: [
            'karma-webpack',
            'karma-mocha',
            'karma-chai',
            "karma-sinon-chai",
            'karma-chrome-launcher',
            "karma-mocha-reporter",
            'karma-coverage',
            "karma-coverage-istanbul-reporter",
            "karma-sourcemap-loader",
            "istanbul-instrumenter-loader",
        ],
        files: [
            "src/**/*.js",
            'test/**/*.test.js'
        ],
        exclude: [
            'node_modules/**/*.test.js',
            'node_modules/**/*.spec.js'
        ],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            "src/**/*.js": ["webpack",'coverage','sourcemap'], //表示那些代码需要生成测试覆盖率报表
            'test/unit/index.mocha.js': ['webpack'],
            "test/**/*.test.js": ["webpack"]
        },
        webpack: webpackConfig,

        coverageIstanbulReporter: {
            // reports can be any that are listed here: https://github.com/istanbuljs/istanbuljs/tree/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-reports/lib
            reports: ['html', 'lcovonly', 'text-summary'],
            // base output directory. If you include %browser% in the path it will be replaced with the karma browser name
            dir: path.join(__dirname, 'test/coverage'),
            // Combines coverage information from multiple browsers into one report rather than outputting a report
            // for each browser.
            combineBrowserReports: true,
            // if using webpack and pre-loaders, work around webpack breaking the source path
            fixWebpackSourcePaths: true,
            // Omit files with no statements, no functions and no branches from the report
            skipFilesWithNoCoverage: true,
            // Most reporters accept additional config options. You can pass these through the `report-config` option
            'report-config': {
                // all options available at: https://github.com/istanbuljs/istanbuljs/blob/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-reports/lib/html/index.js#L135-L137
                html: {
                    // outputs the report in ./coverage/html
                    subdir: 'html'
                }
            }
        },
        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            stats: 'errors-only',
            noInfo: true
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['coverage',"dots","progress", 'coverage-istanbul'],
        coverageReporter: {
            dir: 'test/coverage',
            reporters: [
                {type: 'lcov', subdir: '.'},
                {type: 'cobertura', subdir: '.'},
                {type: 'text-summary',file:"coverageReporterSummary.txt"},
                {type: 'text',file:"coverageReporter.txt"}
            ]
        },
        customLaunchers: {
            'visibleElectron': {
                base: 'Electron',
                flags: ['--show']
            }
        },
        logLevel: config.LOG_LOG,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        concurrency: Infinity
    })
};
