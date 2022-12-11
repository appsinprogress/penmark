const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: { //all these files are individually accessible by the applications making use of this library
        DraftsClient: './src/DraftsClient.js',
        LoginClient: './src/LoginClient.js',
        PostClient: './src/PostClient.js',
        Modal: './src/Modal.js',
        prosemirror: './src/prosemirror.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'production', //change to production when exporting
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
            // __JS_PACKAGE_HOST__: JSON.stringify("http://localhost:9000") //for local development
            __JS_PACKAGE_HOST__: JSON.stringify("https://cdn.jsdelivr.net/npm/edit-blog-from-site@0.0.12/dist") //for production
        })
    ]
};