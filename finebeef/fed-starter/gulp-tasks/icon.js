const { src, dest, lastRun } = require('gulp');
const iconfont = require('gulp-iconfont');
const consolidate = require('gulp-consolidate');

/* Configuration */
const { ICON, PATH } = require('./config.json');

const customFontConfig = {
  fontName: 'customfont',
  formats: ['ttf', 'eot', 'woff', 'woff2'],
  appendCodepoints: true,
  appendUnicode: false,
  normalize: true,
  fontHeight: 1000,
  centerHorizontally: true,
};

/* ICONS */
function icon() {
  return src(PATH.src + ICON.src, { since: lastRun(icon), allowEmpty: true })
    .pipe(iconfont(customFontConfig))
    .on('glyphs', function (glyphs, options) {
      src(PATH.src + ICON.templates + 'customFont.css')
        .pipe(
          consolidate('underscore', {
            glyphs: glyphs,
            fontName: options.fontName,
            fontDate: new Date().getTime(),
          }),
        )
        .pipe(dest(PATH.dest + ICON.dest));

      src(PATH.src + ICON.templates + 'customFont.html')
        .pipe(
          consolidate('underscore', {
            glyphs: glyphs,
            fontName: options.fontName,
          }),
        )
        .pipe(dest(PATH.dest + ICON.dest));
    })
    .pipe(dest(PATH.dest + ICON.dest));
}

module.exports = icon;
