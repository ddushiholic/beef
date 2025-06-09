const { src, dest } = require('gulp');
const named = require('vinyl-named');
const plugins = require('gulp-load-plugins');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config');

const production = require('./helper/mode');

/* Plugins */
// { if, notify, plumber }
const $ = plugins();

/* Configuration */
const { ERROR, MJS, PATH } = require('./config.json');

function mjs() {
  return src(PATH.src + MJS.src, { allowEmpty: true, sourcemaps: !production })
    .pipe(named())
    .pipe($.plumber({ errorHandler: $.notify.onError(ERROR) }))
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(dest(PATH.dest + MJS.dest, { sourcemaps: '.' }));
}

module.exports = mjs;
