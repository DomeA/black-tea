const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { version } = require('./package.json');
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

        // 需要测试的文件列表
        files: [
            'test/**/*.spec.js'
        ],

        // 使用端口
        port: 9876,

        // 是否在输出日志中使用颜色
        colors: true,

        // 持续集成模式: 配置为true 将会持续运行测试, 直致完成返回0(成功)或1(失败). 示例: Done. Your build exited with 0.
        singleRun: true,


        // 日志级别
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_LOG,

        // 是否监听文件变化
        autoWatch: true,

        // 配置启动单元测试的环境
        browsers: ["Chrome",'PhantomJS'],

        // 捕获浏览器的超时时间
        captureTimeout: 60000,

        // coverage reporter generates the coverage
        reporters: ['progress', 'coverage'],

        // 预处理
        preprocessors: {
            // src/module/**/*.js 在由 test/*_test.js 中调用时就会使用webpack打包, 所以 src/**/*.js 不需要通过 webpack 进行打包.
            'src/**/*.js': ['coverage', 'webpack', 'sourcemap'],
            'test/**/*.spec.js': ['webpack']
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

        // webpack config: https://github.com/webpack-contrib/karma-webpack
        webpack: {
            mode: 'development',
            // 入口文件配置
            resolve: {
                extensions: ['.js'], // 当requrie的模块找不到时,添加这些后缀
            },
            plugins: [
                new CleanWebpackPlugin({cleanAfterEveryBuildPatterns:["./test/coverage"]}),
                new webpack.ProvidePlugin({
                    'Promise': 'es6-promise'
                }),
                new webpack.DefinePlugin({
                    'process.env': {
                        VERSION: JSON.stringify(version)
                    }
                })
            ],
            module: {
                rules: [
                    {
                        test: /\.js?$/,
                        use: ['babel-loader'],
                        exclude: /(node_modules|bower_components)/,
                        include: [path.join(__dirname, 'src'), path.join(__dirname, 'test')]
                    }
                ]
            }
        },

        webpackMiddleware: {noInfo: false}, // no webpack output

        // Karma有多少个浏览器并行启动
        concurrency: Infinity
    });
};
