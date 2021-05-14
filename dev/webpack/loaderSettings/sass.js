const config = require('../../config.js');

module.exports = {
  loader: 'sass-loader',
  options: {
    sourceMap: config.mode === 'development',
    sassOptions: {
      outputStyle: 'expanded'
    }
  }
}