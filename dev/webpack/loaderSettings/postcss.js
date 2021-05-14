const config = require('../../config.js');
const autoprefixer = require('autoprefixer');
const sortMediaQueries = require('postcss-sort-media-queries');

module.exports = {
  loader: 'postcss-loader',
  options: {
    sourceMap: config.mode === 'development',
    postcssOptions: {
      plugins: [
        sortMediaQueries(),
        autoprefixer(config.autoprefixerOpt)
      ]
    }
  }
}