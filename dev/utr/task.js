// ===============================================
//  unshift task runner task file
// ===============================================
const config = require('../config.js');
const utr = require('./utr');

const path = require('path');
const fs = require('fs-extra');

const htmlMinifier = require('html-minifier').minify;

const pug = require('pug');

const sass = require('sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sortMediaQueries = require('postcss-sort-media-queries');

const {
  getFilePaths,
  getGlobPatterns,
  getGlobPatternsByName,
  getRelativeFilePath,
  getMinifyOption,
  getSassGraphResult,
  getSassGraphFiles,
  getPugInheritanceFiles,
  makeWebpackBuildTask,
  makeWebpackWatchTask,
  makeWatchTask
} = require('./lib.js');

// watchOnDeleteDefault
// watchタスクの deleted/renamed イベント時のデフォルト実行処理
const watchOnDeleteDefault = (taskName, eventName, filePath, renamedfilePath = '')=> {
  const fromExt = path.extname(filePath).replace('.', '');
  const toExt = config.destExtsTable[fromExt];
  let clearFilePath = getRelativeFilePath(renamedfilePath || filePath, srcDir);
  if(toExt) clearFilePath = clearFilePath.replace(new RegExp(`${fromExt}$`), toExt);
  tasks.clean({ src: clearFilePath }, [ 'watch', taskName, 'clean' ]);

  // sourcemapも削除
  if((taskName == 'sass' || taskName == 'js')) {
    tasks.clean({ src: clearFilePath.replace(/(.*)\.(css|js)$/, "$1.$2.map") }, [ 'watch', taskName, 'clean' ]);
  }
}

// directory
const publishDir = path.resolve(config.publishDir);
const srcDir = path.resolve(config.srcDir);

let webpackWatchings = {};

const tasks = {
  // コピー対象ファイルをpublishDirに展開するタスク
  initProj: async (options = {}, logTaskNames = [ 'initProj' ])=> {
    await tasks.copy({ src: getGlobPatternsByName('initProj') }, [ 'initProj' ]);
  },

  // publishDirのファイルを削除するタスク
  clean: async (options = {}, logTaskNames = [ 'clean' ])=> {
    const promises = [];
    const cleanedFilePaths = [];

    getFilePaths({
      src: options.src || config.globPatterns.clean,
      srcBase: publishDir,
      nodir: false,
    })
    .map((filePath)=> {
      promises.push(
        fs.remove(filePath)
        .then(()=> {
          cleanedFilePaths.push(filePath);
          utr.log(logTaskNames, 'deleted', filePath);
        })
        .catch((e)=> utr.error(logTaskNames, e))
      );
    });

    await Promise.all(promises);
    return cleanedFilePaths;
  },

  // コピー対象ファイルをpublishDirに展開するタスク
  copy: async (options = {}, logTaskNames = [ 'copy' ])=> {
    const promises = [];
    const distFilePaths = [];

    getFilePaths({ src: options.src || getGlobPatternsByName('copy') })
    .map((filePath)=> {
      const dist = filePath.replace(srcDir, publishDir);
      promises.push(
        fs.copy(filePath, dist)
        .then(()=> {
          distFilePaths.push(dist);
          utr.log(logTaskNames, 'copy', dist);
        })
        .catch((e)=> utr.error(logTaskNames, e))
      );
    });

    await Promise.all(promises);
    return distFilePaths;
  },

  // htmlをコピーまたはminifyしてpublishDirに展開するタスク
  html: async(options = {})=> {
    const promises = [];

    const filePaths = getFilePaths({ src: options.src || getGlobPatternsByName('html') });
    const distFilePaths = [];

    if(getMinifyOption('html')) {
      // minify & copy
      filePaths.map((filePath)=> {
        const dist = filePath.replace(srcDir, publishDir);
        promises.push((async ()=> {
          const minifiedHtml = htmlMinifier(
            fs.readFileSync(filePath).toString(),
            {
              caseSensitive: true,
              collapseWhitespace: true,
              keepClosingSlash: true,
              minifyCSS: true,
              minifyJS: true,
              preventAttributesEscaping: true,
              removeComments: true
            }
          );
          return fs.outputFile(dist, minifiedHtml)
          .then(()=> {
            distFilePaths.push(dist);
            utr.log('html', 'minified', dist);
          })
          .catch((e)=> utr.error('html', e))
        })());
      });
    } else {
      // copy only
      filePaths.map((filePath)=> {
        const dist = filePath.replace(srcDir, publishDir);
        distFilePaths.push(dist);
        promises.push(
          tasks.copy({ src: getRelativeFilePath(filePath, srcDir) }, [ 'html' ])
        );
      });
    }

    await Promise.all(promises);
    return distFilePaths;
  },

  // pugをコンパイルしてpublishDirに展開するタスク
  pug: async(options = {})=> {
    const promises = [];
    const metaData = require(config.metaDataJson)();
    metaData.data = config.defineData[config.mode];
    const distFilePaths = [];

    getFilePaths({ src: options.src || getGlobPatternsByName('pug') })
    .map((filePath)=> {
      const dist = filePath.replace(srcDir, publishDir).replace(/\.pug$/, '.html');
      promises.push((async ()=> {
        let pugCompile;
        try {
          pugCompile = pug.compileFile(
            filePath,
            {
              pretty: !getMinifyOption('html'),
              basedir: srcDir
            }
          );
        } catch(e) {
          utr.log('pug', 'error', e.toString());
        }
        if(!pugCompile) return;

        const pugResult = pugCompile(metaData);
        if(!pugResult) return;

        return fs.outputFile(dist, pugResult)
        .then(()=> {
          distFilePaths.push(dist);
          utr.log('pug', 'build', dist);
        })
        .catch((e)=> utr.error('pug', e))
      })());
    });

    await Promise.all(promises)
    return distFilePaths;
  },

  // css/sass/scssをコンパイルしてpublishDirに展開するタスク
  sass: async(options = {})=> {
    const promises = [];
    const cssMinifyOption = getMinifyOption('css');
    const distFilePaths = [];

    getFilePaths({ src: options.src || getGlobPatternsByName('sass') })
    .map((filePath)=> {
      const dist = filePath.replace(srcDir, publishDir).replace(/\.(sass|scss)$/, '.css');

      const sassOptions = {
        file: filePath,
        outputStyle: 'expanded'
      }
      const postcssProcessOptions = { from: filePath, to: dist };
      const postcssPlugins = [
        sortMediaQueries(),
        autoprefixer(config.autoprefixerOpt)
      ];

      if(cssMinifyOption) {
        // minify by cssnano
        postcssPlugins.push(cssnano(({
          autoprefixer: false,
          zindex: false
        })));
      } else {
        // sourcemap
        sassOptions.sourceMap = true;
        sassOptions.sourceMapContents = true;
        sassOptions.outFile = dist;
      }
      promises.push((async ()=> {
        // sass process
        let sassResult;
        await new Promise((resolve, reject)=> {
          sass.render(sassOptions, (error, result)=> {
            if(error) {
              utr.log('sass', 'error', error.file + "\n" + error.formatted)
              resolve(error);
              return;
            }
            sassResult = result;
            resolve();
          });
        });

        if(!sassResult) return [];

        if(sassResult.map) {
          postcssProcessOptions.map = {
            inline: false,
            prev: sassResult.map.toString()
          }
        }

        // postcss process
        const postcssResult = await postcss(postcssPlugins)
        .process(sassResult.css.toString(), postcssProcessOptions)

        // file output
        const fsPromises = [
          fs.outputFile(dist, postcssResult.css.toString())
          .then(()=> {
            distFilePaths.push(dist);
            utr.log('sass', 'build', dist)
          })
          .catch((e)=> utr.error('sass', e))
        ];

        // sourcemap file
        if(postcssResult.map) {
          const sourcemapPath = dist.replace(/\.css$/, '.css.map');
          fsPromises.push(
            fs.outputFile(sourcemapPath, postcssResult.map.toString())
            .then(()=> {
              distFilePaths.push(sourcemapPath);
              utr.log('sass', 'build', sourcemapPath)
            })
            .catch((e)=> utr.error('sass', e))
          )
        }

        return Promise.all(fsPromises);
      })());
    });

    await Promise.all(promises);
    return distFilePaths;
  },

  // jsをwebpackでコンパイルしてpublishDirに展開するタスク
  js: async(options = {})=> {
    return Promise.all([
      makeWebpackBuildTask(0),
      makeWebpackBuildTask(1)
    ]);
  },

  // 監視タスク
  // ファイルに変更があった場合、各種タスクを実行
  watch: async (options = {})=> {
    // watch and copy
    makeWatchTask(
      'copy',
      getGlobPatternsByName('copy'),
      async (taskName, eventName, filePath, renamedfilePath)=> {
        await tasks.copy({ src: getRelativeFilePath(filePath, srcDir) });
        utr.reloadServer(filePath);
      },
      watchOnDeleteDefault
    );

    // watch html
    makeWatchTask(
      'html',
      getGlobPatternsByName('html'),
      async (taskName, eventName, filePath, renamedfilePath)=> {
        const distFilePaths = await tasks.html({ src: getRelativeFilePath(filePath, srcDir) });

        // リロード
        utr.reloadServer(distFilePaths);
      },
      watchOnDeleteDefault
    );

    // watch pug
    makeWatchTask(
      'pug',
      getGlobPatternsByName('pug', true),
      async (taskName, eventName, filePath, renamedfilePath)=> {
        // 依存関係を取得 (extend, include) (自身も含まれる)
        const filePaths = getPugInheritanceFiles(filePath, srcDir);
        const distFilePaths = await tasks.pug({ src: getGlobPatterns(filePaths) });

        // リロード
        utr.reloadServer(distFilePaths);
      },
      watchOnDeleteDefault
    );

    // meta.json
    makeWatchTask(
      'pug',
      [ config.metaDataJson ],
      async (taskName, eventName, filePath, renamedfilePath)=> {
        // meta.jsonの更新があった場合はすべてのpugをコンパイル
        await tasks.pug({ src: getGlobPatternsByName('pug') });

        // リロード
        utr.reloadServer();
      },
      (taskName, eventName, filePath, renamedfilePath)=> {
        utr.error('pug', 'Don\'t delete meta.json!!' )
      }
    );

    // watch sass
    let sassGraphResult;
    makeWatchTask(
      'sass',
      getGlobPatternsByName('sass', true),
      async (taskName, eventName, filePath, renamedfilePath)=> {
        // 依存関係のファイルを取得
        let filePaths = getSassGraphFiles(sassGraphResult, filePath) || [];
        filePaths = getGlobPatterns([
          ...filePaths,
          getRelativeFilePath(filePath, srcDir)
        ])
        distFilePaths = await tasks.sass({ src: filePaths });

        // ホットリロード
        utr.reloadServer(distFilePaths);
      },
      watchOnDeleteDefault,
      (taskName, eventName, filePath, renamedfilePath)=> {
        // 依存関係のデータを更新 (@import)
        sassGraphResult = getSassGraphResult();
      }
    );

    // watch js not in webpack entries
    // added or deleted or renamed
    makeWatchTask(
      'js',
      getGlobPatternsByName('js', true),
      (taskName, eventName, filePath, renamedfilePath)=> {
        // TODO: onCompile
      },
      (taskName, eventName, filePath, renamedfilePath)=> {
        // TODO: onDelete
      }
    );

    const { promise, webpackCompiler } = makeWebpackWatchTask();
    await promise;

    // server by browser-sync
    utr.initServer(config.localServerOptions, webpackCompiler, config.hmr, config.apiMiddlewareProxySettings);
  },

  // build → watch
  start: async (options = {})=> {
    await utr.execTask('clean');

    await utr.execTaskParallel([
      'html',
      'pug',
      'sass',
      // 'js',  // watchの最初にjsタスクが走るため、startでは除外
      'copy'
    ]);

    await utr.execTask('watch');
  },

  // clean後にすべてのタスクを実行
  build: async (options = {})=> {
    await utr.execTask('clean');

    await utr.execTaskParallel([
      'html',
      'pug',
      'sass',
      'js',
      'copy'
    ]);
  }
}

module.exports = tasks;