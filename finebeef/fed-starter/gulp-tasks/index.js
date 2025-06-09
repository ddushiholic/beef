const { series, parallel, watch } = require('gulp');

const font = require('./font');
const image = require('./image');
const clean = require('./clean');
const copy = require('./copy');
const css = require('./css');
const js = require('./js');
const mjs = require('./mjs');
const html = require('./html');
const icon = require('./icon');
const { serve, browserReload } = require('./serve');

/* Configuration */
const { CSS, IMG, HTML, ICON, JS, MJS, CJS, PATH } = require('./config.json');
const production = require('./helper/mode');

/* Build */
const buildTask = series(clean, parallel(copy, css, font, icon, image, js, html, mjs));
/* Dev */
const devTask = series(buildTask, serve, () => {
  // css
  watch(PATH.src + CSS.src, series(css, browserReload));
  // es6+
  watch([PATH.src + MJS.src, PATH.src + CJS.src], series(mjs, browserReload));
  // custom fed
  watch(PATH.src + JS.src, series(js, browserReload));
  // html
  watch([PATH.src + HTML.src, PATH.src + HTML.basePath + '/*.html'], series(html, browserReload));
  // icon
  watch(PATH.src + ICON.src, series(icon, browserReload));
  // image, index.html
  watch([PATH.public + IMG.src, PATH.public + '/index.html'], series(copy, browserReload));
});

/* Exports */
module.exports = {
  default: production ? series(buildTask) : series(devTask),
  build: buildTask,
  dev: devTask,
  check: devTask,
};
