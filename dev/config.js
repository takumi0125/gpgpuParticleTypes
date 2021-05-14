// ===============================================
//  config
// ===============================================

const path = require('path');

// プロジェクト名
const PROJECT_NAME = 'gpgpuParticle';

// プロジェクトディレクトリ
const PROJECT_DIR = __dirname + '/../';  // globパターンとしても使用するので path.resolveはしない

// ソースディレクトリ
const SRC_DIR = PROJECT_DIR + 'src';

// 出力ディレクトリ
const PUBLISH_DIR = PROJECT_DIR + 'htdocs';

// assetsディレクトリ名 (globパターンとしても使用するので path.resolveはしない)
const ASSETS_DIR_NAME = 'assets';

// コンテンツディレクトリ (ドキュメントルート直下の場合は空, 末尾に/はつけない)
// https://sample.jp/aaaa/ のようなサイトの開発の場合 'aaa' を指定する
// https://sample.jp/ のようにドキュメントルート直下の場合は '' でよい
const CONTENTS_DIR = '';

// タスク除外用prefix
const EXCRUSION_PREFIX = '_';

// ターゲットブラウザ
const TARGET_BROWSERS = [
  'last 2 versions',
  'ie >= 11',
  'Android >= 4.4',
  'iOS >= 12'
];

// 最終的にhtmlに出力する拡張子
const TO_HTML_EXTS = [ 'pug', 'html' ];

// 最終的にcssに出力する拡張子
const TO_CSS_EXTS = [ 'css', 'sass', 'scss' ];

// 最終的にjsに出力する拡張子
const TO_JS_EXTS = [ 'jsx', 'tsx', 'js', 'ts', 'vue' ];

// タスクを実行するディレクトリのプレフィックス
const CONTENTS_DIR_PREFIX = CONTENTS_DIR? `${CONTENTS_DIR}/`: '';

const config = {
  // プロジェクト名
  projectName: PROJECT_NAME,

  // mode
  mode: process.env.NODE_ENV || 'development',

  // プロジェクトディレクトリ
  projectDir: PROJECT_DIR,
  resolvedProjectDir: path.resolve(PROJECT_DIR),

  // ソースディレクトリ
  srcDir: SRC_DIR,
  resolvedSrcDir: path.resolve(SRC_DIR),

  // 納品ディレクトリ
  publishDir: PUBLISH_DIR,
  resolvedPublishDir: path.resolve(PUBLISH_DIR),

  // assetsディレクトリ
  assetDirName: 'ASSETS_DIR_NAME',
  assetDir: `${SRC_DIR}/${ASSETS_DIR_NAME}`,
  resolvedAssetsDir: path.resolve(`${SRC_DIR}/${ASSETS_DIR_NAME}`),

  // タスクから除外するためのプレフィックス
  excrusionPrefix: EXCRUSION_PREFIX,

  // ターゲットブラウザ
  targetBrowsers: TARGET_BROWSERS,

  // autoprefixerのオプション
  autoprefixerOpt: {
    overrideBrowserslist: TARGET_BROWSERS,
    grid: true
  },

  // ファイル圧縮
  minify: {
    css : true, // CSSを圧縮するかどうか
    js  : true, // JSを圧縮するかどうか
    html: false // HTMLを圧縮するかどうか (trueは非推奨)
  },

  // pugで変数として展開するデータ (title, meta descriptionなど)
  metaDataJson: path.join(__dirname, 'meta.js'),

  // 最終的にHTMLに出力する拡張子
  toHtmlExts: TO_HTML_EXTS,

  // 最終的にcssに出力する拡張子
  toCssExts: TO_CSS_EXTS,

  // 最終的にJSに出力する拡張子
  toJsExts: TO_JS_EXTS,

  // 各タスクで使用するglobパターン
  globPatterns: {
    initProj: [
    ],
    clean: [
      '**/**'
    ],
    copy: [
      '**/**',
      '**/.htaccess',
      '**/.htpasswd',
      `!**/${EXCRUSION_PREFIX}*/**`,
      `!**/${EXCRUSION_PREFIX}*`,
      `!**/*.{html,htm,xhtml,pug,css,scss,sass,js,ts,vue,jsx,tsx}`
    ],
    html: [ `${CONTENTS_DIR_PREFIX}**/*.{html,htm,xhtml}` ],
    pug: [ `${CONTENTS_DIR_PREFIX}**/*.pug` ],
    sass: [ `${CONTENTS_DIR_PREFIX}**/*.{${TO_CSS_EXTS.join(',')}}` ],
    js: [ `${CONTENTS_DIR_PREFIX}**/*.{${TO_JS_EXTS.join(',')}}` ],
    js2: [ `${CONTENTS_DIR_PREFIX}**/${EXCRUSION_PREFIX}*/{entry,init}.{${TO_JS_EXTS.join(',')}}` ]
  },

  // ローカルサーバー (BrowserSync)のオプション
  localServerOptions: {
    server: path.resolve(PUBLISH_DIR),
    startPath:  `${CONTENTS_DIR_PREFIX}`,
    https: false,
    // proxy: 'localhost:8888',
  },

  // 外部サーバのAPI設定 (useProxyがtrueのときに有効)
  apiMiddlewareProxySettings: {
    useProxy: false,
    url: 'https://example.com/api',
    route: '/api',
    cookieRewrite: true,
    // authJson: require(path.join(PROJECT_DIR, '.credentials/basic.json'))
  },

  //HMR
  hmr: false,

  // Split Chunks
  splitChunksCommon: {
    name: `${ASSETS_DIR_NAME}/js/lib.js`,
    includes: [
      'node_modules',
      // `${ASSETS_DIR_NAME}/js/_modules`,
    ],
    // 除外するモジュール
    excludes: [
      // 'three',
    ]
  },

  // babelを通すNodeモジュール
  transpileNodeModules: [
    'three',
    'gsap',
    // 'vuex',
    'swiper'
  ],

  // js内で使用できるデータ
  defineData: {
    development: {},
    production: {}
  },

  // webpack.config.resolve.alias
  webpackResolveAlias: {
    // vue: 'vue/dist/vue.esm.js',
    '@': path.resolve(`${SRC_DIR}/${ASSETS_DIR_NAME}/js`),
    '~': path.resolve(`${SRC_DIR}/${ASSETS_DIR_NAME}/js`),
  }
};

// トランスパイルする拡張子の対応テーブルを生成
const destExtsTable = {};
TO_HTML_EXTS.map(ext=> destExtsTable[ext] = 'html');
TO_CSS_EXTS.map(ext=> destExtsTable[ext] = 'css');
TO_JS_EXTS.map(ext=> destExtsTable[ext] = 'js');
config.destExtsTable = destExtsTable;

// タスクランナーの各スクリプトからconfigオブジェクトをrequireして使用
module.exports = config;