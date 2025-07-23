const path = require('path');
const webpack = require('webpack');

const srcPath = path.resolve(__dirname, 'src');
const distPath = path.resolve(__dirname, 'dist');

module.exports = {
    context: srcPath,
    resolve: {
        alias: {
            components: path.resolve(srcPath, 'components'),
            utilities: path.resolve(srcPath, 'utilities'),
            api: path.resolve(srcPath, 'api'),
            images: path.resolve(distPath, 'images')
        }
    },
    entry: {
        index: './index.jsx',
        vendor: ['react', 'react-dom']
    },
    output: {
        path: distPath,
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env', {
                                        modules: false
                                    }
                                ],
                                '@babel/preset-react'
                            ],
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                                '@babel/plugin-proposal-object-rest-spread'
                            ]
                        }
                    }
                ]
            }, {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options : {
                            url: false
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {          
                    minChunks: 2,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        }
    },
    devServer: {
        contentBase: distPath,
        compress: true,
        port: 8080,
        historyApiFallback: true
    },
    devtool: 'source-map'
};
