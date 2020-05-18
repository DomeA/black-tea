'use strict';
const path = require("path");
const webpack = require("webpack");
const pkg = require("../package.json");
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const rootPath = path.resolve(__dirname, "../");
const webpackTestConfig = {
    entry: ["@babel/polyfill",path.resolve(rootPath, "test/unit", "index.mocha.js")],
    //development/production
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules|bower_components/,
                use: [{
                    loader: 'babel-loader',
                    query: {
                        compact: false,
                        presets: ['@babel/preset-env']
                    }
                }]
            }
        ]
    },
    plugins: [
        new HotModuleReplacementPlugin(),
        new CleanWebpackPlugin({cleanAfterEveryBuildPatterns:["./test/coverage"]}),
        new webpack.DefinePlugin({
            'process.env': {
                VERSION: JSON.stringify(pkg.version)
            }
        })
    ]
};
module.exports = webpackTestConfig;