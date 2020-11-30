/* eslint import/no-extraneous-dependencies: "off" */
/* eslint global-require: "off" */

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const devMode = process.env.NODE_ENV === "development";

module.exports = {
  entry: {
    app: ["@babel/polyfill", "./src"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.[chunkhash].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader", "eslint-loader"],
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: (loader) => [
                require("postcss-import")({ root: loader.resourcePath }),
                require("postcss-preset-env")(),
                require("cssnano")(),
              ],
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.md$/,
        use: ["html-loader", "markdown-loader"],
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
      {
        test: /\.jpe?g|\.png|\.gif|\.mp3|\.pdf$/,
        use: "file-loader",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: devMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css",
    }),
    new HtmlWebpackPlugin({
      template: "src/index.template.html",
    }),
    new FaviconsWebpackPlugin({
      logo: "./src/images/favicon.png",
      background: "#fff",
      title: "Cours Web Mines Nancy",
    }),
    new CopyWebpackPlugin([
      {
        from: "./src/images/favicon.png",
        to: "favicon.png",
      },
    ]),
  ],
};
