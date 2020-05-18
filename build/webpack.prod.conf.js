'use strict';
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const webpackProdConfig = merge(baseWebpackConfig, {
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.js$|\.jsx$/,
                use: {
                    loader: 'istanbul-instrumenter-loader',
                    options: { esModules: true }
                },
                enforce: 'post',
                exclude: /(node_modules|bower_components)/,
            }
        ]
    }
});
module.exports = webpackProdConfig;