const path = require('path');
const webpackConfig = require('./build/webpack.jasmine.test.conf');
module.exports = function (config) {
    config.set({
        // 将用于解决所有的模式基本路径（例如，文件，排除）
        basePath: '',
        client: {
            useIframe:false,
            clearContext: false,
            captureConsole: true // 设置由 terminal 捕捉 browser 的输出
        },
        browserConsoleLogOptions: {
            level: "log",
            format: "%b %T: %m",
            terminal: true
        },
        jasmineHtmlReporter: {
            suppressAll: true, // Suppress all messages (overrides other suppress settings)
            suppressFailed: true // Suppress failed messages
        },
        frameworks: ['jasmine'],
        plugins: [
            'karma-webpack',
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-jasmine-html-reporter',
            "karma-coverage",
            'karma-coverage-istanbul-reporter',
            "karma-sourcemap-loader",
            "istanbul-instrumenter-loader"
        ],
        // 需要测试的文件列表
        files: [
            "src/**/*.js",
            'test/**/*.spec.js'
        ],
        exclude: [
            'node_modules/**/*.test.js',
            'node_modules/**/*.spec.js'
        ],
        preprocessors: {
            "src/**/*.js": ["webpack",'coverage','sourcemap'], //表示那些代码需要生成测试覆盖率报表
            'test/unit/index.jasmine.js': ['webpack'],
            "test/**/*.spec.js": ["webpack"]
        },

        webpack:webpackConfig,
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

        reporters: ["dots",'kjhtml',"progress", 'coverage', 'coverage-istanbul'],
        port: 9876,
        colors: true,
        browserNoActivityTimeout:400000,
        // 捕获浏览器的超时时间
        captureTimeout: 60000,
        webpackServer:{
            noInfo: true
        },
        // optionally, configure the reporter
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
        webpackMiddleware: {noInfo: false}, // no webpack output
        logLevel: config.LOG_LOG,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        concurrency: Infinity
    });
};
