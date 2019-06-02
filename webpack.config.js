const path = require('path');

module.exports = {
  entry: './src/modelHelper.js',
  mode: 'production',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: 'umd',
    library: 'ModelHelper'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};