const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    core: [ './src/core.js' ],
  }, 
  target: 'node',
  output: {
    library: 'Core',
    libraryTarget: 'umd',
    filename: '[name].js',
    path: path.resolve(__dirname, 'build/')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
