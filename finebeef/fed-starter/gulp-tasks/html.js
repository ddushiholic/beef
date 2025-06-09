const { src, dest } = require('gulp');
const fileinclude = require('gulp-file-include');
const plugins = require('gulp-load-plugins');

/* Plugins */
// { if, notify, plumber }
const $ = plugins();

/* Configuration */
const { ERROR, HTML, PATH } = require('./config.json');

/* HTML */
function html() {
  return src(PATH.src + HTML.src, { allowEmpty: true })
    .pipe($.plumber({ errorHandler: $.notify.onError(ERROR) }))
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: PATH.src + HTML.basePath,
      }),
    )
    .pipe(dest(PATH.dest + HTML.dest));
}

module.exports = html;
