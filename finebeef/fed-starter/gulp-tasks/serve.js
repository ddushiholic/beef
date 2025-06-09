const browserSync = require('browser-sync');

/* Configuration */
const { SERVER } = require('./config.json');

// Browser Reload
function browserReload(done) {
  browserSync.reload();
  // browserSync.reload({ stream: true });
  done();
}

// Browsersync options
const syncOpts = {
  static: {
    server: {
      baseDir: SERVER.base,
      // serveStatic: PATH.dest,
    },
    port: SERVER.port,
    directory: false,
    open: true,
    notify: false,
  },
  proxy: {
    proxy: SERVER.proxyServer,
    files: SERVER.watchFiles,
    open: false,
    directory: true,
    notify: false,
    // ghostMode   : false,
    ui: {
      port: SERVER.port,
    },
  },
};

/* Serve */
const serve = (done) => {
  if (!SERVER.proxy) {
    browserSync.init(syncOpts.static);
  } else {
    browserSync.init(syncOpts.proxy);
  }
  done();
};

module.exports = {
  serve,
  browserReload,
};
