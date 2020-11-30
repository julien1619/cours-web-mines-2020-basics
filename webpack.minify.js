/* eslint import/no-extraneous-dependencies: "off" */

const webpack = require("webpack");
const merge = require("webpack-merge");
const HashOutput = require("webpack-plugin-hash-output");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  optimization: {
    minimizer: [new MinifyPlugin(), new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [
    new HashOutput(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
  ],
});
