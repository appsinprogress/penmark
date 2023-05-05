# Development guide for Edit Blog Content From Site

### How to develop the package

To edit the source code, edit the files in the `/src` folder.

To install needed NPM modules, run `npm install`.

To build the package, run `npm run build`. This uses webpack to build the project. Change the `mode` to `production` or `development` in `webpack.config.js` based on what you are building for.

To serve the package for local development, run `npm run serve`. This uses webpack dev server to serve the package locally, allowing you to import it into your blog/website at the `http://localhost:9000` address.

### How to use the development package locally (with development projects)

* Edit the `webpack.config.js` of this project, to change the value of **__JS_PACKAGE_HOST__** to `http://localhost:9000`.
* Run `npm install`, and `npm serve`. The assests are now hosted at `http://localhost:9000/PostClient.js` (for instance).
* Replace the usage of the library in your project to the locally served files (`http://localhost:9000/PostClient.js`) by changing the import scripts.

### Explanation of project structure & files

This project compiles the files from folder `/src` into the following files in the `/dist` folder: `DraftsClient.js`, `LoginClient.js`, `Modal.js`, `PostClient.js`, `prosemirror.js`. These are separate files that are imported independently by the website using this package.

`DraftsClient.js`, `PostClient.js`, and `LoginClient.js` are responsible for injecting the drafts component, post editing button component, and the login/logout buttons component. `Modal.js` and `prosemirror.js` are dependencies for these.

### Package for distribution

To package the library, replace the `__JS_PACKAGE_HOST__` value in `webpack.config.js`. This value needs to be the future url of the package.Then, run `npm run build`.  Next, run `npm publish` to publish the package to npm. Make sure to change the README as well. The package can then be downloaded from jsdelivr into any HTML project.