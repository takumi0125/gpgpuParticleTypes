
const g = window[ENV.projectName] = window[ENV.projectName] || {};
import Main from './Main'
g.main = new Main();

