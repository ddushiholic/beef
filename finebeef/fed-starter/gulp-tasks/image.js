const { src, dest, lastRun } = require('gulp');
// const mozjpeg = require('imagemin-mozjpeg');
// const pngquant = require('imagemin-pngquant');
// const imagemin = require('gulp-imagemin');
const plugins = require('gulp-load-plugins');

// const production = require('./helper/mode');

/* Plugins */
// { if, notify, plumber }
const $ = plugins();

/* Configuration */
const { IMG, PATH } = require('./config.json');

/* IMAGES */
function image() {
  return (
    src(PATH.src + IMG.src, { since: lastRun(image) })
      // .pipe($.if(production, imagemin([
      //     pngquant({ quality: [0.5, 0.5] }),
      //     mozjpeg({ quality: 50 })
      //   ])
      // ))
      .pipe(dest(PATH.dest + IMG.dest))
  );
}

module.exports = image;
