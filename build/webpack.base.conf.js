'use strict';
const webpack = require("webpack");
const path = require("path");
const pkg = require("../package.json");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const DashboardPlugin = require('webpack-dashboard/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const rootPath = path.resolve(__dirname, "../");

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const webpackBaseConfig = {
    entry: ["@babel/polyfill", path.resolve(rootPath, "src", "index.js")],
    //devtool: 'inline-source-map',
    output: {
        filename: pkg.name + ".min.js",
        path: path.resolve(rootPath, "dist"),
        library: pkg.name,
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                include: [path.join(__dirname, 'src')],
                exclude:  /node_modules|bower_components/,
                use: [
                    {
                        loader: 'eslint-loader',
                        options: {
                            formatter: require('eslint-friendly-formatter')
                        }
                    }
                ]
            },
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
                exclude: /node_modules|bower_components/,
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
        // 将样式文件 抽取至独立文件内
        new MiniCssExtractPlugin({
            filename: pkg.name + '.css',
            chunkFilename: '[id].css'
        }),
        // 配置环境变量
        new webpack.DefinePlugin({
            'process.env': {
                VERSION: JSON.stringify(pkg.version)
            }
        }),
        new HtmlWebpackPlugin({
            title: 'Output Management',
            minify: {
                collapseWhitespace: true //false | true
            },
            // 添加hash
            hash: true,
            template: path.resolve(rootPath, "src", "../public/index.html") //使用模板 必须有模板文件
        }),// https://www.npmjs.com/package/webpack-bundle-analyzer
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()//热模块替换插件
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new UglifyJSPlugin({
                uglifyOptions: {
                    comments: false,
                    beautify: false,
                    output: null,
                    cache: true,
                    parallel: true,
                    sourceMap: true,
                    warnings: false
                }
            }),
            // 压缩css
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessor: require('cssnano'),
                cssProcessorOptions: {
                    discardComments: {removeAll: true},
                    minifyGradients: true
                },
                canPrint: true
            })
        ]
    }
};

module.exports = webpackBaseConfig;
