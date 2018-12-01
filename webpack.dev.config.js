// webpack v4

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        main: './static/js/index.js',
    },

    resolve: {
        extensions: ['.js', '.jsx', '.json', 'jpg', 'png'],
    },

    output: {
        path: __dirname + '/public/static',
        filename: 'all.js',
        publicPath: '/static/',
    },

    performance: {
        hints: 'warning',
    },

    devtool: 'inline-source-map',

    devServer: {
        port: 3000,
        inline: true,
        compress: true,
        stats: 'minimal',
        host: '0.0.0.0',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            limit: 8000,
                            outputPath: 'img/',
                        },
                    },
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'font/',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'all.css',
            chunkFilename: '[id].css',
        }),
    ],
};
