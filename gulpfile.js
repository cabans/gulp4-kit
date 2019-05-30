/**
 * GULP 4 KIT
 *
 * Just to learn about :)
 */
const config = require('./gulpconfig.js');

const { src, dest, watch, series, parallel, lastRun } = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');

const browserSync = require('browser-sync');
const beeper = require('beeper');
const del = require('del');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const { argv } = require('yargs');

const $ = gulpLoadPlugins();
const server = browserSync.create();

// Is production
const isProd = process.env.NODE_ENV === 'production';



/**
 * ERROR HANDLER
 *
 * @param {string} err
 */
function errorHandler(err) {
	$.notify.onError('\n\n⚠️  ERROR → <%= error.message %>\n')(err);
	beeper();
};



/**
 * STYLES
 *
 * @param {callback} cb
 */
function styles() {
	return src(config.styles.src)
	.pipe( $.plumber( errorHandler ) )
	.pipe( $.if(!isProd, $.sourcemaps.init()) )
	.pipe( $.sass.sync( {
		outputStyle: config.styles.outputStyle,
		precision: 10,
		includePaths: ['.']
	}).on('error', $.sass.logError))
	.pipe( $.if(!isProd, $.sourcemaps.write()) )
	.pipe( dest(config.styles.dest) )
	.pipe( server.reload({ stream: true }) );
};



// Clean dist folder
function clean() {
	return del([config.folder.build]);
}



// Templates generation
function template() {
	return src(config.template.src)
		.pipe( dest(config.template.dest) );
};



// Extra file movements
function extra() {
	return src(config.extra, {
		base: config.folder.source
	}).pipe( dest(config.folder.assets) );
};


// Gets build folder size
function measureSize() {
	return src( config.folder.build + '/**/*' )
		.pipe( $.size({ title: '📁  BUILD size with', gzip: true }) );
}


// Main tasks
const build = series( clean, template, parallel(extra, styles) );
const serve = series( clean, template, parallel(extra, styles) );



// Exports
exports.template = template;
exports.clean = clean;
exports.size = measureSize;

// Main tasks export
exports.serve = serve;
exports.build = build;
exports.default = build;