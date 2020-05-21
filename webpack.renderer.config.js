const path = require('path')
const rules = require('./webpack.rules');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const assets = ['assets'];
const copyPlugins = assets.map(asset => {
  return new CopyWebpackPlugin([
    { from: path.resolve(__dirname, 'src', asset), to: asset },
  ]);
});

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: [{ loader: 'babel-loader' }]
})

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: [
    ...copyPlugins,
  ]
};
