const webpack = require('webpack');
const path = require('path');

module.exports = {

    

    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'null-loader'
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, '../src'),
                loader: 'raw-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
            }
        ]
    },

    plugins: [
        // Workaround for angular/angular#11580
        new webpack.ContextReplacementPlugin(
            /\@angular(\\|\/)core(\\|\/)esm5/,
            path.resolve(__dirname, '../src'),
            {}
        ),
    ],

    performance: {
        hints: false
    }
};
