'use strict';
const path = require("path");
const webpack = require("webpack");
const pkg = require("../package.json");
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const rootPath = path.resolve(__dirname, "../");
const webpackTestConfig = {
    entry: ["@babel/polyfill", path.resolve(rootPath, "test/unit", "index.jasmine.js")],
    //development/production
    mode: 'development',
    //测试里面不能用定义devtool，否则test用例被webpack打包，出现不必要的函数
//    SourceMap position not found for trace: An error was thrown in afterAll
// Uncaught RangeError: Maximum call stack size exceeded
// RangeError: Maximum call stack size exceeded

//devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules|bower_components/,
                //@babel/polyfill 不能有include ES7 polyfill在加入index.js头部后，会无法识别 # 符号
                //include: [path.join(__dirname, 'src'), path.join(__dirname, 'test')],
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            compact: false,
                            presets: ['@babel/preset-env']
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HotModuleReplacementPlugin(),
        new CleanWebpackPlugin({cleanAfterEveryBuildPatterns: ["./test/coverage"]}),
        // new webpack.ProvidePlugin({
        //     'Promise': 'es6-promise'
        // }),
        new webpack.DefinePlugin({
            'process.env': {
                VERSION: JSON.stringify(pkg.version)
            }
        })
    ]
};
module.exports = webpackTestConfig;