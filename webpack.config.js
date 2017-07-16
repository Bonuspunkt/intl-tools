const path = require('path')

module.exports = {
    entry: [
        './test.js'
    ],
    output: {
        path: path.resolve(__dirname, 'webRoot'),
        filename: 'script.js'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                { loader: "style-loader" },
                { loader: "css-loader" }
            ]
        }]
    },
    devServer: {
        contentBase: path.join(__dirname, "webRoot")
    }
};
