/**
 * GULP 4 KIT
 * 
 * Just to learn about :)
 */
const config = require( './gulp.config.js' );

const argv = require('yargs').argv;
const beeper = require('beeper');

const gulp = require('gulp');
const notify = require('gulp-notify');

function javascript(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  if (argv.production) {
    gulp.src( config.styleSource )
      .pipe( notify('CSS only production in ' + config.styleDestination) );
    
    beeper()
  } else {
    gulp.src( config.styleSource )
      .pipe( notify('CSS only DEV from ' + config.styleSource) );
  }
  cb();
}

function minify(cb) {
  // body omitted
  cb();
}


// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
function clean(cb) {
  // body omitted
  cb();
  console.log('Hello I am cleaning!')
  beeper();
}

// The `build` function is exported so it is public and can be run with the `gulp` command.
// It can also be used within the `series()` composition.
function build(cb) {
  // body omitted
  cb();
  console.log('Hello I am building!')
}

exports.javascript = javascript;
exports.css = css;
exports.build = gulp.parallel(javascript, css);
exports.default = gulp.series(clean, build);

if (argv.production) {
  exports.build = gulp.series(javascript, minify);
} else {
  exports.build = gulp.series(clean, build);
}