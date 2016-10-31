const webpack = require('webpack');
const path = require('path');
const AotPlugin = require('@ngtools/webpack').AotPlugin;

module.exports = (envOptions) => {
    envOptions = envOptions || {};
    const config = {
        entry: {main: './src/main.ts'},
        output: {
            path: root('dist'),
            filename: '[name].bundle.js'
        },
        resolve: {extensions: ['.ts', '.js', '.html']},
        module: {rules: [{test: /\.(html|css)$/, loader: 'raw'}]},
        plugins: [
            new webpack.ContextReplacementPlugin(
                // The (\\|\/) piece accounts for path separators in *nix and Windows
                /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
                root('./src') // Location of your source code.
            )
        ],
        devtool: envOptions.MODE === 'prod' ? false : '#source-map'
    };

    if (envOptions.MODE === 'prod') {
        config.module.rules.push({test: /\.ts$/, loaders: ['@ngtools/webpack']});
        config.plugins.push(
            new AotPlugin({
                tsConfigPath: './tsconfig.json',
                entryModule: 'src/app/app.module#AppModule'
            }),
            new webpack.optimize.UglifyJsPlugin({
                beautify: false,
                comments: false,
                compress: {
                    warnings: false,
                    screw_ie8: true,
                    drop_console: true
                },
                minimize: true
            })
        );
    } else {
        config.module.rules.push({test: /\.ts$/, loaders: ['awesome-typescript-loader', 'angular2-template-loader']});
    }

    return config;
};

function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}
