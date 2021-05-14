const config = require('../../config.js');

const settings = {
  loader: 'babel-loader',
  options: {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          corejs: 3,
          useBuiltIns: "usage",
          targets: {
            node: 'current',
            browsers: config.targetBrowsers
          }
        }
      ],
      '@babel/preset-react'
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      'transform-react-pug'
    ]
  }
}

if(config.mode === 'development') settings.options.plugins.unshift('react-hot-loader/babel');

module.exports = settings;
