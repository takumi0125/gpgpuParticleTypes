const config = require('../../config.js');
const path = require('path');

module.exports = {
  loader: 'ts-loader',
  options: {
    appendTsSuffixTo: [/\.vue$/],
    context: path.resolve(config.srcDir),
    configFile: path.join(config.projectDir, 'tsconfig.json'),
    compilerOptions: {
      sourceMap: config.mode === 'development'
    }
  }
}
