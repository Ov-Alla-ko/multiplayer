/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './src/index.ts'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'inline-source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                },
            },
        },
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader',
            }),
        },
        {
            test: /\.json$/,
            loader: 'json',
        },
        {
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader',
            options: {
                name: 'img/[name].[ext]',
            },
        },
        {
            test: /\.ts$/,
            loaders: ['awesome-typescript-loader'],
        },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    performance: {
        hints: false,
        // maxEntrypointSize: 512000,
        // maxAssetSize: 512000
    },
    plugins: [
        // new ExtractTextPlugin({
        //     filename: 'fonts.css'
        // }),
        new CopyPlugin([
            { from: './src/index.html', to: './' },
            { from: './src/style/style.css', to: './style/style.css' },
            { from: './libs', to: './' },
        ]),
        new webpack.ProvidePlugin({
            PIXI: 'pixi.js',
        }),
        // new BundleAnalyzerPlugin({
        //     analyzerMode: 'server',
        //     analyzerHost: 'localhost',
        //     analyzerPort: 8888,
        //     reportFilename: 'report.html',
        //     defaultSizes: 'parsed',
        //     openAnalyzer: true,
        //     generateStatsFile: false,
        //     statsFilename: 'stats.json',
        //     statsOptions: null,
        //     logLevel: 'info'
        //   })
    ],
    optimization: {
        // splitChunks: {
        //     cacheGroups: {
        //         commons: {
        //             test: /[\\/]node_modules[\\/]/,
        //             name: '0',
        //             chunks: 'all'
        //         },
        //     },
        //     chunks: 'all',
        //     maxSize: 0,
        // },
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    ecma: 8,
                    warnings: false,
                    output: {
                        comments: false,
                        beautify: false,
                    },
                    compress: false,
                    mangle: false,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: undefined,
                    keep_fnames: true,
                    safari10: false,
                },
                extractComments: false,
            }),
        ],
    },

};
