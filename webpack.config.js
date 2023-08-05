const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
    {
        mode: 'development',
        context: path.resolve(__dirname),
        entry: './src/index.ts',
        devtool: 'inline-source-map',
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    include: /./,
                    use: [{ loader: 'ts-loader' }],
                },
                {
                    test: /\.(glsl|vert|frag)$/,
                    include: path.resolve(__dirname, 'src/shaders'),
                    use: [{ loader: 'webpack-glsl-loader' }],
                }
            ],
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist'),
        },
        plugins: [new HtmlWebpackPlugin({ template: './index.html' })],
    },
];
