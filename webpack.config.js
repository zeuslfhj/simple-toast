module.exports = {
    mode: process.env.NODE_ENV || 'production',
    entry: './index.js',
    output: {
        library: 'simpleToast',
        libraryTarget: 'umd',
        filename: 'simpleToast.js',
        publicPath: './dist/'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }]
    }
};