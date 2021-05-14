// ===============================================
//  unshift task runner lib file
// ===============================================
const config = require('../config.js');
const utr = require('./utr');

const path = require('path');
const globule = require('globule');

const gaze = require('gaze');

const sassGraph = require('sass-graph');
const PugInheritance = require('pug-inheritance');

const webpack = require('webpack');
const webpackConfig = require('../webpack/config.js');

const IGNORE_PATTERNS = [
  `**/${config.excrusionPrefix}*/**`,
  `**/${config.excrusionPrefix}*`
];

// directory
const publishDir = path.resolve(config.publishDir);
const srcDir = path.resolve(config.srcDir);

//
// lib functions
//

// getFilePaths
// globuleで該当するファイルパス一覧を取得
// options.srcでglobパターンを指定
// matchPatterns (globパターン)がある場合は
// 結果を更にフィルタリングしたものを返す
const getFilePaths = (options, matchPatterns = null)=> {
  const filePaths = globule.find(Object.assign({
    srcBase: srcDir,
    prefixBase: true,
    nodir: true
  }, options));

  return (matchPatterns? globule.match(matchPatterns, filePaths): filePaths).map((filePath)=> path.resolve(filePath));
}

// getGlobPatterns
// 引数に与えられたglobパターンの配列 (pattens)に
// 除外するためのパターンを追加
// withIncludeFiles = trueの場合はそのまま返す
const getGlobPatterns = (pattens, withIncludeFiles = false)=> {
  return withIncludeFiles? pattens: [
    ...pattens,
    ...IGNORE_PATTERNS.map(path => '!' + path)
  ];
}

// getGlobPatternsByName
// config.globPatternsに設定されているglobパターンをnameで取得し
// getGlobPatternsにわたす
const getGlobPatternsByName = (name, withIncludeFiles = false)=> {
  const patterns = config.globPatterns[name];
  return getGlobPatterns(patterns, withIncludeFiles);
}

// getWebpackEntrykeyType0
// 相対パスからtype0のkeyを返す
const getWebpackEntrykeyType0 = (relativeFilePath)=> {
  return relativeFilePath.replace(new RegExp(`\.(${config.toJsExts.join('|')})$`), '.js');
}

// getWebpackEntrykeyType1
// 相対パスからtype1のkeyを返す
const getWebpackEntrykeyType1 = (relativeFilePath)=> {
  const dirname = path.dirname(relativeFilePath);
  return path.join(
    path.dirname(dirname),
    path.basename(dirname).replace(config.excrusionPrefix, '') + '.js',
  );
}

// getWebpackEntryFilePaths
// webpackのentryデータを返す
// matchPatterns (globパターン)がある場合は
// 結果を更にフィルタリングしたものを返す
// type は 0 or 1 (内容はコード内参照)
const getWebpackEntryFilePaths = (type = 0, matchPatterns = null)=> {
  const entries = {};
  let hasEntry = false;

  if(type == 0) {
    // config.excrusionPrefixがつくファイル以外をentry
    getFilePaths({ src: getGlobPatternsByName('js') }, matchPatterns)
    .map((filePath)=> {
      const key = getWebpackEntrykeyType0(getRelativeFilePath(filePath, srcDir));
      entries[key] = filePath;
      hasEntry = true;
    });
  } else {
    // 例として
    // [srcDir]/assets/js/_index/init.js を
    // [puglishDir]/assets/js/index.jsとして出力
    getFilePaths({ src: config.globPatterns.js2 }, matchPatterns)
    .map((filePath)=> {
      const key = getWebpackEntrykeyType1(getRelativeFilePath(filePath, srcDir));
      entries[key] = filePath;
      hasEntry = true;
    });

  }

  return hasEntry? entries: null;
}

// getWebpackAllTypesEntryFilePaths
// getWebpackEntryFilePathsのtype0, type1合わせた結果を返す
// matchPatterns0, matchPatterns1はそれぞれtype0, type1のフィルタ用
const getWebpackAllTypesEntryFilePaths = (matchPatterns0 = null, matchPatterns1 = null)=> {
  let entries = null;
  const entries0 = getWebpackEntryFilePaths(0, matchPatterns0);
  const entries1 = getWebpackEntryFilePaths(1, matchPatterns1);

  if(entries0) entries = entries0;
  if(entries1) entries = Object.assign(entries || {}, entries1);

  return entries;
}

