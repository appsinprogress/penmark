const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    mode: 'development', //change to production when exporting
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
    plugins: [//copy index.html to dist folder
        new HtmlWebpackPlugin({
          template: 'src/index.html'
        })
    ]
};