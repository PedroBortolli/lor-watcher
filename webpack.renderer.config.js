const rules = require('./webpack.rules');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: [{ loader: 'babel-loader' }]
})

rules.push({
  test: /\.(jpg|png|svg|ico|icns)$/,
  loader: "file-loader",
  options: {
    name: "[path][name].[ext]",
    publicPath: "..", // move up from 'main_window'
    context: "src", // set relative working folder to src
  },
})

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: [
    new CopyWebpackPlugin(
      [{ from: path.join("src", "assets"), to: "assets" }],
      {
        ignore: [".gitkeep"],
      }
    ),
  ],
};
