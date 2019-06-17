/**
 * GULP 4 KIT
 *
 * Just to learn about :)
 */
'use strict';

const config = require('./gulpconfig.js');

const { src, dest, watch, series, parallel, lastRun } = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');

const beeper = require('beeper');
const del = require('del');

// const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');

const { argv } = require('yargs');

const $ = gulpLoadPlugins();
const server = require('browser-sync').create();

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
 */
function styles() {
	return src(config.styles.src)
	.pipe( $.plumber( errorHandler ) )
	.pipe( $.if(!isProd, $.sourcemaps.init()) )
	.pipe( $.sass.sync( {
		outputStyle: 'expanded', // Options → 'compact', 'compressed', 'nested'* or 'expanded'
		precision: 6,
		includePaths: ['.']
	}))
	.pipe( $.if(isProd, $.postcss([
			autoprefixer(config.browserList),
			csso({comments: false, restructure: false, forceMediaMerge: true})
		])),
		del([config.styles.dest + '/*.map']) // Removes every map file
	)
	.pipe( $.if(!isProd, $.sourcemaps.write('.')) )
	.pipe( dest(config.styles.dest) )
	.pipe( server.reload({stream:true}) );
};



/**
 * SCRIPTS
 *
 * @return  {[type]}  [return description]
 */
function scripts() {
	return src(config.scripts.src)
	.pipe( $.plumber( errorHandler ) )
	.pipe( $.if(!isProd, $.sourcemaps.init()) )
	.pipe( $.babel({
		presets: ['@babel/env']
	}))
	.pipe( $.if( isProd,
		$.uglify( {
			compress: {drop_console: true}} // Remove evey console.*
		).on('error', console.error) ),
		del([config.scripts.dest + '/*.map']) // Removes every map file
	)
	.pipe( $.concat('main.js') )
	.pipe( $.if( !isProd, $.sourcemaps.write('.') ))
	.pipe( dest(config.scripts.dest) )
	.pipe( server.reload({stream: true}) );
};




// Clean dist folder
function clean() {
	return del([config.folder.build]);
}




// Templates generation
function templates() {
	return src(config.templates.src)
		.pipe( dest(config.templates.dest) );
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




function startServer(done) {
	server.init({
		server: {
			baseDir: config.server.baseDir
		},
		notify: false,
		port: config.server.port,

		startPath: config.server.startPath,
		open: config.server.open
	});

	watch(config.watch.styles, styles);
	watch(config.watch.scripts, scripts);

	watch(config.watch.templates).on('change', server.reload); // Non static kit
	watch(config.watch.extra).on('change', server.reload);
}




// Main tasks
const build = series( clean, parallel(styles, scripts, templates, extra) );
const serve = series( clean, series( parallel(styles, scripts, templates, extra), startServer) );




// Exports
exports.templates = templates;
exports.styles = styles;
exports.scripts = scripts;
exports.clean = clean;
exports.size = measureSize;

// Main tasks export
exports.serve = serve;
exports.build = build;
exports.default = build;