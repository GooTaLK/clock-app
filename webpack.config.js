/* @type {import('webpack').Configuration} */

const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = (env, argv) => {
  const devMode = argv.mode === "development";

  const config = {
    output: {
      path: path.resolve(__dirname, "dist"),
      assetModuleFilename: "assets/[name][ext]",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.(c|s[ac])ss$/,
          use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: ["autoprefixer"],
                },
              },
            },
            "sass-loader",
          ],
        },
        {
          test: /\.(png|jpg|svg|mp3)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
    ].concat(devMode ? [] : [new MiniCssExtractPlugin()]),
    optimization: {
      minimizer: [`...`, new CssMinimizerPlugin()],
    },
  };

  return config;
};
