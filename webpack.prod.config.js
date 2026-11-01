module.exports = {
    mode: 'production',
    // gh-pages serves the app from a sub-path, so the bundle must be linked
    // relatively. The dev server needs the default public path instead.
    output: {
        publicPath: './',
    },
};
