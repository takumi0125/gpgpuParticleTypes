// npm modules
const path = require('path');
const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// loader settings
const babelLoaderSettings   = require('./loaderSettings/babel.js'  );
const tsLoaderSettings      = require('./loaderSettings/ts.js'     );
const sassLoaderSettings    = require('./loaderSettings/sass.js'   );
const cssLoaderSettings     = require('./loaderSettings/css.js'    );
const postCSSLoaderSettings = require('./loaderSettings/postcss.js');

const config = require('../config.js');

const jsExcludedModulesRegExp = new RegExp(`node_modules\\${path.sep}(?!(${config.transpileNodeModules.join('|')})\\${path.sep}).*`);

console.log(config.resolvedSrcDir);
module.exports = (entry)=> {
  const mode = config.mode;
  const isDev = mode === 'development';

  const webpackConfig = {
    mode,

    entry,

    context: config.resolvedSrcDir,

    // cache: {
    //   type: 'filesystem',
    //   buildDependencies: {
    //     config: [__filename]
    //   }
    // },

    output: {
      path: config.resolvedPublishDir,
      filename: '[name]',
      chunkFilename: '[name]',
      publicPath: '/'
    },

    devServer: {
      hot: isDev && config.hmr
    },

    resolve: {
      extensions: [ '.js', '.jsx', '.vue', '.ts', '.tsx', '.glsl', '.vert', '.frag' ],
      alias: config.webpackResolveAlias || {}
    },

    target: [ 'web', 'es5' ],

    module: {
      rules: [
        // js/jsx
        {
          test: /\.(js|jsx)$/,
          exclude: jsExcludedModulesRegExp,
          use: [
            babelLoaderSettings
          ]
        },

        // ts/tsx
        {
          test: /\.(ts|tsx)$/,
          exclude: jsExcludedModulesRegExp,
          use: [
            babelLoaderSettings,
            tsLoaderSettings
          ]
        },

        // vue
        {
          test: /\.vue$/,
          use: [ 'vue-loader' ]
        },

        //  json
        {
          test: /\.json$/,
          use: [ 'json-loader' ],
          type: "javascript/auto"
        },

        //  glsl
        {
          test: /\.(glsl|vert|frag)$/,
          use: [
            'raw-loader',
            'glslify-loader'
          ]
        },

        // pug
        {
          test: /\.pug$/,
          oneOf: [
            // for vue <template lang="pug">
            {
              resourceQuery: /^\?vue/,
              use: [ 'pug-plain-loader' ]
            },
            { use: [ 'raw-loader', 'pug-plain-loader' ] }
          ]
        },

        // css/sass/scss
        {
          test: /\.(css|sass|scss)$/,
          oneOf: [
            // for vue <style lang="scss">
            {
              resourceQuery: /^\?vue/,
              use: [
                'vue-style-loader',
                cssLoaderSettings,
                postCSSLoaderSettings,
                sassLoaderSettings
              ]
            },
            // for react CSS Module
            {
              use: [
                'style-loader',
                Object.assign({}, cssLoaderSettings, { options: { modules: true } }),
                postCSSLoaderSettings,
                sassLoaderSettings
              ]
            }
          ]
        }
      ]
    },

    plugins: [
      new WriteFilePlugin(),
      new VueLoaderPlugin(),

      // define
      new webpack.DefinePlugin({
        ENV: JSON.stringify({
          mode,
          projectName: config.projectName,
          data: config.defineData[mode]
        })
      }),
    ],

    optimization: {
    }
  };

  // source-map
  if(isDev) webpackConfig.devtool = 'source-map'

  // HMR
  if(mode === 'development' && config.hmr) {
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    webpackConfig.resolve.alias['react-dom'] = '@hot-loader/react-dom';
  }

  // Split Chunks
  if(config.splitChunksCommon) {
    webpackConfig.optimization.splitChunks = {
      cacheGroups: {
        common: {
          test: (module, chunks)=> {
            const includes = config.splitChunksCommon.includes;
            const excludes = config.splitChunksCommon.excludes;
            if(!module.resource) return false;
            const resource = module.resource.replace(new RegExp(`\\${path.sep}`, 'g'), '/');
            const regExpIncludes = new RegExp(includes.join('|'));
            const regExpExcludes = new RegExp(excludes.join('|'));
            return resource &&
                   resource.match(regExpIncludes) &&
                   (!excludes || excludes.length === 0 || !resource.match(regExpExcludes));
          },
          name: config.splitChunksCommon.name.replace(/\//g, path.sep),
          chunks: 'all',
          enforce: true,
          // minChunks: 2,
        },
        default: false,
        defaultVendors: false
      }
    }
  }

  // 圧縮
  if(mode === 'production' && config.minify.js) {
    webpackConfig.optimization = {
      ...webpackConfig.optimization,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            compress: { drop_console: true }
          }
        })
      ]
    }
  }

  return webpackConfig;
}