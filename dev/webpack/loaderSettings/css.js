const config = require('../../config.js');

module.exports = {
  loader: 'css-loader',
  options: {
    modules: false,
    esModule: false,
    importLoaders: 2,
    sourceMap: config.mode === 'development',
  }
}
