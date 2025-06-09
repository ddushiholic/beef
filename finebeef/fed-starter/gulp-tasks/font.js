const { src, dest } = require('gulp');

/* Configuration */
const { FONT, PATH } = require('./config.json');

/* ASSETS - json and fonts */
function font() {
  return src(PATH.src + FONT.src).pipe(dest(PATH.dest + FONT.dest)); // fonts (*.{eot,otf,svg,ttf,woff,woff2})
}

module.exports = font;
