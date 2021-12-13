/**
 * GULP Configuration file
 *
 */

module.exports = {

	// Main folders
	folder: {
		source: './_source',
		build: './build',
		assets: './build/assets'
	},

	// Server options
	server: {
		port: 3000,
		proxy: 'localhost/gulp4/build',
		host: 'localhost',
		open: false,
		startPath: 'index.html',
		baseDir: 'build'
	},

	// Extra watchers
	watch: {
        "scripts": [
            "_source/scripts/**/*.js"
        ],
        "styles": [
            "_source/styles/**/*.{scss,sass,css}"
        ],
        "extra": [
            "_source/fonts/**/*",
            "_source/images/**/*"
        ],
        "templates": [
            "_source/templates/**/*.njk"
        ]
	},

	// Styles options
	styles: {
		src: './_source/styles/*.{scss,sass,css}',
		dest: './build/assets/css',
	},

	// Scripts options
	scripts: {
		src: [
			'./_source/scripts/partials/**/*.js',
			'./_source/scripts/app.js'
		],
		dest: './build/assets/js',
	},

	browserList: {
		grid: true,
		browswers:[
			"> 1%",
			"last 2 versions",
			"ie >= 11",
			"Firefox ESR"
		]
	},



	// Templating options
	templates: {
		base: '_source/templates/',
        src: [
                '_source/templates/*.njk',
                '_source/templates/category-1/*.njk'
            ],
		dest: 'build'
	},

	// Extra moving moving
    extra: [
		"./_source/fonts/**/*.{eot,svg,ttf,woff,woff2}",
		"./_source/images/**/*.{jpg,svg,png,jpeg,gif}"
    ]
}