// getRelativeFilePath
// filePathをbaseDirからの相対パスにして返す
const getRelativeFilePath = (filePath, baseDir)=> {
  const relativeFilePath = filePath.replace(baseDir, '')
  .replace(new RegExp(`\\${path.sep}`, 'g'), '/')
  .replace(/^\//, '');
  return relativeFilePath;
}

// getMinifyOption
// config.minifyに設定されている値 (minifyするかどうか)を返す
// ただし、envがdevelopomentの際はminifyしないので常にfalse
// nameは css or js or html
const getMinifyOption = (name)=> {
  return (config.mode === 'production') && config.minify[name];
}

// getSassGraphResult
// sass-graphモジュールでsassの依存関係を取得
const getSassGraphResult = ()=> {
  return sassGraph.parseDir(srcDir,  {
    loadPaths: [ srcDir ] ,
    extensions: config.toCssExts
  }).index;
}

// getSassGraphFiles
// getSassGraphResultの結果のオブジェクトを引数にし
// ファイルの一覧を配列にして返す
const getSassGraphFiles = (sassGraphResult, filePath)=> {
  const importedBy = sassGraphResult[filePath].importedBy;
  if(importedBy.length == 0) {
    return null;
  }
  let filePaths = [];
  importedBy.forEach((path) => {
    const result = getSassGraphFiles(sassGraphResult, path);
    if(result) filePaths = [ ...filePaths, ...result ];
    filePaths.push(getRelativeFilePath(path, srcDir));
  });

  return filePaths;
}

// getPugInheritanceFiles
// pug-inheritanceモジュールを使用してファイルの依存関係を取得
const getPugInheritanceFiles = (filePath, baseDir)=> {
  return new PugInheritance(filePath, baseDir, {
    basedir: baseDir,
    skip: 'node_modules'
  }).files;
}

// webpackCallback
// webpackタスクのコールバック
const webpackCallback = (error, stats, logTaskNames = [ 'js' ], reload = false)=> {
  if(error) {
    utr.error(logTaskNames, error.stack || error);

    if (error.details) {
      utr.error(logTaskNames, error.details);
    }

    reject(error);
    return;
  }

  const info = stats.toJson();

  if(stats.hasErrors()) {
    // compilation errors
    for (const err of info.errors) {
      utr.error(logTaskNames, `${err.file}\n ${err.message}`);
    }
  }

  if (stats.hasWarnings()) {
    utr.log(logTaskNames, 'warning', info.warnings.toString());
  }

  let filePaths = [];
  let filePath = '';

  for(let i = 0, l = info.chunks.length; i < l; i++) {
    const files = info.chunks[i].files;
    for (let j = 0, l2 = files.length; j < l2; j++) {
      filePath = path.join(publishDir, files[j]);
      filePaths.push(filePath);
      utr.log(logTaskNames, 'build', `${filePath}`);
    }
  }

  if(reload && !config.hmr) utr.reloadServer(filePaths);
}

// makeWebpackBuildTask
// webpack.runタスクを生成
// typeは 0 or 1 (getWebpackEntryFilePathsを参照)
const makeWebpackBuildTask = async (type)=> {
  const entries = getWebpackEntryFilePaths(type);

  return new Promise((resolve, reject)=> {
    if(!entries) {
      resolve();
      return;
    }

    const webpackCompiler = webpack(webpackConfig(entries));

    webpackCompiler.run((error, stats)=> {
      webpackCallback(error, stats, [ 'js' ]);
      resolve();
    });
  });
}

// makeWebpackWatchTask
// webpack.watchタスクを生成
// matchPatterns0, matchPatterns1についてはgetWebpackAllTypesEntryFilePathsを参照
const makeWebpackWatchTask = (matchPatterns0 = null, matchPatterns1 = null)=> {
  let entries = getWebpackAllTypesEntryFilePaths(matchPatterns0, matchPatterns1);
  if(!entries) return { promises: null, watching: null };

  if(config.hmr) {
    Object.keys(entries).map((key)=> {
      entries[key] = [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        entries[key]
      ];
    });
  }

  const webpackCompiler = webpack(webpackConfig(entries));

  const promise = new Promise((resolve)=> {
      if(config.hmr) return resolve();

      webpackCompiler.watch(
        { ignored: /node_modules/ },
        (error, stats)=> {
          webpackCallback(error, stats, [ 'watch', 'js' ], true);
          resolve();
        }
      );
  })


  return { promise, webpackCompiler };
}

// makeWatchTask
// gazeモジュールによるタスクを生成
// taskNameは copy ,htmlなど
// srcは処理するファイル一覧の配列
// onCompileは added, changed, renamed時のコールバック
// onDeleteは deleted, renamed時のコールバック
// onAllPreProcessはすべてのイベントの前に実行される処理
//
// コールバックの引数
//
const makeWatchTask = (
  taskName,
  src,
  onCompile = ()=> {},
  onDelete = ()=> {},
  onAllPreProcess = ()=> {}
)=> {
  return gaze(
    src,
    { cwd: srcDir },
    (error, watcher)=> {
      watcher.on('all', async (eventName, filePath, renamedfilePath = '')=> {
        utr.log([ 'watch', taskName ], eventName, filePath);

        // 何らかの更新があったときに引数で与えられた処理を実行
        onAllPreProcess(taskName, eventName, filePath, renamedfilePath);

        // 追加、内容変更、リネーム時は引数で与えられた処理を実行
        if(eventName.match(/(added|changed|renamed)/)) onCompile(taskName, eventName, filePath, renamedfilePath);

        // 削除またはリネーム時はpublicDirの対象ファイルを削除
        if(eventName.match(/(deleted|renamed)/)) onDelete(taskName, eventName, filePath, renamedfilePath);

        // エラー
        if(error) utr.error([ 'watch', taskName ], error);
      });
    }
  );
}

module.exports = {
  getFilePaths,
  getGlobPatterns,
  getGlobPatternsByName,
  getWebpackEntryFilePaths,
  getWebpackAllTypesEntryFilePaths,
  getRelativeFilePath,
  getMinifyOption,
  getSassGraphResult,
  getSassGraphFiles,
  getPugInheritanceFiles,
  webpackCallback,
  makeWebpackBuildTask,
  makeWebpackWatchTask,
  makeWatchTask
};