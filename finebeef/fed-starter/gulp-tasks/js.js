const { src, dest } = require('gulp');
const plugins = require('gulp-load-plugins');
const uglify = require('gulp-uglify');

const production = require('./helper/mode');

/* Plugins */
// { if, notify, plumber }
const $ = plugins();

/* Configuration */
const { ERROR, JS, PATH } = require('./config.json');

function js() {
  return src(PATH.src + JS.src, { allowEmpty: true })
    .pipe($.sourcemaps.init())
    .pipe($.plumber({ errorHandler: $.notify.onError(ERROR) }))
    .pipe($.babel({ presets: ['@babel/preset-env'] }))
    .pipe($.if(production, uglify()))
    .pipe($.sourcemaps.write('./', { sourceRoot: PATH.src + JS.src }))
    .pipe(dest(PATH.dest + JS.dest));
}

module.exports = js;
