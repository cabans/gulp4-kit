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
const autoprefixer = require('autoprefixer');
const server = require('browser-sync').create();

const $ = gulpLoadPlugins();

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

	// If is development
	if (!isProd) {

		return src(config.styles.src)
			.pipe($.plumber(errorHandler))
			.pipe($.sourcemaps.init())
			.pipe($.sass.sync({
				outputStyle: 'compact', // Options → 'compact', 'compressed', 'nested'* or 'expanded'
				precision: 6,
				includePaths: ['.']
			}))
			// Why postcss? https://stackoverflow.com/a/42317592
			.pipe($.postcss([autoprefixer(config.browserList)]))
			.pipe($.sourcemaps.write('.'))
			.pipe(dest(config.styles.dest))
			.pipe(server.reload({ stream: true }));

	} else {

		// If is production
		del([config.styles.dest + '/*.map']); // removes local map files

		return src(config.styles.src)
			.pipe($.plumber(errorHandler))
			.pipe($.sass.sync({
				precision: 6,
				includePaths: ['.']
			}))
			.pipe($.postcss([autoprefixer(config.browserList)]))
			.pipe($.cleanCss({
				level: {
					1: {
						semicolonAfterLastProperty: true
					},
					2: {
						// mergeNonAdjacentRules: true,
						mergeAdjacentRules: true,
						mergeMedia: true, // controls `@media` merging; defaults to true
					}
				}
			})
			)
			.pipe(dest(config.styles.dest));

	} // end if
};



/**
 * SCRIPTS
 *
 * @return  {[type]}  [return description]
 */
function scripts() {
	// If is development
	if (!isProd) {
		return src(config.scripts.src)
			.pipe( $.plumber(errorHandler) )
			.pipe( $.sourcemaps.init() )
			.pipe($.babel({ presets: ['@babel/env'] }))
			.pipe( $.concat('main.js') )
			.pipe( $.sourcemaps.write('.') )
			.pipe(dest(config.scripts.dest))
			.pipe(server.reload({ stream: true }));
	} else {
		// If is production
		del([config.scripts.dest + '/*.map']); // removes local map files

		return src(config.scripts.src)
			.pipe( $.plumber(errorHandler) )
			.pipe($.babel({ presets: ['@babel/env'] }))
			// Removes every console.log, console.info, ...
			.pipe( $.uglify({ compress: { drop_console: true } }).on('error', console.error) )
			.pipe($.concat('main.js'))
			.pipe(dest(config.scripts.dest));
	}
};




// Clean dist folder
function clean() {
	return del([config.folder.build]);
}




// Templates generation
function templates() {
	return src(config.templates.src)
		.pipe(dest(config.templates.dest));
};




// Extra file movements
function extra() {
	return src(config.extra, {
		base: config.folder.source
	}).pipe(dest(config.folder.assets));
};


// Gets build folder size
function measureSize() {
	return src(config.folder.build + '/**/*')
		.pipe($.size({ title: '📁  BUILD size with', gzip: true }));
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
const build = series(clean, parallel(styles, scripts, templates, extra));
const serve = series(clean, series(parallel(styles, scripts, templates, extra), startServer));




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