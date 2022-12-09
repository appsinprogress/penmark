# Development guide for Edit Blog Content From Site

### How to develop the package

To edit the source code, edit the files in the `/src` folder.

To install needed NPM modules, run `npm install`.

To build the package, run `npm run build`. This uses webpack to build the project. Change the `mode` to `production` or `development` in `webpack.config.js` based on what you are building for.

To serve the package for local development, run `npm run serve`. This uses webpack dev server to serve the package locally, allowing you to import it into your blog/website at the `http://localhost:9000` address.

### Explanation of project structure & files

This project compiles the files from folder `/src` into the following files in the `/dist` folder: `DraftsClient.js`, `LoginClient.js`, `Modal.js`, `PostClient.js`, `prosemirror.js`. These are separate files that are imported independently by the website using this package.

`DraftsClient.js`, `PostClient.js`, and `LoginClient.js` are responsible for injecting the drafts component, post editing button component, and the login/logout buttons component. `Modal.js` and `prosemirror.js` are dependencies for these.