'use strict';
const webpack = require("webpack");
const path = require("path");
const pkg = require("../package.json");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const DashboardPlugin = require('webpack-dashboard/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const rootPath = path.resolve(__dirname, "../");

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const webpackBaseConfig = {
    entry: ["@babel/polyfill",path.resolve(rootPath, "src", "index.js")],
    devtool: 'inline-source-map',
    output: {
        filename: pkg.name+ ".min.js",
        path: path.resolve(rootPath, "dist"),
        library: pkg.name,
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.js$|\.jsx$/,
                use: {
                    loader: 'istanbul-instrumenter-loader',
                    options: {esModules: true}
                },
                enforce: 'post',
                exclude: /node_modules|\.spec\.js$/,
            },
            {
                test: /\.css$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }]
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=819200&name=images/[hash:8].[name].[ext]' //小于800k 转成 base64 码 8192=8k
            },
            {
                test: /\.(obj|ply)$/,
                loader: 'url-loader?limit=8192&name=mod/[hash:8].[name].[ext]'
            }
        ]
    },
    devServer: {
        contentBase: "../dist",
        historyApiFallback: true,
        inline: true
    },
    plugins: [
        new DashboardPlugin(),
        new HtmlWebpackPlugin({
            title: 'Output Management',
            minify: {
                collapseWhitespace: true //false | true
            },
            // 添加hash
            hash: true,
            template: path.resolve(rootPath, "src", "../public/index.html") //使用模板 必须有模板文件
        }),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()//热模块替换插件
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new UglifyJSPlugin({
                sourceMap: true,
                parallel: true,
                uglifyOptions: {
                    comments: false,
                    beautify: false,
                    output: null
                }
            })
        ]
    }
};

module.exports = webpackBaseConfig;
