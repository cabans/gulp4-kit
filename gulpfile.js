/**
 * GULP 4 KIT
 *
 * Just to learn about :)
 */
const config = require( './gulp.config.js' );

const argv = require('yargs').argv;
const beeper = require('beeper');

const gulp       = require('gulp');
const notify     = require('gulp-notify');
const sass       = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const plumber    = require('gulp-plumber');
const mergemq    = require('gulp-merge-media-queries');
const cleanCSS   = require('gulp-clean-css'); // https://github.com/jakubpawlowicz/clean-css




/**
 * ERROR HANDLER
 *
 * @param {string} err
 */
function errorHandler(err) {
	notify.onError( '\n\n⚠️  ERROR → <%= error.message %>\n' )( err );
};



/**
 * STYLES
 *
 * @param {callback} cb
 */
 function styles(cb) {

	// DEVEVLOPER MODE
	if (!argv.prod) {
		gulp.src(config.styleSource)
			.pipe( plumber( errorHandler ) )
			.pipe( sourcemaps.init() )
			.pipe( sass({ outputStyle: config.outputStyle }) )
			.pipe( notify({ title: "STYLES", message: '→ CSS for DEVELOPMENT 💡' }) )
			.pipe( sourcemaps.write('./') )
			.pipe( gulp.dest( config.styleDestination ) );

	} else {
		gulp.src(config.styleSource)
			.pipe( plumber( errorHandler ) )
			.pipe( sass({ outputStyle: 'compact' }) )
			.pipe( notify({ title: "STYLES", message: '→ CSS for PRODUCTION ✅'}) )
			.pipe( mergemq({ log: true }) ) // Merge duplicated media queries with same size
			.pipe( cleanCSS() ) // Clean and minimify CSS
			.pipe( gulp.dest( config.styleDestination ) );
	}
	cb();
}



function javascript(cb) {
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
exports.css = styles;
exports.build = gulp.series(javascript, styles);
exports.default = gulp.parallel(javascript, styles);

// Testing
if (argv.prod) {
  exports.build = gulp.series(javascript, styles);
} else {
  exports.build = gulp.series(clean, build);
}