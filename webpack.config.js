const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: { //all these files are individually accessible by the applications making use of this library
        DraftsClient: './src/DraftsClient.jsx',
        LoginClient: './src/LoginClient.jsx',
        PostClient: './src/PostClient.jsx',
    },
    performance: {
        hints: false
      },
    module: {
        rules: [
            {
                test: /\.jsx?$/, // Matches both .js and .jsx files
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, 'src'),
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.scss$/i,
                include: path.resolve(__dirname, 'src'),
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'production', //change to development when developing
    // mode: 'development', //change to production when exporting
    experiments: {
        topLevelAwait: true
    },
    devServer: { //used by npm run serve
        static: {
          directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    },
    //replace __JS_PACKAGE_HOST__ strings with the host of this package with the DefinePlugin
    plugins: [
        new webpack.DefinePlugin({
            // __JS_PACKAGE_HOST__: JSON.stringify("http://10.0.0.169:9000") //for local development with host 0.0.0.0
            // __JS_PACKAGE_HOST__: JSON.stringify("http://localhost:9000") //for local development
            __JS_PACKAGE_HOST__: JSON.stringify("https://cdn.jsdelivr.net/npm/edit-blog-from-site@0.0.17/dist") //for production
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    resolve: {
        extensions: [ '.ts', '.js', '.jsx'],
        fallback: {
            "buffer": require.resolve("buffer")
        }
    },
};