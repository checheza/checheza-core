const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    core: [ '@babel/polyfill/noConflict', 'jszip' ,'./src/core.js' ],
  }, 
  target: 'node',
  output: {
    library: 'checheza_core',
    libraryTarget: 'umd',
    globalObject: 'this',
    filename: 'core.js',
    path: path.resolve(__dirname, './')
  },
  module: {
    rules: [ 
      {
        test: /\.css$/i,
        use: [ { loader: 'style-loader' }, { loader: 'css-loader', options: { url: true, modules: true } }],
      },
      {
        test: /\.(jpe?g|png|ttf|eot|svg|wav|ogg|mp3|otf|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: 'base64-inline-loader?limit=1000&name=[name].[ext]'
      },
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
