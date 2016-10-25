const webpack = require('webpack');
const path = require('path');

module.exports = (envOptions) => {
    envOptions = envOptions || {};
    const config = {
        entry: {
            main: './src/main.ts'
        },
        output: {
            path: root('dist'),
            filename: '[name].bundle.js',
        },
        resolve: {
            extensions: ['.ts', '.js', '.html'],
        },
        module: {
            rules: [
                {test: /\.html$/, loader: 'raw'},
                {test: /\.css$/, loader: 'raw'},
                {test: /\.ts/, loaders: ['awesome-typescript-loader', 'angular2-template-loader']}
            ]
        },
        devtool: '#source-map'
    };

    if (envOptions.MODE === 'prod') {
        config.plugins = [
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                mangle: {
                    screw_ie8: true,
                    keep_fnames: true
                },
                compress: {
                    warnings: false,
                    screw_ie8: true
                },
                comments: false
            }),
        ];
    }

    return config;
};

// Helpers
function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}
